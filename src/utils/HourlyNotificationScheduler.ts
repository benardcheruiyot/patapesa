import { AppState, AppStateStatus } from 'react-native';
import { showMessage } from 'react-native-flash-message';

interface HourlyNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  icon: string;
  hour: number; // 0-23
}

export class HourlyNotificationScheduler {
  private static instance: HourlyNotificationScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private lastNotificationTime: number = 0;
  private appState: AppStateStatus = 'active';
  private appStateSubscription: any = null;

  // Convincing hourly notifications throughout the day
  private notifications: HourlyNotification[] = [
    {
      id: 'morning_opportunity',
      title: '🌅 Good Morning! Start Earning!',
      message: 'Your daily spin is ready! Win up to KES 1,000 and start your day with cash rewards!',
      type: 'success',
      icon: '💰',
      hour: 8
    },
    {
      id: 'mid_morning_referral',
      title: '📱 Share & Earn KES 25!',
      message: 'Your friends are missing out! Share your referral code and earn KES 25 for each signup.',
      type: 'info',
      icon: '🎁',
      hour: 10
    },
    {
      id: 'lunch_time_win',
      title: '🍽️ Lunch Break = Winning Time!',
      message: 'Take a break and spin the wheel! Others have won KES 500+ during lunch. Your turn?',
      type: 'warning',
      icon: '🎰',
      hour: 12
    },
    {
      id: 'afternoon_earnings',
      title: '💼 Boost Your Afternoon Income!',
      message: 'KES 750 earned by users today! Check your balance and withdraw to M-Pesa instantly.',
      type: 'success',
      icon: '💵',
      hour: 14
    },
    {
      id: 'evening_referral',
      title: '🌆 Evening Referral Bonus!',
      message: 'Your referral earnings: KES 150+ available! Refer 3 more friends to unlock VIP rewards.',
      type: 'info',
      icon: '🏆',
      hour: 17
    },
    {
      id: 'prime_time',
      title: '⭐ Prime Time Rewards!',
      message: 'Users win 3x more between 7-9 PM! Spin now for your best chance at KES 1,000!',
      type: 'warning',
      icon: '🔥',
      hour: 19
    },
    {
      id: 'last_chance',
      title: '🌙 Last Chance for Today!',
      message: "Don't miss today's earnings! Spin before midnight or wait 24 hours for your next chance.",
      type: 'danger',
      icon: '⏰',
      hour: 21
    },
    {
      id: 'night_activation',
      title: '🌟 Activate for Tomorrow!',
      message: 'Activate your account tonight and wake up to instant withdrawal access tomorrow!',
      type: 'info',
      icon: '🚀',
      hour: 23
    }
  ];

  // Additional random motivational messages
  private randomMotivationalMessages: HourlyNotification[] = [
    {
      id: 'fomo_1',
      title: '🔥 FOMO Alert!',
      message: 'John from Nairobi just won KES 800! Your winning streak is waiting...',
      type: 'warning',
      icon: '💸',
      hour: -1
    },
    {
      id: 'social_proof',
      title: '👥 Join 50,000+ Winners!',
      message: 'Over 50,000 Kenyans are earning daily. Why not you? Spin now!',
      type: 'success',
      icon: '🎯',
      hour: -1
    },
    {
      id: 'urgency_1',
      title: '⚡ Limited Time Bonus!',
      message: 'Double rewards active for 30 minutes! Spin now before it expires!',
      type: 'danger',
      icon: '⚡',
      hour: -1
    },
    {
      id: 'reward_waiting',
      title: '🎁 Reward Waiting!',
      message: 'You have unclaimed rewards worth KES 200+. Tap to collect before they expire!',
      type: 'info',
      icon: '💎',
      hour: -1
    }
  ];

  static getInstance(): HourlyNotificationScheduler {
    if (!HourlyNotificationScheduler.instance) {
      HourlyNotificationScheduler.instance = new HourlyNotificationScheduler();
    }
    return HourlyNotificationScheduler.instance;
  }

  start(): void {
    this.stop(); // Clear any existing interval

    // Set up app state listener
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    // Start the hourly check
    this.intervalId = setInterval(() => {
      this.checkAndSendNotification();
    }, 60000); // Check every minute

    console.log('🔔 Hourly notification scheduler started');
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    console.log('🔕 Hourly notification scheduler stopped');
  }

  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    this.appState = nextAppState;
    
