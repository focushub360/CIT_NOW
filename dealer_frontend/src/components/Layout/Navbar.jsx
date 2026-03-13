// src/components/layout/Navbar.jsx
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
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
  Button,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  Menu as MenuIcon,
  Analytics,
  CloudUpload,
  Assessment,
  ExitToApp,
  Business,
  Edit,
  Save,
  Cancel,
  Close,
  Visibility,
  VisibilityOff,
  Group as PeopleIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

// --- Menu items for dealer_user ---
const MENU_ITEMS = [
  { text: 'Dashboard',    path: '/dashboard', icon: Business },
  { text: 'New Analysis', path: '/new',       icon: Analytics },
  { text: 'Bulk Upload',  path: '/bulk',      icon: CloudUpload },
  { text: 'Results',      path: '/results',   icon: Assessment },
  { text: 'Team Management', path: '/team',    icon: PeopleIcon }
];

export default function Navbar() {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const location = useLocation();
  const [userAnchor, setUserAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editBoxOpen, setEditBoxOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const theme = useTheme(); 
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => location.pathname.startsWith(path);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const openUserMenu = (e) => setUserAnchor(e.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleEditClick = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setEditBoxOpen(true);
    closeUserMenu();
  };

  const handleEditChange = (field) => (e) => {
    setEditForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!editForm.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!editForm.email.trim()) {
      setError('Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation if passwords are provided
    if (editForm.newPassword || editForm.confirmPassword) {
      if (editForm.newPassword !== editForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (editForm.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
      };

      // Only include new password if provided
      if (editForm.newPassword) {
        updateData.new_password = editForm.newPassword;
      }

      await updateProfile(updateData);
      
      setSuccess('Profile updated successfully!');
      
      // Close box after success message
      setTimeout(() => {
        setEditBoxOpen(false);
        setEditForm({
          username: '',
          email: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBoxOpen(false);
    setEditForm({
      username: '',
      email: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

const drawer = (
  <Box sx={{ width: 280, height: '100%', background: theme.custom.surface }}>
    <Box sx={{ p: 3, background: theme.custom.gradientPrimary, color: '#fff' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {/* ✅ Show dealership name in mobile drawer */}
        {user?.showroom_name || 'CITNOW Analytics'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
          {(user?.username || 'U').charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{user?.username || 'User'}</Typography>
          <Chip label="Dealer User" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}/>
        </Box>
      </Box>
    </Box>
    
    <List sx={{ p: 2 }}>
      {MENU_ITEMS.map(({ text, path, icon: Icon }) => (
        <ListItemButton 
          key={path} 
          component={RouterLink} 
          to={path} 
          selected={isActive(path)} 
          onClick={toggleDrawer} 
          sx={{ 
            mb: 1, 
            borderRadius: 2, 
            '&.Mui-selected': { 
              background: theme.custom.gradientPrimary, 
              color: '#fff', 
              '& .MuiListItemIcon-root': { color: '#fff' } 
            } 
          }}
        >
          <ListItemIcon sx={{ color: isActive(path) ? '#fff' : theme.custom.textSecondary }}>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ background: theme.custom.background, borderBottom: `1px solid ${theme.custom.border}`, zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  {isMobile && <IconButton onClick={toggleDrawer} sx={{ color: theme.custom.textPrimary }}><MenuIcon /></IconButton>}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box sx={{ width: 32, height: 32, borderRadius: 2, background: theme.custom.gradientPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Business sx={{ fontSize: 18, color: '#fff' }} />
    </Box>
    <Box>
      <Typography variant="h5" sx={{ 
        fontWeight: 700, 
        background: theme.custom.gradientPrimary, 
        backgroundClip: 'text', 
        WebkitBackgroundClip: 'text', 
        color: 'transparent',
        lineHeight: 1.2
      }}>
        {/* ✅ Show dealership showroom name */}
        {user?.showroom_name || 'Dealer Portal'}
      </Typography>
      <Typography variant="caption" sx={{ 
        color: theme.custom.textSecondary,
        fontWeight: 500,
        display: { xs: 'none', sm: 'block' }
      }}>
        Powered by FOCUS
      </Typography>
    </Box>
  </Box>
</Box>

          {/* Breadcrumb or Page Title area here if needed */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' }, ml: 4 }}>
             <Typography variant="h6" sx={{ fontWeight: 600, color: theme.custom.textSecondary }}>
                {MENU_ITEMS.find(m => isActive(m.path))?.text || 'CitNow Analyzer'}
             </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip 
              label="Dealer User" 
              size="small" 
              sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                background: `${theme.custom.success}15`, 
                color: theme.custom.success, 
                fontWeight: 700 
              }}
            />
            <Tooltip title="Account">
              <IconButton onClick={openUserMenu}>
                <Avatar sx={{ width: 36, height: 36, background: theme.custom.gradientPrimary }}>
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer} sx={{ '& .MuiDrawer-paper': { width: 280, border: 'none' } }}>
        {drawer}
      </Drawer>

      {/* User Menu with Edit Profile Option */}
      <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={closeUserMenu}>
        <MenuItem disabled>
          <Typography variant="body2" fontWeight={600}>{user?.username || 'User'}</Typography>
        </MenuItem>
        <Divider />
        
        {/* Edit Profile Menu Item */}
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: theme.custom.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2">Edit Profile</Typography>
        </MenuItem>
        
        <MenuItem onClick={() => { closeUserMenu(); logout(); }} sx={{ color: theme.custom.error }}>
          <ListItemIcon>
            <ExitToApp fontSize="small" sx={{ color: theme.custom.error }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Compact Edit Profile Box (Top-Right Corner) */}
      <Fade in={editBoxOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            top: 80,
            right: 16,
            width: 320,
            maxWidth: '90vw',
            borderRadius: 2,
            border: `1px solid ${theme.custom.border}`,
            background: theme.custom.background,
            zIndex: theme.zIndex.modal,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            background: theme.custom.surface,
            borderBottom: `1px solid ${theme.custom.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="subtitle1" fontWeight={600} color={theme.custom.textPrimary}>
              Edit Profile
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleCancelEdit}
              disabled={loading}
              sx={{ 
                color: theme.custom.textTertiary,
                '&:hover': { 
                  background: 'rgba(0,0,0,0.04)',
                  color: theme.custom.textPrimary
                }
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Content */}
          <Box sx={{ p: 2.5 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
                {success}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Username */}
              <TextField
                label="Username"
                value={editForm.username}
                onChange={handleEditChange('username')}
                fullWidth
                size="small"
                disabled={loading}
              />
              
              {/* Email */}
              <TextField
                label="Email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange('email')}
                fullWidth
                size="small"
                disabled={loading}
              />
              
              {/* New Password with Eye Icon */}
              <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={editForm.newPassword}
                onChange={handleEditChange('newPassword')}
                fullWidth
                size="small"
                disabled={loading}
                placeholder="Leave empty to keep current password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Confirm Password with Eye Icon */}
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={editForm.confirmPassword}
                onChange={handleEditChange('confirmPassword')}
                fullWidth
                size="small"
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Actions */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: 3,
              justifyContent: 'flex-end'
            }}>
              <Button
                onClick={handleCancelEdit}
                size="small"
                disabled={loading}
                sx={{ 
                  color: theme.custom.textSecondary,
                  borderRadius: 1,
                  px: 2,
                  '&:hover': {
                    background: theme.custom.surface
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                size="small"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} /> : <Save />}
                sx={{
                  background: theme.custom.primary,
                  borderRadius: 1,
                  px: 2,
                  '&:hover': {
                    background: theme.custom.primaryDark
                  },
                  '&.Mui-disabled': {
                    background: theme.custom.textTertiary
                  }
                }}
              >
                {loading ? 'Saving' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>

      <Toolbar sx={{ minHeight: '70px !important' }} />
    </>
  );
}
