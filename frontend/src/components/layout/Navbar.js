// src/components/layout/Navbar.jsx
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Dialog,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  Analytics,
  CloudUpload,
  Assessment,
  ExitToApp,
  Person,
  Edit,
  Save,
  Cancel,
  Close,
  Visibility,
  VisibilityOff,
  SmartDisplay,
  SpaceDashboard,
  AddToQueue,
  UploadFile,
  Group,
  Settings,
  ManageAccounts
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';

// Professional BMW Theme Colors
const BMW = {
  primary: '#1C69D4',
  primaryDark: '#0D47A1',
  primaryLight: '#5B9EED',
  primaryUltraLight: '#EBF4FF',
  white: '#FFFFFF',
  background: '#FAFBFC',
  surface: '#F5F7FA',
  border: '#E1E6ED',
  textPrimary: '#0A1929',
  textSecondary: '#3E5060',
  textTertiary: '#6B7A90',
  accent: '#00A5E0',
  success: '#00A86B',
  error: '#D32F2F'
};

// Menu configuration
const ROLE_ACCESS = {
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'User Management', path: '/super-admin/users', icon: Group },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business }
  ],
  dealer_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts }
  ],
  branch_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts }
  ],
  dealer_user: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment }
  ],
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  dealer_admin: 'Dealer Admin',
  branch_admin: 'Branch Admin',
  dealer_user: 'User', // "User" level
};

const ROLE_COLOR = {
  super_admin: BMW.primary,
  dealer_admin: BMW.accent,
  branch_admin: '#8B5CF6',
  dealer_user: BMW.success,
};

export default function Navbar() {
  const { user, role, logout, updateProfile } = useContext(AuthContext);
  const { tasks } = useTasks(); // Access global tasks
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isActive = (p) => location.pathname.startsWith(p);

  const [userAnchor, setUserAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const openUserMenu = (e) => setUserAnchor(e.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  const handleEditClick = () => {
    navigate('/account/profile');
    closeUserMenu();
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: BMW.white }}>
      {/* Drawer Header */}
      <Box sx={{
        p: 3,
        background: BMW.white,
        borderBottom: `1px solid ${BMW.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{
          height: 50,
          width: 50,
          bgcolor: BMW.primary,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 2
        }}>
          <SmartDisplay sx={{ fontSize: 30 }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{
            width: 36,
            height: 36,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'white'
          }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {ROLE_LABEL[role] || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 2 }}>
        {(ROLE_ACCESS[role] || []).map(({ text, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={RouterLink}
            to={path}
            selected={isActive(path)}
            onClick={toggleDrawer}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              '&.Mui-selected': {
                background: BMW.primaryUltraLight,
                color: BMW.primary,
                '& .MuiListItemIcon-root': { color: BMW.primary },
                '&:hover': {
                  background: BMW.primaryUltraLight
                }
              },
              '&:hover': {
                backgroundColor: BMW.surface
              }
            }}
          >
            <ListItemIcon sx={{
              color: isActive(path) ? BMW.primary : BMW.textTertiary,
              minWidth: 40
            }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: isActive(path) ? 600 : 500,
                fontSize: '0.9375rem',
                color: isActive(path) ? BMW.primary : BMW.textPrimary
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Main AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: BMW.white,
          borderBottom: `1px solid ${BMW.border}`,
          zIndex: theme.zIndex.drawer + 1,
          width: { md: `calc(100% - 240px)` },
          ml: { md: `240px` }
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          minHeight: { xs: '64px', sm: '72px' },
          px: { xs: 2, sm: 3 }
        }}>
          {/* Left: Menu Toggle (Mobile Only) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: BMW.textPrimary,
                  '&:hover': { background: BMW.surface }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* Center: Desktop Navigation - NOW REMOVED (Horizontal items are in Sidebar) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, ml: 4 }}>
               <Typography variant="h6" sx={{ 
                 fontWeight: 700, 
                 color: BMW.textPrimary,
                 letterSpacing: '-0.5px'
               }}>
                 {ROLE_ACCESS[role]?.find(m => isActive(m.path))?.text || 'CitNow Analyzer'}
               </Typography>
            </Box>
          )}

          {/* Right: Role + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

            {/* Global Task Indicator */}
            {tasks && tasks.filter(t => ['pending', 'processing'].includes(t.status)).length > 0 && (
              <Chip
                icon={<CircularProgress size={16} color="inherit" />}
                label={`Processing (${tasks.filter(t => ['pending', 'processing'].includes(t.status)).length})`}
                size="small"
                sx={{
                  background: BMW.primaryUltraLight,
                  color: BMW.primary,
                  borderColor: BMW.primary,
                  fontWeight: 600,
                  border: `1px solid ${BMW.primary}40`,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  }
                }}
                onClick={() => navigate((role === 'dealer_admin' || role === 'branch_admin') ? '/dealer/new' : '/dealer/dashboard')}
              />
            )}

            {/* Username + Role Label */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end', mr: 0.5 }}>
              <Typography variant="body2" sx={{
                fontWeight: 600,
                color: BMW.textPrimary,
                lineHeight: 1.3,
                fontSize: '0.875rem'
              }}>
                {user?.username || 'User'}
              </Typography>
              <Typography variant="caption" sx={{
                fontWeight: 600,
                color: ROLE_COLOR[role] || BMW.primary,
                lineHeight: 1.2,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {ROLE_LABEL[role] || 'User'}
              </Typography>
            </Box>

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton
                onClick={openUserMenu}
                sx={{
                  p: 0.5,
                  border: `2px solid ${ROLE_COLOR[role] || BMW.border}30`,
                  '&:hover': {
                    borderColor: ROLE_COLOR[role] || BMW.primary,
                    background: BMW.primaryUltraLight
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: ROLE_COLOR[role] || BMW.primary,
                    fontWeight: 700,
                    fontSize: '15px'
                  }}
                >
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={closeUserMenu}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            border: `1px solid ${BMW.border}`,
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color={BMW.textPrimary}>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color={BMW.textSecondary}>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Divider />

        {/* Edit Profile Menu Item */}
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: BMW.textPrimary,
            py: 1.5,
            '&:hover': {
              background: BMW.surface
            }
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: BMW.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Edit Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => { closeUserMenu(); logout(); }}
          sx={{
            color: BMW.textPrimary,
            py: 1.5,
            '&:hover': {
              background: BMW.surface
            }
          }}
        >
          <ListItemIcon>
            <ExitToApp fontSize="small" sx={{ color: BMW.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Logout</Typography>
        </MenuItem>
      </Menu>



      {/* Toolbar spacer */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }} />
    </>
  );
}

// Navigation Button Component
function NavButton({ to, icon: Icon, active, children }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2.5,
          py: 1.25,
          borderRadius: 50,
          color: active ? BMW.primary : BMW.textSecondary,
          background: active ? BMW.white : 'transparent',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: active ? BMW.white : 'rgba(255,255,255,0.5)',
            color: BMW.primary,
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'scale(0.98)'
          }
        }}
      >
        {Icon && <Icon sx={{
          fontSize: 20,
          transition: 'transform 0.3s ease',
          transform: active ? 'scale(1.1)' : 'scale(1)'
        }} />}
        <Typography variant="body2" fontWeight={active ? 700 : 600} sx={{ letterSpacing: '0.01em' }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
