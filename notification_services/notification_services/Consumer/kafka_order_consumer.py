from aiokafka import AIOKafkaConsumer
import logging
import asyncio
from aiokafka.errors import KafkaConnectionError
from ..email_services import send_email
from .. import setting
import json
import os
import httpx

logging.basicConfig(level=logging.INFO)

CONTACT_RECIPIENT_EMAIL = "hasaanqurashi150@gmail.com"


async def get_seller_and_admin_emails(seller_id: int):
    seller_email = None
    admin_emails = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Get access token from user_services
            token_resp = await client.get(
                "http://user_services:8000/get_access_token",
                params={"email": "system-notifications@takhleeq.com", "role": "admin"}
            )
            if token_resp.status_code == 200:
                token = token_resp.json().get("access_token")
                headers = {"Authorization": f"Bearer {token}"}
                
                # 2. Get seller email
                if seller_id:
                    try:
                        seller_resp = await client.get(
                            f"http://user_services:8000/user/{seller_id}",
                            headers=headers
                        )
                        if seller_resp.status_code == 200:
                            seller_email = seller_resp.json().get("email")
                    except Exception as e:
                        logging.error(f"Failed to fetch seller details for ID {seller_id}: {e}")
                
                # 3. Get admin emails
                try:
                    users_resp = await client.get(
                        "http://user_services:8000/user/all",
                        headers=headers
                    )
                    if users_resp.status_code == 200:
                        users = users_resp.json()
                        admin_emails = [u.get("email") for u in users if u.get("role") == "admin"]
                except Exception as e:
                    logging.error(f"Failed to fetch admin details: {e}")
    except Exception as e:
        logging.error(f"Failed to query user services: {e}")
        
    return seller_email, admin_emails


