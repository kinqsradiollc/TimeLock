import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Task } from '@/types/task';

/**
 * NotificationService - Manages local push notifications for task reminders
 * 
 * Features:
 * - Schedule notifications based on task deadlines and reminder offsets
 * - Cancel notifications when tasks are completed or deleted
 * - Handle multiple reminders per task
 * - Track notification IDs for cleanup
 */

// Configure notification behavior - ensures notifications show when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,     // iOS: Show alert when app is in foreground
    shouldPlaySound: true,      // Play sound for foreground notifications
    shouldSetBadge: true,       // Update app badge count
  }),
});

export interface ScheduledNotification {
  notificationId: string;
  reminderMinutes: number;
  triggerDate: Date;
}

export class NotificationService {
  /**
   * Request notification permissions from the user
   * Required before scheduling any notifications
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.warn('[Notifications] Not supported on web');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] Permission denied');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('task-reminders', {
        name: 'Task Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
        sound: 'default',
      });
    }

    return true;
  }

  /**
   * Check if notification permissions are granted
   */
  static async hasPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Schedule notifications for a task based on its deadline and notification settings
   * Uses the task.notifications array (minutes before deadline)
   * Returns array of scheduled notification IDs and their details
   */
  static async scheduleTaskReminders(task: Task): Promise<ScheduledNotification[]> {
    if (Platform.OS === 'web') {
      console.warn('[Notifications] Not supported on web');
      return [];
    }

    // Check permissions
    const hasPermission = await this.hasPermissions();
    if (!hasPermission) {
      console.warn('[Notifications] No permission to schedule notifications');
      return [];
    }

    // Don't schedule for completed tasks
    if (task.completed) {
      console.log('[Notifications] Task already completed, skipping');
      return [];
    }

    // Skip if no reminders configured
    if (!task.notifications || task.notifications.length === 0) {
      console.log('[Notifications] No reminders configured for task');
      return [];
    }

    const deadline = new Date(task.deadline);
    const now = new Date();
    const scheduledNotifications: ScheduledNotification[] = [];

    console.log(`[Notifications] Task "${task.title}" deadline: ${deadline.toISOString()}`);
    console.log(`[Notifications] Current time: ${now.toISOString()}`);
    console.log(`[Notifications] Time until deadline: ${Math.floor((deadline.getTime() - now.getTime()) / 60000)} minutes`);

    // Schedule a notification for each reminder offset in task.notifications
    for (const minutesBefore of task.notifications) {
      const triggerDate = new Date(deadline.getTime() - minutesBefore * 60 * 1000);

      // Skip if trigger time is in the past
      if (triggerDate <= now) {
        console.log(`[Notifications] ❌ Skipping past reminder: ${minutesBefore} minutes before (trigger: ${triggerDate.toISOString()})`);
        continue;
      }

      try {
        // Format deadline time
        const deadlineTime = deadline.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        const deadlineDate = deadline.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        // Format time remaining for notification title
        const timeRemainingText = this.formatReminderTime(minutesBefore);
        
        // Build notification body with priority and deadline
        const priorityEmoji = {
          low: '🟢',
          medium: '🟡',
          high: '🟠',
          urgent: '🔴',
        };
        const emoji = priorityEmoji[task.priority as keyof typeof priorityEmoji] || '🟡';
        
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `⏰ ${task.title}`,
            body: `${emoji} ${task.priority.toUpperCase()} • Due ${deadlineDate} at ${deadlineTime}\n`,
            data: {
              taskId: task.id,
              taskTitle: task.title,
              deadline: task.deadline,
              reminderMinutes: minutesBefore,
              priority: task.priority,
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            ...(Platform.OS === 'android' && {
              channelId: 'task-reminders',
            }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });

        scheduledNotifications.push({
          notificationId,
          reminderMinutes: minutesBefore,
          triggerDate,
        });

        console.log(`[Notifications] ✅ Scheduled: ${task.title} - ${minutesBefore}min before at ${triggerDate.toLocaleString()}`);
      } catch (error) {
        console.error(`[Notifications] Failed to schedule reminder for ${minutesBefore} minutes:`, error);
      }
    }

    if (scheduledNotifications.length === 0) {
      console.log(`[Notifications] ⚠️ No future notifications scheduled for "${task.title}"`);
    } else {
      console.log(`[Notifications] 📅 Total scheduled: ${scheduledNotifications.length} notification(s)`);
    }

    return scheduledNotifications;
  }

  /**
   * Cancel all notifications for a specific task
   * Use when task is completed, deleted, or reminders are updated
   */
  static async cancelTaskNotifications(notificationIds: string[]): Promise<void> {
    if (Platform.OS === 'web') return;

    if (!notificationIds || notificationIds.length === 0) {
      console.log('[Notifications] No notification IDs to cancel');
      return;
    }

    try {
      // Cancel each notification individually
      for (const id of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      console.log(`[Notifications] Cancelled ${notificationIds.length} notification(s)`);
    } catch (error) {
      console.error('[Notifications] Failed to cancel notifications:', error);
    }
  }

  /**
   * Cancel ALL scheduled notifications (use with caution)
   */
  static async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[Notifications] Cancelled all scheduled notifications');
    } catch (error) {
      console.error('[Notifications] Failed to cancel all notifications:', error);
    }
  }

  /**
   * Get all currently scheduled notifications (for debugging)
   */
  static async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    if (Platform.OS === 'web') return [];

    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[Notifications] Failed to get scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Reschedule notifications for a task (cancel old, schedule new)
   * Use when task deadline or notification settings change
   */
  static async rescheduleTaskReminders(
    task: Task,
    oldNotificationIds: string[]
  ): Promise<ScheduledNotification[]> {
    // Cancel existing notifications
    await this.cancelTaskNotifications(oldNotificationIds);

    // Schedule new notifications using task.notifications
    return await this.scheduleTaskReminders(task);
  }

  /**
   * Format reminder time for display
   */
  static formatReminderTime(minutesBefore: number): string {
    if (minutesBefore < 60) {
      return `${minutesBefore} minute${minutesBefore !== 1 ? 's' : ''} before due`;
    }
    if (minutesBefore < 1440) {
      const hours = Math.floor(minutesBefore / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} before due`;
    }
    const days = Math.floor(minutesBefore / 1440);
    return `${days} day${days !== 1 ? 's' : ''} before due`;
  }
}

export default NotificationService;
