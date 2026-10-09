# Ustad Online (استاد آن لائن) - Flutter Mobile Application

### On-Demand Handyman & Mechanic Service App for Faisalabad, Pakistan

---

## 📱 Features Included
1. **Customer Module (`lib/screens/customer_home_screen.dart`)**:
   - Location Selector (D-Ground, Peoples Colony, Kohinoor, Madina Town, Susan Road, etc.)
   - 6 Core Trades: Electrician ⚡, Plumber 🔧, AC Technician ❄️, Bike Mechanic 🏍️, Car Mechanic 🚗, Carpenter 🪚.
   - Transparent Fixed Price Rate Cards (PKR rates with zero hidden charges).
   - Doorstep Booking Dispatcher with live Geolocation coordinates.

2. **Ustad Partner Module**:
   - Online / Offline radar listening toggle.
   - Incoming job notification with customer location & distance.
   - 90% Ustad Earning vs 10% Platform fee auto-split.
   - JazzCash & Easypaisa payout flow.

3. **Backend & Firestore Architecture (`lib/services/firebase_service.dart`)**:
   - `users` collection: Customer profile & phone OTP authentication.
   - `ustads` collection: CNIC verification, trade skills, rating, coordinates.
   - `bookings` collection: End-to-end lifecycle (pending -> accepted -> on_the_way -> working -> completed).
   - `reviews` collection: 1-5 star feedback with praise tags.

---

## 🚀 How to Run the Flutter Project

### 1. Prerequisites
- Install Flutter SDK (version `>= 3.0.0`): `flutter --version`
- Android Studio with Android SDK or VS Code with Flutter Extension

### 2. Install Dependencies
```bash
cd flutter_ustad_online
flutter pub get
```

### 3. Setup Firebase
1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Run FlutterFire CLI:
   ```bash
   npm install -g firebase-tools
   dart pub global activate flutterfire_cli
   flutterfire configure
   ```
3. Enable **Phone Authentication**, **Cloud Firestore**, and **Firebase Cloud Messaging**.

### 4. Run on Device / Emulator
```bash
flutter run
```
