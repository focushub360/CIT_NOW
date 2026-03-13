import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If we have a token but user/role hasn't resolved yet, don't redirect.
  // This prevents transient redirects to /login on refresh or route changes.
  if (Array.isArray(roles) && roles.length > 0 && !role) {
    return (
      <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Support both wrapper usage (<Route element={<ProtectedRoute/>}><Route .../></Route>)
  // and direct child usage (<ProtectedRoute><Component/></ProtectedRoute>)
  return children ? children : <Outlet />;
}
