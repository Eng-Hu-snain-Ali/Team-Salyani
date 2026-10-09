# Development Tasks

# Ustad Online — Backend Development Roadmap

> **Version:** 1.0
> **Date:** 2026-10-09
> **Timeline:** 25 Days (4 Weeks)
> **Developer:** Single Backend Developer

---

## Task Conventions

| Symbol | Meaning |
|---|---|
| ⬜ | Not Started |
| 🟡 | In Progress |
| ✅ | Completed |
| 🔴 | Blocked |
| **P0** | Must have — Critical |
| **P1** | Should have — Important |
| **P2** | Nice to have — Future |

---

## Phase 1: Project Setup & Foundation (Days 1-3)

### 1.1 Project Initialization

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 1.1.1 | Initialize Node.js project (`npm init`) | P0 | ⬜ | 15 min |
| 1.1.2 | Install core dependencies (express, cors, helmet, dotenv, morgan) | P0 | ⬜ | 15 min |
| 1.1.3 | Install Neon serverless driver (`@neondatabase/serverless`) | P0 | ⬜ | 10 min |
| 1.1.4 | Install Socket.io, cloudinary, multer, bcryptjs, jsonwebtoken | P0 | ⬜ | 15 min |
| 1.1.5 | Install dev dependencies (nodemon) | P0 | ⬜ | 10 min |
| 1.1.6 | Create `.env.example` with all environment variables | P0 | ⬜ | 15 min |
| 1.1.7 | Create `.gitignore` (node_modules, .env, etc.) | P0 | ⬜ | 5 min |
| 1.1.8 | Setup `package.json` scripts (dev, start) | P0 | ⬜ | 10 min |

### 1.2 Folder Structure Setup

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 1.2.1 | Create complete folder structure as per architecture doc | P0 | ⬜ | 20 min |
| 1.2.2 | Create `server.js` — entry point with HTTP + Socket.io server | P0 | ⬜ | 30 min |
| 1.2.3 | Create `src/app.js` — Express app setup with all middleware | P0 | ⬜ | 45 min |
| 1.2.4 | Setup CORS, helmet, rate limiter, morgan (logging) | P0 | ⬜ | 30 min |

### 1.3 Database Setup

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 1.3.1 | Create Neon project on neon.tech (free tier) | P0 | ⬜ | 15 min |
| 1.3.2 | Create `src/config/database.js` — Neon connection pool setup | P0 | ⬜ | 30 min |
| 1.3.3 | Create DB helper functions (query, transaction) | P0 | ⬜ | 45 min |
| 1.3.4 | Test database connection | P0 | ⬜ | 15 min |

### 1.4 Core Utilities

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 1.4.1 | Create `src/utils/response.js` — standardized API response builder | P0 | ⬜ | 30 min |
| 1.4.2 | Create `src/utils/errors.js` — custom error classes (AppError, ValidationError, etc.) | P0 | ⬜ | 30 min |
| 1.4.3 | Create `src/middleware/errorHandler.js` — centralized error handler | P0 | ⬜ | 30 min |
| 1.4.4 | Create `src/utils/constants.js` — enums, status codes, config values | P0 | ⬜ | 20 min |
| 1.4.5 | Create `src/utils/helpers.js` — common utility functions | P0 | ⬜ | 20 min |
| 1.4.6 | Create `src/utils/geo.js` — Haversine distance calculation | P0 | ⬜ | 20 min |

### 1.5 Cloudinary Setup

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 1.5.1 | Create Cloudinary account (free tier) | P0 | ⬜ | 10 min |
| 1.5.2 | Create `src/config/cloudinary.js` — Cloudinary config | P0 | ⬜ | 15 min |
| 1.5.3 | Create `src/middleware/upload.js` — Multer + Cloudinary upload middleware | P0 | ⬜ | 45 min |
| 1.5.4 | Test image upload to Cloudinary | P0 | ⬜ | 15 min |

**Phase 1 Total: ~8 hours**

---

## Phase 2: Database Migrations & Auth (Days 4-6)

