import { executeSql, querySqlFirst } from './index';
import { TaskRepository } from '../repositories/TaskRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { DEFAULT_APP_SETTINGS } from '../types/settings';

const CURRENT_VERSION = Number(process.env.EXPO_PUBLIC_DB_VERSION) || 1;

interface MigrationVersion {
  version: number;
  applied_at: string;
}

export class DatabaseMigrations {
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

    console.log(`[DB] Database up to date (v${CURRENT_VERSION})`);
  }

  /**
   * Migration v1: Initial schema and seed data
   */
  private static async migration_v1_initial_schema(): Promise<void> {
    // Create all tables
    await TaskRepository.init();
    await CategoryRepository.init();
    await SettingsRepository.init();

    // Seed default settings
    await SettingsRepository.set('notificationsEnabled', DEFAULT_APP_SETTINGS.notificationsEnabled.toString());
    await SettingsRepository.set('defaultNotifications', JSON.stringify(DEFAULT_APP_SETTINGS.defaultNotifications));
    await SettingsRepository.set('theme', DEFAULT_APP_SETTINGS.theme);
    await SettingsRepository.set('calendarView', DEFAULT_APP_SETTINGS.calendarView);

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
      } catch (err) {
        // Ignore duplicate errors (UNIQUE constraint)
        console.warn(`[DB] Skipping duplicate category: ${category.name}`);
      }
    }
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
