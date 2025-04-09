import { safeToFixed } from './formatters';

/**
 * Creates data for results distribution pie chart
 * 
 * @param {Object} analytics - The analytics data
 * @returns {Array<Object>} Formatted data for the pie chart
 */
export const prepareResultsDistributionData = (analytics) => {
  return [
    { name: 'Victorias Local', value: analytics.home_wins },
    { name: 'Victorias Visitante', value: analytics.away_wins },
    { name: 'Empates', value: analytics.draws },
  ];
};

/**
 * Creates data for formation charts
 * 
 * @param {Object} formations - The formations data
 * @param {string} type - 'home' or 'away'
 * @returns {Array<Object>} Formatted data for the chart
 */
export const prepareFormationsData = (formations, type) => {
  if (!formations || !formations[type] || !formations[type].most_common) {
    return [];
  }
  
  return Object.entries(formations[type].most_common)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 5);
};

/**
 * Creates data for play styles charts
 * 
 * @param {Object} playStyles - The play styles data
 * @param {string} type - 'home' or 'away'
 * @returns {Array<Object>} Formatted data for the chart
 */
export const preparePlayStylesData = (playStyles, type) => {
  if (!playStyles || !playStyles[type]) {
    return [];
  }
  
  const dataKey = type === 'home' ? 'home_goals' : 'away_goals';
  
  return Object.entries(playStyles[type][dataKey] || {})
    .map(([name, value]) => ({ 
      name, 
      value: parseFloat(safeToFixed(value, 2)) 
    }))
    .slice(0, 5);
};

/**
 * Creates data for journey trends charts
 * 
 * @param {Object} byJornada - The journey data
 * @returns {Array<Object>} Formatted data for the charts
 */
export const prepareJourneyTrendData = (byJornada) => {
  if (!byJornada || !byJornada.goals_trend) {
    return [];
  }
  
  return Object.entries(byJornada.goals_trend.home_goals || {})
    .map(([jornada, goals]) => ({
      name: `J${jornada}`,
      'Goles Local': goals,
      'Goles Visitante': byJornada.goals_trend.away_goals?.[jornada] || 0,
      'home_possession': byJornada.possession_trend?.home_possession?.[jornada] || 0,
      'away_possession': byJornada.possession_trend?.away_possession?.[jornada] || 0,
      ...(byJornada.results_distribution?.[jornada] || {})
    }));
};

/**
 * Creates team comparison data
 * 
 * @param {Object} teamStats - The team stats data
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @returns {Array<Object>} Data for comparison chart
 */
export const prepareTeamComparisonData = (teamStats, team1, team2) => {
  if (!teamStats || !team1 || !team2 || !teamStats[team1] || !teamStats[team2]) {
    return [];
  }
  
  const team1Stats = teamStats[team1];
  const team2Stats = teamStats[team2];
  
  return [
    { category: 'Victorias Local', [team1]: team1Stats.home.wins, [team2]: team2Stats.home.wins },
    { category: 'Victorias Visitante', [team1]: team1Stats.away.wins, [team2]: team2Stats.away.wins },
    { category: 'Goles Anotados (L)', [team1]: team1Stats.home.goals_for, [team2]: team2Stats.home.goals_for },
    { category: 'Goles Anotados (V)', [team1]: team1Stats.away.goals_for, [team2]: team2Stats.away.goals_for },
    { category: 'Posesión Media (L)', [team1]: team1Stats.home.avg_possession, [team2]: team2Stats.home.avg_possession },
    { category: 'Posesión Media (V)', [team1]: team1Stats.away.avg_possession, [team2]: team2Stats.away.avg_possession },
  ];
};

/**
 * Creates team radar chart data
 * 
 * @param {Object} teamStats - The team stats data
 * @param {string} teamName - Team name
 * @returns {Array<Object>} Data for radar chart
 */
export const prepareTeamRadarData = (teamStats, teamName) => {
  if (!teamStats || !teamName || !teamStats[teamName]) {
    return [];
  }
  
  const stats = teamStats[teamName];
  
  return [
    { subject: 'Victorias Local', A: stats.home.wins / (stats.home.played || 1) * 100 },
    { subject: 'Victorias Visitante', A: stats.away.wins / (stats.away.played || 1) * 100 },
    { subject: 'Goles Local', A: stats.home.goals_for / (stats.home.played || 1) * 10 },
    { subject: 'Goles Visitante', A: stats.away.goals_for / (stats.away.played || 1) * 10 },
    { subject: 'Posesión Local', A: stats.home.avg_possession },
    { subject: 'Posesión Visitante', A: stats.away.avg_possession },
    { subject: 'Conversión Tiros', A: (stats.home.shots_conversion + stats.away.shots_conversion) / 2 },
  ];
};