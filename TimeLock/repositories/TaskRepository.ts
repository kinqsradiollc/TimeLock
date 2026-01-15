import { executeSql, querySql, querySqlFirst } from '../database';
import type { Task } from '../types/task';

export type TaskInsert = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export class TaskRepository {
  static async init() {
    const sql = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        deadline DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed INTEGER DEFAULT 0,
        priority TEXT CHECK(priority IN ('low','medium','high','urgent')) DEFAULT 'medium',
        category_id INTEGER,
        notifications TEXT,
        is_active INTEGER DEFAULT 1
      );
    `;
    await executeSql(sql);
  }

  static async create(task: TaskInsert): Promise<number> {
    const notifications = JSON.stringify(task.notifications || []);
    const sql = `INSERT INTO tasks (title, description, deadline, completed, priority, category_id, notifications, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
      task.title,
      task.description ?? null,
      task.deadline ?? null,
      task.completed ? 1 : 0,
      task.priority,
      task.categoryId ?? null,
      notifications,
      task.isActive ? 1 : 0,
    ];
    const res = await executeSql(sql, params);
    return res.lastInsertRowId;
  }

  static async findAll(): Promise<Task[]> {
    const sql = `SELECT * FROM tasks ORDER BY deadline ASC;`;
    const rows = await querySql<any>(sql);
    return rows.map(r => this.rowToTask(r));
  }

  static async findById(id: number): Promise<Task | null> {
    const sql = `SELECT * FROM tasks WHERE id = ? LIMIT 1;`;
    const row = await querySqlFirst<any>(sql, [id]);
    if (!row) return null;
    return this.rowToTask(row);
  }

  static async update(id: number, updates: Partial<Task>): Promise<void> {
    const parts: string[] = [];
    const params: any[] = [];
    if (updates.title !== undefined) {
      parts.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      parts.push('description = ?');
      params.push(updates.description);
    }
    if (updates.deadline !== undefined) {
      parts.push('deadline = ?');
      params.push(updates.deadline ?? null);
    }
    if (updates.completed !== undefined) {
      parts.push('completed = ?');
      params.push(updates.completed ? 1 : 0);
    }
    if (updates.priority !== undefined) {
      parts.push('priority = ?');
      params.push(updates.priority);
    }
    if (updates.categoryId !== undefined) {
      parts.push('category_id = ?');
      params.push(updates.categoryId);
    }
    if (updates.notifications !== undefined) {
      parts.push('notifications = ?');
      params.push(JSON.stringify(updates.notifications));
    }
    if (updates.isActive !== undefined) {
      parts.push('is_active = ?');
      params.push(updates.isActive ? 1 : 0);
    }
    if (parts.length === 0) return;
    parts.push("updated_at = CURRENT_TIMESTAMP");
    const sql = `UPDATE tasks SET ${parts.join(', ')} WHERE id = ?;`;
    params.push(id);
    await executeSql(sql, params);
  }

  static async delete(id: number): Promise<void> {
    await executeSql(`DELETE FROM tasks WHERE id = ?;`, [id]);
  }

  static async toggleCompletion(id: number): Promise<void> {
    const task = await this.findById(id);
    if (!task) return;
    await this.update(id, { completed: !task.completed });
  }

  private static rowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      deadline: row.deadline ?? '',
      createdAt: row.created_at ?? new Date().toISOString(),
      updatedAt: row.updated_at ?? new Date().toISOString(),
      completed: !!row.completed,
      priority: row.priority,
      categoryId: row.category_id ?? undefined,
      notifications: row.notifications ? JSON.parse(row.notifications) : [],
      isActive: !!row.is_active,
    };
  }
}

export default TaskRepository;
