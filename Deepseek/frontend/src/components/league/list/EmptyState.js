import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { SportsSoccer as SoccerIcon } from '@mui/icons-material';

/**
 * Componente para mostrar cuando no hay ligas disponibles
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onCreateLeague - Función para ir a crear liga
 * @returns {JSX.Element} Estado vacío
 */
const EmptyState = ({ onCreateLeague }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        No hay ligas creadas
      </Typography>
      <Button 
        variant="contained" 
        onClick={onCreateLeague}
        startIcon={<SoccerIcon />}
      >
        Crear Nueva Liga
      </Button>
    </Paper>
  );
};

export default EmptyState;