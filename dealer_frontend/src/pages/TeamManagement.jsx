// src/pages/TeamManagement.jsx
import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Box,
  Chip,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Alert,
  InputAdornment,
  Fade,
  Container,
  Divider,
  LinearProgress,
  Snackbar,
  useTheme
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  Search,
  Group,
  Email,
  Badge,
  Refresh,
  Shield,
  Visibility,
  VisibilityOff,
  Business,
  ContentCopy,
  Link,
  Close,
  Phone
} from '@mui/icons-material';
import { listMyDealerUsers, createDealerUser, updateDealerUser, deleteDealerUser } from '../Services/dealer_user';
import { AuthContext } from '../contexts/AuthContext';

// User Card Component
const UserCard = ({ user, onEdit, onDelete, theme }) => (
  <Fade in={true}>
    <Card sx={{
      background: theme.custom.surfaceElevated,
      border: `1px solid ${theme.custom.border}`,
      borderRadius: 3,
      boxShadow: theme.custom.shadowSm,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: theme.custom.shadowMd,
        transform: 'translateY(-2px)',
        borderColor: theme.custom.primaryLight
      },
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: theme.custom.gradientPrimary,
              fontWeight: 600,
              fontSize: '18px',
              mr: 2
            }}
          >
            {(user.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{
              color: theme.custom.textPrimary,
              fontWeight: 600,
              mb: 0
            }}>
              {user.username}
            </Typography>
            {user.job_title && (
              <Typography variant="caption" sx={{
                color: theme.custom.textSecondary,
                fontWeight: 500,
                display: 'block',
                mb: 0.5
              }}>
                {user.job_title}
              </Typography>
            )}
            <Chip
              label={
                user.role === 'dealer_admin' ? 'Dealer Admin' :
                  user.role === 'branch_admin' ? 'Branch Admin' :
                    'Advisor'
              }
              size="small"
              sx={{
                background: user.role === 'dealer_admin' ? theme.custom.accent :
                  user.role === 'branch_admin' ? theme.custom.warning :
                    theme.custom.primary,
                color: user.role === 'dealer_admin' || user.role === 'branch_admin' ? theme.custom.textPrimary : 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                maxWidth: '100%',
                height: 'auto',
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                  padding: '4px 8px'
                }
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.custom.borderLight, mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email sx={{ fontSize: 18, color: theme.custom.textSecondary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{
                color: theme.custom.textSecondary,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}>
                CONTACT
              </Typography>
              <Typography variant="body2" sx={{
                color: theme.custom.textPrimary,
                fontWeight: 500,
                wordBreak: 'break-word'
              }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ fontSize: 18, color: theme.custom.textSecondary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{
                color: theme.custom.textSecondary,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}>
                PHONE
              </Typography>
              <Typography variant="body2" sx={{
                color: theme.custom.textPrimary,
                fontWeight: 600,
              }}>
                {user.phone_number || '—'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.custom.borderLight, mb: 3 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{
            color: theme.custom.textTertiary,
            fontStyle: 'italic'
          }}>
            Created {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit User">
              <IconButton
                size="small"
                onClick={() => onEdit(user)}
                sx={{
                  color: theme.custom.primary,
                  background: `${theme.custom.primary}08`,
                  '&:hover': {
                    background: `${theme.custom.primary}15`
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton
                size="small"
                onClick={() => onDelete(user._id || user.id)}
                sx={{
                  color: theme.custom.error,
                  background: `${theme.custom.error}08`,
                  '&:hover': {
                    background: `${theme.custom.error}15`
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

export default function TeamManagement() {
  const theme = useTheme();
  const { user: authUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'dealer_user',
    dealer_id: authUser?.dealer_id || '',
    job_title: '',
    phone_number: ''
  });

  // Show success message
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  // Close success message
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listMyDealerUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [authUser]);

  useEffect(() => {
    if (!open) {
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'dealer_user',
        dealer_id: authUser?.dealer_id || '',
        job_title: '',
        phone_number: ''
      });
      setEditingUser(null);
      setError('');
      setShowPassword(false);
    }
  }, [open, authUser]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: '', // Password is empty on edit by default
      role: user.role,
      dealer_id: user.dealer_id,
      job_title: user.job_title || '',
      phone_number: user.phone_number || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteDealerUser(id);
      await load();
      showSuccessMessage('User deleted successfully!');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!editingUser && !form.password) {
      setError('Password is required for new users');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingUser) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateDealerUser(editingUser._id || editingUser.id, payload);
        showSuccessMessage('User updated successfully!');
      } else {
        await createDealerUser(form);
        showSuccessMessage('User created successfully!');
      }
      setOpen(false);
      await load();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.detail || 'Failed to save user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ py: 4 }}>
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.custom.textPrimary, mb: 2 }}>
          Team Management
        </Typography>
        <Typography variant="h6" sx={{ color: theme.custom.textSecondary, mb: 4, fontWeight: 400 }}>
          Manage your dealership team members and access permissions.
        </Typography>
      </Box>

      {/* Action Bar */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, border: `1px solid ${theme.custom.border}`, boxShadow: 'none' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.custom.textTertiary }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button startIcon={<Refresh />} onClick={load} variant="outlined" sx={{ borderRadius: 2 }}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ background: theme.custom.gradientPrimary, borderRadius: 2, px: 3, fontWeight: 600 }}
            >
              Add Member
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <LinearProgress sx={{ borderRadius: 2, mb: 4 }} />
      ) : filteredUsers.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px solid ${theme.custom.border}`, boxShadow: 'none' }}>
          <Group sx={{ fontSize: 60, color: theme.custom.textTertiary, mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="textSecondary">No team members found</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} lg={4} key={user._id || user.id}>
              <UserCard user={user} onEdit={handleEdit} onDelete={handleDelete} theme={theme} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, p: 3 }}>
          {editingUser ? 'Edit Member' : 'Add New Member'}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Full Name"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Email" type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Job Title (e.g. Service Advisor)"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Phone Number"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ fontWeight: 700, borderRadius: 2 }}>
            {editingUser ? 'Save Changes' : 'Create Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
