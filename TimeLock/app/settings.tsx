import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
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
import { LightColors, DarkColors } from '@/styles/common';
import { settingsStyles as styles } from '@/styles/screens/settings.styles';
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
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
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
      setHapticsEnabled(settings.hapticsEnabled);
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

  const handleHapticsToggle = (value: boolean) => {
    setHapticsEnabled(value);
    updateSetting({ hapticsEnabled: value });
    // Provide immediate feedback only when enabling (after state update)
    if (value) {
      // Direct haptic call without going through hook to avoid re-render
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handleThemeSelect = async (selectedTheme: ThemeOption) => {
    // Direct haptic feedback for theme selection
    if (hapticsEnabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
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
          onPress={() => {
            if (hapticsEnabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
              const Haptics = require('expo-haptics');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            router.back();
          }}
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
              onPress={() => {
                if (hapticsEnabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
                  const Haptics = require('expo-haptics');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowThemeModal(true);
              }}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="phone-portrait-outline"
              title="Haptic Feedback"
              subtitle="Feel vibrations when interacting with the app"
              rightElement={
                <Switch
                  value={hapticsEnabled}
                  onValueChange={handleHapticsToggle}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={hapticsEnabled ? colors.primary : colors.textTertiary}
                />
              }
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
              onPress={() => {
                if (hapticsEnabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
                  const Haptics = require('expo-haptics');
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                }
                handleClearData();
              }}
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
