const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM package ORDER BY PackageNumber');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});

// Get package by PackageNumber
router.get('/:packageNumber', async (req, res) => {
  try {
    const { packageNumber } = req.params;
    const [rows] = await db.execute('SELECT * FROM package WHERE PackageNumber = ?', [packageNumber]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Failed to fetch package' });
  }
});

// Create new package
router.post('/', async (req, res) => {
  try {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    
    // Validate required fields
    if (!PackageName || !PackageDescription || !PackagePrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate PackagePrice is a positive number
    if (isNaN(PackagePrice) || PackagePrice <= 0) {
      return res.status(400).json({ message: 'Package price must be a positive number' });
    }
    
    const [result] = await db.execute(
      'INSERT INTO package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)',
      [PackageName, PackageDescription, PackagePrice]
    );
    
    res.status(201).json({ 
      message: 'Package created successfully',
      PackageNumber: result.insertId 
    });
  } catch (error) {
    console.error('Error creating package:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Package name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create package' });
    }
  }
});

// Update package
router.put('/:packageNumber', async (req, res) => {
  try {
    const { packageNumber } = req.params;
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    
    // Validate required fields
    if (!PackageName || !PackageDescription || !PackagePrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate PackagePrice is a positive number
    if (isNaN(PackagePrice) || PackagePrice <= 0) {
      return res.status(400).json({ message: 'Package price must be a positive number' });
    }
    
    const [result] = await db.execute(
      'UPDATE package SET PackageName = ?, PackageDescription = ?, PackagePrice = ? WHERE PackageNumber = ?',
      [PackageName, PackageDescription, PackagePrice, packageNumber]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Package name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to update package' });
    }
  }
});

// Delete package
router.delete('/:packageNumber', async (req, res) => {
  try {
    const { packageNumber } = req.params;
    
    // Check if package is being used in any service records
    const [serviceRecords] = await db.execute(
      'SELECT COUNT(*) as count FROM servicepackage WHERE PackageNumber = ?',
      [packageNumber]
    );
    
    if (serviceRecords[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete package. It is being used in service records.' 
      });
    }
    
    const [result] = await db.execute('DELETE FROM package WHERE PackageNumber = ?', [packageNumber]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ message: 'Failed to delete package' });
  }
});

module.exports = router;
