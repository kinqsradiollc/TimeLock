import * as Calendar from 'expo-calendar';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import type { Task } from '@/types/task';
import { TaskRepository } from '@/repositories/TaskRepository';

export class CalendarSyncService {
  private static DEFAULT_CALENDAR_NAME = 'TimeLock';
  
  /**
   * Request calendar permissions
   */
  static async requestCalendarPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  /**
   * Get or create TimeLock calendar
   */
  static async getOrCreateCalendar(): Promise<string | null> {
    try {
      const hasPermission = await this.requestCalendarPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Calendar access is required to sync tasks.');
        return null;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const timelockCalendar = calendars.find(cal => cal.title === this.DEFAULT_CALENDAR_NAME);

      if (timelockCalendar) {
        return timelockCalendar.id;
      }

      // Create new calendar
      const defaultCalendar = calendars.find(
        cal => cal.allowsModifications && cal.isPrimary
      ) || calendars.find(cal => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert('Error', 'No writable calendar found on device.');
        return null;
      }

      const newCalendarId = await Calendar.createCalendarAsync({
        title: this.DEFAULT_CALENDAR_NAME,
        color: '#3b82f6',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendar.source.id,
        source: defaultCalendar.source,
        name: this.DEFAULT_CALENDAR_NAME,
        ownerAccount: defaultCalendar.source.name,
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      return newCalendarId;
    } catch (error) {
      console.error('Error getting/creating calendar:', error);
      Alert.alert('Error', 'Failed to access device calendar.');
      return null;
    }
  }

  /**
   * Export task to device calendar (handles duplicates)
   */
  static async exportTaskToCalendar(task: Task, update: boolean = false): Promise<boolean> {
    try {
      const calendarId = await this.getOrCreateCalendar();
      if (!calendarId) return false;

      // Check if task already has a calendar event
      if (task.calendarEventId && !update) {
        // Task already exported, check if event still exists
        try {
          const event = await Calendar.getEventAsync(task.calendarEventId);
          if (event) {
            Alert.alert('Already Exported', 'This task has already been exported to your calendar.');
            return true;
          }
        } catch (error) {
          // Event doesn't exist anymore, create new one
          console.log('Previous calendar event not found, creating new one');
        }
      }

      const deadline = new Date(task.deadline);
      const startDate = new Date(deadline.getTime() - 60 * 60 * 1000); // 1 hour before

      const eventDetails: Partial<Calendar.Event> = {
        title: task.title,
        startDate: startDate,
        endDate: deadline,
        ...(task.description && { notes: task.description }),
        alarms: task.notifications.map(minutes => ({
          relativeOffset: -minutes,
        })),
      };

      let eventId: string;
      
      if (task.calendarEventId && update) {
        // Update existing event
        await Calendar.updateEventAsync(task.calendarEventId, eventDetails);
        eventId = task.calendarEventId;
      } else {
        // Create new event
        eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      }

      // Save event ID to task
      if (task.id) {
        await TaskRepository.update(task.id, { calendarEventId: eventId });
      }

      return true;
    } catch (error) {
      console.error('Error exporting task to calendar:', error);
      return false;
    }
  }

  /**
   * Export multiple tasks to device calendar
   */
  static async exportTasksToCalendar(
    tasks: Task[], 
    options: { skipDuplicates?: boolean; updateExisting?: boolean } = {}
  ): Promise<{ success: number; failed: number; skipped: number }> {
    const { skipDuplicates = true, updateExisting = false } = options;
    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (const task of tasks) {
      // Skip if already exported and skipDuplicates is true
      if (skipDuplicates && task.calendarEventId) {
        try {
          await Calendar.getEventAsync(task.calendarEventId);
          skipped++;
          continue;
        } catch {
          // Event doesn't exist, proceed with export
        }
      }

      const result = await this.exportTaskToCalendar(task, updateExisting);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed, skipped };
  }

  /**
   * Remove task from device calendar
   */
  static async removeTaskFromCalendar(task: Task): Promise<boolean> {
    try {
      if (!task.calendarEventId) {
        return true; // Nothing to remove
      }

      await Calendar.deleteEventAsync(task.calendarEventId);
      
      // Clear event ID from task
      if (task.id) {
        await TaskRepository.update(task.id, { calendarEventId: undefined });
      }

      return true;
    } catch (error) {
      console.error('Error removing task from calendar:', error);
      return false;
    }
  }

  /**
   * Generate .ics file content from tasks
   */
  static generateICSContent(tasks: Task[]): string {
    const appVersion = process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0';
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0', // iCalendar standard version (RFC 5545) - always 2.0
      `PRODID:-//TimeLock v${appVersion}//Task Calendar//EN`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:TimeLock Tasks`,
      'X-WR-TIMEZONE:UTC',
    ];

    for (const task of tasks) {
      const deadline = new Date(task.deadline);
      const startDate = new Date(deadline.getTime() - 60 * 60 * 1000);
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:timelock-task-${task.id}@timelock.app`);
      lines.push(`DTSTAMP:${formatDate(new Date())}`);
      lines.push(`DTSTART:${formatDate(startDate)}`);
      lines.push(`DTEND:${formatDate(deadline)}`);
      lines.push(`SUMMARY:${task.title}`);
      
      if (task.description) {
        lines.push(`DESCRIPTION:${task.description.replace(/\n/g, '\\n')}`);
      }
      
      lines.push(`STATUS:${task.completed ? 'COMPLETED' : 'CONFIRMED'}`);
      lines.push(`PRIORITY:${this.getPriorityValue(task.priority)}`);
      
      // Add alarms
      for (const minutes of task.notifications) {
        lines.push('BEGIN:VALARM');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:${task.title}`);
        lines.push(`TRIGGER:-PT${minutes}M`);
        lines.push('END:VALARM');
      }
      
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  /**
   * Export tasks to .ics file
   */
  static async exportToICSFile(tasks: Task[], filename: string = 'timelock-tasks.ics'): Promise<string | null> {
    try {
      const icsContent = this.generateICSContent(tasks);
      const file = new FileSystem.File(FileSystem.Paths.document, filename);
      
      await file.write(icsContent);

      return file.uri;
    } catch (error) {
      console.error('Error exporting to ICS file:', error);
      return null;
    }
  }

  /**
   * Parse .ics file content
   */
  static parseICSContent(content: string): Partial<Task>[] {
    const tasks: Partial<Task>[] = [];
    const events = content.split('BEGIN:VEVENT');

    for (let i = 1; i < events.length; i++) {
      const event = events[i];
      const lines = event.split(/\r?\n/);
      
      const task: Partial<Task> = {
        notifications: [],
      };

      for (const line of lines) {
        if (line.startsWith('SUMMARY:')) {
          task.title = line.substring(8).trim();
        } else if (line.startsWith('DESCRIPTION:')) {
          task.description = line.substring(12).replace(/\\n/g, '\n').trim();
        } else if (line.startsWith('DTEND:')) {
          const dateStr = line.substring(6).trim();
          task.deadline = this.parseICSDate(dateStr).toISOString();
        } else if (line.startsWith('STATUS:COMPLETED')) {
          task.completed = true;
        } else if (line.startsWith('PRIORITY:')) {
          const priority = parseInt(line.substring(9).trim());
          task.priority = this.getPriorityFromValue(priority);
        }
      }

      if (task.title && task.deadline) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  /**
   * Import tasks from .ics file
   */
  static async importFromICSFile(fileUri: string): Promise<Partial<Task>[]> {
    try {
      const file = new FileSystem.File(fileUri);
      const content = await file.text();

      return this.parseICSContent(content);
    } catch (error) {
      console.error('Error importing from ICS file:', error);
      return [];
    }
  }

  /**
   * Helper: Convert priority to ICS priority value (1-9)
   */
  private static getPriorityValue(priority: string): number {
    const map: Record<string, number> = {
      urgent: 1,
      high: 3,
      medium: 5,
      low: 7,
    };
    return map[priority] || 5;
  }

  /**
   * Helper: Convert ICS priority value to app priority
   */
  private static getPriorityFromValue(value: number): 'low' | 'medium' | 'high' | 'urgent' {
    if (value <= 2) return 'urgent';
    if (value <= 4) return 'high';
    if (value <= 6) return 'medium';
    return 'low';
  }

  /**
   * Helper: Parse ICS date format
   */
  private static parseICSDate(dateStr: string): Date {
    // Format: YYYYMMDDTHHMMSSZ or YYYYMMDD
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    
    if (dateStr.includes('T')) {
      const hour = parseInt(dateStr.substring(9, 11));
      const minute = parseInt(dateStr.substring(11, 13));
      const second = parseInt(dateStr.substring(13, 15));
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    
    return new Date(year, month, day);
  }
}

export default CalendarSyncService;