### 2.1 Database Migrations

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 2.1.1 | Create `database/migrations/001_create_enums.sql` | P0 | ⬜ | 30 min |
| 2.1.2 | Create `database/migrations/002_create_users.sql` | P0 | ⬜ | 20 min |
| 2.1.3 | Create `database/migrations/003_create_ustads.sql` | P0 | ⬜ | 20 min |
| 2.1.4 | Create `database/migrations/004_create_ustad_documents.sql` | P0 | ⬜ | 15 min |
| 2.1.5 | Create `database/migrations/005_create_ustad_skills.sql` | P0 | ⬜ | 15 min |
| 2.1.6 | Create `database/migrations/006_create_user_addresses.sql` | P0 | ⬜ | 15 min |
| 2.1.7 | Create `database/migrations/007_create_services.sql` | P0 | ⬜ | 15 min |
| 2.1.8 | Create `database/migrations/008_create_sub_services.sql` | P0 | ⬜ | 15 min |
| 2.1.9 | Create `database/migrations/009_create_rate_cards.sql` | P0 | ⬜ | 15 min |
| 2.1.10 | Create `database/migrations/010_create_bookings.sql` | P0 | ⬜ | 20 min |
| 2.1.11 | Create `database/migrations/011_create_booking_status_history.sql` | P0 | ⬜ | 15 min |
| 2.1.12 | Create `database/migrations/012_create_reviews.sql` | P0 | ⬜ | 15 min |
| 2.1.13 | Create `database/migrations/013_create_chat_rooms.sql` | P0 | ⬜ | 15 min |
| 2.1.14 | Create `database/migrations/014_create_chat_messages.sql` | P0 | ⬜ | 15 min |
| 2.1.15 | Create `database/migrations/015_create_payments.sql` | P0 | ⬜ | 15 min |
| 2.1.16 | Create `database/migrations/016_create_wallets.sql` | P0 | ⬜ | 15 min |
| 2.1.17 | Create `database/migrations/017_create_wallet_transactions.sql` | P0 | ⬜ | 15 min |
| 2.1.18 | Create `database/migrations/018_create_notifications.sql` | P0 | ⬜ | 15 min |
| 2.1.19 | Create `database/migrations/019_create_admins.sql` | P0 | ⬜ | 15 min |
| 2.1.20 | Create `database/migrations/020_create_indexes.sql` | P0 | ⬜ | 20 min |
| 2.1.21 | Create migration runner script | P0 | ⬜ | 30 min |
| 2.1.22 | Run all migrations on Neon database | P0 | ⬜ | 15 min |

### 2.2 Seed Data

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 2.2.1 | Create `database/seeds/seed_services.sql` — Initial 6+ service categories | P0 | ⬜ | 30 min |
| 2.2.2 | Create `database/seeds/seed_sub_services.sql` — Sub-services per category | P0 | ⬜ | 30 min |
| 2.2.3 | Create `database/seeds/seed_rate_cards.sql` — Base prices | P0 | ⬜ | 20 min |
| 2.2.4 | Create `database/seeds/seed_admin.sql` — Default admin user | P0 | ⬜ | 15 min |
| 2.2.5 | Create seed runner script | P0 | ⬜ | 15 min |

### 2.3 Authentication Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 2.3.1 | Enable Neon Managed Better Auth on Neon project | P0 | ⬜ | 15 min |
| 2.3.2 | Create `src/config/auth.js` — Better Auth configuration | P0 | ⬜ | 30 min |
| 2.3.3 | Create `src/middleware/authenticate.js` — JWT token verification | P0 | ⬜ | 45 min |
| 2.3.4 | Create `src/middleware/authorize.js` — Role-based access guard | P0 | ⬜ | 30 min |
| 2.3.5 | Create `src/modules/auth/auth.queries.js` — Auth SQL queries | P0 | ⬜ | 30 min |
| 2.3.6 | Create `src/modules/auth/auth.service.js` — Auth business logic | P0 | ⬜ | 1 hr |
| 2.3.7 | Create `src/modules/auth/auth.controller.js` — Auth route handlers | P0 | ⬜ | 45 min |
| 2.3.8 | Create `src/modules/auth/auth.routes.js` — Auth route definitions | P0 | ⬜ | 15 min |
| 2.3.9 | Implement `POST /auth/send-otp` | P0 | ⬜ | 45 min |
| 2.3.10 | Implement `POST /auth/verify-otp` | P0 | ⬜ | 45 min |
| 2.3.11 | Implement `POST /auth/refresh-token` | P0 | ⬜ | 30 min |
| 2.3.12 | Implement `POST /auth/logout` | P0 | ⬜ | 20 min |
| 2.3.13 | Implement `GET /auth/me` | P0 | ⬜ | 20 min |
| 2.3.14 | Implement `POST /auth/admin/login` (bcrypt + JWT) | P0 | ⬜ | 30 min |
| 2.3.15 | Test all auth endpoints | P0 | ⬜ | 30 min |

