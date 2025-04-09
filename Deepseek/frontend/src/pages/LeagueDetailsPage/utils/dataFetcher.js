import axios from 'axios';

export const fetchLeagueData = async (leagueId) => {
  try {
    // Fetch league details
    const leagueResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}`);
    
    // Fetch matches
    const matchesResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/matches`);
    
    // Fetch standings
    const standingsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/standings`);
    
    // Fetch statistics (optional)
    let statistics = null;
    try {
      const statsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/statistics`);
      statistics = statsResponse.data;
    } catch (statsError) {
      console.log('No statistics available yet');
      // This is optional, so we don't throw an error
    }
    
    return {
      league: leagueResponse.data,
      matches: matchesResponse.data,
      standings: standingsResponse.data,
      statistics
    };
  } catch (error) {
    console.error('Error fetching league data:', error);
    throw error;
  }
};

export default { fetchLeagueData };