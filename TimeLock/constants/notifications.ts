// constants/notifications.ts
// Predefined notification options (minutes before deadline).

export const NOTIFICATION_OPTIONS = {
  ONE_MINUTE: 1,
  FIVE_MINUTES: 5,
  FIFTEEN_MINUTES: 15,
  THIRTY_MINUTES: 30,
  ONE_HOUR: 60,
  TWO_HOURS: 120,
  ONE_DAY: 1440,
  TWO_DAYS: 2880,
  ONE_WEEK: 10080,
  TWO_WEEKS: 20160,
} as const;

export type NotificationOptionKey = keyof typeof NOTIFICATION_OPTIONS;
export type NotificationOptionMinutes = typeof NOTIFICATION_OPTIONS[NotificationOptionKey];

export const NOTIFICATION_CHOICES: Array<{
  key: NotificationOptionKey;
  minutes: NotificationOptionMinutes;
  label: string;
}> = [
  { key: 'ONE_DAY', minutes: NOTIFICATION_OPTIONS.ONE_DAY, label: '1 day before' },
  { key: 'TWO_DAYS', minutes: NOTIFICATION_OPTIONS.TWO_DAYS, label: '2 days before' },
  { key: 'ONE_WEEK', minutes: NOTIFICATION_OPTIONS.ONE_WEEK, label: '1 week before' },
  { key: 'TWO_WEEKS', minutes: NOTIFICATION_OPTIONS.TWO_WEEKS, label: '2 weeks before' },
  { key: 'TWO_HOURS', minutes: NOTIFICATION_OPTIONS.TWO_HOURS, label: '2 hours before' },
  { key: 'ONE_HOUR', minutes: NOTIFICATION_OPTIONS.ONE_HOUR, label: '1 hour before' },
  { key: 'THIRTY_MINUTES', minutes: NOTIFICATION_OPTIONS.THIRTY_MINUTES, label: '30 minutes before' },
  { key: 'FIFTEEN_MINUTES', minutes: NOTIFICATION_OPTIONS.FIFTEEN_MINUTES, label: '15 minutes before' },
  { key: 'FIVE_MINUTES', minutes: NOTIFICATION_OPTIONS.FIVE_MINUTES, label: '5 minutes before' },
  { key: 'ONE_MINUTE', minutes: NOTIFICATION_OPTIONS.ONE_MINUTE, label: '1 minute before' },
];

export const DEFAULT_NOTIFICATION_OPTION = NOTIFICATION_OPTIONS.ONE_DAY;

export default {
  NOTIFICATION_OPTIONS,
  NOTIFICATION_CHOICES,
  DEFAULT_NOTIFICATION_OPTION,
};
