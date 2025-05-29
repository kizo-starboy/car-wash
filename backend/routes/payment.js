const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all payments
router.get('/', (req, res) => {
  const query = 'SELECT PaymentNumber, AmountPaid, PaymentDate FROM Payment ORDER BY PaymentNumber DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get payment by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT PaymentNumber, AmountPaid, PaymentDate FROM Payment WHERE PaymentNumber = ?';

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
  const { amountPaid, paymentDate } = req.body;

  if (!amountPaid || !paymentDate) {
    return res.status(400).json({ message: 'Amount paid and payment date are required' });
  }

  const query = 'INSERT INTO Payment (AmountPaid, PaymentDate) VALUES (?, ?)';

  db.query(query, [amountPaid, paymentDate], (err, result) => {
    if (err) {
      console.error('Error adding payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Payment added successfully',
      payment: {
        paymentNumber: result.insertId,
        amountPaid,
        paymentDate
      }
    });
  });
});

// Update payment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { amountPaid, paymentDate } = req.body;

  if (!amountPaid || !paymentDate) {
    return res.status(400).json({ message: 'Amount paid and payment date are required' });
  }

  const query = 'UPDATE Payment SET AmountPaid = ?, PaymentDate = ? WHERE PaymentNumber = ?';

  db.query(query, [amountPaid, paymentDate, id], (err, result) => {
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

module.exports = router;
