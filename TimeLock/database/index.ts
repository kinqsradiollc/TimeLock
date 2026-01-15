import * as SQLite from 'expo-sqlite';

const DB_NAME = 'timelock.db';

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}

export async function executeSql(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
  const database = getDatabase();
  return database.runAsync(sql, params);
}

export async function querySql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const database = getDatabase();
  return database.getAllAsync<T>(sql, params);
}

export async function querySqlFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const database = getDatabase();
  return database.getFirstAsync<T>(sql, params);
}

export default getDatabase;
