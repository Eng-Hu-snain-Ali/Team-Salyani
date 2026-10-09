-- Migration 001: Create all ENUM types
-- Run this FIRST before any table creation

CREATE TYPE user_role AS ENUM ('customer', 'ustad', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'under_review', 'verified', 'rejected');
CREATE TYPE document_type AS ENUM ('cnic_front', 'cnic_back', 'skill_certificate', 'experience_letter');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'paid', 'cancelled', 'expired');
CREATE TYPE payment_method AS ENUM ('cash', 'easypaisa', 'jazzcash');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'withdrawal', 'commission');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system');
CREATE TYPE notification_type AS ENUM (
  'new_booking_request',
  'booking_accepted',
  'booking_rejected',
  'booking_cancelled',
  'booking_completed',
  'payment_received',
  'review_received',
  'kyc_approved',
  'kyc_rejected',
  'new_message',
  'system_announcement'
);
CREATE TYPE price_unit AS ENUM ('fixed', 'per_hour', 'per_visit');
CREATE TYPE admin_role AS ENUM ('super_admin', 'moderator');