**Phase 2 Total: ~14 hours**

---

## Phase 3: User & Ustad Modules (Days 7-10)

### 3.1 Customer (User) Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 3.1.1 | Create `src/modules/user/user.queries.js` | P0 | ⬜ | 30 min |
| 3.1.2 | Create `src/modules/user/user.service.js` | P0 | ⬜ | 45 min |
| 3.1.3 | Create `src/modules/user/user.controller.js` | P0 | ⬜ | 45 min |
| 3.1.4 | Create `src/modules/user/user.routes.js` | P0 | ⬜ | 15 min |
| 3.1.5 | Implement `POST /users/profile` — Create profile | P0 | ⬜ | 30 min |
| 3.1.6 | Implement `GET /users/profile` — Get own profile | P0 | ⬜ | 20 min |
| 3.1.7 | Implement `PUT /users/profile` — Update profile | P0 | ⬜ | 30 min |
| 3.1.8 | Implement `PATCH /users/profile/photo` — Photo upload | P0 | ⬜ | 30 min |
| 3.1.9 | Implement `PATCH /users/location` — Update GPS | P0 | ⬜ | 20 min |
| 3.1.10 | Implement address CRUD endpoints (4 endpoints) | P1 | ⬜ | 1 hr |
| 3.1.11 | Add request validation for all user endpoints | P0 | ⬜ | 30 min |
| 3.1.12 | Test all user endpoints | P0 | ⬜ | 30 min |

### 3.2 Ustad Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 3.2.1 | Create `src/modules/ustad/ustad.queries.js` | P0 | ⬜ | 45 min |
| 3.2.2 | Create `src/modules/ustad/ustad.service.js` | P0 | ⬜ | 1 hr |
| 3.2.3 | Create `src/modules/ustad/ustad.controller.js` | P0 | ⬜ | 1 hr |
| 3.2.4 | Create `src/modules/ustad/ustad.routes.js` | P0 | ⬜ | 15 min |
| 3.2.5 | Implement `POST /ustads/profile` — Create profile | P0 | ⬜ | 30 min |
| 3.2.6 | Implement `GET /ustads/profile` — Get own profile | P0 | ⬜ | 20 min |
| 3.2.7 | Implement `PUT /ustads/profile` — Update profile | P0 | ⬜ | 30 min |
| 3.2.8 | Implement `PATCH /ustads/profile/photo` — Photo upload | P0 | ⬜ | 30 min |
| 3.2.9 | Implement `PATCH /ustads/availability` — Toggle online/offline | P0 | ⬜ | 20 min |
| 3.2.10 | Implement `PATCH /ustads/location` — Update GPS | P0 | ⬜ | 20 min |
| 3.2.11 | Implement `POST /ustads/documents` — KYC upload (CNIC, certs) | P0 | ⬜ | 45 min |
| 3.2.12 | Implement `GET /ustads/documents` — Get own documents | P0 | ⬜ | 20 min |
| 3.2.13 | Implement `POST /ustads/skills` — Add skill | P1 | ⬜ | 30 min |
| 3.2.14 | Implement `GET /ustads/skills` — Get skills list | P1 | ⬜ | 20 min |
| 3.2.15 | Implement `DELETE /ustads/skills/:id` — Remove skill | P1 | ⬜ | 15 min |
| 3.2.16 | Implement `GET /ustads/:id/public` — Public profile view | P0 | ⬜ | 30 min |
| 3.2.17 | Implement `GET /ustads/:id/reviews` — Ustad reviews | P0 | ⬜ | 30 min |
| 3.2.18 | Implement `GET /ustads/nearby` — Geo-query nearby ustads | P0 | ⬜ | 1 hr |
| 3.2.19 | Add request validation for all ustad endpoints | P0 | ⬜ | 30 min |
| 3.2.20 | Test all ustad endpoints | P0 | ⬜ | 30 min |

