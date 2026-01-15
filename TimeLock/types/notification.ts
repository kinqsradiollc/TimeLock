/**
 * Notification option constants and types.
 * Keep the canonical values in one place to avoid duplication.
 */
import { NOTIFICATION_OPTIONS as CANONICAL_NOTIFICATION_OPTIONS } from '../constants/notifications';

export const NOTIFICATION_OPTIONS = CANONICAL_NOTIFICATION_OPTIONS;

export type NotificationOption = typeof NOTIFICATION_OPTIONS[keyof typeof NOTIFICATION_OPTIONS];

/**
 * Utility: check whether a number is a valid NotificationOption value.
 */
export function isNotificationOption(value: number): value is NotificationOption {
  return Object.values(NOTIFICATION_OPTIONS).includes(value as NotificationOption);
}
