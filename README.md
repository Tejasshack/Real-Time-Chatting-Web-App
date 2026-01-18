# 🚀 Real-Time Chat Application (MERN + Microservices)

Build a **scalable real-time chat application** using the **MERN stack**, **RabbitMQ**, **Redis**, and **microservices architecture**, featuring **OTP-based authentication**, **Socket.IO real-time messaging**, and **cloud-ready deployment**.

---

## 🧠 Architecture Overview

This project follows a **microservices-based, event-driven architecture**:

* **User Service** – Authentication, OTP generation & verification
* **Mail Service** – Sends OTP emails asynchronously
* **Message Broker** – RabbitMQ for inter-service communication
* **Cache Layer** – Redis for OTP storage, rate limiting, and token handling
* **Real-Time Layer** – Socket.IO for live chat
* **Database** – MongoDB
* **Deployment Ready** – Designed for AWS / Docker environments

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* TypeScript
* Redis
* RabbitMQ (AMQP)
* JWT Authentication
* Nodemailer

### Real-Time

* Socket.IO

### Frontend

* React.js
* Context API / Redux (optional)

### DevOps / Deployment

* Docker
* AWS (EC2 / ECS / Load Balancer)
* Nginx (optional)

---

## 🔐 Authentication Flow (OTP Based)

1. User enters email
2. **User Service**

   * Generates OTP
   * Stores OTP in Redis with TTL
   * Applies rate limiting via Redis
   * Publishes OTP event to RabbitMQ
3. **Mail Service**

   * Consumes OTP event
   * Sends HTML email using Nodemailer
4. User verifies OTP
5. JWT issued upon successful verification

> OTP is **one-time use**, **time-bound**, and **rate-limited**

---

## 📦 Microservices

### 🧑 User Service

* OTP generation & verification
* JWT token creation
* Redis-based rate limiting
* MongoDB user persistence

### ✉️ Mail Service

* Independent service
* Listens to RabbitMQ queue (`send-otp`)
* Sends HTML emails
* Decoupled from User Service

---

## 🔄 Message Broker (RabbitMQ)

* Asynchronous communication between services
* Durable queues & persistent messages
* Improves scalability & fault tolerance

---

## ⚡ Redis Usage

* OTP storage with expiry
* Rate limiting OTP requests
* Token blacklisting (future scope)

---

## 📡 Real-Time Chat

* Powered by **Socket.IO**
* Supports:

  * Live messaging
  * Online/offline users
  * Typing indicators (future)
  * Read receipts (future)

---

## 📂 Project Structure (Simplified)

```
chat-app/
├── backend/
│   ├── user-service/
│   ├── mail-service/
│   └── shared/
├── frontend/
│   └── react-app/
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* Docker & Docker Compose
* MongoDB
* Redis
* RabbitMQ

---

### Clone Repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

---

### Start Services (Docker)

```bash
docker-compose up -d
```

---

### Start Backend (Manual)

```bash
cd backend/user-service
npm install
npm run dev
```

```bash
cd backend/mail-service
npm install
npm run dev
```

---

### Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

Example `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret

REDIS_URL=redis://localhost:6379

Rabbitmq_Host=localhost
Rabbitmq_Username=admin
Rabbitmq_Password=admin

EMAIL_USER=example@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## ✅ Features

* OTP-based authentication
* Microservices architecture
* RabbitMQ event-driven communication
* Redis caching & rate limiting
* Secure JWT authentication
* Real-time chat with Socket.IO
* Scalable & cloud-ready design

---

## 🧪 Future Improvements

* Refresh token support
* Message persistence
* Read receipts & typing indicators
* Group chats
* Push notifications
* Kubernetes deployment
* Monitoring & logging (Prometheus / Grafana)

---

## 👨‍💻 Author

**Tejaswi Rastogi**
Backend Developer | Node.js | Microservices | System Design

---

## 📜 License

This project is licensed under the **MIT License**.
