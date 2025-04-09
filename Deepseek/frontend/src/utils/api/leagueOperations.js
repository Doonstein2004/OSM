import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Elimina una liga por su ID
 * 
 * @param {string|number} leagueId - ID de la liga a eliminar
 * @returns {Promise<Object>} Respuesta de la API
 * @throws {Error} Error si la operación falla
 */
export const deleteLeague = async (leagueId) => {
  if (!leagueId) {
    throw new Error('ID de liga no válido');
  }
  
  const response = await axios.delete(`${API_BASE_URL}/leagues/${leagueId}`);
  return response.data;
};

/**
 * Genera el texto esperado para confirmar la eliminación de una liga
 * 
 * @param {string} leagueName - Nombre de la liga a eliminar
 * @returns {string} Texto de confirmación
 */
export const getExpectedConfirmationText = (leagueName) => {
  return `ELIMINAR ${leagueName}`;
};