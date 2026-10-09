# API Endpoints

# Ustad Online — Backend REST API

> **Version:** 1.0
> **Base URL:** `/api/v1`
> **Date:** 2026-10-09

---

## API Conventions

| Convention | Details |
|---|---|
| **Base URL** | `/api/v1` |
| **Content-Type** | `application/json` |
| **Auth Header** | `Authorization: Bearer <token>` |
| **Pagination** | `?page=1&limit=10` |
| **Sorting** | `?sort_by=created_at&order=desc` |
| **Search** | `?search=keyword` |
| **HTTP Methods** | GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE |

### Auth Legend

| Symbol | Meaning |
|---|---|
| 🔓 | Public — No authentication required |
| 🔐 | Authenticated — Valid JWT token required |
| 👤 | Customer Only |
| 🔧 | Ustad Only |
| 🛡️ | Admin Only |

---

## 1. Authentication Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 1 | POST | `/auth/send-otp` | 🔓 | Send OTP to phone number for login/register |
| 2 | POST | `/auth/verify-otp` | 🔓 | Verify OTP and receive JWT token |
| 3 | POST | `/auth/refresh-token` | 🔐 | Refresh expired JWT token |
| 4 | POST | `/auth/logout` | 🔐 | Invalidate current session |
| 5 | GET | `/auth/me` | 🔐 | Get current authenticated user profile |
| 6 | POST | `/auth/admin/login` | 🔓 | Admin email + password login |

### Detailed Specs

#### `POST /auth/send-otp`
```json
// Request
{
  "phone": "+923001234567",
  "role": "customer"          // "customer" or "ustad"
}

// Response (200)
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "+923001234567",
    "expires_in": 300          // seconds
  }
}
```

#### `POST /auth/verify-otp`
```json
// Request
{
  "phone": "+923001234567",
  "otp": "123456",
  "role": "customer"
}

// Response (200)
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbG...",
    "refresh_token": "eyJhbG...",
    "user": {
      "id": "uuid",
      "phone": "+923001234567",
      "role": "customer",
      "is_new_user": true       // true = needs profile setup
    }
  }
}
```

#### `POST /auth/admin/login`
```json
// Request
{
  "email": "admin@ustadoline.com",
  "password": "securePassword123"
}

// Response (200)
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "admin": {
      "id": "uuid",
      "name": "Admin Name",
      "email": "admin@ustadonline.com",
      "role": "super_admin"
    }
  }
}
```

---

## 2. Customer (User) Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 7 | POST | `/users/profile` | 👤 | Create/complete customer profile |
| 8 | GET | `/users/profile` | 👤 | Get own profile |
| 9 | PUT | `/users/profile` | 👤 | Update profile (name, address) |
| 10 | PATCH | `/users/profile/photo` | 👤 | Upload/update profile photo |
| 11 | PATCH | `/users/location` | 👤 | Update current GPS location |
| 12 | POST | `/users/addresses` | 👤 | Add a saved address |
| 13 | GET | `/users/addresses` | 👤 | Get all saved addresses |
| 14 | PUT | `/users/addresses/:id` | 👤 | Update a saved address |
| 15 | DELETE | `/users/addresses/:id` | 👤 | Delete a saved address |

### Detailed Specs

#### `POST /users/profile`
```json
// Request
{
  "name": "Aamir Khan",
  "email": "aamir@email.com",       // optional
  "address": "House 123, Street 5, Peoples Colony, Faisalabad",
  "lat": 31.4504,
  "lng": 73.1350
}

// Response (201)
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "id": "uuid",
    "name": "Aamir Khan",
    "phone": "+923001234567",
    "email": "aamir@email.com",
    "lat": 31.4504,
    "lng": 73.1350,
    "role": "customer",
    "created_at": "2026-10-09T12:00:00Z"
  }
}
```

---

## 3. Ustad (Service Provider) Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 16 | POST | `/ustads/profile` | 🔧 | Create/complete ustad profile |
| 17 | GET | `/ustads/profile` | 🔧 | Get own profile |
| 18 | PUT | `/ustads/profile` | 🔧 | Update profile details |
| 19 | PATCH | `/ustads/profile/photo` | 🔧 | Upload/update profile photo |
| 20 | PATCH | `/ustads/availability` | 🔧 | Toggle online/offline |
| 21 | PATCH | `/ustads/location` | 🔧 | Update current GPS location |
| 22 | POST | `/ustads/documents` | 🔧 | Upload KYC document (CNIC/certificate) |
| 23 | GET | `/ustads/documents` | 🔧 | Get own uploaded documents |
| 24 | POST | `/ustads/skills` | 🔧 | Add a skill (link to service category) |
| 25 | GET | `/ustads/skills` | 🔧 | Get own skills list |
| 26 | DELETE | `/ustads/skills/:id` | 🔧 | Remove a skill |
| 27 | GET | `/ustads/:id/public` | 🔓 | Get ustad public profile (for customers) |
| 28 | GET | `/ustads/:id/reviews` | 🔓 | Get all reviews for a specific ustad |
| 29 | GET | `/ustads/nearby` | 👤 | Find nearby available ustads by service |

