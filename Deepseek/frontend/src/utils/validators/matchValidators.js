/**
 * Valida el formulario de partido
 * 
 * @param {Object} matchData - Datos del partido a validar
 * @param {number} matchData.jornada - Número de jornada
 * @param {string|number} matchData.home_team_id - ID del equipo local
 * @param {string|number} matchData.away_team_id - ID del equipo visitante
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateMatchForm = (matchData) => {
    if (!matchData.jornada) {
      return 'La jornada es requerida';
    }
    
    if (!matchData.home_team_id) {
      return 'El equipo local es requerido';
    }
    
    if (!matchData.away_team_id) {
      return 'El equipo visitante es requerido';
    }
    
    if (matchData.home_team_id === matchData.away_team_id) {
      return 'El equipo local y visitante no pueden ser el mismo';
    }
    
    return null;
  };

  export const validateMatchData = (data) => {
    // Validar posesión
    const homePossession = parseInt(data.home_possession);
    const awayPossession = parseInt(data.away_possession);
    
    if (isNaN(homePossession) || isNaN(awayPossession)) {
      return { 
        isValid: false, 
        errorMessage: 'Los valores de posesión deben ser números válidos' 
      };
    }
    
    if (homePossession + awayPossession !== 100) {
      return { 
        isValid: false, 
        errorMessage: 'La suma de posesión debe ser 100%' 
      };
    }
    
    // Validar tiros y goles
    const homeShots = parseInt(data.home_shots);
    const awayShots = parseInt(data.away_shots);
    const homeGoals = parseInt(data.home_goals);
    const awayGoals = parseInt(data.away_goals);
    
    if (isNaN(homeShots) || isNaN(awayShots) || isNaN(homeGoals) || isNaN(awayGoals)) {
      return { 
        isValid: false, 
        errorMessage: 'Los valores de tiros y goles deben ser números válidos' 
      };
    }
    
    // Los goles no pueden ser más que los tiros
    if (homeGoals > homeShots) {
      return { 
        isValid: false, 
        errorMessage: 'Los goles del equipo local no pueden ser más que sus tiros' 
      };
    }
    
    if (awayGoals > awayShots) {
      return { 
        isValid: false, 
        errorMessage: 'Los goles del equipo visitante no pueden ser más que sus tiros' 
      };
    }
    
    return { isValid: true };
  };
  
  /**
   * Prepara los datos del partido para enviar al API
   * 
   * @param {Object} formData - Datos del formulario
   * @param {string|number} leagueId - ID de la liga
   * @returns {Object} Datos formateados para el API
   */
  export const prepareMatchData = (formData, leagueId) => {
    return {
      jornada: formData.jornada,
      home_team_id: formData.home_team_id,
      away_team_id: formData.away_team_id,
      league_id: leagueId,
      date: formData.date || null,
      time: formData.time || null
    };
  };