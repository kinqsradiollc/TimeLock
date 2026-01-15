import { executeSql, querySql, querySqlFirst } from '../database';
import type { Category } from '../types/category';

export type CategoryInsert = Omit<Category, 'id' | 'createdAt'>;

export class CategoryRepository {
  static async init() {
    const sql = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await executeSql(sql);
  }

  static async create(category: CategoryInsert): Promise<number> {
    const sql = `INSERT INTO categories (name, color) VALUES (?, ?);`;
    const params = [category.name, category.color ?? null];
    const res = await executeSql(sql, params);
    return res.lastInsertRowId;
  }

  static async findAll(): Promise<Category[]> {
    const sql = `SELECT * FROM categories ORDER BY name ASC;`;
    const rows = await querySql<any>(sql);
    return rows.map(r => this.rowToCategory(r));
  }

  static async findById(id: number): Promise<Category | null> {
    const sql = `SELECT * FROM categories WHERE id = ? LIMIT 1;`;
    const row = await querySqlFirst<any>(sql, [id]);
    if (!row) return null;
    return this.rowToCategory(row);
  }

  static async update(id: number, updates: Partial<CategoryInsert>): Promise<void> {
    const parts: string[] = [];
    const params: any[] = [];
    
    if (updates.name !== undefined) {
      parts.push('name = ?');
      params.push(updates.name);
    }
    if (updates.color !== undefined) {
      parts.push('color = ?');
      params.push(updates.color);
    }
    
    if (parts.length === 0) return;
    
    const sql = `UPDATE categories SET ${parts.join(', ')} WHERE id = ?;`;
    params.push(id);
    await executeSql(sql, params);
  }

  static async delete(id: number): Promise<void> {
    await executeSql(`DELETE FROM categories WHERE id = ?;`, [id]);
  }

  private static rowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      color: row.color ?? undefined,
      createdAt: row.created_at ?? new Date().toISOString(),
    };
  }
}

export default CategoryRepository;
