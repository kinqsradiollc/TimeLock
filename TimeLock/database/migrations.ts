import { executeSql, querySqlFirst } from './index';
import { TaskRepository } from '../repositories/TaskRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { DEFAULT_APP_SETTINGS } from '../types/settings';

const CURRENT_VERSION = Number(process.env.EXPO_PUBLIC_DB_VERSION) || 4;

interface MigrationVersion {
  version: number;
  applied_at: string;
}

export class DatabaseMigrations {
  /**
   * Helper: Check if a column exists in a table
   */
  private static async columnExists(tableName: string, columnName: string): Promise<boolean> {
    try {
      const result = await querySqlFirst<{ name: string }>(
        `SELECT name FROM pragma_table_info('${tableName}') WHERE name = '${columnName}';`
      );
      return result?.name === columnName;
    } catch (err) {
      console.warn(`[DB] Unable to check if column ${columnName} exists in ${tableName}`, err);
      return false;
    }
  }

  /**
   * Helper: Check if a table exists
   */
  private static async tableExists(tableName: string): Promise<boolean> {
    try {
      const result = await querySqlFirst<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
      );
      return result?.name === tableName;
    } catch (err) {
      console.warn(`[DB] Unable to check if table ${tableName} exists`, err);
      return false;
    }
  }

  /**
   * Initialize the migration tracking table
   */
  private static async initMigrationTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await executeSql(sql);
  }

  /**
   * Get the current database version
   */
  private static async getCurrentVersion(): Promise<number> {
    const row = await querySqlFirst<MigrationVersion>(
      'SELECT version FROM migrations ORDER BY version DESC LIMIT 1;'
    );
    return row?.version ?? 0;
  }

  /**
   * Mark a migration as applied
   */
  private static async markMigrationApplied(version: number): Promise<void> {
    await executeSql('INSERT INTO migrations (version) VALUES (?);', [version]);
  }

  /**
   * Run all pending migrations
   */
  static async runMigrations(): Promise<void> {
    console.log('[DB] Initializing migration system...');
    await this.initMigrationTable();

    const currentVersion = await this.getCurrentVersion();
    console.log(`[DB] Current version: ${currentVersion}`);

    if (currentVersion < 1) {
      console.log('[DB] Running migration v1: Initial schema...');
      await this.migration_v1_initial_schema();
      await this.markMigrationApplied(1);
      console.log('[DB] Migration v1 completed');
    }

    if (currentVersion < 2) {
      console.log('[DB] Running migration v2: Add calendar sync tracking...');
      await this.migration_v2_add_calendar_event_id();
      await this.markMigrationApplied(2);
      console.log('[DB] Migration v2 completed');
    }

    if (currentVersion < 3) {
      console.log('[DB] Running migration v3: Add haptics setting...');
      await this.migration_v3_add_haptics_setting();
      await this.markMigrationApplied(3);
      console.log('[DB] Migration v3 completed');
    }

    if (currentVersion < 4) {
      console.log('[DB] Running migration v4: Add notification IDs tracking...');
      await this.migration_v4_add_notification_ids();
      await this.markMigrationApplied(4);
      console.log('[DB] Migration v4 completed');
    }

    console.log(`[DB] Database up to date (v${CURRENT_VERSION})`);
  }

  /**
   * Migration v1: Initial schema and seed data
   */
  private static async migration_v1_initial_schema(): Promise<void> {
    // Create all tables (using CREATE TABLE IF NOT EXISTS internally)
    await TaskRepository.init();
    await CategoryRepository.init();
    await SettingsRepository.init();

    // Seed default settings (check if they exist first)
    const settingsToSeed = [
      { key: 'notificationsEnabled', value: DEFAULT_APP_SETTINGS.notificationsEnabled.toString() },
      { key: 'defaultNotifications', value: JSON.stringify(DEFAULT_APP_SETTINGS.defaultNotifications) },
      { key: 'theme', value: DEFAULT_APP_SETTINGS.theme },
      { key: 'calendarView', value: DEFAULT_APP_SETTINGS.calendarView },
      { key: 'hapticsEnabled', value: DEFAULT_APP_SETTINGS.hapticsEnabled.toString() },
    ];

    for (const setting of settingsToSeed) {
      try {
        const existing = await SettingsRepository.get(setting.key);
        if (existing === null) {
          await SettingsRepository.set(setting.key, setting.value);
          console.log(`[DB] Seeded setting: ${setting.key}`);
        } else {
          console.log(`[DB] Setting ${setting.key} already exists; skipping`);
        }
      } catch (err) {
        console.warn(`[DB] Error checking/seeding setting ${setting.key}:`, err);
      }
    }

    // Seed default categories
    const defaultCategories = [
      { name: 'Work', color: '#3B82F6' },
      { name: 'Personal', color: '#10B981' },
      { name: 'Study', color: '#8B5CF6' },
      { name: 'Health', color: '#EF4444' },
    ];

    for (const category of defaultCategories) {
      try {
        await CategoryRepository.create(category);
        console.log(`[DB] Seeded category: ${category.name}`);
      } catch (err) {
        // Ignore duplicate errors (UNIQUE constraint)
        console.log(`[DB] Category ${category.name} already exists; skipping`);
      }
    }
  }

  /**
   * Migration v2: Add calendar_event_id column for sync tracking
   */
  private static async migration_v2_add_calendar_event_id(): Promise<void> {
    // Check if column already exists
    const exists = await this.columnExists('tasks', 'calendar_event_id');
    if (exists) {
      console.log('[DB] calendar_event_id column already exists; skipping');
      return;
    }

    await executeSql("ALTER TABLE tasks ADD COLUMN calendar_event_id TEXT;");
    console.log('[DB] Added calendar_event_id column to tasks table');
  }

  /**
   * Migration v3: Add haptics setting
   */
  private static async migration_v3_add_haptics_setting(): Promise<void> {
    // Check if setting already exists
    try {
      const existing = await SettingsRepository.get('hapticsEnabled');
      if (existing !== null) {
        console.log('[DB] hapticsEnabled setting already exists; skipping');
        return;
      }
    } catch (err) {
      console.warn('[DB] Unable to check existing hapticsEnabled setting', err);
    }

    // Add hapticsEnabled setting with default value
    await SettingsRepository.set('hapticsEnabled', DEFAULT_APP_SETTINGS.hapticsEnabled.toString());
    console.log('[DB] Added hapticsEnabled setting');
  }

  /**
   * Migration v4: Add notification_ids column for tracking scheduled notifications
   */
  private static async migration_v4_add_notification_ids(): Promise<void> {
    // Check if column already exists
    const exists = await this.columnExists('tasks', 'notification_ids');
    if (exists) {
      console.log('[DB] notification_ids column already exists; skipping');
      return;
    }

    await executeSql("ALTER TABLE tasks ADD COLUMN notification_ids TEXT;");
    console.log('[DB] Added notification_ids column to tasks table');
  }

  /**
   * Reset database (for development/testing only)
   */
  static async resetDatabase(): Promise<void> {
    console.warn('[DB] Resetting database...');
    await executeSql('DROP TABLE IF EXISTS tasks;');
    await executeSql('DROP TABLE IF EXISTS categories;');
    await executeSql('DROP TABLE IF EXISTS settings;');
    await executeSql('DROP TABLE IF EXISTS migrations;');
    await this.runMigrations();
    console.log('[DB] Database reset complete');
  }
}

export default DatabaseMigrations;
