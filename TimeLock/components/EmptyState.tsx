import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LightColors, DarkColors, Spacing, Typography } from '@/styles/common';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
