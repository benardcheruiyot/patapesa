import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

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
    icon: '🎰',
    color: '#FF6B6B',
  },
  {
    id: 2,
    title: 'Refer Friends & Earn',
    description: 'Share your referral code with friends and earn KES 25 for each successful registration. The more you share, the more you earn!',
    icon: '🎁',
    color: '#4ECDC4',
  },
  {
    id: 3,
    title: 'Instant M-Pesa Withdrawals',
    description: 'Withdraw your earnings directly to your M-Pesa account. Fast, secure, and convenient money transfers anytime!',
    icon: '💰',
    color: '#45B7D1',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnimation = new Animated.Value(0);

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

  const renderStep = (step: OnboardingStep, index: number) => (
    <View key={step.id} style={[styles.stepContainer, { width }]}>
      <View style={styles.stepContent}>
        <View style={[styles.iconContainer, { backgroundColor: step.color }]}>
          <Text style={styles.icon}>{step.icon}</Text>
        </View>
        
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        {/* Feature highlights */}
        <View style={styles.highlightsContainer}>
          {index === 0 && (
            <>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>⚡</Text>
                <Text style={styles.highlightText}>Instant wins up to KES 1000</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🎯</Text>
                <Text style={styles.highlightText}>Free daily spins</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🏆</Text>
                <Text style={styles.highlightText}>Guaranteed wins</Text>
              </View>
            </>
          )}
          
          {index === 1 && (
            <>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>👥</Text>
                <Text style={styles.highlightText}>KES 25 per referral</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🔄</Text>
                <Text style={styles.highlightText}>Unlimited referrals</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🎉</Text>
                <Text style={styles.highlightText}>Friend gets bonus too</Text>
              </View>
            </>
          )}
          
          {index === 2 && (
            <>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>📱</Text>
                <Text style={styles.highlightText}>Direct M-Pesa transfers</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>🔒</Text>
                <Text style={styles.highlightText}>Secure & verified</Text>
              </View>
              <View style={styles.highlight}>
                <Text style={styles.highlightIcon}>⚡</Text>
                <Text style={styles.highlightText}>Instant withdrawals</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );

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
              index === currentStep && styles.progressDotActive,
              index < currentStep && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Steps Container */}
      <View style={styles.stepsWrapper}>
        <Animated.View
          style={[
            styles.stepsContainer,
            {
              transform: [{ translateX: slideAnimation }],
            },
          ]}
        >
          {onboardingSteps.map((step, index) => renderStep(step, index))}
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.spacer} />
          
          <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>
            {currentStep === onboardingSteps.length - 1 
              ? '🎉 Join thousands earning with PataPesa!' 
              : '💫 Start earning money today!'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepsWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  stepsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  stepContent: {
    alignItems: 'center',
    paddingVertical: 40,
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
    fontSize: 48,
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
    paddingHorizontal: 10,
  },
  highlightsContainer: {
    width: '100%',
    gap: 12,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
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
    marginRight: 12,
  },
  highlightText: {
    fontSize: 14,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ctaContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  ctaText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
});
