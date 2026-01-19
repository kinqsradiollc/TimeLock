import * as FileSystem from 'expo-file-system';
import { documentDirectory } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { executeSql } from '../database';
import { TaskRepository } from '../repositories/TaskRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { NotificationService } from './NotificationService';
import { LiveActivitiesService } from './LiveActivitiesService';
import type { Task } from '../types/task';
import type { Category } from '../types/category';
import type { AppSettings } from '../types/settings';

export interface BackupData {
  version: string;
  timestamp: string;
  tasks: Omit<Task, 'notificationIds' | 'liveActivityId'>[];
  categories: Category[];
  settings: AppSettings;
}

export class DataService {
  private static readonly BACKUP_VERSION = '1.0';

  /**
   * Export all user data to a JSON file and share it
   */
  static async exportData(): Promise<void> {
    try {
      // Gather all data
      const tasks = await TaskRepository.findAll();
      const categories = await CategoryRepository.findAll();
      const settings = await SettingsRepository.getAppSettings();

      // Create backup data structure (exclude runtime fields)
      const backupData: BackupData = {
        version: this.BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          completed: task.completed,
          priority: task.priority,
          categoryId: task.categoryId,
          notifications: task.notifications,
          isActive: task.isActive,
          calendarEventId: task.calendarEventId,
          // Exclude notificationIds and liveActivityId as they're runtime data
        })),
        categories,
        settings,
      };

      // Convert to JSON
      const jsonData = JSON.stringify(backupData, null, 2);

      // Create filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `timelock-backup-${timestamp}.json`;

      // Save to temporary file using new File API
      const fileUri = documentDirectory + filename;
      const file = new FileSystem.File(fileUri);
      await file.write(jsonData);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Share TimeLock Backup',
        });
      } else {
        Alert.alert(
          'Export Complete',
          `Backup saved to: ${fileUri}\n\nYou can find it in your device's file manager.`
        );
      }

      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Failed to export data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  }

  /**
   * Import data from a backup file
   */
  static async importData(fileUri: string): Promise<void> {
    try {
      // Read the backup file using new File API
      const file = new FileSystem.File(fileUri);
      const jsonData = await file.text();

      const backupData: BackupData = JSON.parse(jsonData);

      // Validate backup data
      if (!this.validateBackupData(backupData)) {
        throw new Error('Invalid backup file format');
      }

      // Confirm import (this will replace all existing data)
      const shouldProceed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Import Data',
          'This will replace all your current tasks, categories, and settings. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Import', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });

      if (!shouldProceed) return;

      // Clear existing data (skip confirmation since user already confirmed import)
      await this.clearAllData(true);

      // Import categories first (needed for tasks)
      for (const category of backupData.categories) {
        await CategoryRepository.create({
          name: category.name,
          color: category.color,
        });
      }

      // Import settings
      await SettingsRepository.updateAppSettings(backupData.settings);

      // Import tasks
      for (const task of backupData.tasks) {
        await TaskRepository.create({
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          completed: task.completed,
          priority: task.priority,
          categoryId: task.categoryId,
          notifications: task.notifications,
          isActive: task.isActive,
          calendarEventId: task.calendarEventId,
        });
      }

      Alert.alert('Success', 'Data imported successfully!');
    } catch (error) {
      console.error('Failed to import data:', error);
      Alert.alert('Error', 'Failed to import data. Please check the file format and try again.');
    }
  }

  /**
   * Clear all user data
   * @param skipConfirmation - If true, skips the confirmation dialog (used when called from importData)
   */
  static async clearAllData(skipConfirmation: boolean = false): Promise<void> {
    try {
      if (!skipConfirmation) {
        const shouldProceed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Clear All Data',
            'This will delete all tasks, categories, and settings. This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Clear', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        });

        if (!shouldProceed) return;
      }

      // Cancel all notifications and live activities before clearing
      try {
        const tasks = await TaskRepository.findAll();
        for (const task of tasks) {
          if (task.notificationIds && task.notificationIds.length > 0) {
            await NotificationService.cancelTaskNotifications(task.notificationIds);
          }
          if (task.liveActivityId) {
            await LiveActivitiesService.endTaskActivity(task.liveActivityId);
          }
        }
      } catch (error) {
        console.error('Failed to cancel notifications/live activities during clear:', error);
      }

      // Clear all tables
      await executeSql('DELETE FROM tasks');
      await executeSql('DELETE FROM categories');
      await executeSql('DELETE FROM settings');

      // Reset auto-increment counters
      await executeSql('DELETE FROM sqlite_sequence WHERE name IN ("tasks", "categories")');

      if (!skipConfirmation) {
        Alert.alert('Success', 'All data cleared successfully!');
      }
    } catch (error) {
      console.error('Failed to clear data:', error);
      Alert.alert('Error', 'Failed to clear data. Please try again.');
    }
  }

  /**
   * Validate backup data structure
   */
  private static validateBackupData(data: any): data is BackupData {
    if (!data || typeof data !== 'object') return false;
    if (data.version !== this.BACKUP_VERSION) return false;
    if (!data.timestamp || !Array.isArray(data.tasks) || !Array.isArray(data.categories) || !data.settings) return false;

    // Basic validation of required fields
    for (const task of data.tasks) {
      if (!task.title || typeof task.title !== 'string') return false;
    }

    for (const category of data.categories) {
      if (!category.name || typeof category.name !== 'string') return false;
    }

    return true;
  }
}

export default DataService;