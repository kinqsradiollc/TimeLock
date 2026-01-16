import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '../common';
import { SharedStyles } from '../shared';

export const tasksStyles = StyleSheet.create({
  container: SharedStyles.flexContainer,
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  emptyContainer: SharedStyles.flexContainer,
  loadingText: SharedStyles.loadingText,
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
  },
  emptyTodayContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyTodayText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.xs,
  },
  emptyTodaySubtext: {
    fontSize: Typography.sm,
  },
});
