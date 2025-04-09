import axios from 'axios';
import { getDummyManagers } from '../models/managerData';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Obtiene los equipos de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} Lista de equipos
 * @throws {Error} Error si la operación falla
 */
export const fetchTeams = async (leagueId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leagues/${leagueId}/teams`);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al cargar equipos: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Actualiza el manager de un equipo
 * 
 * @param {string|number} teamId - ID del equipo
 * @param {Object} managerData - Datos del manager
 * @param {string|null} [managerData.manager] - Nombre del manager
 * @param {string|null} [managerData.manager_id] - ID del manager
 * @returns {Promise<Object>} Datos del equipo actualizado
 * @throws {Error} Error si la operación falla
 */
export const updateTeamManager = async (teamId, managerData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/teams/${teamId}`, managerData);
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al actualizar manager: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Elimina el manager de un equipo
 * 
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Object>} Datos del equipo actualizado
 * @throws {Error} Error si la operación falla
 */
export const removeManager = async (teamId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/teams/${teamId}`, {
      manager: null,
      manager_id: null
    });
    return response.data;
  } catch (error) {
    const errorMsg = 'Error al eliminar manager: ' + (error.response?.data?.detail || error.message);
    throw new Error(errorMsg);
  }
};

/**
 * Obtiene managers y equipos de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Object>} Datos de managers y equipos
 * @throws {Error} Error si la operación falla
 */
export const fetchTeamManagerData = async (leagueId) => {
  try {
    // Obtener equipos de la liga
    const teams = await fetchTeams(leagueId);
    
    // En una aplicación real, aquí se obtendría la lista de managers del backend
    // Por ahora, usamos datos dummy para la demo
    const managers = getDummyManagers();
    
    return { teams, managers };
  } catch (error) {
    throw error; // Propagar el error ya formateado
  }
};