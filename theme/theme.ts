// study-rooms/theme/theme.ts
/**
 * theme/theme.ts
 *
 * Centralized design tokens from the Chalmers Studentkår
 * "Grafisk profil" (Kårappen). Every color and type style used in
 * this module is pulled from this file - do not hardcode hex
 * values or font sizes elsewhere.
 *
 * Copied from agila/src/weekly-evaluation/theme/theme.ts - this
 * package is self-contained and cannot import across the folder
 * boundary into agila. Keep both copies in sync if the brand
 * profile changes.
 */

import { TextStyle } from 'react-native';

export const colors = {
  bla: '#00ACFF',
  lila: '#843690',
  rod: '#D8004D',
  mattRod: '#F8686D',
  orange: '#F86600',
  varmGra: '#634C3D',
  gron: '#27AD72',
  turkos: '#7CCDC2',

  white: '#FFFFFF',
  black: '#1A1A1A',
  disabledBackground: '#E0E0E0',
  disabledText: 'rgba(26, 26, 26, 0.4)',
} as const;

export const fontFamily = {
  regular: 'OpenSans-Regular',
  medium: 'OpenSans-Medium',
  semiBold: 'OpenSans-SemiBold',
  bold: 'OpenSans-Bold',
} as const;

export const typography: Record<string, TextStyle> = {
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
  },
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },
  heading2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
  subheading1: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  paragraph1: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  paragraph2: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  caption1: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  caption2: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    color: colors.orange,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  pill: 999,
  card: 12,
  sm: 6,
} as const;

export interface ThemeTokens {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  inputBg: string;
  disabledBackground: string;
  disabledText: string;
  selectedTint: string;
  badgeBg: string;
  pressed: string;
  primary: string;
}

export function getTheme(isDark: boolean): ThemeTokens {
  return {
    background: isDark ? '#121212' : colors.white,
    card: isDark ? colors.varmGra : colors.white,
    text: isDark ? colors.white : colors.black,
    subText: isDark ? '#A0A0A0' : colors.varmGra,
    border: isDark ? '#333333' : colors.disabledBackground,
    inputBg: isDark ? '#2C2C2C' : '#F3F4F6',
    disabledBackground: isDark ? '#3A3A3A' : colors.disabledBackground,
    disabledText: isDark ? 'rgba(255, 255, 255, 0.4)' : colors.disabledText,
    selectedTint: isDark ? 'rgba(0, 172, 255, 0.2)' : '#EAF7FF',
    badgeBg: isDark ? 'rgba(39, 173, 114, 0.2)' : '#EAF9F1',
    pressed: isDark ? '#2A2A2A' : '#F5F9FC',
    primary: colors.bla,
  };
}
