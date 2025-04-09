import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import axios from 'axios';

// Componentes
import TeamForm from './TeamForm';
import TeamList from './TeamList';
import SimulateButton from './SimulateButton';

// Importar servicios existentes
import {
  fetchTeams,
  simulateLeague
} from '../../utils/api/simulationService';

/**
 * Componente principal para agregar equipos y simular un torneo/liga
 * @param {Function} onSimulate - Callback para cuando se completa la simulación
 * @param {string|number} leagueId - ID de la liga (opcional)
 */
const TeamInput = ({ onSimulate, leagueId }) => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allTeams, setAllTeams] = useState([]);

  // Si se proporciona un leagueId, podemos cargar equipos existentes
  useEffect(() => {
    if (leagueId) {
      const loadTeams = async () => {
        try {
          const teamsData = await fetchTeams();
          setAllTeams(teamsData);
        } catch (err) {
          setError('Error al cargar equipos existentes: ' + err.message);
        }
      };
      
      loadTeams();
    }
  }, [leagueId]);

  /**
   * Maneja la adición de un nuevo equipo a la lista
   * @param {Object} newTeam - Datos del nuevo equipo
   */
  const handleAddTeam = (newTeam) => {
    // Validar campos requeridos
    if (!newTeam.name.trim() || !newTeam.manager.trim()) {
      setError('El nombre del equipo y el manager no pueden estar vacíos');
      return;
    }
    
    // Verificar si ya existe un equipo con el mismo nombre
    if (teams.some(team => team.name === newTeam.name.trim())) {
      setError('Este equipo ya fue agregado');
      return;
    }
    
    // Agregar el equipo y limpiar errores
    setTeams([...teams, newTeam]);
    setError('');
  };

  /**
   * Elimina un equipo de la lista
   * @param {Object} teamToRemove - Equipo a eliminar
   */
  const handleRemoveTeam = (teamToRemove) => {
    setTeams(teams.filter(team => team !== teamToRemove));
  };

  /**
   * Inicia la simulación del torneo o liga
   */
  const handleSimulate = async () => {
    // Validar que haya suficientes equipos
    if (teams.length < 2) {
      setError('Se necesitan al menos 2 equipos para simular');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      if (leagueId) {
        // Si es una liga existente, usamos simulateLeague
        const teamIds = teams.map(team => team.id || team.name);
        await simulateLeague(leagueId, teamIds, 42);
      } else {
        // Si es un torneo nuevo, usamos el endpoint directo
        await axios.post('http://localhost:8000/simulate-tournament/', {
          teams: teams.map(team => ({
            name: team.name,
            manager: team.manager,
            clan: team.clan || null
          })),
          jornadas: 42,
          matches_per_jornada: 10
        });
      }
      
      // Notificar al componente padre
      if (onSimulate) {
        onSimulate();
      }
    } catch (err) {
      setError('Error al simular: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Equipos
      </Typography>
      
      <TeamForm 
        onAddTeam={handleAddTeam}
        error={error}
        existingTeams={allTeams}
      />
      
      <TeamList 
        teams={teams}
        onRemoveTeam={handleRemoveTeam}
      />
      
      <SimulateButton
        teams={teams}
        onSimulate={handleSimulate}
        isLoading={isLoading}
        mode={leagueId ? 'league' : 'tournament'}
      />
    </Paper>
  );
};

export default TeamInput;