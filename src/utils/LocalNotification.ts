import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

const CHANNEL_ID = 'patapesa-notifications';

export const createNotificationChannel = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: 'PataPesa Notifications',
        channelDescription: 'Notifications for payments, wins and rewards',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }
};

export const showLocalNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: CHANNEL_ID,
    autoCancel: true,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    bigText: message,
    subText: 'PataPesa',
    color: 'green',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    importance: 'high',

    /* iOS and Android properties */
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};

// Initialize configuration
PushNotification.configure({
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: false,
});

export default {
  createNotificationChannel,
  showLocalNotification,
};
