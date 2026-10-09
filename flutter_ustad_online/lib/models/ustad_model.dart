class UstadModel {
  final String ustadId;
  final String name;
  final String phone;
  final String cnic;
  final String skill; // electrician, plumber, ac, bike, car, carpenter
  final int experienceYears;
  final double rating;
  final int totalReviews;
  final int totalJobs;
  final double earningsPKR;
  final bool isVerified;
  final bool isAvailable;
  final String avatarUrl;
  final String locationName;
  final double lat;
  final double lng;
  final List<String> badges;

  UstadModel({
    required this.ustadId,
    required this.name,
    required this.phone,
    required this.cnic,
    required this.skill,
    required this.experienceYears,
    required this.rating,
    required this.totalReviews,
    required this.totalJobs,
    required this.earningsPKR,
    required this.isVerified,
    required this.isAvailable,
    required this.avatarUrl,
    required this.locationName,
    required this.lat,
    required this.lng,
    required this.badges,
  });

  Map<String, dynamic> toMap() {
    return {
      'ustadId': ustadId,
      'name': name,
      'phone': phone,
      'cnic': cnic,
      'skill': skill,
      'experienceYears': experienceYears,
      'rating': rating,
      'totalReviews': totalReviews,
      'totalJobs': totalJobs,
      'earningsPKR': earningsPKR,
      'isVerified': isVerified,
      'isAvailable': isAvailable,
      'avatarUrl': avatarUrl,
      'locationName': locationName,
      'lat': lat,
      'lng': lng,
      'badges': badges,
    };
  }

  factory UstadModel.fromFirestore(Map<String, dynamic> map, String id) {
    return UstadModel(
      ustadId: id,
      name: map['name'] ?? '',
      phone: map['phone'] ?? '',
      cnic: map['cnic'] ?? '',
      skill: map['skill'] ?? 'electrician',
      experienceYears: map['experienceYears'] ?? 0,
      rating: (map['rating'] ?? 5.0).toDouble(),
      totalReviews: map['totalReviews'] ?? 0,
      totalJobs: map['totalJobs'] ?? 0,
      earningsPKR: (map['earningsPKR'] ?? 0).toDouble(),
      isVerified: map['isVerified'] ?? false,
      isAvailable: map['isAvailable'] ?? false,
      avatarUrl: map['avatarUrl'] ?? '',
      locationName: map['locationName'] ?? 'Faisalabad',
      lat: (map['lat'] ?? 31.4118).toDouble(),
      lng: (map['lng'] ?? 73.0978).toDouble(),
      badges: List<String>.from(map['badges'] ?? []),
    );
  }
}
