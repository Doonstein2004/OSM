import React from 'react';
import { LinearProgress, Paper, Box, Typography } from '@mui/material';

/**
 * Componente que muestra un estado de carga para la tabla de posiciones
 */
const LoadingState = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Tabla de Posiciones
      </Typography>
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Cargando tabla de posiciones...
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoadingState;