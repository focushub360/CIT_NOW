import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import { Business, Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const usernameRef = useRef(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (isAuthenticated) navigate('/new', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameFromUrl = params.get('username');
    if (usernameFromUrl) setUsername(usernameFromUrl);
  }, [location.search]);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showSnackbar('Please enter both username and password.', 'warning');
      return;
    }

    try {
      const ok = await login(username.trim(), password);
      if (ok) {
        showSnackbar('Login successful! Redirecting...', 'success');
      } else {
        showSnackbar('Invalid username or password.', 'error');
      }
    } catch (err) {
      showSnackbar(err.message || 'Login failed. Try again.', 'error');
    }
  };

  return (
    <Box
  sx={{
    position: 'fixed',         // Ensure full-screen takeover
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #E8F1FD 0%, #FFFFFF 100%)',
    overflow: 'hidden',
  }}
>

      <Fade in timeout={500}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 420,
            borderRadius: 4,
            border: `1px solid ${BMW_THEME.border}`,
            boxShadow: BMW_THEME.shadowLg,
            background: BMW_THEME.background,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: 3,
                background: BMW_THEME.gradientPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Business sx={{ fontSize: 34, color: '#fff' }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: BMW_THEME.textPrimary, mb: 0.5 }}
            >
              Dealer-User Portal
            </Typography>

            <Typography variant="body2" sx={{ color: BMW_THEME.textSecondary }}>
              Sign in to access your dashboard
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              inputRef={usernameRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: BMW_THEME.primary,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: BMW_THEME.textSecondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: BMW_THEME.primary,
                  },
                },
              }}
            />

            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 600,
                borderRadius: 2,
                fontSize: '1rem',
                background: BMW_THEME.gradientPrimary,
                boxShadow: BMW_THEME.shadowMd,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: BMW_THEME.shadowLg,
                },
                '&:disabled': {
                  background: BMW_THEME.border,
                  color: BMW_THEME.textTertiary,
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
