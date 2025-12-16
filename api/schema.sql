-- APC GAT 2027 Database Schema
-- Run this in phpMyAdmin to create tables

-- Members table for membership form submissions
CREATE TABLE IF NOT EXISTS `members` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `lga` VARCHAR(100) NOT NULL,
    `ward` VARCHAR(100) DEFAULT NULL,
    `occupation` VARCHAR(255) DEFAULT NULL,
    `gender` VARCHAR(20) DEFAULT NULL,
    `dob` DATE DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `interests` TEXT DEFAULT NULL,
    `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    `membership_no` VARCHAR(50) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contacts table for contact form submissions
CREATE TABLE IF NOT EXISTS `contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `lga` VARCHAR(100) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin users table
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user
-- DEFAULT PASSWORD: APCAdmin2027@Enugu!
-- IMPORTANT: After running this schema, immediately change the password via phpMyAdmin:
-- 1. Go to phpMyAdmin -> admins table
-- 2. Edit the admin row
-- 3. Generate new hash with: SELECT PASSWORD_HASH('YourNewPassword');
--    Or use PHP: echo password_hash('YourNewPassword', PASSWORD_DEFAULT);
INSERT INTO `admins` (`username`, `password`, `full_name`) VALUES 
('admin', '$2y$10$RkLWCDvYfNv8GsHqgFVbQOD1Oz8vJvVdFXlxFOQnJh5GBL8Jq3Fya', 'Administrator');
