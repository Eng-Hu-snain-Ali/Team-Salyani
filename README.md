# USTAD ONLINE — On-Demand Mechanic & Handyman Service Platform

> **"Reliable Ustads. Transparent Prices."**  
> *Pakistan's premier on-demand skilled labor and technician network, piloting in Faisalabad.*

---

## 🌟 Executive Overview

**USTAD ONLINE** is an on-demand multi-sided platform connecting households and businesses across Pakistan with vetted, verified local handymen and mechanics ("Ustads"). The platform eliminates predatory pricing, untraceable workmanship, and safety risks by offering:

1. **Vetted Professionals**: Identity-verified technicians with secure CNIC and skill checks.
2. **Transparent Rate Cards**: Standardized starting prices in Pakistani Rupees (`PKR / Rs.`), with clear distinction between fixed fees and diagnostic inspection estimates.
3. **End-to-End Tracking**: Real-time simulated status progression from dispatch to completion.
4. **Local Payment Flexibility**: Cash on Delivery (COD), Easypaisa, and JazzCash.
5. **Fair 10% Platform Commission**: Ustads retain 90% of eligible completed earnings.

---

## 🚀 Three Integrated Portals

USTAD ONLINE provides three dedicated, purpose-built portals switchable via the top navigation bar:

### 1. 👤 Customer Mobile Application
- **Phone Authentication**: Clean phone entry with simulated OTP verification (`1234`).
- **Location Selector**: Native Faisalabad sector switching (`D-Ground`, `Kohinoor City`, `Madina Town`, `Peoples Colony`, `Canal Road`, `Ghanta Ghar`, `Gulberg`, `Samanabad`, etc.).
- **6 Core Categories**:
  - ⚡ **Electrician** (Switchboard repair, ceiling fan installation, short circuit diagnosis)
  - 🔧 **Plumber** (Tap repair, pipe leakage, water motor installation)
  - ❄️ **AC Technician** (AC inspection/service, gas refill, inverter troubleshooting)
  - 🏍️ **Bike Mechanic** (Puncture repair, tuning/oil change, brake servicing)
  - 🚗 **Car Mechanic** (Car general inspection, battery jumpstart, brake pad replacement)
  - 🪚 **Carpenter** (Door hinge repair, lock installation, furniture assembly)
- **Service Rate Cards**: Interactive catalog with clear fixed vs. estimated diagnostic pricing.
- **Booking Flow**: Multi-step booking with category selection, issue description, problem photo selector, map pin selection, and urgent vs. scheduled time slots.
- **Live Dispatch Map**: Visualized interactive SVG map of Faisalabad highlighting customer location, nearby ustads, and simulated technician route navigation.
- **Booking Status Stepper**: Synchronized lifecycle: `Pending` ➔ `Accepted` ➔ `On the Way` ➔ `Arrived` ➔ `In Progress` ➔ `Completed`.
- **In-App Communication**: Simulated direct phone call modal and live chat messenger with pre-configured quick replies.
- **Payment Gateway**: Simulated checkout supporting Cash on Delivery, Easypaisa mobile account, and JazzCash wallet.
- **Reviews & Complaints**: Post-job 1–5 star rating with verified feedback, plus formal dispute/complaint filing.

---

### 2. 🧰 Ustad / Mechanic Mobile Application
- **Registration & Verification**: Onboarding flow with photo upload, CNIC details, skill category selection, experience, and trade certification uploads.
- **Document Protection**: Sensitive CNIC and credentials are fully shielded from public customer records.
- **Status Lifecycle**: `Pending` ➔ `Approved` ➔ `Rejected` ➔ `Blocked`. Only verified and approved Ustads can accept jobs.
- **Availability Radar**: Real-time Online/Offline toggle to manage dispatch visibility.
- **Job Request Feed**: Incoming work orders displaying customer problem photos, Faisalabad sector address, estimated price, and Accept/Reject buttons.
- **Active Jobs Stepper**: Complete execution lifecycle for accepted jobs (`Mark Arrived` ➔ `Start Work` ➔ `Mark Completed` with final invoice adjustment).
- **Earnings & Wallet Ledger**:
  - Consistent **10% platform commission calculation** (e.g., Gross Rs. 1,000 = Platform Rs. 100, Net Ustad Rs. 900).
  - Daily, weekly, and monthly net income analytics.
  - Transparent payout withdrawal requests (Easypaisa / JazzCash / Bank transfer).

---

