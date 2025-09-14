import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Clipboard,
  Alert,
  Share,
} from 'react-native';
import { User, AuthService } from '../utils/auth';

interface ReferralScreenProps {
  user: User;
  onGoBack: () => void;
}

export const ReferralScreen: React.FC<ReferralScreenProps> = ({
  user,
  onGoBack,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [referralStats, setReferralStats] = useState({ totalReferrals: 0, totalEarnings: 0, bonusBalance: 0 });

  useEffect(() => {
    const loadReferralStats = async () => {
      const stats = await AuthService.getReferralStats(user.id);
      setReferralStats(stats);
    };
    
    loadReferralStats();
  }, [user.id]);

  const copyReferralCode = async () => {
    if (user.referralCode) {
      await Clipboard.setString(user.referralCode);
      setCopySuccess(true);
      Alert.alert('Copied!', `Referral code ${user.referralCode} copied to clipboard`);
      
      // Reset copy success indicator after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareReferralCode = async () => {
    if (user.referralCode) {
      const shareMessage = `🎉 Join PataPesa and start earning money by spinning the wheel! 

Use my referral code: ${user.referralCode}

💰 You'll get bonus points when you register
🎯 I'll earn KES 100 for each successful referral
🎮 Start playing and earning real money instantly!

Download PataPesa now and enter my code during registration!`;

      try {
        await Share.share({
          message: shareMessage,
          title: 'Join PataPesa with my referral code!',
        });
      } catch (error) {
        Alert.alert('Error', 'Could not share referral code');
      }
    }
  };

  const referralEarnings = 100; // KES per referral
  const { totalReferrals, totalEarnings } = referralStats;
  const { bonusBalance } = referralStats;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🎁</Text>
          <Text style={styles.heroTitle}>Invite Friends & Earn Money!</Text>
          <Text style={styles.heroDescription}>
            Share your referral code with friends and earn KES 100 for each successful registration
          </Text>
        </View>

        {/* Referral Code Card */}
        <View style={styles.referralCodeCard}>
          <Text style={styles.cardTitle}>Your Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.referralCode}>{user.referralCode}</Text>
            <TouchableOpacity 
              style={[styles.copyButton, copySuccess && styles.copyButtonSuccess]}
              onPress={copyReferralCode}
            >
              <Text style={styles.copyButtonText}>
                {copySuccess ? '✓ Copied' : '📋 Copy'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.shareButton} onPress={shareReferralCode}>
            <Text style={styles.shareButtonText}>📤 Share Code</Text>
          </TouchableOpacity>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.cardTitle}>How it Works</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>
                  Send your unique referral code to friends and family
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Registers</Text>
                <Text style={styles.stepDescription}>
                  They use your code when creating their PataPesa account
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>You Both Earn</Text>
                <Text style={styles.stepDescription}>
                  You get KES 100, they get bonus starting points!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.cardTitle}>Your Referral Earnings</Text>
          <View style={styles.earningsGrid}>
            <View style={styles.earningsStat}>
              <Text style={styles.statsNumber}>{totalReferrals}</Text>
              <Text style={styles.statsLabel}>Total Referrals</Text>
            </View>
            <View style={styles.earningsStat}>
              <Text style={styles.statsNumber}>KES {bonusBalance}</Text>
              <Text style={styles.statsLabel}>Referral Bonus Balance</Text>
            </View>
          </View>
          
          <View style={styles.earningsNote}>
            <Text style={styles.earningsNoteText}>
              💡 Tip: Share your code on social media, WhatsApp, or with friends to maximize your earnings!
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.cardTitle}>Referral Benefits</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>💰 Earn KES 100 per successful referral</Text>
            <Text style={styles.benefitItem}>🎁 Your friends get bonus points to start</Text>
            <Text style={styles.benefitItem}>📈 No limit on referral earnings</Text>
            <Text style={styles.benefitItem}>⚡ Instant earnings credited to your account</Text>
            <Text style={styles.benefitItem}>🌟 Build your network and earn together</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsCard}>
          <Text style={styles.termsTitle}>Referral Terms</Text>
          <Text style={styles.termsText}>
            • Each person can only use one referral code{'\n'}
            • Referral bonus is credited after successful registration{'\n'}
            • Minimum account activity required for bonus{'\n'}
            • PataPesa reserves the right to modify terms{'\n'}
            • Fraudulent referrals will be removed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(91, 175, 120, 1)',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heroCard: {
    backgroundColor: 'rgba(91, 175, 120, 1)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  referralCodeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  referralCode: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(91, 175, 120, 1)',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: 'rgba(91, 175, 120, 1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  copyButtonSuccess: {
    backgroundColor: '#28a745',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  howItWorksCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepsList: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(91, 175, 120, 1)',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  earningsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  earningsStat: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(91, 175, 120, 1)',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  earningsNote: {
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    padding: 15,
  },
  earningsNoteText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  termsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});
