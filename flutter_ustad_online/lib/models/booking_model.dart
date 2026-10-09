class BookingModel {
  final String bookingId;
  final String userId;
  final String userName;
  final String userPhone;
  final String userAddress;
  final double userLat;
  final double userLng;
  final String? ustadId;
  final String? ustadName;
  final String? ustadPhone;
  final String serviceType; // electrician, plumber, ac, bike, car, carpenter
  final List<String> serviceItems;
  final double price; // in PKR
  final double platformCommission; // 10%
  final double ustadEarning; // 90%
  final String status; // pending, accepted, on_the_way, working, completed, cancelled
  final String paymentMethod; // cash, easypaisa, jazzcash
  final String paymentStatus; // pending, paid
  final String problemDescription;
  final String? problemImageUrl;
  final String urgency; // immediate, scheduled
  final DateTime createdAt;
  final double? rating;
  final String? reviewComment;

  BookingModel({
    required this.bookingId,
    required this.userId,
    required this.userName,
    required this.userPhone,
    required this.userAddress,
    required this.userLat,
    required this.userLng,
    this.ustadId,
    this.ustadName,
    this.ustadPhone,
    required this.serviceType,
    required this.serviceItems,
    required this.price,
    required this.platformCommission,
    required this.ustadEarning,
    required this.status,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.problemDescription,
    this.problemImageUrl,
    required this.urgency,
    required this.createdAt,
    this.rating,
    this.reviewComment,
  });

  Map<String, dynamic> toMap() {
    return {
      'bookingId': bookingId,
      'userId': userId,
      'userName': userName,
      'userPhone': userPhone,
      'userAddress': userAddress,
      'userLat': userLat,
      'userLng': userLng,
      'ustadId': ustadId,
      'ustadName': ustadName,
      'ustadPhone': ustadPhone,
      'serviceType': serviceType,
      'serviceItems': serviceItems,
      'price': price,
      'platformCommission': platformCommission,
      'ustadEarning': ustadEarning,
      'status': status,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentStatus,
      'problemDescription': problemDescription,
      'problemImageUrl': problemImageUrl,
      'urgency': urgency,
      'createdAt': createdAt.toIso8601String(),
      'rating': rating,
      'reviewComment': reviewComment,
    };
  }

  factory BookingModel.fromFirestore(Map<String, dynamic> map, String id) {
    return BookingModel(
      bookingId: id,
      userId: map['userId'] ?? '',
      userName: map['userName'] ?? '',
      userPhone: map['userPhone'] ?? '',
      userAddress: map['userAddress'] ?? '',
      userLat: (map['userLat'] ?? 31.4118).toDouble(),
      userLng: (map['userLng'] ?? 73.0978).toDouble(),
      ustadId: map['ustadId'],
      ustadName: map['ustadName'],
      ustadPhone: map['ustadPhone'],
      serviceType: map['serviceType'] ?? 'electrician',
      serviceItems: List<String>.from(map['serviceItems'] ?? []),
      price: (map['price'] ?? 0).toDouble(),
      platformCommission: ((map['price'] ?? 0) * 0.1).toDouble(),
      ustadEarning: ((map['price'] ?? 0) * 0.9).toDouble(),
      status: map['status'] ?? 'pending',
      paymentMethod: map['paymentMethod'] ?? 'cash',
      paymentStatus: map['paymentStatus'] ?? 'pending',
      problemDescription: map['problemDescription'] ?? '',
      problemImageUrl: map['problemImageUrl'],
      urgency: map['urgency'] ?? 'immediate',
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      rating: map['rating'] != null ? (map['rating'] as num).toDouble() : null,
      reviewComment: map['reviewComment'],
    );
  }
}
