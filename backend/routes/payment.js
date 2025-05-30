const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all payments with service package and car information
router.get('/', (req, res) => {
  const query = `
    SELECT
      p.PaymentNumber,
      p.RecordNumber,
      p.AmountPaid,
      p.PaymentDate,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM Payment p
    LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    ORDER BY p.PaymentNumber DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get payment by ID with service package and car information
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      p.PaymentNumber,
      p.RecordNumber,
      p.AmountPaid,
      p.PaymentDate,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM Payment p
    LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    WHERE p.PaymentNumber = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(results[0]);
  });
});

// Add new payment
router.post('/', (req, res) => {
  const { recordNumber, amountPaid, paymentDate } = req.body;

  if (!recordNumber || !amountPaid || !paymentDate) {
    return res.status(400).json({ message: 'Record number, amount paid and payment date are required' });
  }

  const query = 'INSERT INTO Payment (RecordNumber, AmountPaid, PaymentDate) VALUES (?, ?, ?)';

  db.query(query, [recordNumber, amountPaid, paymentDate], (err, result) => {
    if (err) {
      console.error('Error adding payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Payment added successfully',
      payment: {
        paymentNumber: result.insertId,
        recordNumber,
        amountPaid,
        paymentDate
      }
    });
  });
});

// Update payment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { recordNumber, amountPaid, paymentDate } = req.body;

  if (!recordNumber || !amountPaid || !paymentDate) {
    return res.status(400).json({ message: 'Record number, amount paid and payment date are required' });
  }

  const query = 'UPDATE Payment SET RecordNumber = ?, AmountPaid = ?, PaymentDate = ? WHERE PaymentNumber = ?';

  db.query(query, [recordNumber, amountPaid, paymentDate, id], (err, result) => {
    if (err) {
      console.error('Error updating payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      message: 'Payment updated successfully',
      payment: {
        paymentNumber: id,
        recordNumber,
        amountPaid,
        paymentDate
      }
    });
  });
});

// Delete payment
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Payment WHERE PaymentNumber = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  });
});

// Get payments by service record number
router.get('/by-record/:recordNumber', (req, res) => {
  const { recordNumber } = req.params;
  const query = `
    SELECT
      p.PaymentNumber,
      p.RecordNumber,
      p.AmountPaid,
      p.PaymentDate,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM Payment p
    LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    WHERE p.RecordNumber = ?
    ORDER BY p.PaymentNumber DESC
  `;

  db.query(query, [recordNumber], (err, results) => {
    if (err) {
      console.error('Error fetching payments by record:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get payments by car plate number
router.get('/by-car/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const query = `
    SELECT
      p.PaymentNumber,
      p.RecordNumber,
      p.AmountPaid,
      p.PaymentDate,
      sp.PlateNumber,
      sp.ServiceDate,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber
    FROM Payment p
    LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    WHERE sp.PlateNumber = ?
    ORDER BY p.PaymentNumber DESC
  `;

  db.query(query, [plateNumber], (err, results) => {
    if (err) {
      console.error('Error fetching payments by car:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
