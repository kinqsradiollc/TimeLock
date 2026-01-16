import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import {
  calculateTimeRemaining,
  formatTimeDisplay,
  formatDetailedCountdown,
  getUrgencyLevel,
  shouldShowUrgentIndicator,
} from '@/utils/timeTracking';

interface CountdownTimerProps {
  deadline: Date | string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showLabel?: boolean;
  detailed?: boolean;
  updateInterval?: number; // milliseconds
  onUrgent?: () => void; // Callback when timer becomes urgent
  onOverdue?: () => void; // Callback when timer becomes overdue
}

export function CountdownTimer({
  deadline,
  size = 'medium',
  showIcon = true,
  showLabel = true,
  detailed = false,
  updateInterval = 1000, // Update every second by default
  onUrgent,
  onOverdue,
}: CountdownTimerProps) {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  
  const [now, setNow] = useState(new Date());
  const [hasTriggeredUrgent, setHasTriggeredUrgent] = useState(false);
  const [hasTriggeredOverdue, setHasTriggeredOverdue] = useState(false);
  
  // Update timer at specified interval
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval]);
  
  const timeRemaining = calculateTimeRemaining(deadline, now);
  const urgencyLevel = getUrgencyLevel(timeRemaining);
  const timeDisplay = formatTimeDisplay(timeRemaining);
  
  // Trigger callbacks when state changes
  useEffect(() => {
    if (shouldShowUrgentIndicator(timeRemaining) && !hasTriggeredUrgent && onUrgent) {
      onUrgent();
      setHasTriggeredUrgent(true);
    }
    
    if (timeRemaining.isOverdue && !hasTriggeredOverdue && onOverdue) {
      onOverdue();
      setHasTriggeredOverdue(true);
    }
  }, [timeRemaining.isOverdue, timeRemaining.isUrgent, timeRemaining.isCritical]);
  
  // Get size-specific styles
  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      value: styles.valueSmall,
      unit: styles.unitSmall,
      icon: 14,
      label: styles.labelSmall,
    },
    medium: {
      container: styles.containerMedium,
      value: styles.valueMedium,
      unit: styles.unitMedium,
      icon: 18,
      label: styles.labelMedium,
    },
    large: {
      container: styles.containerLarge,
      value: styles.valueLarge,
      unit: styles.unitLarge,
      icon: 24,
      label: styles.labelLarge,
    },
  };
  
  const currentSize = sizeStyles[size];
  
  // Determine if should show pulsing animation for urgent/critical
  const shouldPulse = timeRemaining.isCritical && !timeRemaining.isOverdue;
  
  return (
    <View style={[styles.container, currentSize.container]}>
      <View style={styles.row}>
        {showIcon && (
          <Ionicons
            name={timeRemaining.isOverdue ? 'alert-circle' : 'time-outline'}
            size={currentSize.icon}
            color={urgencyLevel.color}
            style={styles.icon}
          />
        )}
        
        <View style={styles.timeContainer}>
          <View style={styles.timeRow}>
            <Text
              style={[
                currentSize.value,
                { color: urgencyLevel.color },
                shouldPulse && styles.pulse,
              ]}
            >
              {timeDisplay.value}
            </Text>
            <Text
              style={[
                currentSize.unit,
                { color: colors.textSecondary },
              ]}
            >
              {' '}{timeDisplay.unit}
            </Text>
          </View>
          
          {showLabel && (
            <Text
              style={[
                currentSize.label,
                { color: urgencyLevel.color },
              ]}
            >
              {urgencyLevel.label}
            </Text>
          )}
        </View>
      </View>
      
      {detailed && (
        <Text
          style={[
            styles.detailedText,
            { color: colors.textSecondary },
          ]}
        >
          {formatDetailedCountdown(timeRemaining)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  timeContainer: {
    flexDirection: 'column',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  
  // Small size
  containerSmall: {
    minWidth: 60,
  },
  valueSmall: {
    fontSize: 16,
    fontWeight: '700',
  },
  unitSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  
  // Medium size
  containerMedium: {
    minWidth: 80,
  },
  valueMedium: {
    fontSize: 20,
    fontWeight: '700',
  },
  unitMedium: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Large size
  containerLarge: {
    minWidth: 100,
  },
  valueLarge: {
    fontSize: 32,
    fontWeight: '800',
  },
  unitLarge: {
    fontSize: 18,
    fontWeight: '500',
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  
  detailedText: {
    fontSize: 12,
    marginTop: 4,
  },
  
  pulse: {
    // Animation would be added with react-native-reanimated
    opacity: 0.9,
  },
});
