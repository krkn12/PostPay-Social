import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
// import Sidebar removido
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  // Sidebar removido

  // Funções de sidebar removidas

  // Determinar se deve mostrar a sidebar (apenas para usuários autenticados)
  // showSidebar removido

  // Sidebar removida, não usar DRAWER_WIDTH ou sidebarWidth

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Conteúdo da página */}
        <Box sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;