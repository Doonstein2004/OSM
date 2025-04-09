/**
 * Obtiene una lista de managers demo
 * En una aplicación real, esto vendría de un endpoint /managers
 * 
 * @returns {Array} Lista de managers
 */
export const getDummyManagers = () => {
  return [
    { id: 'user123', name: 'Usuario Actual' },
    { id: 'manager1', name: 'José Mourinho' },
    { id: 'manager2', name: 'Pep Guardiola' },
    { id: 'manager3', name: 'Carlo Ancelotti' },
    { id: 'manager4', name: 'Jürgen Klopp' },
    { id: 'manager5', name: 'Diego Simeone' }
  ];
};

/**
 * Formatea los datos del manager para enviar a la API
 * 
 * @param {Object} data - Datos del manager
 * @param {string} [data.managerId] - ID del manager
 * @param {string} [data.managerName] - Nombre del manager
 * @returns {Object} Datos formateados para la API
 */
export const formatManagerData = (data) => {
  // Si hay un ID de manager, necesitamos obtener el nombre
  if (data.managerId) {
    const managers = getDummyManagers();
    const selectedManager = managers.find(m => m.id === data.managerId);
    return {
      manager_id: data.managerId,
      manager: selectedManager?.name || ''
    };
  }
  
  // Si solo hay nombre, enviamos eso
  if (data.managerName) {
    return {
      manager: data.managerName
    };
  }
  
  // Si queremos eliminar el manager
  if (data.remove) {
    return {
      manager: null,
      manager_id: null
    };
  }
  
  return {};
};

/**
 * Inicializa estados para la edición de managers
 * 
 * @param {Array} teams - Lista de equipos
 * @returns {Object} Estado inicial
 */
export const initializeManagerState = (teams) => {
  const initialEditMode = {};
  const initialManagerInputs = {};
  
  teams.forEach(team => {
    initialEditMode[team.id] = false;
    initialManagerInputs[team.id] = team.manager || '';
  });
  
  return { initialEditMode, initialManagerInputs };
};