### Detailed Specs

#### `POST /ustads/profile`
```json
// Request
{
  "name": "Bilal Ahmad",
  "email": "bilal@email.com",         // optional
  "cnic_number": "33100-1234567-1",
  "bio": "5 years experience in AC repair and installation",
  "lat": 31.4187,
  "lng": 73.0791
}

// Response (201)
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "id": "uuid",
    "name": "Bilal Ahmad",
    "phone": "+923009876543",
    "cnic_number": "33100-1234567-1",
    "verification_status": "pending",
    "is_available": false,
    "created_at": "2026-10-09T12:00:00Z"
  }
}
```

#### `POST /ustads/documents`
```
// Request: multipart/form-data
{
  "document_type": "cnic_front",       // cnic_front, cnic_back, skill_certificate
  "file": <binary image file>
}

// Response (201)
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "document_type": "cnic_front",
    "document_url": "https://res.cloudinary.com/...",
    "status": "pending"
  }
}
```

#### `GET /ustads/nearby`
```
// Query Parameters
?lat=31.4504&lng=73.1350&service_id=uuid&radius_km=10

// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Bilal Ahmad",
      "profile_image_url": "...",
      "avg_rating": 4.5,
      "total_reviews": 23,
      "distance_km": 2.3,
      "skills": ["AC Technician", "Electrician"],
      "is_available": true
    }
  ]
}
```

---

## 4. Booking Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 30 | POST | `/bookings` | 👤 | Create a new booking (post a job) |
| 31 | GET | `/bookings` | 🔐 | Get own bookings (customer or ustad) |
| 32 | GET | `/bookings/:id` | 🔐 | Get booking details |
| 33 | PATCH | `/bookings/:id/accept` | 🔧 | Ustad accepts a booking |
| 34 | PATCH | `/bookings/:id/reject` | 🔧 | Ustad rejects a booking |
| 35 | PATCH | `/bookings/:id/start` | 🔧 | Ustad starts the job (in_progress) |
| 36 | PATCH | `/bookings/:id/complete` | 🔧 | Ustad marks job as completed |
| 37 | PATCH | `/bookings/:id/cancel` | 🔐 | Cancel booking (customer or ustad) |
| 38 | GET | `/bookings/:id/status-history` | 🔐 | Get booking status change history |

### Detailed Specs

#### `POST /bookings`
```json
// Request (multipart/form-data for image upload)
{
  "sub_service_id": "uuid",
  "description": "AC not cooling, making noise",
  "problem_image": "<binary file>",      // optional
  "customer_lat": 31.4504,
  "customer_lng": 73.1350,
  "customer_address": "House 123, Street 5, Peoples Colony"
}

// Response (201)
{
  "success": true,
  "message": "Booking created — finding nearby Ustads",
  "data": {
    "id": "uuid",
    "sub_service": {
      "id": "uuid",
      "name": "AC Repair",
      "service_name": "AC Technician"
    },
    "description": "AC not cooling, making noise",
    "problem_image_url": "https://res.cloudinary.com/...",
    "estimated_price": 1500.00,
    "status": "pending",
    "matched_ustads_count": 3,
    "created_at": "2026-10-09T12:00:00Z"
  }
}
```

#### `PATCH /bookings/:id/accept`
```json
// Request
{}   // No body needed — authenticated ustad ID from token

// Response (200)
{
  "success": true,
  "message": "Booking accepted",
  "data": {
    "booking_id": "uuid",
    "status": "accepted",
    "chat_room_id": "uuid",          // Auto-created chat room
    "customer": {
      "name": "Aamir Khan",
      "phone": "+923001234567",
      "lat": 31.4504,
      "lng": 73.1350
    },
    "accepted_at": "2026-10-09T12:05:00Z"
  }
}
```

#### `PATCH /bookings/:id/complete`
```json
// Request
{
  "final_price": 1500.00              // Actual price after job
}

// Response (200)
{
  "success": true,
  "message": "Booking marked as completed",
  "data": {
    "booking_id": "uuid",
    "status": "completed",
    "final_price": 1500.00,
    "commission_amount": 150.00,      // 10%
    "ustad_earning": 1350.00,         // 90%
    "completed_at": "2026-10-09T14:00:00Z"
  }
}
```

