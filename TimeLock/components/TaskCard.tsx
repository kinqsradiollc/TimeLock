import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  categoryColor?: string;
}

export function TaskCard({ task, onPress, categoryColor }: TaskCardProps) {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  
  // State for real-time countdown updates
  const [now, setNow] = useState(new Date());

  // Update every 30 seconds for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);
  
  const deadline = new Date(task.deadline);
  const createdAt = new Date(task.createdAt);
  
  const isOverdue = deadline < now;
  const totalTime = deadline.getTime() - createdAt.getTime();
  const elapsed = now.getTime() - createdAt.getTime();
  const progress = Math.min(Math.max(elapsed / totalTime, 0), 1);
  
  // Calculate time remaining
  const timeLeft = deadline.getTime() - now.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  const getTimeDisplay = () => {
    if (isOverdue) return { value: 'Over', unit: 'due' };
    if (daysLeft > 0) return { value: daysLeft, unit: daysLeft === 1 ? 'day' : 'days' };
    if (hoursLeft > 0) return { value: hoursLeft, unit: hoursLeft === 1 ? 'hr' : 'hrs' };
    return { value: minutesLeft, unit: minutesLeft === 1 ? 'min' : 'mins' };
  };
  
  const timeDisplay = getTimeDisplay();
  
  // Get progress color based on urgency
  const getProgressColor = () => {
    if (isOverdue) return colors.error;
    if (progress > 0.8) return '#EF4444'; // Red - urgent
    if (progress > 0.5) return '#F59E0B'; // Orange - medium
    return colors.primary; // Blue - good
  };
  
  const progressColor = getProgressColor();
  
  // Circle progress values
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const formatDeadlineTime = () => {
    return deadline.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getPriorityColor = () => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#F97316',
      urgent: '#EF4444',
    };
    return colors[task.priority];
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${task.title}`}
    >
      <View style={styles.content}>
        {categoryColor && (
          <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
        )}
        
        <View style={styles.mainContent}>
          {/* Title and Priority */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.textPrimary }, task.completed && styles.completedText]} numberOfLines={2}>
              {task.title}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>
          </View>
          
          {/* Description */}
          {task.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
              {task.description}
            </Text>
          )}
          
          {/* Time and Category Info */}
          <View style={styles.infoRow}>
            <View style={styles.timeInfo}>
              <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {formatDeadlineTime()}
              </Text>
            </View>
            {task.completed && (
              <View style={[styles.statusBadge, { backgroundColor: colors.successLight }]}>
                <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>Done</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Circular Progress Timer - Right Side */}
        <View style={styles.progressContainer}>
          <Svg width={size} height={size} style={styles.progressSvg}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`${colors.border}80`}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
          <View style={styles.progressText}>
            <Text style={[styles.timeValue, { color: progressColor }]} numberOfLines={1}>
              {timeDisplay.value}
            </Text>
            <Text style={[styles.timeUnit, { color: colors.textTertiary }]} numberOfLines={1}>
              {timeDisplay.unit}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: Typography.sm,
    lineHeight: 18,
    marginTop: -2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  progressContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: Typography.bold,
    lineHeight: 20,
  },
  timeUnit: {
    fontSize: 9,
    fontWeight: Typography.semibold,
    lineHeight: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
