-- Chạy lệnh này trong MySQL Workbench hoặc phpMyAdmin để cập nhật bảng users
ALTER TABLE users CHANGE COLUMN name full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN address TEXT;
ALTER TABLE users ADD COLUMN avatar VARCHAR(255);
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';
