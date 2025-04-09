import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Obtiene los detalles de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Object>} Detalles de la liga
 * @throws {Error} Error si la operación falla
 */
export const fetchLeagueData = async (leagueId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}`);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al cargar datos de la liga: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Obtiene todos los equipos disponibles
 * 
 * @returns {Promise<Array>} Lista de equipos
 * @throws {Error} Error si la operación falla
 */
export const fetchTeams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams/`);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al cargar equipos: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Obtiene los equipos que pertenecen a una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} Lista de equipos en la liga
 * @throws {Error} Error si la operación falla
 */
export const fetchLeagueTeams = async (leagueId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}/teams`);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al cargar equipos de la liga: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Añade un equipo a una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {Error} Error si la operación falla
 */
export const addTeamToLeague = async (leagueId, teamId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/leagues/${leagueId}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al añadir equipo a la liga: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Elimina un equipo de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {Error} Error si la operación falla
 */
export const removeTeamFromLeague = async (leagueId, teamId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/leagues/${leagueId}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al eliminar equipo de la liga: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Simula una liga completa
 * 
 * @param {string|number} leagueId - ID de la liga
 * @param {Array<string|number>} teamIds - IDs de los equipos participantes
 * @param {number} jornadas - Número de jornadas a simular
 * @returns {Promise<Object>} Resultado de la simulación
 * @throws {Error} Error si la operación falla
 */
export const simulateLeague = async (leagueId, teamIds, jornadas) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/leagues/${leagueId}/simulate`, {
      teams: teamIds,
      jornadas: jornadas
    });
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al simular la liga: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Carga todos los datos iniciales para la simulación
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Object>} Objeto con todos los datos necesarios
 * @throws {Error} Error si alguna operación falla
 */
export const loadSimulationData = async (leagueId) => {
  try {
    // Usar Promise.all para hacer todas las peticiones en paralelo
    const [leagueData, allTeams, leagueTeams] = await Promise.all([
      fetchLeagueData(leagueId),
      fetchTeams(),
      fetchLeagueTeams(leagueId)
    ]);
    
    // Filtrar equipos disponibles
    const leagueTeamIds = leagueTeams.map(team => team.id);
    const availableTeams = allTeams.filter(team => !leagueTeamIds.includes(team.id));
    
    return {
      league: leagueData,
      selectedTeams: leagueTeams,
      availableTeams: availableTeams
    };
  } catch (error) {
    throw error; // Propagar el error ya formateado
  }
};