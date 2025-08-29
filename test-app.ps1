# Quick App Test Script
Write-Host "=== PataPesa App Quick Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Check if we're in the right directory
if (Test-Path "package.json") {
    Write-Host "✓ Found package.json" -ForegroundColor Green
    $packageContent = Get-Content package.json | ConvertFrom-Json
    Write-Host "  App name: $($packageContent.name)" -ForegroundColor Cyan
} else {
    Write-Host "✗ package.json not found - wrong directory?" -ForegroundColor Red
    exit 1
}

# Test 2: Check dependencies
Write-Host ""
Write-Host "Testing dependencies..." -ForegroundColor Yellow
try {
    $flashMessage = npm ls react-native-flash-message 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ react-native-flash-message installed" -ForegroundColor Green
    } else {
        Write-Host "✗ react-native-flash-message missing" -ForegroundColor Red
        Write-Host "Run: npm install" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error checking dependencies" -ForegroundColor Red
}

# Test 3: Check TypeScript
Write-Host ""
Write-Host "Testing TypeScript compilation..." -ForegroundColor Yellow
try {
    npx tsc --noEmit 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ TypeScript compilation successful" -ForegroundColor Green
    } else {
        Write-Host "✗ TypeScript errors found" -ForegroundColor Red
        Write-Host "Run: npx tsc --noEmit to see errors" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error running TypeScript check" -ForegroundColor Red
}

# Test 4: Check backend
Write-Host ""
Write-Host "Testing backend..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Write-Host "✓ Backend found" -ForegroundColor Green
    
    # Test if backend dependencies are installed
    Set-Location backend
    try {
        $express = npm ls express 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "✗ Backend dependencies missing" -ForegroundColor Red
            Write-Host "Run: cd backend && npm install" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ Error checking backend dependencies" -ForegroundColor Red
    }
    Set-Location ..
} else {
    Write-Host "✗ Backend not found" -ForegroundColor Red
}

# Test 5: Check React Native environment
Write-Host ""
Write-Host "Testing React Native environment..." -ForegroundColor Yellow
try {
    $rnVersion = npx react-native --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ React Native CLI available" -ForegroundColor Green
    } else {
        Write-Host "✗ React Native CLI not found" -ForegroundColor Red
        Write-Host "Run: npm install -g @react-native-community/cli" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error checking React Native" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Results Summary ===" -ForegroundColor Green
Write-Host ""
Write-Host "If all tests pass ✓, your app should work!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the app:" -ForegroundColor White
Write-Host "1. Run: ./start-app.ps1" -ForegroundColor Yellow
Write-Host "2. Wait for servers to start" -ForegroundColor Yellow
Write-Host "3. Run: npx react-native run-android" -ForegroundColor Yellow
Write-Host ""
Write-Host "If any tests fail ✗, check SETUP_GUIDE.md for fixes" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
