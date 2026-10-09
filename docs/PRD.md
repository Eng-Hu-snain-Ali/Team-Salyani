# USTAD ONLINE — Product Requirements Document (PRD)

> **"Reliable Ustads. Transparent Prices."**
> On-Demand Mechanic & Handyman Service Platform for Pakistan (Faisalabad Pilot)

---

## 1. Executive Summary & Objective

**USTAD ONLINE** is an on-demand service marketplace designed for Pakistan, connecting homeowners, motorists, and businesses in Faisalabad with nearby verified mechanics, technicians, and handymen ("Ustads").

The platform solves core pain points in Pakistan's unorganized home services market:
- **Price Transparency**: Upfront fixed labor prices and clear diagnostic rates in Pakistani Rupees (PKR / Rs.).
- **Verified Professionals**: Mandatory NADRA CNIC verification, police character certificates, and skill vetting.
- **Fast Local Dispatch**: 25-minute doorstep dispatch across Faisalabad sectors (D-Ground, Peoples Colony, Kohinoor City, Madina Town, Clock Tower / Ghanta Ghar, Samanabad, Canal Road).
- **Separation of Personas**: Dedicated Customer App, Ustad / Mechanic Portal, and Admin Web Panel.

---

## 2. Six Core Service Categories

1. **Electrician**:
   - Switchboard repair / replacement: Rs. 300 (Fixed labor)
   - Ceiling fan repair & mounting: Rs. 500 (Fixed labor)
   - Short circuit diagnostic: Rs. 600 (Inspection-based)
   - Inverter & UPS wiring: Rs. 900 (Fixed labor)

2. **Plumber**:
   - Tap / faucet leak repair: Rs. 400 (Fixed labor)
   - Drainage pipe unclogging: Rs. 650 (Inspection-based)
   - Water motor pump repair: Rs. 850 (Inspection-based)
   - Overhead water tank cleaning: Rs. 1,400 (Fixed labor)

3. **AC Technician**:
   - AC diagnostic & cooling inspection: Rs. 500 (Inspection-based)
   - Split AC master chemical wash: Rs. 1,500 (Fixed labor)
   - Refrigerant gas top-up (R32/R410A): Rs. 2,800 (Inspection-based)
   - AC installation / relocation: Rs. 2,200 (Fixed labor)

4. **Bike Mechanic**:
   - Doorstep puncture repair (tube/tubeless): Rs. 200 (Fixed labor)
   - Motorcycle tuning & engine oil service: Rs. 450 (Fixed labor)
   - Brake shoe replacement: Rs. 350 (Fixed labor)
   - Chain & sprocket kit replacement: Rs. 500 (Fixed labor)

5. **Car Mechanic**:
   - Roadside engine diagnostic: Rs. 800 (Inspection-based)
   - Emergency battery jumpstart: Rs. 600 (Fixed labor)
   - Brake pad replacement: Rs. 1,200 (Fixed labor)
   - Full doorstep oil & filter service: Rs. 900 (Fixed labor)

6. **Carpenter**:
   - Door hinge repair & alignment: Rs. 300 (Fixed labor)
   - Main door lock / deadbolt replacement: Rs. 550 (Fixed labor)
   - Sliding wardrobe roller & track fix: Rs. 700 (Inspection-based)
   - Furniture assembly & shelving: Rs. 850 (Inspection-based)

---

## 3. Personas & Platform Architecture

### A. Customer Mobile Web Experience
- **Locality Selector**: Choose Faisalabad service sector (D-Ground, Kohinoor City, Madina Town, etc.).
- **Live Search**: Instant autocomplete search across services and categories.
- **Service Rate Card**: Upfront pricing breakdown distinguishing fixed labor vs inspection-required repairs, with warnings regarding potential spare part costs.
- **Booking Dispatch Flow**: 4-step wizard with category/service selection, problem description, photo attachment, Faisalabad address/landmark, timing (Immediate vs Scheduled), and payment selection.
- **Live Tracking & Stepper**: Real-time simulated status stepper:
  `Pending` → `Accepted` → `On the Way` → `Arrived` → `In Progress` → `Completed` (plus `Cancelled`/`Rejected`).
- **Simulated Communication**: In-app chat with quick replies and direct simulated VoIP dialer.
- **Payments**: Cash on Delivery (COD), Easypaisa, JazzCash with printable digital invoice receipts.
- **Verified Reviews & Complaints**: Rating 1 to 5 stars (restricted to completed jobs) and formal complaint ticketing.

