import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import FirstRunNotification from './FirstRunNotification';

export class NotificationPermissionService {
  static async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13+ requires explicit permission request
        try {
          console.log('🔎 requestNotificationPermission called - Android version:', Platform.Version);
          console.log('ℹ️ Invoking PermissionsAndroid.request for POST_NOTIFICATIONS (no rationale)');
          // Request the runtime permission directly so the platform's native
          // permission dialog is shown (no custom wording or rationale dialog).
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          console.log('🔎 PermissionsAndroid.request returned:', granted);

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
            // User denied the permission for now.
            console.log('⚠️ Notification permission denied by user');
            return false;
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            // Permission permanently denied.
            console.log('⚠️ Notification permission permanently denied (never ask again)');
            // Directly open app settings so the user can re-enable notifications.
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
  // Immediately open the system app settings so the user can enable
  // notification permissions there. We intentionally avoid showing any
  // additional in-app Alert or wording here so the OS flows remain
  // the user's single source of truth.
  this.openAppSettings();
  }

  static async openAppSettings() {
    try {
  console.log('🔗 openAppSettings called — opening system settings for the app');
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

  static async requestPermissionOnAppStart(): Promise<boolean> {
    // Directly request permission on app start so the platform native
    // permission dialog is presented. Do not schedule in-app reminders here
    // — that creates extra wording and may confuse the user.
    try {
      if (Platform.OS === 'android') {
        console.log('🔔 requestPermissionOnAppStart: requesting runtime permission now');
        const granted = await this.requestNotificationPermission();
        return !!granted;
      }
      // For non-Android or older devices, treat as granted
      return true;
    } catch (err) {
      console.warn('Error during requestPermissionOnAppStart flow:', err);
      return false;
    }
  }
}
