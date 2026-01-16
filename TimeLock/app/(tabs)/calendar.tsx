import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/PageHeader';
import { TaskRepository } from '@/repositories/TaskRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import CalendarSyncService from '@/services/CalendarSyncService';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { calendarStyles as styles } from '@/styles/screens/calendar.styles';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';
import type { Category } from '@/types/category';

export default function CalendarScreen() {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'agenda'>('month');
  const [currentTime, setCurrentTime] = useState(new Date());
  const weekScrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (calendarView === 'week' && weekScrollViewRef.current) {
      const currentDate = new Date(selectedDate);
      const dayOfWeek = currentDate.getDay();
      const scrollPosition = dayOfWeek * 92; // 80 (card width) + 12 (margin)
      setTimeout(() => {
        weekScrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
      }, 100);
    }
  }, [selectedDate, calendarView]);

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
    return currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getCurrentDateTime = () => {
    const dateStr = currentTime.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = currentTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${dateStr} • ${timeStr}`;
  };

  // Get tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = (() => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();
  
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    taskDate.setHours(0, 0, 0, 0);
    const taskDateStr = (() => {
      const year = taskDate.getFullYear();
      const month = String(taskDate.getMonth() + 1).padStart(2, '0');
      const day = String(taskDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })();
    return taskDateStr === todayStr && !task.completed;
  });

  // Get tasks for this week
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    return taskDate >= today && taskDate <= weekEnd && !task.completed;
  });

  // Get tasks for selected date
  const dateFilteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    return taskDate.toISOString().split('T')[0] === selectedDate;
  });

  // Create marked dates object for calendar
  const markedDates: any = {};
  tasks.forEach(task => {
    const dateStr = new Date(task.deadline).toISOString().split('T')[0];
    if (!markedDates[dateStr]) {
      markedDates[dateStr] = { marked: true, dotColor: colors.primary };
    }
  });

  // Mark selected date
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: colors.primary,
  };
  
  // Highlight today with different color if not selected
  if (selectedDate !== todayStr && markedDates[todayStr]) {
    markedDates[todayStr].dotColor = colors.warning;
  }

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

  const handleExportToDeviceCalendar = async (selectedOnly: boolean = false) => {
    setSyncing(true);
    try {
      let tasksToExport: Task[];
      
      if (selectedOnly && selectionMode) {
        tasksToExport = tasks.filter(t => selectedTasks.has(t.id!));
      } else {
        tasksToExport = tasks.filter(t => !t.completed);
      }
      
      if (tasksToExport.length === 0) {
        Alert.alert('No Tasks', 'No tasks to export.');
        setSyncing(false);
        return;
      }
      
      const result = await CalendarSyncService.exportTasksToCalendar(tasksToExport, {
        skipDuplicates: true,
        updateExisting: false
      });
      
      const total = result.success + result.skipped + result.failed;
      let title = '✅ Export Complete';
      let message = '';
      
      if (result.success > 0) {
        message += `✓ ${result.success} task${result.success > 1 ? 's' : ''} exported to device calendar\n`;
      }
      if (result.skipped > 0) {
        message += `⊘ ${result.skipped} task${result.skipped > 1 ? 's' : ''} already synced (skipped)\n`;
      }
      if (result.failed > 0) {
        title = '⚠️ Export Completed with Errors';
        message += `✗ ${result.failed} task${result.failed > 1 ? 's' : ''} failed to export\n`;
      }
      
      message += `\n📱 Check your device calendar app to view ${result.success > 0 ? 'the exported tasks' : 'synced tasks'}.`;
      
      Alert.alert(title, message.trim(), [{ text: 'OK' }]);
      
      // Exit selection mode
      if (selectionMode) {
        setSelectionMode(false);
        setSelectedTasks(new Set());
      }
      
      // Reload to get updated calendar event IDs
      await loadData();
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export tasks to device calendar.');
    } finally {
      setSyncing(false);
    }
  };

  const showExportOptions = () => {
    if (selectionMode && selectedTasks.size === 0) {
      Alert.alert('No Selection', 'Please select tasks to export.');
      return;
    }
    
    const options: any[] = [
      {
        text: selectionMode ? `Device Calendar (${selectedTasks.size} selected)` : 'Device Calendar (All)',
        onPress: () => handleExportToDeviceCalendar(selectionMode),
      },
      {
        text: 'ICS File',
        onPress: handleExportToICS,
      },
    ];
    
    if (!selectionMode) {
      options.unshift({
        text: 'Select Tasks',
        onPress: () => setSelectionMode(true),
      });
    }
    
    options.push({
      text: 'Cancel',
      style: 'cancel',
    });
    
    Alert.alert(
      selectionMode ? 'Export Selected Tasks' : 'Export Tasks',
      selectionMode ? `${selectedTasks.size} task(s) selected` : 'Choose an export option',
      options
    );
  };
  
  const toggleTaskSelection = (taskId: number) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };
  
  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedTasks(new Set());
  };

  const handleExportToICS = async () => {
    setSyncing(true);
    try {
      const fileUri = await CalendarSyncService.exportToICSFile(tasks);
      
      if (fileUri) {
        const taskCount = tasks.length;
        // Share the file
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          await Share.share({
            url: fileUri,
            title: `TimeLock Tasks (${taskCount} tasks)`,
            message: `📅 Sharing ${taskCount} task${taskCount > 1 ? 's' : ''} from TimeLock\n\nImport this file into any calendar app that supports .ics format.`,
          });
        } else {
          Alert.alert(
            '✅ Export Successful', 
            `${taskCount} task${taskCount > 1 ? 's' : ''} exported to ICS file.\n\n📁 Location: ${fileUri}\n\n💡 You can import this file into any calendar app.`,
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert('❌ Export Failed', 'Could not create ICS file. Please try again.');
      }
    } catch (error) {
      Alert.alert('❌ Export Failed', 'An error occurred while exporting tasks to ICS file. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PageHeader
        greeting={getCurrentDateTime()}
        title="Your Schedule 📅"
        showAvatar={false}
        showSettings={!selectionMode}
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
        {/* Calendar View Selector */}
        <View style={styles.viewSelector}>
          <TouchableOpacity
            style={[styles.viewButton, calendarView === 'month' && { backgroundColor: colors.primaryLight }]}
            onPress={() => {
              setCalendarView('month');
              setSelectedDate(todayStr);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewButtonText, { color: calendarView === 'month' ? colors.primary : colors.textSecondary }]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, calendarView === 'week' && { backgroundColor: colors.primaryLight }]}
            onPress={() => {
              setCalendarView('week');
              setSelectedDate(todayStr);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewButtonText, { color: calendarView === 'week' ? colors.primary : colors.textSecondary }]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, calendarView === 'agenda' && { backgroundColor: colors.primaryLight }]}
            onPress={() => setCalendarView('agenda')}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewButtonText, { color: calendarView === 'agenda' ? colors.primary : colors.textSecondary }]}>
              Agenda
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        {calendarView === 'month' && (
        <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
          <Calendar
            key={selectedDate}
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
        )}

        {calendarView === 'week' && (
          <View style={[styles.calendarCard, { backgroundColor: colors.surface, padding: Spacing.md }]}>
            <View style={styles.weekViewHeader}>
              <Text style={[styles.weekViewTitle, { color: colors.textPrimary }]}>
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <ScrollView 
              ref={weekScrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.weekDaysScroll}
            >
              {(() => {
                const currentDate = new Date(selectedDate);
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                
                return Array.from({ length: 7 }, (_, i) => {
                  const date = new Date(startOfWeek);
                  date.setDate(startOfWeek.getDate() + i);
                  const dateString = date.toISOString().split('T')[0];
                  const isSelected = dateString === selectedDate;
                  const tasksOnDate = tasks.filter(t => t.deadline.split('T')[0] === dateString).length;
                  
                  return (
                    <TouchableOpacity
                      key={dateString}
                      style={[
                        styles.weekDayCard,
                        isSelected && { backgroundColor: colors.primary },
                        { borderColor: colors.border }
                      ]}
                      onPress={() => setSelectedDate(dateString)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.weekDayName,
                        { color: isSelected ? '#FFFFFF' : colors.textSecondary }
                      ]}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      <Text style={[
                        styles.weekDayNumber,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary }
                      ]}>
                        {date.getDate()}
                      </Text>
                      {tasksOnDate > 0 && (
                        <View style={[styles.weekDayBadge, isSelected && { backgroundColor: '#FFFFFF' }]}>
                          <Text style={[styles.weekDayBadgeText, { color: isSelected ? colors.primary : '#FFFFFF' }]}>
                            {tasksOnDate}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                });
              })()}
            </ScrollView>
          </View>
        )}

        {calendarView === 'agenda' && (
          <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
            <View style={styles.agendaHeader}>
              <Text style={[styles.agendaTitle, { color: colors.textPrimary }]}>Upcoming Tasks</Text>
              {selectionMode ? (
                <View style={styles.selectionActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={cancelSelectionMode}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, { opacity: selectedTasks.size > 0 ? 1 : 0.5 }]}
                    onPress={showExportOptions}
                    disabled={selectedTasks.size === 0}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={showExportOptions}
                  activeOpacity={0.7}
                >
                  <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={styles.agendaScroll} showsVerticalScrollIndicator={false}>
              {(() => {
                const groupedTasks = tasks
                  .filter(t => !t.completed && new Date(t.deadline).getTime() >= new Date(todayStr).getTime())
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .reduce((acc, task) => {
                    const dateKey = task.deadline.split('T')[0];
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(task);
                    return acc;
                  }, {} as Record<string, Task[]>);
                
                return Object.entries(groupedTasks).slice(0, 7).map(([date, dateTasks]) => (
                  <View key={date} style={styles.agendaDateGroup}>
                    <TouchableOpacity onPress={() => setSelectedDate(date)} activeOpacity={0.7}>
                      <Text style={[styles.agendaDate, { color: colors.textPrimary }]}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </TouchableOpacity>
                    {dateTasks.map(task => (
                      <TouchableOpacity
                        key={task.id}
                        style={[styles.agendaTask, { backgroundColor: colors.surfaceAlt }]}
                        onPress={() => {
                          if (selectionMode) {
                            toggleTaskSelection(task.id!);
                          } else {
                            router.push(`/modal?taskId=${task.id}`);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        {selectionMode && (
                          <View style={styles.agendaCheckbox}>
                            <View
                              style={[
                                styles.checkbox,
                                {
                                  borderColor: selectedTasks.has(task.id!) ? colors.primary : colors.border,
                                  backgroundColor: selectedTasks.has(task.id!) ? colors.primary : 'transparent',
                                },
                              ]}
                            >
                              {selectedTasks.has(task.id!) && (
                                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                              )}
                            </View>
                          </View>
                        )}
                        <View style={[styles.agendaTaskContent, selectionMode && { marginLeft: 8 }]}>
                          <Text style={[styles.agendaTaskTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                            {task.title}
                          </Text>
                          <Text style={[styles.agendaTaskTime, { color: colors.textSecondary }]}>
                            {new Date(task.deadline).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                        </View>
                        {task.priority && (
                          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                            <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ));
              })()}
            </ScrollView>
          </View>
        )}

        {/* Selected Date Tasks - Hidden in Agenda View */}
        {calendarView !== 'agenda' && (
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {selectedDate === todayStr ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
              <Text style={[styles.taskCount, { color: colors.textSecondary }]}>
                {dateFilteredTasks.length} {dateFilteredTasks.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>
            {selectionMode ? (
              <View style={styles.selectionActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={cancelSelectionMode}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { opacity: selectedTasks.size > 0 ? 1 : 0.5 }]}
                  onPress={showExportOptions}
                  disabled={selectedTasks.size === 0}
                  activeOpacity={0.7}
                >
                  <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={showExportOptions}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {dateFilteredTasks.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No tasks scheduled
              </Text>
            </View>
          ) : (
            dateFilteredTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskCard, { backgroundColor: colors.surface }]}
                onPress={() => {
                  if (selectionMode) {
                    toggleTaskSelection(task.id!);
                  } else {
                    router.push(`/task-detail?id=${task.id}`);
                  }
                }}
                activeOpacity={0.7}
              >
                {selectionMode && (
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      { 
                        borderColor: colors.border,
                        backgroundColor: selectedTasks.has(task.id!) ? colors.primary : 'transparent'
                      }
                    ]}>
                      {selectedTasks.has(task.id!) && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                )}
                {getCategoryColor(task.categoryId) && (
                  <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(task.categoryId) }]} />
                )}
                <View style={[
                  styles.taskContent,
                  selectionMode && { paddingLeft: Spacing.lg + 40 }
                ]}>
                  <View style={styles.taskHeader}>
                    <Text style={[styles.taskTitle, { color: colors.textPrimary }, task.completed && styles.completedText]} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <View style={styles.priorityAndSyncBadges}>
                      {task.calendarEventId && !selectionMode && (
                        <View style={[styles.syncBadge, { backgroundColor: colors.primaryLight }]}>
                          <Ionicons name="cloud-done" size={12} color={colors.primary} />
                        </View>
                      )}
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                        <Text style={styles.priorityText}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Text>
                      </View>
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
