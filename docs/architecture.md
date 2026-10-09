# System Architecture

# Ustad Online — Backend

> **Version:** 1.0
> **Date:** 2026-10-09

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                         │
│                                                                     │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│   │ Customer App │   │  Ustad App   │   │  Admin Web Panel     │   │
│   │  (Flutter)   │   │  (Flutter)   │   │  (React/Flutter Web) │   │
│   └──────┬───────┘   └──────┬───────┘   └──────────┬───────────┘   │
│          │                  │                       │               │
└──────────┼──────────────────┼───────────────────────┼───────────────┘
           │                  │                       │
           │    HTTPS/WSS     │     HTTPS/WSS         │  HTTPS
           │                  │                       │
┌──────────┼──────────────────┼───────────────────────┼───────────────┐
│          ▼                  ▼                       ▼               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    NODE.JS SERVER                           │    │
│  │                    (Express.js)                             │    │
│  │                                                             │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │    │
│  │  │  REST API   │  │  Socket.io   │  │   Middleware      │   │    │
│  │  │  Routes     │  │  Server      │  │   Stack           │   │    │
│  │  │             │  │              │  │                    │   │    │
│  │  │ • Auth      │  │ • Chat       │  │ • Auth Verify     │   │    │
│  │  │ • Users     │  │ • Tracking   │  │ • Role Guard      │   │    │
│  │  │ • Ustads    │  │ • Notify     │  │ • Validation      │   │    │
│  │  │ • Bookings  │  │              │  │ • Error Handler   │   │    │
│  │  │ • Services  │  │              │  │ • Rate Limiter    │   │    │
│  │  │ • Reviews   │  │              │  │ • CORS            │   │    │
│  │  │ • Payments  │  │              │  │ • Logger          │   │    │
│  │  │ • Admin     │  │              │  │                    │   │    │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘   │    │
│  └─────────────────────────┬───────────────────────────────────┘    │
│                            │                                        │
│              BACKEND SERVER│LAYER                                   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                  │
           ▼                 ▼                  ▼
  ┌─────────────────┐ ┌────────────┐  ┌─────────────────┐
  │   PostgreSQL    │ │ Cloudinary │  │   Neon Managed   │
  │   (Neon DB)     │ │  (Images)  │  │   Better Auth    │
  │                 │ │            │  │                   │
  │ • users         │ │ • CNIC     │  │ • Phone OTP      │
  │ • ustads        │ │ • Job pics │  │ • Sessions        │
  │ • bookings      │ │ • Profiles │  │ • JWT Tokens      │
  │ • reviews       │ │            │  │ • neon_auth schema│
  │ • payments      │ │            │  │                   │
  │ • chats         │ │            │  │                   │
  │ • notifications │ │            │  │                   │
  └─────────────────┘ └────────────┘  └─────────────────┘
