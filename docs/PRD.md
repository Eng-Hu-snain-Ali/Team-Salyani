# Product Requirements Document (PRD)

# Ustad Online — Backend API

> **Version:** 1.0
> **Date:** 2026-10-09
> **Author:** Backend Development Team
> **Status:** Planning Phase

---

## 1. Product Overview

**Ustad Online** ek on-demand mechanic & handyman service platform hai jo Faisalabad, Pakistan ke liye designed hai. Yeh platform customers ko nearby verified technicians (Ustads) se instantly connect karta hai — jaise Uber ride ke liye hai, waise yeh skilled workers ke liye hai.

### 1.1 Scope

Is document ka scope **sirf backend API** hai. Frontend (Flutter mobile apps + Admin panel) alag team develop kar rahi hai. Backend team ko RESTful APIs, real-time services, database, aur third-party integrations provide karni hain.

### 1.2 Business Model

- Platform har successful job pe **10% commission** leti hai
- Example: 1000 PKR job → Ustad gets 900 PKR, Platform retains 100 PKR
- **6+ service trades** supported: Electrician, Plumber, AC Technician, Mechanic, Carpenter, Painter

---

## 2. Target Users & Roles

| Role | Description | Access Level |
|---|---|---|
| **Customer** | Job post karta hai, Ustad ko book karta hai, payment karta hai, review deta hai | Mobile App (Flutter) |
| **Ustad** | KYC submit karta hai, jobs accept/reject karta hai, earnings track karta hai | Mobile App (Flutter) |
| **Admin** | Ustads verify karta hai, rate cards manage karta hai, platform monitor karta hai | Web Admin Panel |

### 2.1 User Personas

**Customer (Aamir — Homeowner):**
- Faisalabad mein rehta hai, AC kharab ho gaya
- Market jaana time waste, kispe trust karein — pata nahi
- App open karo → Problem post karo with photo → Verified Ustad aaye aur kaam kare

**Ustad (Bilal — AC Technician):**
- 5 saal ka experience, CNIC verified
- Naye customers dhundhna mushkil
- App pe register karo → Jobs milain → Paise kamao

**Admin (Platform Manager):**
- Ustads ki documents verify karna
- Rate cards update karna
- Complaints handle karna

---

## 3. Functional Requirements

### 3.1 Authentication Module (Neon Managed Better Auth)

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Phone number OTP sign-in for customers and ustads | P0 |
| AUTH-02 | Email + password sign-in for admin users | P0 |
| AUTH-03 | JWT token generation and validation | P0 |
| AUTH-04 | Session management with token refresh | P0 |
| AUTH-05 | Role-based access control (customer, ustad, admin) | P0 |
| AUTH-06 | Magic link sign-in (optional future) | P2 |

**Implementation Notes:**
- Neon Managed Better Auth use hoga — auth data `neon_auth` schema mein Postgres database mein hi store hoti hai
- `@neondatabase/auth` SDK for server-side token verification
- Custom middleware for role-based route protection

### 3.2 Customer Module

| ID | Requirement | Priority |
|---|---|---|
| CUST-01 | Profile creation after first sign-in (name, phone, address) | P0 |
| CUST-02 | Profile update (name, address, location coordinates) | P0 |
| CUST-03 | View own booking history | P0 |
| CUST-04 | Update GPS location (lat, lng) | P0 |
| CUST-05 | Profile photo upload | P1 |
| CUST-06 | Save multiple addresses (home, office, etc.) | P2 |

### 3.3 Ustad (Service Provider) Module

| ID | Requirement | Priority |
|---|---|---|
| UST-01 | KYC registration — Submit CNIC photo (front + back), skill certificates | P0 |
| UST-02 | Profile with skills, experience, and service areas | P0 |
| UST-03 | Toggle availability (online/offline) | P0 |
| UST-04 | Update live GPS location | P0 |
| UST-05 | View assigned/completed/rejected jobs history | P0 |
| UST-06 | Profile verification status tracking | P0 |
| UST-07 | Multiple skill categories selection | P1 |
| UST-08 | Ustad bio and work portfolio photos | P2 |

### 3.4 Booking Module (Core Business Logic)

