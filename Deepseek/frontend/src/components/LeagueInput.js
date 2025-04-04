import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  FormHelperText,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  AddCircle as AddIcon, 
  SportsSoccer as SoccerIcon,
  Public as CountryIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

const LeagueInput = ({ onCreateLeague }) => {
  const [name, setName] = useState('');
  const [showCountry, setShowCountry] = useState(false);
  const [country, setCountry] = useState('');
  const [tipoLiga, setTipoLiga] = useState('');
  const [maxTeams, setMaxTeams] = useState(20);
  const [jornadas, setJornadas] = useState(38);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [creatorTeam, setCreatorTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  // Tipos de liga disponibles
  const tiposLiga = [
    "Liga Tactica",
    "Liga Interna",
    "Torneo",
    "Batallas"
  ];

  // Determinar si el país es necesario basado en el tipo de liga
  useEffect(() => {
    if (tipoLiga === "Batallas" || tipoLiga === "Liga Interna") {
      setShowCountry(false);
      setCountry('');
    } else if (tipoLiga === "Liga Tactica" || tipoLiga === "Torneo") {
      setShowCountry(true);
    }
  }, [tipoLiga]);

  // Fetch available teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get('http://localhost:8000/teams/');
        setAvailableTeams(response.data);
        setIsFetching(false);
      } catch (err) {
        const errorMsg = 'Error al cargar equipos: ' + (err.response?.data?.detail || err.message);
        setError(errorMsg);
        setIsFetching(false);
      }
    };

    fetchTeams();
  }, []);

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

    if (selectedTeams.length >= maxTeams) {
      setError(`No puedes agregar más de ${maxTeams} equipos a esta liga`);
      return;
    }
    
    setSelectedTeams([...selectedTeams, team]);
    setSelectedTeam('');
    setError('');
  };

  const handleRemoveTeam = (teamToRemove) => {
    setSelectedTeams(selectedTeams.filter(team => team.id !== teamToRemove.id));
    
    // Si el equipo removido es el creador, resetear el creador
    if (teamToRemove.id === parseInt(creatorTeam)) {
      setCreatorTeam('');
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('El nombre de la liga es obligatorio');
      return false;
    }
    
    if (showCountry && !country.trim()) {
      setError('El país es obligatorio para este tipo de liga');
      return false;
    }
    
    if (!tipoLiga) {
      setError('El tipo de liga es obligatorio');
      return false;
    }
    
    if (selectedTeams.length < 2) {
      setError('Se necesitan al menos 2 equipos para crear una liga');
      return false;
    }
    
    if (!creatorTeam) {
      setError('Debes seleccionar un equipo como creador de la liga');
      return false;
    }

    return true;
  };

  const handleCreateLeague = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    setErrorDetails('');
    
    try {
      console.log("Creando liga...");
      // First create the league
      const leagueResponse = await axios.post('http://localhost:8000/leagues/', {
        name: name.trim(),
        country: showCountry ? country.trim() : null,
        tipo_liga: tipoLiga,
        max_teams: maxTeams,
        jornadas: jornadas,
        creator_id: parseInt(creatorTeam), // ID del equipo creador
        active: true,
        start_date: new Date().toISOString()
      });
      
      console.log("Liga creada:", leagueResponse.data);
      const leagueId = leagueResponse.data.id;
      
      // Then add teams to the league (except creator, which is added automatically)
      console.log(`Añadiendo ${selectedTeams.length} equipos a la liga...`);
      const teamsToAdd = selectedTeams.filter(team => team.id !== parseInt(creatorTeam));
      
      const teamPromises = teamsToAdd.map(team => 
        axios.post(`http://localhost:8000/leagues/${leagueId}/teams/${team.id}`)
      );
      
      await Promise.all(teamPromises);
      
      // Finally simulate the league
      console.log("Simulando liga...");
      await axios.post(`http://localhost:8000/leagues/${leagueId}/simulate`, {
        teams: selectedTeams.map(team => team.id),
        jornadas: jornadas
      });
      
      setSuccess('Liga creada y simulada exitosamente');
      setIsLoading(false);
      
      // Reset form
      setName('');
      setCountry('');
      setTipoLiga('');
      setMaxTeams(20);
      setJornadas(38);
      setSelectedTeams([]);
      setCreatorTeam('');
      
      // Call parent callback if provided
      if (onCreateLeague) {
        onCreateLeague(leagueId);
      }
      
    } catch (err) {
      console.error("Error al crear liga:", err);
      
      // Crear mensaje de error detallado
      let errorMsg = 'Error al crear la liga: ' + (err.response?.data?.detail || err.message);
      let details = '';
      
      // Obtener detalles si están disponibles
      if (err.response?.data) {
        details = JSON.stringify(err.response.data, null, 2);
      }
      
      setError(errorMsg);
      setErrorDetails(details);
      setIsLoading(false);
    }
  };

  const getAvailableTeamsOptions = () => {
    const selectedIds = selectedTeams.map(team => team.id);
    return availableTeams.filter(team => !selectedIds.includes(team.id));
  };

  // Ajustar número de jornadas según tipo de liga
  useEffect(() => {
    if (tipoLiga === "Torneo") {
      setJornadas(Math.min(jornadas, 10)); // Torneos con menos jornadas
    } else if (tipoLiga === "Batallas") {
      setJornadas(Math.min(jornadas, 5)); // Batallas con muy pocas jornadas
    }
  }, [tipoLiga]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SoccerIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Crear Nueva Liga
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            errorDetails && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setShowErrorDetails(!showErrorDetails)}
              >
                {showErrorDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
              </Button>
            )
          }
        >
          {error}
          {showErrorDetails && errorDetails && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1, overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {errorDetails}
              </Typography>
            </Box>
          )}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          label="Nombre de la Liga"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          error={error.includes('nombre')}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth required error={error.includes('tipo')}>
            <InputLabel>Tipo de Liga</InputLabel>
            <Select
              value={tipoLiga}
              onChange={(e) => setTipoLiga(e.target.value)}
              label="Tipo de Liga"
              startAdornment={<TrophyIcon sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              {tiposLiga.map(tipo => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {tipoLiga === 'Torneo' ? 'Formato de eliminación con menos jornadas' : 
               tipoLiga === 'Batallas' ? 'Enfrentamientos directos breves' : 
               tipoLiga === 'Liga Tactica' ? 'Competición centrada en estrategia' : 
               tipoLiga === 'Liga Interna' ? 'Competición entre miembros del mismo clan' : 
               'Selecciona el tipo de competición'}
            </FormHelperText>
          </FormControl>
          
          {showCountry && (
            <TextField
              label="País"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              required={showCountry}
              error={showCountry && error.includes('país')}
              InputProps={{
                startAdornment: <CountryIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Número Máximo de Equipos"
            type="number"
            value={maxTeams}
            onChange={(e) => setMaxTeams(Number(e.target.value))}
            inputProps={{ 
              min: 2, 
              max: tipoLiga === 'Torneo' ? 32 : tipoLiga === 'Batallas' ? 8 : 50 
            }}
            fullWidth
            helperText={
              tipoLiga === 'Torneo' ? 'Máximo 32 equipos para torneos' : 
              tipoLiga === 'Batallas' ? 'Máximo 8 equipos para batallas' : 
              'Entre 2 y 50 equipos'
            }
          />
          
          <TextField
            label="Número de Jornadas"
            type="number"
            value={jornadas}
            onChange={(e) => setJornadas(Number(e.target.value))}
            inputProps={{ 
              min: 2, 
              max: tipoLiga === 'Torneo' ? 10 : tipoLiga === 'Batallas' ? 5 : 100 
            }}
            fullWidth
            helperText={
              tipoLiga === 'Torneo' ? 'Máximo 10 jornadas para torneos' : 
              tipoLiga === 'Batallas' ? 'Máximo 5 jornadas para batallas' : 
              'Entre 2 y 100 jornadas'
            }
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <FormControl fullWidth required error={!!error && error.includes('creador')}>
            <InputLabel>Equipo Creador</InputLabel>
            <Select
              value={creatorTeam}
              onChange={(e) => setCreatorTeam(e.target.value)}
              label="Equipo Creador"
              disabled={isFetching || selectedTeams.length === 0}
              startAdornment={<PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              {selectedTeams.map(team => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name} {team.manager ? `(${team.manager})` : ''}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Selecciona el equipo que será el creador y administrador de la liga
            </FormHelperText>
          </FormControl>
        </Box>
      </Box>
      
      <Typography variant="subtitle1" sx={{ mb: 1, mt: 3 }}>
        Equipos de la Liga
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
        <FormControl fullWidth error={!!error && error.includes('equipo')}>
          <InputLabel>Seleccionar Equipo</InputLabel>
          <Select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            label="Seleccionar Equipo"
            disabled={isFetching || getAvailableTeamsOptions().length === 0}
          >
            {getAvailableTeamsOptions().map(team => (
              <MenuItem key={team.id} value={team.id}>
                {team.name} {team.manager ? `(${team.manager})` : ''}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {isFetching ? 'Cargando equipos...' : 
             getAvailableTeamsOptions().length === 0 ? 'No hay más equipos disponibles' : 
             `${selectedTeams.length}/${maxTeams} equipos seleccionados`}
          </FormHelperText>
        </FormControl>
        
        <IconButton 
          color="primary" 
          onClick={handleAddTeam}
          disabled={isFetching || !selectedTeam || selectedTeams.length >= maxTeams}
          sx={{ mt: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      
      {selectedTeams.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedTeams.map(team => (
            <Chip
              key={team.id}
              label={`${team.name} ${team.manager ? `(${team.manager})` : ''}`}
              onDelete={() => handleRemoveTeam(team)}
              color={team.id === parseInt(creatorTeam) ? "secondary" : "primary"}
              variant={team.id === parseInt(creatorTeam) ? "filled" : "outlined"}
              sx={team.id === parseInt(creatorTeam) ? { fontWeight: 'bold' } : {}}
            />
          ))}
        </Box>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateLeague}
        disabled={isLoading}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Creando Liga...' : 'Crear y Simular Liga'}
      </Button>
    </Paper>
  );
};

export default LeagueInput;