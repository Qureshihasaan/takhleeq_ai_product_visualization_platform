from contextlib import asynccontextmanager
from typing import AsyncGenerator , Annotated  
from .database import create_db_and_tables ,engine , Order  , OrderResponse , get_db 
from sqlmodel import Session  , select
from aiokafka import AIOKafkaProducer
from .consumer import consume_messages
# from .consumer_for_inventory import inventory_cosnumer
from .producer import kafka_producer
import json , asyncio, httpx
# from .authenticate import verify_token     
# from fastapi.security import OAuth2PasswordRequestForm
from . import setting
from fastapi import FastAPI , HTTPException , Depends ,status
from .authenticate import verify_token, oauth2_scheme, validate_role
# from .utils import authenticate_user , Token
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm , OAuth2PasswordBearer


@asynccontextmanager 
async def lifespan(app : FastAPI)->AsyncGenerator[None,None]:
    print("Creating Tables...")
    task = asyncio.create_task(consume_messages())
    create_db_and_tables()
    yield

app : FastAPI = FastAPI(lifespan=lifespan , version="1.0.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# @app.post("/login" , response_model=create_user)
# async def login_user(login:Annotated[OAuth2PasswordRequestForm,Depends(OAuth2PasswordRequestForm)]):
#     create_user = User(
#         username = login.username,
#         # user_email = login.,
#         hashed_password = login.password
#     )
    


@app.post("/create_order" , response_model=OrderResponse)
async def create_order(order : Order , producer : Annotated[AIOKafkaProducer, Depends(kafka_producer)],
                       session : Annotated[Session, Depends(get_db)],
                        token_data : dict = Depends(validate_role(["buyer"])),
                        token: str = Depends(oauth2_scheme),
                       ):
    user_id = token_data.get("id")
    order.user_id = user_id
   
    statement = select(Order).where(Order.order_id == order.order_id)
    existing_order = session.exec(statement).first()
    # existing_order = session.query(Order).filter_by(id=order.order_id).first()
    if existing_order:
        raise HTTPException(status_code=400, detail="Order already exists")
    
    # Check Inventory
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": f"Bearer {token}"}
            response = await client.get(f"http://inventory_services:8000/check_inventory/{order.product_id}/{order.product_quantity}", headers=headers)
            response.raise_for_status()
            data = response.json()
            if not data.get("available"):
                raise HTTPException(status_code=400, detail="Out of Stock")
        except httpx.RequestError as e:
            print(f"Inventory Service Connection Error: {e}")
            raise HTTPException(status_code=503, detail=f"Inventory Service Unavailable: {e}")
            
    # Resolve product seller_id from product service
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": f"Bearer {token}"}
            prod_response = await client.get(f"http://product_services:8000/product/{order.product_id}", headers=headers)
            prod_response.raise_for_status()
            product_data = prod_response.json()
            order.seller_id = product_data.get("seller_id", 0)
        except Exception as e:
            print(f"Failed to fetch product details to get seller_id: {e}")
            order.seller_id = 0

    order_dict = {field : getattr(order, field) for field in order.dict()}
    order_json = json.dumps(order_dict).encode('utf-8')
    print("order_json", order_json)
    session.add(order)
    session.commit()
    session.refresh(order)
    try:
        event_order = order.dict()
        event = {"event_type" : "Order_Created" , "order" : event_order}
        await producer.send_and_wait(setting.KAFKA_ORDER_TOPIC, json.dumps(event).encode('utf-8'))
        print("Order Details Send to kafka topic....")
    except Exception as e:
        print(f"Error Sending to Kafka {e}")
        session.rollback()
        raise HTTPException(status_code=500, detail="Error Sending order to kafka..")
    return order

@app.put("/update_order/{order_id}")
async def update_order(order_id : int , update_order : Order , producer : Annotated[AIOKafkaProducer, Depends(kafka_producer)],
                       session : Annotated[Session, Depends(get_db)],
                       token_data: dict = Depends(validate_role(["seller", "admin"])),
                       ):
    db_order = session.get(Order , order_id)
    if not db_order:
        raise HTTPException(status_code=404 , detail=f"Order With this {order_id} not found")

    # Enforce ownership check for sellers
    if token_data.get("role") == "seller" and db_order.seller_id != token_data.get("id"):
        raise HTTPException(status_code=403, detail="Role 'seller' is not authorized to edit this order")

    update_data = update_order.dict(exclude_unset=True)
    # Prevent updating user_id or seller_id
    if "user_id" in update_data:
        del update_data["user_id"]
    if "seller_id" in update_data:
        del update_data["seller_id"]

    for field, value in update_data.items():
        if field != "order_id":
            setattr(db_order, field, value)
    order_dict = {fields : getattr(db_order ,fields) for fields in db_order.dict()}
    order_json = json.dumps(order_dict).encode('utf-8')
    print("order_json" , order_json)
    session.commit()
    session.refresh(db_order)
    try:    
        event_order = db_order.dict()
        event = {"event_type" : "Order_Updated" , "order" : event_order}
        await producer.send_and_wait(setting.KAFKA_ORDER_TOPIC, json.dumps(event).encode('utf-8'))
        print("Updated Order Details Send to kafka topic....")
    except Exception as e:
        print(f"Error Sending to Kafka {e}")
    return db_order


@app.get("/get_order")
def get_order(db: Annotated[Session,Depends(get_db)],
              token_data : dict = Depends(verify_token)
              ):
    role = token_data.get("role")
    user_id = token_data.get("id")

    if role == "admin":
        return db.exec(select(Order)).all()
    elif role == "seller":
        return db.exec(select(Order).where(Order.seller_id == user_id)).all()
    else:
        return db.exec(select(Order).where(Order.user_id == user_id)).all()


@app.get("/get_single_order")
def get_single_order(order_id : int , db : Annotated[Session , Depends(get_db)],
                     token_data: dict = Depends(verify_token)):
    order = db.get(Order , order_id)
    if not order:
        raise HTTPException(status_code=404 , detail="order not found")

    # Access control: buyer must own it, seller must own it, admin can see all
    role = token_data.get("role")
    user_id = token_data.get("id")
    if role == "seller" and order.seller_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    elif role == "buyer" and order.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    return order


@app.delete("/delete_order")
async def delete_order(order_id : int , session : Annotated[Session , Depends(get_db)] ,
                 producer : Annotated[AIOKafkaProducer , Depends(kafka_producer)],
                 token_data: dict = Depends(validate_role(["admin", "seller"])),
                 ):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="order not found")

    if token_data.get("role") == "seller" and order.seller_id != token_data.get("id"):
        raise HTTPException(status_code=403, detail="Role 'seller' is not authorized to delete this order")

    order_dict = {fields : getattr(order , fields) for fields in order.dict()}
    order_json = json.dumps(order_dict).encode("utf-8")
    print("Order_json" , order_json)
    session.delete(order)
    session.commit()
    try:
        event_order = order.dict()
        event = {"event_type" : "Order_Deleted" , "order" : event_order}
        await producer.send_and_wait(setting.KAFKA_ORDER_TOPIC, json.dumps(event).encode('utf-8'))
        print("Order Details Send to kafka topic....")
    except Exception as e:
        print(f"Error Sending to Kafka {e}")
    return {"message" : "order deleted successfully"}









