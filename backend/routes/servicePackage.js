const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all service packages
router.get('/', (req, res) => {
  const query = 'SELECT RecordNumber, ServiceDate FROM ServicePackage ORDER BY RecordNumber DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching service packages:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get service package by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT RecordNumber, ServiceDate FROM ServicePackage WHERE RecordNumber = ?';

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
  const { serviceDate } = req.body;

  if (!serviceDate) {
    return res.status(400).json({ message: 'Service date is required' });
  }

  const query = 'INSERT INTO ServicePackage (ServiceDate) VALUES (?)';

  db.query(query, [serviceDate], (err, result) => {
    if (err) {
      console.error('Error adding service package:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Service package added successfully',
      servicePackage: {
        recordNumber: result.insertId,
        serviceDate
      }
    });
  });
});

// Update service package
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { serviceDate } = req.body;

  if (!serviceDate) {
    return res.status(400).json({ message: 'Service date is required' });
  }

  const query = 'UPDATE ServicePackage SET ServiceDate = ? WHERE RecordNumber = ?';

  db.query(query, [serviceDate, id], (err, result) => {
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

module.exports = router;
