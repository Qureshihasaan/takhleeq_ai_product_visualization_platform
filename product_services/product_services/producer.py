import logging
from typing import AsyncGenerator

from aiokafka import AIOKafkaProducer

from . import setting

logger = logging.getLogger(__name__)


async def kafka_producer() -> AsyncGenerator[AIOKafkaProducer, None]:
    """
    FastAPI dependency that yields a started AIOKafkaProducer.

    - Starts the producer before yielding it
    - Ensures the producer is stopped when the dependency scope ends
    - Logs startup/shutdown and any errors
    """
    producer = AIOKafkaProducer(bootstrap_servers=str(setting.KAFKA_BOOTSTRAP_SERVER))

    try:
        await producer.start()
        logger.info(
            "Kafka producer started (bootstrap_servers=%s)",
            setting.KAFKA_BOOTSTRAP_SERVER,
        )
    except Exception as start_exc:
        logger.exception("Failed to start Kafka producer: %s", start_exc)
        raise

    try:
        yield producer
    finally:
        try:
            await producer.stop()
            logger.info("Kafka producer stopped")
        except Exception as stop_exc:
            logger.exception("Error stopping Kafka producer: %s", stop_exc)
