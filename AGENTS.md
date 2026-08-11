# WhatsApp CRM Portal — Project Context

> This file is loaded at the start of every session. Keep it updated as the project evolves.

## Project Overview
A WhatsApp CRM portal practice project. Role-based access (Admin/Agent), chat management, and Meta WhatsApp Cloud API integration. Built for learning purposes — keep it simple, no advanced CRM features.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcrypt) |
| API | Meta WhatsApp Cloud API |
| HTTP Client | Axios |

## Roles
- **Admin** — Manage users, view all conversations, assign chats
- **Agent** — View and handle assigned conversations only

## Conversation Status Flow
New → Assigned → In Progress → Resolved → Closed

## Core Workflow
Customer sends WhatsApp message → Meta API → Webhook → CRM stores message → Admin assigns chat → Agent responds → Customer receives reply → Chat resolved/closed

## Database Tables
- **Users**: id, name, email, password_hash, role, created_at
- **Customers**: id, name, whatsapp_number, email, created_at
- **Conversations**: id, customer_id FK, assigned_to FK, status, created_at, updated_at
- **Messages**: id, conversation_id FK, sender, message, timestamp, direction, status

## Project Structure
```
C:\CRM\
├── server/                 # Node.js + Express backend
│   ├── prisma/schema.prisma
│   └── src/
│       ├── index.js
│       ├── middleware/     # auth.js, rbac.js
│       ├── routes/         # auth, users, customers, conversations, messages, webhook
│       └── controllers/    # matching controllers
├── client/                 # Next.js + Tailwind frontend
│   └── src/
│       ├── pages/          # login, dashboard, inbox, customers, admin/
│       ├── components/     # ConversationList, ChatPanel, MessageBubble, StatusBadge, Layout
│       ├── hooks/          # useAuth, useApi
│       └── context/        # AuthContext
├── specs.md                # Source-of-truth specification
└── task.md                 # Build plan with phases
```

## Key Files
- `specs.md` — Full project specification (source of truth)
- `task.md` — Detailed build plan with 5 phases and file structure

## Current Status
- [x] Specification written (specs.md)
- [x] Build plan written (task.md)
- [ ] Backend implementation (not started)
- [ ] Frontend implementation (not started)
- [ ] Meta API integration (not started)
- [ ] End-to-end testing (not started)

## Conventions
- Follow specs.md exactly — don't add features beyond the spec
- Prisma for all DB operations (no raw SQL)
- Axios with JWT interceptors for frontend API calls
- Environment variables in `.env` files (never commit secrets)
- Keep code minimal and readable — this is a practice project
