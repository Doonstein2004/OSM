import React from 'react';
import { Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { 
  SportsSoccer as SoccerIcon,
  Leaderboard as LeaderboardIcon,
  EmojiEvents as TrophyIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import NavItem from './NavItem';

/**
 * Verifica si una ruta está activa
 * @param {string} path - Ruta a verificar
 * @param {string} currentPath - Ruta actual
 * @returns {boolean} - Si la ruta está activa
 */
const isRouteActive = (path, currentPath) => {
  if (path === '/') {
    return currentPath === path;
  }
  return currentPath.startsWith(path);
};

/**
 * Componente contenedor para todos los ítems de navegación
 */
const NavItems = ({ isMobile, currentPath }) => {
  // Definición de los ítems de navegación
  const navItems = [
    { to: "/", label: "Inicio", icon: <HomeIcon /> },
    { to: "/leagues", label: "Ligas", icon: <TrophyIcon /> },
    { to: "/standings", label: "Tabla", icon: <LeaderboardIcon /> },
    { to: "/matches", label: "Partidos", icon: <SoccerIcon /> },
    { to: "/analytics", label: "Estadísticas", icon: <DashboardIcon /> },
  ];

  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      justifyContent: isMobile ? 'flex-end' : 'center',
      gap: isMobile ? 0 : 2
    }}>
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={isRouteActive(item.to, currentPath)}
          isMobile={isMobile}
        />
      ))}
    </Box>
  );
};

export default NavItems;