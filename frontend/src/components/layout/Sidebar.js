// src/components/layout/Sidebar.js
import React, { useContext, useState, useEffect } from 'react';
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
  useMediaQuery,
  Collapse
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  SpaceDashboard,
  AddToQueue,
  UploadFile,
  Assessment,
  ManageAccounts,
  Group,
  Business,
  Settings,
  Person,
  HelpCenter,
  ContactSupport,
  VpnKey,
  ExitToApp,
  Palette
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const SIDEBAR_WIDTH = 240;

// Sidebar now uses MUI theme palette dynamically

const ROLE_ACCESS = {
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'User Management', path: '/super-admin/users', icon: Group },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
  dealer_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
  branch_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
  dealer_user: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
};

// Sub-component for individual Sidebar Items
function SidebarItem({ item, isActive, currentPath }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const [open, setOpen] = useState(hasSubItems && currentPath.startsWith(item.path));

  useEffect(() => {
    if (hasSubItems && currentPath.startsWith(item.path)) {
      setOpen(true);
    }
  }, [currentPath, item.path, hasSubItems]);

  const handleToggle = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      setOpen(!open);
    }
  };

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  const Icon = item.icon;

  return (
    <React.Fragment>
      <ListItemButton
        component="div"
        onClick={(e) => {
          if (hasSubItems) {
            handleToggle(e);
            handleNavigate(item.subItems?.[0]?.path || item.path);
            return;
          }
          handleNavigate(item.path);
        }}
        selected={!hasSubItems && isActive(item.path)}
        sx={{
          mb: 0.5,
          borderRadius: 1.5,
          py: 0.8,
          px: 1.5,
          transition: 'all 0.2s',
          '&.Mui-selected': {
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '& .MuiListItemIcon-root': { color: theme.palette.primary.contrastText },
            '&:hover': { background: theme.palette.primary.dark },
          },
          '&:hover': {
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(28, 105, 212, 0.08)',
            '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 32, 
          color: (!hasSubItems && isActive(item.path)) ? theme.palette.primary.contrastText : theme.palette.text.secondary 
        }}>
          <Icon sx={{ fontSize: 18 }} />
        </ListItemIcon>
        <ListItemText 
          primary={item.text} 
          primaryTypographyProps={{ 
            fontWeight: (!hasSubItems && isActive(item.path)) ? 700 : 500,
            fontSize: '0.825rem'
          }} 
        />
        {hasSubItems && (open ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />)}
      </ListItemButton>

      {hasSubItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {item.subItems.map((sub) => {
              const SubIcon = sub.icon;
              return (
                <ListItemButton
                  key={sub.path}
                  component="div"
                  onClick={() => handleNavigate(sub.path)}
                  selected={isActive(sub.path)}
                  sx={{
                    mb: 0.5,
                    borderRadius: 1.5,
                    py: 0.6,
                    px: 1.5,
                    '&.Mui-selected': {
                      background: 'transparent',
                      color: theme.palette.primary.main,
                      '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                      '& .MuiTypography-root': { fontWeight: 700 }
                    },
                    '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(28, 105, 212, 0.04)' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28, color: isActive(sub.path) ? theme.palette.primary.main : theme.palette.text.secondary }}>
                    <SubIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={sub.text} 
                    primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: isActive(sub.path) ? 700 : 500 }} 
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}

export default function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const { role } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);
  const menuItems = ROLE_ACCESS[role] || [];

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px' }}>
        <img src="/citnow-logo.png" alt="CitNow" style={{ width: '100%', maxWidth: '160px', height: 'auto', objectFit: 'contain' }} />
      </Box>

      <Divider sx={{ mx: 2, mb: 2, opacity: 0.5 }} />

      <List sx={{ px: 2, flex: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} isActive={isActive} currentPath={location.pathname} />
        ))}
      </List>


    </Box>
  );

  if (isMobile) return null;

  return (
    <Box component="nav" sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
