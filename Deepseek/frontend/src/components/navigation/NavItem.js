import React from 'react';
import { Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Componente para representar un elemento individual de navegación
 * @param {string} to - Ruta de destino
 * @param {React.ReactNode} icon - Icono a mostrar
 * @param {string} label - Texto a mostrar
 * @param {boolean} isActive - Si el elemento está activo
 * @param {boolean} isMobile - Si se está en vista móvil
 */
const NavItem = ({ to, icon, label, isActive, isMobile }) => {
  const theme = useTheme();

  return (
    <Button 
      component={RouterLink} 
      to={to} 
      startIcon={icon}
      sx={{ 
        my: 2, 
        color: 'white',
        display: isMobile ? 'none' : 'flex',
        fontWeight: 500,
        borderBottom: isActive ? `2px solid ${theme.palette.secondary.main}` : 'none',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      {label}
    </Button>
  );
};

export default NavItem;