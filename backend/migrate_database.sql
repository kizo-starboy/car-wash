-- Migration script to add relationships between Car, ServicePackage, and Payment
-- Run this script to add foreign key relationships

USE CWSMS;

-- First, drop all existing foreign key constraints if they exist
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables to recreate with new schema
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS ServicePackage;
DROP TABLE IF EXISTS Package;

-- Recreate ServicePackage table with Car relationship
CREATE TABLE ServicePackage (
    RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
    PlateNumber VARCHAR(20) NOT NULL,
    ServiceDate DATE NOT NULL,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Recreate Payment table with ServicePackage relationship
CREATE TABLE Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    RecordNumber INT NOT NULL,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentDate DATE NOT NULL,
    FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample service package records with car relationships
INSERT INTO ServicePackage (PlateNumber, ServiceDate)
VALUES
('RAC223d', CURDATE()),
('RAD123A', CURDATE()),
('RAE456B', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
('RAF789C', CURDATE());

-- Insert sample payment records with service package relationships
INSERT INTO Payment (RecordNumber, AmountPaid, PaymentDate)
VALUES
(1, 5000, CURDATE()),
(2, 7500, CURDATE()),
(3, 6000, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(4, 3000, CURDATE());

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Show the updated table structures
SHOW TABLES;
DESCRIBE Car;
DESCRIBE ServicePackage;
DESCRIBE Payment;
