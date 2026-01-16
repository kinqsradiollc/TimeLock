import React from 'react';
import { View, Text } from 'react-native';
import { LightColors, DarkColors } from '@/styles/common';
import { emptyStateStyles as styles } from '@/styles/components/emptyState.styles';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  message: string;
  subtitle?: string;
}

export function EmptyState({ message, subtitle }: EmptyStateProps) {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={[styles.message, { color: colors.textPrimary }]}>{message}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}
