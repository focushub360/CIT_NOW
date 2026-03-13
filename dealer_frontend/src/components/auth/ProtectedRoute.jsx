// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = React.useContext(AuthContext);
  const location = useLocation();

  // 🌀 Show a small loader while auth state is being verified
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f9f9f9'
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // 🚫 Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🚷 Role restriction (if defined)
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If everything is fine, render the requested route
  return children ? children : <Outlet />;
}