### 3.3 Service & Rate Card Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 3.3.1 | Create `src/modules/service/service.queries.js` | P0 | ⬜ | 30 min |
| 3.3.2 | Create `src/modules/service/service.service.js` | P0 | ⬜ | 30 min |
| 3.3.3 | Create `src/modules/service/service.controller.js` | P0 | ⬜ | 30 min |
| 3.3.4 | Create `src/modules/service/service.routes.js` | P0 | ⬜ | 15 min |
| 3.3.5 | Implement `GET /services` — List all services | P0 | ⬜ | 20 min |
| 3.3.6 | Implement `GET /services/:id` — Service with sub-services | P0 | ⬜ | 20 min |
| 3.3.7 | Implement `GET /services/:id/sub-services` | P0 | ⬜ | 20 min |
| 3.3.8 | Implement `GET /sub-services/:id/rate-card` | P0 | ⬜ | 20 min |
| 3.3.9 | Implement admin CRUD for services (POST, PUT, DELETE) | P0 | ⬜ | 45 min |
| 3.3.10 | Implement admin CRUD for sub-services | P0 | ⬜ | 30 min |
| 3.3.11 | Implement admin rate card management | P0 | ⬜ | 30 min |
| 3.3.12 | Test all service/rate card endpoints | P0 | ⬜ | 20 min |

**Phase 3 Total: ~18 hours**

---

## Phase 4: Booking System — Core Business Logic (Days 11-14)

### 4.1 Booking Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 4.1.1 | Create `src/modules/booking/booking.queries.js` | P0 | ⬜ | 1 hr |
| 4.1.2 | Create `src/modules/booking/booking.service.js` | P0 | ⬜ | 2 hrs |
| 4.1.3 | Create `src/modules/booking/booking.controller.js` | P0 | ⬜ | 1 hr |
| 4.1.4 | Create `src/modules/booking/booking.routes.js` | P0 | ⬜ | 15 min |
| 4.1.5 | Implement `POST /bookings` — Create booking (with geo-match) | P0 | ⬜ | 2 hrs |
| 4.1.6 | Implement nearby ustad matching algorithm | P0 | ⬜ | 1.5 hrs |
| 4.1.7 | Implement `GET /bookings` — List with filters & pagination | P0 | ⬜ | 45 min |
| 4.1.8 | Implement `GET /bookings/:id` — Booking details | P0 | ⬜ | 30 min |
| 4.1.9 | Implement `PATCH /bookings/:id/accept` — Accept booking | P0 | ⬜ | 1 hr |
| 4.1.10 | Implement `PATCH /bookings/:id/reject` — Reject booking | P0 | ⬜ | 30 min |
| 4.1.11 | Implement `PATCH /bookings/:id/start` — Start job | P0 | ⬜ | 30 min |
| 4.1.12 | Implement `PATCH /bookings/:id/complete` — Complete with price calc | P0 | ⬜ | 1 hr |
| 4.1.13 | Implement `PATCH /bookings/:id/cancel` — Cancel with reason | P0 | ⬜ | 30 min |
| 4.1.14 | Implement `GET /bookings/:id/status-history` | P1 | ⬜ | 30 min |
| 4.1.15 | Add booking status transition validation (prevent invalid transitions) | P0 | ⬜ | 1 hr |
| 4.1.16 | Add booking status history logging (auto log on every change) | P1 | ⬜ | 30 min |
| 4.1.17 | Integrate Socket.io notifications for booking events | P0 | ⬜ | 1 hr |
| 4.1.18 | Add request validation for all booking endpoints | P0 | ⬜ | 30 min |
| 4.1.19 | Test all booking endpoints | P0 | ⬜ | 1 hr |

### 4.2 Review Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 4.2.1 | Create `src/modules/review/review.queries.js` | P0 | ⬜ | 20 min |
| 4.2.2 | Create `src/modules/review/review.service.js` | P0 | ⬜ | 30 min |
| 4.2.3 | Create `src/modules/review/review.controller.js` | P0 | ⬜ | 30 min |
| 4.2.4 | Create `src/modules/review/review.routes.js` | P0 | ⬜ | 10 min |
| 4.2.5 | Implement `POST /reviews` — Submit review (with rating calc) | P0 | ⬜ | 45 min |
| 4.2.6 | Implement auto-update ustad avg_rating on new review | P0 | ⬜ | 30 min |
| 4.2.7 | Implement `GET /reviews/booking/:bookingId` | P0 | ⬜ | 15 min |
| 4.2.8 | Implement `GET /reviews/ustad/:ustadId` — Paginated | P0 | ⬜ | 20 min |
| 4.2.9 | Prevent duplicate review per booking validation | P0 | ⬜ | 15 min |
| 4.2.10 | Test all review endpoints | P0 | ⬜ | 20 min |

