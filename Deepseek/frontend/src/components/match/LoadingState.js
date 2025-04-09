import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

/**
 * Componente para mostrar el estado de carga
 */
const LoadingState = ({ message = 'Cargando partidos...' }) => {
  return (
    <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
      <LinearProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;