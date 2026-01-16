import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/styles/common';
import { taskCardStyles as styles } from '@/styles/components/taskCard.styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';
import {
  calculateTimeRemaining,
  calculateProgress,
  formatTimeDisplay,
  getProgressColor,
  shouldShowUrgentIndicator,
} from '@/utils/timeTracking';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  categoryColor?: string;
}

export function TaskCard({ task, onPress, categoryColor }: TaskCardProps) {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const haptics = useHaptics();
  
  // State for real-time countdown updates
  const [now, setNow] = useState(new Date());

  // Update every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000); // Update every second for accurate countdown

    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    haptics.light();
    onPress();
  };
  
  // Use time tracking utilities
  const timeRemaining = calculateTimeRemaining(task.deadline, now);
  const timeProgress = calculateProgress(task.createdAt, task.deadline, now);
  const timeDisplay = formatTimeDisplay(timeRemaining);
  const progressColor = getProgressColor(timeProgress.percentage, timeRemaining.isOverdue);
  const showUrgentIndicator = shouldShowUrgentIndicator(timeRemaining);
  
  // Circle progress values
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - timeProgress.percentage * circumference;

  const formatDeadlineTime = () => {
    const deadline = new Date(task.deadline);
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
            <View style={styles.badgeRow}>
              {showUrgentIndicator && (
                <View style={[styles.urgentBadge, { backgroundColor: `${progressColor}20` }]}>
                  <Ionicons name="flame" size={12} color={progressColor} />
                </View>
              )}
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityText}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
            {task.description || '-'}
          </Text>
          
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
