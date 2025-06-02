-- Migration to add Package table and update ServicePackage table
-- Add Package table with required fields

CREATE TABLE `package` (
  `PackageNumber` int(11) NOT NULL AUTO_INCREMENT,
  `PackageName` varchar(100) NOT NULL,
  `PackageDescription` text NOT NULL,
  `PackagePrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`PackageNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default package data as specified in the scenario
INSERT INTO `package` (`PackageName`, `PackageDescription`, `PackagePrice`) VALUES
('Basic wash', 'Exterior hand wash', 5000.00),
('Premium wash', 'Exterior and interior cleaning', 8000.00),
('Deluxe wash', 'Full service with wax and polish', 12000.00);

-- Add PackageNumber column to ServicePackage table
ALTER TABLE `servicepackage` 
ADD COLUMN `PackageNumber` int(11) NOT NULL DEFAULT 1 AFTER `ServiceDate`;

-- Add foreign key constraint for PackageNumber in ServicePackage
ALTER TABLE `servicepackage` 
ADD CONSTRAINT `servicepackage_ibfk_2` 
FOREIGN KEY (`PackageNumber`) REFERENCES `package` (`PackageNumber`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update existing ServicePackage records to use the Basic wash package
UPDATE `servicepackage` SET `PackageNumber` = 1 WHERE `PackageNumber` = 1;
