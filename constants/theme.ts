export const Colors = {
  // Primary greens
  deepForest: "#1a3310",
  midForest: "#2d4a1e",
  accentGreen: "#4a7c30",
  leafGreen: "#3b6d11",

  // Surfaces
  sageDark: "#c8d8b0",
  sageMid: "#d4e8c0",
  sageLight: "#e8f0e0",
  sagePale: "#f5f7f2",

  // Text
  textPrimary: "#1a3310",
  textSecond: "#4a5e3a",
  textMuted: "#7a8f6a",
  textOnDark: "#e8f0e0",
  textOnDarkMuted: "#9fe1cb",

  // Semantic
  warnAmber: "#ba7517",
  warnBg: "#fef3e2",
  dangerRed: "#c0392b",
  dangerBg: "#fce8e8",
  dangerText: "#791f1f",
  successGreen: "#27500a",

  // Compatibility pills
  compatOkBg: "#d4e8c0",
  compatOkText: "#27500a",
  compatNoBg: "#fce8e8",
  compatNoText: "#791f1f",

  // Neutrals
  white: "#ffffff",
  borderLight: "#e0ecd0",
  yellow: "#FFFF00",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
  screenH: 16,
  cardPadH: 14,
  cardPadV: 12,
} as const;

export const TabBar = {
  bg: Colors.white,
  borderColor: Colors.borderLight,
  activeTint: Colors.deepForest,
  inactiveTint: Colors.textMuted,
  activeIconBg: Colors.sageMid,
} as const;
export const Typography = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,

  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
} as const;

import { StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.sagePale,
  },
  header: {
    backgroundColor: Colors.deepForest,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.md,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  headerTitle: {
    color: Colors.textOnDark,
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
  },
  headerSub: {
    color: Colors.textOnDarkMuted,
    fontSize: Typography.base,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecond,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  rowBetween: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
});