| ID | Requirement | Priority |
|---|---|---|
| BOOK-01 | Customer posts a job (service type, description, problem photo, GPS location) | P0 |
| BOOK-02 | System finds nearby available verified Ustads (radius-based geo-query) | P0 |
| BOOK-03 | Send job request notification to matched Ustads | P0 |
| BOOK-04 | Ustad accepts or rejects a job request | P0 |
| BOOK-05 | Booking status lifecycle: `pending` → `accepted` → `in_progress` → `completed` → `paid` | P0 |
| BOOK-06 | Cancel booking (customer or ustad) with reason | P0 |
| BOOK-07 | Auto-expire unaccepted job requests after timeout (e.g., 10 minutes) | P1 |
| BOOK-08 | Re-dispatch to next available Ustad if rejected | P1 |
| BOOK-09 | Booking status history log (audit trail) | P1 |
| BOOK-10 | Scheduled bookings (future date/time) | P2 |

**Booking Status Flow:**
```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED → PAID
   ↓         ↓           ↓
EXPIRED   CANCELLED   CANCELLED
```

### 3.5 Service & Rate Card Module

| ID | Requirement | Priority |
|---|---|---|
| SVC-01 | CRUD operations for service categories (Electrician, Plumber, AC, etc.) | P0 |
| SVC-02 | Rate card with fixed base prices per service type | P0 |
| SVC-03 | Admin can dynamically update rate cards | P0 |
| SVC-04 | Service category with icon/image | P1 |
| SVC-05 | Sub-services under each category (e.g., AC → Installation, Repair, Gas Refill) | P1 |

### 3.6 Review & Rating Module

| ID | Requirement | Priority |
|---|---|---|
| REV-01 | Customer rates Ustad after job completion (1-5 stars) | P0 |
| REV-02 | Customer adds text comment with review | P0 |
| REV-03 | Auto-calculate and update Ustad average rating | P0 |
| REV-04 | View all reviews for a specific Ustad | P0 |
| REV-05 | Prevent duplicate reviews for same booking | P0 |
| REV-06 | Admin can moderate/remove inappropriate reviews | P1 |

### 3.7 Chat Module (Real-time)

| ID | Requirement | Priority |
|---|---|---|
| CHAT-01 | In-app chat between customer and ustad (per booking) | P0 |
| CHAT-02 | Text message support | P0 |
| CHAT-03 | Chat room auto-created when booking is accepted | P0 |
| CHAT-04 | Chat history persistence in database | P0 |
| CHAT-05 | Real-time message delivery via Socket.io | P0 |
| CHAT-06 | Image message support | P1 |
| CHAT-07 | Read receipts | P2 |

### 3.8 Live Tracking Module (Real-time)

| ID | Requirement | Priority |
|---|---|---|
| TRACK-01 | Ustad shares live location after accepting a booking | P0 |
| TRACK-02 | Customer sees Ustad movement on map in real-time | P0 |
| TRACK-03 | Location updates via Socket.io (every 5-10 seconds) | P0 |
| TRACK-04 | Location sharing stops when job status becomes `in_progress` | P1 |
| TRACK-05 | ETA calculation (estimated arrival time) | P2 |

### 3.9 Payment & Wallet Module

| ID | Requirement | Priority |
|---|---|---|
| PAY-01 | Record payment for completed bookings | P0 |
| PAY-02 | Support payment methods: Cash, Easypaisa, JazzCash | P0 |
| PAY-03 | Auto-calculate 10% platform commission | P0 |
| PAY-04 | Ustad wallet — track total earnings | P0 |
| PAY-05 | Wallet transaction history (credits, debits) | P0 |
| PAY-06 | Payment status tracking (pending, completed, failed) | P0 |
| PAY-07 | Daily/weekly earnings summary for Ustad | P1 |
| PAY-08 | Withdrawal request from wallet | P2 |
| PAY-09 | Easypaisa/JazzCash API integration (Phase 2) | P2 |

**Phase 1 Approach:** Cash payment only — backend records payment after Ustad confirms cash received. Commission is calculated and tracked.

### 3.10 Notification Module

| ID | Requirement | Priority |
|---|---|---|
| NOTIF-01 | In-app real-time notifications via Socket.io | P0 |
| NOTIF-02 | Notification types: new_booking, booking_accepted, booking_completed, payment, review | P0 |
| NOTIF-03 | Notification persistence in database | P0 |
| NOTIF-04 | Mark notification as read/unread | P0 |
| NOTIF-05 | Fetch notification history with pagination | P0 |
| NOTIF-06 | Unread notification count API | P1 |

**Note:** Push notifications (when app is in background) are frontend team's responsibility. Backend sends via Socket.io when app is open and stores all notifications in DB. Frontend can poll or use Socket.io events.

### 3.11 Admin Module

