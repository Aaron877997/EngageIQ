/**
 * Design System Constants
 * Centralized configuration for colors, spacing, and sizing
 */

export const COLORS = {
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    lighter: '#93c5fd',
    dark: '#1e40af',
  },
  secondary: {
    main: '#8b5cf6',
    light: '#a78bfa',
    dark: '#6d28d9',
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  error: '#ef4444',

  background: {
    primary: '#070b14',
    secondary: '#0f172a',
    glass: 'rgba(255, 255, 255, 0.06)',
  },

  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    muted: '#64748b',
  },

  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
};

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

export const BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

export const SHADOWS = {
  sm: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
  lg: '0 20px 30px -3px rgba(0, 0, 0, 0.5)',
  glow: '0 0 20px rgba(59, 130, 246, 0.5)',
};

export const TRANSITIONS = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
};

export const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
};

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};

export const Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 1000,
  tooltip: 1001,
  notification: 2000,
};

export const ANIMATION = {
  spinDuration: '0.8s',
  slideDuration: '0.3s',
  fadeDuration: '0.3s',
};
