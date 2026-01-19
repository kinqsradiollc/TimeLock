import { Platform } from 'react-native';

// Dynamic import for expo-live-activity (iOS only)
let LiveActivities: any = null;
if (Platform.OS === 'ios') {
  try {
    LiveActivities = require('expo-live-activity');
  } catch (error) {
    console.warn('[LiveActivities] expo-live-activity not available:', error);
  }
}

import type { Task } from '../types/task';

export class LiveActivitiesService {
  /**
   * Check if live activities are supported on this device
   */
  static isSupported(): boolean {
    return Platform.OS === 'ios' && LiveActivities !== null;
  }

  /**
   * Start a live activity for a task
   * Shows countdown timer and task info on iOS lock screen
   */
  static async startTaskActivity(task: Task): Promise<string | null> {
    if (!this.isSupported()) {
      console.log('[LiveActivities] Live Activities not supported on this platform');
      return null;
    }

    try {
      // Calculate time remaining
      const now = new Date();
      const deadline = new Date(task.deadline);
      const timeRemaining = Math.max(0, deadline.getTime() - now.getTime());

      // Prepare priority indicator
      const priorityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        urgent: '🔴'
      }[task.priority] || '⚪';

      // Add urgency/critical indicators to subtitle
      let subtitle = task.description || 'Task in progress';
      if (timeRemaining < 60 * 60 * 1000) { // Less than 1 hour
        subtitle = '⚠️ Critical - Due soon! ' + subtitle;
      } else if (timeRemaining < 24 * 60 * 60 * 1000) { // Less than 24 hours
        subtitle = '⏰ Urgent - Due within 24hrs. ' + subtitle;
      }

      // Prepare activity state (dynamic data)
      const state = {
        title: `${priorityEmoji} ${task.title}`,
        subtitle: subtitle,
        timerEndDateInMilliseconds: deadline.getTime(), // Must be milliseconds timestamp
      };

      // Start the live activity with state and config
      const activityId = await LiveActivities.startActivity(state, {
        backgroundColor: '#1a1a1a',
        titleColor: '#FFFFFF',
        subtitleColor: '#CCCCCC',
        progressViewTint: '#007AFF',
        progressViewLabelColor: '#FFFFFF',
        timerType: 'circular',
        padding: 16,
      });

      console.log(`[LiveActivities] Started activity ${activityId} for task ${task.id}`);
      return activityId || null;
    } catch (error) {
      console.error('[LiveActivities] Failed to start activity:', error);
      return null;
    }
  }

  /**
   * Update an existing live activity with new data
   */
  static async updateTaskActivity(activityId: string, task: Task): Promise<void> {
    if (!this.isSupported()) {
      console.log('[LiveActivities] Live Activities not supported on this platform');
      return;
    }

    try {
      // Calculate updated time remaining
      const now = new Date();
      const deadline = new Date(task.deadline);
      const timeRemaining = Math.max(0, deadline.getTime() - now.getTime());

      // Prepare priority indicator
      const priorityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        urgent: '🔴'
      }[task.priority] || '⚪';

      // Add urgency/critical indicators to subtitle
      let subtitle = task.description || 'Task in progress';
      if (timeRemaining < 60 * 60 * 1000) { // Less than 1 hour
        subtitle = '⚠️ Critical - Due soon! ' + subtitle;
      } else if (timeRemaining < 24 * 60 * 60 * 1000) { // Less than 24 hours
        subtitle = '⏰ Urgent - Due within 24hrs. ' + subtitle;
      }

      const updateState = {
        title: `${priorityEmoji} ${task.title}`,
        subtitle: subtitle,
        timerEndDateInMilliseconds: deadline.getTime(), // Must be milliseconds timestamp
      };

      await LiveActivities.updateActivity(activityId, updateState);
      console.log(`[LiveActivities] Updated activity ${activityId} for task ${task.id}`);
    } catch (error) {
      console.error('[LiveActivities] Failed to update activity:', error);
    }
  }

  /**
   * End a live activity
   */
  static async endTaskActivity(activityId: string): Promise<void> {
    if (!this.isSupported()) {
      console.log('[LiveActivities] Live Activities not supported on this platform');
      return;
    }

    try {
      const endState = {
        title: 'Task Completed! 🎉',
        subtitle: 'Activity ended',
      };

      await LiveActivities.stopActivity(activityId, endState);
      console.log(`[LiveActivities] Ended activity ${activityId}`);
    } catch (error) {
      console.error('[LiveActivities] Failed to end activity:', error);
    }
  }

  /**
   * End all live activities
   * Note: This method is not available in the current expo-live-activity API
   */
  static async endAllActivities(): Promise<void> {
    if (!this.isSupported()) {
      console.log('[LiveActivities] Live Activities not supported on this platform');
      return;
    }

    console.log('[LiveActivities] endAllActivities not supported by current API');
    // This functionality is not available in expo-live-activity
    // Activities must be ended individually
  }

  /**
   * Get all active live activities
   * Note: This method is not available in the current expo-live-activity API
   */
  static async getActiveActivities(): Promise<string[]> {
    if (!this.isSupported()) {
      console.log('[LiveActivities] Live Activities not supported on this platform');
      return [];
    }

    console.log('[LiveActivities] getActiveActivities not supported by current API');
    return [];
    // This functionality is not available in expo-live-activity
  }
}

export default LiveActivitiesService;