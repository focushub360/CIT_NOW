// src/components/layout/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFBFC' }}>
      {/* 🚀 Sidebar on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 }, 
            mt: { xs: '64px', sm: '72px' }, // Offset for fixed Navbar
            width: '100%',
            maxWidth: '1800px',
            mx: 'auto'
          }}
        >
          {children}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}