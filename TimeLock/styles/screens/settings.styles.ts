import { StyleSheet, Platform } from 'react-native';
import { Spacing, Typography } from '@/styles/common';
import { SharedStyles } from '../shared';

export const settingsStyles = StyleSheet.create({
  container: SharedStyles.flexContainer,
  header: SharedStyles.screenHeader,
  headerButton: SharedStyles.headerButton,
  headerTitleContainer: SharedStyles.headerTitleContainer,
  headerTitle: SharedStyles.headerTitle,
  content: SharedStyles.flexContainer,
  scrollContent: SharedStyles.scrollContent,
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  dangerItem: {
    marginTop: 1,
  },
  iconContainer: SharedStyles.iconContainerSmall,
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  settingSubtitle: {
    fontSize: Typography.sm,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
  ownerSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  ownerText: {
    fontSize: Typography.sm,
    textAlign: 'center',
  },
  modalOverlay: SharedStyles.modalOverlay,
  modalContent: {
    ...SharedStyles.modalContent,
    paddingBottom: Spacing.xxxl,
  },
  modalHeader: SharedStyles.modalHeader,
  modalTitle: {
    ...SharedStyles.modalTitle,
    fontSize: Typography.xl,
  },
  modalClose: SharedStyles.iconButton,
  themeOptions: {
    gap: Spacing.md,
  },
  themeOption: {
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeOptionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    marginTop: Spacing.sm,
  },
  themeOptionSubtitle: {
    fontSize: Typography.sm,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
