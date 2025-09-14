import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Spin & Win Real Money',
    description: 'Spin our exciting wheel and win up to KES 1000 instantly! Every spin is a chance to earn real cash rewards.',
    icon: '💵',
    color: '#4CAF50',
  },
  {
    id: 2,
    title: 'Refer Friends & Earn',
    description: 'Share your referral code with friends and earn KES 100 for each successful registration. The more you share, the more you earn!',
    icon: '🎁',
    color: '#4CAF50',
  },
  {
    id: 3,
    title: 'Instant M-Pesa Withdrawals',
    description: 'Withdraw your earnings directly to your M-Pesa account. Fast, secure, and convenient money transfers anytime!',
    icon: '💰',
    color: '#4CAF50',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: currentStepData.color }]}>
          <Text style={styles.icon}>{currentStepData.icon}</Text>
        </View>
        
        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        
        {/* Feature highlights */}
        <View style={styles.highlightsContainer}>
          {currentStep === 0 && (
            <>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>⚡</Text>
                <Text style={styles.highlightText}>Instant wins up to KES 1000</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🎯</Text>
                <Text style={styles.highlightText}>Multiple chances to win daily</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🏆</Text>
                <Text style={styles.highlightText}>Fair and transparent spins</Text>
              </View>
            </>
          )}
          
          {currentStep === 1 && (
            <>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>👥</Text>
                <Text style={styles.highlightText}>KES 100 per successful referral</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>📈</Text>
                <Text style={styles.highlightText}>Unlimited earning potential</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🔗</Text>
                <Text style={styles.highlightText}>Easy sharing with friends</Text>
              </View>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>📱</Text>
                <Text style={styles.highlightText}>Direct M-Pesa transfers</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>⚡</Text>
                <Text style={styles.highlightText}>Instant withdrawals</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🔒</Text>
                <Text style={styles.highlightText}>Secure transactions</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={nextStep} 
            style={[styles.nextButton, { backgroundColor: currentStepData.color }]}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  progressDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 50,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  highlightsContainer: {
    width: '100%',
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  highlightText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nextButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
