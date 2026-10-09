# Ustad Online

**On-Demand Mechanic & Handyman Service Platform**

- **Type:** Final Year Project Synopsis
- **Location:** Faisalabad, Pakistan
- **Stack:** Flutter & Firebase

---

## 1. Problem Statement (Market Breakdown)

| Problem | Description |
|---|---|
| Fragmented Local Market | No centralized digital directory for mechanics in Faisalabad. |
| Lack of Vetting & Safety | No background checks, CNIC validation, or rating history. |
| Arbitrary Overcharging | Zero pricing transparency leading to customer exploitation. |
| Severe Time Inefficiency | Customers waste hours physically scouting market workshops. |

---

## 2. Project Objectives (Core Goals)

1. **1-Click Booking:** Instant dispatch of nearby certified technicians.
2. **Fixed Price Cards:** Transparent baseline rates for common repairs.
3. **CNIC Verification:** Identity and skill verification for user safety.
4. **Trust Network:** Peer rating system and transparent grievance portal.

---

## 3. Key Value Deliverables (Platform Metrics)

| Metric | Value | Description |
|---|---|---|
| Platform Commission | **10%** | Fair model per successful job |
| Essential Service Trades | **6+** | Electrician, Plumber, AC, Mechanics |
| Days Delivery Window | **25** | Rapid agile implementation cycle |

---

## 4. User App (Customer Module)

Mobile interface for customers.

- **Phone OTP Sign-In:** Seamless onboarding using localized SMS authentication.
- **Job Dispatch with Geotag:** Upload photo, fault notes, and live GPS map pin.
- **Live Tracking & In-App Chat:** Monitor Ustad movement on map with real-time communication.
- **Local Gateways:** Pay via Cash, Easypaisa, or JazzCash upon completion.

---

## 5. Ustad App (Mechanic Module)

Provider interface for mechanics.

1. **KYC Registration:** Submit CNIC photo, skill certificates, and field experience details.
2. **Smart Dispatch:** Receive real-time job requests with option to Accept or Reject.
3. **Wallet & Earnings:** Track daily payouts, view job histories, and request withdrawals.

---

## 6. Web Admin Panel & Business Model (Management & Monetization)

- **Verification Control:** Audit mechanic documents, approve accounts, or block violators.
- **Rate Card Engine:** Dynamically update fixed rates per trade (e.g., Switch Board Repair: 300 PKR).
- **10% Revenue Cut:** For a 1000 PKR job, Ustad receives 900 PKR, platform retains 100 PKR commission.

---

## 7. Technology Stack (Architecture)

| Layer | Technology |
|---|---|
| Frontend Apps | Flutter (single codebase for Android & iOS) |
| Backend Infrastructure | Firebase Auth, Cloud Firestore, FCM, Cloud Storage |
| Geo Services | Google Maps API & Geolocator Plugin |
| Admin Web Portal | Flutter Web / React.js administrative dashboard |

**Notification flow (FCM):**
1. Message building and targeting (Notifications Console GUI, Admin SDK, HTTP)
2. FCM backend
3. Platform-level message transport (Android transport layer, iOS / APNs, Web Push)
4. SDK on device

---

## 8. Database Schema Collections (Cloud Firestore)

| Collection | Key Fields & Attributes |
|---|---|
| `users` | userId, name, phone, address, lat, lng |
| `ustads` | ustadId, name, phone, cnic, skill, rating, isVerified, isAvailable, lat, lng |
| `bookings` | bookingId, userId, ustadId, serviceType, problemImageUrl, status, price, date |
| `reviews` | reviewId, bookingId, ustadId, userId, rating (1-5), comment |

---

## 9. End-to-End System Workflow (Execution Flow)

| Step | Name | Description |
|---|---|---|
| 01 | Post Job | User posts issue with live GPS location. |
| 02 | Match Ustad | Firebase alerts available nearby ustads. |
| 03 | Accept Job | Ustad accepts request and navigates. |
| 04 | Complete Work | Job completed and cash/wallet paid. |
| 05 | Review | User rates technician performance. |

---

## 10. 25-Day Project Roadmap (Implementation Plan)

| Week | Focus | Tasks |
|---|---|---|
| Week 1 | Foundation | UI design system and Firebase backend initialization. |
| Week 2 | User App | Booking flows, job post module, and price card logic. |
| Week 3 | Provider & Maps | Ustad App development and Google Maps integration. |
| Week 4 | Admin & Testing | Admin portal development, QA testing, and final report. |

---

## 11. Future Expansion (Next Horizon)

- Scale to major metro hubs (Lahore & Islamabad)
- B2B monthly subscriptions for commercial shops
- Integrated marketplace for auto & hardware spare parts

---

## Notes

- Frontend (mobile apps and admin panel) is being built by a separate team. This project covers the **backend only**.
- Image sources in the original PDF: mrtask.com (dispatch screenshot) and firebase.google.com (FCM diagram). These were used only as illustrations in the synopsis.
