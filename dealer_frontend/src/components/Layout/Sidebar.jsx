// src/components/layout/Sidebar.jsx
import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics,
  CloudUpload,
  Assessment,
  Group as PeopleIcon,
  Business
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const SIDEBAR_WIDTH = 280;

const MENU_ITEMS = [
  { text: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { text: 'New Analysis', path: '/new', icon: Analytics },
  { text: 'Bulk Upload', path: '/bulk', icon: CloudUpload },
  { text: 'Results', path: '/results', icon: Assessment },
  { text: 'Team Management', path: '/team', icon: PeopleIcon }
];

export default function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.custom.surface }}>
      {/* Spacer for fixed Navbar */}
      <Box sx={{ minHeight: '70px' }} />
      
      {/* Sidebar Header / Logo area */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: 2, 
          background: theme.custom.gradientPrimary, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Business sx={{ color: '#fff' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.custom.textPrimary, lineHeight: 1.2 }}>
          CitNow<br />Analytics
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, mb: 2, borderColor: theme.custom.border }} />

      <List sx={{ px: 2, flex: 1 }}>
        {MENU_ITEMS.map(({ text, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={RouterLink}
            to={path}
            selected={isActive(path)}
            sx={{
              mb: 1,
              borderRadius: 2.5,
              py: 1.5,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                background: theme.custom.gradientPrimary,
                color: '#fff',
                boxShadow: theme.custom.shadowMd,
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
                '&:hover': {
                  background: theme.custom.gradientPrimary,
                  opacity: 0.9,
                },
              },
              '&:hover': {
                background: theme.custom.primaryUltraLight,
                '& .MuiListItemIcon-root': {
                  color: theme.custom.primary,
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40, 
              color: isActive(path) ? '#fff' : theme.custom.textSecondary 
            }}>
              <Icon />
            </ListItemIcon>
            <ListItemText 
              primary={text} 
              primaryTypographyProps={{ 
                fontWeight: isActive(path) ? 700 : 500,
                fontSize: '0.95rem'
              }} 
            />
          </ListItemButton>
        ))}
      </List>

      {/* Sidebar Footer (Optional) */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 3, 
          background: theme.custom.primaryUltraLight,
          border: `1px solid ${theme.custom.primary}20` 
        }}>
          <Typography variant="caption" fontWeight={700} color={theme.custom.primary} sx={{ display: 'block', mb: 0.5 }}>
            PRO PLAN
          </Typography>
          <Typography variant="body2" color={theme.custom.textSecondary} fontSize="0.75rem">
            Manage your dealership network with elite precision.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) return null; // Mobile drawer is already handled in Navbar

  return (
    <Box
      component="nav"
      sx={{ 
        width: SIDEBAR_WIDTH, 
        flexShrink: 0,
        display: { xs: 'none', md: 'block' }
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': { 
            width: SIDEBAR_WIDTH, 
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.custom.border}`,
            boxShadow: '4px 0 10px rgba(0,0,0,0.02)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
