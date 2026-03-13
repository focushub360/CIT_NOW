// src/App.jsx
import React from 'react';
// 👇 1. Import BrowserRouter and alias it as Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme.jsx'; 
import AuthProvider from './contexts/AuthContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'; 
import LoginPage from './pages/Loginpage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewAnalysis from './pages/NewAnalysis.jsx';
import BulkUpload from './pages/BulkUpload.jsx';
import Results from './pages/Results.jsx';
import TeamManagement from './pages/TeamManagement.jsx';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/new" element={<Layout><NewAnalysis /></Layout>} />
              <Route path="/bulk" element={<Layout><BulkUpload /></Layout>} />
              <Route path="/results" element={<Layout><Results /></Layout>} />
              <Route path="/team" element={<Layout><TeamManagement /></Layout>} />
              
              {/* Redirect the root path to the default page for a logged-in user */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Any other unknown path redirects to the login or main page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
