import React from 'react';
import { Box } from '@mui/material';
import { 
  SportsSoccer as SoccerIcon,
  Leaderboard as LeaderboardIcon,
  EmojiEvents as TrophyIcon,
  Dashboard as DashboardIcon,
  Groups as TeamsIcon
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
    { to: "/", label: "Inicio", icon: <TrophyIcon /> },
    { to: "/leagues", label: "Ligas", icon: <TrophyIcon /> },
    { to: "/standings", label: "Tabla", icon: <LeaderboardIcon /> },
    { to: "/matches", label: "Partidos", icon: <SoccerIcon /> },
    { to: "/analytics", label: "Estadísticas", icon: <DashboardIcon /> },
    { to: "/teams", label: "Equipos", icon: <TeamsIcon /> }
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