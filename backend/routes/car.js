const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all cars
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Car';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cars:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get car by plate number
router.get('/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const query = 'SELECT * FROM Car WHERE PlateNumber = ?';

  db.query(query, [plateNumber], (err, results) => {
    if (err) {
      console.error('Error fetching car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json(results[0]);
  });
});

// Add new car
router.post('/', (req, res) => {
  const { plateNumber, carType, carSize, driverName, phoneNumber } = req.body;

  if (!plateNumber || !carType || !carSize || !driverName || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [plateNumber, carType, carSize, driverName, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error adding car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Car added successfully',
      car: {
        plateNumber,
        carType,
        carSize,
        driverName,
        phoneNumber
      }
    });
  });
});

// Update car
router.put('/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const { carType, carSize, driverName, phoneNumber } = req.body;

  if (!carType || !carSize || !driverName || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'UPDATE Car SET CarType = ?, CarSize = ?, DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?';

  db.query(query, [carType, carSize, driverName, phoneNumber, plateNumber], (err, result) => {
    if (err) {
      console.error('Error updating car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({
      message: 'Car updated successfully',
      car: {
        plateNumber,
        carType,
        carSize,
        driverName,
        phoneNumber
      }
    });
  });
});

// Delete car
router.delete('/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const query = 'DELETE FROM Car WHERE PlateNumber = ?';

  db.query(query, [plateNumber], (err, result) => {
    if (err) {
      console.error('Error deleting car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  });
});

// Get car with its service packages and payments
router.get('/:plateNumber/details', (req, res) => {
  const { plateNumber } = req.params;

  // Get car details
  const carQuery = 'SELECT * FROM Car WHERE PlateNumber = ?';

  db.query(carQuery, [plateNumber], (err, carResults) => {
    if (err) {
      console.error('Error fetching car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (carResults.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const car = carResults[0];

    // Get service packages for this car
    const serviceQuery = `
      SELECT RecordNumber, ServiceDate
      FROM ServicePackage
      WHERE PlateNumber = ?
      ORDER BY RecordNumber DESC
    `;

    db.query(serviceQuery, [plateNumber], (err, serviceResults) => {
      if (err) {
        console.error('Error fetching service packages:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      // Get payments for this car
      const paymentQuery = `
        SELECT
          p.PaymentNumber,
          p.RecordNumber,
          p.AmountPaid,
          p.PaymentDate
        FROM Payment p
        LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
        WHERE sp.PlateNumber = ?
        ORDER BY p.PaymentNumber DESC
      `;

      db.query(paymentQuery, [plateNumber], (err, paymentResults) => {
        if (err) {
          console.error('Error fetching payments:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json({
          car: car,
          servicePackages: serviceResults,
          payments: paymentResults
        });
      });
    });
  });
});

module.exports = router;
