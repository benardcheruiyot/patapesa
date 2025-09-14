@echo off
echo Starting PataPesa App...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak

echo Starting React Native Metro Bundler...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"

echo.
echo Both servers started!
echo - Backend: http://localhost:3000
echo - Metro Bundler: http://localhost:8081
echo.
echo To run on Android: npx react-native run-android
echo To run on iOS: npx react-native run-ios
echo.
pause