**Phase 4 Total: ~20 hours**

---

## Phase 5: Real-time Features — Chat & Tracking (Days 15-18)

### 5.1 Socket.io Setup

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 5.1.1 | Create `src/config/socket.js` — Socket.io server config | P0 | ⬜ | 30 min |
| 5.1.2 | Create `src/socket/index.js` — Connection handler with JWT auth | P0 | ⬜ | 1 hr |
| 5.1.3 | Implement socket authentication middleware | P0 | ⬜ | 30 min |
| 5.1.4 | Implement room joining on connection (user personal room) | P0 | ⬜ | 30 min |
| 5.1.5 | Implement online/offline status tracking | P1 | ⬜ | 30 min |

### 5.2 Chat Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 5.2.1 | Create `src/modules/chat/chat.queries.js` | P0 | ⬜ | 30 min |
| 5.2.2 | Create `src/modules/chat/chat.service.js` | P0 | ⬜ | 45 min |
| 5.2.3 | Create `src/modules/chat/chat.controller.js` | P0 | ⬜ | 30 min |
| 5.2.4 | Create `src/modules/chat/chat.routes.js` | P0 | ⬜ | 10 min |
| 5.2.5 | Create `src/socket/chatHandler.js` — Socket chat events | P0 | ⬜ | 1.5 hrs |
| 5.2.6 | Implement `join_chat` event — Join booking chat room | P0 | ⬜ | 20 min |
| 5.2.7 | Implement `send_message` event — Send + persist + broadcast | P0 | ⬜ | 1 hr |
| 5.2.8 | Implement `typing` event — Typing indicator | P1 | ⬜ | 15 min |
| 5.2.9 | Implement `message_read` event — Read receipts | P2 | ⬜ | 20 min |
| 5.2.10 | Implement `GET /chats/rooms` — List chat rooms | P0 | ⬜ | 30 min |
| 5.2.11 | Implement `GET /chats/rooms/:id/messages` — Chat history | P0 | ⬜ | 30 min |
| 5.2.12 | Auto-create chat room when booking is accepted | P0 | ⬜ | 30 min |
| 5.2.13 | Test real-time chat end-to-end | P0 | ⬜ | 1 hr |

### 5.3 Live Tracking Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 5.3.1 | Create `src/socket/trackingHandler.js` — Location events | P0 | ⬜ | 1 hr |
| 5.3.2 | Implement `start_tracking` — Customer subscribes to ustad location | P0 | ⬜ | 30 min |
| 5.3.3 | Implement `update_location` — Ustad sends location | P0 | ⬜ | 30 min |
| 5.3.4 | Implement `location_update` — Broadcast to customer | P0 | ⬜ | 30 min |
| 5.3.5 | Implement `stop_tracking` — Unsubscribe | P0 | ⬜ | 15 min |
| 5.3.6 | Test live tracking end-to-end | P0 | ⬜ | 45 min |

### 5.4 Notification Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 5.4.1 | Create `src/modules/notification/notification.queries.js` | P0 | ⬜ | 20 min |
| 5.4.2 | Create `src/modules/notification/notification.service.js` | P0 | ⬜ | 45 min |
| 5.4.3 | Create `src/modules/notification/notification.controller.js` | P0 | ⬜ | 30 min |
| 5.4.4 | Create `src/modules/notification/notification.routes.js` | P0 | ⬜ | 10 min |
| 5.4.5 | Create `src/socket/notificationHandler.js` — Real-time emit | P0 | ⬜ | 30 min |
| 5.4.6 | Implement notification creation helper (reusable across modules) | P0 | ⬜ | 30 min |
| 5.4.7 | Implement `GET /notifications` — Paginated list | P0 | ⬜ | 20 min |
| 5.4.8 | Implement `GET /notifications/unread-count` | P1 | ⬜ | 15 min |
| 5.4.9 | Implement `PATCH /notifications/:id/read` | P0 | ⬜ | 15 min |
| 5.4.10 | Implement `PATCH /notifications/read-all` | P1 | ⬜ | 15 min |
| 5.4.11 | Integrate notifications into booking events | P0 | ⬜ | 1 hr |
| 5.4.12 | Test notifications end-to-end | P0 | ⬜ | 30 min |

