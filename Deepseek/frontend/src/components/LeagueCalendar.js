import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  SportsSoccer as SoccerIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  DeleteOutline as DeleteIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';

const LeagueCalendar = ({ leagueId, onUpdate }) => {
  const [calendar, setCalendar] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJornada, setSelectedJornada] = useState(1);
  const [jornadas, setJornadas] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [matchForm, setMatchForm] = useState({
    jornada: 1,
    home_team_id: '',
    away_team_id: '',
    date: '',
    time: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editMatchId, setEditMatchId] = useState(null);

  useEffect(() => {
    if (leagueId && leagueId !== 'undefined') {
      fetchCalendarData();
      fetchTeams();
    }
  }, [leagueId]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!leagueId || leagueId === 'undefined') {
        setError('ID de liga no válido');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:8000/leagues/${leagueId}/calendar`);
      setCalendar(response.data);

      // Extraer jornadas disponibles
      const uniqueJornadas = [...new Set(response.data.map(match => match.jornada))];
      setJornadas(uniqueJornadas.sort((a, b) => a - b));

      if (uniqueJornadas.length > 0) {
        setSelectedJornada(Math.min(...uniqueJornadas));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar el calendario:', error);
      setError('Error al cargar el calendario: ' + (error.response?.data?.detail || error.message));
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      if (!leagueId || leagueId === 'undefined') return;

      const response = await axios.get(`http://localhost:8000/leagues/${leagueId}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  const handleJornadaChange = (event) => {
    setSelectedJornada(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMatchForm({
      ...matchForm,
      [name]: value
    });
  };

  const handleOpenDialog = (match = null) => {
    if (match) {
      // Modo edición
      setEditMode(true);
      setEditMatchId(match.id);
      setMatchForm({
        jornada: match.jornada,
        home_team_id: match.home_team.id,
        away_team_id: match.away_team.id,
        date: match.date ? match.date.split('T')[0] : '',
        time: match.time || ''
      });
    } else {
      // Modo creación
      setEditMode(false);
      setEditMatchId(null);
      setMatchForm({
        jornada: selectedJornada,
        home_team_id: '',
        away_team_id: '',
        date: '',
        time: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const validateMatchForm = () => {
    if (!matchForm.jornada) return 'La jornada es requerida';
    if (!matchForm.home_team_id) return 'El equipo local es requerido';
    if (!matchForm.away_team_id) return 'El equipo visitante es requerido';
    if (matchForm.home_team_id === matchForm.away_team_id) 
      return 'El equipo local y visitante no pueden ser el mismo';
    return null;
  };

  const handleSubmitMatch = async () => {
    try {
      const validationError = validateMatchForm();
      if (validationError) {
        alert(validationError);
        return;
      }

      const matchData = {
        jornada: matchForm.jornada,
        home_team_id: matchForm.home_team_id,
        away_team_id: matchForm.away_team_id,
        league_id: leagueId,
        date: matchForm.date || null,
        time: matchForm.time || null
      };

      if (editMode) {
        // Actualizar partido existente
        await axios.put(`http://localhost:8000/matches/${editMatchId}`, matchData);
      } else {
        // Crear nuevo partido
        await axios.post(`http://localhost:8000/matches/`, matchData);
      }

      fetchCalendarData();
      handleCloseDialog();
      
      // Notificar al componente padre si es necesario
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al guardar el partido:', error);
      alert('Error al guardar el partido: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('¿Estás seguro de eliminar este partido?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/matches/${matchId}`);
      fetchCalendarData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al eliminar el partido:', error);
      alert('Error al eliminar el partido: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleGenerateCalendar = async () => {
    if (!window.confirm('¿Estás seguro de generar automáticamente el calendario? Esto puede reemplazar partidos existentes.')) return;
    
    try {
      setLoading(true);
      await axios.post(`http://localhost:8000/leagues/${leagueId}/generate-calendar`);
      fetchCalendarData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al generar el calendario:', error);
      alert('Error al generar el calendario: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Filtrar partidos por jornada seleccionada
  const filteredMatches = calendar.filter(match => match.jornada === selectedJornada);

  // Agrupar por fecha
  const matchesByDate = filteredMatches.reduce((acc, match) => {
    const dateKey = match.date ? new Date(match.date).toLocaleDateString() : 'Sin fecha';
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(match);
    return acc;
  }, {});

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Calendario de Partidos
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="jornada-select-label">Jornada</InputLabel>
            <Select
              labelId="jornada-select-label"
              value={selectedJornada || ''}
              label="Jornada"
              onChange={handleJornadaChange}
            >
              {jornadas.map(jornada => (
                <MenuItem key={jornada} value={jornada}>Jornada {jornada}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="small"
          >
            Agregar Partido
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={handleGenerateCalendar}
            size="small"
          >
            Generar Calendario
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Cargando calendario...
          </Typography>
        </Box>
      ) : filteredMatches.length === 0 ? (
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
            No hay partidos programados para esta jornada
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Agregar Partido
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(matchesByDate).map(([date, dateMatches]) => (
            <Grid item xs={12} key={date}>
              <Box sx={{ 
                mb: 1, 
                pl: 2, 
                borderLeft: '4px solid',
                borderColor: 'primary.main'
              }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {date === 'Sin fecha' ? 'Sin fecha asignada' : date}
                </Typography>
              </Box>

              <Card variant="outlined">
                {dateMatches.map((match, index) => (
                  <React.Fragment key={match.id}>
                    {index > 0 && <Divider />}
                    <CardContent sx={{ py: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={5} textAlign="right">
                          <Box sx={{ p: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {match.home_team.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {match.home_formation || 'Formación no definida'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={2}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center',
                            mx: 'auto',
                            textAlign: 'center'
                          }}>
                            <Chip 
                              label={match.time || 'Hora no definida'} 
                              size="small"
                              color="primary"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              vs
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={5}>
                          <Box sx={{ p: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {match.away_team.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {match.away_formation || 'Formación no definida'}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Tooltip title="Editar partido">
                              <IconButton size="small" onClick={() => handleOpenDialog(match)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar partido">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDeleteMatch(match.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </React.Fragment>
                ))}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para crear/editar partido */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Partido' : 'Agregar Nuevo Partido'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name="jornada"
              label="Jornada"
              type="number"
              value={matchForm.jornada}
              onChange={handleInputChange}
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
            />
            
            <FormControl fullWidth>
              <InputLabel id="home-team-label">Equipo Local</InputLabel>
              <Select
                labelId="home-team-label"
                name="home_team_id"
                value={matchForm.home_team_id}
                label="Equipo Local"
                onChange={handleInputChange}
              >
                {teams.map(team => (
                  <MenuItem key={`home-${team.id}`} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="away-team-label">Equipo Visitante</InputLabel>
              <Select
                labelId="away-team-label"
                name="away_team_id"
                value={matchForm.away_team_id}
                label="Equipo Visitante"
                onChange={handleInputChange}
              >
                {teams.map(team => (
                  <MenuItem key={`away-${team.id}`} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              name="date"
              label="Fecha"
              type="date"
              value={matchForm.date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              name="time"
              label="Hora"
              type="time"
              value={matchForm.time}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitMatch} 
            variant="contained" 
            color="primary"
            startIcon={<CheckIcon />}
          >
            {editMode ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeagueCalendar;