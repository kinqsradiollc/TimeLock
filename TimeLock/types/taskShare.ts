import type { NotificationOption } from './notification';
import type { Priority } from './priority';

/**
 * Data encoded in QR task sharing. Keep stable and versioned.
 */
export interface TaskShareData {
  version: string; // e.g. '1.0'
  title: string;
  description?: string;
  deadline: string; // ISO string with date and time
  priority: Priority;
  categoryName?: string; // cross-user friendly
  notifications: NotificationOption[];
  sharedBy?: string;
  timestamp: string; // ISO timestamp when QR was generated
}

export function normalizeTaskShareData(raw: any): TaskShareData | null {
  // lightweight runtime validation to avoid crashes when importing.
  if (!raw || typeof raw.title !== 'string' || typeof raw.deadline !== 'string') return null;
  return {
    version: String(raw.version ?? '1.0'),
    title: String(raw.title),
    description: raw.description ? String(raw.description) : undefined,
    deadline: String(raw.deadline),
    priority: raw.priority ?? 'medium',
    categoryName: raw.categoryName ? String(raw.categoryName) : undefined,
    notifications: Array.isArray(raw.notifications) ? raw.notifications : [],
    sharedBy: raw.sharedBy ? String(raw.sharedBy) : undefined,
    timestamp: raw.timestamp ? String(raw.timestamp) : new Date().toISOString(),
  };
}
