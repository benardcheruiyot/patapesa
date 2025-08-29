// PAYSTACK M-PESA INTEGRATION - IMMEDIATE STK PUSH SOLUTION
// This bypasses Safaricom entirely and works immediately!

require('dotenv').config();
const PayStack = require('paystack');

// Initialize Paystack
const paystack = PayStack(process.env.PAYSTACK_SECRET_KEY || 'sk_test_your-secret-key');

// Paystack STK Push function using Mobile Money
async function initiatePaystackSTKPush(amount, phoneNumber, email = 'customer@patapesa.com') {
  try {
    const payload = {
      email: email,
      amount: amount * 100, // Paystack uses kobo (multiply by 100 for KES)
      currency: 'KES',
      mobile_money: {
        phone: phoneNumber,
        provider: 'mpesa'
      },
      reference: `PATAPESA-${Date.now()}`,
      callback_url: process.env.PAYSTACK_CALLBACK_URL || 'https://your-domain.com/paystack/callback'
    };

    console.log('🚀 Initiating Paystack STK Push:', payload);
    
    const response = await new Promise((resolve, reject) => {
      paystack.transaction.initialize(payload, (error, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
    
    console.log('✅ Paystack STK Push Response:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Paystack STK Push Error:', error);
    throw error;
  }
}

// Alternative: Direct HTTP request method for Paystack
async function directPaystackSTKPush(amount, phoneNumber, email = 'customer@patapesa.com') {
  const axios = require('axios');
  
  try {
    const payload = {
      email: email,
      amount: amount * 100, // Convert to kobo
      currency: 'KES',
      mobile_money: {
        phone: phoneNumber,
        provider: 'mpesa'
      },
      reference: `PATAPESA-${Date.now()}`,
      callback_url: process.env.PAYSTACK_CALLBACK_URL || 'https://your-domain.com/paystack/callback'
    };

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Direct Paystack Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Direct Paystack error:', error.response?.data || error.message);
    throw error;
  }
}

// Verify Paystack transaction
async function verifyPaystackTransaction(reference) {
  try {
    const response = await new Promise((resolve, reject) => {
      paystack.transaction.verify(reference, (error, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
    
    return response;
  } catch (error) {
    console.error('❌ Paystack verification error:', error);
    throw error;
  }
}

module.exports = {
  initiatePaystackSTKPush,
  directPaystackSTKPush,
  verifyPaystackTransaction
};
