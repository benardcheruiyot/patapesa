import { NativeModules } from 'react-native';

const { NotificationScheduler } = NativeModules as { NotificationScheduler?: any };

export const NativeNotificationScheduler = {
  scheduleHourly: async () => {
    if (NotificationScheduler && NotificationScheduler.scheduleHourly) {
      try {
        NotificationScheduler.scheduleHourly();
      } catch (e) {
        console.warn('Error calling native scheduleHourly:', e);
      }
    }
  },
  cancel: async () => {
    if (NotificationScheduler && NotificationScheduler.cancel) {
      try {
        NotificationScheduler.cancel();
      } catch (e) {
        console.warn('Error calling native cancel:', e);
      }
    }
  }
};

export default NativeNotificationScheduler;