#### `GET /bookings`
```
// Query Parameters
?status=pending&page=1&limit=10&sort_by=created_at&order=desc

// Response (200)
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

---

## 5. Service & Rate Card Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 39 | GET | `/services` | 🔓 | Get all active service categories |
| 40 | GET | `/services/:id` | 🔓 | Get service with its sub-services |
| 41 | GET | `/services/:id/sub-services` | 🔓 | Get sub-services of a category |
| 42 | GET | `/sub-services/:id/rate-card` | 🔓 | Get rate card for a sub-service |
| 43 | POST | `/services` | 🛡️ | Create new service category |
| 44 | PUT | `/services/:id` | 🛡️ | Update service category |
| 45 | DELETE | `/services/:id` | 🛡️ | Deactivate service category |
| 46 | POST | `/sub-services` | 🛡️ | Create new sub-service |
| 47 | PUT | `/sub-services/:id` | 🛡️ | Update sub-service |
| 48 | POST | `/rate-cards` | 🛡️ | Create/update rate card |
| 49 | PUT | `/rate-cards/:id` | 🛡️ | Update rate card price |

### Detailed Specs

#### `GET /services`
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electrician",
      "description": "Electrical repairs and installations",
      "icon_url": "https://res.cloudinary.com/...",
      "sub_services_count": 5
    },
    {
      "id": "uuid",
      "name": "Plumber",
      "description": "Plumbing repairs and installations",
      "icon_url": "https://res.cloudinary.com/...",
      "sub_services_count": 4
    }
  ]
}
```

#### `POST /rate-cards`
```json
// Request
{
  "sub_service_id": "uuid",
  "base_price": 300.00,
  "price_unit": "fixed"             // "fixed", "per_hour", "per_visit"
}

// Response (201)
{
  "success": true,
  "message": "Rate card created",
  "data": {
    "id": "uuid",
    "sub_service_id": "uuid",
    "base_price": 300.00,
    "price_unit": "fixed"
  }
}
```

---

## 6. Review Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 50 | POST | `/reviews` | 👤 | Submit review for a completed booking |
| 51 | GET | `/reviews/booking/:bookingId` | 🔐 | Get review for a specific booking |
| 52 | GET | `/reviews/ustad/:ustadId` | 🔓 | Get all reviews for an ustad |

### Detailed Specs

#### `POST /reviews`
```json
// Request
{
  "booking_id": "uuid",
  "rating": 5,
  "comment": "Excellent work! Fixed my AC quickly."
}

// Response (201)
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": "uuid",
    "booking_id": "uuid",
    "ustad_id": "uuid",
    "rating": 5,
    "comment": "Excellent work! Fixed my AC quickly.",
    "created_at": "2026-10-09T15:00:00Z"
  }
}
```

---

## 7. Chat Endpoints (REST + Socket.io)

### REST Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 53 | GET | `/chats/rooms` | 🔐 | Get all chat rooms for current user |
| 54 | GET | `/chats/rooms/:id/messages` | 🔐 | Get chat messages (paginated) |
| 55 | POST | `/chats/rooms/:id/messages` | 🔐 | Send a message (fallback REST) |

### Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_chat` | Client → Server | `{ chat_room_id }` | Join a chat room |
| `leave_chat` | Client → Server | `{ chat_room_id }` | Leave a chat room |
| `send_message` | Client → Server | `{ chat_room_id, content, message_type }` | Send a message |
| `new_message` | Server → Client | `{ id, sender_id, content, created_at }` | Receive a message |
| `typing` | Client → Server | `{ chat_room_id }` | User is typing |
| `user_typing` | Server → Client | `{ sender_id, sender_role }` | Someone is typing |
| `message_read` | Client → Server | `{ message_id }` | Mark message as read |

---

## 8. Payment Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 56 | POST | `/payments` | 🔧 | Record payment for a completed booking |
| 57 | GET | `/payments/:id` | 🔐 | Get payment details |
| 58 | GET | `/payments/booking/:bookingId` | 🔐 | Get payment for a booking |
| 59 | GET | `/wallets/me` | 🔧 | Get own wallet balance & summary |
| 60 | GET | `/wallets/transactions` | 🔧 | Get wallet transaction history |

### Detailed Specs

#### `POST /payments`
```json
// Request — Ustad confirms cash received from customer
{
  "booking_id": "uuid",
  "payment_method": "cash",            // "cash", "easypaisa", "jazzcash"
  "total_amount": 1500.00
}

// Response (201)
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "id": "uuid",
    "booking_id": "uuid",
    "total_amount": 1500.00,
    "commission_amount": 150.00,
    "ustad_earning": 1350.00,
    "payment_method": "cash",
    "payment_status": "completed",
    "wallet_balance": 5400.00
  }
}
```

#### `GET /wallets/me`
```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "balance": 5400.00,
    "total_earned": 12500.00,
    "total_withdrawn": 7000.00,
    "total_commission_paid": 1250.00,
    "recent_transactions": [
      {
        "id": "uuid",
        "type": "credit",
        "amount": 1350.00,
        "description": "Earning from booking #abc123",
        "created_at": "2026-10-09T14:00:00Z"
      }
    ]
  }
}
```

