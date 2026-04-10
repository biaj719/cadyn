/**
 * DESIGN TOKENS
 * Centralized design values for the Cadyn app.
 * All components should import from this file instead of using inline values.
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Primary palette - warmer, softer aesthetic
  background: '#F5F0E8',
  foreground: '#1A1A1A',
  card: '#FDFCFA',
  cardBackground: '#FDFCFA',
  
  // Text colors - warmer tones
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#8B8B8B',
  textMuted: '#6B6B6B',
  textMutedLight: '#8B8B8B',
  
  // Status colors - deep muted forest green accent
  success: '#2F6F5A',
  successLight: '#E8F5F0',
  successLighter: '#D1F4E0',
  warning: '#FF9500',
  warningLight: '#FFF3E0',
  warningLighter: '#FFF3E0',
  destructive: '#FF3B30',
  accentPrimary: '#2F6F5A',
  accentPrimaryBg: '#EEF4F1',
  accentGreen: '#2F6F5A',
  accentOrange: '#FF9500',
  accentRed: '#FF3B30',
  
  // Button styles
  buttonPrimaryBg: '#3D5C50',
  buttonPrimaryBgHover: '#355649',
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryShadow: '0 1px 3px rgba(0,0,0,0.08)',
  buttonSecondaryBg: '#EAE4DC',
  buttonSecondaryBgHover: '#DDD6CC',
  buttonSecondaryText: '#2E2A26',
  buttonSecondaryBorder: '#D8CFC5',
  buttonRadius: '14px',
  
  // Navigation
  navActiveColor: '#3D5C50',
  
  // Progress
  progressBarFill: '#2F6F5A',
  
  // UI colors - warm, soft borders
  border: '#E8E2D9',
  divider: '#EDE8E0',
  borderLight: 'transparent',
  input: '#F5F0E8',
  
  // Badge colors - updated for warm aesthetic with forest green
  badgeGreenBg: '#EEF4F1',
  badgeDoneBg: '#EEF4F1',
  badgeDoneText: '#2F6F5A',
  badgeGrayBg: '#F5F0E8',
  badgeProgressBg: '#F5F0E8',
  badgeProgressText: '#6B6B6B',
  badgeOrangeBg: '#FFF3E0',
  badgeGreenText: '#2F6F5A',
  
  // Icon container - warm background
  iconContainerBg: '#EDE8E0',
  
  // Hero card - dark navy background
  heroCardBg: '#1C2B3A',
  heroCardText: '#FFFFFF',
  
  // Hero gradient - updated for warm palette with forest green glow
  heroGradientStart: '#E8F5F0',
  heroGradientEnd: '#F0FAF5',
  heroGlow: 'rgba(44, 95, 74, 0.1)',

  // Semantic aliases
  primary: '#3D5C50',
  muted: '#EFE9E0',
  mutedForeground: '#8A847C',

  // Icon color system
  iconOverviewBg: '#DDE8E2',
  iconOverviewFg: '#2A5E49',
  iconOverviewActiveBg: '#C8D8D0',
  iconOverviewActiveFg: '#1E4A38',
  iconPlanBg: '#E8E0D4',
  iconPlanFg: '#6B4E2E',
  iconGroupsBg: '#E6E2DC',
  iconGroupsFg: '#5C5347',
  iconWalletBg: '#F0E2D4',
  iconWalletFg: '#8C4F32',
  iconActivityBg: '#DDE5E1',
  iconActivityFg: '#3D6B58',
  accent: '#5C7A9E',
  accentSoft: '#E4EBF3',
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font sizes - based on config: 11px, 13px, 15px, 17px, 22px, 48px, 56px
  fontSize: {
    xs: '10px',
    sm: '11px',      // fontSizeXS
    md: '13px',      // fontSizeSM (used for badges)
    base: '13px',    // fontSizeSM
    lg: '15px',      // fontSizeMD
    xl: '17px',      // fontSizeLG
    '2xl': '22px',   // fontSizeXL
    '3xl': '22px',
    '4xl': '28px',
    '5xl': '32px',
    '6xl': '48px',   // fontSizeHero
    '7xl': '56px',
  },
  
  // Font weights - based on config
  fontWeight: {
    normal: 400,     // fontWeightRegular
    medium: 500,     // fontWeightMedium
    semibold: 600,   // fontWeightSemibold
    bold: 700,       // fontWeightBold
    extrabold: 800,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.06em',
    wider: '0.08em',
  },
  
  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.3,
    normal: 1.5,
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  '0': '0px',
  '1': '4px',       // spacingXS
  '2': '8px',       // spacingSM
  '3': '12px',      // spacingMD
  '4': '16px',      // spacingLG
  '5': '20px',      // spacingXL
  '6': '28px',      // spacingXXL
  '7': '14px',
  '8': '16px',
  '9': '20px',
  '10': '24px',
  '11': '28px',
  '12': '32px',
  '14': '46px',
  '16': '48px',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '8px',
  md: '10px',       // iconContainerRadius
  lg: '12px',
  xl: '14px',       // cardRadius
  '2xl': '16px',
  full: '20px',
  circle: '50%',
  pill: '100px',
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0,0,0,0.08)',   // cardShadow from config
  md: '0 1px 4px rgba(0,0,0,0.04)',
  lg: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
} as const;

// =============================================================================
// COMPONENT-SPECIFIC TOKENS
// =============================================================================

// Card styles - based on config: cardRadius='14px', cardShadow, cardPadding='16px'
export const cardStyles = {
  default: {
    backgroundColor: colors.card,
    borderRadius: '14px',  // cardRadius from config
    boxShadow: shadows.sm, // cardShadow from config
    padding: '16px',       // cardPadding from config
  },
  primary: {
    backgroundColor: colors.card,
    borderRadius: '14px',
    boxShadow: shadows.sm,
    padding: '16px',
  },
  subtle: {
    backgroundColor: colors.card,
    borderRadius: '14px',
    boxShadow: shadows.md,
    padding: '16px',
  },
  banner: {
    backgroundColor: colors.background,
    borderRadius: '12px',
    padding: '16px',
  },
  compact: {
    backgroundColor: colors.card,
    borderRadius: '14px',
    boxShadow: shadows.sm,
    padding: '16px',
  },
  standard: {
    backgroundColor: colors.card,
    borderRadius: '14px',
    boxShadow: shadows.sm,
    padding: '20px',
  },
  feature: {
    backgroundColor: colors.card,
    borderRadius: '14px',
    boxShadow: shadows.sm,
    padding: '24px',
  },
} as const;

// Icon container styles - based on config: iconContainerSize='36px', iconContainerRadius='10px'
export const iconContainerStyles = {
  default: {
    width: '36px',         // iconContainerSize from config
    height: '36px',
    backgroundColor: colors.iconContainerBg,
    borderRadius: '10px',  // iconContainerRadius from config
  },
  large: {
    width: '52px',
    height: '52px',
    backgroundColor: colors.iconContainerBg,
    borderRadius: '14px',
    padding: '14px',
  },
  small: {
    width: '28px',
    height: '28px',
    backgroundColor: colors.iconContainerBg,
    borderRadius: '8px',
  },
} as const;

// Badge styles
export const badgeStyles = {
  done: {
    backgroundColor: colors.badgeDoneBg,
    color: colors.badgeDoneText,
    borderRadius: borderRadius.full,
    padding: `3px ${spacing['5']}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  progress: {
    backgroundColor: colors.badgeProgressBg,
    color: colors.badgeProgressText,
    borderRadius: borderRadius.full,
    padding: `3px ${spacing['5']}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  warning: {
    backgroundColor: colors.warningLighter,
    color: colors.warning,
    borderRadius: borderRadius.full,
    padding: `3px ${spacing['5']}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
} as const;

// Section header styles
export const sectionHeaderStyles = {
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.semibold,
  letterSpacing: typography.letterSpacing.wider,
  color: colors.textMuted,
  textTransform: 'uppercase' as const,
  marginBottom: spacing['5'],
} as const;

// Progress bar styles
export const progressBarStyles = {
  height: '6px',
  borderRadius: borderRadius.pill,
  backgroundColor: colors.border,
  fillColor: colors.progressBarFill,
} as const;

// Hero card specific styles
export const heroCardStyles = {
  background: `linear-gradient(135deg, ${colors.heroGradientStart} 0%, ${colors.heroGradientEnd} 100%)`,
  borderRadius: borderRadius['2xl'],
  boxShadow: shadows.sm,
  padding: `${spacing['10']} ${spacing['12']}`, // 24px 32px
  countdownNumber: {
    fontSize: typography.fontSize['7xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.lineHeight.none,
  },
  countdownLabel: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
    paddingBottom: spacing['4'],
  },
} as const;

// Stat number styles
export const statStyles = {
  large: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing['4'],
  },
  colors: {
    success: colors.success,
    warning: colors.warning,
    muted: colors.textMuted,
    primary: colors.textPrimary,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
  },
} as const;

// List row styles
export const listRowStyles = {
  padding: `${spacing['7']} ${spacing['8']}`, // 14px 16px
  borderBottom: `1px solid ${colors.border}`,
  title: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
  },
  value: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
} as const;

// Task card styles
export const taskCardStyles = {
  padding: `${spacing['7']} ${spacing['8']}`, // 14px 16px
  iconGap: spacing['6'], // 12px
  iconMarginTop: spacing['1'], // 2px
  titleRow: {
    marginBottom: spacing['3'], // 6px
  },
  title: {
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
  },
  description: {
    paddingLeft: spacing['14'], // 46px (icon width + gap)
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.tight,
  },
  messageCount: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    opacity: 0.5,
  },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create inline style object for a card
 */
