import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SportsSoccer as SoccerIcon, Add as AddIcon } from '@mui/icons-material';

/**
 * Componente que muestra un estado vacío cuando no hay partidos
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onAddMatch - Función para añadir un partido
 * @returns {JSX.Element} Estado vacío
 */
const EmptyState = ({ onAddMatch }) => {
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
      <SoccerIcon sx={{ fontSize: 60, opacity: 0.3 }} />
      <Typography variant="h6" color="text.secondary">
        No hay partidos programados para esta jornada
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddMatch}
      >
        Agregar Partido
      </Button>
    </Box>
  );
};

export default EmptyState;