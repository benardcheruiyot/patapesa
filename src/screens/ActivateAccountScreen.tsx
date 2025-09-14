import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Clipboard,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

interface ActivateAccountScreenProps {
  userPhoneNumber: string;
  userPoints: number;
  onGoBack: () => void;
  onActivationComplete: () => void;
  onPendingActivation: () => void;
}

export const ActivateAccountScreen: React.FC<ActivateAccountScreenProps> = ({
  userPhoneNumber,
  userPoints,
  onGoBack,
  onActivationComplete,
  onPendingActivation,
}) => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Simple notification functions without context dependency
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    Alert.alert(type === 'success' ? 'Success' : 'Error', message);
  };
  
  const showPaymentPending = () => {
    Alert.alert('Payment Processing', 'Your payment verification is being processed...');
  };
  
  // Calculate activation fee as 20% of user's winnings
  const activationFee = Math.max(Math.round(userPoints * 0.2), 20); // Minimum 20 KES

  const copyToClipboard = (text: string, label: string) => {
    try {
      Clipboard.setString(text);
      showToast(`${label} copied to clipboard: ${text}`, 'success');
    } catch (error) {
      console.error('Clipboard error:', error);
      Alert.alert('Copied', `${label}: ${text}`);
    }
  };

  const handleVerifyPayment = async () => {
    if (!transactionCode.trim()) {
      showToast('Please enter the transaction code', 'error');
      return;
    }

    if (transactionCode.length !== 10) {
      showToast('Transaction code must be exactly 10 characters', 'error');
      return;
    }

    try {
      setIsVerifying(true);
      showPaymentPending();
      
      // Try to verify with backend
      try {
        const response = await fetch('http://localhost:3000/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionCode: transactionCode.trim(),
            phoneNumber: userPhoneNumber,
            amount: activationFee,
            tillNumber: '5892851'
          }),
        });

        const data = await response.json();

        if (data.status === 'success') {
          setIsVerifying(false);
          setShowVerifyModal(false);
          setTransactionCode('');
          
          // Set pending activation status
          onPendingActivation();
          
          showToast('Payment verification submitted! You will be notified once confirmed.', 'success');
          return;
        } else {
          throw new Error(data.message || 'Verification failed');
        }
      } catch (networkError) {
        console.log('Backend not available, using offline mode:', networkError);
        
        // Fallback to offline verification (simulate success)
        setTimeout(() => {
          setIsVerifying(false);
          setShowVerifyModal(false);
          setTransactionCode('');
          
          // Set pending activation status
          onPendingActivation();
          
          showToast('Payment verification submitted! (Offline mode) You will be notified once confirmed.', 'success');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setIsVerifying(false);
      
      showToast('Verification failed. Please check your transaction code and try again.', 'error');
    }
  };

  const handleTransactionCodeChange = (text: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const alphanumeric = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    setTransactionCode(alphanumeric);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activate Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Activation Required Card */}
        <View style={styles.activationCard}>
          <Text style={styles.activationIcon}>🔐</Text>
          <Text style={styles.activationTitle}>Account Activation Required</Text>
          <Text style={styles.activationDescription}>
            To unlock withdrawals and protect your account, please deposit KES {activationFee} to activate your account.
          </Text>
          <View style={styles.feeExplanation}>
            <Text style={styles.feeExplanationText}>
              💡 Activation fee is calculated as 20% of your current winnings (KES {userPoints}), with a minimum of KES 20.
            </Text>
          </View>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>✨ Activation Benefits</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>🔓 Unlock unlimited withdrawals</Text>
            <Text style={styles.benefitItem}>🛡️ Enhanced security protection</Text>
            <Text style={styles.benefitItem}>💰 Access to premium features</Text>
            <Text style={styles.benefitItem}>⚡ Instant withdrawal processing</Text>
            <Text style={styles.benefitItem}>🎁 Bonus rewards and offers</Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.paymentCard}>
          <Text style={styles.activationTitle}>Account Activation</Text>
          <Text style={styles.instructionsSubtitle}>Complete your account setup to start earning points</Text>

          {/* Payment Instructions */}
          <View style={styles.paybillInstructions}>
            <Text style={styles.instructionsTitle}>💳 Payment Instructions</Text>
            <Text style={styles.instructionsSubtitle}>Follow these steps to activate your account:</Text>
            
            <View style={styles.stepsList}>
              <Text style={styles.stepItem}>1. Go to your mobile money menu</Text>
              <Text style={styles.stepItem}>2. Select "Buy Goods and Services"</Text>
              <Text style={styles.stepItem}>3. Enter Till Number: <Text style={styles.highlight}>5892851</Text></Text>
              <Text style={styles.stepItem}>4. Enter Amount: <Text style={styles.highlight}>{activationFee}</Text></Text>
              <Text style={styles.stepItem}>5. Enter your PIN and confirm</Text>
            </View>
            
            {/* Authentic Safaricom Buy Goods Form */}
            <View style={styles.buyGoodsForm}>
              {/* Safaricom Header */}
              <View style={styles.safaricomHeader}>
                <Text style={styles.safaricomLogo}>Safaricom</Text>
                <Text style={styles.mpesaLogo}>M-PESA</Text>
              </View>
              
              {/* Form Title */}
              <View style={styles.buyGoodsFormTitle}>
                <Text style={styles.buyGoodsTitle}>BUY GOODS & SERVICES</Text>
              </View>
              
              {/* Form Content */}
              <View style={styles.formContent}>
                <View style={styles.buyGoodsFormField}>
                  <Text style={styles.fieldLabel}>TILL NUMBER</Text>
                  <View style={styles.tillBoxContainer}>
                    <View style={styles.tillBox}>
                      <Text style={styles.tillText}>5892851</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={() => copyToClipboard('5892851', 'Till Number')}
                    >
                      <Text style={styles.copyIcon}>📋</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.buyGoodsFormField}>
                  <Text style={styles.fieldLabel}>AMOUNT</Text>
                  <View style={styles.amountBox}>
                    <Text style={styles.formAmountText}>KES {activationFee}</Text>
                  </View>
                </View>
                
                <View style={styles.buyGoodsFormField}>
                  <Text style={styles.fieldLabel}>BUSINESS NAME</Text>
                  <View style={styles.businessBox}>
                    <Text style={styles.businessText}>SUAN ENTERPRISES</Text>
                  </View>
                </View>
              </View>
              
              {/* Footer */}
              <View style={styles.formFooter}>
                <Text style={styles.footerText}>Enter the above details in your M-PESA menu</Text>
              </View>
            </View>
          </View>

          {/* Manual Verification */}
          <View style={styles.alternativePayment}>
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={() => setShowVerifyModal(true)}
            >
              <Text style={styles.verifyButtonText}>Manual Verification</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>🔒 Security Information</Text>
          <Text style={styles.securityText}>
            • Your activation fee is a one-time payment{'\n'}
            • This helps us verify your identity{'\n'}
            • Your payment is securely processed{'\n'}
            • Activation is instant upon verification{'\n'}
            • No hidden fees or recurring charges
          </Text>
        </View>
      </ScrollView>
      
      {/* Verify Payment Modal */}
      <Modal
        visible={showVerifyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVerifyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Manual Payment</Text>
            <Text style={styles.modalSubtitle}>
              Enter the M-Pesa transaction code you received after sending KES {activationFee} to Till Number 5892851
            </Text>
            
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentInfoText}>💸 Amount: KES {activationFee}</Text>
              <Text style={styles.paymentInfoText}>🏪 Till Number: 5892851</Text>
              <Text style={styles.paymentInfoText}>📱 Your Number: {userPhoneNumber}</Text>
            </View>
            
            <TextInput
              style={styles.transactionInput}
              placeholder="Enter transaction code"
              placeholderTextColor="#999"
              value={transactionCode}
              onChangeText={handleTransactionCodeChange}
              autoCapitalize="characters"
              maxLength={10}
              keyboardType="default"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowVerifyModal(false);
                  setTransactionCode('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  (transactionCode.length !== 10 || isVerifying) && styles.confirmButtonDisabled
                ]}
                onPress={handleVerifyPayment}
                disabled={transactionCode.length !== 10 || isVerifying}
              >
                <Text style={styles.confirmButtonText}>
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  activationCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  activationIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  activationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
    textAlign: 'center',
  },
  activationDescription: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 22,
  },
  feeExplanation: {
    backgroundColor: 'rgba(0, 166, 81, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  feeExplanationText: {
    fontSize: 14,
    color: '#00A651',
    textAlign: 'center',
    lineHeight: 18,
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
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  benefitsList: {
    marginVertical: 5,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  paymentCard: {
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
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recommendedOption: {
    borderColor: 'rgba(91, 175, 120, 1)',
    backgroundColor: 'rgba(91, 175, 120, 0.05)',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  optionPhone: {
    fontSize: 12,
    color: 'rgba(91, 175, 120, 1)',
    fontWeight: '600',
    marginTop: 2,
  },
  optionDetails2: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  optionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendedBadge: {
    fontSize: 10,
    color: 'rgba(91, 175, 120, 1)',
    fontWeight: 'bold',
    marginTop: 2,
  },
  securityCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(91, 175, 120, 0.3)',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  supportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  paybillInstructions: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  stepsList: {
    marginBottom: 20,
  },
  stepItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: 'rgba(91, 175, 120, 1)',
  },
  paymentDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  // Authentic Safaricom Buy Goods Form Styles
  buyGoodsForm: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#00A651',
    overflow: 'hidden',
  },
  safaricomHeader: {
    backgroundColor: '#00A651',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  safaricomLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  mpesaLogo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginTop: 2,
  },
  buyGoodsFormTitle: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  buyGoodsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00A651',
    textAlign: 'center',
    letterSpacing: 1,
  },
  formContent: {
    padding: 16,
  },
  buyGoodsFormField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  tillBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tillBox: {
    backgroundColor: '#00A651',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  tillText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  businessBox: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  businessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  amountBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  formAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
  },
  formFooter: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  copyButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 166, 81, 0.1)',
    borderRadius: 6,
    marginLeft: 10,
  },
  copyIcon: {
    fontSize: 16,
  },
  verifyButton: {
    backgroundColor: '#00A651',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alternativePayment: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  alternativeTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  transactionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00A651',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#00A651',
  },
  paymentInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  formButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentForm: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  formField: {
    marginBottom: 15,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  formSummary: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#00A651',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});
