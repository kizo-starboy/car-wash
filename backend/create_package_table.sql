-- Create Package table and update ServicePackage table
-- Run this SQL script in your MySQL/phpMyAdmin to fix the "Table doesn't exist" error

-- Step 1: Create Package table
CREATE TABLE IF NOT EXISTS `package` (
  `PackageNumber` int(11) NOT NULL AUTO_INCREMENT,
  `PackageName` varchar(100) NOT NULL,
  `PackageDescription` text NOT NULL,
  `PackagePrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`PackageNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 2: Insert default packages
INSERT INTO `package` (`PackageName`, `PackageDescription`, `PackagePrice`) VALUES
('Basic wash', 'Exterior hand wash', 5000.00),
('Premium wash', 'Exterior and interior cleaning', 8000.00),
('Deluxe wash', 'Full service with wax and polish', 12000.00);

-- Step 3: Check if PackageNumber column exists in ServicePackage table
-- If this fails, it means the column doesn't exist, so we add it
ALTER TABLE `servicepackage` ADD COLUMN `PackageNumber` int(11) NOT NULL DEFAULT 1 AFTER `ServiceDate`;

-- Step 4: Add foreign key constraint
ALTER TABLE `servicepackage` 
ADD CONSTRAINT `servicepackage_package_fk` 
FOREIGN KEY (`PackageNumber`) REFERENCES `package` (`PackageNumber`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 5: Update existing service records to use Package 1 (Basic wash)
UPDATE `servicepackage` SET `PackageNumber` = 1 WHERE `PackageNumber` = 0 OR `PackageNumber` IS NULL;
