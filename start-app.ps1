# PataPesa App Startup Script
Write-Host "Starting PataPesa App..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Set-Location ..

Write-Host ""
Write-Host "Waiting 3 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep 3

Write-Host "Starting React Native Metro Bundler..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx react-native start --reset-cache" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers started!" -ForegroundColor Green
Write-Host "- Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Metro Bundler: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run on Android: npx react-native run-android" -ForegroundColor Magenta
Write-Host "To run on iOS: npx react-native run-ios" -ForegroundColor Magenta
Write-Host ""
Read-Host "Press Enter to exit"