export function getCardStyle(variant: keyof typeof cardStyles = 'default') {
  return cardStyles[variant];
}

/**
 * Create inline style object for an icon container
 */
export function getIconContainerStyle(size: keyof typeof iconContainerStyles = 'default') {
  const style = iconContainerStyles[size];
  return {
    ...style,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
}

/**
 * Create inline style object for a badge
 */
export function getBadgeStyle(variant: keyof typeof badgeStyles) {
  return {
    ...badgeStyles[variant],
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };
}

/**
 * Create inline style object for section header
 */
export function getSectionHeaderStyle() {
  return sectionHeaderStyles;
}

/**
 * Create inline style object for progress bar container
 */
export function getProgressBarContainerStyle() {
  return {
    height: progressBarStyles.height,
    borderRadius: progressBarStyles.borderRadius,
    overflow: 'hidden' as const,
    backgroundColor: progressBarStyles.backgroundColor,
  };
}

/**
 * Create inline style object for progress bar fill
 */
export function getProgressBarFillStyle(percentage: number) {
  return {
    width: `${percentage}%`,
    backgroundColor: progressBarStyles.fillColor,
    height: '100%',
  };
}
export const textRoles = {
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#8A847C',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1F1F1F',
    lineHeight: 1.3,
  },
  titleLarge: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#1F1F1F',
    lineHeight: 1.1,
  },
  body: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#6F6A63',
    lineHeight: 1.5,
  },
  meta: {
    fontSize: '11px',
    fontWeight: 400,
    color: '#8A847C',
    lineHeight: 1.4,
  },
} as const;

export const ctaClass = {
  primary: "bg-[#3D5C50] hover:bg-[#355649] text-white rounded-[14px] px-6 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-medium text-sm inline-flex items-center gap-2",
  secondary: "bg-[#EAE4DC] hover:bg-[#DDD6CC] text-[#2E2A26] border border-[#D8CFC5] rounded-[14px] px-5 py-2.5 font-medium text-sm inline-flex items-center gap-2",
  tertiary: "text-[#2F6F5A] hover:text-[#1E5040] hover:underline bg-transparent border-none p-0 font-medium text-sm inline-flex items-center gap-1",
} as const;
