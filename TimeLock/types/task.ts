import type { NotificationOption } from './notification';
import type { Priority } from './priority';

/**
 * Public Task model used across UI and repositories. 
 * Dates/times are ISO strings with full date and time information.
 * Example: '2026-01-20T15:30:00.000Z'
 */
export interface Task {
  id?: number;
  title: string;
  description?: string;
  deadline: string; // ISO string with date and time
  createdAt: string; // ISO string with date and time
  updatedAt: string; // ISO string with date and time
  completed: boolean;
  priority: Priority;
  categoryId?: number;
  notifications: NotificationOption[];
  isActive: boolean;
}

export interface TaskFilter {
  categoryId?: number;
  completed?: boolean;
  priority?: Priority;
  fromDate?: string; // ISO
  toDate?: string; // ISO
}

/**
 * Lightweight factory to create a Task row for insertion (no `id`/timestamps).
 */
export function taskInsertRow(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    title: data.title,
    description: data.description ?? null,
    deadline: data.deadline,
    completed: data.completed ? 1 : 0,
    priority: data.priority,
    category_id: data.categoryId ?? null,
    notifications: JSON.stringify(data.notifications),
    is_active: data.isActive ? 1 : 0,
  } as const;
}
