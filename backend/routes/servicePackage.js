const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all service packages with car information
router.get('/', (req, res) => {
  const query = `
    SELECT
      sp.RecordNumber,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM ServicePackage sp
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    ORDER BY sp.RecordNumber DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching service packages:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get service package by ID with car information
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      sp.RecordNumber,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM ServicePackage sp
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    WHERE sp.RecordNumber = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching service package:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    res.status(200).json(results[0]);
  });
});

// Add new service package
router.post('/', (req, res) => {
  const { plateNumber, serviceDate } = req.body;

  if (!plateNumber || !serviceDate) {
    return res.status(400).json({ message: 'Plate number and service date are required' });
  }

  const query = 'INSERT INTO ServicePackage (PlateNumber, ServiceDate) VALUES (?, ?)';

  db.query(query, [plateNumber, serviceDate], (err, result) => {
    if (err) {
      console.error('Error adding service package:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Service package added successfully',
      servicePackage: {
        recordNumber: result.insertId,
        plateNumber,
        serviceDate
      }
    });
  });
});

// Update service package
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { plateNumber, serviceDate } = req.body;

  if (!plateNumber || !serviceDate) {
    return res.status(400).json({ message: 'Plate number and service date are required' });
  }

  const query = 'UPDATE ServicePackage SET PlateNumber = ?, ServiceDate = ? WHERE RecordNumber = ?';

  db.query(query, [plateNumber, serviceDate, id], (err, result) => {
    if (err) {
      console.error('Error updating service package:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    res.status(200).json({
      message: 'Service package updated successfully',
      servicePackage: {
        recordNumber: id,
        plateNumber,
        serviceDate
      }
    });
  });
});

// Delete service package
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM ServicePackage WHERE RecordNumber = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting service package:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    res.status(200).json({ message: 'Service package deleted successfully' });
  });
});

// Get service packages by car plate number
router.get('/by-car/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const query = `
    SELECT
      sp.RecordNumber,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM ServicePackage sp
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    WHERE sp.PlateNumber = ?
    ORDER BY sp.RecordNumber DESC
  `;

  db.query(query, [plateNumber], (err, results) => {
    if (err) {
      console.error('Error fetching service packages by car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
