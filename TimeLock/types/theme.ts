/**
 * Theme option type shared across the app.
 */
export type ThemeOption = 'light' | 'dark' | 'system';

export const THEME_OPTIONS: ThemeOption[] = ['light', 'dark', 'system'];

export function isThemeOption(value: string): value is ThemeOption {
  return THEME_OPTIONS.includes(value as ThemeOption);
}
