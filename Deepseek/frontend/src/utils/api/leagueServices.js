import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Obtiene la lista de ligas disponibles
 * 
 * @returns {Promise<Array>} Lista de ligas
 * @throws {Error} Error si la operación falla
 */
export const fetchLeagues = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues/`);
    return response.data;
  } catch (error) {
    const errorMessage = 'Error al cargar ligas: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene los detalles de una liga específica
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Object>} Detalles de la liga
 * @throws {Error} Error si la operación falla
 */
export const fetchLeagueDetails = async (leagueId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}`);
    return response.data;
  } catch (error) {
    const errorMessage = 'Error al cargar detalles de la liga: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene la clasificación de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} Clasificación de la liga
 * @throws {Error} Error si la operación falla
 */
export const fetchLeagueStandings = async (leagueId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}/standings`);
    return response.data;
  } catch (error) {
    const errorMessage = 'Error al cargar clasificación: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMessage);
  }
};

/**
 * Carga los detalles completos de una liga (detalles + clasificación)
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Object>} Objeto con detalles y clasificación
 * @throws {Error} Error si alguna operación falla
 */
export const fetchLeagueFullDetails = async (leagueId) => {
  try {
    // Usar Promise.all para hacer ambas solicitudes en paralelo
    const [detailsResponse, standingsResponse] = await Promise.all([
      fetchLeagueDetails(leagueId),
      fetchLeagueStandings(leagueId)
    ]);
    
    return {
      details: detailsResponse,
      standings: standingsResponse
    };
  } catch (error) {
    throw error; // Propagar el error ya formateado
  }
};