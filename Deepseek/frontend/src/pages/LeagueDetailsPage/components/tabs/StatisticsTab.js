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
  useTheme 
} from '@mui/material';
import { 
  Assessment as StatsIcon,
  Settings as SettingsIcon 
} from '@mui/icons-material';

const StatisticsTab = ({ stats }) => {
  const theme = useTheme();
  
  if (!stats) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: 'text.secondary'
      }}>
        <StatsIcon sx={{ fontSize: 60, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay estadísticas disponibles para esta liga
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Simula algunos partidos para generar estadísticas
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  <SettingsIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Tácticas Más Comunes
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1">Formación Más Común:</Typography>
                  <Chip 
                    label={stats.most_common_formation} 
                    color="primary" 
                    size="medium" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1">Estilo Más Común:</Typography>
                  <Chip 
                    label={stats.most_common_style} 
                    color="secondary" 
                    size="medium" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Stack>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Equipos Destacados
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2, 
                        background: `linear-gradient(45deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
                        color: 'white',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.9, mb: 1 }}>
                          Mejor Ataque
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stats.team_with_most_goals ? stats.team_with_most_goals.name : 'N/A'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2, 
                        background: `linear-gradient(45deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
                        color: 'white',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.9, mb: 1 }}>
                          Mejor Defensa
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stats.team_with_best_defense ? stats.team_with_best_defense.name : 'N/A'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Sección para más estadísticas avanzadas */}
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 3 }}>
                  <Chip label="Estadísticas Avanzadas" />
                </Divider>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Efectividad de Gol
                      </Typography>
                      <Box sx={{ 
                        height: 10, 
                        bgcolor: 'grey.300', 
                        borderRadius: 5,
                        mb: 1
                      }}>
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${Math.min(stats.shooting_efficiency || 0, 100)}%`,
                            bgcolor: 'success.main',
                            borderRadius: 5
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" align="right">
                        {stats.shooting_efficiency ? `${stats.shooting_efficiency.toFixed(1)}%` : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Tarjetas por Partido
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 18, 
                              height: 25, 
                              bgcolor: 'warning.main', 
                              mr: 1, 
                              borderRadius: 0.5 
                            }} 
                          />
                          <Typography variant="body2">
                            {stats.cards_per_match ? `${stats.cards_per_match.yellow.toFixed(1)}` : '0.0'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 18, 
                              height: 25, 
                              bgcolor: 'error.main', 
                              mr: 1, 
                              borderRadius: 0.5 
                            }} 
                          />
                          <Typography variant="body2">
                            {stats.cards_per_match ? `${stats.cards_per_match.red.toFixed(1)}` : '0.0'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Partidos con Empate
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                          {stats.draw_matches || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Victorias Locales
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {stats.home_wins || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Victorias Visitantes
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="info.main">
                          {stats.away_wins || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="overline" display="block" color="text.secondary">
                          Partidos sin Goles
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                          {stats.goalless_matches || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsTab;