import { Alert } from 'react-native';
import { showMessage, hideMessage } from 'react-native-flash-message';

export interface NotificationData {
  id?: string;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  data?: any;
  duration?: number;
}

export interface ToastData {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
}

class NotificationService {
  private toastCallbacks: ((toast: ToastData) => void)[] = [];
  private isInitialized = false;

  // Initialize notification service
  initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('Notification service initialized');
  }

  // Show flash message
  showFlashMessage(data: NotificationData) {
    showMessage({
      message: data.title,
      description: data.message,
      type: this.getFlashMessageType(data.type),
      duration: data.duration || 4000,
      floating: true,
      icon: this.getIconForType(data.type),
    });
  }

  // Show in-app toast notification
  showToast(data: ToastData) {
    this.toastCallbacks.forEach(callback => callback(data));
  }

  // Register toast callback
  registerToastCallback(callback: (toast: ToastData) => void) {
    this.toastCallbacks.push(callback);
    return () => {
      this.toastCallbacks = this.toastCallbacks.filter(cb => cb !== callback);
    };
  }

  // Get icon for message type
  private getIconForType(type?: string): any {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  }

  // Get flash message type
  private getFlashMessageType(type?: string): 'success' | 'danger' | 'warning' | 'info' {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  // Predefined notification methods
  showPaymentSuccess(amount: number, tillNumber: string) {
    this.showFlashMessage({
      title: '💰 Payment Successful!',
      message: `Your payment of KES ${amount} to Till ${tillNumber} was successful.`,
      type: 'success',
      duration: 4000
    });

    this.showToast({
      message: `Payment of KES ${amount} successful!`,
      type: 'success',
      duration: 3000
    });
  }

  showAccountActivated() {
    this.showFlashMessage({
      title: '🎉 Account Activated!',
      message: 'Congratulations! Your account has been successfully activated. You can now withdraw your earnings.',
      type: 'success',
      duration: 5000
    });

    this.showToast({
      message: 'Account successfully activated!',
      type: 'success',
      duration: 4000
    });
  }

  showGameWin(amount: number) {
    this.showFlashMessage({
      title: '🎊 You Won!',
      message: `Congratulations! You won KES ${amount} in the spin wheel!`,
      type: 'success',
      duration: 4000
    });

    this.showToast({
      message: `You won KES ${amount}! 🎉`,
      type: 'success',
      duration: 3000
    });
  }

  showReferralReward(amount: number) {
    this.showFlashMessage({
      title: '👥 Referral Reward!',
      message: `You earned KES ${amount} from a successful referral!`,
      type: 'success',
      duration: 4000
    });

    this.showToast({
      message: `Referral reward: KES ${amount}!`,
      type: 'success',
      duration: 3000
    });
  }

  showPaymentPending() {
    this.showFlashMessage({
      title: '⏳ Payment Pending',
      message: 'Your payment is being processed. You will receive a confirmation shortly.',
      type: 'info',
      duration: 4000
    });

    this.showToast({
      message: 'Payment is being processed...',
      type: 'info',
      duration: 3000
    });
  }

  showPaymentFailed() {
    this.showFlashMessage({
      title: '❌ Payment Failed',
      message: 'Your payment could not be processed. Please try again or contact support.',
      type: 'error',
      duration: 5000
    });

    this.showToast({
      message: 'Payment failed. Please try again.',
      type: 'error',
      duration: 4000
    });
  }

  showDailyReward(amount: number) {
    this.showFlashMessage({
      title: '🎁 Daily Reward!',
      message: `You received your daily bonus of KES ${amount}!`,
      type: 'success',
      duration: 4000
    });
  }

  showPromotionalOffer(title: string, message: string) {
    this.showFlashMessage({
      title: `🔥 ${title}`,
      message: message,
      type: 'info',
      duration: 5000
    });
  }

  // Simple alert method
  showAlert(title: string, message: string, buttons?: any[]) {
    Alert.alert(title, message, buttons);
  }

  static instance = new NotificationService();
}

export default NotificationService.instance;
