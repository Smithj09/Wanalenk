/**
 * WanaLenk Color System
 * Uniform color scheme for the entire platform
 */

export const COLORS = {
  // Primary Brand Colors (from logo)
  primary: {
    navy: '#00235b',     // Deep Navy
    orange: '#f97316',   // Sunset Orange
  },
  
  // Semantic Colors
  semantic: {
    success: '#10b981',   // Emerald Green
    warning: '#f59e0b',   // Amber Yellow
    error: '#ef4444',     // Red
    info: '#3b82f6',      // Blue
  },
  
  // Neutral Colors
  neutral: {
    50: '#f8fafc',        // Lightest
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',       // Darkest
  },
  
  // Background Colors
  background: {
    light: '#ffffff',
    dark: '#0f172a',
    subtle: '#f8fafc',
    muted: '#f1f5f9',
  },
  
  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    inverted: '#ffffff',
    disabled: '#94a3b8',
  },
  
  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
    focus: '#3b82f6',
  },
} as const;

export type ColorPalette = typeof COLORS;