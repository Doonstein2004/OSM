import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLocation } from 'react-router-dom';

import NavBrand from './NavBrand';
import NavItems from './NavItems';

/**
 * Componente principal de navegación que muestra la barra de menú
 */
const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={3} sx={{ 
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavBrand isMobile={isMobile} />
          <NavItems isMobile={isMobile} currentPath={location.pathname} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;