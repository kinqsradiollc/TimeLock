import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { TaskRepository } from '@/repositories/TaskRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';
import type { Category } from '@/types/category';

export default function TasksScreen() {
  const router = useRouter();
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const sectionListRef = useRef<SectionList>(null);

  // Update current time every minute for countdown updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = useCallback(async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        TaskRepository.findAll(),
        CategoryRepository.findAll(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const getCategoryColor = (categoryId?: number): string | undefined => {
    if (!categoryId) return undefined;
    return categories.find(c => c.id === categoryId)?.color;
  };

  // Group tasks by date - must be before conditional returns
  const groupedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter tasks based on completion status and active filter
    let filteredTasks = tasks.filter(task => {
      // Filter by task status
      if (taskStatusFilter === 'active' && task.completed) return false;
      if (taskStatusFilter === 'completed' && !task.completed) return false;
      // 'all' shows both
      
      const taskDate = new Date(task.deadline);
      const taskDateOnly = new Date(taskDate);
      taskDateOnly.setHours(0, 0, 0, 0);
      
      // Filter by time range
      if (activeFilter === 'today') {
        return taskDateOnly.getTime() === today.getTime();
      } else if (activeFilter === 'upcoming') {
        return taskDateOnly.getTime() > today.getTime();
      }
      
      return true; // 'all' filter
    });
    
    // Separate overdue and upcoming tasks
    const overdueTasks: Task[] = [];
    const upcomingGroups: { [key: string]: Task[] } = {};
    
    filteredTasks.forEach(task => {
      const taskDate = new Date(task.deadline);
      const taskDateOnly = new Date(taskDate);
      taskDateOnly.setHours(0, 0, 0, 0);
      
      // Check if task is overdue (not completed and deadline has passed)
      if (!task.completed && taskDateOnly.getTime() < today.getTime()) {
        overdueTasks.push(task);
      } else {
        const dateKey = taskDate.toDateString();
        if (!upcomingGroups[dateKey]) {
          upcomingGroups[dateKey] = [];
        }
        upcomingGroups[dateKey].push(task);
      }
    });
    
    // Sort tasks within each group by deadline time
    overdueTasks.sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
    
    Object.keys(upcomingGroups).forEach(key => {
      upcomingGroups[key].sort((a, b) => 
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    });
    
    // Convert to section list format
    const sections = [];
    
    // Add overdue section first if there are overdue tasks
    if (overdueTasks.length > 0) {
      sections.push({
        title: 'OVERDUE',
        data: overdueTasks,
      });
    }
    
    // Always add Today section (even if empty) when on 'all' or 'today' filter
    const todayDateString = today.toDateString();
    if (activeFilter !== 'upcoming') {
      const todayTasks = upcomingGroups[todayDateString] || [];
      sections.push({
        title: todayDateString,
        data: todayTasks,
      });
      delete upcomingGroups[todayDateString];
    }
    
    // Add upcoming sections sorted by date
    const upcomingSections = Object.entries(upcomingGroups)
      .map(([dateString, tasks]) => ({
        title: dateString,
        data: tasks,
      }))
      .sort((a, b) => 
        new Date(a.title).getTime() - new Date(b.title).getTime()
      );
    
    return [...sections, ...upcomingSections];
  }, [tasks, activeFilter, taskStatusFilter]);

  const formatSectionDate = (dateString: string) => {
    if (dateString === 'OVERDUE') {
      return '🔴 Overdue';
    }
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Auto-scroll to Today section when tasks load
  useEffect(() => {
    if (!loading && groupedTasks.length > 0) {
      const todayIndex = groupedTasks.findIndex(section => 
        formatSectionDate(section.title) === 'Today'
      );
      if (todayIndex !== -1) {
        setTimeout(() => {
          sectionListRef.current?.scrollToLocation({
            sectionIndex: todayIndex,
            itemIndex: 0,
            animated: true,
            viewPosition: 0,
          });
        }, 100);
      }
    }
  }, [loading, groupedTasks]);

  // Loading check after all hooks
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading tasks...</Text>
      </SafeAreaView>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PageHeader
        greeting={getGreeting()}
        title="Let's be productive! 🚀"
        showAvatar={false}
        showSettings={true}
        onSettingsPress={() => router.push('/settings')}
        stats={[
          {
            icon: 'list',
            iconColor: colors.primary,
            iconBgColor: colors.primaryLight,
            value: activeTasks,
            label: 'Active',
            onPress: () => setTaskStatusFilter('active'),
            active: taskStatusFilter === 'active',
          },
          {
            icon: 'checkmark-circle',
            iconColor: colors.success,
            iconBgColor: colors.successLight,
            value: completedTasks,
            label: 'Done',
            onPress: () => setTaskStatusFilter('completed'),
            active: taskStatusFilter === 'completed',
          },
        ]}
        filters={[
          { label: 'All', active: activeFilter === 'all', onPress: () => setActiveFilter('all') },
          { label: 'Today', active: activeFilter === 'today', onPress: () => setActiveFilter('today') },
          { label: 'Upcoming', active: activeFilter === 'upcoming', onPress: () => setActiveFilter('upcoming') },
        ]}
      />

      <SectionList
        ref={sectionListRef}
        sections={groupedTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            categoryColor={getCategoryColor(item.categoryId)}
            onPress={() => router.push(`/task-detail?id=${item.id}`)}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {formatSectionDate(title)}
            </Text>
            <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
          </View>
        )}
        renderSectionFooter={({ section: { title, data } }) => {
          // Show message when Today section is empty
          if (formatSectionDate(title) === 'Today' && data.length === 0) {
            return (
              <View style={[styles.emptyTodayContainer, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.emptyTodayText, { color: colors.textSecondary }]}>✨ No tasks for today</Text>
                <Text style={[styles.emptyTodaySubtext, { color: colors.textTertiary }]}>Enjoy your free time!</Text>
              </View>
            );
          }
          return null;
        }}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : styles.listContent}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            message="No tasks yet"
            subtitle="Tap + to create your first task"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xxxl,
    fontSize: Typography.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },
  emptyTodayContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyTodayText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.xs,
  },
  emptyTodaySubtext: {
    fontSize: Typography.sm,
  },
});
  