### 3. 🛡️ Admin Web Panel
- **Executive KPI Dashboard**: Live counts for total customers, registered ustads, verified ustads, active/completed bookings, gross booking volume, platform commission, and open disputes.
- **Ustad Verification Audit**: Detailed technician roster with search, status filters, and a secure document modal to inspect CNICs and issue instant Approvals, Rejections, or Account Blocks.
- **Service Catalog & Rate Card Manager**: Add, edit, enable/disable services, and adjust base rates and pricing models (Fixed vs. Inspection Estimate).
- **Bookings Audit Ledger**: Unified log of all historical and active bookings across Faisalabad with complete customer, ustad, financial, and status details.
- **Commission Management**: Real-time platform fee tracking, configurable commission percentage (defaults to 10%), and net payout breakdown.
- **Complaints & Dispute Resolution**: Formal case triage for customer dissatisfaction with status updates (`Investigating`, `Resolved`) and admin resolution notes.
- **Broadcast Notification Composer**: Push announcements directly to customers and ustads across Faisalabad.

---

## 🎨 Design System & Visual Identity

- **Primary Blue**: `#2563EB` (Professional, trustworthy service color)
- **Dark Navy**: `#0F172A` (Header, primary text, high-contrast surfaces)
- **Background**: `#F8FAFC` (Ultra-clean modern slate backdrop)
- **Surface Cards**: `#FFFFFF` (Crisp floating cards with subtle border shadows)
- **Success Green**: `#16A34A` (Active badges, approved statuses, completed jobs)
- **Warning Amber**: `#F59E0B` (Pending verifications, scheduled bookings)
- **Error Red**: `#DC2626` (Cancelled jobs, rejections, blocked ustads)
- **Secondary Slate**: `#64748B` (Subtext, metadata labels)

---

## 🏗️ Technical Stack & Architecture

- **Core**: React 19 + TypeScript + Vite
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Styling**: Vanilla CSS (`src/index.css`) optimized for high-performance responsive layout without bloated third-party CSS frameworks.
- **Architecture**:
  ```
  Team-Salyani/
  ├── src/
  │   ├── components/
  │   │   ├── admin/           # Metrics, Ustad audit, Services CRUD, Bookings, Commission, Complaints
  │   │   ├── auth/            # Phone login, Demo OTP (1234), Splash screen
  │   │   ├── common/          # Header, BottomNav, Interactive FaisalabadMap SVG
  │   │   ├── customer/        # CustomerHome, RateCard, NearbyUstads, Bookings, Tracking, Chat, Payment
  │   │   └── ustad/           # UstadDashboard, RequestsRadar, ActiveJobs, Wallet, RegistrationModal
  │   ├── context/
  │   │   └── AppContext.tsx   # Global reactive state, role switcher, booking state machine, 10% commission
  │   ├── services/
  │   │   └── api/             # Firestore-ready decoupled service layer (auth, bookings, ustads, catalog, etc.)
  │   ├── types/
  │   │   └── index.ts         # Cloud Firestore-aligned typed models
  │   ├── constants/           # 6 categories, Faisalabad sectors, demo rate cards
  │   ├── data/
  │   │   └── mockData.ts      # Seed Ustads, services, initial bookings, and Faisalabad landmarks
  │   ├── App.tsx              # Role router and modal manager
  │   ├── main.tsx             # React DOM entry
  │   └── index.css            # USTAD ONLINE design tokens and responsive utility classes
  ├── docs/
  │   ├── PRD.md               # Product Requirement Document
  │   ├── FIREBASE_SETUP.md    # Production Firebase & Google Maps setup instructions
  │   └── SECURITY_RULES.md    # Production Cloud Firestore security rules
  ├── package.json
  ├── tsconfig.json
  └── vite.config.ts
  ```

---

## 🛡️ Simulation & Transparency Notice

To ensure security and local operability without requiring private production credentials:
- **Phone OTP**: Simulated in-app. Use code `1234` or click "Auto-fill Demo OTP". Real SMS gateways (Twilio / Firebase Auth) are not triggered.
- **Live Maps**: Uses a custom vector-accurate interactive SVG map of Faisalabad. Google Maps API keys are decoupled and documented in `docs/FIREBASE_SETUP.md`.
- **Payments**: Transactions via Cash, Easypaisa, and JazzCash are fully simulated and clearly labeled. No real financial accounts are debited.
- **Chat & Calls**: Operational in-memory interactive modals designed for end-to-end user flow demonstration.

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build check (TypeScript strict verification + Vite bundle)
npm run build
```

Open **`http://localhost:5173`** in your browser. Use the top navigation role switcher to toggle between **Customer**, **Ustad**, and **Admin** personas.

---

## 📄 License & Attribution

Developed for **USTAD ONLINE** (Pakistan). All rights reserved.
