import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TaskRepository } from '@/repositories/TaskRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { SettingsRepository } from '@/repositories/SettingsRepository';
import { NOTIFICATION_OPTIONS, NOTIFICATION_CHOICES } from '@/constants/notifications';
import { LightColors, DarkColors } from '@/styles/common';
import { taskFormStyles as styles } from '@/styles/screens/taskForm.styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';
import type { Task } from '@/types/task';
import type { Category } from '@/types/category';
import type { NotificationOption } from '@/types/notification';

export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.id ? Number(params.id) : undefined;
  const isEditing = !!taskId;
  const { effectiveTheme } = useTheme();
  const haptics = useHaptics();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<NotificationOption[]>([NOTIFICATION_OPTIONS.ONE_DAY]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [taskId])
  );

  const loadData = async () => {
    try {
      const categoriesData = await CategoryRepository.findAll();
      setCategories(categoriesData);

      // Load default notifications from settings
      const settings = await SettingsRepository.getAppSettings();

      if (taskId) {
        const task = await TaskRepository.findById(taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setDeadline(new Date(task.deadline));
          setPriority(task.priority);
          setCategoryId(task.categoryId);
          setSelectedNotifications(task.notifications || settings.defaultNotifications);
        }
      } else {
        // Use default notifications for new tasks
        setSelectedNotifications(settings.defaultNotifications);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load task data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      haptics.warning();
      Alert.alert('Validation Error', 'Please enter a task title');
      return;
    }

    try {
      haptics.medium();
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline.toISOString(),
        priority,
        categoryId,
        notifications: selectedNotifications,
        completed: false,
        isActive: true,
      };

      if (isEditing && taskId) {
        await TaskRepository.update(taskId, taskData);
      } else {
        await TaskRepository.create(taskData);
      }

      haptics.success();
      router.back();
    } catch (error) {
      haptics.error();
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      haptics.selection();
      setDeadline(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      haptics.selection();
      setDeadline(selectedTime);
    }
  };

  const getNotificationsText = () => {
    if (selectedNotifications.length === 0) {
      return 'No reminders';
    }
    const labels = selectedNotifications
      .map(minutes => NOTIFICATION_CHOICES.find(c => c.minutes === minutes)?.label)
      .filter(Boolean);
    return labels.length > 2 
      ? `${labels.length} reminders`
      : labels.join(', ');
  };

  const handleNotificationToggle = (minutes: NotificationOption) => {
    haptics.selection();
    setSelectedNotifications(prev => 
      prev.includes(minutes)
        ? prev.filter(m => m !== minutes)
        : [...prev, minutes].sort((a, b) => b - a)
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
            onPress={() => {
              haptics.light();
              router.back();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              {isEditing ? 'Edit Task' : 'Create Task'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.headerButton, styles.saveButtonContainer, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.form}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          {/* Title Input */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.labelRow}>
              <Ionicons name="text-outline" size={20} color={colors.primary} />
              <Text style={[styles.label, { color: colors.textPrimary }]}>Title</Text>
              <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </View>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.textTertiary}
              autoFocus={!isEditing}
            />
          </View>

          {/* Description Input */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.labelRow}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={[styles.label, { color: colors.textPrimary }]}>Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.textPrimary }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Deadline */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.labelRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.label, { color: colors.textPrimary }]}>Deadline</Text>
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  haptics.light();
                  setShowDatePicker(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar" size={18} color={colors.primary} />
                <Text style={[styles.dateTimeText, { color: colors.textPrimary }]}>
                  {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  haptics.light();
                  setShowTimePicker(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="time" size={18} color={colors.primary} />
                <Text style={[styles.dateTimeText, { color: colors.textPrimary }]}>
                  {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1}
              onPress={() => setShowDatePicker(false)}
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Date</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        haptics.light();
                        setShowDatePicker(false);
                      }}
                      style={styles.doneButton}
                    >
                      <Text style={[styles.modalButton, { color: colors.primary }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={deadline}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      textColor={colors.textPrimary}
                      style={styles.picker}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {/* Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1}
              onPress={() => setShowTimePicker(false)}
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Time</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        haptics.light();
                        setShowTimePicker(false);
                      }}
                      style={styles.doneButton}
                    >
                      <Text style={[styles.modalButton, { color: colors.primary }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={deadline}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeChange}
                      textColor={colors.textPrimary}
                      style={styles.picker}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {/* Priority */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.labelRow}>
              <Ionicons name="flag-outline" size={20} color={colors.primary} />
              <Text style={[styles.label, { color: colors.textPrimary }]}>Priority</Text>
            </View>
            <View style={styles.priorityGrid}>
              {(['low', 'medium', 'high', 'urgent'] as const).map((p) => {
                const priorityColors = {
                  low: '#10B981',
                  medium: '#F59E0B',
                  high: '#F97316',
                  urgent: '#EF4444',
                };
                const isSelected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityOption,
                      { 
                        backgroundColor: isSelected ? priorityColors[p] : colors.background,
                        borderColor: isSelected ? priorityColors[p] : colors.border,
                      },
                    ]}
                    onPress={() => {
                      haptics.selection();
                      setPriority(p);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name="flag" 
                      size={16} 
                      color={isSelected ? '#FFFFFF' : priorityColors[p]} 
                    />
                    <Text
                      style={[
                        styles.priorityText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Reminders */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.labelRow}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <Text style={[styles.label, { color: colors.textPrimary }]}>Reminders</Text>
            </View>
            <TouchableOpacity
              style={[styles.notificationButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => {
                haptics.light();
                setShowNotificationModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.notificationButtonText, { color: colors.textPrimary }]}>
                {getNotificationsText()}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Category */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.labelRow}>
              <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
              <Text style={[styles.label, { color: colors.textPrimary }]}>Category</Text>
            </View>
            <View style={styles.categoryGrid}>
              <TouchableOpacity
                style={[
                  styles.categoryOption,
                  { 
                    backgroundColor: !categoryId ? colors.primaryLight : colors.background,
                    borderColor: !categoryId ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  haptics.selection();
                  setCategoryId(undefined);
                }}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="close-circle" 
                  size={16} 
                  color={!categoryId ? colors.primary : colors.textTertiary} 
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: !categoryId ? colors.primary : colors.textSecondary },
                  ]}
                >
                  None
                </Text>
              </TouchableOpacity>
              {categories.map((category) => {
                const isSelected = categoryId === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      { 
                        backgroundColor: isSelected ? colors.primaryLight : colors.background,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      haptics.selection();
                      setCategoryId(category.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isSelected ? colors.primary : colors.textPrimary },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={[styles.manageCategoriesButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => router.push('/category-manager')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color={colors.primary} />
              <Text style={[styles.manageCategoriesText, { color: colors.primary }]}>
                Manage Categories
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Notification Selection Modal */}
        <Modal
          visible={showNotificationModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowNotificationModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowNotificationModal(false)}
          >
            <View 
              style={[styles.modalContent, { backgroundColor: colors.surface, maxHeight: '80%', height: 600 }]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Reminders</Text>
                <TouchableOpacity
                  onPress={() => {
                    haptics.light();
                    setShowNotificationModal(false);
                  }}
                  style={styles.modalClose}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                Select when you want to be reminded before this task's deadline.
              </Text>

              <FlatList
                data={NOTIFICATION_CHOICES}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => {
                  const isSelected = selectedNotifications.includes(item.minutes);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.notificationOption,
                        { backgroundColor: colors.background },
                        isSelected && { borderColor: colors.primary, borderWidth: 2 },
                      ]}
                      onPress={() => handleNotificationToggle(item.minutes)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.notificationOptionContent}>
                        <View style={[
                          styles.checkbox,
                          { borderColor: isSelected ? colors.primary : colors.textTertiary },
                          isSelected && { backgroundColor: colors.primary }
                        ]}>
                          {isSelected && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={[styles.notificationOptionLabel, { color: colors.textPrimary }]}>
                          {item.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={true}
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  haptics.medium();
                  setShowNotificationModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}