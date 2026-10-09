import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/booking_model.dart';
import '../models/ustad_model.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Stream of nearby available ustads filtered by skill
  Stream<List<UstadModel>> getNearbyUstadsStream({String? skill}) {
    Query query = _firestore
        .collection('ustads')
        .where('isVerified', isEqualTo: true)
        .where('isAvailable', isEqualTo: true);

    if (skill != null && skill.isNotEmpty) {
      query = query.where('skill', isEqualTo: skill);
    }

    return query.snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return UstadModel.fromFirestore(doc.data() as Map<String, dynamic>, doc.id);
      }).toList();
    });
  }

  // Create new customer job booking
  Future<String> createBooking(BookingModel booking) async {
    final docRef = await _firestore.collection('bookings').add(booking.toMap());
    return docRef.id;
  }

  // Update booking status (accepted, on_the_way, completed)
  Future<void> updateBookingStatus(String bookingId, String newStatus) async {
    await _firestore.collection('bookings').doc(bookingId).update({
      'status': newStatus,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // Stream of active booking for customer
  Stream<BookingModel?> getActiveBookingStream(String bookingId) {
    return _firestore.collection('bookings').doc(bookingId).snapshots().map((doc) {
      if (!doc.exists) return null;
      return BookingModel.fromFirestore(doc.data() as Map<String, dynamic>, doc.id);
    });
  }

  // Stream of incoming job requests for ustad
  Stream<List<BookingModel>> getIncomingJobsStream(String skill) {
    return _firestore
        .collection('bookings')
        .where('status', isEqualTo: 'pending')
        .where('serviceType', isEqualTo: skill)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return BookingModel.fromFirestore(doc.data() as Map<String, dynamic>, doc.id);
      }).toList();
    });
  }

  // Submit customer review
  Future<void> submitReview({
    required String bookingId,
    required String ustadId,
    required String userId,
    required double rating,
    required String comment,
  }) async {
    await _firestore.collection('reviews').add({
      'bookingId': bookingId,
      'ustadId': ustadId,
      'userId': userId,
      'rating': rating,
      'comment': comment,
      'createdAt': FieldValue.serverTimestamp(),
    });

    // Update booking rating
    await _firestore.collection('bookings').doc(bookingId).update({
      'rating': rating,
      'reviewComment': comment,
    });
  }
}