```

---

## 2. Architecture Pattern: Modular Monolith

Ham **Modular Monolith** pattern use karin gay. Kyun?

| Benefit | Explanation |
|---|---|
| **Simple Deployment** | Single server deploy — no microservices complexity |
| **Clear Separation** | Each module (auth, booking, chat) has its own folder with controller, service, routes |
| **Easy to Scale Later** | Modules can be extracted to microservices later if needed |
| **Fast Development** | Single developer ke liye ideal — 25-day timeline |
| **Shared Database** | Single PostgreSQL connection — no distributed transactions |

---

## 3. Project Folder Structure

```
ustad_backend/
│
├── docs/                           # Project documentation
│   ├── ustad_online.md             # Original project idea
│   ├── PRD.md                      # Product Requirements Document
│   ├── architecture.md             # This file
│   ├── database_design.md          # Database schema design
│   ├── api_endpoints.md            # API endpoints list
│   └── tasks.md                    # Development tasks
│
├── database/
│   ├── migrations/                 # SQL migration files (versioned)
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_ustads.sql
│   │   ├── 003_create_services.sql
│   │   ├── 004_create_bookings.sql
│   │   └── ...
│   └── seeds/                      # Seed data for development
│       ├── seed_services.sql
│       └── seed_admin.sql
│
├── src/
│   ├── config/                     # Configuration files
│   │   ├── database.js             # Neon DB connection setup
│   │   ├── cloudinary.js           # Cloudinary config
│   │   ├── socket.js               # Socket.io setup
│   │   └── auth.js                 # Neon Auth / Better Auth config
│   │
│   ├── middleware/                  # Express middleware
│   │   ├── authenticate.js         # JWT token verification
│   │   ├── authorize.js            # Role-based access guard
│   │   ├── validate.js             # Request validation middleware
│   │   ├── errorHandler.js         # Centralized error handler
│   │   ├── rateLimiter.js          # API rate limiting
│   │   └── upload.js               # Multer + Cloudinary upload
│   │
│   ├── modules/                    # Feature modules (core business logic)
│   │   ├── auth/
│   │   │   ├── auth.controller.js  # Request handling
│   │   │   ├── auth.service.js     # Business logic
│   │   │   ├── auth.routes.js      # Route definitions
│   │   │   └── auth.queries.js     # Raw SQL queries
│   │   │
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.routes.js
│   │   │   └── user.queries.js
│   │   │
│   │   ├── ustad/
│   │   │   ├── ustad.controller.js
│   │   │   ├── ustad.service.js
│   │   │   ├── ustad.routes.js
│   │   │   └── ustad.queries.js
│   │   │
│   │   ├── booking/
│   │   │   ├── booking.controller.js
│   │   │   ├── booking.service.js
│   │   │   ├── booking.routes.js
│   │   │   └── booking.queries.js
│   │   │
│   │   ├── service/                # Service categories & rate cards
│   │   │   ├── service.controller.js
│   │   │   ├── service.service.js
│   │   │   ├── service.routes.js
│   │   │   └── service.queries.js
│   │   │
│   │   ├── review/
│   │   │   ├── review.controller.js
│   │   │   ├── review.service.js
│   │   │   ├── review.routes.js
│   │   │   └── review.queries.js
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   ├── chat.routes.js
│   │   │   └── chat.queries.js
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.controller.js
│   │   │   ├── payment.service.js
│   │   │   ├── payment.routes.js
│   │   │   └── payment.queries.js
│   │   │
│   │   ├── notification/
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   ├── notification.routes.js
│   │   │   └── notification.queries.js
│   │   │
│   │   └── admin/
│   │       ├── admin.controller.js
│   │       ├── admin.service.js
│   │       ├── admin.routes.js
│   │       └── admin.queries.js
│   │
│   ├── socket/                     # Socket.io event handlers
│   │   ├── index.js                # Socket initialization & connection
│   │   ├── chatHandler.js          # Chat events
│   │   ├── trackingHandler.js      # Location tracking events
│   │   └── notificationHandler.js  # Notification events
│   │
│   ├── utils/                      # Shared utility functions
│   │   ├── response.js             # Standardized API response builder
│   │   ├── errors.js               # Custom error classes
│   │   ├── helpers.js              # General helper functions
│   │   ├── geo.js                  # Geo-distance calculation utilities
│   │   └── constants.js            # App-wide constants & enums
│   │
│   └── app.js                      # Express app setup (middleware, routes)
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── server.js                       # Entry point — starts HTTP + Socket.io server
└── README.md                       # Project setup & run instructions
```

---

## 4. Request-Response Flow

```
Client Request
      │
      ▼
┌──────────────┐
│   Express    │
│   Router     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│           MIDDLEWARE PIPELINE             │
│                                          │
│  1. CORS → 2. Rate Limiter → 3. Logger  │
│  4. Body Parser → 5. Auth Verify        │
│  6. Role Guard → 7. Validation          │
└──────────────────┬───────────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Controller    │  ← Handles HTTP request/response
          │   (Route Layer) │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    Service      │  ← Business logic, calculations
          │  (Logic Layer)  │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    Queries      │  ← Raw SQL queries
          │   (Data Layer)  │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   PostgreSQL    │
          │   (Neon DB)     │
          └─────────────────┘
                   │
                   ▼
          Standardized JSON Response
```

### 4.1 Standardized API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "phone", "message": "Phone number is required" }
    ]
  }
}
```

---

## 5. Authentication Flow (Neon Managed Better Auth)

