import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView
} from 'react-native';

export const SimpleTestScreen = () => {
  const [code, setCode] = useState('');

  const handleCodeChange = (text: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const alphanumeric = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    setCode(alphanumeric);
  };

  const handleSubmit = () => {
    Alert.alert('Code Entered', `You entered: ${code}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Simple M-Pesa Code Test</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter M-Pesa code"
        value={code}
        onChangeText={handleCodeChange}
        autoCapitalize="characters"
        maxLength={10}
      />
      
      <TouchableOpacity
        style={[styles.button, code.length !== 10 && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={code.length !== 10}
      >
        <Text style={styles.buttonText}>Submit Code</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>Code length: {code.length}/10</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00A651',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    textAlign: 'center',
    color: '#666',
  },
});
