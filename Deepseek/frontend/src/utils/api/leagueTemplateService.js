import axios from 'axios';

/**
 * Obtiene ligas de una plantilla con filtro opcional de tipo
 * @param {string} templateName - Nombre de la plantilla
 * @param {string|null} type - Tipo de liga a filtrar (opcional)
 * @returns {Promise<Object>} - Datos de las ligas
 */
export const fetchTemplateLeagues = async (templateName, type = null) => {
  try {
    let url = `http://localhost:8000/templates/${templateName}/leagues`;
    if (type) {
      url += `?type=${type}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching template leagues:', error);
    throw error;
  }
};

/**
 * Obtiene detalles de una liga específica
 * @param {string} templateName - Nombre de la plantilla
 * @param {string} leagueName - Nombre de la liga
 * @returns {Promise<Object>} - Datos detallados de la liga
 */
export const fetchLeagueDetails = async (templateName, leagueName) => {
  try {
    const encodedLeagueName = encodeURIComponent(leagueName);
    const response = await axios.get(`http://localhost:8000/templates/${templateName}/leagues/${encodedLeagueName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching league details for ${leagueName}:`, error);
    throw error;
  }
};

/**
 * Crea una liga basada en una plantilla
 * @param {string} leagueName - Nombre de la liga a crear
 * @param {string} tipoLiga - Tipo de liga (Liga Tactica, Liga Interna, Torneo, Batallas)
 * @param {string} managerId - ID del manager
 * @param {string} managerName - Nombre del manager
 * @returns {Promise<Object>} - Datos de la liga creada
 */
export const createLeagueFromTemplate = async (leagueName, tipoLiga, managerId, managerName) => {
  try {
    const response = await axios.post(`http://localhost:8000/templates/leagues/create-league`, {
      league_name: leagueName,
      tipo_liga: tipoLiga,
      manager_id: managerId,
      manager_name: managerName
    });
    return response.data;
  } catch (error) {
    console.error('Error creating league from template:', error);
    throw error;
  }
};