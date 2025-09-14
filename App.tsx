/**
 * PataPesa App
 * A React Native app with user authentication and spin wheel game for winning KES
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, ActivityIndicator, AppState, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreenSimple';
import { AuthService, User } from './src/utils/auth';
import { HourlyNotificationScheduler } from './src/utils/HourlyNotificationScheduler';
import { NotificationPermissionService } from './src/utils/NotificationPermissionService';
import { NotificationProvider } from './src/context/NotificationProvider';
import FirstRunNotification from './src/utils/FirstRunNotification';
import FirstRunModal from './src/components/FirstRunModal';
// First-run modal removed: request system permission dialog directly on first run
import { INAPP_FIRST_RUN_KEY, FIRST_RUN_NOTIFICATION_KEY } from './src/utils/firstRunKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NativeNotificationScheduler from './src/utils/NotificationScheduler';

const Stack = createStackNavigator();

function App() {
  // Immediate permission request for debugging/system prompt
  // NOTE: Removed direct runtime permission request here so the app shows a single
  // startup popup (via requestPermissionOnAppStart) which opens system Settings when
  // the user taps "Allow Notifications". This avoids showing the system dialog
  // and the in-app alert together.
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Track last known notification permission so we can detect when the user
  // enables notifications after returning from Settings.
  const permissionGrantedRef = useRef<boolean | null>(null);

  // When app resumes, check notification permission and show a confirmation
  // message if the user just granted it in Settings.
  useEffect(() => {
    let subscription: any;

    const setup = async () => {
      try {
        // Initialize last-known permission state
        const initial = await NotificationPermissionService.checkNotificationPermission();
        permissionGrantedRef.current = initial;

        // Subscribe to app state changes
        subscription = AppState.addEventListener('change', async (nextState) => {
          if (nextState === 'active') {
            try {
              const granted = await NotificationPermissionService.checkNotificationPermission();
              // If previously not granted and now granted, notify the user
              if (permissionGrantedRef.current !== true && granted === true) {
                // Show native first-run notification (if not already shown)
                try {
                  await FirstRunNotification.showFirstRunNotificationIfNeeded();
                } catch (e) {
                  console.warn('Error showing native first-run notification:', e);
                }
                // Then show a friendly confirmation using the existing in-app scheduler
                const scheduler = HourlyNotificationScheduler.getInstance();
                scheduler.triggerTestNotification();
              }
              permissionGrantedRef.current = granted;
            } catch (err) {
              console.warn('Error checking notification permission on resume:', err);
            }
          }
        });
      } catch (error) {
        console.warn('Error initializing notification permission state:', error);
      }
    };

    setup();

    return () => {
      if (subscription && subscription.remove) subscription.remove();
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        

  // Request the platform runtime permission on first launch so the system
  // permission dialog (native wording) is shown instead of an in-app modal.
        // Instead of auto-requesting the runtime permission on cold start (which
        // can be missed by the user), show an in-app modal that asks the user
        // to Allow Notifications. The modal's Allow button will call
        // NotificationPermissionService.requestNotificationPermission() which
        // triggers the OS permission dialog from a user gesture, improving
        // visibility and reliability across devices.
        try {
          const shown = await AsyncStorage.getItem(INAPP_FIRST_RUN_KEY);
          if (shown !== '1') {
            // Show the in-app permission modal (it will write the flag when user acts)
            setShowPermissionModal(true);
          } else {
            // If we've already shown the in-app modal before, still check and
            // request permission in case the user hasn't granted it yet.
            try {
              const permissionGranted = await NotificationPermissionService.requestPermissionOnAppStart();
              if (permissionGranted) {
                await FirstRunNotification.showFirstRunNotificationIfNeeded();
              }
            } catch (e) {
              console.warn('Error checking/requesting notification permission on start:', e);
            }
          }
        } catch (err) {
          console.warn('Error reading first-run flag for permission modal:', err);
          // As a fallback, show the permission modal so the user can explicitly
          // trigger the OS dialog.
          setShowPermissionModal(true);
  }

  // Start hourly notification scheduler
  const scheduler = HourlyNotificationScheduler.getInstance();
  scheduler.start();
  // Best practice: do NOT auto-trigger native notifications on startup.
  // The flow should be:
  // 1) Show in-app FirstRunModal on first launch.
  // 2) If the modal was previously shown, invoke the OS permission flow
  //    (NotificationPermissionService.requestPermissionOnAppStart) and
  //    only post a native welcome notification once OS permission is granted.
  // Automatic posting on every cold start can be intrusive and is avoided.
        
        // Check if user is already logged in
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          console.log('User found, going to home');
          setUser(currentUser);
          setLoading(false);
          return;
        }

        // Check if onboarding has been completed
        const hasCompletedOnboarding = await AuthService.hasCompletedOnboarding();
        console.log('Has completed onboarding:', hasCompletedOnboarding);
        
        if (!hasCompletedOnboarding) {
          console.log('Showing onboarding');
          setShowOnboarding(true);
        } else {
          console.log('Showing welcome');
          setShowWelcome(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setShowOnboarding(true);
        setLoading(false);
      }
    };

    initializeApp();
    
    // Cleanup on unmount
    return () => {
      const scheduler = HourlyNotificationScheduler.getInstance();
      scheduler.stop();
    };
  }, []); // Empty dependency array to run only once

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    // Reset to show onboarding for next app open
    setShowOnboarding(true);
  };

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  const handleOnboardingComplete = async () => {
    await AuthService.setOnboardingCompleted();
    setShowOnboarding(false);
    setShowWelcome(true);
  };

  // Dev button element for testing notifications. Extracted so it can be
  // rendered on onboarding/loading screens as well (useful for repeatable testing).
  const devButton = __DEV__ ? (
    <TouchableOpacity
      style={styles.devButton}
      onPress={async () => {
        try {
          console.log('Dev: forcing native first-run notification');
          await FirstRunNotification.showFirstRunNotificationIfNeeded();
        } catch (e) {
          console.warn('Dev: error forcing native notification', e);
        }
        try {
          const scheduler = HourlyNotificationScheduler.getInstance();
          scheduler.triggerTestNotification();
        } catch (e) {
          console.warn('Dev: error triggering scheduler test', e);
        }
      }}
      onLongPress={async () => {
        try {
          console.log('Dev: clearing first-run flags (AsyncStorage)');
          await AsyncStorage.removeItem(FIRST_RUN_NOTIFICATION_KEY);
          await AsyncStorage.removeItem(INAPP_FIRST_RUN_KEY);
          console.log('Dev: cleared first-run flags');
        } catch (err) {
          console.warn('Dev: error clearing first-run flags', err);
        }
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>Test Notification</Text>
    </TouchableOpacity>
  ) : null;

  // Show onboarding for first-time users
  if (showOnboarding) {
    return (
      <>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        {devButton}
      </>
    );
  }

  // Show welcome screen after onboarding
  if (showWelcome) {
    return (
      <>
        <WelcomeScreen onFinish={handleWelcomeFinish} />
        {devButton}
      </>
    );
  }

  // Show loading while initializing
  if (loading) {
    return (
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
        {devButton}
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      {devButton}
  {user ? (
        // User is logged in, show the home screen
        <HomeScreen user={user} onLogout={handleLogout} />
      ) : (
        // User is not logged in, show auth stack
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            options={{ title: 'Sign In' }}
          >
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen 
            name="Register" 
            options={{ title: 'Create Account' }}
          >
            {(props) => <RegisterScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen 
            name="ResetPassword" 
            options={{ title: 'Reset Password' }}
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      )}
      {/* First-run permission modal. Shown on cold first-run to ensure the
          OS permission dialog is triggered from a user gesture. */}
      <FirstRunModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllowed={async () => {
          try {
            await FirstRunNotification.showFirstRunNotificationIfNeeded();
          } catch (e) {
            console.warn('Error showing first-run notification after allowing:', e);
          }
          try {
            await AsyncStorage.setItem(INAPP_FIRST_RUN_KEY, '1');
          } catch (e) {
            console.warn('Failed to save first-run flag after permission modal:', e);
          }
          // Start native hourly scheduler only after permission is granted
          try {
            await NativeNotificationScheduler.scheduleHourly();
          } catch (e) {
            console.warn('Failed to start native hourly scheduler:', e);
          }
        }}
      />
    </NavigationContainer>
  );
}

export default function AppWithNotifications() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    right: 12,
    bottom: 18,
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    elevation: 8,
    zIndex: 9999,
  },
});
