# PataPesa React Native App

A React Native application with user authentication and a spin wheel game where users can win KES (Kenyan Shillings).

## Features

- **Welcome Screen**: Animated splash screen with PataPesa branding
- **User Registration & Login**: Secure user authentication system
- **Spin Wheel Game**: Interactive wheel with various KES prize amounts
- **KES Currency System**: Users start with KES 1000 and can win more by spinning
- **Persistent Storage**: User data is stored locally using AsyncStorage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- React Native development environment set up
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone or navigate to the project directory:
```bash
cd /Users/festus.kerich/kerich/native-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run the app:

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## How to Use

### App Launch
1. When you open the app, you'll see an animated welcome screen
2. The welcome screen displays for 3 seconds with:
   - Spinning logo animation
   - App title and features
   - Animated loading dots
3. After the welcome screen, you'll be directed to either login or the main game (if already logged in)

### Registration
1. Open the app and tap "Sign up here" on the login screen
2. Fill in your username, email, and password
3. Tap "Create Account"
4. You'll automatically be logged in with 1000 starting points

### Login
1. Enter your username and password
2. Tap "Sign In"

### Playing the Game
1. Once logged in, you'll see the spin wheel
2. Each spin costs 50 points
3. Tap the "SPIN" button to spin the wheel
4. Win various amounts of points based on where the wheel lands:
   - 10 Points
   - 25 Points
   - 50 Points
   - 100 Points
   - 200 Points
   - 500 Points
   - 1000 Points
   - Try Again (no points won)

### Managing Points
- Your current points are displayed at the top of the game screen
- Points are automatically updated after each spin
- If you run out of points, you won't be able to spin until you have at least 50 points

## App Structure

```
src/
├── components/
│   └── SpinWheel.tsx          # Animated spin wheel component
├── screens/
│   ├── WelcomeScreen.tsx      # Animated welcome/splash screen
│   ├── LoginScreen.tsx        # User login interface
│   ├── RegisterScreen.tsx     # User registration interface
│   └── HomeScreen.tsx         # Main game screen
└── utils/
    └── auth.ts               # Authentication service and user management
```

## Key Components

### WelcomeScreen Component
- Animated splash screen with 3-second duration
- Rotating logo with fade-in effects
- Animated loading dots
- Smooth transition to main app

### SpinWheel Component
- Animated wheel with 8 segments
- Uses React Native's Animated API for smooth rotations
- Randomized prize selection with visual feedback

### Authentication Service
- Local storage using AsyncStorage
- User registration and login validation
- Points management and persistence

### Navigation
- React Navigation for screen transitions
- Welcome screen with automatic progression
- Stack navigator for auth flow
- Conditional rendering based on authentication state

## Customization

### Adding New Prizes
Edit the `prizes` array in `src/components/SpinWheel.tsx`:

```typescript
const prizes: Prize[] = [
  { id: 1, label: 'Your Prize', points: 100, color: '#FF6B6B' },
  // Add more prizes...
];
```

### Changing Spin Cost
Modify the `spinCost` variable in `src/components/SpinWheel.tsx`:

```typescript
const spinCost = 50; // Change this value
```

### Modifying Starting Points
Update the starting points in `src/utils/auth.ts`:

```typescript
const newUser: User = {
  // ...
  points: 1000, // Change this value
};
```

### Changing Welcome Screen Duration
Modify the timer duration in `src/screens/WelcomeScreen.tsx`:

```typescript
const timer = setTimeout(() => {
  onFinish();
}, 3000); // Change this value (in milliseconds)
```

## Troubleshooting

### Metro Bundler Issues
If you encounter port conflicts, start Metro on a different port:
```bash
npx react-native start --port 8082
```

### iOS Build Issues
If CocoaPods is not installed:
```bash
sudo gem install cocoapods
cd ios && pod install
```

### Android Build Issues
Make sure Android Studio is properly set up and an emulator is running or a device is connected.

## Dependencies

- React Navigation for navigation
- AsyncStorage for local data persistence
- React Native Reanimated for animations
- React Native Gesture Handler for touch interactions

## Future Enhancements

- Add daily bonuses
- Implement leaderboards
- Add sound effects and haptic feedback
- Include social sharing features
- Add more mini-games
- Implement push notifications for daily rewards
