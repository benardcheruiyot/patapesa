import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';

interface MenuOption {
  id: string;
  label: string;
  onPress: () => void;
  color?: string;
}

interface ThreeDotsMenuProps {
  options: MenuOption[];
}

export const ThreeDotsMenu: React.FC<ThreeDotsMenuProps> = ({ options }) => {
  const [visible, setVisible] = useState(false);

  const handleOptionPress = (option: MenuOption) => {
    setVisible(false);
    setTimeout(() => {
      option.onPress();
    }, 100);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.menuContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.menuOption}
                onPress={() => handleOptionPress(option)}
              >
                <Text
                  style={[
                    styles.menuOptionText,
                    option.color && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    marginHorizontal: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  menuOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
