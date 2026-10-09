-- Migration 003: Create all performance indexes
-- Run AFTER 002_create_tables.sql

-- Users
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Ustads
CREATE INDEX idx_ustads_auth_user_id ON ustads(auth_user_id);
CREATE INDEX idx_ustads_phone ON ustads(phone);
CREATE INDEX idx_ustads_cnic ON ustads(cnic_number);
CREATE INDEX idx_ustads_verification ON ustads(verification_status);
CREATE INDEX idx_ustads_available ON ustads(is_available, is_active, verification_status);
CREATE INDEX idx_ustads_location ON ustads(lat, lng);

-- Ustad Documents
CREATE INDEX idx_ustad_docs_ustad_id ON ustad_documents(ustad_id);
CREATE INDEX idx_ustad_docs_status ON ustad_documents(status);

-- Ustad Skills
CREATE INDEX idx_ustad_skills_ustad_id ON ustad_skills(ustad_id);
CREATE INDEX idx_ustad_skills_service_id ON ustad_skills(service_id);

-- User Addresses
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_ustad_id ON bookings(ustad_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_sub_service_id ON bookings(sub_service_id);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_location ON bookings(customer_lat, customer_lng);

-- Booking Status History
CREATE INDEX idx_booking_history_booking_id ON booking_status_history(booking_id);

-- Reviews
CREATE INDEX idx_reviews_ustad_id ON reviews(ustad_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);

-- Chat
CREATE INDEX idx_chat_rooms_booking_id ON chat_rooms(booking_id);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(chat_room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Payments
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_ustad_id ON payments(ustad_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Wallets
CREATE INDEX idx_wallets_ustad_id ON wallets(ustad_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, recipient_role);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Admins
CREATE INDEX idx_admins_email ON admins(email);