async def kafka_order_Created_consumer() -> AIOKafkaConsumer:

    consumer = AIOKafkaConsumer(
        setting.KAFKA_ORDER_CREATED_TOPIC,
        bootstrap_servers=setting.KAFKA_BOOTSTRAP_SERVER,
        group_id=setting.KAFKA_CONSUMER_GROUP_ID_FOR_NOTIFICATION_SERVICE,
        auto_offset_reset="earliest",
    )

    while True:
        try:
            await consumer.start()
            logging.info("Consumer Started...")
            break
        except KafkaConnectionError as e:
            logging.error(f"Consumer starting failed: {e}. Retry in 5 sec...")
            await asyncio.sleep(5)

    try:
        async for msg in consumer:
            event = json.loads(msg.value.decode("utf-8"))
            print(type(event))
            print(f"Event Received: {event}")
            if event["event_type"] == "Order_Created":
                user_data = event.get("order", {})
                user_email = user_data.get("user_email")
                order_id = user_data.get("order_id")
                product_id = user_data.get("product_id")
                total_amount = user_data.get("total_amount", 0)
                product_price = user_data.get("product_price", 0)
                product_quantity = user_data.get("product_quantity", 1)
                seller_id = user_data.get("seller_id", 0)
                custom_product_image = user_data.get("custom_product_image")
                
                if not user_email:
                    logging.warning("Email not found in event. Skipping...")
                    continue
                
                # Calculate tax charges (8%)
                tax = total_amount * 0.08
                total_with_tax = total_amount + tax
                
                # 1. Send Order Confirmation to Buyer
                subject = f"Order Confirmation - Order #{order_id}"
                body = f"""Dear Customer,

Your Order Has Been Created Successfully!

Order Details:
- Order ID: {order_id}
- Product ID: {product_id}
- Product Price: ${product_price:.2f}
- Quantity: {product_quantity}
- Subtotal: ${total_amount:.2f}
- Tax (8%): ${tax:.2f}
- Total Amount (with Tax): ${total_with_tax:.2f}
                    
Thank you for choosing Takhleeq. We appreciate your trust in us.
                    
Best regards,
Takhleeq Team
"""
                try:
                    await send_email(
                        user_email=user_email,
                        subject=subject,
                        body=body,
                        custom_product_image=custom_product_image
                    )
                    logging.info(f"Order Confirmation email sent to {user_email}")
                except Exception as email_error:
                    logging.error(
                        f"Failed to send order confirmation email to {user_email}: {email_error}"
                    )
                
                # Retrieve seller & admin emails
                seller_email, admin_emails = await get_seller_and_admin_emails(seller_id)
                
                # 2. Send New Order Alert to Seller
                if seller_email:
                    seller_subject = f"New Order Received - Order #{order_id}"
                    seller_body = f"""Dear Partner,

You have received a new order for your product!

Order Details:
- Order ID: {order_id}
- Product ID: {product_id}
- Product Price: ${product_price:.2f}
- Quantity: {product_quantity}
- Subtotal: ${total_amount:.2f}
- Tax (8%): ${tax:.2f}
- Total Amount (with Tax): ${total_with_tax:.2f}
- Buyer Email: {user_email}
                    
Please visit your Seller Dashboard to manage and fulfill this order.
                    
Best regards,
Takhleeq Team
"""
                    try:
                        await send_email(
                            user_email=seller_email,
                            subject=seller_subject,
                            body=seller_body,
                            custom_product_image=custom_product_image
                        )
                        logging.info(f"New Order email sent to seller {seller_email}")
                    except Exception as email_error:
                        logging.error(f"Failed to send new order email to seller {seller_email}: {email_error}")
                
                # 3. Send New Order Alert to Admins
                recipient_admins = admin_emails if admin_emails else [CONTACT_RECIPIENT_EMAIL]
                for admin_email in recipient_admins:
                    admin_subject = f"Admin Alert: New Order Placed - Order #{order_id}"
                    admin_body = f"""Dear Admin,

A new order has been placed on the Takhleeq platform.

Order Details:
- Order ID: {order_id}
- Product ID: {product_id}
- Product Price: ${product_price:.2f}
- Quantity: {product_quantity}
- Subtotal: ${total_amount:.2f}
- Tax (8%): ${tax:.2f}
- Total Amount (with Tax): ${total_with_tax:.2f}
- Buyer Email: {user_email}
- Seller ID: {seller_id}
                    
Please visit the Admin Dashboard to review this order.
                    
Best regards,
Takhleeq Team
"""
                    try:
                        await send_email(
                            user_email=admin_email,
                            subject=admin_subject,
                            body=admin_body,
                            custom_product_image=custom_product_image
                        )
                        logging.info(f"New Order admin alert sent to {admin_email}")
                    except Exception as email_error:
                        logging.error(f"Failed to send new order admin alert to {admin_email}: {email_error}")

            elif event["event_type"] == "Order_Deleted":
                user_data = event.get("order", {})
                user_email = user_data.get("user_email")
                order_id = user_data.get("order_id")
                product_id = user_data.get("product_id")
                custom_product_image = user_data.get("custom_product_image")
                
                if not user_email:
                    logging.warning("Email not found in event. Skipping...")
                    continue
                
                subject = "Order Cancellation"
                body = f"""Your Order Has Been Cancelled Successfully!

Order Details:

- Order ID: {order_id}
- Product ID: {product_id}


Thank you for choosing Takhleeq. We appreciate your trust in us.

Best regards,
Takhleeq Team
"""
                try:
                    await send_email(
                        user_email=user_email,
                        subject=subject,
                        body=body,
                        custom_product_image=custom_product_image
                    )
                    logging.info(f"Order Cancellation email sent to {user_email}")
                except Exception as email_error:
                    logging.error(
                        f"Failed to send order cancellation email to {user_email}: {email_error}"
                    )
    except json.JSONDecodeError as decode_error:
        logging.error(f"Failed to decode message: {msg.value}. Error: {decode_error}")

    except KeyError as key_error:
        logging.error(f"Missing key in event: {key_error}")
    finally:
        await consumer.stop()
        logging.info("Consumer Stopped...")
