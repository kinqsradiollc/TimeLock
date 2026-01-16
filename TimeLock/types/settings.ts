import { NOTIFICATION_OPTIONS } from './notification';
import type { NotificationOption } from './notification';
import type { ThemeOption } from './theme';

/**
 * App settings persisted in the `settings` key/value table.
 */
export interface AppSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  defaultNotifications: NotificationOption[];
  theme: ThemeOption;
  calendarView: 'month' | 'week' | 'day';
  hapticsEnabled: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  soundEnabled: true,
  defaultNotifications: [NOTIFICATION_OPTIONS.ONE_DAY], // ONE_DAY by default (canonical constant)
  theme: 'system',
  calendarView: 'month',
  hapticsEnabled: true,
};
