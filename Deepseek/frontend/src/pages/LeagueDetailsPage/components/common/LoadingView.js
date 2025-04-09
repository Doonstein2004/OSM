import React from 'react';
import { Container, CircularProgress, Typography } from '@mui/material';

const LoadingView = () => {
  return (
    <Container maxWidth="lg" sx={{ 
      py: 8, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh' 
    }}>
      <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary">Cargando datos de la liga...</Typography>
    </Container>
  );
};

export default LoadingView;