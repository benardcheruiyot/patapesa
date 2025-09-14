import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationPermissionService } from '../utils/NotificationPermissionService';
import { INAPP_FIRST_RUN_KEY } from '../utils/firstRunKeys';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAllowed?: () => void;
};

export default function FirstRunModal({ visible, onClose, onAllowed }: Props) {
  const handleAllow = async () => {
    try {
      // mark as shown so we don't nag repeatedly
      await AsyncStorage.setItem(INAPP_FIRST_RUN_KEY, '1');
    } catch (err) {
      // ignore storage errors
    }
    // Request the platform runtime permission so the system permission
    // dialog is shown. Keep the UX minimal here — no in-app reminders.
    try {
      const granted = await NotificationPermissionService.requestNotificationPermission();
      if (granted && typeof onAllowed === 'function') {
        try {
          onAllowed();
        } catch (e) {
          // ignore errors from callback
        }
      }
    } catch (err) {
      console.warn('Error requesting notification permission from modal:', err);
    }
    onClose();
  };

  const handleNotNow = async () => {
    try {
      await AsyncStorage.setItem(INAPP_FIRST_RUN_KEY, '1');
    } catch (err) {
      // ignore
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleNotNow}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View style={styles.backdrop}>
  <View style={styles.card} accessibilityRole="alert" accessibilityLabel="Allow Notifications">
          <Text style={styles.title}>🔔 Allow Notifications</Text>
          {/* Intentionally minimal body — rely on the system permission dialog for wording */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.buttonOutline} onPress={handleNotNow} accessibilityRole="button" accessibilityLabel="Not now">
              <Text style={styles.buttonOutlineText}>Not now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleAllow} accessibilityRole="button" accessibilityLabel="Allow Notifications">
              <Text style={styles.buttonPrimaryText}>Allow Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonOutlineText: {
    color: '#333',
  },
});
