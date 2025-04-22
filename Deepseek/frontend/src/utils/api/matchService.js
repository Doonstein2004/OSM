import axios from 'axios';
import { processMatchData } from '../helpers/matchHelpers';

/**
 * Obtiene los partidos de una liga
 * @param {string} leagueId - ID de la liga
 * @returns {Promise<Array>} - Lista de partidos
 */
export const fetchLeagueMatches = async (leagueId) => {
  try {
    if (!leagueId || leagueId === 'undefined') {
      throw new Error('ID de liga no válido');
    }
    
    const response = await axios.get(`http://localhost:8000/leagues/${leagueId}/matches`);
    
    // Procesar cada partido para garantizar que todos los campos tengan valores válidos
    const processedMatches = response.data.map(match => processMatchData(match));
    
    return processedMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};


export const updateMatchComplete = async (matchId, matchData) => {
  try {
    const response = await axios.patch(`http://localhost:8000/matches/${matchId}/`, matchData);
    return response.data;
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
};

/**
 * Obtiene las jornadas disponibles de una lista de partidos
 * @param {Array} matches - Lista de partidos
 * @returns {Array} - Lista de jornadas disponibles
 */
export const getAvailableJornadas = (matches) => {
  if (!matches || matches.length === 0) {
    return [];
  }
  
  const uniqueJornadas = [...new Set(matches.map(match => match.jornada))];
  return uniqueJornadas.sort((a, b) => a - b);
};

/**
 * Actualiza los resultados de un partido
 * @param {string} matchId - ID del partido
 * @param {Object} resultsData - Datos de resultados a actualizar
 * @returns {Promise<Object>} - Partido actualizado
 */
export const updateMatchResults = async (matchId, resultsData) => {
  try {
    // Convertir los valores a números
    const updatedData = {
      home_possession: parseInt(resultsData.home_possession),
      away_possession: parseInt(resultsData.away_possession),
      home_shots: parseInt(resultsData.home_shots),
      away_shots: parseInt(resultsData.away_shots),
      home_goals: parseInt(resultsData.home_goals),
      away_goals: parseInt(resultsData.away_goals)
    };
    
    const response = await axios.patch(`http://localhost:8000/matches/${matchId}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating match results:', error);
    throw error;
  }
};