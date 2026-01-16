import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/styles/common';
import { notificationPermissionModalStyles as styles } from '@/styles/components/notificationPermissionModal.styles';
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';
import { SettingsRepository } from '@/repositories/SettingsRepository';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';

const PERMISSION_ASKED_KEY = 'notification_permission_asked';

export function NotificationPermissionModal() {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const [visible, setVisible] = useState(false);
  const { requestPermissions } = useNotificationPermissions();
  const haptics = useHaptics();

  useEffect(() => {
    checkShouldShow();
  }, []);

  const checkShouldShow = async () => {
    try {
      const hasAsked = await SettingsRepository.get(PERMISSION_ASKED_KEY);
      if (!hasAsked) {
        // Wait a bit before showing to let the app load
        setTimeout(() => setVisible(true), 1000);
      }
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  const handleAllow = async () => {
    haptics.medium();
    const granted = await requestPermissions();
    await SettingsRepository.set(PERMISSION_ASKED_KEY, 'true');
    await SettingsRepository.updateAppSettings({ notificationsEnabled: granted });
    if (granted) {
      haptics.success();
    }
    setVisible(false);
  };

  const handleNotNow = async () => {
    haptics.light();
    await SettingsRepository.set(PERMISSION_ASKED_KEY, 'true');
    await SettingsRepository.updateAppSettings({ notificationsEnabled: false });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="notifications" size={48} color={colors.primary} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Stay on Track
          </Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            TimeLock will send you notifications to remind you about upcoming tasks and deadlines.
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                Timely reminders
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="alarm-outline" size={20} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                Never miss a deadline
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="settings-outline" size={20} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                Fully customizable
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[styles.allowButton, { backgroundColor: colors.primary }]}
            onPress={handleAllow}
            activeOpacity={0.8}
          >
            <Text style={styles.allowButtonText}>Enable Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notNowButton}
            onPress={handleNotNow}
            activeOpacity={0.7}
          >
            <Text style={[styles.notNowButtonText, { color: colors.textSecondary }]}>
              Not Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
