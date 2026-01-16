import { StyleSheet, Platform } from 'react-native';
import { Spacing, Typography } from '@/styles/common';

export const taskCardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: Typography.sm,
    lineHeight: 18,
    marginTop: -2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  progressContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: Typography.bold,
    lineHeight: 20,
  },
  timeUnit: {
    fontSize: 9,
    fontWeight: Typography.semibold,
    lineHeight: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
