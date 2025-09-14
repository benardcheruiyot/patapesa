import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 40, 300);

interface Prize {
  id: number;
  label: string;
  points: number;
  color: string;
}

const prizes: Prize[] = [
  { id: 1, label: 'KES 600', points: 600, color: '#FF6B6B' },
  { id: 2, label: '-KES 500', points: -500, color: '#8B0000' },
  { id: 3, label: 'KES 500', points: 500, color: '#45B7D1' },
  { id: 4, label: '-KES 750', points: -750, color: '#DC143C' },
  { id: 5, label: 'KES 800', points: 800, color: '#FFEAA7' },
  { id: 6, label: '-KES 600', points: -600, color: '#B22222' },
  { id: 7, label: 'KES 1000', points: 1000, color: '#FFD93D' },
  { id: 8, label: '-KES 1000', points: -1000, color: '#8B0000' },
];

interface SpinWheelProps {
  onWin: (points: number) => void;
  userPoints: number;
  hasUsedSpin?: boolean;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ onWin, userPoints, hasUsedSpin = false }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<Prize | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = () => {
    console.log('=== SPIN FUNCTION CALLED ===');
    console.log('Spin button pressed', { userPoints, isSpinning, hasUsedSpin });

    if (hasUsedSpin) {
      console.log('User has already used their spin');
      Alert.alert(
        'Spin Already Used',
        'You have already used your free spin! Activate your account to unlock more features.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isSpinning) {
      console.log('Already spinning, returning early');
      return;
    }

    console.log('Starting spin animation');
    setIsSpinning(true);
    setLastWin(null);

    // Reset the wheel position
    spinValue.setValue(0);

    // Filter to only positive value prizes
    const positivePrizes = prizes.filter(prize => prize.points > 0);
    const randomPositiveIndex = Math.floor(Math.random() * positivePrizes.length);
    const selectedPrize = positivePrizes[randomPositiveIndex];
    
    // Find the index of this prize in the original prizes array
    const originalPrizeIndex = prizes.findIndex(prize => prize.id === selectedPrize.id);
    
    // Calculate the rotation needed to land on the selected prize
    const degreesPerSegment = 360 / prizes.length;
    const prizeAngle = originalPrizeIndex * degreesPerSegment;
    
    // Add multiple rotations for effect (5-8 full rotations)
    const fullRotations = (Math.floor(Math.random() * 4) + 5) * 360;
    const finalAngle = fullRotations + (360 - prizeAngle);

    Animated.timing(spinValue, {
      toValue: finalAngle,
      duration: 3000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      console.log('Spin animation completed', { selectedPrize });
      setIsSpinning(false);
      setLastWin(selectedPrize);
      
      // Show alert with proper error handling
      setTimeout(() => {
        try {
          Alert.alert(
            'Congratulations! 🎉',
            `You won KES ${selectedPrize.points}!`,
            [{ 
              text: 'Collect', 
              onPress: () => {
                try {
                  console.log('Collect button pressed, calling onWin with:', selectedPrize.points);
                  onWin(selectedPrize.points);
                } catch (error) {
                  console.error('Error in onWin callback:', error);
                }
              }
            }]
          );
        } catch (error) {
          console.error('Error showing alert:', error);
          // Fallback: call onWin directly
          onWin(selectedPrize.points);
        }
      }, 100);
    });
  };

  const renderWheelSegment = (prize: Prize, index: number) => {
    const segmentAngle = 360 / prizes.length; // 45 degrees for 8 segments
    const startAngle = index * segmentAngle;
    const endAngle = startAngle + segmentAngle;
    
    // Convert to radians
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const radius = WHEEL_SIZE / 2 - 3; // Account for border
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    
    // Calculate path points
    const x1 = centerX + Math.cos(startAngleRad) * radius;
    const y1 = centerY + Math.sin(startAngleRad) * radius;
    const x2 = centerX + Math.cos(endAngleRad) * radius;
    const y2 = centerY + Math.sin(endAngleRad) * radius;
    
    // Determine if we need large arc flag
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    // Create SVG path for pie slice
    const pathData = [
      `M ${centerX} ${centerY}`, // Move to center
      `L ${x1} ${y1}`, // Line to start point
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point
      'Z' // Close path back to center
    ].join(' ');
    
    // Calculate text position (middle of segment)
    const midAngle = startAngle + segmentAngle / 2;
    const midAngleRad = (midAngle * Math.PI) / 180;
    const textRadius = radius * 0.7;
    const textX = centerX + Math.cos(midAngleRad) * textRadius;
    const textY = centerY + Math.sin(midAngleRad) * textRadius;
    
    return (
      <G key={prize.id}>
        <Path
          d={pathData}
          fill={prize.color}
          stroke="white"
          strokeWidth="2"
        />
        <SvgText
          x={textX}
          y={textY}
          fontSize="10"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle}, ${textX}, ${textY})`}
        >
          {prize.label}
        </SvgText>
      </G>
    );
  };

  const rotation = spinValue.interpolate({
    inputRange: [0, 3600], // Increased to handle multiple rotations
    outputRange: ['0deg', '3600deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View
          style={[
            styles.wheelWrapper,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} style={styles.wheel}>
            {prizes.map((prize, index) => renderWheelSegment(prize, index))}
          </Svg>
        </Animated.View>
        
        {/* Pointer */}
        <View style={styles.pointer} />
      </View>

      <TouchableOpacity
        style={[
          styles.spinButton,
          (isSpinning || hasUsedSpin) && styles.spinButtonDisabled,
        ]}
        onPress={spin}
        onPressIn={() => console.log('TouchableOpacity onPressIn triggered')}
        onPressOut={() => console.log('TouchableOpacity onPressOut triggered')}
        disabled={isSpinning || hasUsedSpin}
        activeOpacity={0.7}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'Spinning...' : hasUsedSpin ? 'Spin Used' : 'Start Spin'}
        </Text>
      </TouchableOpacity>

      {lastWin && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Last Result: {lastWin.label}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  costText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  wheelContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 6,
    borderColor: '#333',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  pointer: {
    position: 'absolute',
    top: -10,
    left: WHEEL_SIZE / 2 - 10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    zIndex: 10,
  },
  spinButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
    position: 'relative',
  },
  spinButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  spinButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
