import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  useColorScheme,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { SettingsRepository } from '@/repositories/SettingsRepository';
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeOption } from '@/types/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { hasPermission, requestPermissions, checkPermissions } = useNotificationPermissions();
  const { theme, effectiveTheme, setTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      await checkPermissions();
      const settings = await SettingsRepository.getAppSettings();
      setNotificationsEnabled(settings.notificationsEnabled);
      setSoundEnabled(settings.soundEnabled);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (updates: any) => {
    try {
      await SettingsRepository.updateAppSettings(updates);
    } catch (error) {
      console.error('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    if (value) {
      // When enabling, check if we have system permission
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) {
          Alert.alert(
            'Permission Denied',
            'Please enable notifications in your device settings to receive task reminders.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => {
                // On iOS, this opens app settings
                if (Platform.OS === 'ios') {
                  Alert.alert('Open Settings', 'Go to Settings > TimeLock > Notifications');
                }
              }}
            ]
          );
          return;
        }
      }
    }
    setNotificationsEnabled(value);
    updateSetting({ notificationsEnabled: value });
  };

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
    updateSetting({ soundEnabled: value });
  };

  const handleThemeSelect = async (selectedTheme: ThemeOption) => {
    await setTheme(selectedTheme);
    setShowThemeModal(false);
  };

  const getThemeDisplayText = () => {
    const themeLabels: Record<ThemeOption, string> = {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    };
    const current = themeLabels[theme];
    const effective = effectiveTheme === 'dark' ? 'Dark' : 'Light';
    return theme === 'system' ? `${current} (${effective})` : current;
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all tasks, categories, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement data clearing
            Alert.alert('Coming Soon', 'This feature will be available soon');
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    rightElement,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Receive notifications for upcoming tasks"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={notificationsEnabled ? colors.primary : colors.textTertiary}
                />
              }
            />
            <SettingItem
              icon="volume-high-outline"
              title="Sound"
              subtitle="Play sound with notifications"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={handleSoundToggle}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={soundEnabled ? colors.primary : colors.textTertiary}
                />
              }
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="moon-outline"
              title="Theme"
              subtitle={`Current: ${getThemeDisplayText()}`}
              rightElement={
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              }
              onPress={() => setShowThemeModal(true)}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="download-outline"
              title="Export Data"
              subtitle="Download all your tasks and categories"
              rightElement={
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              }
              onPress={() => Alert.alert('Coming Soon', 'Export feature will be available soon')}
            />
            <SettingItem
              icon="cloud-upload-outline"
              title="Import Data"
              subtitle="Restore from a backup file"
              rightElement={
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              }
              onPress={() => Alert.alert('Coming Soon', 'Import feature will be available soon')}
            />
            <TouchableOpacity
              style={[styles.settingItem, styles.dangerItem, { backgroundColor: colors.surface }]}
              onPress={handleClearData}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.error }]}>Clear All Data</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  Delete all tasks and categories
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="information-circle-outline"
              title="Version"
              subtitle={process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0'}
            />
            <SettingItem
              icon="server-outline"
              title="Database Version"
              subtitle={`v${process.env.EXPO_PUBLIC_DB_VERSION || '1'}`}
            />
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              rightElement={
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              }
              onPress={() => Alert.alert('Help', 'Visit our website for help and support')}
            />
            <SettingItem
              icon="document-text-outline"
              title="Terms & Privacy"
              rightElement={
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              }
              onPress={() => Alert.alert('Legal', 'Terms and Privacy Policy')}
            />
          </View>
        </View>

        {/* Owner Info */}
        <View style={styles.ownerSection}>
          <Text style={[styles.ownerText, { color: colors.textTertiary }]}>
            Made with ❤️ by {process.env.EXPO_PUBLIC_APP_OWNER || 'TimeLock Team'}
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Theme</Text>
              <TouchableOpacity
                onPress={() => setShowThemeModal(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.background },
                  theme === 'light' && { borderColor: colors.primary, borderWidth: 2 },
                ]}
                onPress={() => handleThemeSelect('light')}
                activeOpacity={0.7}
              >
                <Ionicons name="sunny" size={32} color={colors.primary} />
                <Text style={[styles.themeOptionTitle, { color: colors.textPrimary }]}>Light</Text>
                <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>Always use light theme</Text>
                {theme === 'light' && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.background },
                  theme === 'dark' && { borderColor: colors.primary, borderWidth: 2 },
                ]}
                onPress={() => handleThemeSelect('dark')}
                activeOpacity={0.7}
              >
                <Ionicons name="moon" size={32} color={colors.primary} />
                <Text style={[styles.themeOptionTitle, { color: colors.textPrimary }]}>Dark</Text>
                <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>Always use dark theme</Text>
                {theme === 'dark' && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.background },
                  theme === 'system' && { borderColor: colors.primary, borderWidth: 2 },
                ]}
                onPress={() => handleThemeSelect('system')}
                activeOpacity={0.7}
              >
                <Ionicons name="phone-portrait" size={32} color={colors.primary} />
                <Text style={[styles.themeOptionTitle, { color: colors.textPrimary }]}>System</Text>
                <Text style={[styles.themeOptionSubtitle, { color: colors.textSecondary }]}>Match device settings</Text>
                {theme === 'system' && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  dangerItem: {
    marginTop: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  settingSubtitle: {
    fontSize: Typography.sm,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
  ownerSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  ownerText: {
    fontSize: Typography.sm,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
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
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptions: {
    gap: Spacing.md,
  },
  themeOption: {
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeOptionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    marginTop: Spacing.sm,
  },
  themeOptionSubtitle: {
    fontSize: Typography.sm,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
