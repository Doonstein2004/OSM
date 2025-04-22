import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';

// Componentes
import JornadaSelector from './JornadaSelector';
import MatchResultsTable from './MatchResultsTable';
import ResultsDialog from './ResultsDialog';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

// Servicios y utilidades
import { fetchLeagueMatches, getAvailableJornadas, updateMatchComplete } from '../../utils/api/matchService';
import { validateMatchData } from '../../utils/helpers/matchHelpers';

/**
 * Componente principal que muestra los resultados de partidos de una liga
 * @param {string} leagueId - ID de la liga
 * @param {Function} onUpdateMatch - Callback para cuando un partido es actualizado
 */
const MatchResults = ({ leagueId, onUpdateMatch }) => {
  // Estados para datos
  const [matches, setMatches] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para edición
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [postMatchData, setPostMatchData] = useState({
    home_possession: '',
    away_possession: '',
    home_shots: '',
    away_shots: '',
    home_goals: '',
    away_goals: '',
    home_formation: '',
    away_formation: '',
    home_style: '',
    away_style: '',
    home_attack: '',
    away_attack: '',
    home_kicks: '',
    away_kicks: ''
  });

  // Cargar partidos cuando cambia el leagueId
  useEffect(() => {
    if (leagueId && leagueId !== 'undefined') {
      loadMatches();
    }
  }, [leagueId]);

  /**
   * Carga los partidos de la liga actual
   */
  const loadMatches = async () => {
    try {
      if (!leagueId || leagueId === 'undefined') {
        setError('ID de liga no válido');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      
      // Obtener y procesar los partidos
      const matchesData = await fetchLeagueMatches(leagueId);
      setMatches(matchesData);
      
      // Obtener jornadas disponibles
      const availableJornadas = getAvailableJornadas(matchesData);
      setJornadas(availableJornadas);
      
      // Seleccionar la última jornada por defecto
      if (availableJornadas.length > 0) {
        setSelectedJornada(Math.max(...availableJornadas));
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Error al cargar los partidos: ' + (error.response?.data?.detail || error.message));
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio de jornada seleccionada
   */
  const handleJornadaChange = (event) => {
    setSelectedJornada(event.target.value);
  };

  /**
   * Abre el diálogo de edición para un partido
   */
  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setPostMatchData({
      home_possession: match.home_possession || '',
      away_possession: match.away_possession || '',
      home_shots: match.home_shots || '',
      away_shots: match.away_shots || '',
      home_goals: match.home_goals || '',
      away_goals: match.away_goals || '',
      home_formation: match.home_formation || '',
      away_formation: match.away_formation || '',
      home_style: match.home_style || '',
      away_style: match.away_style || '',
      home_attack: match.home_attack || '',
      away_attack: match.away_attack || '',
      home_kicks: match.home_kicks || '',
      away_kicks: match.away_kicks || ''
    });
    setDialogOpen(true);
  };

  /**
   * Cierra el diálogo de edición
   */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMatch(null);
  };

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Solo permitir entrada numérica
    if (isNaN(value) && value !== '') {
      return;
    }
    
    setPostMatchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Guarda los resultados del partido editado
   */
  const handleSaveResults = async () => {
    try {
      // Validar datos antes de guardar
      const validation = validateMatchData(postMatchData);
      if (!validation.isValid) {
        alert(validation.errorMessage);
        return;
      }

      // Preparar todos los campos para actualizar
    const updateData = {
      home_possession: parseInt(postMatchData.home_possession) || 0,
      away_possession: parseInt(postMatchData.away_possession) || 0,
      home_shots: parseInt(postMatchData.home_shots) || 0,
      away_shots: parseInt(postMatchData.away_shots) || 0,
      home_goals: parseInt(postMatchData.home_goals) || 0,
      away_goals: parseInt(postMatchData.away_goals) || 0,
      // Campos avanzados
      home_formation: postMatchData.home_formation || '',
      away_formation: postMatchData.away_formation || '',
      home_style: postMatchData.home_style || '',
      away_style: postMatchData.away_style || '',
      home_attack: postMatchData.home_attack || '',
      away_attack: postMatchData.away_attack || '',
      home_kicks: postMatchData.home_kicks || '',
      away_kicks: postMatchData.away_kicks || ''
    };
      
      // Actualizar resultados del partido
      await updateMatchComplete(editingMatch.id, updateData);
      
      // Recargar datos y cerrar diálogo
      await loadMatches();
      handleCloseDialog();
      
      // Notificar al componente padre si es necesario
      if (onUpdateMatch) {
        onUpdateMatch();
      }
    } catch (error) {
      console.error('Error updating match results:', error);
      alert('Error al guardar los resultados del partido: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Filtrar partidos por jornada seleccionada
  const filteredMatches = selectedJornada 
    ? matches.filter(match => match.jornada === selectedJornada)
    : [];

  // Si hay error, mostrar solo el mensaje de error
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Resultados de Partidos
        </Typography>
        
        <JornadaSelector
          jornadas={jornadas}
          selectedJornada={selectedJornada}
          onJornadaChange={handleJornadaChange}
          disabled={loading || jornadas.length === 0}
        />
      </Box>
      
      {loading ? (
        <LoadingState message="Cargando partidos..." />
      ) : (
        <>
          {matches.length === 0 ? (
            <EmptyState
              title="No hay partidos disponibles para esta liga"
              subtitle="Utiliza la pestaña 'Simular' para generar partidos"
            />
          ) : (
            <MatchResultsTable 
              matches={filteredMatches}
              onEditMatch={handleEditMatch}
            />
          )}
        </>
      )}

      <ResultsDialog
        open={dialogOpen}
        match={editingMatch}
        postMatchData={postMatchData}
        onInputChange={handleInputChange}
        onClose={handleCloseDialog}
        onSave={handleSaveResults}
      />
    </>
  );
};

export default MatchResults;