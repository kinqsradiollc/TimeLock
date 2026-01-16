import { StyleSheet, Platform } from 'react-native';
import { Spacing, Typography } from '@/styles/common';
import { SharedStyles } from '../shared';

export const categoryManagerStyles = StyleSheet.create({
  container: SharedStyles.flexContainer,
  content: SharedStyles.flexContainer,
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  card: SharedStyles.card,
  labelRow: SharedStyles.labelRow,
  label: SharedStyles.label,
  input: {
    ...SharedStyles.inputWithBorder,
    marginBottom: Spacing.lg,
  },
  colorLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginBottom: Spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    minHeight: 48,
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  categoriesList: {
    gap: Spacing.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  categoryDot: SharedStyles.dotLarge,
  categoryName: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    flex: 1,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: SharedStyles.iconButton,
  emptyState: SharedStyles.emptyContainer,
  emptyText: SharedStyles.emptyText,
  emptySubtext: SharedStyles.emptySubtext,
  loadingText: SharedStyles.loadingText,
});
