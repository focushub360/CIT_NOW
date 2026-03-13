// src/styles/theme.jsx
import { createTheme } from '@mui/material/styles';

// Define your theme constants in one place
export const BMW_THEME = {
  // Primary Blues (BMW-inspired)
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  
  // Accent & Secondary
  accent: '#FF6D00',
  accentLight: '#FF9D45',
  
  // Neutrals
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)',
  
  // Shadows
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

// Create an MUI theme using these constants
const theme = createTheme({
  palette: {
    primary: {
      main: BMW_THEME.primary,
    },
    secondary: {
      main: BMW_THEME.accent,
    },
    error: {
      main: BMW_THEME.error,
    },
    // You can extend the palette as needed
  },
  // We can attach our custom constants to the theme for easy access
  custom: {
    ...BMW_THEME,
  },
});

export default theme;
