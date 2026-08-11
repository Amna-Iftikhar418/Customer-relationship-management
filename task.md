# WhatsApp CRM Portal — Build Plan

## Phase 1: Project Setup & Backend Foundation

### 1.1 Initialize Backend (Node.js + Express)
- Set up Node.js project with Express
- Configure PostgreSQL connection (using Prisma ORM)
- Set up environment variables (`.env`) for DB credentials, JWT secret, Meta API tokens
- Create project structure: `server/` with routes, controllers, middleware, models

### 1.2 Database Schema & Migrations
- Create tables matching spec:
  - `users` (id, name, email, password_hash, role, created_at)
  - `customers` (id, name, whatsapp_number, email, created_at)
  - `conversations` (id, customer_id FK, assigned_to FK, status, created_at, updated_at)
  - `messages` (id, conversation_id FK, sender, message, timestamp, direction, status)
- Add indexes on foreign keys and frequently queried fields

### 1.3 Authentication Module
- Implement JWT-based auth (register/login endpoints)
- Password hashing with bcrypt
- Auth middleware to protect routes
- Role-based middleware (admin vs agent)

---

## Phase 2: Core Backend Modules

### 2.1 User Management (Admin only)
- CRUD endpoints for users
- Admin can create agents, view all users

### 2.2 Customer Management
- Create/list/search customers by WhatsApp number
- Auto-create customer record on first incoming message

### 2.3 Conversation & Message Management
- Create conversation on new customer message
- List conversations (admin: all, agent: assigned only)
- Get conversation with message history
- Update conversation status (New → Assigned → In Progress → Resolved → Closed)

### 2.4 Chat Assignment (Admin only)
- Assign conversation to agent
- Reassign conversation

---

## Phase 3: Meta WhatsApp Cloud API Integration

### 3.1 Webhook Setup
- GET endpoint for webhook verification (Meta challenge)
- POST endpoint to receive incoming messages
- Parse message payload, store in DB

### 3.2 Send Messages
- POST endpoint to send reply via WhatsApp Cloud API
- Handle message templates and text messages

### 3.3 Message Status Updates
- Receive and store delivery/read receipts
- Update message status in DB

---

## Phase 4: Frontend (Next.js + Tailwind CSS)

### 4.1 Project Setup
- Initialize Next.js app with Tailwind CSS
- Set up API client (Axios) with JWT interceptors
- React Router for navigation

### 4.2 Auth Pages
- Login page
- Register page (admin-created users or open registration with role assignment)

### 4.3 Dashboard
- Admin: overview stats (total conversations, unassigned, resolved, etc.)
- Agent: personal stats (assigned, in-progress, resolved)

### 4.4 WhatsApp Inbox
- Conversation list sidebar (with status badges, customer name, last message)
- Chat panel showing message history
- Message input to send reply
- Status update controls
- Real-time feel (polling or basic WebSocket)

### 4.5 Customer Management
- Customer list with search
- Customer detail view with conversation history

### 4.6 Admin Panel
- User management
- Chat assignment interface

---

## Phase 5: Integration & Testing

### 5.1 End-to-End Flow Test
- Simulate incoming WhatsApp message → webhook → stored → displayed
- Admin assigns → Agent sees → Agent replies → Status updates → Close

### 5.2 Meta API Testing
- Use Meta's test phone number for webhook testing
- Verify send/receive works in sandbox mode

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcrypt) |
| API | Meta WhatsApp Cloud API |
| HTTP Client | Axios |

---

## Target File Structure

```
C:\CRM\
├── server/
│   ├── package.json
│   ├── .env
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rbac.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── customers.js
│   │   │   ├── conversations.js
│   │   │   ├── messages.js
│   │   │   └── webhook.js
│   │   └── controllers/
│   │       ├── authController.js
│   │       ├── userController.js
│   │       ├── customerController.js
│   │       ├── conversationController.js
│   │       ├── messageController.js
│   │       └── webhookController.js
├── client/
│   ├── package.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── inbox.jsx
│   │   │   ├── customers.jsx
│   │   │   └── admin/
│   │   │       ├── users.jsx
│   │   │       └── assignments.jsx
│   │   ├── components/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── Layout.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   └── context/
│   │       └── AuthContext.jsx
├── specs.md
└── task.md
```
