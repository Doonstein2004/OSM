import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  SportsSoccer as SoccerIcon,
  Leaderboard as LeaderboardIcon,
  EmojiEvents as TrophyIcon,
  Dashboard as DashboardIcon,
  Groups as TeamsIcon 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky" elevation={3} sx={{ 
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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

          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: isMobile ? 'flex-end' : 'center',
            gap: isMobile ? 0 : 2
          }}>
            <Button 
              component={RouterLink} 
              to="/" 
              startIcon={<TrophyIcon />}
              sx={{ 
                my: 2, 
                color: 'white',
                display: isMobile ? 'none' : 'flex',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              Inicio
            </Button>
            <Button 
              component={RouterLink} 
              to="/standings" 
              startIcon={<LeaderboardIcon />}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: isMobile ? 'none' : 'flex',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              Tabla
            </Button>
            <Button 
              component={RouterLink} 
              to="/matches" 
              startIcon={<SoccerIcon />}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: isMobile ? 'none' : 'flex',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              Partidos
            </Button>
            <Button 
              component={RouterLink} 
              to="/analytics" 
              startIcon={<DashboardIcon />}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: isMobile ? 'none' : 'flex',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              Estadísticas
            </Button>
            <Button 
              component={RouterLink} 
              to="/teams" 
              startIcon={<TeamsIcon />}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: isMobile ? 'none' : 'flex',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              Equipos
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;