// src/pages/dealer-admin/ChangePassword.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { Save, Lock } from '@mui/icons-material';

const BMW = {
  primary: '#1C69D4',
  primaryDark: '#0D47A1',
  border: '#E1E6ED',
  textPrimary: '#0A1929',
};

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder logic
    setSuccess(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: BMW.textPrimary }}>
        Change Password
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${BMW.border}`, boxShadow: 'none' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          To ensure account security, please use a strong password with a mix of letters, numbers, and symbols.
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Password updated successfully!</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              required
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              required
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            
            <Divider sx={{ my: 1 }} />

            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ 
                py: 1.5, 
                borderRadius: 2, 
                bgcolor: BMW.primary,
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { bgcolor: BMW.primaryDark }
              }}
            >
              Update Password
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
