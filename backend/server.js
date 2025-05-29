const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'smartpack-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Import routes
console.log('Loading routes...');
const authRoutes = require('./routes/auth');
console.log('Auth routes loaded');
const carRoutes = require('./routes/car');
console.log('Car routes loaded');
const servicePackageRoutes = require('./routes/servicePackage');
console.log('Service package routes loaded');
const paymentRoutes = require('./routes/payment');
console.log('Payment routes loaded');
const reportRoutes = require('./routes/report');
console.log('Report routes loaded');

// Use routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes registered');
app.use('/api/cars', carRoutes);
console.log('Car routes registered');
app.use('/api/services', servicePackageRoutes);
console.log('Service routes registered');
app.use('/api/payments', paymentRoutes);
console.log('Payment routes registered');
app.use('/api/reports', reportRoutes);
console.log('Report routes registered');

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});