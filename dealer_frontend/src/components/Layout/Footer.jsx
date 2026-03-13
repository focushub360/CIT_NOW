// src/components/layout/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Twitter,
  GitHub
} from '@mui/icons-material';

const MODERN_BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  accent: '#FF6D00',
  accentLight: '#FF9D45',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: MODERN_BMW_THEME.surface,
        borderTop: `1px solid ${MODERN_BMW_THEME.border}`,
        mt: 'auto',
        py: 4 // Reduced from py: 6
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content - More Compact */}
        <Grid container spacing={3}> {/* Reduced from spacing={4} */}
          {/* Brand Section - More Compact */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}> {/* Reduced from mb: 3 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}> {/* Reduced from mb: 2 */}
                <Box sx={{
                  width: 36, // Slightly smaller
                  height: 36,
                  borderRadius: 2,
                  background: MODERN_BMW_THEME.gradientPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5 // Reduced from mr: 2
                }}>
                  <Business sx={{ fontSize: 20, color: '#fff' }} /> {/* Smaller icon */}
                </Box>
                <Typography
                  variant="h6" // Changed from h5 to h6
                  sx={{
                    fontWeight: 700,
                    background: MODERN_BMW_THEME.gradientPrimary,
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  CITNOW Analytics
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ 
                color: MODERN_BMW_THEME.textSecondary,
                lineHeight: 1.5, // Tighter line height
                mb: 2, // Reduced from mb: 3
                fontSize: '0.875rem' // Slightly smaller text
              }}>
                Advanced video analysis platform for comprehensive quality assessment and performance analytics.
              </Typography>
            </Box>

            {/* Social Links */}
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  background: MODERN_BMW_THEME.primaryUltraLight,
                  color: MODERN_BMW_THEME.primary,
                  '&:hover': {
                    background: MODERN_BMW_THEME.primary,
                    color: '#fff'
                  }
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  background: MODERN_BMW_THEME.primaryUltraLight,
                  color: MODERN_BMW_THEME.primary,
                  '&:hover': {
                    background: MODERN_BMW_THEME.primary,
                    color: '#fff'
                  }
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  background: MODERN_BMW_THEME.primaryUltraLight,
                  color: MODERN_BMW_THEME.primary,
                  '&:hover': {
                    background: MODERN_BMW_THEME.primary,
                    color: '#fff'
                  }
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

        

       

          {/* Contact Information - More Compact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ // Changed from h6 to subtitle2
              fontWeight: 600, 
              color: MODERN_BMW_THEME.textPrimary,
              mb: 1.5, // Reduced from mb: 2
              fontSize: '0.9rem'
            }}>
              Contact
            </Typography>
            <Stack spacing={1.5}> {/* Reduced from spacing={2} */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn sx={{ 
                  color: MODERN_BMW_THEME.primary, 
                  mr: 1.5, // Reduced from mr: 2
                  fontSize: 18, // Smaller icon
                  mt: 0.25 // Align better with text
                }} />
                <Typography variant="body2" sx={{ 
                  color: MODERN_BMW_THEME.textSecondary,
                  fontSize: '0.875rem' // Smaller text
                }}>
                  FocusEngineering, Gudiyatham, Tamil Nadu, India - 632602 
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ 
                  color: MODERN_BMW_THEME.primary, 
                  mr: 1.5, // Reduced from mr: 2
                  fontSize: 18 // Smaller icon
                }} />
                <Link
                  href="mailto:support@bmw-analytics.com"
                  variant="body2"
                  sx={{
                    color: MODERN_BMW_THEME.textSecondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem', // Smaller text
                    '&:hover': {
                      color: MODERN_BMW_THEME.primary
                    }
                  }}
                >
                  info@focusengineering.in
                   
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: MODERN_BMW_THEME.borderLight }} /> {/* Reduced from my: 4 */}

        {/* Bottom Section - More Compact */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ 
            color: MODERN_BMW_THEME.textTertiary,
            textAlign: isMobile ? 'center' : 'left',
            width: isMobile ? '100%' : 'auto',
            fontSize: '0.875rem' // Smaller text
          }}>
            © {currentYear} FocusEngineering All rights reserved.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, // Reduced from gap: 3
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            {[
              'Privacy',
              'Terms',
              'Cookies',
              'Security'
            ].map((item) => (
              <Link
                key={item}
                href="#"
                variant="body2"
                sx={{
                  color: MODERN_BMW_THEME.textTertiary,
                  textDecoration: 'none',
                  fontSize: '0.875rem', // Smaller text
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: MODERN_BMW_THEME.primary
                  }
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Version Info - More Compact */}
        <Box sx={{ 
          mt: 2, // Reduced from mt: 3
          textAlign: 'center'
        }}>
          <Typography variant="caption" sx={{ 
            color: MODERN_BMW_THEME.textTertiary,
            fontSize: '0.7rem' // Smaller text
          }}>
            v2.1.0 • React & FastAPI • UnifiedMediaAnalyzer
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}