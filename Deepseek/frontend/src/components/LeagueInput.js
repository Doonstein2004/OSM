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
  Divider,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  AddCircle as AddIcon, 
  SportsSoccer as SoccerIcon,
  Public as CountryIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeagueInput = ({ onCreateLeague }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [showCountry, setShowCountry] = useState(false);
  const [country, setCountry] = useState('');
  const [tipoLiga, setTipoLiga] = useState('');
  const [maxTeams, setMaxTeams] = useState(20);
  const [jornadas, setJornadas] = useState(38);
  const [managerName, setManagerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  
  // Obtener el manager ID y nombre del local storage (del login)
  const [manager, setManager] = useState(() => {
    // En una aplicación real, estos datos vendrían de un sistema de autenticación
    const loggedUser = {
      id: localStorage.getItem('userId') || 'user123',
      name: localStorage.getItem('userName') || 'Usuario Actual'
    };
    return loggedUser;
  });

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
    
    if (!manager.id || !manager.name) {
      setError('No hay información del manager actual');
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
      // Crear la liga
      const leagueResponse = await axios.post('http://localhost:8000/leagues/', {
        name: name.trim(),
        country: showCountry ? country.trim() : null,
        tipo_liga: tipoLiga,
        max_teams: maxTeams,
        jornadas: jornadas,
        manager_id: manager.id,
        manager_name: manager.name,
        active: true,
        start_date: new Date().toISOString()
      });
      
      console.log("Liga creada:", leagueResponse.data);
      const leagueId = leagueResponse.data.id;
      
      setSuccess('Liga creada exitosamente. Ahora puedes añadir equipos y simular partidos.');
      setIsLoading(false);
      
      // Reset form
      setName('');
      setCountry('');
      setTipoLiga('');
      setMaxTeams(20);
      setJornadas(38);
      
      // Call parent callback if provided
      if (onCreateLeague) {
        onCreateLeague(leagueId);
      }
      
      // Opcional: redirigir a la página de detalles de la liga
      navigate(`/leagues/${leagueId}`);
      
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
        
        <TextField
          label="Manager de la Liga"
          value={manager.name}
          InputProps={{
            readOnly: true,
            startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          helperText="La liga será creada por el usuario actual"
          fullWidth
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Después de crear la liga, podrás añadir equipos y simular partidos desde la página de detalles.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateLeague}
        disabled={isLoading}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Creando Liga...' : 'Crear Liga'}
      </Button>
    </Paper>
  );
};

export default LeagueInput;