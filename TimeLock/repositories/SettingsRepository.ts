import { executeSql, querySqlFirst } from '../database';
import type { AppSettings } from '../types/settings';
import { DEFAULT_APP_SETTINGS } from '../types/settings';
import { isThemeOption } from '../types/theme';
import { isNotificationOption } from '../types/notification';

export class SettingsRepository {
  static async init() {
    const sql = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await executeSql(sql);
  }

  static async get(key: string): Promise<string | null> {
    const sql = `SELECT value FROM settings WHERE key = ? LIMIT 1;`;
    const row = await querySqlFirst<{ value: string }>(sql, [key]);
    return row?.value ?? null;
  }

  static async set(key: string, value: string): Promise<void> {
    const sql = `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP);`;
    await executeSql(sql, [key, value]);
  }

  static async getAppSettings(): Promise<AppSettings> {
    const notificationsEnabled = await this.get('notificationsEnabled');
    const soundEnabled = await this.get('soundEnabled');
    const defaultNotifications = await this.get('defaultNotifications');
    const theme = await this.get('theme');
    const calendarView = await this.get('calendarView');
    const hapticsEnabled = await this.get('hapticsEnabled');

    // Parse and validate
    const settings: AppSettings = {
      notificationsEnabled: notificationsEnabled !== 'false', // Default to true if not set
      soundEnabled: soundEnabled !== 'false', // Default to true if not set
      defaultNotifications: defaultNotifications
        ? JSON.parse(defaultNotifications).filter(isNotificationOption)
        : DEFAULT_APP_SETTINGS.defaultNotifications,
      theme: theme && isThemeOption(theme) ? theme : DEFAULT_APP_SETTINGS.theme,
      calendarView:
        calendarView === 'month' || calendarView === 'week' || calendarView === 'day'
          ? calendarView
          : DEFAULT_APP_SETTINGS.calendarView,
      hapticsEnabled: hapticsEnabled !== 'false', // Default to true if not set
    };

    return settings;
  }

  static async updateAppSettings(updates: Partial<AppSettings>): Promise<void> {
    if (updates.notificationsEnabled !== undefined) {
      await this.set('notificationsEnabled', updates.notificationsEnabled.toString());
    }
    if (updates.soundEnabled !== undefined) {
      await this.set('soundEnabled', updates.soundEnabled.toString());
    }
    if (updates.defaultNotifications !== undefined) {
      await this.set('defaultNotifications', JSON.stringify(updates.defaultNotifications));
    }
    if (updates.theme !== undefined) {
      await this.set('theme', updates.theme);
    }
    if (updates.calendarView !== undefined) {
      await this.set('calendarView', updates.calendarView);
    }
    if (updates.hapticsEnabled !== undefined) {
      await this.set('hapticsEnabled', updates.hapticsEnabled.toString());
    }
  }
}

export default SettingsRepository;
