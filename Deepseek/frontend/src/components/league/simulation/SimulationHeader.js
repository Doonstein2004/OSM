import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { SportsSoccer as SoccerIcon } from '@mui/icons-material';

/**
 * Encabezado para la simulación de liga
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.leagueName - Nombre de la liga
 * @returns {JSX.Element} Encabezado de simulación
 */
const SimulationHeader = ({ leagueName }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SoccerIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Simular Liga: {leagueName || 'Cargando...'}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
    </>
  );
};

export default SimulationHeader;