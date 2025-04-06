import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { 
  AddCircle as AddIcon, 
  SportsSoccer as SoccerIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import axios from 'axios';

const LeagueSimulation = ({ leagueId, onSimulationComplete }) => {
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [league, setLeague] = useState(null);

  // Cargar datos de la liga y equipos disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener detalles de la liga
        const leagueResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}`);
        setLeague(leagueResponse.data);
        
        // Obtener todos los equipos
        const teamsResponse = await axios.get('http://localhost:8000/teams/');
        
        // Obtener equipos ya en la liga
        const leagueTeamsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/teams`);
        
        // Marcar equipos que ya están en la liga
        if (leagueTeamsResponse.data.length > 0) {
          setSelectedTeams(leagueTeamsResponse.data);
          
          // Filtrar equipos disponibles para no incluir los que ya están seleccionados
          const leagueTeamIds = leagueTeamsResponse.data.map(team => team.id);
          setAvailableTeams(teamsResponse.data.filter(team => !leagueTeamIds.includes(team.id)));
        } else {
          setAvailableTeams(teamsResponse.data);
        }
        
        setIsLoading(false);
      } catch (err) {
        const errorMsg = 'Error al cargar datos: ' + (err.response?.data?.detail || err.message);
        setError(errorMsg);
        setIsLoading(false);
      }
    };

    if (leagueId) {
      fetchData();
    }
  }, [leagueId]);

  const handleAddTeam = () => {
    if (!selectedTeam) {
      setError('Selecciona un equipo primero');
      return;
    }

    const team = availableTeams.find(team => team.id === selectedTeam);
    
    if (selectedTeams.some(t => t.id === team.id)) {
      setError('Este equipo ya ha sido agregado a la liga');
      return;
    }

    if (league && selectedTeams.length >= league.max_teams) {
      setError(`No puedes agregar más de ${league.max_teams} equipos a esta liga`);
      return;
    }
    
    // Añadir el equipo a la selección local
    setSelectedTeams([...selectedTeams, team]);
    
    // Y también añadirlo a la liga en el backend
    axios.post(`http://localhost:8000/leagues/${leagueId}/teams/${team.id}`)
      .then(() => {
        // Actualizar la lista de equipos disponibles
        setAvailableTeams(availableTeams.filter(t => t.id !== team.id));
        setSelectedTeam('');
        setError('');
      })
      .catch(err => {
        setError('Error al añadir equipo a la liga: ' + (err.response?.data?.detail || err.message));
      });
  };

  const handleRemoveTeam = (teamToRemove) => {
    // Eliminar el equipo de la selección local
    setSelectedTeams(selectedTeams.filter(team => team.id !== teamToRemove.id));
    
    // Y también eliminarlo de la liga en el backend
    axios.delete(`http://localhost:8000/leagues/${leagueId}/teams/${teamToRemove.id}`)
      .then(() => {
        // Volver a añadir el equipo a la lista de disponibles
        setAvailableTeams([...availableTeams, teamToRemove]);
      })
      .catch(err => {
        setError('Error al eliminar equipo de la liga: ' + (err.response?.data?.detail || err.message));
        // Volver a añadir el equipo a selectedTeams si falló la eliminación
        setSelectedTeams(prevTeams => [...prevTeams, teamToRemove]);
      });
  };

  const handleSimulateTournament = async () => {
    if (selectedTeams.length < 2) {
      setError('Se necesitan al menos 2 equipos para simular la liga');
      return;
    }
    
    setIsSimulating(true);
    setError('');
    setSuccess('');
    
    try {
      // Llamar al endpoint de simulación
      const response = await axios.post(`http://localhost:8000/leagues/${leagueId}/simulate`, {
        teams: selectedTeams.map(team => team.id),
        jornadas: league.jornadas
      });
      
      setSuccess('Liga simulada exitosamente. Se han generado ' + league.jornadas + ' jornadas de partidos.');
      setIsSimulating(false);
      
      // Callback para informar a componentes padre si es necesario
      if (onSimulationComplete) {
        onSimulationComplete();
      }
    } catch (err) {
      setError('Error al simular la liga: ' + (err.response?.data?.detail || err.message));
      setIsSimulating(false);
    }
  };

  const getAvailableTeamsOptions = () => {
    return availableTeams;
  };

  if (isLoading && !league) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Cargando datos de la liga...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SoccerIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Simular Liga: {league?.name}
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
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Equipos Participantes ({selectedTeams.length}/{league?.max_teams || 0})
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
        <FormControl fullWidth error={!!error && error.includes('equipo')}>
          <InputLabel>Añadir Equipo</InputLabel>
          <Select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            label="Añadir Equipo"
            disabled={isLoading || getAvailableTeamsOptions().length === 0}
          >
            {getAvailableTeamsOptions().map(team => (
              <MenuItem key={team.id} value={team.id}>
                {team.name} {team.manager ? `(${team.manager})` : ''}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {isLoading ? 'Cargando equipos...' : 
             getAvailableTeamsOptions().length === 0 ? 'No hay más equipos disponibles' : 
             `Añade equipos a la liga (mínimo 2 para simular)`}
          </FormHelperText>
        </FormControl>
        
        <IconButton 
          color="primary" 
          onClick={handleAddTeam}
          disabled={isLoading || !selectedTeam || (league && selectedTeams.length >= league.max_teams)}
          sx={{ mt: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      
      {selectedTeams.length > 0 ? (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedTeams.map(team => (
            <Chip
              key={team.id}
              label={`${team.name} ${team.manager ? `(${team.manager})` : ''}`}
              onDelete={() => handleRemoveTeam(team)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          No hay equipos seleccionados. Añade al menos 2 equipos para poder simular la liga.
        </Typography>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleSimulateTournament}
        disabled={isSimulating || selectedTeams.length < 2}
        fullWidth
        startIcon={isSimulating ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
        sx={{ mt: 2 }}
      >
        {isSimulating ? 'Simulando...' : 'Simular Liga'}
      </Button>
    </Paper>
  );
};

export default LeagueSimulation;