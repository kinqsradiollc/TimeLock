import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/PageHeader';
import { TaskRepository } from '@/repositories/TaskRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';
import type { Category } from '@/types/category';

export default function CalendarScreen() {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        TaskRepository.findAll(),
        CategoryRepository.findAll(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.toISOString().split('T')[0] === todayStr && !task.completed;
  });

  // Get tasks for this week
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    return taskDate >= today && taskDate <= weekEnd && !task.completed;
  });

  // Get tasks for selected date
  const selectedTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    return taskDate.toISOString().split('T')[0] === selectedDate;
  });

  // Create marked dates object for calendar
  const markedDates: any = {};
  tasks.forEach(task => {
    const dateStr = new Date(task.deadline).toISOString().split('T')[0];
    if (!markedDates[dateStr]) {
      markedDates[dateStr] = { marked: true, dots: [] };
    }
  });

  // Mark selected date
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: colors.primary,
  };

  const getCategoryColor = (categoryId?: number): string | undefined => {
    if (!categoryId) return undefined;
    return categories.find(c => c.id === categoryId)?.color;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

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
      <PageHeader
        greeting={getMonthName()}
        title="Your Schedule 📅"
        showAvatar={false}
        showSettings={true}
        onSettingsPress={() => router.push('/settings')}
        stats={[
          {
            icon: 'today',
            iconColor: colors.primary,
            iconBgColor: colors.primaryLight,
            value: todayTasks.length,
            label: 'Today',
          },
          {
            icon: 'calendar',
            iconColor: colors.warning,
            iconBgColor: colors.warningLight,
            value: weekTasks.length,
            label: 'This Week',
          },
        ]}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.primary,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textTertiary,
              dotColor: colors.primary,
              selectedDotColor: '#FFFFFF',
              arrowColor: colors.primary,
              monthTextColor: colors.textPrimary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* Selected Date Tasks */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {selectedDate === todayStr ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
            <Text style={[styles.taskCount, { color: colors.textSecondary }]}>
              {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>

          {selectedTasks.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No tasks scheduled
              </Text>
            </View>
          ) : (
            selectedTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/task-detail?id=${task.id}`)}
                activeOpacity={0.7}
              >
                {getCategoryColor(task.categoryId) && (
                  <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(task.categoryId) }]} />
                )}
                <View style={styles.taskContent}>
                  <View style={styles.taskHeader}>
                    <Text style={[styles.taskTitle, { color: colors.textPrimary }, task.completed && styles.completedText]} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                      <Text style={styles.priorityText}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.taskFooter}>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                      <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        {formatTime(task.deadline)}
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
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  calendarCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
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
  tasksSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  taskCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  emptyCard: {
    borderRadius: 16,
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  taskCard: {
    borderRadius: 16,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  taskContent: {
    padding: Spacing.lg,
    paddingLeft: Spacing.lg + 8,
    gap: Spacing.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
});
