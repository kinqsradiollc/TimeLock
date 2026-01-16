import { StyleSheet, Platform } from 'react-native';
import { Spacing, Typography } from '../common';
import { SharedStyles } from '../shared';

export const calendarStyles = StyleSheet.create({
  container: SharedStyles.flexContainer,
  content: SharedStyles.flexContainer,
  viewSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
  },
  viewButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tasksSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    ...SharedStyles.iconButton,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  sectionTitle: SharedStyles.sectionTitleLarge,
  taskCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  emptyCard: {
    borderRadius: 16,
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  taskCard: {
    borderRadius: 16,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  taskContent: {
    padding: Spacing.lg,
    paddingLeft: Spacing.lg + 8,
    gap: Spacing.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  // Selection mode styles
  checkboxContainer: {
    position: 'absolute',
    left: Spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityAndSyncBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  syncBadge: {
    padding: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Week view styles
  weekViewHeader: {
    paddingBottom: Spacing.md,
  },
  weekViewTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  weekDaysScroll: {
    flexGrow: 0,
  },
  weekDayCard: {
    width: 80,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weekDayName: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    textTransform: 'uppercase',
  },
  weekDayNumber: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  weekDayBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  weekDayBadgeText: {
    fontSize: 10,
    fontWeight: Typography.bold,
  },
  // Agenda view styles
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  agendaTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  agendaScroll: {
    maxHeight: 400,
  },
  agendaDateGroup: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  agendaDate: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  agendaTask: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  agendaTaskContent: {
    flex: 1,
    gap: 4,
  },
  agendaTaskTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  agendaTaskTime: {
    fontSize: Typography.xs,
  },
  agendaCheckbox: {
    marginRight: Spacing.sm,
  },
});
