# WhatsApp CRM Portal – Practice Project

## Project Purpose
A simple WhatsApp CRM portal developed for practice to understand CRM workflows, role-based access, chat management, and Meta WhatsApp Cloud API integration.

## 1. User Roles
- **Admin** – Manage users, view all conversations, and assign chats.
- **Agent** – View and handle assigned conversations only.

## 2. Core Modules
- Login & Authentication
- Dashboard
- WhatsApp Inbox
- Customer Management
- Chat Assignment
- Role-Based Access
- Basic Conversation Status
- Meta WhatsApp API Integration

## 3. Basic Workflow
Customer sends WhatsApp message → Meta API → Webhook → CRM stores message → Admin assigns chat → Agent responds → Customer receives reply → Chat is resolved/closed.

## 4. Conversation Status
New → Assigned → In Progress → Resolved → Closed

## 5. Customer Information
Name, WhatsApp Number, Email (optional), Assigned Agent, and Conversation History.

## 6. Meta WhatsApp API – Practice Scope
- Receive messages through webhook
- Store incoming messages
- Display messages in CRM
- Send replies through WhatsApp Cloud API
- Handle basic delivery/read status

## 7. Suggested Tech Stack
- **Frontend:** React / Next.js
- **Backend:** Django REST Framework or Node.js
- **Database:** PostgreSQL
- **API:** Meta WhatsApp Cloud API
- **Authentication:** JWT

## 8. Minimum Database Tables
- **Users:** id, name, email, password, role
- **Customers:** id, name, whatsapp_number
- **Conversations:** id, customer_id, assigned_to, status
- **Messages:** id, conversation_id, sender, message, timestamp

## Practice Goal
Build the complete basic flow from WhatsApp message reception to agent response and conversation closure without adding advanced CRM features.
