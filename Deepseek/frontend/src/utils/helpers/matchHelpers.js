/**
 * Procesa los datos de un partido, estableciendo valores por defecto para campos que puedan ser nulos
 * @param {Object} match - Datos del partido
 * @returns {Object} - Partido con valores por defecto establecidos
 */
export const processMatchData = (match) => {
    return {
      ...match,
      home_team: match.home_team || { name: 'Equipo Desconocido', manager: 'Sin manager' },
      away_team: match.away_team || { name: 'Equipo Desconocido', manager: 'Sin manager' },
      home_formation: match.home_formation || 'No especificada',
      away_formation: match.away_formation || 'No especificada',
      home_style: match.home_style || 'No especificado',
      away_style: match.away_style || 'No especificado',
      home_kicks: match.home_kicks || 'No especificado',
      away_kicks: match.away_kicks || 'No especificado',
      home_attack: match.home_attack || '00-00-00',
      away_attack: match.away_attack || '00-00-00'
    };
  };
  
  /**
   * Verifica si un partido ya ha sido jugado (tiene resultados registrados)
   * @param {Object} match - Datos del partido
   * @returns {boolean} - true si el partido ya fue jugado, false en caso contrario
   */
  export const isMatchPlayed = (match) => {
    return match.home_goals !== null && 
           match.away_goals !== null && 
           match.home_possession !== null &&
           match.away_possession !== null;
  };
  
  /**
   * Valida los datos del partido antes de guardar
   * @param {Object} postMatchData - Datos del partido a validar
   * @returns {Object} - { isValid: boolean, errorMessage: string }
   */
  export const validateMatchData = (postMatchData) => {
    // Validar que la posesión sume 100%
    const homePoss = parseInt(postMatchData.home_possession);
    const awayPoss = parseInt(postMatchData.away_possession);
    
    if (isNaN(homePoss) || isNaN(awayPoss)) {
      return { 
        isValid: false, 
        errorMessage: 'La posesión debe ser un número válido para ambos equipos'
      };
    }
    
    if (homePoss + awayPoss !== 100) {
      return { 
        isValid: false, 
        errorMessage: 'La posesión local y visitante debe sumar 100%'
      };
    }
    
    // Validar que los goles y tiros sean números válidos
    const homeGoals = parseInt(postMatchData.home_goals);
    const awayGoals = parseInt(postMatchData.away_goals);
    const homeShots = parseInt(postMatchData.home_shots);
    const awayShots = parseInt(postMatchData.away_shots);
    
    if (isNaN(homeGoals) || isNaN(awayGoals) || isNaN(homeShots) || isNaN(awayShots)) {
      return { 
        isValid: false, 
        errorMessage: 'Los goles y tiros deben ser números válidos'
      };
    }
    
    return { isValid: true, errorMessage: '' };
  };