```
┌──────────┐     ┌──────────────┐     ┌─────────────────────┐
│  Client  │     │  Express     │     │  Neon Managed        │
│  (App)   │     │  Backend     │     │  Better Auth         │
└────┬─────┘     └──────┬───────┘     │  (neon_auth schema)  │
     │                  │             └──────────┬────────────┘
     │                  │                        │
     │  1. POST /auth/send-otp                   │
     │  { phone: "+923XX..." }                   │
     │─────────────────►│                        │
     │                  │  2. Trigger OTP via     │
     │                  │     Better Auth SDK     │
     │                  │───────────────────────►│
     │                  │                        │
     │                  │  3. OTP sent to phone   │
     │                  │◄───────────────────────│
     │  4. OTP sent     │                        │
     │◄─────────────────│                        │
     │                  │                        │
     │  5. POST /auth/verify-otp                 │
     │  { phone, otp }  │                        │
     │─────────────────►│                        │
     │                  │  6. Verify OTP          │
     │                  │───────────────────────►│
     │                  │                        │
     │                  │  7. User verified +     │
     │                  │     Session created     │
     │                  │◄───────────────────────│
     │                  │                        │
     │                  │  8. Generate JWT token  │
     │                  │     (with role claim)   │
     │                  │                        │
     │  9. { token,     │                        │
     │     user,        │                        │
     │     isNewUser }  │                        │
     │◄─────────────────│                        │
     │                  │                        │
     │  10. Subsequent API calls                 │
     │  Authorization: Bearer <token>            │
     │─────────────────►│                        │
     │                  │  11. Verify JWT token   │
     │                  │  12. Extract user role  │
     │                  │  13. Process request    │
     │  14. Response    │                        │
     │◄─────────────────│                        │
```

---

## 6. Booking Flow (Core Business Logic)

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│ Customer │     │   Backend    │     │ Database │     │  Ustad   │
│   App    │     │   Server     │     │ (Neon)   │     │   App    │
└────┬─────┘     └──────┬───────┘     └────┬─────┘     └────┬─────┘
     │                  │                  │                 │
     │ 1. POST /bookings                   │                 │
     │ { serviceType,   │                  │                 │
     │   description,   │                  │                 │
     │   photo, lat,    │                  │                 │
     │   lng }          │                  │                 │
     │─────────────────►│                  │                 │
     │                  │ 2. Save booking  │                 │
     │                  │ status: PENDING  │                 │
     │                  │────────────────►│                 │
     │                  │                  │                 │
     │                  │ 3. Geo-query:    │                 │
     │                  │ Find nearby      │                 │
     │                  │ available ustads │                 │
     │                  │────────────────►│                 │
     │                  │                  │                 │
     │                  │ 4. Matched       │                 │
     │                  │ ustads list      │                 │
     │                  │◄────────────────│                 │
     │                  │                  │                 │
     │                  │ 5. Socket.io: emit 'new_booking'  │
     │                  │──────────────────────────────────►│
     │                  │                  │                 │
     │ 6. Booking       │                  │                 │
     │ created          │                  │                 │
     │◄─────────────────│                  │                 │
     │                  │                  │                 │
     │                  │ 7. Ustad accepts │                 │
     │                  │◄──────────────────────────────────│
     │                  │                  │                 │
     │                  │ 8. Update status │                 │
     │                  │ → ACCEPTED       │                 │
     │                  │────────────────►│                 │
     │                  │                  │                 │
     │                  │ 9. Create chat   │                 │
     │                  │ room for booking │                 │
     │                  │────────────────►│                 │
     │                  │                  │                 │
     │ 10. Socket.io:   │                  │                 │
     │ 'booking_accepted'                  │                 │
     │◄─────────────────│                  │                 │
     │                  │                  │                 │
     │ 11. Live location│tracking starts   │                 │
     │◄═══════════════ Socket.io ═════════════════════════►│
     │                  │                  │                 │
     │                  │ 12. Ustad marks  │                 │
     │                  │ job COMPLETED    │                 │
     │                  │◄──────────────────────────────────│
     │                  │                  │                 │
     │                  │ 13. Calculate    │                 │
     │                  │ payment + 10%    │                 │
     │                  │ commission       │                 │
     │                  │────────────────►│                 │
     │                  │                  │                 │
     │ 14. Rate Ustad   │                  │                 │
     │─────────────────►│                  │                 │
```

---

## 7. Real-time Communication (Socket.io)

### 7.1 Socket Events Architecture

```
┌─────────────────────────────────────────────────────┐
│                SOCKET.IO SERVER                      │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │              CONNECTION HANDLER                 │  │
│  │  • Authenticate socket via JWT token            │  │
│  │  • Join user to personal room (userId)          │  │
│  │  • Track online status                          │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │    CHAT      │ │   TRACKING   │ │ NOTIFICATION │ │
│  │   HANDLER    │ │   HANDLER    │ │   HANDLER    │ │
│  │              │ │              │ │              │ │
│  │ Events:      │ │ Events:      │ │ Events:      │ │
│  │ • join_chat  │ │ • update     │ │ • new_notif  │ │
│  │ • send_msg   │ │   _location  │ │ • read_notif │ │
│  │ • typing     │ │ • subscribe  │ │              │ │
│  │ • msg_read   │ │   _tracking  │ │              │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 7.2 Socket Rooms Strategy

