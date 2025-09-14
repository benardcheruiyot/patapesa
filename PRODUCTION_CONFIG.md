# Production Environment Configuration

## Environment Variables Template

Create a `.env` file in your backend directory for production:

```env
# Production Environment Configuration
NODE_ENV=production
PORT=3000

# M-Pesa Production Credentials (Get from Safaricom)
MPESA_CONSUMER_KEY=your_production_consumer_key_here
MPESA_CONSUMER_SECRET=your_production_consumer_secret_here
MPESA_SHORTCODE=5892851
MPESA_PASSKEY=your_production_passkey_here

# Production URLs
MPESA_AUTH_URL=https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
MPESA_STK_URL=https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest

# Callback URL (Your production domain)
MPESA_CALLBACK_URL=https://yourdomain.com/mpesa/callback

# Security
JWT_SECRET=your_jwt_secret_for_authentication
ENCRYPTION_KEY=your_encryption_key_for_sensitive_data

# Database (if you add one later)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patapesa
DB_USER=patapesa_user
DB_PASSWORD=secure_password

# SSL Configuration
SSL_CERT_PATH=/path/to/ssl/certificate.crt
SSL_KEY_PATH=/path/to/ssl/private.key

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/patapesa/app.log
```

## Production Backend Configuration

Update your `backend/index.js` for production:

```javascript
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const helmet = require('helmet'); // Security headers
const rateLimit = require('express-rate-limit'); // Rate limiting
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(bodyParser.json());

// Production M-Pesa configuration from environment variables
const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortCode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  callbackURL: process.env.MPESA_CALLBACK_URL,
  authURL: process.env.MPESA_AUTH_URL,
  stkURL: process.env.MPESA_STK_URL
};

// Validate required environment variables
const requiredEnvVars = [
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET', 
  'MPESA_SHORTCODE',
  'MPESA_PASSKEY',
  'MPESA_CALLBACK_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Production CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = ['https://yourdomain.com', 'https://www.yourdomain.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Enhanced logging for production
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} 📥 ${req.method} ${req.path} from ${req.ip}`);
  
  // Log headers (excluding sensitive data)
  const safeHeaders = { ...req.headers };
  delete safeHeaders.authorization;
  console.log('Headers:', JSON.stringify(safeHeaders, null, 2));
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Log body (excluding sensitive data)
    const safeBody = { ...req.body };
    if (safeBody.phoneNumber) {
      safeBody.phoneNumber = safeBody.phoneNumber.slice(0, 6) + 'XXXXX';
    }
    console.log('Body:', JSON.stringify(safeBody, null, 2));
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// M-Pesa callback endpoint (REQUIRED for production)
app.post('/mpesa/callback', (req, res) => {
  console.log('🔔 M-Pesa Callback received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { Body } = req.body;
    
    if (Body && Body.stkCallback) {
      const { 
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata
      } = Body.stkCallback;
      
      console.log(`📱 Transaction: ${CheckoutRequestID}`);
      console.log(`💰 Result: ${ResultCode} - ${ResultDesc}`);
      
      if (ResultCode === 0) {
        // Payment successful - process activation
        if (CallbackMetadata && CallbackMetadata.Item) {
          const metadata = {};
          CallbackMetadata.Item.forEach(item => {
            metadata[item.Name] = item.Value;
          });
          
          console.log('✅ Payment successful:', {
            amount: metadata.Amount,
            mpesaReceiptNumber: metadata.MpesaReceiptNumber,
            transactionDate: metadata.TransactionDate,
            phoneNumber: metadata.PhoneNumber
          });
          
          // TODO: Implement account activation logic here
          // activateUserAccount(CheckoutRequestID, metadata);
        }
      } else {
        // Payment failed
        console.log('❌ Payment failed:', ResultDesc);
        // TODO: Handle failed payment
      }
    }
    
    // Always respond with success to Safaricom
    res.json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });
    
  } catch (error) {
    console.error('❌ Callback processing error:', error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Internal Server Error'
    });
  }
});

// Your existing endpoints...
// (STK Push, ping, test-config, etc.)

// HTTPS server for production
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log('🚀 HTTPS Server running on port 443');
    console.log('🔒 SSL Certificate loaded');
    console.log('💰 MODE: PRODUCTION M-Pesa - LIVE TRANSACTIONS!');
  });
  
  // Redirect HTTP to HTTPS
  const http = require('http');
  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(80);
  
} else {
  // Development server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Development server running on port ${PORT}`);
  });
}
```

## Deployment Checklist

### Server Requirements
- [ ] Ubuntu 20.04+ or CentOS 8+
- [ ] Node.js 16+
- [ ] Nginx (reverse proxy)
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Domain name
- [ ] Firewall configuration

### Security Setup
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Firewall rules applied
- [ ] Regular security updates enabled
- [ ] Backup strategy implemented

### M-Pesa Production Requirements
- [ ] Production credentials from Safaricom
- [ ] Callback URL publicly accessible
- [ ] HTTPS enforced
- [ ] Transaction logging implemented
- [ ] Error handling comprehensive

### Monitoring
- [ ] Server monitoring setup
- [ ] Application logs configured
- [ ] Alert system for errors
- [ ] Performance monitoring
- [ ] Uptime monitoring

## Nginx Configuration

Create `/etc/nginx/sites-available/patapesa`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Process Manager (PM2)

Install and configure PM2:

```bash
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'patapesa-backend',
    script: 'index.js',
    cwd: '/path/to/your/backend',
    env: {
      NODE_ENV: 'production'
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/patapesa/error.log',
    out_file: '/var/log/patapesa/out.log',
    log_file: '/var/log/patapesa/combined.log'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

This production setup will ensure your app is ready for Safaricom's approval and can handle real M-Pesa transactions securely.
