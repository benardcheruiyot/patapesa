import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import FirstRunNotification from './FirstRunNotification';

export class NotificationPermissionService {
  static async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13+ requires explicit permission request
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Enable Notifications',
              message: 'PataPesa needs notification access to send you important updates about payments, wins, and rewards.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('✅ Notification permission granted');
            // Show the one-time native welcome notification when permission is granted.
            try {
              await FirstRunNotification.showFirstRunNotificationIfNeeded();
            } catch (err) {
              console.warn('⚠️ Failed to show first-run notification after grant:', err);
            }
            return true;
          } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
            // Show alert to open settings
            this.showSettingsAlert();
            return false;
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            // Permission permanently denied, direct to settings
            this.showSettingsAlert(true);
            return false;
          }
        } catch (err) {
          console.warn('❌ Permission request error:', err);
          return false;
        }
      } else {
        // Android 12 and below - notifications are enabled by default
        console.log('✅ Notifications enabled by default on Android < 13');
        return true;
      }
    } else {
      // iOS - handle differently if needed
      console.log('✅ iOS notification handling');
      return true;
    }
    return false;
  }

  static showSettingsAlert(permanentlyDenied: boolean = false) {
    const title = '🔔 Enable Notifications';
    const message = permanentlyDenied 
      ? 'Notifications are disabled. Please enable them in Settings to receive important updates about payments, game wins, and rewards.'
      : 'PataPesa needs notification permission to keep you updated about:\n\n• Payment confirmations\n• Game wins and rewards\n• Account status updates\n• Referral earnings\n\nPlease enable notifications in Settings.';

    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => this.openAppSettings(),
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  }

  static async openAppSettings() {
    try {
      if (Platform.OS === 'android') {
        await Linking.openSettings();
      } else {
        // iOS
        await Linking.openURL('app-settings:');
      }
    } catch (error) {
      console.error('❌ Error opening settings:', error);
      Alert.alert(
        'Settings Unavailable',
        'Please manually enable notifications in your device settings:\nSettings > Apps > PataPesa > Notifications',
        [{ text: 'OK' }]
      );
    }
  }

  static async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted;
      } catch (error) {
        console.error('❌ Error checking notification permission:', error);
        return false;
      }
    }
    return true; // Assume enabled for older Android versions and iOS
  }

  static async requestPermissionOnAppStart(): Promise<void> {
    // Wait a bit for app to fully load
    setTimeout(async () => {
      const hasPermission = await this.checkNotificationPermission();
      
      if (!hasPermission) {
        console.log('📱 Requesting notification permission on app start...');
        await this.requestNotificationPermission();
      } else {
        console.log('✅ Notification permission already granted');
      }
    }, 2000); // 2 second delay after app start
  }
}
