-- Migration script to update database to simplified schema
-- Run this script to fix the foreign key constraint issues

USE CWSMS;

-- First, drop all foreign key constraints
ALTER TABLE ServicePackage DROP FOREIGN KEY servicepackage_ibfk_1;
ALTER TABLE ServicePackage DROP FOREIGN KEY servicepackage_ibfk_2;
ALTER TABLE Payment DROP FOREIGN KEY payment_ibfk_1;

-- Drop existing tables to recreate with new schema
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS ServicePackage;
DROP TABLE IF EXISTS Package;

-- Recreate ServicePackage table (simplified - only RecordNumber and ServiceDate)
CREATE TABLE ServicePackage (
    RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
    ServiceDate DATE NOT NULL
);

-- Recreate Payment table (simplified - only PaymentNumber, AmountPaid, PaymentDate)
CREATE TABLE Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentDate DATE NOT NULL
);

-- Insert sample service package records (simplified)
INSERT INTO ServicePackage (ServiceDate)
VALUES 
(CURDATE()),
(CURDATE()),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- Insert sample payment records (simplified)
INSERT INTO Payment (AmountPaid, PaymentDate)
VALUES 
(5000, CURDATE()),
(7500, CURDATE()),
(6000, DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- Show the updated table structures
SHOW TABLES;
DESCRIBE Car;
DESCRIBE ServicePackage;
DESCRIBE Payment;