| ID | Requirement | Priority |
|---|---|---|
| ADM-01 | Admin login (email + password) | P0 |
| ADM-02 | Dashboard stats: total users, ustads, bookings, revenue | P0 |
| ADM-03 | View and manage all customers | P0 |
| ADM-04 | View and manage all ustads | P0 |
| ADM-05 | Verify/reject ustad KYC documents | P0 |
| ADM-06 | Block/unblock users and ustads | P0 |
| ADM-07 | Manage service categories and rate cards | P0 |
| ADM-08 | View all bookings with filters (status, date, area) | P0 |
| ADM-09 | Revenue reports (daily, weekly, monthly) | P1 |
| ADM-10 | Complaint/dispute management | P2 |
| ADM-11 | System-wide announcements/notifications | P2 |

---

## 4. Non-Functional Requirements

| Requirement | Description |
|---|---|
| **Performance** | API response time < 500ms for 95th percentile requests |
| **Scalability** | Architecture supports horizontal scaling |
| **Security** | JWT authentication, input validation, SQL injection prevention, rate limiting |
| **Availability** | 99.5% uptime target |
| **Data Integrity** | PostgreSQL transactions for critical operations (booking, payment) |
| **API Standards** | RESTful conventions, proper HTTP status codes, consistent response format |
| **Documentation** | Swagger/OpenAPI documentation for all endpoints |
| **Error Handling** | Centralized error handling with meaningful error messages |
| **Logging** | Request logging, error logging for debugging |
| **CORS** | Configured for frontend domains |

---

## 5. Tech Stack (Final)

| Layer | Technology | Details |
|---|---|---|
| **Runtime** | Node.js 20 LTS | JavaScript runtime |
| **Framework** | Express.js | Lightweight, flexible HTTP framework |
| **Database** | PostgreSQL (Neon Serverless) | Managed serverless Postgres — free tier: 0.5GB storage |
| **DB Driver** | `@neondatabase/serverless` | Neon's serverless driver for raw SQL queries |
| **Authentication** | Neon Managed Better Auth | Built-in auth with Phone OTP, JWT — data stored in `neon_auth` schema |
| **File Storage** | Cloudinary | Image upload/storage — free tier: 25GB storage, transformations |
| **Real-time** | Socket.io | WebSocket-based real-time communication (chat + tracking) |
| **Validation** | Zod / express-validator | Request body & query validation |
| **API Docs** | Swagger (swagger-jsdoc + swagger-ui-express) | Auto-generated API documentation |
| **Security** | helmet, cors, express-rate-limit | HTTP security headers, CORS, rate limiting |
| **Environment** | dotenv | Environment variable management |

---

## 6. Assumptions & Constraints

### Assumptions
1. Frontend Flutter team will handle all mobile UI/UX
2. Admin panel frontend team will consume our REST APIs
3. Flutter team will handle push notification receiving (FCM/OneSignal on their side)
4. Neon free tier (0.5GB) is sufficient for development and initial launch
5. Cloudinary free tier (25GB) is sufficient for image storage needs
6. All service areas are within Faisalabad initially

### Constraints
1. **Budget:** Zero — all services must use free tiers
2. **Timeline:** 25-day development window
3. **Team:** Single backend developer
4. **No ORM:** Raw SQL queries only (no Prisma, Sequelize, etc.)
5. **No Firebase:** No Firebase services to be used at all
6. **Payment Phase 1:** Cash only — digital payment integration deferred

---

## 7. Success Criteria

| Criteria | Metric |
|---|---|
| All P0 APIs functional | 100% of Priority 0 endpoints working |
| API response time | < 500ms average |
| Real-time chat works | Messages delivered < 1 second |
| Live tracking works | Location updates delivered < 2 seconds |
| Authentication secure | JWT + role-based access working |
| Database properly designed | All tables, relations, indexes in place |
| API documented | Swagger docs available for frontend team |
| Zero critical bugs | No data corruption or security vulnerabilities |

---

## 8. Glossary

| Term | Definition |
|---|---|
| **Ustad** | Skilled service provider (mechanic, plumber, electrician, etc.) |
| **KYC** | Know Your Customer — identity verification process |
| **CNIC** | Computerized National Identity Card (Pakistan) |
| **Rate Card** | Fixed baseline pricing for specific services |
| **Dispatch** | Process of matching and sending a job to a nearby Ustad |
| **Geo-query** | Database query that filters results by geographic proximity |
| **Commission** | 10% platform fee deducted from each job payment |
