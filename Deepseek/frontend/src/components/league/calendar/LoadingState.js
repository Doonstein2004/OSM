import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

/**
 * Componente que muestra un estado de carga
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.message - Mensaje a mostrar (opcional)
 * @returns {JSX.Element} Estado de carga
 */
const LoadingState = ({ message = 'Cargando calendario...' }) => {
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