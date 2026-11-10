-- ============================================================
-- RENTIFA USERS & PROFILES SEED
-- File: database/user.sql
-- Description: Data awal pengguna Admin & Customer
-- ============================================================

-- Keterangan Hash Sandi (Cost Factor: 10):
-- 'admin123' -> $2a$10$lRewHvjtPrYZK4TQy.TWDemBMqwIEy/.IVoB7x/2KfqrjzZJNP2ia
-- 'user123'  -> $2a$10$acaXGauv/3buNdwQWeOgu.iab3LLDclrH64xVMsSxd9Lp/otgUfMm

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Akun Administrator
INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at) 
VALUES (
  1, 
  'admin@rentifa.com', 
  '$2a$10$lRewHvjtPrYZK4TQy.TWDemBMqwIEy/.IVoB7x/2KfqrjzZJNP2ia', 
  'admin', 
  1, 
  NOW(), 
  NOW()
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  is_active = VALUES(is_active),
  updated_at = NOW();

INSERT INTO customer_profiles (id, user_id, full_name, phone_number, address, city, created_at, updated_at) 
VALUES (
  1, 
  1, 
  'Administrator Rentifa', 
  '081234567890', 
  'Kantor Pusat Rentifa', 
  'Jakarta', 
  NOW(), 
  NOW()
)
ON DUPLICATE KEY UPDATE 
  full_name = VALUES(full_name),
  phone_number = VALUES(phone_number),
  address = VALUES(address),
  city = VALUES(city),
  updated_at = NOW();

-- 2. Akun Customer (Pelanggan)
INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at) 
VALUES (
  2, 
  'budi@gmail.com', 
  '$2a$10$acaXGauv/3buNdwQWeOgu.iab3LLDclrH64xVMsSxd9Lp/otgUfMm', 
  'customer', 
  1, 
  NOW(), 
  NOW()
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  is_active = VALUES(is_active),
  updated_at = NOW();

INSERT INTO customer_profiles (id, user_id, full_name, phone_number, address, city, created_at, updated_at) 
VALUES (
  2, 
  2, 
  'Budi Santoso', 
  '085712345678', 
  'Jl. Sudirman No. 45', 
  'Jakarta', 
  NOW(), 
  NOW()
)
ON DUPLICATE KEY UPDATE 
  full_name = VALUES(full_name),
  phone_number = VALUES(phone_number),
  address = VALUES(address),
  city = VALUES(city),
  updated_at = NOW();

SET FOREIGN_KEY_CHECKS = 1;
