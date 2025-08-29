import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';

interface WithdrawScreenProps {
  userBalance: number;
  userPhoneNumber: string;
  isAccountActivated: boolean;
  onGoBack: () => void;
  onWithdraw: (phoneNumber: string, amount: number) => void;
  onShowActivation: () => void;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({
  userBalance,
  userPhoneNumber,
  isAccountActivated,
  onGoBack,
  onWithdraw,
  onShowActivation,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
  const [withdrawAmount, setWithdrawAmount] = useState(userBalance.toString());
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number as user types
  const handlePhoneNumberChange = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // Format based on length
    let formatted = digits;
    if (digits.startsWith('254')) {
      formatted = `+${digits}`;
    } else if (digits.startsWith('0') && digits.length > 1) {
      formatted = `+254${digits.substring(1)}`;
    } else if (digits.length > 0 && !digits.startsWith('0') && !digits.startsWith('254')) {
      formatted = `+254${digits}`;
    }
    
    setPhoneNumber(formatted);
  };

  const validatePhoneNumber = (phone: string) => {
    // Kenyan phone number validation
    const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove spaces and convert to standard format
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.startsWith('0')) {
      return '+254' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('254')) {
      return '+' + cleanPhone;
    } else if (cleanPhone.startsWith('+254')) {
      return cleanPhone;
    }
    return phone;
  };

  const handleWithdraw = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid Kenyan phone number (e.g., 0712345678, +254712345678)'
      );
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid withdrawal amount');
      return;
    }

    if (amount > userBalance) {
      Alert.alert('Insufficient Funds', 'You cannot withdraw more than your current balance');
      return;
    }

    if (amount < 100) {
      Alert.alert('Minimum Withdrawal', 'Minimum withdrawal amount is KES 100');
      return;
    }

    // Check if account needs activation
  if (!isAccountActivated) {
    Alert.alert(
      'Activation required',
      'You need to activate your account before making any withdrawal',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Activate Account', onPress: onShowActivation }
      ]
    );
    return;
  }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    Alert.alert(
      'Activation required',
      'You need to activate your account before making any withdrawal',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate Account',
          onPress: () => {
            onShowActivation();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>KES {userBalance}</Text>
          <Text style={styles.balanceNote}>
            Minimum withdrawal: KES 100 • Processing fee: KES 25
          </Text>
        </View>

        {/* Withdrawal Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Withdrawal Details</Text>
          
          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              maxLength={13}
            />
            <Text style={styles.inputNote}>
              Enter your M-Pesa number to receive the withdrawal
            </Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Withdrawal Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount"
              placeholderTextColor="#999"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />
            <View style={styles.quickAmounts}>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setWithdrawAmount('500')}
              >
                <Text style={styles.quickAmountText}>KES 500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setWithdrawAmount('1000')}
              >
                <Text style={styles.quickAmountText}>KES 1000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setWithdrawAmount(userBalance.toString())}
              >
                <Text style={styles.quickAmountText}>All</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Processing Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📋 Processing Information</Text>
            <Text style={styles.infoText}>
              • Withdrawals are processed within 5-10 minutes{'\n'}
              • You'll receive an M-Pesa confirmation message{'\n'}
              • Processing fee: KES 25 (deducted from withdrawal){'\n'}
              • Minimum withdrawal: KES 100
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Withdraw Button */}
      <View style={styles.bottomSection}>
        {/* Validation Messages */}
        {!phoneNumber.trim() && (
          <Text style={styles.validationError}>📱 Please enter your phone number</Text>
        )}
        {phoneNumber.trim() && !validatePhoneNumber(phoneNumber) && (
          <Text style={styles.validationError}>❌ Please enter a valid Kenyan phone number</Text>
        )}
        {parseFloat(withdrawAmount) < 100 && withdrawAmount.trim() && (
          <Text style={styles.validationError}>💰 Minimum withdrawal amount is KES 100</Text>
        )}
        {parseFloat(withdrawAmount) > userBalance && (
          <Text style={styles.validationError}>⚠️ Amount exceeds available balance</Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (isLoading || !phoneNumber.trim() || parseFloat(withdrawAmount) < 100 || 
             parseFloat(withdrawAmount) > userBalance || !validatePhoneNumber(phoneNumber)) &&
              styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          disabled={isLoading || !phoneNumber.trim() || parseFloat(withdrawAmount) < 100 || 
                   parseFloat(withdrawAmount) > userBalance || !validatePhoneNumber(phoneNumber)}
        >
          <Text style={styles.withdrawButtonText}>
            {isLoading ? 'Processing...' : `Collect KES ${withdrawAmount || '0'}`}
          </Text>
        </TouchableOpacity>
      </View>
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
  balanceCard: {
    backgroundColor: 'rgba(91, 175, 120, 1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  balanceNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formCard: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  inputNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  quickAmountText: {
    color: '#666',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomSection: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#bdbdbd',
    opacity: 0.6,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  validationError: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#fff5f5',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
});
