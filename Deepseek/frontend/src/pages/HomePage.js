import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Divider,
  useTheme 
} from '@mui/material';
import { 
  Leaderboard as LeaderboardIcon, 
  SportsSoccer as SoccerIcon,
  Dashboard as DashboardIcon,
  Groups as TeamsIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSimulate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          mb: 6, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(33, 150, 243, 0.1) 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: { xs: '150px', md: '300px' }, 
            height: { xs: '150px', md: '300px' },
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255, 152, 0, 0.15) 0%, rgba(33, 150, 243, 0) 70%)`,
            zIndex: 0,
            transform: 'translate(30%, -30%)'
          }} 
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 2,
              background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            SIMULADOR DE TORNEO DE FÚTBOL
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              maxWidth: '800px',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Simula torneos completos, analiza estadísticas y descubre quién será el campeón en esta plataforma interactiva
          </Typography>
          
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink}
            to="/teams"
            startIcon={<PlayIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 20px rgba(33, 150, 243, 0.4)',
              }
            }}
          >
            COMENZAR SIMULACIÓN
          </Button>
        </Box>
      </Paper>

      {/* Feature Cards */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 700,
          color: theme.palette.primary.main
        }}
      >
        CARACTERÍSTICAS PRINCIPALES
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            <CardActionArea 
              component={RouterLink} 
              to="/standings"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flexGrow: 1,
                p: 3
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                }}
              >
                <LeaderboardIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Tabla de Posiciones
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Visualiza la clasificación completa con todos los datos relevantes de cada equipo.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            <CardActionArea 
              component={RouterLink} 
              to="/matches"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flexGrow: 1,
                p: 3
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                }}
              >
                <SoccerIcon sx={{ fontSize: 36, color: theme.palette.secondary.main }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Resultados
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Consulta todos los resultados de los partidos simulados del torneo.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            <CardActionArea 
              component={RouterLink} 
              to="/analytics"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flexGrow: 1,
                p: 3
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                }}
              >
                <DashboardIcon sx={{ fontSize: 36, color: theme.palette.success.main }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Estadísticas
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Analiza datos detallados y visualizaciones de rendimiento de los equipos.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            <CardActionArea 
              component={RouterLink} 
              to="/teams"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flexGrow: 1,
                p: 3
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                }}
              >
                <TeamsIcon sx={{ fontSize: 36, color: theme.palette.error.main }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Gestión de Equipos
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Configura y personaliza los equipos que participarán en el torneo.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      
      {/* Quick Access Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 6,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3, 
            color: 'white',
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          ACCESO RÁPIDO
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth
              variant="contained" 
              color="secondary"
              component={RouterLink}
              to="/teams"
              startIcon={<PlayIcon />}
              sx={{ 
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                }
              }}
            >
              Simular Nuevo Torneo
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Simulation Overview */}
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
    </Container>
  );
};

export default HomePage;