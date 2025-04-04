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
  useTheme
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  SportsSoccer as SoccerIcon,
  Leaderboard as StandingsIcon,
  Assessment as StatsIcon,
  NavigateNext as BreadcrumbIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
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

  useEffect(() => {
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

    fetchLeagueData();
  }, [leagueId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Cargando datos de la liga...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/leagues')}
        >
          Volver a Ligas
        </Button>
      </Container>
    );
  }

  if (!league) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Liga no encontrada
        </Alert>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/leagues')}
        >
          Volver a Ligas
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs 
        separator={<BreadcrumbIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
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
        <Typography color="text.primary">{league.name}</Typography>
      </Breadcrumbs>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(to right, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))` 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrophyIcon 
            sx={{ 
              mr: 2, 
              fontSize: 40, 
              color: theme.palette.secondary.main 
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              color="primary"
              sx={{
                fontWeight: 700,
                background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {league.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {league.country} • Temporada {league.season}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body1" color="text.secondary">
              <strong>Tipo:</strong> {league.tipo_liga}
            </Typography>
            {league.country && (
              <Typography variant="body1" color="text.secondary">
                <strong>País:</strong> {league.country}
              </Typography>
            )}
            <Typography variant="body1" color="text.secondary">
              <strong>Equipos:</strong> {league.teams?.length || 0}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Jornadas:</strong> {league.jornadas}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body1" color="text.secondary">
              <strong>Estado:</strong> {league.active ? 'En curso' : 'Finalizada'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Creada:</strong> {new Date(league.created_at).toLocaleDateString()}
            </Typography>
            {league.creator && (
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Creador:</strong> 
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {league.creator.name}
                </Box>
              </Typography>
            )}
          </Box>
          
          {league.winner && (
            <Box>
              <Typography variant="body1" color="text.secondary">
                <strong>Campeón:</strong> {league.winner.name}
              </Typography>
              {league.runner_up && (
                <Typography variant="body1" color="text.secondary">
                  <strong>Subcampeón:</strong> {league.runner_up.name}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="league details tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
            },
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
        </Tabs>
      </Box>
      
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
    </Container>
  );
};

// Components for each tab
const MatchesTab = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No hay partidos disponibles para esta liga
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
          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Jornada {jornada}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            {jornadaMatches.map(match => (
              <Box 
                key={match.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 1,
                  mb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none',
                    mb: 0
                  }
                }}
              >
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="body1" fontWeight={500}>
                    {match.home_team.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {match.home_formation} • {match.home_style}
                  </Typography>
                </Box>
                
                <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {match.home_goals !== null && match.away_goals !== null ? (
                    <Typography variant="h6" sx={{ minWidth: 70, textAlign: 'center' }}>
                      {match.home_goals} - {match.away_goals}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ minWidth: 70, textAlign: 'center' }}>
                      Pendiente
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {match.away_team.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {match.away_formation} • {match.away_style}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

const StandingsTab = ({ standings }) => {
  if (!standings || standings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No hay tabla de posiciones disponible para esta liga
        </Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '60px 2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', 
        width: '100%',
        px: 2,
        py: 1,
        borderBottom: '2px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
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
          bgcolor: index < 3 ? 'action.hover' : 'transparent'
        }}>
          <Box sx={{ 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 
              index === 0 ? 'success.main' : 
              index === 1 ? 'success.main' : 
              index === 2 ? 'success.main' : 
              index > (standings.length - 4) ? 'error.main' : 'text.primary'
          }}>
            {index + 1}
          </Box>
          <Typography>{team.team.name}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.played}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.won}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.drawn}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.lost}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.goals_for}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.goals_against}</Typography>
          <Typography sx={{ textAlign: 'center', color: team.goal_difference > 0 ? 'success.main' : team.goal_difference < 0 ? 'error.main' : 'text.primary' }}>
            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
          </Typography>
          <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>{team.points}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

const StatisticsTab = ({ stats }) => {
  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No hay estadísticas disponibles para esta liga
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Generales
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Total de Goles:</Typography>
              <Typography variant="body2" fontWeight="bold">{stats.total_goals}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Promedio de Goles por Partido:</Typography>
              <Typography variant="body2" fontWeight="bold">{stats.avg_goals_per_match.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Máximo de Goles en un Partido:</Typography>
              <Typography variant="body2" fontWeight="bold">{stats.max_goals_in_match}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Posesión Más Alta:</Typography>
              <Typography variant="body2" fontWeight="bold">{stats.highest_possession}%</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tácticas Más Comunes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Formación Más Común:</Typography>
              <Chip label={stats.most_common_formation} size="small" />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Estilo Más Común:</Typography>
              <Chip label={stats.most_common_style} size="small" />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Equipos Destacados
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography variant="body2">Mejor Ataque:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.team_with_most_goals ? stats.team_with_most_goals.name : 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography variant="body2">Mejor Defensa:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.team_with_best_defense ? stats.team_with_best_defense.name : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeagueDetailsPage;