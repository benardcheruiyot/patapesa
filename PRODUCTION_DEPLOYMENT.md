# PRODUCTION DEPLOYMENT GUIDE

## 🎯 PRODUCTION READINESS CHECKLIST

### ✅ **Already Complete:**
- [x] Paystack integration working
- [x] Backend server functional
- [x] Android app built and tested
- [x] Network connectivity resolved
- [x] Payment flow tested

### 🔧 **Production Setup Steps:**

## 1. **PAYSTACK PRODUCTION KEYS**

### Get Live Keys:
1. **Login to Paystack Dashboard**: https://dashboard.paystack.com/
2. **Complete Business Verification** (if not done):
   - Upload business documents
   - Verify bank account
   - Complete KYC process
3. **Get Live API Keys**:
   - Go to Settings > API Keys
   - Copy **Live Public Key** (`pk_live_xxxxx`)
   - Copy **Live Secret Key** (`sk_live_xxxxx`)

### Update Production Environment:
```bash
# Production .env file
USE_PAYSTACK=true
PAYSTACK_PUBLIC_KEY=pk_live_your-live-public-key
PAYSTACK_SECRET_KEY=sk_live_your-live-secret-key
PAYSTACK_CALLBACK_URL=https://your-production-domain.com/paystack/callback
NODE_ENV=production
PORT=3000
```

## 2. **BACKEND DEPLOYMENT OPTIONS**

### Option A: Railway (Recommended - Free tier)
1. **Sign up**: https://railway.app/
2. **Connect GitHub** repo
3. **Deploy backend** automatically
4. **Get production URL** (e.g., `https://your-app.railway.app`)

### Option B: Render (Alternative - Free tier)
1. **Sign up**: https://render.com/
2. **Create web service** from GitHub
3. **Auto-deploy** backend
4. **Custom domain** available

### Option C: Heroku (Paid)
1. **Create Heroku app**
2. **Deploy via Git**
3. **Add environment variables**
4. **Custom domain** support

## 3. **ANDROID PRODUCTION BUILD**

### Generate Release APK:
```bash
cd android
./gradlew assembleRelease
```

### Generate Signed APK (for Play Store):
```bash
# Create keystore first
keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Build signed APK
./gradlew assembleRelease
```

### APK Location:
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Install on devices**: `adb install app-release.apk`

## 4. **PLAY STORE DEPLOYMENT**

### Prerequisites:
- **Google Play Console** account ($25 one-time fee)
- **Signed APK** or **App Bundle**
- **App metadata** (description, screenshots, etc.)

### Upload Steps:
1. **Create app** in Play Console
2. **Upload APK/Bundle**
3. **Add store listing** (description, screenshots)
4. **Set pricing** (free/paid)
5. **Submit for review**

## 5. **BACKEND URL CONFIGURATION**

### Update React Native App:
```javascript
// In your React Native app, update backend URL
const BACKEND_URL = __DEV__ 
  ? 'http://10.12.29.134:3000'  // Development
  : 'https://your-production-backend.railway.app';  // Production
```

## 6. **PRODUCTION MONITORING**

### Setup Logging:
- **Backend logs** via Railway/Render dashboard
- **Paystack webhook** monitoring
- **Error tracking** (Sentry, Bugsnag)

### Health Checks:
- **Backend**: `/health` endpoint
- **Paystack**: Transaction monitoring
- **App**: Crash reporting

## 7. **SECURITY CHECKLIST**

### Environment Variables:
- ✅ **No hardcoded API keys** in code
- ✅ **Environment-based configuration**
- ✅ **HTTPS only** in production
- ✅ **Secure callback URLs**

### Paystack Security:
- ✅ **Webhook signature verification**
- ✅ **Transaction verification**
- ✅ **Rate limiting**
- ✅ **Input validation**

## 8. **TESTING PRODUCTION**

### Pre-launch Tests:
1. **STK Push** with live Paystack keys
2. **Real money transactions** (small amounts)
3. **Callback handling**
4. **Error scenarios**
5. **Performance testing**

## 🎯 **IMMEDIATE NEXT STEPS:**

1. **Get Paystack Live Keys** (if business verified)
2. **Deploy Backend** to Railway/Render
3. **Build Release APK**
4. **Test with Live Payments**
5. **Submit to Play Store**

## 📞 **SUPPORT RESOURCES:**

### Paystack:
- **Docs**: https://paystack.com/docs/
- **Support**: support@paystack.com
- **Community**: Slack/Discord

### Deployment:
- **Railway**: https://docs.railway.app/
- **Render**: https://render.com/docs
- **Play Store**: https://support.google.com/googleplay/android-developer/

---

**🚀 Ready to deploy? Let's start with getting your Paystack live keys and deploying the backend!**
