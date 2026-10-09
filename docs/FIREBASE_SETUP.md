# USTAD ONLINE — Firebase & External Services Setup Guide

This document describes how to configure the production cloud backends for **USTAD ONLINE**. The current frontend includes functional, type-safe mock services in `src/services/api/` that mirror this architecture 1:1.

---

## 1. Firebase Project Creation

1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project: `ustad-online-pk`.
3. Enable Google Analytics (optional).
4. Register a Web App in the console:
   - App Nickname: `Ustad Online Web Client`
   - Copy the configuration object into your frontend `.env` file:
     ```env
     VITE_FIREBASE_API_KEY="your-api-key"
     VITE_FIREBASE_AUTH_DOMAIN="ustad-online-pk.firebaseapp.com"
     VITE_FIREBASE_PROJECT_ID="ustad-online-pk"
     VITE_FIREBASE_STORAGE_BUCKET="ustad-online-pk.appspot.com"
     VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
     VITE_FIREBASE_APP_ID="your-app-id"
     ```

---

## 2. Firebase Authentication (Phone OTP)

1. In Firebase Console, go to **Build** → **Authentication** → **Sign-in method**.
2. Enable **Phone**:
   - Add test phone numbers for local development:
     - Phone: `+923008645123`, Verification Code: `123456`
     - Phone: `+923017712345`, Verification Code: `123456`
3. Web Implementation:
   - Use `firebase/auth` with `RecaptchaVerifier`:
     ```typescript
     import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

     const auth = getAuth();
     window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
       size: 'invisible',
     });

     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
     // Prompt user for 6-digit OTP code received via SMS
     await confirmationResult.confirm(otpCode);
     ```

---

## 3. Cloud Firestore Database

1. In Firebase Console, navigate to **Build** → **Firestore Database**.
2. Select **Start in production mode**.
3. Choose region: `asia-south1` (Mumbai) or nearest low-latency region for Pakistan.
4. Collections layout:
   - `users`: Customer profiles and addresses.
   - `ustads`: Verified technicians, masked CNIC, and availability.
   - `services`: Service rate cards and prices.
   - `bookings`: Dispatch records, status steppers, and pricing.
   - `reviews`: Customer feedback (restricted to completed bookings).
   - `complaints`: Dispute tickets for admin triage.
   - `transactions`: 10% platform commission financial records.
   - `withdrawals`: Technician payout disbursement requests.
   - `notifications`: Broadcast and targeted alert tray messages.

---

## 4. Firebase Storage (Identity & Fault Photos)

1. In Firebase Console, navigate to **Build** → **Storage**.
2. Create standard storage bucket:
   - Directory `/problem_photos/{bookingId}/`: Customer fault snapshots.
   - Directory `/ustad_docs/{ustadId}/`: Encrypted CNIC front/back copies and certificates.
   - Directory `/avatars/{userId}/`: Profile photos.
3. Access Control: Protect `/ustad_docs/` so that only administrators can read raw CNIC files.

---

## 5. Firebase Cloud Messaging (Push Notifications)

1. Enable **Cloud Messaging** in Firebase Console.
2. In the Web App settings, generate a **Web Push Certificate** (VAPID Key):
   ```env
   VITE_FIREBASE_VAPID_KEY="your-vapid-key"
   ```
3. Register a service worker (`public/firebase-messaging-sw.js`) to handle background notifications:
   - Incoming job requests for Ustads.
   - Ustad "On the Way" dispatch updates for Customers.
   - Admin broadcast announcements.

---

## 6. Google Maps Platform & Geolocation

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API (New)**
   - **Directions API**
   - **Geocoding API**
3. Create an API Key and restrict it by HTTP referrers:
   - Allowed referrers: `https://ustadonline.pk/*`, `http://localhost:5173/*`
4. Add to `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY="your-google-maps-key"
   ```
5. Default Map Coordinates:
   - Faisalabad Central (Ghanta Ghar / Clock Tower): `Lat 31.4187, Lng 73.0791`
   - D-Ground Commercial Sector: `Lat 31.4124, Lng 73.0978`
   - Kohinoor City: `Lat 31.4082, Lng 73.1165`
