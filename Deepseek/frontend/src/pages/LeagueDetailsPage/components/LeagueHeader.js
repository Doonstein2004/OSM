import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  Grid, 
  Stack, 
  Chip, 
  Button 
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  People as TeamsIcon,
  ViewList as JornadasIcon
} from '@mui/icons-material';

const LeagueHeader = ({ league, theme, showManagers, setShowManagers, onSimulate }) => {
  return (
    <Card 
      elevation={3} 
      sx={{ 
        mb: 4,
        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        color: 'white', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          right: -20, 
          top: -20, 
          opacity: 0.1, 
          fontSize: 240 
        }}
      >
        <TrophyIcon fontSize="inherit" />
      </Box>
      
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ 
              bgcolor: 'white', 
              color: theme.palette.primary.main,
              width: 64,
              height: 64,
              mr: 3,
              boxShadow: 2
            }}
          >
            <TrophyIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {league.name}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 'normal' }}>
              {league.country} • Temporada {league.season}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1.5, display: 'flex' }}>
                  <TeamsIcon />
                </Box>
                <Typography variant="body1">
                  <strong>Equipos:</strong> {league.teams?.length || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1.5, display: 'flex' }}>
                  <JornadasIcon />
                </Box>
                <Typography variant="body1">
                  <strong>Jornadas:</strong> {league.jornadas}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1.5, display: 'flex' }}>
                  <LocationIcon />
                </Box>
                <Typography variant="body1">
                  <strong>País:</strong> {league.country || 'No especificado'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1.5, display: 'flex' }}>
                  <CalendarIcon />
                </Box>
                <Typography variant="body1">
                  <strong>Creada:</strong> {new Date(league.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1.5, display: 'flex' }}>
                  <PersonIcon />
                </Box>
                <Typography variant="body1">
                  <strong>Creador:</strong> {league.creator?.name || 'Sin asignar'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={league.active ? 'En curso' : 'Finalizada'} 
                  color={league.active ? 'success' : 'default'}
                  size="small"
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    bgcolor: league.active ? 'success.main' : 'text.disabled'
                  }}
                />
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4}>
            {league.winner ? (
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight="bold">Resultados finales</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyIcon sx={{ mr: 1.5, color: 'gold' }} />
                  <Typography variant="body1">
                    <strong>Campeón:</strong> {league.winner.name}
                  </Typography>
                </Box>
                {league.runner_up && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrophyIcon sx={{ mr: 1.5, color: 'silver' }} />
                    <Typography variant="body1">
                      <strong>Subcampeón:</strong> {league.runner_up.name}
                    </Typography>
                  </Box>
                )}
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<PlayIcon />}
                  onClick={onSimulate}
                  size="large"
                  fullWidth
                  sx={{ 
                    py: 1.5, 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  Simular Liga
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SettingsIcon />}
            onClick={() => setShowManagers(!showManagers)}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.15)', 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)'
              }
            }}
          >
            {showManagers ? 'Ocultar Ajustes' : 'Mostrar Ajustes'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeagueHeader;