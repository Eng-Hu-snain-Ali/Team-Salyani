# USTAD ONLINE — On-Demand Mechanic & Handyman Service Platform

> **"Reliable Ustads. Transparent Prices."**  
> *Pakistan's premier on-demand skilled labor and technician network, piloting in Faisalabad.*

---

## 🌟 Executive Overview

**USTAD ONLINE** is an on-demand multi-sided platform connecting households and businesses across Pakistan with vetted, verified local handymen and mechanics ("Ustads"). The platform eliminates predatory pricing, untraceable workmanship, and safety risks by offering:

1. **Vetted Professionals**: Identity-verified technicians with secure NADRA CNIC and skill checks.
2. **Transparent Rate Cards**: Standardized starting prices in Pakistani Rupees (`PKR / Rs.`), with clear distinction between fixed fees and diagnostic inspection estimates.
3. **End-to-End Tracking**: Real-time simulated status progression from dispatch to completion.
4. **Local Payment Flexibility**: Cash on Delivery (COD), Easypaisa, and JazzCash.
5. **Fair 10% Platform Commission**: Ustads retain 90% of eligible completed earnings.

---

## 🏗️ Project Architecture (Monorepo)

```
Team-Salyani/
├── frontend/                     # Next.js 16 (React 19, Turbopack, Tailwind CSS) Web Application
│   ├── src/
│   │   ├── app/                  # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   │   ├── components/           # CustomerApp, UstadApp, AdminPanel, FaisalabadMap, Presentation
│   │   ├── data/                 # Faisalabad locations, mock rate cards, seeds
│   │   └── utils/                # Audio synthesizer & helpers
│   ├── package.json
│   └── tsconfig.json
│
├── flutter_ustad_online/         # Flutter Mobile Application (Android/iOS)
│   ├── lib/
│   │   ├── screens/              # CustomerHomeScreen
│   │   ├── models/               # BookingModel, UstadModel
│   │   └── services/             # FirebaseService
│   └── pubspec.yaml
│
├── src/                          # Express.js REST API Backend
│   ├── modules/                  # Auth, Booking, Ustad, Admin, Chat, Payment modules
│   ├── config/                   # Database, Cloudinary
│   ├── middleware/               # Auth, Upload, Rate Limiter, Error Handler
│   └── socket/                   # Socket.IO Real-time tracking & chat
│
├── database/                     # PostgreSQL Migrations & Seed data
├── docs/                         # Architecture, API endpoints, PRD, Firebase setup
└── server.js                     # Backend Server Entry Point
```

---

## 🚀 Running the Applications

### 1. Next.js Web Application (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 2. Express Backend Server (Root)

```bash
npm install
npm run dev
# or: node server.js
```

### 3. Flutter Mobile Application (`flutter_ustad_online/`)

```bash
cd flutter_ustad_online
flutter pub get
flutter run
```

---

## 📄 License & Attribution

Developed for **USTAD ONLINE** (Pakistan). All rights reserved.
