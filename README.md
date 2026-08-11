<div align="center">

# WhatsApp CRM Portal

**A practice CRM for managing WhatsApp conversations with role-based access**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Overview

A simple WhatsApp CRM portal built for practice — understand CRM workflows, role-based access, chat management, and Meta WhatsApp Cloud API integration without the complexity of enterprise tools.

> Keep it simple. No advanced CRM features. Just the core flow end-to-end.

---

## Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage users, view all conversations, assign chats to agents |
| **Agent** | View assigned conversations, respond to customers, update status |

---

## Conversation Lifecycle

```
New → Assigned → In Progress → Resolved → Closed
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Messaging | Meta WhatsApp Cloud API |
| HTTP Client | Axios |

---

## Core Workflow

```
Customer sends message
        ↓
Meta WhatsApp Cloud API
        ↓
Webhook receives payload
        ↓
CRM stores message + creates conversation
        ↓
Admin assigns chat to agent
        ↓
Agent responds via CRM
        ↓
Reply sent through Meta API
        ↓
Chat resolved & closed
```

---

## Database Schema

| Table | Key Fields |
|-------|-----------|
| **Users** | id, name, email, password_hash, role, created_at |
| **Customers** | id, name, whatsapp_number, email, created_at |
| **Conversations** | id, customer_id FK, assigned_to FK, status, created_at, updated_at |
| **Messages** | id, conversation_id FK, sender, message, timestamp, direction, status |

---

## Project Structure

```
C:\CRM\
├── server/                 # Node.js + Express backend
│   ├── prisma/schema.prisma
│   └── src/
│       ├── index.js
│       ├── middleware/     # auth.js, rbac.js
│       ├── routes/         # auth, users, customers, conversations, messages, webhook
│       └── controllers/
├── client/                 # Next.js + Tailwind frontend
│   └── src/
│       ├── pages/          # login, dashboard, inbox, customers, admin/
│       ├── components/     # ConversationList, ChatPanel, MessageBubble, StatusBadge, Layout
│       ├── hooks/          # useAuth, useApi
│       └── context/        # AuthContext
├── specs.md                # Source-of-truth specification
└── task.md                 # Build plan with phases
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally or remote

### Backend Setup

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Current Status

- [x] Specification written
- [x] Build plan written
- [ ] Backend implementation
- [ ] Frontend implementation
- [ ] Meta API integration
- [ ] End-to-end testing

---

## License

Practice project — free to use and modify.
