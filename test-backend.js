const http = require('http');

// Test backend connectivity
const testPayload = {
  transactionCode: 'TEST123456',
  phoneNumber: '+254700000000',
  amount: 50,
  tillNumber: '5892851'
};

const postData = JSON.stringify(testPayload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/verify-payment',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing backend connection...');

const req = http.request(options, (res) => {
  console.log(`✅ Backend responded with status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📊 Response:', JSON.parse(data));
    console.log('🎉 Backend is working correctly!');
  });
});

req.on('error', (e) => {
  console.error('❌ Backend connection failed:', e.message);
  console.log('💡 Make sure to start the backend server first: node backend/index.js');
});

req.write(postData);
req.end();
