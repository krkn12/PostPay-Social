import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Carregando...', 
  fullScreen = false,
  color = 'primary'
}) => {
  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    minHeight: 200
  };

  return (
    <Box sx={containerStyles}>
      <CircularProgress 
        size={size} 
        color={color}
        sx={{ mb: 2 }}
      />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          textAlign="center"
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;