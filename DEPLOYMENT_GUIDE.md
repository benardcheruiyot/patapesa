# Production Deployment Script

## Prerequisites Checklist

Before deploying to production, ensure you have:

### 1. Safaricom Production Credentials ✅
- [ ] Production Consumer Key from Safaricom Developer Portal
- [ ] Production Consumer Secret from Safaricom Developer Portal  
- [ ] Production Passkey for your till (5892851)
- [ ] Go-Live approval from Safaricom

### 2. Server Setup ✅
- [ ] VPS or cloud server (Ubuntu 20.04+ recommended)
- [ ] Domain name registered and DNS configured
- [ ] SSL certificate installed (Let's Encrypt recommended)
- [ ] Node.js 16+ installed
- [ ] PM2 process manager installed

### 3. Environment Configuration ✅
- [ ] .env file created with production values
- [ ] Callback URL updated to your domain
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Nginx reverse proxy configured

## Deployment Steps

### Step 1: Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: SSL Certificate Setup
```bash
# Get SSL certificate (replace yourdomain.com)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify SSL renewal
sudo certbot renew --dry-run
```

### Step 3: Application Deployment
```bash
# Create application directory
sudo mkdir -p /var/www/patapesa
cd /var/www/patapesa

# Clone your repository (or upload files)
# git clone https://github.com/yourusername/patapesa-backend.git .
# OR upload your backend files here

# Install dependencies
npm install

# Create production environment file
cp env-template.txt .env
# Edit .env with your production values
nano .env
```

### Step 4: Environment Configuration (.env file)
```env
NODE_ENV=production
PORT=3000

# Production M-Pesa credentials (from Safaricom)
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=5892851
MPESA_PASSKEY=your_production_passkey

# Your domain callback URL
MPESA_CALLBACK_URL=https://yourdomain.com/mpesa/callback
```

### Step 5: PM2 Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'patapesa-backend',
    script: 'index.js',
    cwd: '/var/www/patapesa',
    env: {
      NODE_ENV: 'production'
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/patapesa/error.log',
    out_file: '/var/log/patapesa/out.log',
    log_file: '/var/log/patapesa/combined.log',
    time: true
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/patapesa
sudo chown $USER:$USER /var/log/patapesa

# Start application with PM2
pm2 start ecosystem.config.js

# Setup PM2 startup
pm2 startup
pm2 save
```

### Step 6: Nginx Configuration
```bash
# Create Nginx site configuration
sudo tee /etc/nginx/sites-available/patapesa << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # M-Pesa callback endpoint (important!)
    location /mpesa/callback {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase body size for M-Pesa payloads
        client_max_body_size 1M;
    }
}
EOF

# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/patapesa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### Step 8: Testing Production Deployment
```bash
# Test health endpoint
curl https://yourdomain.com/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-08-27T...",
#   "environment": "production",
#   "version": "1.0.0",
#   "mpesaMode": "PRODUCTION"
# }

# Test configuration endpoint
curl https://yourdomain.com/test-config

# Test STK Push (with small amount)
curl -X POST https://yourdomain.com/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1,
    "phoneNumber": "254728723279",
    "accountReference": "TestActivation",
    "transactionDesc": "Production Test - 1 KES"
  }'
```

## Production Monitoring

### PM2 Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs patapesa-backend

# Monitor in real-time
pm2 monit

# Restart if needed
pm2 restart patapesa-backend
```

### Log Management
```bash
# View application logs
tail -f /var/log/patapesa/combined.log

# View Nginx logs
sudo tail -f /var/nginx/access.log
sudo tail -f /var/nginx/error.log
```

## Safaricom Production Integration

### Callback URL Registration
1. Login to Safaricom Developer Portal
2. Update your app's callback URL to: `https://yourdomain.com/mpesa/callback`
3. Ensure URL is publicly accessible and returns 200 OK

### Testing with Real Money
1. Start with small amounts (1-10 KES)
2. Use your actual phone number (254728723279)
3. Monitor callback logs for successful payments
4. Verify money reaches your till (5892851)

## Troubleshooting

### Common Issues
1. **Callback URL not accessible**: Check firewall, Nginx config, SSL certificate
2. **Invalid access token**: Verify production credentials in .env file
3. **STK Push not received**: Ensure phone number format is correct (254XXXXXXXXX)
4. **SSL errors**: Check certificate validity and Nginx SSL configuration

### Debug Commands
```bash
# Check if app is running
curl https://yourdomain.com/ping

# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate
openssl s_client -connect yourdomain.com:443
```

## Security Checklist
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Firewall configured (only necessary ports open)
- [ ] Environment variables secured (not in git)
- [ ] Nginx security headers configured
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting setup

Your PataPesa backend is now production-ready! 🚀
