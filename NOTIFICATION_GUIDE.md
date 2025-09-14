# Notification System Documentation

This guide explains how to use the comprehensive notification system implemented in your React Native app.

## Features

1. **Push Notifications** - Local push notifications for Android and iOS
2. **Toast Notifications** - In-app toast messages with animations
3. **Alert Dialogs** - Native alert dialogs
4. **Notification Badges** - Show notification counts on icons
5. **Predefined Notifications** - Ready-to-use notifications for common scenarios

## Installation

The following packages have been installed:

```bash
npm install react-native-push-notification @react-native-community/push-notification-ios
npm install --save-dev @types/react-native-push-notification
```

## Setup

### 1. Wrap your app with NotificationProvider

```tsx
import { NotificationProvider } from './src/context/NotificationProvider';

export default function App() {
  return (
    <NotificationProvider>
      <YourAppContent />
    </NotificationProvider>
  );
}
```

### 2. Use notifications in your components

```tsx
import { useNotifications } from '../context/NotificationProvider';

function MyComponent() {
  const notifications = useNotifications();
  
  // Use notification methods...
}
```

## Usage Examples

### Basic Toast Notifications

```tsx
const notifications = useNotifications();

// Success toast
notifications.showToast({
  message: 'Operation completed successfully!',
  type: 'success',
  duration: 3000,
  position: 'top' // 'top', 'bottom', 'center'
});

// Error toast
notifications.showToast({
  message: 'Something went wrong!',
  type: 'error',
  duration: 4000
});

// Warning toast
notifications.showToast({
  message: 'Please check your input',
  type: 'warning',
  duration: 3000
});

// Info toast
notifications.showToast({
  message: 'Here is some information',
  type: 'info',
  duration: 3000
});
```

### Push Notifications

```tsx
// Basic push notification
notifications.showPushNotification({
  title: 'New Message',
  message: 'You have received a new message',
  type: 'info'
});

// Notification with custom data
notifications.showPushNotification({
  title: 'Payment Received',
  message: 'You received KES 500',
  type: 'success',
  channelId: 'payment',
  data: { amount: 500, type: 'payment' }
});
```

### Alert Dialogs

```tsx
// Simple alert
notifications.showAlert('Title', 'Message');

// Alert with custom buttons
notifications.showAlert(
  'Confirm Action',
  'Are you sure you want to proceed?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: () => console.log('OK pressed') }
  ]
);
```

### Predefined Notifications

The system includes ready-to-use notifications for common scenarios:

```tsx
// Payment success
notifications.showPaymentSuccess(250, '5892851');

// Account activated
notifications.showAccountActivated();

// Game win
notifications.showGameWin(150);

// Referral reward
notifications.showReferralReward(50);

// Payment pending
notifications.showPaymentPending();

// Payment failed
notifications.showPaymentFailed();
```

### Notification Badge

```tsx
import { NotificationBadge } from '../components/NotificationBadge';

<View>
  <TouchableOpacity>
    <Text>Notifications</Text>
    <NotificationBadge 
      count={5} 
      size="medium"
      position="top-right"
    />
  </TouchableOpacity>
</View>
```

## Toast Features

- **Swipe to dismiss** - Users can swipe toasts left or right to dismiss
- **Auto-dismiss** - Toasts automatically disappear after the specified duration
- **Position control** - Show toasts at top, bottom, or center
- **Type styling** - Different colors and icons for success, error, warning, info
- **Manual close** - Close button for manual dismissal

## Push Notification Features

- **Channels** - Organized into categories (payment, game, promotional)
- **Scheduling** - Schedule notifications for future delivery
- **Custom data** - Attach custom data for handling clicks
- **Sound & vibration** - Configurable sound and vibration patterns
- **Badge support** - Show notification counts on app icon

## Notification Channels (Android)

The system creates these channels automatically:

1. **default** - General notifications
2. **payment** - Payment and transaction notifications (high priority)
3. **game** - Game and reward notifications (normal priority)
4. **promotional** - Marketing notifications (low priority)

## Customization

### Custom Toast Styles

You can modify the toast styles in `src/components/Toast.tsx`:

```tsx
const styles = StyleSheet.create({
  toastSuccess: {
    backgroundColor: '#4CAF50', // Green
  },
  toastError: {
    backgroundColor: '#F44336', // Red
  },
  // Add more custom styles...
});
```

### Custom Notification Icons

Add custom notification icons in:
- Android: `android/app/src/main/res/drawable/`
- iOS: Add to Xcode project

## Integration Examples

### In ActivateAccountScreen

```tsx
// When user copies till number
const copyToClipboard = (text: string, label: string) => {
  Clipboard.setString(text);
  notifications.showToast({
    message: `${label} copied to clipboard`,
    type: 'success',
    duration: 2000
  });
};

// When payment verification is submitted
notifications.showPaymentPending();
```

### In HomeScreen

```tsx
// When user wins in spin wheel
const handleWin = (amount: number) => {
  notifications.showGameWin(amount);
};

// When account is activated
const handleActivation = () => {
  notifications.showAccountActivated();
};
```

## Testing

A test menu has been added to the hamburger menu in HomeScreen:

1. Open hamburger menu
2. Select "Test Notifications"
3. Choose from various notification types to test

## Best Practices

1. **Use appropriate types** - Choose the right notification type for the context
2. **Keep messages concise** - Short, clear messages work best
3. **Don't overwhelm** - Avoid showing too many notifications at once
4. **Provide value** - Only send notifications that are useful to users
5. **Handle permissions** - Ensure notification permissions are properly requested
6. **Test thoroughly** - Test on both Android and iOS devices

## Future Enhancements

Potential improvements you can add:

1. **Remote push notifications** - Integration with Firebase Cloud Messaging
2. **Notification history** - Store and display notification history
3. **User preferences** - Allow users to customize notification settings
4. **Rich notifications** - Add images, buttons, and interactive elements
5. **Analytics** - Track notification engagement and effectiveness

## Troubleshooting

### Common Issues

1. **Notifications not showing on Android**
   - Check notification permissions
   - Verify channel configuration
   - Test on physical device (not emulator)

2. **Toast not appearing**
   - Ensure NotificationProvider wraps your app
   - Check console for errors
   - Verify gesture handler is properly configured

3. **TypeScript errors**
   - Ensure all type definitions are installed
   - Check import paths are correct

## Support

For additional help or custom modifications, refer to:
- React Native Push Notification documentation
- React Native Gesture Handler documentation
- Your app's specific notification requirements
