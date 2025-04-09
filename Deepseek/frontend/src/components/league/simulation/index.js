import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';

// Componentes
import SimulationHeader from './SimulationHeader';
import TeamSelector from './TeamSelector';
import SelectedTeams from './SelectedTeams';
import SimulationButton from './SimulationButton';
import LoadingState from './LoadingState';
import StatusMessages from './StatusMessages';

// Utilidades
import { 
  loadSimulationData, 
  addTeamToLeague, 
  removeTeamFromLeague, 
  simulateLeague 
} from '../../../utils/api/simulationService';
import { 
  validateTeamAddition, 
  validateSimulation 
} from '../../../utils/validators/simulationValidators';

/**
 * Componente principal para la simulación de una liga
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga
 * @param {Function} props.onSimulationComplete - Callback tras completar simulación
 * @returns {JSX.Element} Componente de simulación de liga
 */
const LeagueSimulation = ({ leagueId, onSimulationComplete }) => {
  // Estados
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [league, setLeague] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      if (!leagueId) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        // Cargar todos los datos necesarios
        const data = await loadSimulationData(leagueId);
        
        // Actualizar estados
        setLeague(data.league);
        setSelectedTeams(data.selectedTeams);
        setAvailableTeams(data.availableTeams);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  // Manejadores de eventos
  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    setError('');
  };

  const handleAddTeam = async () => {
    // Validar la adición del equipo
    const validationError = validateTeamAddition(selectedTeam, selectedTeams, league);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Encontrar el equipo seleccionado
      const team = availableTeams.find(team => team.id === selectedTeam);
      
      // Añadir a la API
      await addTeamToLeague(leagueId, team.id);
      
      // Actualizar estados locales
      setSelectedTeams([...selectedTeams, team]);
      setAvailableTeams(availableTeams.filter(t => t.id !== team.id));
      setSelectedTeam('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveTeam = async (teamToRemove) => {
    try {
      // Eliminar de la API
      await removeTeamFromLeague(leagueId, teamToRemove.id);
      
      // Actualizar estados locales
      setSelectedTeams(selectedTeams.filter(team => team.id !== teamToRemove.id));
      setAvailableTeams([...availableTeams, teamToRemove]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSimulateTournament = async () => {
    // Validar la simulación
    const validationError = validateSimulation(selectedTeams);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setIsSimulating(true);
      setError('');
      setSuccess('');
      
      // Llamar a la API de simulación
      await simulateLeague(
        leagueId, 
        selectedTeams.map(team => team.id), 
        league.jornadas
      );
      
      // Mostrar mensaje de éxito
      setSuccess(`Liga simulada exitosamente. Se han generado ${league.jornadas} jornadas de partidos.`);
      
      // Notificar al componente padre
      if (onSimulationComplete) {
        onSimulationComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  // Si está cargando inicialmente, mostrar estado de carga
  if (isLoading && !league) {
    return <LoadingState />;
  }

  // Renderizado principal
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <SimulationHeader leagueName={league?.name} />
      
      <StatusMessages 
        successMessage={success}
        errorMessage={error}
      />
      
      <SelectedTeams 
        teams={selectedTeams}
        maxTeams={league?.max_teams}
        onRemoveTeam={handleRemoveTeam}
      />
      
      <TeamSelector 
        availableTeams={availableTeams}
        selectedTeam={selectedTeam}
        isLoading={isLoading}
        hasError={!!error && error.includes('equipo')}
        maxTeams={league?.max_teams}
        currentTeamCount={selectedTeams.length}
        onTeamChange={handleTeamChange}
        onAddTeam={handleAddTeam}
      />
      
      <SimulationButton 
        onSimulate={handleSimulateTournament}
        isSimulating={isSimulating}
        isDisabled={selectedTeams.length < 2}
      />
    </Paper>
  );
};

export default LeagueSimulation;