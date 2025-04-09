import React from 'react';
import { Paper, CircularProgress, Typography } from '@mui/material';

/**
 * Componente para mostrar el estado de carga
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.message - Mensaje a mostrar (opcional)
 * @returns {JSX.Element} Estado de carga
 */
const LoadingState = ({ message = 'Cargando ligas...' }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>{message}</Typography>
    </Paper>
  );
};

export default LoadingState;