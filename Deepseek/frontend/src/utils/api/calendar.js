import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Obtiene el calendario de partidos de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} Lista de partidos
 */
export const fetchCalendarData = async (leagueId) => {
  if (!leagueId || leagueId === 'undefined') {
    throw new Error('ID de liga no válido');
  }
  
  const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}/calendar`);
  return response.data;
};

/**
 * Obtiene los equipos de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} Lista de equipos
 */
export const fetchTeams = async (leagueId) => {
  if (!leagueId || leagueId === 'undefined') {
    throw new Error('ID de liga no válido');
  }
  
  const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}/teams`);
  return response.data;
};

/**
 * Crea un nuevo partido
 * 
 * @param {Object} matchData - Datos del partido
 * @returns {Promise<Object>} Datos del partido creado
 */
export const createMatch = async (matchData) => {
  const response = await axios.post(`${API_BASE_URL}/matches/`, matchData);
  return response.data;
};

/**
 * Actualiza un partido existente
 * 
 * @param {string|number} matchId - ID del partido
 * @param {Object} matchData - Datos actualizados del partido
 * @returns {Promise<Object>} Datos del partido actualizado
 */
export const updateMatch = async (matchId, matchData) => {
  const response = await axios.put(`${API_BASE_URL}/matches/${matchId}`, matchData);
  return response.data;
};

/**
 * Elimina un partido
 * 
 * @param {string|number} matchId - ID del partido
 * @returns {Promise<void>}
 */
export const deleteMatch = async (matchId) => {
  await axios.delete(`${API_BASE_URL}/matches/${matchId}`);
};

/**
 * Genera un calendario automáticamente para la liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<void>}
 */
export const generateCalendar = async (leagueId) => {
  await axios.post(`${API_BASE_URL}/leagues/${leagueId}/generate-calendar`);
};