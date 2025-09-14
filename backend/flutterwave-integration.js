// FLUTTERWAVE M-PESA INTEGRATION - IMMEDIATE STK PUSH SOLUTION
// This bypasses Safaricom entirely and works immediately!

require('dotenv').config();
const Flutterwave = require('flutterwave-node-v3');

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY || 'FLWPUBK_TEST-your-public-key',
  process.env.FLW_SECRET_KEY || 'FLWSECK_TEST-your-secret-key'
);

// Flutterwave STK Push function
async function initiateFlutterwaveSTKPush(amount, phoneNumber, email = 'customer@patapesa.com') {
  try {
    const payload = {
      tx_ref: `PATAPESA-${Date.now()}`,
      amount: amount,
      currency: "KES",
      customer: {
        email: email,
        phonenumber: phoneNumber,
        name: "PataPesa User"
      },
      customizations: {
        title: "PataPesa",
        description: "Account Activation Payment",
        logo: "https://your-logo-url.com/logo.png"
      }
    };

    console.log('🚀 Initiating Flutterwave STK Push:', payload);
    
    const response = await flw.MobileMoney.mpesa(payload);
    
    console.log('✅ Flutterwave STK Push Response:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Flutterwave STK Push Error:', error);
    throw error;
  }
}

// Alternative: Direct HTTP request method
async function directFlutterwaveSTKPush(amount, phoneNumber) {
  const axios = require('axios');
  
  try {
    const payload = {
      tx_ref: `PATAPESA-${Date.now()}`,
      amount: amount,
      currency: "KES",
      customer: {
        email: "customer@patapesa.com",
        phonenumber: phoneNumber,
        name: "PataPesa User"
      },
      customizations: {
        title: "PataPesa",
        description: "Account Activation Payment"
      }
    };

    const response = await axios.post(
      'https://api.flutterwave.com/v3/charges?type=mpesa',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Direct Flutterwave error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  initiateFlutterwaveSTKPush,
  directFlutterwaveSTKPush
};
