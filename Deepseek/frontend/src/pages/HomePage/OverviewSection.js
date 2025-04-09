import React from 'react';
import { Box, Typography } from '@mui/material';

const OverviewSection = ({ theme }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          color: theme.palette.primary.main,
          textAlign: 'center'
        }}
      >
        VISIÓN GENERAL
      </Typography>
      
      <Typography variant="body1" paragraph align="center" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
        Explora los diferentes componentes del simulador de torneos utilizando el menú de navegación superior.
        Cada sección te proporcionará información detallada sobre el desarrollo del torneo.
      </Typography>
    </Box>
  );
};

export default OverviewSection;