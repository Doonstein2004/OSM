import React, { useState, useEffect } from 'react';
import { Box, Alert } from '@mui/material';

// Componentes
import CalendarHeader from './CalendarHeader';
import ScheduleForm from './ScheduleForm';
import MatchesList from './MatchesList';
import MatchForm from './MatchForm';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

// Utilidades
import { 
  fetchCalendarData, 
  fetchTeams, 
  createMatch, 
  updateMatch, 
  deleteMatch, 
  generateCalendar 
} from '../../../utils/api/calendar';
import { validateMatchForm, prepareMatchData } from '../../../utils/validators/matchValidators';

/**
 * Componente principal del calendario de la liga
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga
 * @param {Function} props.onUpdate - Función a ejecutar cuando el calendario se actualiza
 * @returns {JSX.Element} Calendario de la liga
 */
const LeagueCalendar = ({ leagueId, onUpdate }) => {
  // Estados
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editScheduleMatch, setEditScheduleMatch] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    jornada: 1,
    date: '',
    time: ''
  });
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


  const handleOpenScheduleDialog = (match) => {
    setEditScheduleMatch(match);
    setScheduleForm({
      jornada: match.jornada,
      date: match.date ? match.date.split('T')[0] : '',
      time: match.time || ''
    });
    setScheduleDialogOpen(true);
  };

  // Función para manejar cambios en el formulario de programación
const handleScheduleFormChange = (name, value) => {
  setScheduleForm(prev => ({
    ...prev,
    [name]: value
  }));
};

// Función para guardar cambios en la programación
  const handleSubmitSchedule = async () => {
    try {
      const updatedMatchData = {
        jornada: scheduleForm.jornada,
        date: scheduleForm.date,
        time: scheduleForm.time
      };
      
      await updateMatch(editScheduleMatch.id, updatedMatchData);
      loadCalendarData();
      setScheduleDialogOpen(false);
      
      // Notificar al componente padre si es necesario
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al guardar programación:', error);
      alert('Error al guardar programación: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Cargar datos cuando cambia el leagueId
  useEffect(() => {
    if (leagueId && leagueId !== 'undefined') {
      loadCalendarData();
      loadTeams();
    }
  }, [leagueId]);

  // Cargar datos del calendario
  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!leagueId || leagueId === 'undefined') {
        setError('ID de liga no válido');
        setLoading(false);
        return;
      }

      const data = await fetchCalendarData(leagueId);
      setCalendar(data);

      // Extraer jornadas disponibles
      const uniqueJornadas = [...new Set(data.map(match => match.jornada))];
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

  // Cargar equipos
  const loadTeams = async () => {
    try {
      if (!leagueId || leagueId === 'undefined') return;

      const data = await fetchTeams(leagueId);
      setTeams(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  // Manejadores de eventos
  const handleJornadaChange = (value) => {
    setSelectedJornada(value);
  };

  const handleFormChange = (name, value) => {
    setMatchForm(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmitMatch = async () => {
    try {
      const validationError = validateMatchForm(matchForm);
      if (validationError) {
        alert(validationError);
        return;
      }

      const matchData = prepareMatchData(matchForm, leagueId);

      if (editMode) {
        // Actualizar partido existente
        await updateMatch(editMatchId, matchData);
      } else {
        // Crear nuevo partido
        await createMatch(matchData);
      }

      loadCalendarData();
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
      await deleteMatch(matchId);
      loadCalendarData();
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
      await generateCalendar(leagueId);
      loadCalendarData();
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

  // Renderizar componente
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <CalendarHeader 
        selectedJornada={selectedJornada}
        jornadas={jornadas}
        onJornadaChange={handleJornadaChange}
        onAddMatch={() => handleOpenDialog()}
        onGenerateCalendar={handleGenerateCalendar}
      />

      {loading ? (
        <LoadingState />
      ) : filteredMatches.length === 0 ? (
        <EmptyState onAddMatch={() => handleOpenDialog()} />
      ) : (
        <MatchesList 
          matches={filteredMatches} 
          onEditMatch={handleOpenDialog}
          onEditSchedule={handleOpenScheduleDialog}
          onDeleteMatch={handleDeleteMatch}
        />
      )}

      <MatchForm 
        open={dialogOpen}
        editMode={editMode}
        formData={matchForm}
        teams={teams}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitMatch}
        onChange={handleFormChange}
      />

        <ScheduleForm 
          open={scheduleDialogOpen}
          match={editScheduleMatch}
          jornadas={jornadas}
          formData={scheduleForm}
          onChange={handleScheduleFormChange}
          onClose={() => setScheduleDialogOpen(false)}
          onSubmit={handleSubmitSchedule}
        />

    </Box>
  );
};

export default LeagueCalendar;