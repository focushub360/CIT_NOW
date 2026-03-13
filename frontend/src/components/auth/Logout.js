// src/components/auth/Logout.js
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Logout() {
  const { logout } = useContext(AuthContext);
  
  useEffect(() => {
    logout();
  }, [logout]);
  
  return <Navigate to="/login" replace />;
}