    if (nextAppState === 'active') {
      // App became active, check if we should send a "welcome back" notification
      this.checkWelcomeBackNotification();
    }
  };

  private checkAndSendNotification(): void {
    if (this.appState !== 'active') {
      return; // Don't send notifications when app is in background
    }

    const now = new Date();
    const currentHour = now.getHours();
    const timeSinceLastNotification = now.getTime() - this.lastNotificationTime;
    
    // Only send if it's been at least 50 minutes since last notification
    if (timeSinceLastNotification < 50 * 60 * 1000) {
      return;
    }

    // Find notification for current hour
    const hourlyNotification = this.notifications.find(n => n.hour === currentHour);
    
    if (hourlyNotification) {
      this.sendNotification(hourlyNotification);
    } else {
      // Send a random motivational message every 2 hours if no specific hour notification
      if (currentHour % 2 === 0) {
        const randomNotification = this.getRandomMotivationalMessage();
        this.sendNotification(randomNotification);
      }
    }
  }

  private checkWelcomeBackNotification(): void {
    const timeSinceLastNotification = Date.now() - this.lastNotificationTime;
    
    // If user was away for more than 2 hours, send welcome back message
    if (timeSinceLastNotification > 2 * 60 * 60 * 1000) {
      const welcomeBackNotification: HourlyNotification = {
        id: 'welcome_back',
        title: '🎉 Welcome Back!',
        message: 'Your earnings are waiting! Check your balance and spin for instant rewards.',
        type: 'success',
        icon: '💰',
        hour: -1
      };
      
      setTimeout(() => {
        this.sendNotification(welcomeBackNotification);
      }, 3000); // 3 second delay after app becomes active
    }
  }

  private getRandomMotivationalMessage(): HourlyNotification {
    const randomIndex = Math.floor(Math.random() * this.randomMotivationalMessages.length);
    return this.randomMotivationalMessages[randomIndex];
  }

  private sendNotification(notification: HourlyNotification): void {
    try {
      showMessage({
        message: notification.title,
        description: notification.message,
        type: notification.type,
        icon: 'auto',
        duration: 6000, // Show for 6 seconds
        floating: true,
        position: 'top',
        autoHide: true,
        hideOnPress: true,
        backgroundColor: this.getBackgroundColor(notification.type),
        titleStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFFFFF'
        },
        textStyle: {
          fontSize: 14,
          color: '#FFFFFF'
        }
      });

      this.lastNotificationTime = Date.now();
      console.log(`📱 Sent notification: ${notification.title}`);
      
      // Track notification for analytics
      this.trackNotification(notification);
      
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  private getBackgroundColor(type: string): string {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'danger': return '#F44336';
      case 'info': 
      default: return '#2196F3';
    }
  }

  private trackNotification(notification: HourlyNotification): void {
    // Track notification analytics
    const trackingData = {
      notificationId: notification.id,
      timestamp: new Date().toISOString(),
      hour: new Date().getHours(),
      type: notification.type
    };
    
    console.log('📊 Notification tracked:', trackingData);
    // In a real app, you'd send this to your analytics service
  }

  // Method to manually trigger a specific notification (for testing)
  triggerTestNotification() {
    const testNotification: HourlyNotification = {
      id: 'manual_test',
      title: '🔔 Test Notification Working!',
      message: 'Great! Your notifications are working perfectly. You should receive hourly updates.',
      type: 'success',
      icon: '✅',
      hour: new Date().getHours()
    };
    
    console.log('Triggering test notification:', testNotification);
    this.sendNotification(testNotification);
  }

  // Method to trigger immediate notification for current hour (for testing)
  triggerNotification(type: 'motivational' | 'hourly' | 'custom', customMessage?: Partial<HourlyNotification>): void {
    let notification: HourlyNotification;
    
    if (type === 'motivational') {
      notification = this.getRandomMotivationalMessage();
    } else if (type === 'hourly') {
      const currentHour = new Date().getHours();
      notification = this.notifications.find(n => n.hour === currentHour) || this.notifications[0];
    } else {
      notification = {
        id: 'custom',
        title: customMessage?.title || '🎉 Special Offer!',
        message: customMessage?.message || 'Limited time opportunity to earn more!',
        type: customMessage?.type || 'info',
        icon: customMessage?.icon || '🎁',
        hour: -1
      };
    }
    
    this.sendNotification(notification);
  }

  // Get next scheduled notification time
  getNextNotificationInfo(): { hour: number; title: string; timeUntil: string } | null {
    const currentHour = new Date().getHours();
    const nextNotification = this.notifications.find(n => n.hour > currentHour) || this.notifications[0];
    
    if (!nextNotification) return null;
    
    const hoursUntil = nextNotification.hour > currentHour 
      ? nextNotification.hour - currentHour 
      : (24 - currentHour) + nextNotification.hour;
    
    return {
      hour: nextNotification.hour,
      title: nextNotification.title,
      timeUntil: `${hoursUntil} hour${hoursUntil === 1 ? '' : 's'}`
    };
  }
}
