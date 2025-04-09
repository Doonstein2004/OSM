import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Componentes
import LeagueFilters from './LeagueFilters';
import LeagueList from './LeagueList';
import StatusMessages from './StatusMessages';

// Servicios y utilidades
import { fetchTemplateLeagues, fetchLeagueDetails, createLeagueFromTemplate } from '../../../utils/api/leagueTemplateService';
import { calculateValueStats } from '../../../utils/helpers/valueFormatters';

/**
 * Componente principal para seleccionar y crear ligas a partir de plantillas
 */
const LeagueTemplateSelector = ({ onLeagueCreate, initialTipoLiga = "Liga Tactica" }) => {
  const navigate = useNavigate();
  
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
  
  // Cargar ligas de la plantilla según el tipo seleccionado
  useEffect(() => {
    const loadLeagues = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Para el caso especial de batallas, no hacemos petición al backend
        if (tipoLiga === "Batallas") {
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
        
        // Determinar qué tipo buscar según el tipo de liga seleccionado
        let type = null;
        if (tipoLiga === "Torneo") {
          type = "Tournament";
        }
        
        // Hardcodeamos el nombre de la plantilla ya que solo habrá una
        const templateName = 'leagues';
        
        // Usar el servicio para obtener las ligas
        const data = await fetchTemplateLeagues(templateName, type);
        setLeagues(data.leagues);
        setFilteredLeagues(data.leagues);
        
        // Cargar las estadísticas para todas las ligas
        await loadAllLeagueStats(data.leagues);
        
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar ligas: ' + (err.response?.data?.detail || err.message));
        setIsLoading(false);
      }
    };
    
    loadLeagues();
  }, [tipoLiga]);
  
  // Función para cargar estadísticas de todas las ligas
  const loadAllLeagueStats = async (leaguesList) => {
    if (!leaguesList || leaguesList.length === 0 || tipoLiga === "Batallas") return;
    
    const tempLoadingLeagues = {};
    leaguesList.forEach(league => {
      tempLoadingLeagues[league.name] = true;
    });
    
    setLoadingLeagues(tempLoadingLeagues);
    
    const statsPromises = leaguesList.map(async (league) => {
      try {
        // Usar el servicio para obtener detalles de la liga
        const response = await fetchLeagueDetails('leagues', league.name);
        
        // Calcular estadísticas
        const stats = calculateValueStats(response);
        
        return {
          leagueName: league.name,
          leagueData: response,
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
  
  // Aplicar filtros cuando cambian los criterios
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
  
  // Función para expandir/contraer una liga
  const handleToggleLeagueExpand = async (league) => {
    // Si ya estaba expandida, la contraemos
    if (expandedLeague && expandedLeague.name === league.name) {
      setExpandedLeague(null);
      return;
    }
    
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
      
      const leagueData = await fetchLeagueDetails('leagues', league.name);
      const stats = calculateValueStats(leagueData);
      
      setLeagueStats(prev => ({
        ...prev, 
        [league.name]: {
          league: leagueData,
          stats: stats
        }
      }));
      
      setExpandedLeague(leagueData);
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
      // Usar el servicio para crear la liga
      const response = await createLeagueFromTemplate(
        league.name,
        tipoLiga,
        manager.id,
        manager.name
      );
      
      setSuccess(`Liga "${league.name}" creada exitosamente con ${response.teams_count} equipos`);
      setIsLoading(false);
      
      // Callback para el componente padre si existe
      if (onLeagueCreate) {
        onLeagueCreate(response.league_id);
      }
      
      // Opcional: redirigir a la página de detalles de la liga
      setTimeout(() => {
        navigate(`/leagues/${response.league_id}`);
      }, 1500);
    } catch (err) {
      setError('Error al crear la liga: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
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
      
      <StatusMessages
        successMessage={success}
        errorMessage={error}
      />
      
      <Grid container spacing={2}>
        {/* Filtros */}
        <Grid item xs={12}>
          <LeagueFilters
            tipoLiga={tipoLiga}
            searchText={searchText}
            minTeams={minTeams}
            maxTeams={maxTeams}
            onTipoLigaChange={setTipoLiga}
            onSearchTextChange={setSearchText}
            onMinTeamsChange={setMinTeams}
            onMaxTeamsChange={setMaxTeams}
          />
        </Grid>
        
        {/* Lista de ligas */}
        <Grid item xs={12}>
          <LeagueList
            leagues={filteredLeagues}
            isLoading={isLoading}
            expandedLeague={expandedLeague}
            onToggleExpand={handleToggleLeagueExpand}
            onCreateLeague={handleCreateLeague}
            leagueStats={leagueStats}
            loadingLeagues={loadingLeagues}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LeagueTemplateSelector;