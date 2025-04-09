import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { SportsSoccer as SoccerIcon } from '@mui/icons-material';

/**
 * Encabezado del formulario de creación de liga
 * 
 * @returns {JSX.Element} Encabezado del formulario
 */
const LeagueFormHeader = () => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SoccerIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Crear Nueva Liga
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
    </>
  );
};

export default LeagueFormHeader;