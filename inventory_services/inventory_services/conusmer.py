import asyncio
import json
import logging

from aiokafka import AIOKafkaConsumer
from aiokafka.errors import KafkaConnectionError
from sqlmodel import Session

from . import setting
from .database import engine
from .model import Inventory_update, Stock_update

loop = asyncio.get_event_loop()
logging.basicConfig(level=logging.INFO)


async def consume_product_events():
    consumer = AIOKafkaConsumer(
        setting.KAFKA_PRODUCT_TOPIC,
        bootstrap_servers=str(setting.KAFKA_BOOTSTRAP_SERVER),
        group_id=setting.KAFKA_CONSUMER_GROUP_ID_FOR_INVENTORY,
        auto_offset_reset="earliest",
    )

    await consumer.start()
    print("Consumer started...")

    ### Running
    try:
        async for msg in consumer:
            try:
                event = json.loads(msg.value)
                print(type(event))
                print("Event received:", event)
                if event["event_type"] == "Product_Created":
                    product = event["product"]
                    add_inventory(
                        product["product_id"],
                        product.get("Product_name") or product.get("product_name"),
                        product.get("product_quantity", 0),
                    )
                    print("Product added to inventory..")

                elif event["event_type"] == "Product_Updated":
                    product = event["product"]
                    update_inventory(
                        product["product_id"],
                        product.get("Product_name") or product.get("product_name"),
                        product.get("product_quantity", 0),
                    )
                    print("Inventory Updated for product...")

                elif event["event_type"] == "Product_Deleted":
                    product = event["product"]
                    delete_inventory(product["product_id"])
                    print("Product deleted from inventory...")

            except Exception as e:
                logging.error(f"Error processing message: {e}")
                continue
    finally:
        await consumer.stop()


def add_inventory(product_id, product_name, product_quantity):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                inventory_item.product_name = product_name
                inventory_item.product_quantity = product_quantity
                print(f"Product {product_id} already exists, updated instead...")
            else:
                inventory_item = Stock_update(
                    product_id=product_id,
                    product_name=product_name,
                    product_quantity=product_quantity,
                )
                session.add(inventory_item)
                print("Product Added to Inventory...")
                session.commit()
                print("Inventory updated successfully...")
    except Exception as e:
        logging.error(f"Error adding inventory: {e}")


def update_inventory(product_id, product_name, product_quantity):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                # inventory_item = Stock_update(product_id=product_id, product_quantity=product_quantity)
                inventory_item.product_name = product_name
                inventory_item.product_quantity = product_quantity
                session.commit()
                print("Product Updated in Inventory...")
            else:
                print(f"Product {product_id} not found in inventory, cannot update.")

    except Exception as e:
        logging.error(f"Error updating inventory: {e}")

        # session.add(inventory_item)
        # session.refresh(inventory_item)

        # inventory_item = session.query(Stock_update).filter(Stock_update.product_id == product_id).first()
        # if inventory_item:
        #     inventory_item = Stock_update(product_id=product_id, product_name=product_name, product_quantity=product_quantity)
        #     session.commit()
        #     print("Product Updated in Inventory...")


def delete_inventory(product_id):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                session.delete(inventory_item)
                session.commit()
                print("Product Deleted from Inventory...")
            else:
                print(f"Product {product_id} not found in inventory, cannot delete.")
    except Exception as e:
        logging.error(f"Error deleting inventory: {e}")


async def consume_order_events():
    consumer = AIOKafkaConsumer(
        setting.KAFKA_ORDER_TOPIC,
        bootstrap_servers=str(setting.KAFKA_BOOTSTRAP_SERVER),
        group_id=setting.KAFKA_CONSUMER_GROUP_ID_FOR_INVENTORY,
        auto_offset_reset="earliest",
    )

    await consumer.start()
    print("Order Consumer started...")

    try:
        async for msg in consumer:
            try:
                event = json.loads(msg.value.decode("utf-8"))
                print("Event received:", event)
                if event["event_type"] == "Order_Created":
                    order = event["order"]
                    decrease_inventory(order["product_id"], order["product_quantity"])
                    print("Inventory Updated (Decreased) for product...")
            except Exception as e:
                logging.error(f"Error processing order message: {e}")
                continue
    finally:
        await consumer.stop()


def decrease_inventory(product_id, quantity):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                inventory_item.product_quantity -= quantity
                session.commit()
                print(f"Inventory decreased for product {product_id} by {quantity}")
            else:
                print(f"Product {product_id} not found in inventory, cannot decrease.")
    except Exception as e:
        logging.error(f"Error decreasing inventory: {e}")


def add_inventory(product_id, product_name, product_quantity):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                inventory_item.product_name = product_name
                inventory_item.product_quantity = product_quantity
                print(f"Product {product_id} already exists, updated instead...")
            else:
                inventory_item = Stock_update(
                    product_id=product_id,
                    product_name=product_name,
                    product_quantity=product_quantity,
                )
                session.add(inventory_item)
                print("Product Added to Inventory...")
                session.commit()
                print("Inventory updated successfully...")
    except Exception as e:
        logging.error(f"Error adding inventory: {e}")


def update_inventory(product_id, product_name, product_quantity):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                # inventory_item = Stock_update(product_id=product_id, product_quantity=product_quantity)
                inventory_item.product_name = product_name
                inventory_item.product_quantity = product_quantity
                session.commit()
                print("Product Updated in Inventory...")
            else:
                print(f"Product {product_id} not found in inventory, cannot update.")

    except Exception as e:
        logging.error(f"Error updating inventory: {e}")

        # session.add(inventory_item)
        # session.refresh(inventory_item)

        # inventory_item = session.query(Stock_update).filter(Stock_update.product_id == product_id).first()
        # if inventory_item:
        #     inventory_item = Stock_update(product_id=product_id, product_name=product_name, product_quantity=product_quantity)
        #     session.commit()
        #     print("Product Updated in Inventory...")


def delete_inventory(product_id):
    try:
        with Session(engine) as session:
            inventory_item = (
                session.query(Stock_update)
                .filter(Stock_update.product_id == product_id)
                .first()
            )
            if inventory_item:
                session.delete(inventory_item)
                session.commit()
                print("Product Deleted from Inventory...")
            else:
                print(f"Product {product_id} not found in inventory, cannot delete.")
    except Exception as e:
        logging.error(f"Error deleting inventory: {e}")
