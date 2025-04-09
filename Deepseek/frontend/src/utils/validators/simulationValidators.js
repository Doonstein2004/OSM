/**
 * Valida si se puede añadir un equipo a la liga
 * 
 * @param {string|number} teamId - ID del equipo a añadir
 * @param {Array} selectedTeams - Equipos ya seleccionados
 * @param {Object} league - Datos de la liga
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateTeamAddition = (teamId, selectedTeams, league) => {
    if (!teamId) {
      return 'Selecciona un equipo primero';
    }
    
    if (selectedTeams.some(team => team.id === teamId)) {
      return 'Este equipo ya ha sido agregado a la liga';
    }
    
    if (league && selectedTeams.length >= league.max_teams) {
      return `No puedes agregar más de ${league.max_teams} equipos a esta liga`;
    }
    
    return null;
  };
  
  /**
   * Valida si se puede simular la liga
   * 
   * @param {Array} selectedTeams - Equipos seleccionados
   * @param {number} minTeams - Número mínimo de equipos requeridos (default: 2)
   * @returns {string|null} Mensaje de error o null si es válido
   */
  export const validateSimulation = (selectedTeams, minTeams = 2) => {
    if (!selectedTeams || selectedTeams.length < minTeams) {
      return `Se necesitan al menos ${minTeams} equipos para simular la liga`;
    }
    
    return null;
  };
  
  /**
   * Valida si hay suficientes equipos disponibles para completar una liga
   * 
   * @param {Array} selectedTeams - Equipos ya seleccionados
   * @param {Array} availableTeams - Equipos disponibles para añadir
   * @param {number} minTeams - Número mínimo de equipos requeridos (default: 2)
   * @returns {boolean} True si hay suficientes equipos (seleccionados + disponibles)
   */
  export const hasSufficientTeams = (selectedTeams, availableTeams, minTeams = 2) => {
    return (selectedTeams.length + availableTeams.length) >= minTeams;
  };