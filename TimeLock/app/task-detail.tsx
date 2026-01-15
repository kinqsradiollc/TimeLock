import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { TaskRepository } from '@/repositories/TaskRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';
import type { Category } from '@/types/category';

export default function TaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = Number(params.id);
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  const [task, setTask] = useState<Task | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Reload task when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [taskId])
  );

  const loadTask = async () => {
    try {
      const taskData = await TaskRepository.findById(taskId);
      if (!taskData) {
        Alert.alert('Error', 'Task not found');
        router.back();
        return;
      }
      setTask(taskData);

      if (taskData.categoryId) {
        const categoryData = await CategoryRepository.findById(taskData.categoryId);
        setCategory(categoryData);
      }
    } catch (error) {
      console.error('Failed to load task:', error);
      Alert.alert('Error', 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      await TaskRepository.toggleCompletion(task.id!);
      await loadTask();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await TaskRepository.delete(taskId);
              router.back();
            } catch (error) {
              console.error('Failed to delete task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!task) {
    return null;
  }

  const deadline = new Date(task.deadline);
  const isOverdue = deadline < new Date() && !task.completed;

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#F97316',
      urgent: '#EF4444',
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Task Details</Text>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/task-form?id=${taskId}`)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }, task.completed && styles.completedTitle]}>
            {task.title}
          </Text>
          
          <View style={styles.metaRow}>
            {category && (
              <View style={[styles.categoryBadge, { backgroundColor: `${category.color}20` }]}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
              </View>
            )}
            
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <Text style={styles.priorityText}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        {task.description && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Description</Text>
            </View>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{task.description}</Text>
          </View>
        )}

        {/* Deadline Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Deadline</Text>
          </View>
          <View style={styles.deadlineContent}>
            <Text style={[styles.deadlineText, { color: colors.textPrimary }, isOverdue && { color: colors.error }]}>
              {format(deadline, 'EEEE, MMMM d, yyyy')}
            </Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={16} color={isOverdue ? colors.error : colors.textSecondary} />
              <Text style={[styles.deadlineTime, { color: colors.textSecondary }, isOverdue && { color: colors.error }]}>
                {format(deadline, 'h:mm a')}
              </Text>
            </View>
            {isOverdue && (
              <View style={[styles.overdueBadge, { backgroundColor: colors.errorLight }]}>
                <Ionicons name="alert-circle" size={14} color={colors.error} />
                <Text style={[styles.overdueText, { color: colors.error }]}>Overdue</Text>
              </View>
            )}
          </View>
        </View>

        {/* Status Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Status</Text>
          </View>
          <View style={[styles.statusContainer, { backgroundColor: task.completed ? colors.successLight : colors.surfaceAlt }]}>
            <Ionicons 
              name={task.completed ? "checkmark-circle" : "time-outline"} 
              size={18} 
              color={task.completed ? colors.success : colors.textSecondary} 
            />
            <Text style={[styles.statusText, { color: task.completed ? colors.success : colors.textSecondary }]}>
              {task.completed ? 'Completed' : 'In Progress'}
            </Text>
          </View>
        </View>

        {/* Created Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Created</Text>
          </View>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {format(new Date(task.createdAt), 'MMM d, yyyy • h:mm a')}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actions, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: task.completed ? colors.textSecondary : colors.success }]}
          onPress={handleToggleComplete}
          activeOpacity={0.8}
        >
          <Ionicons name={task.completed ? "close-circle-outline" : "checkmark-circle"} size={22} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, { borderColor: colors.error, backgroundColor: colors.background }]} 
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={[styles.deleteButtonText, { color: colors.error }]}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    lineHeight: 32,
    marginBottom: Spacing.md,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  description: {
    fontSize: Typography.base,
    lineHeight: 24,
  },
  deadlineContent: {
    gap: Spacing.xs,
  },
  deadlineText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    lineHeight: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  deadlineTime: {
    fontSize: Typography.base,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.xs,
  },
  overdueText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  metaText: {
    fontSize: Typography.base,
    lineHeight: 22,
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: 16,
    padding: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  completeButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
  },
  deleteButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xxxl,
    fontSize: Typography.md,
  },
});
