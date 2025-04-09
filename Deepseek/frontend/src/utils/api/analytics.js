import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Fetches analytics data from the API
 * 
 * @returns {Promise<Object>} The analytics data
 * @throws {Error} If the API request fails
 */
export const fetchAnalyticsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};