**Phase 5 Total: ~18 hours**

---

## Phase 6: Payment, Wallet & Admin (Days 19-22)

### 6.1 Payment & Wallet Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 6.1.1 | Create `src/modules/payment/payment.queries.js` | P0 | ⬜ | 30 min |
| 6.1.2 | Create `src/modules/payment/payment.service.js` | P0 | ⬜ | 1.5 hrs |
| 6.1.3 | Create `src/modules/payment/payment.controller.js` | P0 | ⬜ | 30 min |
| 6.1.4 | Create `src/modules/payment/payment.routes.js` | P0 | ⬜ | 10 min |
| 6.1.5 | Implement `POST /payments` — Record payment + commission calc | P0 | ⬜ | 1.5 hrs |
| 6.1.6 | Implement 10% commission deduction logic | P0 | ⬜ | 30 min |
| 6.1.7 | Implement wallet auto-creation on ustad registration | P0 | ⬜ | 20 min |
| 6.1.8 | Implement wallet credit on payment completion (DB transaction) | P0 | ⬜ | 1 hr |
| 6.1.9 | Implement `GET /payments/:id` — Payment details | P0 | ⬜ | 15 min |
| 6.1.10 | Implement `GET /payments/booking/:bookingId` | P0 | ⬜ | 15 min |
| 6.1.11 | Implement `GET /wallets/me` — Wallet summary | P0 | ⬜ | 30 min |
| 6.1.12 | Implement `GET /wallets/transactions` — Transaction history | P0 | ⬜ | 30 min |
| 6.1.13 | Test payment flow end-to-end (complete booking → payment → wallet) | P0 | ⬜ | 1 hr |

### 6.2 Admin Module

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 6.2.1 | Create `src/modules/admin/admin.queries.js` | P0 | ⬜ | 1 hr |
| 6.2.2 | Create `src/modules/admin/admin.service.js` | P0 | ⬜ | 1.5 hrs |
| 6.2.3 | Create `src/modules/admin/admin.controller.js` | P0 | ⬜ | 1 hr |
| 6.2.4 | Create `src/modules/admin/admin.routes.js` | P0 | ⬜ | 15 min |
| 6.2.5 | Implement `GET /admin/dashboard/stats` — Platform stats | P0 | ⬜ | 1 hr |
| 6.2.6 | Implement `GET /admin/dashboard/revenue` — Revenue reports | P1 | ⬜ | 1 hr |
| 6.2.7 | Implement `GET /admin/users` — List customers (paginated) | P0 | ⬜ | 30 min |
| 6.2.8 | Implement `GET /admin/users/:id` — Customer details | P0 | ⬜ | 20 min |
| 6.2.9 | Implement `PATCH /admin/users/:id/block` — Block/unblock | P0 | ⬜ | 20 min |
| 6.2.10 | Implement `GET /admin/ustads` — List ustads (paginated) | P0 | ⬜ | 30 min |
| 6.2.11 | Implement `GET /admin/ustads/:id` — Ustad details + docs | P0 | ⬜ | 30 min |
| 6.2.12 | Implement `PATCH /admin/ustads/:id/verify` — Verify ustad | P0 | ⬜ | 30 min |
| 6.2.13 | Implement `PATCH /admin/ustads/:id/reject` — Reject verification | P0 | ⬜ | 20 min |
| 6.2.14 | Implement `PATCH /admin/ustads/:id/block` — Block/unblock | P0 | ⬜ | 20 min |
| 6.2.15 | Implement `GET /admin/ustads/pending-kyc` | P0 | ⬜ | 20 min |
| 6.2.16 | Implement `PATCH /admin/documents/:id/review` | P0 | ⬜ | 30 min |
| 6.2.17 | Implement `GET /admin/bookings` — List with filters | P0 | ⬜ | 30 min |
| 6.2.18 | Implement `GET /admin/bookings/:id` — Full details | P0 | ⬜ | 20 min |
| 6.2.19 | Implement `GET /admin/reviews` — List reviews | P1 | ⬜ | 20 min |
| 6.2.20 | Implement `PATCH /admin/reviews/:id/visibility` | P1 | ⬜ | 15 min |
| 6.2.21 | Test all admin endpoints | P0 | ⬜ | 1 hr |

