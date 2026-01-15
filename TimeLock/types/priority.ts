/**
 * Task priority type.
 * Exported as a distinct module so other modules can import only what they need.
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export function isPriority(value: string): value is Priority {
  return PRIORITIES.includes(value as Priority);
}
