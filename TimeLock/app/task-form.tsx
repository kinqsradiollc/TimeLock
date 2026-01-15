import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TaskRepository } from '@/repositories/TaskRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { NOTIFICATION_OPTIONS } from '@/constants/notifications';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';
import type { Category } from '@/types/category';

export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.id ? Number(params.id) : undefined;
  const isEditing = !!taskId;
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

      if (taskId) {
        const task = await TaskRepository.findById(taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setDeadline(new Date(task.deadline));
          setPriority(task.priority);
          setCategoryId(task.categoryId);
        }
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
      Alert.alert('Validation Error', 'Please enter a task title');
      return;
    }

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline.toISOString(),
        priority,
        categoryId,
        notifications: [NOTIFICATION_OPTIONS.ONE_DAY], // Default: 1 day before
        completed: false,
        isActive: true,
      };

      if (isEditing && taskId) {
        await TaskRepository.update(taskId, taskData);
      } else {
        await TaskRepository.create(taskData);
      }

      router.back();
    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDeadline(selectedTime);
    }
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
            onPress={() => router.back()}
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
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar" size={18} color={colors.primary} />
                <Text style={[styles.dateTimeText, { color: colors.textPrimary }]}>
                  {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
                onPress={() => setShowTimePicker(true)}
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
                      onPress={() => setShowDatePicker(false)}
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
                      onPress={() => setShowTimePicker(false)}
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
                    onPress={() => setPriority(p)}
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
                onPress={() => setCategoryId(undefined)}
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
                    onPress={() => setCategoryId(category.id)}
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
      </KeyboardAvoidingView>
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
  saveButtonContainer: {
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    flex: 1,
  },
  required: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  input: {
    fontSize: Typography.md,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 48,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
    minHeight: 52,
  },
  dateTimeText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  priorityOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    gap: Spacing.sm,
    minHeight: 48,
  },
  priorityText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    gap: Spacing.sm,
    minHeight: 44,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  manageCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  manageCategoriesText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xxxl,
    fontSize: Typography.md,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  doneButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  modalButton: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  pickerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    alignSelf: 'center',
  },
});
