import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PataPesaLogoProps {
  size?: number;
  color?: string;
}

export const PataPesaLogo: React.FC<PataPesaLogoProps> = ({ 
  size = 80, 
  color = '#4CAF50' 
}) => {
  return (
    <View style={[styles.logoContainer, { width: size, height: size }]}>
      <View style={[styles.squareOuter, { 
        width: size, 
        height: size, 
        borderColor: color,
        borderRadius: size * 0.2 
      }]}>
        <View style={[styles.squareInner, { 
          width: size * 0.8, 
          height: size * 0.8, 
          backgroundColor: color,
          borderRadius: size * 0.15 
        }]}>
          <Text style={[styles.currencySymbol, { fontSize: size * 0.18 }]}>
            PataPesa
          </Text>
          <Text style={[styles.dollarIcon, { fontSize: size * 0.15 }]}>$</Text>
        </View>
      </View>
      <View style={[styles.shine, { 
        width: size * 0.15, 
        height: size * 0.15, 
        top: size * 0.15, 
        left: size * 0.25 
      }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  squareOuter: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: 'white',
  },
  squareInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySymbol: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  dollarIcon: {
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 50,
  },
});
