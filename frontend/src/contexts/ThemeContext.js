import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { settingsApi } from '../services/settingsApi';
import { AuthContext } from './AuthContext';

const ThemeContext = createContext();

export const ThemeSettingsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const defaultSettings = useMemo(() => ({
    accent_color: '#1C69D4',
    dark_mode: false,
    theme_preset: 'bmw',
    dealer_name: 'BMW Service Center',
    brand: 'Multi Franchise',
    custom_content_html: '',
    website_links: {
      dealer_website: '',
      facebook: '',
      instagram: '',
      youtube: '',
    },
    logo_light_url: null,
    logo_dark_url: null
  }), []);

  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const data = await settingsApi.getThemeSettings();
      setSettings((prev) => ({ ...prev, ...(data || {}) }));
    } catch (err) {
      console.error('Failed to load theme settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const updateSettings = async (newSettings) => {
    try {
      await settingsApi.updateThemeSettings(newSettings);
      setSettings((prev) => ({ ...prev, ...(newSettings || {}) }));
      return true;
    } catch (err) {
      console.error('Failed to update theme settings', err);
      return false;
    }
  };

  const theme = useMemo(() => {
    const primaryColor = settings?.accent_color || defaultSettings.accent_color;
    
    return createTheme({
      palette: {
        mode: settings?.dark_mode ? 'dark' : 'light',
        primary: {
          main: primaryColor,
          contrastText: '#FFFFFF',
        },
        background: {
          default: settings?.dark_mode ? '#121212' : '#F8FAFC',
          paper: settings?.dark_mode ? '#1E1E1E' : '#FFFFFF',
        },
      },
      typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
            },
            contained: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: settings?.dark_mode 
                ? '0 4px 20px rgba(0,0,0,0.4)' 
                : '0 4px 20px rgba(0,0,0,0.05)',
              border: `1px solid ${settings?.dark_mode ? '#333' : '#E2E8F0'}`,
            },
          },
        },
      },
    });
  }, [settings, defaultSettings]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, loading, refreshSettings: fetchSettings }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeSettings = () => useContext(ThemeContext);