---

## 9. Notification Endpoints

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 61 | GET | `/notifications` | 🔐 | Get own notifications (paginated) |
| 62 | GET | `/notifications/unread-count` | 🔐 | Get unread notifications count |
| 63 | PATCH | `/notifications/:id/read` | 🔐 | Mark notification as read |
| 64 | PATCH | `/notifications/read-all` | 🔐 | Mark all notifications as read |

### Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `new_notification` | Server → Client | `{ id, type, title, message, data }` | Real-time notification |

---

## 10. Live Tracking (Socket.io Only)

| Event | Direction | Payload | Description |
|---|---|---|---|
| `start_tracking` | Client → Server | `{ booking_id }` | Customer subscribes to ustad location |
| `stop_tracking` | Client → Server | `{ booking_id }` | Customer unsubscribes |
| `update_location` | Client → Server | `{ booking_id, lat, lng }` | Ustad sends location update |
| `location_update` | Server → Client | `{ ustad_id, lat, lng, timestamp }` | Customer receives location |

---

## 11. Admin Endpoints

### Dashboard & Stats

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 65 | GET | `/admin/dashboard/stats` | 🛡️ | Get platform stats (totals + revenue) |
| 66 | GET | `/admin/dashboard/revenue` | 🛡️ | Revenue report (daily/weekly/monthly) |

### User Management

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 67 | GET | `/admin/users` | 🛡️ | Get all customers (paginated, filterable) |
| 68 | GET | `/admin/users/:id` | 🛡️ | Get customer details |
| 69 | PATCH | `/admin/users/:id/block` | 🛡️ | Block/unblock a customer |

### Ustad Management

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 70 | GET | `/admin/ustads` | 🛡️ | Get all ustads (paginated, filterable) |
| 71 | GET | `/admin/ustads/:id` | 🛡️ | Get ustad details with documents |
| 72 | PATCH | `/admin/ustads/:id/verify` | 🛡️ | Verify ustad account |
| 73 | PATCH | `/admin/ustads/:id/reject` | 🛡️ | Reject ustad verification |
| 74 | PATCH | `/admin/ustads/:id/block` | 🛡️ | Block/unblock an ustad |
| 75 | GET | `/admin/ustads/pending-kyc` | 🛡️ | Get ustads pending KYC review |
| 76 | PATCH | `/admin/documents/:id/review` | 🛡️ | Approve/reject a specific document |

### Booking Management

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 77 | GET | `/admin/bookings` | 🛡️ | Get all bookings (paginated, filterable) |
| 78 | GET | `/admin/bookings/:id` | 🛡️ | Get booking full details |

### Review Management

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 79 | GET | `/admin/reviews` | 🛡️ | Get all reviews (paginated) |
| 80 | PATCH | `/admin/reviews/:id/visibility` | 🛡️ | Hide/show a review |

### Detailed Specs

#### `GET /admin/dashboard/stats`
```json
// Response (200)
{
  "success": true,
  "data": {
    "total_customers": 1250,
    "total_ustads": 85,
    "verified_ustads": 62,
    "pending_kyc": 8,
    "total_bookings": 3400,
    "active_bookings": 15,
    "completed_bookings": 3200,
    "cancelled_bookings": 185,
    "total_revenue": 320000.00,        // Total commission earned
    "revenue_this_month": 45000.00,
    "average_rating": 4.3
  }
}
```

#### `PATCH /admin/ustads/:id/verify`
```json
// Request
{
  "verification_status": "verified"    // "verified" or "rejected"
}

// Response (200)
{
  "success": true,
  "message": "Ustad verified successfully",
  "data": {
    "ustad_id": "uuid",
    "name": "Bilal Ahmad",
    "verification_status": "verified",
    "verified_at": "2026-10-09T12:00:00Z"
  }
}
```

---

## Endpoints Summary

| Module | Endpoints Count | Methods |
|---|---|---|
| Authentication | 6 | POST, GET |
| Customer (User) | 9 | GET, POST, PUT, PATCH, DELETE |
| Ustad | 14 | GET, POST, PUT, PATCH, DELETE |
| Booking | 9 | GET, POST, PATCH |
| Service & Rate Cards | 11 | GET, POST, PUT, DELETE |
| Review | 3 | GET, POST |
| Chat | 3 REST + 6 Socket | GET, POST + Socket events |
| Payment & Wallet | 5 | GET, POST |
| Notification | 4 REST + 1 Socket | GET, PATCH + Socket events |
| Live Tracking | 4 Socket | Socket events only |
| Admin | 16 | GET, PATCH |
| **TOTAL** | **80 REST + 11 Socket** | |
