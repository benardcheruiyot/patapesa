// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simple connectivity test endpoint
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Backend is reachable!', 
    timestamp: new Date().toISOString(),
    clientIP: req.ip 
  });
});

app.post('/ping', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'POST request successful!', 
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    receivedData: req.body
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Hourly notification endpoints
app.post('/notification-clicked', (req, res) => {
  const { notificationId, userId, timestamp } = req.body;
  
  console.log('👆 Notification clicked:', { notificationId, userId, timestamp });
  
  res.json({
    status: 'success',
    message: 'Notification click tracked',
    data: { notificationId, userId, timestamp },
    timestamp: new Date().toISOString()
  });
});

app.get('/notification-stats', (req, res) => {
  console.log('📊 Notification stats requested');
  
  // Mock statistics - in real app, get from database
  const stats = {
    totalSent: 1247,
    clickRate: 23.5,
    conversionRate: 8.2,
    topPerformingHour: 19,
    mostEffectiveMessage: 'Prime Time Rewards!',
    userEngagement: {
      daily: 156,
      weekly: 892,
      monthly: 3245
    }
  };
  
  res.json({
    status: 'success',
    message: 'Notification statistics',
    data: stats,
    timestamp: new Date().toISOString()
  });
});

app.post('/schedule-notification', (req, res) => {
  const { userId, message, scheduleTime, type } = req.body;
  
  console.log('⏰ Notification scheduled:', { userId, message, scheduleTime, type });
  
  res.json({
    status: 'success',
    message: 'Notification scheduled successfully',
    data: { userId, message, scheduleTime, type },
    scheduledId: `sched_${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

// Withdrawal endpoint
app.post('/withdraw', (req, res) => {
  const { userId, phoneNumber, amount, processingFee } = req.body;
  
  console.log('💰 Withdrawal request:', { userId, phoneNumber, amount, processingFee });
  
  // Simulate processing time
  setTimeout(() => {
    const withdrawalId = `withdraw_${Date.now()}`;
    
    res.json({
      status: 'success',
      message: 'Withdrawal processed successfully',
      data: {
        withdrawalId,
        userId,
        phoneNumber,
        amount,
        processingFee,
        totalDeducted: amount + processingFee,
        timestamp: new Date().toISOString(),
        mpesaCode: `MP${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    });
  }, 2000); // 2 second delay to simulate processing
});

// Check withdrawal status
app.get('/withdrawal-status/:withdrawalId', (req, res) => {
  const { withdrawalId } = req.params;
  
  console.log('📊 Withdrawal status check:', withdrawalId);
  
  res.json({
    status: 'success',
    data: {
      withdrawalId,
      status: 'completed',
      timestamp: new Date().toISOString(),
      mpesaConfirmed: true
    }
  });
});

// Payment verification endpoint
app.post('/verify-payment', (req, res) => {
  const { transactionCode, phoneNumber, amount, tillNumber } = req.body;
  
  console.log('🔍 Payment verification request:', { transactionCode, phoneNumber, amount, tillNumber });
  
  // Validate transaction code format
  if (!transactionCode || transactionCode.length !== 10) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid transaction code format'
    });
  }

  // Simulate verification process
  setTimeout(() => {
    // Mock verification logic - in real app, verify with M-Pesa API
    const isValidTransaction = Math.random() > 0.1; // 90% success rate for demo
    
    if (isValidTransaction) {
      const verificationId = `verify_${Date.now()}`;
      
      res.json({
        status: 'success',
        message: 'Payment verification submitted successfully',
        data: {
          verificationId,
          transactionCode,
          phoneNumber,
          amount,
          tillNumber,
          status: 'pending',
          timestamp: new Date().toISOString(),
          estimatedConfirmation: '2-5 minutes'
        }
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Transaction code not found or invalid. Please check and try again.',
        error: 'INVALID_TRANSACTION_CODE'
      });
    }
  }, 1500); // Simulate network delay
});

// Account creation endpoint
app.post('/create-account', (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  
  console.log('👤 Account creation request:', { firstName, lastName, phoneNumber, email });
  
  // Validate required fields
  if (!firstName || !lastName || !phoneNumber || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required'
    });
  }

  // Validate phone number format
  const phoneRegex = /^\+254[17]\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid phone number format'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email format'
    });
  }

  // Simulate account creation process
  setTimeout(() => {
    // Mock duplicate check - 10% chance of duplicate for demo
    const isDuplicate = Math.random() < 0.1;
    
    if (isDuplicate) {
      res.status(409).json({
        status: 'error',
        message: 'An account with this phone number or email already exists',
        error: 'DUPLICATE_ACCOUNT'
      });
    } else {
      const userId = `user_${Date.now()}`;
      const accountData = {
        userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber,
        email: email.toLowerCase().trim(),
        points: 0,
        isAccountActivated: false,
        referralCode: `REF${userId.slice(-6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        welcomeBonus: 10 // Give new users 10 points welcome bonus
      };
      
      res.json({
        status: 'success',
        message: 'Account created successfully',
        data: accountData,
        timestamp: new Date().toISOString()
      });
    }
  }, 2000); // Simulate processing time
});

// Login endpoint
app.post('/login', (req, res) => {
  const { phoneNumber, password } = req.body;
  
  console.log('🔐 Login request:', { phoneNumber });
  
  // Validate required fields
  if (!phoneNumber || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Phone number and password are required'
    });
  }

  // Simulate login process
  setTimeout(() => {
    // Mock authentication - 90% success rate for demo
    const isValidCredentials = Math.random() > 0.1;
    
    if (isValidCredentials) {
      const userData = {
        userId: `user_${Date.now()}`,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber,
        email: 'user@example.com',
        points: Math.floor(Math.random() * 1000) + 50, // Random points between 50-1050
        isAccountActivated: Math.random() > 0.3, // 70% chance of activated account
        referralCode: `REF${Date.now().toString().slice(-6)}`,
        lastLogin: new Date().toISOString()
      };
      
      res.json({
        status: 'success',
        message: 'Login successful',
        data: userData,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Invalid phone number or password',
        error: 'INVALID_CREDENTIALS'
      });
    }
  }, 1500); // Simulate processing time
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Backend URL: http://localhost:${PORT}`);
  console.log(`✨ Simple backend server ready!`);
  console.log(`🔔 Notification endpoints available:`);
  console.log(`   POST /notification-clicked`);
  console.log(`   GET  /notification-stats`);
  console.log(`   POST /schedule-notification`);
  console.log(`💰 Withdrawal endpoints available:`);
  console.log(`   POST /withdraw`);
  console.log(`   GET  /withdrawal-status/:withdrawalId`);
  console.log(`🔍 Payment verification endpoints:`);
  console.log(`   POST /verify-payment`);
  console.log(`👤 Account management endpoints:`);
  console.log(`   POST /create-account`);
  console.log(`   POST /login`);
});
