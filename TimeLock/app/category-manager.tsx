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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { PageHeader } from '@/components/PageHeader';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Category } from '@/types/category';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export default function CategoryManagerScreen() {
  const router = useRouter();
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(true);

  // Reload categories when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      const data = await CategoryRepository.findAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a category name');
      return;
    }

    try {
      if (editingId) {
        await CategoryRepository.update(editingId, { name: name.trim(), color: selectedColor });
      } else {
        await CategoryRepository.create({ name: name.trim(), color: selectedColor });
      }
      
      setName('');
      setSelectedColor(PRESET_COLORS[0]);
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    if (!category.id) return;
    setEditingId(category.id);
    setName(category.name);
    setSelectedColor(category.color || PRESET_COLORS[0]);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Category',
      'Are you sure? Tasks with this category will become uncategorized.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await CategoryRepository.delete(id);
              loadCategories();
            } catch (error) {
              console.error('Failed to delete category:', error);
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PageHeader
        title="Manage Categories 🏷️"
        showAvatar={false}        showBackButton={true}
        onBackPress={() => router.back()}        stats={[
          {
            icon: 'pricetags',
            iconColor: colors.primary,
            iconBgColor: colors.primaryLight,
            value: categories.length,
            label: 'Categories',
          },
        ]}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Add/Edit Form */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.labelRow}>
            <Ionicons name="pricetag" size={20} color={colors.primary} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              {editingId ? 'Edit Category' : 'New Category'}
            </Text>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
            value={name}
            onChangeText={setName}
            placeholder="Category name"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={[styles.colorLabel, { color: colors.textSecondary }]}>Select Color</Text>
          <View style={styles.colorGrid}>
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
                activeOpacity={0.7}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            {editingId && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Ionicons name={editingId ? "checkmark" : "add"} size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {editingId ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories List */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.labelRow}>
            <Ionicons name="list" size={20} color={colors.primary} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              All Categories ({categories.length})
            </Text>
          </View>

          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetags-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No categories yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                Create your first category above
              </Text>
            </View>
          ) : (
            <View style={styles.categoriesList}>
              {categories.map((category) => (
                <View
                  key={category.id}
                  style={[styles.categoryItem, { borderBottomColor: colors.borderLight }]}
                >
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                      {category.name}
                    </Text>
                  </View>
                  <View style={styles.categoryActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
                      onPress={() => handleEdit(category)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.errorLight }]}
                      onPress={() => handleDelete(category.id!)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
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
  contentContainer: {
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
  input: {
    fontSize: Typography.md,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    minHeight: 48,
    marginBottom: Spacing.lg,
  },
  colorLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginBottom: Spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    minHeight: 48,
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  categoriesList: {
    gap: Spacing.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    flex: 1,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  emptySubtext: {
    fontSize: Typography.sm,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xxxl,
    fontSize: Typography.md,
  },
});
