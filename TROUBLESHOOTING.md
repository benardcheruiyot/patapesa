# PataPesa App Troubleshooting Guide

## Common Issues and Solutions

### 1. App Not Starting
**Problem**: App crashes or doesn't start
**Solutions**:
- Clear React Native cache: `npx react-native start --reset-cache`
- Clean and rebuild: `cd android && ./gradlew clean && cd .. && npx react-native run-android`
- Check if backend is running on http://localhost:3000

### 2. Backend Connection Issues
**Problem**: App can't connect to backend
**Solutions**:
- Ensure backend is running: `cd backend && npm start`
- Check backend URL in app (should be http://localhost:3000)
- Verify Android emulator can reach localhost (use 10.0.2.2:3000 for Android emulator)

### 3. Notification Issues
**Problem**: Notifications not working
**Solutions**:
- Check if notification permissions are granted
- Verify react-native-flash-message is properly linked
- Check Android manifest for notification permissions

### 4. Android Build Issues
**Problem**: Android build fails
**Solutions**:
- Check Android SDK is installed (version 35.0.0 required)
- Verify ANDROID_HOME environment variable
- Run: `npx react-native doctor` to check setup
- Clean build: `cd android && ./gradlew clean`

### 5. Dependencies Issues
**Problem**: Module not found errors
**Solutions**:
- Reinstall dependencies: `npm install`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check package.json for missing dependencies

## Quick Start Commands

1. **Start Backend Only**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Metro Bundler Only**:
   ```bash
   npx react-native start
   ```

3. **Run on Android**:
   ```bash
   npx react-native run-android
   ```

4. **Full Reset and Start**:
   ```bash
   # Clear everything
   npx react-native start --reset-cache
   cd android
   ./gradlew clean
   cd ..
   
   # Start fresh
   npm install
   cd backend && npm install && cd ..
   
   # Run
   ./start-app.bat  # or ./start-app.ps1
   ```

## Environment Requirements

- Node.js (latest LTS)
- React Native CLI
- Android Studio with SDK 35.0.0
- Java JDK 8 or 11
- Android device/emulator

## App Features Status

✅ **Working Features**:
- User authentication (login/register)
- Spin wheel game
- Points system
- Notification system
- Hourly engagement notifications
- Payment integration endpoints
- Backend API server

🔧 **Features Requiring Setup**:
- Payment gateway (Paystack/Flutterwave) - requires API keys
- SMS integration - requires API keys
- Push notifications - requires Firebase setup

## Need Help?

If the app is still not working:
1. Run `npx react-native doctor` to check environment
2. Check console logs for specific error messages
3. Verify all dependencies are installed correctly
4. Ensure Android emulator/device is properly connected