### B. Ustad / Mechanic Experience
- **Registration & Verification**: Name, phone, CNIC (e.g. `33100-XXXXXXX-X`), document upload previews (CNIC front/back, certificates), experience years, service area, and workshop bio.
- **Worker Dashboard**: Today's earnings (Rs.), total completed jobs, pending requests count, 4.9★ rating, and instant **Online/Offline Availability Toggle**.
- **Job Requests**: Incoming request cards displaying customer problem description, photo, address, estimated fee, and Accept/Reject buttons (restricted to approved Ustads).
- **Active Job Stepper**: Step through state transitions: `Arrived` → `Start Work` → `Complete Work` with final amount adjustment for extra parts purchased.
- **External Navigation**: Direct Google Maps link for turn-by-turn directions to the customer's address.
- **Earnings & Wallet**:
  - Consistent **10% platform commission calculation**:
    - For a Rs. 1,000 eligible job: Gross: Rs. 1,000 | Commission (10%): Rs. 100 | Ustad Net: Rs. 900.
  - Withdrawal request form to JazzCash, Easypaisa, or Bank with status tracking (`Pending` → `Approved`).

### C. Admin Web Panel
- **Executive KPI Dashboard**: Total customers, registered Ustads, pending verification queue, verified Ustads, active dispatches, completed jobs, gross transacted value, platform commission collected, and open complaints.
- **Ustad Verification Desk**: Search, filter by skill/verification status, audit submitted CNIC documents in an encrypted modal, Approve, Reject, or Block/Unblock technicians.
- **Service Catalog & Pricing Engine**: Add new services, edit rates, toggle Fixed vs Estimated pricing, and enable/disable services with instant sync to customer rate cards.
- **Bookings Ledger**: Audit trail with status filter, customer details, assigned technician, and live tracking map link.
- **Commission Management**: Configurable platform commission rate (default 10%), financial audit ledger, and disbursement tracking.
- **Complaints & Broadcasts**: Customer dispute triage with resolution notes, and system-wide notification broadcaster to Customers, Ustads, or All.

---

## 4. Cloud Firestore Collections Schema

| Collection | Key Fields |
|---|---|
| `users` | `id`, `name`, `phone`, `email`, `role`, `address`, `area`, `lat`, `lng`, `savedAddresses`, `createdAt` |
| `ustads` | `id`, `name`, `phone`, `avatar`, `cnicMasked`, `cnicFull`, `cnicFrontUrl`, `cnicBackUrl`, `skillCategories`, `experienceYears`, `rating`, `reviewCount`, `isVerified`, `verificationStatus`, `isAvailable`, `serviceArea`, `lat`, `lng`, `walletBalance`, `todayEarnings`, `totalEarnings` |
| `services` | `id`, `categoryId`, `name`, `description`, `price`, `pricingType`, `isActive`, `estimatedMinutes`, `possibleExtraCharges` |
| `bookings` | `id`, `userId`, `userName`, `userPhone`, `ustadId`, `ustadName`, `serviceId`, `serviceName`, `categoryId`, `problemDescription`, `address`, `area`, `status`, `statusTimeline`, `estimatedPrice`, `finalPrice`, `paymentMethod`, `paymentStatus`, `createdAt` |
| `reviews` | `id`, `bookingId`, `ustadId`, `userId`, `userName`, `rating`, `comment`, `tags`, `createdAt` |
| `complaints` | `id`, `bookingId`, `userId`, `userName`, `userPhone`, `ustadId`, `subject`, `description`, `status`, `resolutionNotes`, `createdAt` |
| `transactions` | `id`, `bookingId`, `ustadId`, `grossAmount`, `commissionRate`, `commissionAmount`, `netAmount`, `paymentMethod`, `status`, `createdAt` |
| `withdrawals` | `id`, `ustadId`, `ustadName`, `amount`, `payoutMethod`, `accountTitle`, `accountNumber`, `bankName`, `status`, `requestedAt` |
| `notifications` | `id`, `title`, `message`, `type`, `targetRole`, `isRead`, `relatedBookingId`, `createdAt` |

---

## 5. Security & Privacy Commitments

1. **Identity Protection**: CNIC numbers are masked on public customer profiles (e.g., `33100-*******-1`). Raw CNIC scans and police clearance files are accessible only by authorized administrators.
2. **Eligibility Gates**: Ustads in `pending`, `rejected`, or `blocked` status cannot accept jobs or appear online.
3. **Completed-Only Reviews**: Rating and review forms strictly require a completed booking state.
4. **Commission Verification**: Commission and payouts are calculated deterministically at 10% without relying on presentation-layer assumptions.
