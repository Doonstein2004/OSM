import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Chip,
  InputAdornment,
  useTheme,
  Avatar,
  ListItemAvatar,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  EmojiEvents as TrophyIcon,
  Groups as TeamsIcon,
  MonetizationOn as MoneyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeagueTemplateSelector = ({ onLeagueCreate, initialTipoLiga = "Liga Tactica" }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Estados
  const [leagues, setLeagues] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [expandedLeague, setExpandedLeague] = useState(null);
  const [leagueStats, setLeagueStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para filtros
  const [tipoLiga, setTipoLiga] = useState(initialTipoLiga);
  const [searchText, setSearchText] = useState('');
  const [minTeams, setMinTeams] = useState('');
  const [maxTeams, setMaxTeams] = useState('');
  
  // Obtener datos del usuario actual
  const [manager, setManager] = useState(() => {
    // En una aplicación real, estos datos vendrían de un sistema de autenticación
    const loggedUser = {
      id: localStorage.getItem('userId') || 'user123',
      name: localStorage.getItem('userName') || 'Usuario Actual'
    };
    return loggedUser;
  });
  
  // Cargar ligas de la plantilla predeterminada
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setIsLoading(true);
        
        // Hardcodeamos el nombre de la plantilla ya que solo habrá una
        const templateName = 'leagues'; 
        
        // Determinar qué tipo buscar según el tipo de liga seleccionado
        let type = null;
        if (tipoLiga === "Torneo") {
          type = "Tournament";
        } else if (tipoLiga === "Batallas") {
          // Para batallas, mostramos solo "Batalla amistosa" en lugar de filtrar por tipo
          setLeagues([{
            name: "Batalla amistosa",
            type: "Battle",
            team_count: 2,
            team_values: []
          }]);
          setFilteredLeagues([{
            name: "Batalla amistosa",
            type: "Battle",
            team_count: 2,
            team_values: []
          }]);
          setIsLoading(false);
          return;
        }
        
        // Construir URL con parámetros
        let url = `http://localhost:8000/templates/${templateName}/leagues`;
        if (type) {
          url += `?type=${type}`;
        }
        
        const response = await axios.get(url);
        setLeagues(response.data.leagues);
        setFilteredLeagues(response.data.leagues);
        
        // Cargar las estadísticas para todas las ligas
        loadAllLeagueStats(response.data.leagues);
        
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar ligas: ' + (err.response?.data?.detail || err.message));
        setIsLoading(false);
      }
    };
    
    fetchLeagues();
  }, [tipoLiga]);
  
  // Nueva función para cargar las estadísticas de todas las ligas
  const loadAllLeagueStats = async (leaguesList) => {
    if (!leaguesList || leaguesList.length === 0 || tipoLiga === "Batallas") return;
    
    const tempLoadingLeagues = {};
    leaguesList.forEach(league => {
      tempLoadingLeagues[league.name] = true;
    });
    
    setLoadingLeagues(tempLoadingLeagues);
    
    const statsPromises = leaguesList.map(async (league) => {
      try {
        // Codificar correctamente el nombre de la liga para la URL
        const encodedLeagueName = encodeURIComponent(league.name);
        const response = await axios.get(`http://localhost:8000/templates/leagues/leagues/${encodedLeagueName}`);
        
        // Calcular estadísticas
        const stats = calculateValueStats(response.data);
        
        return {
          leagueName: league.name,
          leagueData: response.data,
          stats: stats
        };
      } catch (err) {
        console.error(`Error cargando estadísticas para liga ${league.name}:`, err);
        return {
          leagueName: league.name,
          error: err.message
        };
      }
    });
    
    const results = await Promise.all(statsPromises);
    
    const newLeagueStats = {};
    const newLoadingLeagues = {};
    
    results.forEach(result => {
      if (result.error) {
        newLoadingLeagues[result.leagueName] = false;
      } else {
        newLeagueStats[result.leagueName] = {
          league: result.leagueData,
          stats: result.stats
        };
        newLoadingLeagues[result.leagueName] = false;
      }
    });
    
    setLeagueStats(newLeagueStats);
    setLoadingLeagues(newLoadingLeagues);
  };
  
  // Aplicar todos los filtros cuando cambian
  useEffect(() => {
    if (!leagues) return;
    
    let filtered = [...leagues];
    
    // Filtrar por texto de búsqueda
    if (searchText) {
      filtered = filtered.filter(league => 
        league.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Filtrar por número mínimo de equipos
    if (minTeams) {
      filtered = filtered.filter(league => 
        league.team_count >= parseInt(minTeams)
      );
    }
    
    // Filtrar por número máximo de equipos
    if (maxTeams) {
      filtered = filtered.filter(league => 
        league.team_count <= parseInt(maxTeams)
      );
    }
    
    setFilteredLeagues(filtered);
  }, [leagues, searchText, minTeams, maxTeams]);
  
  // Función para expandir/contraer una liga y mostrar sus equipos
  const toggleLeagueExpansion = async (league) => {
    // Si ya estaba expandida, la contraemos
    if (expandedLeague && expandedLeague.name === league.name) {
      setExpandedLeague(null);
      return;
    }
    
    // Ya no necesitamos cargar las estadísticas aquí porque las cargamos al inicio
    // Solo necesitamos establecer la liga expandida
    
    // Para batallas, no hay detalles adicionales
    if (tipoLiga === "Batallas") {
      setExpandedLeague({
        ...league,
        teams: []
      });
      return;
    }
    
    // Si ya tenemos los datos de la liga en leagueStats, los usamos
    if (leagueStats[league.name]) {
      setExpandedLeague(leagueStats[league.name].league);
      return;
    }
    
    // Si por alguna razón no tenemos los datos, los cargamos (caso de respaldo)
    try {
      setLoadingLeagues(prev => ({...prev, [league.name]: true}));
      
      const encodedLeagueName = encodeURIComponent(league.name);
      const response = await axios.get(`http://localhost:8000/templates/leagues/leagues/${encodedLeagueName}`);
      
      const stats = calculateValueStats(response.data);
      
      setLeagueStats(prev => ({
        ...prev, 
        [league.name]: {
          league: response.data,
          stats: stats
        }
      }));
      
      setExpandedLeague(response.data);
      setLoadingLeagues(prev => ({...prev, [league.name]: false}));
    } catch (err) {
      setError('Error al cargar detalles de la liga: ' + (err.response?.data?.detail || err.message));
      setLoadingLeagues(prev => ({...prev, [league.name]: false}));
    }
  };
  
  // Función para crear una liga
  const handleCreateLeague = async (league) => {
    if (!league) {
      setError('Selecciona una liga primero');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`http://localhost:8000/templates/leagues/create-league`, {
        league_name: league.name,
        tipo_liga: tipoLiga,
        manager_id: manager.id,
        manager_name: manager.name
      });
      
      setSuccess(`Liga "${league.name}" creada exitosamente con ${response.data.teams_count} equipos`);
      setIsLoading(false);
      
      // Callback para el componente padre si existe
      if (onLeagueCreate) {
        onLeagueCreate(response.data.league_id);
      }
      
      // Opcional: redirigir a la página de detalles de la liga
      setTimeout(() => {
        navigate(`/leagues/${response.data.league_id}`);
      }, 1500);
    } catch (err) {
      setError('Error al crear la liga: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
  };
  
  // Calcular estadísticas de valor para la liga
  const calculateValueStats = (league) => {
    if (!league || !league.teams || league.teams.length === 0) {
      return null;
    }
    
    const teams = league.teams;
    let highestValue = 0;
    let highestValueTeam = null;
    let lowestValue = Number.MAX_VALUE;
    let lowestValueTeam = null;
    let totalValue = 0;
    let teamsWithValue = 0;
    
    teams.forEach(team => {
      if (team.value) {
        const valueNum = parseValueToNumber(team.value);
        
        if (valueNum > highestValue) {
          highestValue = valueNum;
          highestValueTeam = team;
        }
        
        if (valueNum < lowestValue) {
          lowestValue = valueNum;
          lowestValueTeam = team;
        }
        
        totalValue += valueNum;
        teamsWithValue++;
      }
    });
    
    if (teamsWithValue === 0) return null;
    
    const avgValue = totalValue / teamsWithValue;
    const valueDifference = highestValue - lowestValue;
    
    return {
      highestValueTeam,
      lowestValueTeam,
      avgValue,
      valueDifference,
      totalValue,
      teamsWithValue,
      avgValueFormatted: formatValue(avgValue),
      valueDifferenceFormatted: formatValue(valueDifference)
    };
  };
  
  // Función para convertir valor en formato legible (ej: "30,3M") a número
  const parseValueToNumber = (valueStr) => {
    try {
      if (!valueStr) return 0;
      
      const cleanStr = valueStr.replace(/\s/g, '').replace(',', '.');
      let multiplier = 1;
      
      if (cleanStr.endsWith('M')) {
        multiplier = 1000000;
        return parseFloat(cleanStr.slice(0, -1)) * multiplier;
      } else if (cleanStr.endsWith('K')) {
        multiplier = 1000;
        return parseFloat(cleanStr.slice(0, -1)) * multiplier;
      }
      
      return parseFloat(cleanStr);
    } catch (e) {
      return 0;
    }
  };
  
  // Función para formatear un número a formato de valor (ej: "30.3M")
  const formatValue = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };
  
  // Renderizar las estadísticas de valor
  const renderValueStats = (league) => {
    const stats = leagueStats[league.name]?.stats;
    const isLoading = loadingLeagues[league.name];
    
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <CircularProgress size={16} />
        </Box>
      );
    }
    
    if (!stats) {
      return (
        <Typography variant="body2" color="text.secondary">
          No hay estadísticas disponibles
        </Typography>
      );
    }
    
    return (
      <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
          <Typography variant="body2" noWrap title={`${stats.highestValueTeam?.name} (${stats.highestValueTeam?.value})`}>
            Mayor: {stats.highestValueTeam?.value} ({stats.highestValueTeam?.name})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'error.main' }} />
          <Typography variant="body2" noWrap title={`${stats.lowestValueTeam?.name} (${stats.lowestValueTeam?.value})`}>
            Menor: {stats.lowestValueTeam?.value} ({stats.lowestValueTeam?.name})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'info.main' }} />
          <Typography variant="body2" noWrap>
            Prom: {stats.avgValueFormatted}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.main' }} />
          <Typography variant="body2" noWrap>
            Dif: {stats.valueDifferenceFormatted}
          </Typography>
        </Box>
      </Box>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrophyIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Seleccionar Liga Predefinida
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {/* Filtros */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Tipo de Liga</InputLabel>
              <Select
                value={tipoLiga}
                onChange={(e) => setTipoLiga(e.target.value)}
                label="Tipo de Liga"
                size="small"
              >
                <MenuItem value="Liga Tactica">Liga Táctica</MenuItem>
                <MenuItem value="Liga Interna">Liga Interna</MenuItem>
                <MenuItem value="Torneo">Torneo</MenuItem>
                <MenuItem value="Batallas">Batallas</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Buscar"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ flexGrow: 1 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Mín. Equipos"
              type="number"
              value={minTeams}
              onChange={(e) => setMinTeams(e.target.value)}
              inputProps={{ min: 2 }}
              size="small"
              sx={{ width: 110 }}
            />
            
            <TextField
              label="Máx. Equipos"
              type="number"
              value={maxTeams}
              onChange={(e) => setMaxTeams(e.target.value)}
              inputProps={{ min: 2 }}
              size="small"
              sx={{ width: 110 }}
            />
          </Box>
        </Grid>
        
        {/* Lista de ligas */}
        <Grid item xs={12}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredLeagues.length === 0 ? (
            <Alert severity="info">
              No se encontraron ligas con los filtros seleccionados
            </Alert>
          ) : (
            <List sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              }
            }}>
              {filteredLeagues.map((league) => {
                const isExpanded = expandedLeague && expandedLeague.name === league.name;
                const isLoading = loadingLeagues[league.name];
                
                return (
                  <React.Fragment key={league.name}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: isExpanded ? 'action.selected' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => toggleLeagueExpansion(league)}
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateLeague(league);
                            }}
                            sx={{ mr: 1, minWidth: 110 }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : 'Crear Liga'}
                          </Button>
                          <IconButton 
                            edge="end" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLeagueExpansion(league);
                            }}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: league.type === "Tournament" ? theme.palette.secondary.main : theme.palette.primary.main }}>
                          <TrophyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={league.name}
                        secondary={
                          <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                              <TeamsIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {league.team_count} equipos
                              </Typography>
                              
                              <Box component="span" sx={{ mx: 0.5, color: 'text.secondary' }}>•</Box>
                              
                              <Chip 
                                label={league.type === "Tournament" ? "Torneo" : (league.type === "Battle" ? "Batalla" : "Liga")} 
                                size="small"
                                color={league.type === "Tournament" ? "secondary" : (league.type === "Battle" ? "warning" : "primary")}
                                variant="outlined"
                              />
                            </Box>
                            
                            {/* Mostrar las estadísticas siempre, utilizando el nuevo formato */}
                            {renderValueStats(league)}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    
                    {/* Sección expandible que ahora solo muestra los equipos */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                        {isLoading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : (
                          <>
                            {expandedLeague && expandedLeague.teams && expandedLeague.teams.length > 0 ? (
                              <Card variant="outlined">
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Equipos de la Liga ({expandedLeague.teams.length})
                                  </Typography>
                                  
                                  <Grid container spacing={1}>
                                    {/* Ordenar equipos de mayor a menor valor */}
                                    {expandedLeague.teams
                                      .slice()
                                      .sort((a, b) => {
                                        const valueA = parseValueToNumber(a.value || '0');
                                        const valueB = parseValueToNumber(b.value || '0');
                                        return valueB - valueA; // Orden descendente
                                      })
                                      .map(team => {
                                        const stats = leagueStats[expandedLeague.name]?.stats;
                                        return (
                                          <Grid item xs={12} sm={6} md={4} lg={3} key={team.name}>
                                            <Box sx={{ 
                                              display: 'flex', 
                                              justifyContent: 'space-between',
                                              p: 1,
                                              borderRadius: 1,
                                              bgcolor: stats && team.name === stats.highestValueTeam?.name 
                                                ? 'success.50' 
                                                : stats && team.name === stats.lowestValueTeam?.name 
                                                  ? 'error.50' 
                                                  : 'background.default'
                                            }}>
                                              <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                                                {team.name}
                                              </Typography>
                                              <Chip 
                                                label={team.value || "N/A"} 
                                                size="small"
                                                color={
                                                  stats && team.name === stats.highestValueTeam?.name 
                                                    ? "success" 
                                                    : stats && team.name === stats.lowestValueTeam?.name 
                                                      ? "error" 
                                                      : "default"
                                                }
                                                variant="outlined"
                                              />
                                            </Box>
                                          </Grid>
                                        );
                                      })}
                                  </Grid>
                                </CardContent>
                              </Card>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No hay información de equipos disponible
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                    </Collapse>
                    
                    <Divider component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LeagueTemplateSelector;