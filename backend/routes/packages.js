const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all packages
router.get('/', (req, res) => {
  const query = 'SELECT * FROM package ORDER BY PackageNumber';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching packages:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch packages',
        error: err.message 
      });
    }
    
    res.json({
      success: true,
      data: results
    });
  });
});

// Get package by ID
router.get('/:packageNumber', (req, res) => {
  const { packageNumber } = req.params;
  const query = 'SELECT * FROM package WHERE PackageNumber = ?';
  
  db.query(query, [packageNumber], (err, results) => {
    if (err) {
      console.error('Error fetching package:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch package',
        error: err.message 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Create new package
router.post('/', (req, res) => {
  const { PackageNumber, PackageName, PackageDescription, PackagePrice } = req.body;
  
  // Validation
  if (!PackageName || !PackageDescription || !PackagePrice) {
    return res.status(400).json({
      success: false,
      message: 'Package name, description, and price are required'
    });
  }
  
  // If PackageNumber is provided, use it; otherwise let database auto-increment
  let query, values;
  if (PackageNumber && PackageNumber !== '') {
    query = 'INSERT INTO package (PackageNumber, PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?, ?)';
    values = [PackageNumber, PackageName, PackageDescription, PackagePrice];
  } else {
    query = 'INSERT INTO package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)';
    values = [PackageName, PackageDescription, PackagePrice];
  }
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating package:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create package',
        error: err.message 
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: {
        PackageNumber: PackageNumber || result.insertId,
        PackageName,
        PackageDescription,
        PackagePrice
      }
    });
  });
});

// Update package
router.put('/:packageNumber', (req, res) => {
  const { packageNumber } = req.params;
  const { PackageName, PackageDescription, PackagePrice } = req.body;
  
  // Validation
  if (!PackageName || !PackageDescription || !PackagePrice) {
    return res.status(400).json({
      success: false,
      message: 'Package name, description, and price are required'
    });
  }
  
  const query = 'UPDATE package SET PackageName = ?, PackageDescription = ?, PackagePrice = ? WHERE PackageNumber = ?';
  
  db.query(query, [PackageName, PackageDescription, PackagePrice, packageNumber], (err, result) => {
    if (err) {
      console.error('Error updating package:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update package',
        error: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Package updated successfully'
    });
  });
});

// Delete package
router.delete('/:packageNumber', (req, res) => {
  const { packageNumber } = req.params;
  
  // Check if package is being used in service records
  const checkQuery = 'SELECT COUNT(*) as count FROM servicepackage WHERE PackageNumber = ?';
  
  db.query(checkQuery, [packageNumber], (err, results) => {
    if (err) {
      console.error('Error checking package usage:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to check package usage',
        error: err.message 
      });
    }
    
    if (results[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete package. It is being used in service records.'
      });
    }
    
    // Delete the package
    const deleteQuery = 'DELETE FROM package WHERE PackageNumber = ?';
    
    db.query(deleteQuery, [packageNumber], (err, result) => {
      if (err) {
        console.error('Error deleting package:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete package',
          error: err.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Package deleted successfully'
      });
    });
  });
});

module.exports = router;
