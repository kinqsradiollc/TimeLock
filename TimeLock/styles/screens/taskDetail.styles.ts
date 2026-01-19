import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '../common';
import { SharedStyles } from '../shared';

export const taskDetailStyles = StyleSheet.create({
  container: SharedStyles.flexContainer,
  header: SharedStyles.screenHeader,
  headerButton: SharedStyles.headerButton,
  headerTitle: {
    ...SharedStyles.headerTitle,
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.lg,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  content: SharedStyles.flexContainer,
  scrollContent: SharedStyles.scrollContentBottomSpacing,
  card: SharedStyles.cardWithBorder,
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    lineHeight: 32,
    marginBottom: Spacing.md,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  categoryDot: SharedStyles.dot,
  categoryText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  priorityBadge: SharedStyles.badge,
  priorityText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  sectionHeader: SharedStyles.sectionHeader,
  sectionTitle: SharedStyles.sectionTitle,
  description: {
    fontSize: Typography.base,
    lineHeight: 24,
  },
  deadlineContent: {
    gap: Spacing.xs,
  },
  deadlineText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    lineHeight: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  deadlineTime: {
    fontSize: Typography.base,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.xs,
  },
  overdueText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  metaText: {
    fontSize: Typography.base,
    lineHeight: 22,
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  completeButton: SharedStyles.primaryButton,
  completeButtonText: {
    ...SharedStyles.buttonText,
    color: '#FFFFFF',
  },
  deleteButton: SharedStyles.secondaryButton,
  deleteButtonText: SharedStyles.buttonText,
  loadingText: SharedStyles.loadingText,
});
