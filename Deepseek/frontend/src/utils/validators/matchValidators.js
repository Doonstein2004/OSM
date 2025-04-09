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