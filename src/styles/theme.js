/**
 * Global Design Tokens
 *
 * Single source of truth for all colors, gradients, and common component styles.
 * Import from here instead of hardcoding values in JSX files.
 *
 * Usage:
 *   import { colors, gradients, cardStyle, btn } from "../../styles/theme";
 */

// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bgDeep:   "#0f172a",
  bgBase:   "#1e293b",

  // Borders
  borderSubtle: "#1e293b",
  border:       "#334155",

  // Text
  textPrimary:   "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted:     "#64748b",
  textFaint:     "#475569",

  // Indigo / Primary
  primary:      "#6366f1",
  primaryDark:  "#4f46e5",
  primaryDeep:  "#7c3aed",
  primaryLight: "#818cf8",
  primaryFaint: "#a5b4fc",
  primaryPale:  "#c7d2fe",

  // Green / Success
  success:      "#10b981",
  successLight: "#34d399",
  successDark:  "#059669",
  successDeep:  "#047857",

  // Amber / Warning
  warning:      "#f59e0b",
  warningLight: "#fbbf24",

  // Red / Danger
  danger:      "#ef4444",
  dangerDark:  "#dc2626",
  dangerDeep:  "#991b1b",
  dangerLight: "#f87171",
  dangerPale:  "#fca5a5",
  dangerBg:    "#450a0a",

  // Blue / Info
  info:      "#3b82f6",
  infoLight: "#60a5fa",
};

// ─── Alpha Fills ──────────────────────────────────────────────────────────────
export const alpha = {
  // Primary (indigo)
  primary10: "rgba(99,102,241,0.1)",
  primary12: "rgba(99,102,241,0.12)",
  primary15: "rgba(99,102,241,0.15)",
  primary20: "rgba(99,102,241,0.2)",
  primary25: "rgba(99,102,241,0.25)",
  primary30: "rgba(99,102,241,0.3)",
  primary40: "rgba(99,102,241,0.4)",
  primary50: "rgba(99,102,241,0.5)",
  primary70: "rgba(99,102,241,0.7)",

  // Success (green)
  success10: "rgba(16,185,129,0.1)",
  success15: "rgba(16,185,129,0.15)",
  success25: "rgba(16,185,129,0.25)",

  // Warning (amber)
  warning08: "rgba(245,158,11,0.08)",
  warning10: "rgba(245,158,11,0.1)",
  warning15: "rgba(245,158,11,0.15)",
  warning25: "rgba(245,158,11,0.25)",

  // Danger (red)
  danger10: "rgba(239,68,68,0.1)",
  danger15: "rgba(239,68,68,0.15)",
  danger25: "rgba(239,68,68,0.25)",

  // Info (blue)
  info10: "rgba(59,130,246,0.1)",
  info15: "rgba(59,130,246,0.15)",
  info25: "rgba(59,130,246,0.25)",

  // Neutral
  neutral15: "rgba(100,116,139,0.15)",

  // Misc
  white15: "rgba(255,255,255,0.15)",
  black60: "rgba(0,0,0,0.6)",
  black30: "rgba(0,0,0,0.3)",

  // Danger button
  dangerBtn:       "rgba(239,68,68,0.1)",
  dangerBtnBorder: "rgba(239,68,68,0.25)",
};

// ─── Gradients ────────────────────────────────────────────────────────────────
export const gradients = {
  page:    `linear-gradient(135deg, ${colors.bgDeep} 0%, ${colors.bgBase} 100%)`,
  primary: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primaryDeep})`,
  success: `linear-gradient(135deg, ${colors.successDark}, ${colors.successDeep})`,
  avatar:  `linear-gradient(135deg, ${colors.primary}, #8b5cf6)`,
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: "system-ui, sans-serif",
};

