import { StyleSheet, Platform } from 'react-native';
import { Spacing, Typography } from '../common';
import { SharedStyles } from '../shared';

export const taskFormStyles = StyleSheet.create({
  container: SharedStyles.flexContainer,
  header: SharedStyles.screenHeader,
  headerButton: SharedStyles.headerButton,
  saveButtonContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerTitleContainer: SharedStyles.headerTitleContainer,
  headerTitle: SharedStyles.headerTitle,
  form: SharedStyles.flexContainer,
  formContent: SharedStyles.scrollContentWithGap,
  card: SharedStyles.card,
  labelRow: SharedStyles.labelRow,
  label: SharedStyles.label,
  required: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  input: SharedStyles.input,
  textArea: SharedStyles.textArea,
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
    minHeight: 52,
  },
  dateTimeText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  priorityOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    gap: Spacing.sm,
    minHeight: 48,
  },
  priorityText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    gap: Spacing.sm,
    minHeight: 44,
  },
  categoryDot: SharedStyles.dot,
  categoryText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  manageCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  manageCategoriesText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  loadingText: SharedStyles.loadingText,
  bottomSpacer: {
    height: Spacing.xxxl,
  },
  modalOverlay: SharedStyles.modalOverlay,
  modalContent: {
    ...SharedStyles.modalContent,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
  },
  modalHeader: {
    ...SharedStyles.modalHeader,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  modalTitle: SharedStyles.modalTitle,
  doneButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  modalButton: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  pickerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    alignSelf: 'center',
  },
});
