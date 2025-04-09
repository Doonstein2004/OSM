/**
 * Convierte valor en formato legible (ej: "30,3M") a número
 * @param {string} valueStr - Valor en formato legible
 * @returns {number} - Valor numérico
 */
export const parseValueToNumber = (valueStr) => {
    try {
      if (!valueStr) return 0;
      
      const cleanStr = valueStr.replace(/\s/g, '').replace(',', '.');
      let multiplier = 1;
      
      if (cleanStr.endsWith('M')) {
        multiplier = 1000000;
        return parseFloat(cleanStr.slice(0, -1)) * multiplier;
      } else if (cleanStr.endsWith('K')) {
        multiplier = 1000;
        return parseFloat(cleanStr.slice(0, -1)) * multiplier;
      }
      
      return parseFloat(cleanStr);
    } catch (e) {
      return 0;
    }
  };
  
  /**
   * Formatea un número a formato de valor (ej: "30.3M")
   * @param {number} num - Número a formatear
   * @returns {string} - Valor formateado
   */
  export const formatValue = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };
  
  /**
   * Calcula estadísticas de valor para la liga
   * @param {Object} league - Datos de la liga
   * @returns {Object|null} - Estadísticas calculadas o null si no hay datos
   */
  export const calculateValueStats = (league) => {
    if (!league || !league.teams || league.teams.length === 0) {
      return null;
    }
    
    const teams = league.teams;
    let highestValue = 0;
    let highestValueTeam = null;
    let lowestValue = Number.MAX_VALUE;
    let lowestValueTeam = null;
    let totalValue = 0;
    let teamsWithValue = 0;
    
    teams.forEach(team => {
      if (team.value) {
        const valueNum = parseValueToNumber(team.value);
        
        if (valueNum > highestValue) {
          highestValue = valueNum;
          highestValueTeam = team;
        }
        
        if (valueNum < lowestValue) {
          lowestValue = valueNum;
          lowestValueTeam = team;
        }
        
        totalValue += valueNum;
        teamsWithValue++;
      }
    });
    
    if (teamsWithValue === 0) return null;
    
    const avgValue = totalValue / teamsWithValue;
    const valueDifference = highestValue - lowestValue;
    
    return {
      highestValueTeam,
      lowestValueTeam,
      avgValue,
      valueDifference,
      totalValue,
      teamsWithValue,
      avgValueFormatted: formatValue(avgValue),
      valueDifferenceFormatted: formatValue(valueDifference)
    };
  };