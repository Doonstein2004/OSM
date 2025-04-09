import axios from 'axios';
import { getDummyManagers } from '../models/managerData';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Actualiza el creador/manager de una liga
 * 
 * @param {string|number} leagueId - ID de la liga
 * @param {Object} managerData - Datos del manager
 * @param {string} managerData.manager_id - ID del manager
 * @param {string} managerData.manager_name - Nombre del manager
 * @returns {Promise<Object>} Respuesta de la API
 */
export const updateLeagueCreator = async (leagueId, managerData) => {
  if (!leagueId) {
    throw new Error('ID de liga es requerido');
  }
  
  const response = await axios.put(`${API_BASE_URL}/leagues/${leagueId}`, managerData);
  return response.data;
};

/**
 * Obtiene la lista de managers disponibles
 * Esta es una función simulada, en una aplicación real se obtendría de la API
 * 
 * @returns {Promise<Array>} Lista de managers
 */
export const fetchManagers = async () => {
  // En una implementación real, se haría una petición al backend:
  // const response = await axios.get(`${API_BASE_URL}/managers/`);
  // return response.data;
  
  // Simulamos una respuesta con datos dummy
  return getDummyManagers();
};