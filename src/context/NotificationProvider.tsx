import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import NotificationService, { ToastData, NotificationData } from '../utils/NotificationService';
import Toast from '../components/Toast';

interface NotificationContextType {
  showToast: (data: ToastData) => void;
  showFlashMessage: (data: NotificationData) => void;
  showAlert: (title: string, message: string, buttons?: any[]) => void;
  
  // Predefined notifications
  showPaymentSuccess: (amount: number, tillNumber: string) => void;
  showAccountActivated: () => void;
  showGameWin: (amount: number) => void;
  showReferralReward: (amount: number) => void;
  showPaymentPending: () => void;
  showPaymentFailed: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);

  useEffect(() => {
    // Initialize notification service
    NotificationService.initialize();

    // Register toast callback
    const unregister = NotificationService.registerToastCallback((toast: ToastData) => {
      setCurrentToast(toast);
    });

    return unregister;
  }, []);

  const showToast = (data: ToastData) => {
    setCurrentToast(data);
  };

  const showFlashMessage = (data: NotificationData) => {
    NotificationService.showFlashMessage(data);
  };

  const showAlert = (title: string, message: string, buttons?: any[]) => {
    Alert.alert(title, message, buttons);
  };

  const hideToast = () => {
    setCurrentToast(null);
  };

  // Predefined notification methods
  const showPaymentSuccess = (amount: number, tillNumber: string) => {
    NotificationService.showPaymentSuccess(amount, tillNumber);
  };

  const showAccountActivated = () => {
    NotificationService.showAccountActivated();
  };

  const showGameWin = (amount: number) => {
    NotificationService.showGameWin(amount);
  };

  const showReferralReward = (amount: number) => {
    NotificationService.showReferralReward(amount);
  };

  const showPaymentPending = () => {
    NotificationService.showPaymentPending();
  };

  const showPaymentFailed = () => {
    NotificationService.showPaymentFailed();
  };

  const contextValue: NotificationContextType = {
    showToast,
    showFlashMessage,
    showAlert,
    showPaymentSuccess,
    showAccountActivated,
    showGameWin,
    showReferralReward,
    showPaymentPending,
    showPaymentFailed,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <FlashMessage position="top" />
      <Toast toast={currentToast} onHide={hideToast} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
