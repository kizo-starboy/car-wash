const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// Register route
router.post('/register', (req, res) => {
  const { username, password, fullName } = req.body;

  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Username, password, and full name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Check if username already exists
  const checkQuery = 'SELECT * FROM Users WHERE Username = ?';

  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error('Registration check error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Insert new user
    const insertQuery = 'INSERT INTO Users (Username, Password, FullName) VALUES (?, ?, ?)';

    db.query(insertQuery, [username, password, fullName], (err, result) => {
      if (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: result.insertId,
          username: username,
          fullName: fullName
        }
      });
    });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM Users WHERE Username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Check password (direct comparison for simplicity)
    if (password === user.Password) {
      // Set user session
      req.session.user = {
        id: user.UserID,
        username: user.Username,
        fullName: user.FullName
      };

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.UserID,
          username: user.Username,
          fullName: user.FullName
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Check if user is logged in
router.get('/check', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      isLoggedIn: true,
      user: req.session.user
    });
  } else {
    return res.status(200).json({
      isLoggedIn: false
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
