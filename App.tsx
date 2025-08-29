/**
 * PataPesa App
 * A React Native app with user authentication and spin wheel game for winning KES
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, ActivityIndicator, AppState } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreenSimple';
import { AuthService, User } from './src/utils/auth';
import { NotificationProvider } from './src/context/NotificationProvider';
import { NotificationPermissionService } from './src/utils/NotificationPermissionService';
import { HourlyNotificationScheduler } from './src/utils/HourlyNotificationScheduler';

const Stack = createStackNavigator();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Request notification permissions on app start
        NotificationPermissionService.requestPermissionOnAppStart();
        
        // Start hourly notification scheduler
        const scheduler = HourlyNotificationScheduler.getInstance();
        scheduler.start();
        
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

  // Show onboarding for first-time users
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show welcome screen after onboarding
  if (showWelcome) {
    return <WelcomeScreen onFinish={handleWelcomeFinish} />;
  }

  // Show loading while initializing
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
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
