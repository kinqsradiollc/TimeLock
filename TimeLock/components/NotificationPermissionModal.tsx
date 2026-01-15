import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';
import { SettingsRepository } from '@/repositories/SettingsRepository';
import { useTheme } from '@/contexts/ThemeContext';

const PERMISSION_ASKED_KEY = 'notification_permission_asked';

export function NotificationPermissionModal() {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const [visible, setVisible] = useState(false);
  const { requestPermissions } = useNotificationPermissions();

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
    const granted = await requestPermissions();
    await SettingsRepository.set(PERMISSION_ASKED_KEY, 'true');
    await SettingsRepository.updateAppSettings({ notificationsEnabled: granted });
    setVisible(false);
  };

  const handleNotNow = async () => {
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    borderRadius: 24,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.base,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  features: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  allowButton: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  notNowButton: {
    paddingVertical: Spacing.md,
  },
  notNowButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
});
