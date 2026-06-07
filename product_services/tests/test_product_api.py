from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool

from product_services.database import Product
from product_services.main import app, get_session


def test_product_health_endpoint():
    @asynccontextmanager
    async def no_lifespan(_app):
        yield

    app.router.lifespan_context = no_lifespan
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


def test_get_products_returns_records():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        session.add(
            Product(
                Product_name="Test Hoodie",
                Product_details="Warm fleece",
                product_quantity=4,
                price=2500.0,
                category="hoodie",
            )
        )
        session.commit()

    def override_get_session():
        with Session(engine) as session:
            yield session

    @asynccontextmanager
    async def no_lifespan(_app):
        yield

    app.router.lifespan_context = no_lifespan
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as client:
        response = client.get("/product/")
        assert response.status_code == 200
        payload = response.json()
        assert len(payload) == 1
        assert payload[0]["Product_name"] == "Test Hoodie"
    app.dependency_overrides.clear()


def test_get_product_image_not_found():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def override_get_session():
        with Session(engine) as session:
            yield session

    @asynccontextmanager
    async def no_lifespan(_app):
        yield

    app.router.lifespan_context = no_lifespan
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as client:
        response = client.get("/product/999/image")
        assert response.status_code == 404
    app.dependency_overrides.clear()


def test_create_multiple_products_with_zero_id():
    from product_services.authenticate import verify_token
    from product_services.producer import kafka_producer

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def override_get_session():
        with Session(engine) as session:
            yield session

    class MockProducer:
        async def send_and_wait(self, topic, message):
            pass

    async def override_kafka_producer():
        yield MockProducer()

    def override_verify_token():
        return {"id": 3, "role": "seller", "email": "seller@example.com"}

    @asynccontextmanager
    async def no_lifespan(_app):
        yield

    app.router.lifespan_context = no_lifespan
    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[kafka_producer] = override_kafka_producer
    app.dependency_overrides[verify_token] = override_verify_token

    with TestClient(app) as client:
        # Create first product
        response1 = client.post(
            "/product",
            data={
                "Product_id": 0,
                "Product_name": "Product 1",
                "Product_details": "Details 1",
                "product_quantity": 10,
                "price": 1500.0,
                "category": "T-shirts",
            }
        )
        assert response1.status_code == 200
        product1 = response1.json()
        assert product1["Product_name"] == "Product 1"
        assert product1["product_id"] != 0

        # Create second product with Product_id = 0
        response2 = client.post(
            "/product",
            data={
                "Product_id": 0,
                "Product_name": "Product 2",
                "Product_details": "Details 2",
                "product_quantity": 20,
                "price": 2500.0,
                "category": "T-shirts",
            }
        )
        assert response2.status_code == 200
        product2 = response2.json()
        assert product2["Product_name"] == "Product 2"
        assert product2["product_id"] != 0
        assert product2["product_id"] != product1["product_id"]

    app.dependency_overrides.clear()

