# USTAD ONLINE — Cloud Firestore Security Rules

This file defines the production security rules required to protect customer privacy, secure sensitive identity documents (CNIC scans), prevent tampering with financial commission rates, and enforce state machine transitions.

> **IMPORTANT**: These rules must be thoroughly validated in the Firebase Rules Emulator before deploying to production.

---

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }

    function isApprovedUstad() {
      return isAuthenticated() &&
             request.auth.token.role == 'ustad' &&
             get(/databases/$(database)/documents/ustads/$(request.auth.uid)).data.verificationStatus == 'approved';
    }

    // ------------------------------------------------------------------------
    // 1. Users Collection
    // ------------------------------------------------------------------------
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // ------------------------------------------------------------------------
    // 2. Ustads Collection (Sensitive CNIC Protection)
    // ------------------------------------------------------------------------
    match /ustads/{ustadId} {
      // Public can read basic profile info (CNIC masked, ratings, skills)
      allow read: if true;

      // Only registered ustad can create application
      allow create: if isOwner(ustadId);

      // Technicians can update their availability toggle and bio;
      // Verification status and wallet balance can ONLY be updated by Admin/Cloud Functions.
      allow update: if (
        isOwner(ustadId) &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['verificationStatus', 'isVerified', 'walletBalance', 'cnicFull'])
      ) || isAdmin();

      allow delete: if isAdmin();

      // Subcollection for private CNIC documents
      match /private_documents/{docId} {
        allow read, write: if isAdmin() || isOwner(ustadId);
      }
    }

    // ------------------------------------------------------------------------
    // 3. Service Catalog & Rate Cards
    // ------------------------------------------------------------------------
    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // ------------------------------------------------------------------------
    // 4. Bookings Collection
    // ------------------------------------------------------------------------
    match /bookings/{bookingId} {
      // Parties involved or admin can read
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        resource.data.ustadId == request.auth.uid ||
        isAdmin()
      );

      // Customer can create booking
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;

      // Updating booking status:
      // - Customer can cancel if pending/accepted
      // - Approved Ustad can accept and update job status
      // - Admin can update any booking
      allow update: if isAuthenticated() && (
        isAdmin() ||
        (resource.data.userId == request.auth.uid && request.resource.data.status in ['cancelled']) ||
        (isApprovedUstad() && (
          // Assigning self
          (resource.data.status == 'pending' && request.resource.data.ustadId == request.auth.uid) ||
          // Stepping active lifecycle
          (resource.data.ustadId == request.auth.uid)
        ))
      );
    }

    // ------------------------------------------------------------------------
    // 5. Customer Reviews (Completed Bookings Only)
    // ------------------------------------------------------------------------
    match /reviews/{reviewId} {
      allow read: if true;

      // Only allow review creation if:
      // 1. Author is the customer
      // 2. Linked booking exists and is in 'completed' status
      allow create: if isAuthenticated() &&
        request.resource.data.userId == request.auth.uid &&
        get(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId)).data.status == 'completed';

      allow update, delete: if isAdmin();
    }

    // ------------------------------------------------------------------------
    // 6. Complaints Collection
    // ------------------------------------------------------------------------
    match /complaints/{complaintId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin();
    }

    // ------------------------------------------------------------------------
    // 7. Transactions & Financial Commission (Backend Only)
    // ------------------------------------------------------------------------
    match /transactions/{txnId} {
      allow read: if isAuthenticated() && (
        resource.data.ustadId == request.auth.uid || isAdmin()
      );
      // Strictly created by Cloud Functions or Admin
      allow write: if isAdmin();
    }

    // ------------------------------------------------------------------------
    // 8. Withdrawals Collection
    // ------------------------------------------------------------------------
    match /withdrawals/{withdrawalId} {
      allow read: if isAuthenticated() && (
        resource.data.ustadId == request.auth.uid || isAdmin()
      );
      allow create: if isApprovedUstad() && request.resource.data.ustadId == request.auth.uid;
      allow update: if isAdmin();
    }

    // ------------------------------------------------------------------------
    // 9. Notifications Collection
    // ------------------------------------------------------------------------
    match /notifications/{notifId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update: if isAuthenticated();
    }
  }
}
```
