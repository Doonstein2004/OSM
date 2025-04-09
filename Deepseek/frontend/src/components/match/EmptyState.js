import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Componente para mostrar cuando no hay datos disponibles
 */
const EmptyState = ({ title = 'No hay partidos disponibles para esta liga', subtitle = 'Utiliza la pestaña "Simular" para generar partidos' }) => {
  return (
    <Box sx={{ 
      textAlign: 'center', 
      py: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      color: 'text.secondary'
    }}>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default EmptyState;