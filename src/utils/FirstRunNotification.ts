import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIRST_RUN_NOTIFICATION_KEY as FIRST_RUN_KEY } from './firstRunKeys';

const CHANNEL_ID = 'pata_pesa_first_run_channel';

export async function showFirstRunNotificationIfNeeded() {
  console.log('FirstRunNotification: called');
  try {
    const shown = await AsyncStorage.getItem(FIRST_RUN_KEY);
    console.log('FirstRunNotification: shown flag =', shown);
    if (shown === '1') {
      console.log('FirstRunNotification: already shown, skipping');
      return;
    }

    // Create channel
    console.log('FirstRunNotification: creating channel', CHANNEL_ID);
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'PataPesa Alerts',
      importance: AndroidImportance.HIGH,
    });

    // Post notification (attempt with app icon first)
    try {
      console.log('FirstRunNotification: attempting displayNotification with smallIcon');
      await notifee.displayNotification({
        title: 'Welcome to PataPesa!',
        body: "Welcome! We'll send occasional updates about your account activity and rewards. Start by attempting your first spin!",
        android: {
          channelId: CHANNEL_ID,
          smallIcon: 'ic_notification',
          pressAction: {
            id: 'default',
          },
        },
      });
      console.log('FirstRunNotification: displayNotification succeeded (with smallIcon)');
    } catch (err) {
      console.warn('FirstRunNotification: displayNotification failed with smallIcon, retrying without smallIcon', err);
      try {
        await notifee.displayNotification({
          title: 'Welcome to PataPesa!',
          body: "Welcome! We'll send occasional updates about your account activity and rewards. Start by attempting your first spin!",
          android: {
            channelId: CHANNEL_ID,
            pressAction: { id: 'default' },
          },
        });
        console.log('FirstRunNotification: displayNotification succeeded (without smallIcon)');
      } catch (err2) {
        console.warn('FirstRunNotification: displayNotification failed (second attempt)', err2);
        throw err2;
      }
    }

    // Persist that we've shown it
    await AsyncStorage.setItem(FIRST_RUN_KEY, '1');
    console.log('FirstRunNotification: persisted shown flag');
  } catch (err) {
    console.warn('FirstRunNotification: Error showing first-run native notification:', err);
  }
}

export default { showFirstRunNotificationIfNeeded };
