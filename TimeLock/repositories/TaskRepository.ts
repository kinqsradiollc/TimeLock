import { executeSql, querySql, querySqlFirst } from '../database';
import type { Task } from '../types/task';
import { NotificationService } from '../services/NotificationService';

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
        is_active INTEGER DEFAULT 1,
        calendar_event_id TEXT
      );
    `;
    await executeSql(sql);
  }

  static async create(task: TaskInsert): Promise<number> {
    const notifications = JSON.stringify(task.notifications || []);
    const sql = `INSERT INTO tasks (title, description, deadline, completed, priority, category_id, notifications, is_active, calendar_event_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
      task.title,
      task.description ?? null,
      task.deadline ?? null,
      task.completed ? 1 : 0,
      task.priority,
      task.categoryId ?? null,
      notifications,
      task.isActive ? 1 : 0,
      task.calendarEventId ?? null,
    ];
    const res = await executeSql(sql, params);
    const taskId = res.lastInsertRowId;

    // Schedule notifications for the new task
    try {
      const fullTask: Task = {
        ...task,
        id: taskId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const scheduledNotifications = await NotificationService.scheduleTaskReminders(fullTask);
      
      // Store notification IDs in the database
      if (scheduledNotifications.length > 0) {
        const notificationIds = scheduledNotifications.map(n => n.notificationId);
        await executeSql(
          'UPDATE tasks SET notification_ids = ? WHERE id = ?',
          [JSON.stringify(notificationIds), taskId]
        );
        console.log(`[TaskRepository] Scheduled ${notificationIds.length} notification(s) for task ${taskId}`);
      }
    } catch (error) {
      console.error('[TaskRepository] Failed to schedule notifications:', error);
      // Don't fail task creation if notifications fail
    }

    return taskId;
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
    // Get current task for notification comparison
    const currentTask = await this.findById(id);
    if (!currentTask) return;

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
    if (updates.calendarEventId !== undefined) {
      parts.push('calendar_event_id = ?');
      params.push(updates.calendarEventId ?? null);
    }
    if (parts.length === 0) return;
    parts.push("updated_at = CURRENT_TIMESTAMP");
    const sql = `UPDATE tasks SET ${parts.join(', ')} WHERE id = ?;`;
    params.push(id);
    await executeSql(sql, params);

    // Reschedule notifications if deadline or notifications array changed
    try {
      const needsReschedule = 
        (updates.deadline !== undefined && updates.deadline !== currentTask.deadline) ||
        (updates.notifications !== undefined && 
         JSON.stringify(updates.notifications) !== JSON.stringify(currentTask.notifications));

      if (needsReschedule) {
        const updatedTask = await this.findById(id);
        if (updatedTask && currentTask.notificationIds) {
          const scheduledNotifications = await NotificationService.rescheduleTaskReminders(
            updatedTask,
            currentTask.notificationIds
          );
          
          // Update notification IDs
          const notificationIds = scheduledNotifications.map(n => n.notificationId);
          await executeSql(
            'UPDATE tasks SET notification_ids = ? WHERE id = ?',
            [JSON.stringify(notificationIds), id]
          );
          console.log(`[TaskRepository] Rescheduled ${notificationIds.length} notification(s) for task ${id}`);
        }
      }

      // Cancel notifications if task is marked completed
      if (updates.completed === true && currentTask.notificationIds) {
        await NotificationService.cancelTaskNotifications(currentTask.notificationIds);
        await executeSql(
          'UPDATE tasks SET notification_ids = ? WHERE id = ?',
          [JSON.stringify([]), id]
        );
        console.log(`[TaskRepository] Cancelled notifications for completed task ${id}`);
      }
    } catch (error) {
      console.error('[TaskRepository] Failed to update notifications:', error);
      // Don't fail task update if notifications fail
    }
  }

  static async delete(id: number): Promise<void> {
    // Cancel notifications before deleting
    try {
      const task = await this.findById(id);
      if (task?.notificationIds && task.notificationIds.length > 0) {
        await NotificationService.cancelTaskNotifications(task.notificationIds);
        console.log(`[TaskRepository] Cancelled notifications for deleted task ${id}`);
      }
    } catch (error) {
      console.error('[TaskRepository] Failed to cancel notifications:', error);
      // Continue with deletion even if notification cancellation fails
    }

    await executeSql(`DELETE FROM tasks WHERE id = ?;`, [id]);
  }

  static async toggleCompletion(id: number): Promise<void> {
    const task = await this.findById(id);
    if (!task) return;
    
    // If marking as complete, cancel notifications (handled in update)
    // If marking as incomplete, reschedule notifications
    if (task.completed) {
      // Marking as incomplete - reschedule notifications
      await this.update(id, { completed: false });
      
      try {
        const updatedTask = await this.findById(id);
        if (updatedTask) {
          const scheduledNotifications = await NotificationService.scheduleTaskReminders(updatedTask);
          const notificationIds = scheduledNotifications.map(n => n.notificationId);
          await executeSql(
            'UPDATE tasks SET notification_ids = ? WHERE id = ?',
            [JSON.stringify(notificationIds), id]
          );
          console.log(`[TaskRepository] Rescheduled notifications for reopened task ${id}`);
        }
      } catch (error) {
        console.error('[TaskRepository] Failed to reschedule notifications:', error);
      }
    } else {
      // Marking as complete - cancellation handled in update method
      await this.update(id, { completed: true });
    }
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
      calendarEventId: row.calendar_event_id ?? undefined,
    };
  }
}

export default TaskRepository;
