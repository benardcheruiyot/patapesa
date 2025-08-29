import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { PataPesaLogo } from '../components/PataPesaLogo';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onFinish: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.4)).current;
  const dot3Anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Animate loading dots
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
      ]).start(() => animateDots());
    };

    const dotTimer = setTimeout(animateDots, 1000);

    // Navigate to main app after 5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dotTimer);
    };
  }, [fadeAnim, scaleAnim, rotateAnim, dot1Anim, dot2Anim, dot3Anim, onFinish]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Icon/Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <PataPesaLogo size={80} color="#4CAF50" />
        </Animated.View>

        {/* App Title */}
        <Text style={styles.title}>PataPesa</Text>
        <Text style={styles.subtitle}>Spin & Win KES</Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.feature}>🎯 Spin to Win KES</Text>
          <Text style={styles.feature}>💰 Earn Real Money</Text>
          <Text style={styles.feature}>🏆 Daily Rewards</Text>
        </View>

        {/* Loading Indicator */}
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
            <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
            <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom Text */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <Text style={styles.bottomText}>Get ready to spin and win big!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    opacity: 0.9,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 60,
    textAlign: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '300',
  },
  featuresContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  feature: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 3,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
