import { StyleSheet, Platform } from 'react-native';
import { Spacing, Typography } from './common';

/**
 * Shared style patterns used across multiple screens and components
 * Extract common styles to reduce duplication and maintain consistency
 */

export const SharedStyles = StyleSheet.create({
  // Container patterns
  flexContainer: {
    flex: 1,
  },

  // Header patterns
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },

  // Card patterns
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  cardElevated: {
    borderRadius: 16,
    padding: Spacing.lg,
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

  cardWithBorder: {
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
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

  // Section patterns
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },

  sectionTitleLarge: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },

  sectionTitleSmall: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Button patterns
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: 16,
    padding: Spacing.lg,
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

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
  },

  buttonText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },

  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Badge patterns
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },

  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },

  badgeTextSmall: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },

  // Input patterns
  input: {
    fontSize: Typography.md,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 48,
  },

  inputWithBorder: {
    fontSize: Typography.md,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    minHeight: 48,
  },

  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },

  // Form patterns
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  label: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    flex: 1,
  },

  // Row patterns
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  // Modal patterns
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },

  // Scroll content patterns
  scrollContent: {
    padding: Spacing.lg,
  },

  scrollContentWithGap: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  scrollContentBottomSpacing: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // Loading patterns
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xxxl,
    fontSize: Typography.md,
  },

  // Empty state patterns
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },

  emptyText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },

  emptySubtext: {
    fontSize: Typography.sm,
  },

  // Dot indicator pattern
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  dotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Icon container patterns
  iconContainerSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainerMedium: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Commonly used style combinations
 */
export const StyleCombos = {
  // Centered flex container
  centeredContainer: [SharedStyles.flexContainer, { alignItems: 'center', justifyContent: 'center' }],
  
  // List with padding
  listWithPadding: { paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  
  // Button row
  buttonRow: { flexDirection: 'row' as const, gap: Spacing.md },
  
  // Grid with gap
  gridWithGap: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: Spacing.md },
};
