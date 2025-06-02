const express = require('express');
const router = express.Router();
const db = require('../db');

// Get daily report with package information
router.get('/daily/:date', (req, res) => {
  const { date } = req.params;

  const query = `
    SELECT
      p.PaymentNumber,
      p.AmountPaid,
      p.PaymentDate,
      sp.PlateNumber,
      pkg.PackageName,
      pkg.PackageDescription
    FROM Payment p
    LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
    LEFT JOIN Package pkg ON sp.PackageNumber = pkg.PackageNumber
    WHERE DATE(p.PaymentDate) = ?
    ORDER BY p.PaymentDate DESC
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error generating daily report:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Calculate total amount
    const totalAmount = results.reduce((sum, record) => sum + parseFloat(record.AmountPaid), 0);

    res.status(200).json({
      date,
      totalAmount,
      records: results,
      count: results.length
    });
  });
});

// Get all payments for reports with package information
router.get('/payments', (req, res) => {
  const query = `
    SELECT
      p.PaymentNumber,
      p.AmountPaid,
      p.PaymentDate,
      sp.PlateNumber,
      pkg.PackageName,
      pkg.PackageDescription
    FROM Payment p
    LEFT JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
    LEFT JOIN Package pkg ON sp.PackageNumber = pkg.PackageNumber
    ORDER BY p.PaymentDate DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error generating payments report:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(results);
  });
});

// Get summary report
router.get('/summary', (req, res) => {
  const carCountQuery = 'SELECT COUNT(*) as carCount FROM Car';
  const packageCountQuery = 'SELECT COUNT(*) as packageCount FROM Package';
  const serviceCountQuery = 'SELECT COUNT(*) as serviceCount FROM ServicePackage';
  const paymentSumQuery = 'SELECT SUM(AmountPaid) as totalRevenue FROM Payment';
  const paymentCountQuery = 'SELECT COUNT(*) as paymentCount FROM Payment';

  db.query(carCountQuery, (err, carResults) => {
    if (err) {
      console.error('Error getting car count:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    db.query(packageCountQuery, (err, packageResults) => {
      if (err) {
        console.error('Error getting package count:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      db.query(serviceCountQuery, (err, serviceResults) => {
        if (err) {
          console.error('Error getting service count:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        db.query(paymentSumQuery, (err, paymentResults) => {
          if (err) {
            console.error('Error getting payment sum:', err);
            return res.status(500).json({ message: 'Server error' });
          }

          db.query(paymentCountQuery, (err, paymentCountResults) => {
            if (err) {
              console.error('Error getting payment count:', err);
              return res.status(500).json({ message: 'Server error' });
            }

            res.status(200).json({
              carCount: carResults[0].carCount,
              packageCount: packageResults[0].packageCount,
              serviceCount: serviceResults[0].serviceCount,
              totalRevenue: paymentResults[0].totalRevenue || 0,
              paymentCount: paymentCountResults[0].paymentCount
            });
          });
        });
      });
    });
  });
});

// Get comprehensive report for printing
router.get('/comprehensive', (req, res) => {
  const carsQuery = 'SELECT * FROM Car ORDER BY PlateNumber';
  const servicesQuery = 'SELECT * FROM ServicePackage ORDER BY RecordNumber DESC';
  const paymentsQuery = 'SELECT * FROM Payment ORDER BY PaymentNumber DESC';

  db.query(carsQuery, (err, carResults) => {
    if (err) {
      console.error('Error getting cars:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    db.query(servicesQuery, (err, serviceResults) => {
      if (err) {
        console.error('Error getting services:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      db.query(paymentsQuery, (err, paymentResults) => {
        if (err) {
          console.error('Error getting payments:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        // Calculate totals
        const totalRevenue = paymentResults.reduce((sum, payment) => sum + parseFloat(payment.AmountPaid), 0);

        res.status(200).json({
          cars: carResults,
          services: serviceResults,
          payments: paymentResults,
          summary: {
            totalCars: carResults.length,
            totalServices: serviceResults.length,
            totalPayments: paymentResults.length,
            totalRevenue: totalRevenue
          },
          generatedAt: new Date().toISOString()
        });
      });
    });
  });
});

module.exports = router;
