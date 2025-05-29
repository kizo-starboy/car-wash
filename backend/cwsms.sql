-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2025 at 12:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cwsms`
--

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `PlateNumber` varchar(20) NOT NULL,
  `CarType` varchar(50) NOT NULL,
  `CarSize` varchar(50) NOT NULL,
  `DriverName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`PlateNumber`, `CarType`, `CarSize`, `DriverName`, `PhoneNumber`) VALUES
('RAC223d', 'dedan.guv', 'Small', 'MBUTO', '0786984892'),
('RAD123A', 'Sedan', 'Medium', 'John Doe', '0781234567'),
('RAE456B', 'SUV', 'Large', 'Jane Smith', '0789876543'),
('RAF789C', 'Hatchback', 'Small', 'Robert Johnson', '0723456789');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentNumber` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentNumber`, `AmountPaid`, `PaymentDate`) VALUES
(1, 5000.00, '2025-05-29'),
(2, 7500.00, '2025-05-29'),
(3, 6000.00, '2025-05-28'),
(4, 3000.00, '2025-05-29');

-- --------------------------------------------------------

--
-- Table structure for table `servicepackage`
--

CREATE TABLE `servicepackage` (
  `RecordNumber` int(11) NOT NULL,
  `ServiceDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicepackage`
--

INSERT INTO `servicepackage` (`RecordNumber`, `ServiceDate`) VALUES
(1, '2025-05-29'),
(2, '2025-05-29'),
(3, '2025-05-28'),
(4, '2025-05-29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FullName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `FullName`) VALUES
(1, 'admin', 'admin123', 'Administrator');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`PlateNumber`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentNumber`);

--
-- Indexes for table `servicepackage`
--
ALTER TABLE `servicepackage`
  ADD PRIMARY KEY (`RecordNumber`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `servicepackage`
--
ALTER TABLE `servicepackage`
  MODIFY `RecordNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
