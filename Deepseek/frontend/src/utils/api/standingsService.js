import axios from 'axios';

/**
 * Obtiene la tabla de posiciones desde la API
 * @returns {Promise<Array>} - Lista de equipos con sus estadísticas
 */
export const fetchStandings = async () => {
  try {
    const response = await axios.get('http://localhost:8000/standings/');
    return response.data;
  } catch (error) {
    console.error('Error fetching standings:', error);
    throw error;
  }
};