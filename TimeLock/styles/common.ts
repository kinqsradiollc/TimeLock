import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkColors : LightColors;
}

export { LightColors, DarkColors, Colors } from './colors';
export * from './spacing';
export * from './typography';
export { SharedStyles, StyleCombos } from './shared';
