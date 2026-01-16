import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
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
import { LightColors, DarkColors } from '@/styles/common';
import { taskDetailStyles as styles } from '@/styles/screens/taskDetail.styles';
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
