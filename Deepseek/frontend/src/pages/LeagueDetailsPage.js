
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Breadcrumbs,
  Link,
  Grid,
  Chip,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Stack
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  SportsSoccer as SoccerIcon,
  Leaderboard as StandingsIcon,
  Assessment as StatsIcon,
  NavigateNext as BreadcrumbIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  People as TeamsIcon,
  ViewList as JornadasIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import LeagueSimulation from '../components/LeagueSimulation';
import LeagueTeamManager from '../components/LeagueTeamManager';
import LeagueCreatorManager from '../components/LeagueCreatorManager';
import LeagueDeletionManager from '../components/LeagueDeletionManager';
import axios from 'axios';

const LeagueDetailsPage = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [league, setLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showManagers, setShowManagers] = useState(false);

  // Función para obtener datos de la liga
  const fetchLeagueData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch league details
      const leagueResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}`);
      setLeague(leagueResponse.data);

      // Fetch matches
      const matchesResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/matches`);
      setMatches(matchesResponse.data);

      // Fetch standings
      const standingsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/standings`);
      setStandings(standingsResponse.data);

      // Fetch statistics
      try {
        const statsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/statistics`);
        setStatistics(statsResponse.data);
      } catch (statsError) {
        console.log('No statistics available yet');
        // This is optional, so we don't set a main error
      }

      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los datos de la liga: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagueData();
  }, [leagueId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">Cargando datos de la liga...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" variant="filled" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained"
          startIcon={<BackIcon />} 
          onClick={() => navigate('/leagues')}
          size="large"
        >
          Volver a Ligas
        </Button>
      </Container>
    );
  }

  if (!league) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="warning" variant="filled" sx={{ mb: 4 }}>
          Liga no encontrada
        </Alert>
        <Button 
          variant="contained"
          startIcon={<BackIcon />} 
          onClick={() => navigate('/leagues')}
          size="large"
        >
          Volver a Ligas
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<BreadcrumbIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3, mt: 1 }}
      >
        <Link 
          component={RouterLink} 
          to="/"
          underline="hover"
          color="inherit"
        >
          Inicio
        </Link>
        <Link 
          component={RouterLink} 
          to="/leagues"
          underline="hover"
          color="inherit"
        >
          Ligas
        </Link>
        <Typography color="text.primary" fontWeight="medium">{league.name}</Typography>
      </Breadcrumbs>

      {/* League Header */}
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
                    <EmojiEvents sx={{ mr: 1.5, color: 'gold' }} />
                    <Typography variant="body1">
                      <strong>Campeón:</strong> {league.winner.name}
                    </Typography>
                  </Box>
                  {league.runner_up && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmojiEvents sx={{ mr: 1.5, color: 'silver' }} />
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
                    onClick={() => setActiveTab(3)}
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

      {/* Management Section */}
      {showManagers && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LeagueTeamManager 
                leagueId={leagueId} 
                onUpdate={fetchLeagueData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <LeagueCreatorManager 
                  league={league} 
                  onUpdate={fetchLeagueData}
                />
                <LeagueDeletionManager 
                  leagueId={leagueId}
                  leagueName={league.name} 
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tabs Navigation */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="league details tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
              height: 3
            },
            '& .MuiTab-root': {
              py: 2
            }
          }}
        >
          <Tab 
            label="Partidos" 
            id="tab-0"
            aria-controls="tabpanel-0"
            icon={<SoccerIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Tabla de Posiciones" 
            id="tab-1"
            aria-controls="tabpanel-1"
            icon={<StandingsIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Estadísticas" 
            id="tab-2"
            aria-controls="tabpanel-2"
            icon={<StatsIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Simular" 
            id="tab-3"
            aria-controls="tabpanel-3"
            icon={<PlayIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      {/* Tab Panels */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
        >
          {activeTab === 0 && <MatchesTab matches={matches} />}
        </Box>
        
        <Box
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
        >
          {activeTab === 1 && <StandingsTab standings={standings} />}
        </Box>
        
        <Box
          role="tabpanel"
          hidden={activeTab !== 2}
          id="tabpanel-2"
          aria-labelledby="tab-2"
        >
          {activeTab === 2 && <StatisticsTab stats={statistics} />}
        </Box>

        <Box
          role="tabpanel"
          hidden={activeTab !== 3}
          id="tabpanel-3"
          aria-labelledby="tab-3"
        >
          {activeTab === 3 && (
            <LeagueSimulation 
              leagueId={leagueId} 
              onSimulationComplete={() => {
                fetchLeagueData();
                setActiveTab(0);
              }}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

// MatchesTab Component Redesigned
const MatchesTab = ({ matches }) => {
  const theme = useTheme();
  
  if (!matches || matches.length === 0) {
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
        <SoccerIcon sx={{ fontSize: 60, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay partidos disponibles para esta liga
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Utiliza la pestaña "Simular" para generar partidos
        </Typography>
      </Box>
    );
  }

  // Group matches by jornada
  const matchesByJornada = matches.reduce((acc, match) => {
    if (!acc[match.jornada]) {
      acc[match.jornada] = [];
    }
    acc[match.jornada].push(match);
    return acc;
  }, {});

  return (
    <Box>
      {Object.entries(matchesByJornada).map(([jornada, jornadaMatches]) => (
        <Box key={jornada} sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 1,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: 2
          }}>
            <Typography variant="h6" fontWeight="bold">
              Jornada {jornada}
            </Typography>
          </Box>
          
          <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {jornadaMatches.map((match, index) => (
              <React.Fragment key={match.id}>
                {index > 0 && <Divider />}
                <Box 
                  sx={{ 
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={5} textAlign="right">
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {match.home_team.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {match.home_formation} • {match.home_style}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        bgcolor: match.home_goals !== null ? 'background.default' : 'action.disabledBackground',
                        borderRadius: 1,
                        mx: 'auto',
                        width: '80px',
                        height: '40px'
                      }}>
                        {match.home_goals !== null && match.away_goals !== null ? (
                          <Typography variant="h6" fontWeight="bold" sx={{ textAlign: 'center' }}>
                            {match.home_goals} - {match.away_goals}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Pendiente
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={5}>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {match.away_team.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {match.away_formation} • {match.away_style}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </React.Fragment>
            ))}
          </Card>
        </Box>
      ))}
    </Box>
  );
};

// StandingsTab Component Redesigned
const StandingsTab = ({ standings }) => {
  const theme = useTheme();
  
  if (!standings || standings.length === 0) {
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
        <StandingsIcon sx={{ fontSize: 60, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay tabla de posiciones disponible para esta liga
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Simula algunos partidos para generar la tabla de posiciones
        </Typography>
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '60px 2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', 
        width: '100%',
        bgcolor: theme.palette.primary.main,
        color: 'white',
        px: 2,
        py: 1.5,
      }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>#</Typography>
        <Typography variant="subtitle2" fontWeight="bold">Equipo</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>PJ</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>G</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>E</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>P</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>GF</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>GC</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>DG</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>PTS</Typography>
      </Box>
      
      {standings.map((team, index) => (
        <Box key={team.team_id} sx={{ 
          display: 'grid', 
          gridTemplateColumns: '60px 2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', 
          width: '100%',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: index < 3 ? 'success.50' : (index > (standings.length - 4) ? 'error.50' : 'transparent'),
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}>
          <Box sx={{ 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 
              index === 0 ? 'success.dark' : 
              index === 1 ? 'success.dark' : 
              index === 2 ? 'success.dark' : 
              index > (standings.length - 4) ? 'error.main' : 'text.primary'
          }}>
            {index + 1}
          </Box>
          <Typography fontWeight={500}>{team.team.name}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.played}</Typography>
          <Typography sx={{ textAlign: 'center', color: 'success.main', fontWeight: team.won > 0 ? 'bold' : 'normal' }}>{team.won}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.drawn}</Typography>
          <Typography sx={{ textAlign: 'center', color: 'error.main', fontWeight: team.lost > 0 ? 'bold' : 'normal' }}>{team.lost}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.goals_for}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.goals_against}</Typography>
          <Typography sx={{ textAlign: 'center', color: team.goal_difference > 0 ? 'success.main' : team.goal_difference < 0 ? 'error.main' : 'text.primary', fontWeight: 'bold' }}>
            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
          </Typography>
          <Typography sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{team.points}</Typography>
        </Box>
      ))}
    </Card>
  );
};

// StatisticsTab Component Redesigned
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

export default LeagueDetailsPage;