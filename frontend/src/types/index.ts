// ============================================================================
// USTAD ONLINE — DOMAIN CONTRACTS & DATA MODELS
// On-Demand Mechanic & Handyman Service Platform for Pakistan (Faisalabad)
// Designed for Cloud Firestore & Client State
// ============================================================================

export type UserRole = 'customer' | 'ustad' | 'admin';

export type ServiceCategoryType =
  | 'electrician'
  | 'plumber'
  | 'ac-technician'
  | 'bike-mechanic'
  | 'car-mechanic'
  | 'carpenter';

export type PricingType = 'fixed' | 'estimated';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PaymentMethod = 'cash' | 'easypaisa' | 'jazzcash';

export type PaymentStatus = 'unpaid' | 'paid';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export type ComplaintStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

// ----------------------------------------------------------------------------
// 1. User Model (collection: 'users')
// ----------------------------------------------------------------------------
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  role: UserRole;
  address: string;
  area: string; // Faisalabad area: D-Ground, Kohinoor, etc.
  lat: number;
  lng: number;
  savedAddresses?: Array<{
    id: string;
    label: string;
    address: string;
    area: string;
  }>;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 2. Ustad / Mechanic Model (collection: 'ustads')
// ----------------------------------------------------------------------------
export interface Ustad {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  cnicMasked: string; // e.g., '33100-*******-1' for privacy
  cnicFull?: string; // Stored securely, never exposed in public profiles
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  skillCategories: ServiceCategoryType[];
  experienceYears: number;
  rating: number; // e.g. 4.85
  reviewCount: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  isAvailable: boolean; // Availability toggle
  serviceArea: string; // e.g., 'D-Ground & Peoples Colony, Faisalabad'
  lat: number;
  lng: number;
  bio: string;
  startingPrice: number;
  certificateUrl?: string;
  completedJobsCount: number;
  walletBalance: number;
  todayEarnings: number;
  totalEarnings: number;
  joinedAt: string;
}

// ----------------------------------------------------------------------------
// 3. Service Categories & Items (collection: 'services')
// ----------------------------------------------------------------------------
export interface ServiceCategory {
  id: ServiceCategoryType;
  name: string;
  iconName: string;
  description: string;
  startingPrice: number;
  samplePriceLabel: string;
  badge: string;
  color: string;
  bannerImage: string;
}

export interface ServiceItem {
  id: string;
  categoryId: ServiceCategoryType;
  name: string;
  description: string;
  price: number;
  pricingType: PricingType;
  isActive: boolean;
  estimatedMinutes: number;
  iconName?: string;
  popular?: boolean;
  possibleExtraCharges?: string[];
}

// ----------------------------------------------------------------------------
// 4. Booking Model (collection: 'bookings')
// ----------------------------------------------------------------------------
export interface Booking {
  id: string; // e.g., 'UST-8492'
  userId: string;
  userName: string;
  userPhone: string;
  ustadId?: string;
  ustadName?: string;
  ustadPhone?: string;
  ustadAvatar?: string;
  ustadRating?: number;
  serviceId: string;
  serviceName: string;
  categoryId: ServiceCategoryType;
  problemDescription: string;
  problemImageUrl?: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  status: BookingStatus;
  statusTimeline: Array<{
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }>;
  pricingType: PricingType;
  estimatedPrice: number;
  finalPrice?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  scheduleType: 'now' | 'scheduled';
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  ustadCurrentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: string;
    distanceKm: number;
    etaMinutes: number;
  };
}

// ----------------------------------------------------------------------------
// 5. Review Model (collection: 'reviews')
// ----------------------------------------------------------------------------
export interface Review {
  id: string;
  bookingId: string;
  ustadId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 6. Complaint Model (collection: 'complaints')
// ----------------------------------------------------------------------------
export interface Complaint {
  id: string; // e.g., 'CMP-1024'
  bookingId: string;
  userId: string;
  userName: string;
  userPhone: string;
  ustadId?: string;
  ustadName?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 7. Transaction & Commission Model (collection: 'transactions')
// ----------------------------------------------------------------------------
export interface Transaction {
  id: string;
  bookingId: string;
  ustadId: string;
  ustadName: string;
  grossAmount: number;
  commissionRate: number; // 0.10 (10%)
  commissionAmount: number; // e.g. Rs. 100 on Rs. 1000
  netAmount: number; // e.g. Rs. 900 on Rs. 1000
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending';
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 8. Withdrawal Model (collection: 'withdrawals')
// ----------------------------------------------------------------------------
export interface WithdrawalRequest {
  id: string;
  ustadId: string;
  ustadName: string;
  amount: number;
  payoutMethod: 'easypaisa' | 'jazzcash' | 'bank';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  status: WithdrawalStatus;
  notes?: string;
  requestedAt: string;
  processedAt?: string;
}

// ----------------------------------------------------------------------------
// 9. Notification Model (collection: 'notifications')
// ----------------------------------------------------------------------------
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'system' | 'payment' | 'verification';
  targetRole: 'customer' | 'ustad' | 'all';
  isRead: boolean;
  relatedBookingId?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// 10. Communication (Simulated In-App Chat & Call)
// ----------------------------------------------------------------------------
export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'ustad' | 'system';
  message: string;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// 11. Faisalabad Geographic Area
// ----------------------------------------------------------------------------
export interface FaisalabadArea {
  id: string;
  name: string;
  urduName?: string;
  lat: number;
  lng: number;
  radiusKm: number;
  popularFor: string;
}

// ----------------------------------------------------------------------------
// 12. App Navigation Tabs per Persona
// ----------------------------------------------------------------------------
export type CustomerTabId = 'home' | 'services' | 'ustads' | 'bookings' | 'profile';
export type UstadTabId = 'dashboard' | 'requests' | 'active_jobs' | 'wallet' | 'profile';
export type AdminTabId = 'overview' | 'ustads' | 'services' | 'bookings' | 'commission' | 'complaints';

// Generic API response contract
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
