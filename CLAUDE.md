# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is a microservices-based online mart application called **Takhleeq**. It implements a modern microservices architecture with separate services for products, inventory, users, orders, notifications, payments, and AI. The services communicate via Apache Kafka and are orchestrated using Docker Compose. A modern React frontend provides the user interface.

## Technology Stack

### Backend
* **Programming Language**: Python 3.12+
* **Web Framework**: FastAPI
* **Database**: PostgreSQL with SQLModel (SQLAlchemy + Pydantic)
* **Message Broker**: Apache Kafka (Kraft mode)
* **Containerization**: Docker, Docker Compose
* **Dependency Management**: uv (with pyproject.toml and uv.lock)
* **AI/Vector Database**: Pinecone for vector embeddings and RAG (Retrieval Augmented Generation)
* **AI Integration**: Google Gemini (gemini-2.0-flash) via OpenRouter API

### Frontend
* **Framework**: React 19 (Vite 8)
* **State Management**: Redux Toolkit & React Context
* **Styling**: Tailwind CSS 4
* **Animations**: Framer Motion
* **API Client**: Axios

## Architecture Overview

### Core Services:
1. **Frontend** - React-based e-commerce UI and AI design studio
2. **Product Services** - Manages product catalog, integrates with Pinecone for AI-powered search
3. **Inventory Services** - Tracks stock levels and inventory management
4. **User Services** - Handles user authentication (including Google OAuth) and profiles
5. **Order Services** - Manages order processing and lifecycle
6. **Payment Services** - Processes payments and transactions
7. **Notification Services** - Sends notifications via email and other channels
8. **AI Chatbot Service** - Provides RAG-based chatbot functionality
9. **AI Design Visualization** - Professional product design generation and visualization

### Communication Pattern:
- Services communicate asynchronously via Apache Kafka topics
- Each service maintains its own database (microservices principle)
- Event-driven architecture with producers and consumers

### Infrastructure:
- **Kafka Broker**: Apache Kafka 3.7.0
- **Kafka-UI**: Web interface for managing Kafka topics and messages

## Directory Structure

```
D:\takhleeq_ai_product_visualization_platform/
├── .env                  # Environment variables
├── compose.yaml          # Docker Compose orchestration
├── pyproject.toml        # Root dependency configuration
├── uv.lock               # Root lockfile
├── plan.md               # Root development plan
├── frontend/             # React/Vite/Tailwind frontend
│   ├── src/              # Source code (components, services, store)
│   └── PROJECT_STRUCTURE.md # Detailed frontend documentation
├── ai_services/          # AI-related microservices
│   ├── ai_chatbot/       # RAG chatbot with Chainlit UI
│   └── ai_design_generation_visualization/ # Product design agents
├── product_services/     # Product catalog management
├── inventory_services/   # Inventory tracking
├── user_services/        # User authentication/profiles
├── order_services/       # Order processing
├── payment_services/     # Payment processing
├── notification_services/ # Notifications (Email)
└── ...
```

## Key Commands

* **Start all services**:
  ```bash
  docker compose up -d
  ```

* **Stop all services**:
  ```bash
  docker compose down
  ```

* **View logs**:
  ```bash
  docker compose logs -f <service_name>
  ```

* **Install dependencies** (for individual Python services):
  ```bash
  uv sync
  ```

* **Install frontend dependencies**:
  ```bash
  cd frontend
  npm install
  ```

* **Run frontend development server**:
  ```bash
  cd frontend
  npm run dev
  ```

* **Run AI chatbot locally**:
  ```bash
  cd ai_services/ai_chatbot
  chainlit run app.py
  ```

* **Run tests**:
  - Python services: `pytest` or `python -m pytest`
  - Frontend: `npm run test`

## Service Endpoints & Ports

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| Frontend | 5173 | 5173 |
| Product Service | 8000 | 8000 |
| Inventory Service | 8001 | 8000 |
| User Service | 8002 | 8000 |
| Order Service | 8003 | 8000 |
| Notification Service | 8004 | 8000 |
| Payment Service | 8005 | 8000 |
| AI Chatbot | 8006 | 8000 |
| AI Design Visualization | 8007 | 8000 |
| Kafka-UI | 8081 | 8080 |
| Kafka Broker | 9092/9093 | 9092 |

## Important Notes

* **Environment Variables**: The `.env` file contains sensitive information and API keys. Use `.env.example` as a template.
* **Kafka Configuration**: Inter-service communication relies on the `broker` service.
* **Database**: Each service has its own PostgreSQL database.
* **AI Integration**:
  - `ai_chatbot` uses Pinecone for RAG and Chainlit for UI.
  - `ai_design_visualization` uses agents for generating and visualizing designs.
* **Frontend-Backend Integration**: The frontend communicates with services via `apiClient.js` (Axios).

## Development Workflow

1. **Setup**: Copy `.env.example` to `.env` and add required API keys.
2. **Build**: Run `docker compose build` to build all services.
3. **Run**: Execute `docker compose up -d` to start the system.
4. **Develop**: Changes in local directories are synced to containers via volumes.
5. **Monitor**: Use Kafka-UI at `http://localhost:8081` to inspect events.
