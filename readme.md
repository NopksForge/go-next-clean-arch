<div align="center">
  <h1>🚀 Full-Stack Architecture</h1>
</div>

## ⚡️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Go 1.23 Microservices
- **Database**: PostgreSQL with persistent storage
- **Cache**: Redis
- **Message Queue**: Kafka
- **Deployment**: Docker & Docker Compose

## 🏗 Architecture

```mermaid
graph LR
FE[Frontend<br>Next.js] --> BE1[User Management<br>Go API]
BE1 --> DB[(PostgreSQL)]
BE1 --> CACHE[(Redis)]
BE1 --> MQ[Kafka]
MQ --> BE2[User Consumer<br>Go API]
BE2 --> DB
```

## 🛠 Development

### Prerequisites
- Docker & Docker Compose
- Make

### Quick Start
Start all services
```bash
make docker-up
```

Start individual services
```bash
make be-docker-up # Backend
make fe-docker-up # Frontend
```


### Service URLs
- Frontend: http://localhost:3000
- User Management API: http://localhost:8082
- User Consumer API: http://localhost:8081