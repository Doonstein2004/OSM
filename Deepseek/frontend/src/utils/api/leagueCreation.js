import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Crea una nueva liga
 * 
 * @param {Object} leagueData - Datos de la liga a crear
 * @param {string} leagueData.name - Nombre de la liga
 * @param {string|null} leagueData.country - País de la liga (opcional)
 * @param {string} leagueData.tipo_liga - Tipo de liga
 * @param {number} leagueData.max_teams - Número máximo de equipos
 * @param {number} leagueData.jornadas - Número de jornadas
 * @param {string} leagueData.manager_id - ID del manager
 * @param {string} leagueData.manager_name - Nombre del manager
 * @param {boolean} leagueData.active - Estado activo de la liga
 * @param {string} leagueData.start_date - Fecha de inicio (formato ISO)
 * @returns {Promise<Object>} Datos de la liga creada
 * @throws {Error} Error si la operación falla
 */
export const createLeague = async (leagueData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/leagues/`, leagueData);
    return response.data;
  } catch (error) {
    // Crear un error con detalles adicionales
    const errorMessage = 'Error al crear la liga: ' + (error.response?.data?.detail || error.message);
    const enhancedError = new Error(errorMessage);
    
    // Adjuntar datos adicionales al error
    enhancedError.details = error.response?.data || null;
    enhancedError.status = error.response?.status || null;
    
    throw enhancedError;
  }
};

/**
 * Formatea los datos del formulario para enviarlos a la API
 * 
 * @param {Object} formData - Datos del formulario
 * @param {Object} manager - Datos del manager
 * @returns {Object} Datos formateados para la API
 */
export const formatLeagueData = (formData, manager) => {
  const { name, country, showCountry, tipoLiga, maxTeams, jornadas } = formData;
  
  return {
    name: name.trim(),
    country: showCountry ? country.trim() : null,
    tipo_liga: tipoLiga,
    max_teams: maxTeams,
    jornadas: jornadas,
    manager_id: manager.id,
    manager_name: manager.name,
    active: true,
    start_date: new Date().toISOString()
  };
};