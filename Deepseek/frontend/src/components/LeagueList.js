import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Public as CountryIcon,
  SportsSoccer as SoccerIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarMonth as CalendarIcon,
  Groups as TeamsIcon,
  Leaderboard as StandingsIcon,
  Assessment as StatsIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeagueList = () => {
  const [leagues, setLeagues] = useState([]);
  const [expandedLeague, setExpandedLeague] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [leagueDetails, setLeagueDetails] = useState({});
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchLeagues = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/leagues/');
      setLeagues(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar ligas: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleExpandLeague = async (leagueId) => {
    if (expandedLeague === leagueId) {
      setExpandedLeague(null);
      return;
    }
    
    setExpandedLeague(leagueId);
    
    // Only fetch details if we don't have them yet
    if (!leagueDetails[leagueId]) {
      try {
        const detailsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}`);
        const standingsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/standings`);
        
        setLeagueDetails({
          ...leagueDetails,
          [leagueId]: {
            details: detailsResponse.data,
            standings: standingsResponse.data
          }
        });
      } catch (err) {
        console.error('Error loading league details:', err);
      }
    }
  };

  const getCountryFlag = (country) => {
    // Placeholder para banderas de países
    const countryCode = country.toLowerCase().slice(0, 2);
    return `https://flagcdn.com/w40/${countryCode}.png`;
  };

  const viewLeagueMatches = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  const viewLeagueStandings = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  const viewLeagueStats = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  const goToCreateLeague = () => {
    navigate('/leagues/create');
  };

  if (isLoading && leagues.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Cargando ligas...</Typography>
      </Paper>
    );
  }

  if (error && leagues.length === 0) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  if (leagues.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          No hay ligas creadas
        </Typography>
        <Button 
          variant="contained" 
          onClick={goToCreateLeague}
          startIcon={<SoccerIcon />}
        >
          Crear Nueva Liga
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrophyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Ligas Disponibles
          </Typography>
        </Box>
        
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={goToCreateLeague}
          size="small"
        >
          Nueva Liga
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <List sx={{ width: '100%' }}>
        {leagues.map((league) => (
          <React.Fragment key={league.id}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ 
                bgcolor: expandedLeague === league.id ? 'action.selected' : 'transparent',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  alt={league.country} 
                  src={getCountryFlag(league.country)}
                  sx={{ bgcolor: theme.palette.primary.main }}
                >
                  <CountryIcon />
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="span" fontWeight="bold">
                    {league.name}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <TrophyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" component="span">
                        {league.tipo_liga}
                      </Typography>
                      
                      {league.country && (
                        <>
                          <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
                          <CountryIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" component="span">
                            {league.country}
                          </Typography>
                        </>
                      )}
                      
                      <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
                      
                      <TeamsIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" component="span">
                        {league.teams_count || 0} equipos
                      </Typography>
                      
                      <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
                      
                      <SoccerIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" component="span">
                        {league.matches_count || 0} partidos
                      </Typography>
                    </Box>
                    
                    {/* Nueva línea para mostrar el creador si existe */}
                    {league.creator && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" component="span">
                          Creada por: {league.creator.name}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', mt: 1 }}>
                      <Chip 
                        label={league.active ? 'Activa' : 'Finalizada'} 
                        size="small" 
                        color={league.active ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip 
                        label={league.tipo_liga} 
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </React.Fragment>
                }
              />
              
              <IconButton 
                edge="end" 
                onClick={() => handleExpandLeague(league.id)}
                aria-expanded={expandedLeague === league.id}
                aria-label="show more"
              >
                {expandedLeague === league.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </ListItem>
            
            <Collapse in={expandedLeague === league.id} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                {!leagueDetails[league.id] ? (
                  <LinearProgress />
                ) : (
                  <Grid container spacing={2}>
                    {leagueDetails[league.id].standings && leagueDetails[league.id].standings.length > 0 && (
                      <Grid item xs={12} md={8}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              Podio Actual
                            </Typography>
                            
                            <List dense>
                              {leagueDetails[league.id].standings.slice(0, 3).map((team, index) => (
                                <ListItem key={team.team_id}>
                                  <ListItemIcon>
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: 
                                          index === 0 ? 'gold' : 
                                          index === 1 ? 'silver' : 
                                          '#cd7f32'
                                      }}
                                    >
                                      {index + 1}
                                    </Avatar>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={team.team.name}
                                    secondary={`${team.points} pts • ${team.won}G ${team.drawn}E ${team.lost}P • GD: ${team.goal_difference}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            Acciones
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            startIcon={<SoccerIcon />} 
                            size="small"
                            onClick={() => viewLeagueMatches(league.id)}
                          >
                            Partidos
                          </Button>
                          <Button 
                            startIcon={<StandingsIcon />} 
                            size="small"
                            onClick={() => viewLeagueStandings(league.id)}
                          >
                            Tabla
                          </Button>
                          <Button 
                            startIcon={<StatsIcon />} 
                            size="small"
                            onClick={() => viewLeagueStats(league.id)}
                          >
                            Estadísticas
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Collapse>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default LeagueList;