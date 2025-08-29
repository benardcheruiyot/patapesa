import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  size = 'medium',
  color = '#FF3B30',
  textColor = '#FFFFFF',
  position = 'top-right',
}) => {
  if (count <= 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  const badgeSize = {
    small: 16,
    medium: 20,
    large: 24,
  }[size];

  const fontSize = {
    small: 10,
    medium: 12,
    large: 14,
  }[size];

  const positionStyle = {
    'top-right': { top: -badgeSize / 2, right: -badgeSize / 2 },
    'top-left': { top: -badgeSize / 2, left: -badgeSize / 2 },
    'bottom-right': { bottom: -badgeSize / 2, right: -badgeSize / 2 },
    'bottom-left': { bottom: -badgeSize / 2, left: -badgeSize / 2 },
  }[position];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          ...positionStyle,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: textColor,
            fontSize,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationBadge;