**Phase 6 Total: ~20 hours**

---

## Phase 7: Integration, Testing & Polish (Days 23-25)

### 7.1 API Documentation

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 7.1.1 | Install swagger-jsdoc and swagger-ui-express | P1 | ⬜ | 15 min |
| 7.1.2 | Configure Swagger in app.js | P1 | ⬜ | 30 min |
| 7.1.3 | Add JSDoc swagger comments to all routes | P1 | ⬜ | 3 hrs |
| 7.1.4 | Verify Swagger UI at `/api-docs` | P1 | ⬜ | 15 min |

### 7.2 Integration Testing

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 7.2.1 | Test complete user journey: Register → Profile → Book → Pay → Review | P0 | ⬜ | 2 hrs |
| 7.2.2 | Test complete ustad journey: Register → KYC → Accept → Complete | P0 | ⬜ | 2 hrs |
| 7.2.3 | Test admin journey: Login → Verify KYC → Manage → Stats | P0 | ⬜ | 1 hr |
| 7.2.4 | Test real-time features: Chat + Tracking + Notifications | P0 | ⬜ | 1.5 hrs |
| 7.2.5 | Test edge cases: Cancel, Reject, Expired bookings | P0 | ⬜ | 1 hr |

### 7.3 Security & Optimization

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 7.3.1 | Review all SQL queries for injection vulnerabilities | P0 | ⬜ | 1 hr |
| 7.3.2 | Verify all endpoints have proper auth + role guards | P0 | ⬜ | 30 min |
| 7.3.3 | Add input validation where missing | P0 | ⬜ | 1 hr |
| 7.3.4 | Test rate limiting | P1 | ⬜ | 15 min |
| 7.3.5 | Review error handling coverage | P0 | ⬜ | 30 min |
| 7.3.6 | Optimize slow queries (add missing indexes if needed) | P1 | ⬜ | 1 hr |

### 7.4 Documentation & Handoff

| # | Task | Priority | Status | Estimated |
|---|---|---|---|---|
| 7.4.1 | Write `README.md` — Setup, run, and deploy instructions | P0 | ⬜ | 1 hr |
| 7.4.2 | Create `.env.example` with all required variables | P0 | ⬜ | 15 min |
| 7.4.3 | Document Socket.io events for frontend team | P0 | ⬜ | 30 min |
| 7.4.4 | Create Postman/Thunder Client collection export | P1 | ⬜ | 1 hr |
| 7.4.5 | Final code review and cleanup | P0 | ⬜ | 1 hr |

**Phase 7 Total: ~16 hours**

---

## Overall Summary

| Phase | Focus | Days | Estimated Hours |
|---|---|---|---|
| Phase 1 | Project Setup & Foundation | Days 1-3 | ~8 hrs |
| Phase 2 | Database Migrations & Auth | Days 4-6 | ~14 hrs |
| Phase 3 | User & Ustad Modules | Days 7-10 | ~18 hrs |
| Phase 4 | Booking System (Core Logic) | Days 11-14 | ~20 hrs |
| Phase 5 | Real-time (Chat, Tracking, Notifications) | Days 15-18 | ~18 hrs |
| Phase 6 | Payment, Wallet & Admin | Days 19-22 | ~20 hrs |
| Phase 7 | Testing, Docs & Polish | Days 23-25 | ~16 hrs |
| **TOTAL** | | **25 Days** | **~114 hours** |

---

## Dependencies Map

```
Phase 1 (Setup)
    └── Phase 2 (DB + Auth)
            ├── Phase 3 (Users + Ustads + Services)
            │       └── Phase 4 (Bookings + Reviews)
            │               ├── Phase 5 (Real-time)
            │               └── Phase 6 (Payments + Admin)
            │                       └── Phase 7 (Testing + Polish)
```

---

## Notes

1. **Daily Goal:** 4-5 hours focused coding per day
2. **Buffer Time:** Some tasks may overlap, giving buffer for unexpected issues
3. **Testing:** Test each module as it's built — don't leave all testing to the end
4. **Git:** Commit after completing each sub-module
5. **Priority:** Focus on P0 tasks first — P1 and P2 can be done if time permits
