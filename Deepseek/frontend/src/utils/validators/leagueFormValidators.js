/**
 * Valida el nombre de la liga
 * 
 * @param {string} name - Nombre de la liga a validar
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateLeagueName = (name) => {
    if (!name || !name.trim()) {
      return 'El nombre de la liga es obligatorio';
    }
    
    if (name.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (name.trim().length > 50) {
      return 'El nombre no puede exceder 50 caracteres';
    }
    
    return null;
  };
  
  /**
   * Valida el tipo de liga
   * 
   * @param {string} tipoLiga - Tipo de liga a validar
   * @returns {string|null} Mensaje de error o null si es válido
   */
  export const validateLeagueType = (tipoLiga) => {
    if (!tipoLiga) {
      return 'El tipo de liga es obligatorio';
    }
    
    return null;
  };
  
  /**
   * Valida el país según el tipo de liga
   * 
   * @param {string} country - País a validar
   * @param {boolean} showCountry - Indica si el país es requerido
   * @returns {string|null} Mensaje de error o null si es válido
   */
  export const validateCountry = (country, showCountry) => {
    if (showCountry && (!country || !country.trim())) {
      return 'El país es obligatorio para este tipo de liga';
    }
    
    return null;
  };
  
  /**
   * Valida la información del manager
   * 
   * @param {Object} manager - Datos del manager
   * @param {string} manager.id - ID del manager
   * @param {string} manager.name - Nombre del manager
   * @returns {string|null} Mensaje de error o null si es válido
   */
  export const validateManager = (manager) => {
    if (!manager || !manager.id || !manager.name) {
      return 'No hay información del manager actual';
    }
    
    return null;
  };
  
  /**
   * Valida los valores de configuración
   * 
   * @param {number} maxTeams - Número máximo de equipos
   * @param {number} jornadas - Número de jornadas
   * @param {string} tipoLiga - Tipo de liga
   * @returns {string|null} Mensaje de error o null si es válido
   */
  export const validateSettings = (maxTeams, jornadas, tipoLiga) => {
    const minTeams = 2;
    let maxTeamsLimit = 50;
    let maxJornadasLimit = 100;
    
    // Ajustar límites según tipo de liga
    if (tipoLiga === 'Torneo') {
      maxTeamsLimit = 32;
      maxJornadasLimit = 10;
    } else if (tipoLiga === 'Batallas') {
      maxTeamsLimit = 8;
      maxJornadasLimit = 5;
    }
    
    if (maxTeams < minTeams || maxTeams > maxTeamsLimit) {
      return `El número de equipos debe estar entre ${minTeams} y ${maxTeamsLimit}`;
    }
    
    if (jornadas < 2 || jornadas > maxJornadasLimit) {
      return `El número de jornadas debe estar entre 2 y ${maxJornadasLimit}`;
    }
    
    return null;
  };
  
  /**
   * Valida el formulario completo de creación de liga
   * 
   * @param {Object} formData - Datos del formulario
   * @param {string} formData.name - Nombre de la liga
   * @param {string} formData.tipoLiga - Tipo de liga
   * @param {string} formData.country - País
   * @param {boolean} formData.showCountry - Indica si el país es requerido
   * @param {number} formData.maxTeams - Número máximo de equipos
   * @param {number} formData.jornadas - Número de jornadas
   * @param {Object} manager - Datos del manager
   * @returns {string|null} Mensaje de error o null si es válido
   */
  export const validateLeagueForm = (formData, manager) => {
    const nameError = validateLeagueName(formData.name);
    if (nameError) return nameError;
    
    const typeError = validateLeagueType(formData.tipoLiga);
    if (typeError) return typeError;
    
    const countryError = validateCountry(formData.country, formData.showCountry);
    if (countryError) return countryError;
    
    const managerError = validateManager(manager);
    if (managerError) return managerError;
    
    const settingsError = validateSettings(formData.maxTeams, formData.jornadas, formData.tipoLiga);
    if (settingsError) return settingsError;
    
    return null;
  };