| Room Name | Purpose | Who Joins |
|---|---|---|
| `user:{userId}` | Personal notifications | Each user on connect |
| `booking:{bookingId}` | Booking updates & chat | Customer + Ustad of that booking |
| `tracking:{bookingId}` | Live location updates | Customer tracking their Ustad |
| `ustads:available` | New job broadcasts | All online available Ustads |
| `admin` | Admin notifications | Admin users |

### 7.3 Socket Authentication

```javascript
// Every socket connection must send JWT token
// Server verifies token before allowing connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify JWT → extract userId & role
  // Attach to socket.data
  next();
});
```

---

## 8. File Upload Flow (Cloudinary)

```
┌──────────┐     ┌──────────────┐     ┌────────────┐
│  Client  │     │   Backend    │     │ Cloudinary │
│  (App)   │     │   Server     │     │   (CDN)    │
└────┬─────┘     └──────┬───────┘     └─────┬──────┘
     │                  │                    │
     │ 1. POST /upload  │                    │
     │ (multipart/form) │                    │
     │─────────────────►│                    │
     │                  │                    │
     │                  │ 2. Multer parses   │
     │                  │    file from       │
     │                  │    request         │
     │                  │                    │
     │                  │ 3. Upload to       │
     │                  │    Cloudinary      │
     │                  │───────────────────►│
     │                  │                    │
     │                  │ 4. Cloudinary      │
     │                  │    returns URL +   │
     │                  │    public_id       │
     │                  │◄───────────────────│
     │                  │                    │
     │                  │ 5. Save URL in     │
     │                  │    database        │
     │                  │                    │
     │ 6. Response      │                    │
     │ { imageUrl }     │                    │
     │◄─────────────────│                    │
```

**Cloudinary Folders Structure:**
```
ustad_online/
├── cnic/              # CNIC photos (front + back)
├── certificates/      # Skill certificates
├── profiles/          # Profile photos
├── bookings/          # Job problem photos
└── services/          # Service category icons
```

---

## 9. Geo-Location Strategy

### 9.1 Finding Nearby Ustads

PostgreSQL has built-in support for geographic calculations using the **Haversine formula** or the **earthdistance** extension.

**Approach:** Raw SQL with Haversine formula to calculate distance between customer location and available Ustads.

```sql
-- Find ustads within 10 km radius
SELECT *, 
  (6371 * acos(
    cos(radians($1)) * cos(radians(lat)) *
    cos(radians(lng) - radians($2)) +
    sin(radians($1)) * sin(radians(lat))
  )) AS distance_km
FROM ustads
WHERE is_available = true 
  AND is_verified = true
HAVING distance_km <= 10
ORDER BY distance_km ASC;
```

### 9.2 Location Update Strategy

| Scenario | Method | Frequency |
|---|---|---|
| Ustad going to customer | Socket.io real-time | Every 5 seconds |
| Ustad general availability | REST API | On app open, on toggle |
| Customer job post location | REST API | One-time with booking |

---

## 10. Error Handling Strategy

### 10.1 Custom Error Classes

```
AppError (Base)
├── ValidationError    (400)
├── AuthenticationError (401)
├── ForbiddenError     (403)
├── NotFoundError      (404)
├── ConflictError      (409)
├── RateLimitError     (429)
└── InternalError      (500)
```

### 10.2 Centralized Error Handler

All errors are caught by a global error handler middleware that:
1. Logs the error (with stack trace in development)
2. Returns standardized error response
3. Hides internal details in production

---

## 11. Security Architecture

| Layer | Measure | Implementation |
|---|---|---|
| **Transport** | HTTPS enforcement | Production server config |
| **Headers** | Security headers | `helmet` middleware |
| **Authentication** | JWT verification | Custom auth middleware |
| **Authorization** | Role-based access | Route-level role guards |
| **Input** | Request validation | Zod / express-validator |
| **SQL** | Injection prevention | Parameterized queries ($1, $2) |
| **Rate Limiting** | API throttling | `express-rate-limit` |
| **CORS** | Origin restriction | Configured allowed origins |
| **File Upload** | Size + type limits | Multer config (max 5MB, images only) |
| **Sensitive Data** | Environment variables | `.env` file (never committed) |

---

## 12. Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Neon Database
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Neon Auth / Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```