// ─── Common Page / Layout ─────────────────────────────────────────────────────
export const pageStyle = {
  minHeight: "100vh",
  background: gradients.page,
  color: colors.textPrimary,
  fontFamily: typography.fontFamily,
  padding: "0 0 60px",
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const cardStyle = {
  background: colors.bgBase,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
};

// ─── Section Label ────────────────────────────────────────────────────────────
export const sectionLabel = {
  margin: "0 0 16px",
  fontWeight: 600,
  fontSize: 13,
  color: colors.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

// ─── Input ────────────────────────────────────────────────────────────────────
export const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: colors.bgDeep,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  color: colors.textPrimary,
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
};

// ─── Button Variants ──────────────────────────────────────────────────────────
export const btn = {
  primary: {
    padding: "10px 20px",
    background: gradients.primary,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  secondary: {
    padding: "10px 20px",
    background: colors.border,
    color: colors.textPrimary,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  ghost: {
    padding: "10px 20px",
    background: "transparent",
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  danger: {
    padding: "10px 18px",
    background: "transparent",
    color: colors.dangerLight,
    border: `1px solid ${colors.dangerDeep}`,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  dangerFilled: {
    flex: 1,
    padding: "10px 0",
    background: colors.dangerDark,
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  success: {
    padding: "10px 20px",
    background: gradients.success,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
};

// ─── Icon Button (circular action button, e.g. bell, close) ──────────────────
export const iconBtn = {
  position: "relative",
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 36, height: 36, borderRadius: "50%",
  border: "none", cursor: "pointer",
  transition: "box-shadow 0.2s",
};

// ─── Dropdown Panel ───────────────────────────────────────────────────────────
export const dropdown = {
  position: "absolute",
  background: colors.bgBase,
  border: `1px solid ${colors.border}`,
  borderRadius: 14,
  boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
  overflowY: "auto",
  zIndex: 1000,
};

// ─── Count Badge (e.g. unread count on bell icon) ─────────────────────────────
export const countBadge = {
  position: "absolute", top: 0, right: 0,
  minWidth: 16, height: 16, borderRadius: 8,
  background: colors.danger, color: "#fff",
  fontSize: 9, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "0 4px", lineHeight: 1,
};

// ─── Pill / Tag (e.g. "3 new", status labels) ─────────────────────────────────
export const pill = {
  padding: "1px 7px",
  background: alpha.primary15,
  border: `1px solid ${alpha.primary25}`,
  borderRadius: 20,
  fontSize: 11, fontWeight: 700,
  color: colors.primaryLight,
};

// ─── Text Button (bare action link, no border or background) ──────────────────
export const textBtn = {
  background: "none", border: "none",
  cursor: "pointer", padding: 0,
  fontWeight: 600, fontSize: 12,
};

// ─── Empty State ──────────────────────────────────────────────────────────────
export const emptyState = {
  padding: "32px 16px",
  textAlign: "center",
  color: colors.textMuted,
  fontSize: 13,
};

// ─── List Row (clickable row inside a list or dropdown) ───────────────────────
export const listRow = {
  width: "100%",
  display: "flex", alignItems: "flex-start", gap: 12,
  padding: "12px 16px",
  border: "none", borderBottom: `1px solid ${colors.border}`,
  cursor: "pointer", textAlign: "left",
  transition: "background 0.1s",
};

// ─── Modal ────────────────────────────────────────────────────────────────────
export const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: alpha.black60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

export const modalCard = {
  background: colors.bgBase,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 28,
  maxWidth: 360,
  width: "90%",
  boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
};

// ─── Error / Alert Banners ────────────────────────────────────────────────────
export const errorBanner = {
  background: colors.dangerBg,
  border: `1px solid ${colors.dangerDeep}`,
  padding: "10px 14px",
  borderRadius: 8,
  marginBottom: 12,
  fontSize: 14,
  color: colors.dangerPale,
};

// ─── Trip Status Badge Colors ─────────────────────────────────────────────────
// Reusable map for rendering color-coded badges by trip status.
export const tripStatusColors = {
  REQUESTED: { bg: alpha.info15,    color: colors.infoLight,    label: "Requested" },
  OPEN:      { bg: alpha.info15,    color: colors.infoLight,    label: "Open" },
  ASSIGNED:  { bg: alpha.warning15, color: colors.warningLight, label: "Assigned" },
  ENROUTE:   { bg: alpha.warning15, color: colors.warningLight, label: "En Route" },
  DRIVING:   { bg: alpha.primary15, color: colors.primaryLight, label: "In Progress" },
  COMPLETED: { bg: alpha.success15, color: colors.successLight, label: "Completed" },
  CANCELLED: { bg: alpha.danger15,  color: colors.dangerLight,  label: "Cancelled" },
};

// ─── Trip Status Info Banners ─────────────────────────────────────────────────
// Used in Driver active trip card and Rider trip page for status banners.
export const TRIP_STATUS_INFO = {
  // Driver-side labels
  ASSIGNED: {
    icon: "🚗",
    title: "Head to pickup",
    subtitle: "A rider is waiting for you. Drive to the pickup location.",
    color: colors.warningLight,
    bg: alpha.warning10,
    border: alpha.warning25,
  },
  ENROUTE: {
    icon: "📍",
    title: "Arrived at pickup",
    subtitle: "You've arrived. Start the trip once the rider is in the vehicle.",
    color: colors.primaryLight,
    bg: alpha.primary10,
    border: alpha.primary25,
  },
  DRIVING: {
    icon: "🛣️",
    title: "Trip in progress",
    subtitle: "You're driving the rider to their destination.",
    color: colors.successLight,
    bg: alpha.success10,
    border: alpha.success25,
  },
  COMPLETED: {
    icon: "✅",
    title: "Trip completed!",
    subtitle: "Great work. The trip has been completed successfully.",
    color: colors.successLight,
    bg: alpha.success10,
    border: alpha.success25,
  },
  CANCELLED: {
    icon: "❌",
    title: "Trip cancelled",
    subtitle: "This trip was cancelled.",
    color: colors.dangerLight,
    bg: alpha.danger10,
    border: alpha.danger25,
  },
};

// ─── Rider Trip Status Info Banners ───────────────────────────────────────────
// Used in RiderTripPage for the status tracker banner.
export const RIDER_TRIP_STATUS_INFO = {
  REQUESTED: {
    icon: "🔍",
    title: "Looking for a driver...",
    subtitle: "Hang tight! We're finding a designated driver near you.",
    color: colors.infoLight,
    bg: alpha.info10,
    border: alpha.info25,
  },
  ASSIGNED: {
    icon: "🚗",
    title: "Driver assigned!",
    subtitle: "Your driver has accepted the trip and is heading to your pickup location.",
    color: colors.warningLight,
    bg: alpha.warning10,
    border: alpha.warning25,
  },
  ENROUTE: {
    icon: "📍",
    title: "Driver is on the way",
    subtitle: "Your driver is heading to your pickup location. Please be ready!",
    color: colors.warningLight,
    bg: alpha.warning10,
    border: alpha.warning25,
  },
  DRIVING: {
    icon: "🛣️",
    title: "You're on your way!",
    subtitle: "Sit back and relax — your driver is taking you to your destination.",
    color: colors.primaryLight,
    bg: alpha.primary10,
    border: alpha.primary25,
  },
  COMPLETED: {
    icon: "✅",
    title: "You've arrived!",
    subtitle: "Trip completed. Thanks for using Designated Driving.",
    color: colors.successLight,
    bg: alpha.success10,
    border: alpha.success25,
  },
  CANCELLED: {
    icon: "❌",
    title: "Trip cancelled",
    subtitle: "This trip was cancelled.",
    color: colors.dangerLight,
    bg: alpha.danger10,
    border: alpha.danger25,
  },
};
