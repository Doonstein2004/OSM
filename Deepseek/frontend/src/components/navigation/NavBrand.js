import React from 'react';
import { Typography } from '@mui/material';
import { SportsSoccer as SoccerIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material';

/**
 * Componente para el logo y título de la aplicación en la barra de navegación
 */
const NavBrand = ({ isMobile }) => {
  const theme = useTheme();

  return (
    <>
      <SoccerIcon sx={{ display: 'flex', mr: 1, color: theme.palette.secondary.main }} />
      <Typography
        variant="h6"
        noWrap
        component={RouterLink}
        to="/"
        sx={{
          mr: 2,
          display: 'flex',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          letterSpacing: '.1rem',
          color: 'white',
          textDecoration: 'none',
          flexGrow: isMobile ? 1 : 0
        }}
      >
        LIGA SIMULATOR
      </Typography>
    </>
  );
};

export default NavBrand;