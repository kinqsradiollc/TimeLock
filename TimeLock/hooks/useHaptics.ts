import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { SettingsRepository } from '@/repositories/SettingsRepository';

/**
 * Custom hook for consistent haptic feedback across the app
 * Provides type-safe wrappers for Expo's haptics API
 * Respects user's haptics preference from settings
 */
export function useHaptics() {
  /**
   * Check if haptics are enabled before triggering feedback
   */
  const checkEnabled = async (): Promise<boolean> => {
    try {
      const settings = await SettingsRepository.getAppSettings();
      return settings.hapticsEnabled;
    } catch (error) {
      console.error('Failed to check haptics setting:', error);
      return true; // Default to enabled on error
    }
  };

  /**
   * Light impact - for subtle interactions
   * Use for: selections, toggles, minor buttons
   */
  const light = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    });
  };

  /**
   * Medium impact - for standard interactions
   * Use for: button presses, card taps, navigation
   */
  const medium = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    });
  };

  /**
   * Heavy impact - for important interactions
   * Use for: confirmations, deletions, major actions
   */
  const heavy = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    });
  };

  /**
   * Success notification - for successful actions
   * Use for: task completion, save success, export success
   */
  const success = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });
  };

  /**
   * Warning notification - for warnings or non-critical errors
   * Use for: form validation, missing fields
   */
  const warning = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    });
  };

  /**
   * Error notification - for errors or failed actions
   * Use for: delete confirmations, failed operations
   */
  const error = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    });
  };

  /**
   * Selection change - for picker/selector interactions
   * Use for: category selection, date picker, filter changes
   */
  const selection = () => {
    checkEnabled().then(enabled => {
      if (enabled && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Haptics.selectionAsync();
      }
    });
  };

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
  };
}
