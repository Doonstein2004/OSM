import React from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  IconButton, 
  Typography 
} from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';

/**
 * Selector de equipos para añadir a la liga
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.availableTeams - Equipos disponibles para añadir
 * @param {string|number} props.selectedTeam - ID del equipo seleccionado
 * @param {boolean} props.isLoading - Indica si está cargando
 * @param {boolean} props.hasError - Indica si hay error en la selección
 * @param {number} props.maxTeams - Número máximo de equipos permitidos
 * @param {number} props.currentTeamCount - Número actual de equipos seleccionados
 * @param {Function} props.onTeamChange - Función al cambiar equipo seleccionado
 * @param {Function} props.onAddTeam - Función para añadir equipo
 * @returns {JSX.Element} Selector de equipos
 */
const TeamSelector = ({ 
  availableTeams, 
  selectedTeam, 
  isLoading, 
  hasError, 
  maxTeams, 
  currentTeamCount, 
  onTeamChange, 
  onAddTeam 
}) => {
  // Verificar si se puede añadir más equipos
  const canAddMoreTeams = maxTeams && currentTeamCount < maxTeams;
  
  // Verificar si hay equipos disponibles
  const noTeamsAvailable = availableTeams.length === 0;
  
  // Determinar texto de ayuda
  const getHelperText = () => {
    if (isLoading) return 'Cargando equipos...';
    if (noTeamsAvailable) return 'No hay más equipos disponibles';
    if (!canAddMoreTeams) return `Límite de ${maxTeams} equipos alcanzado`;
    return `Añade equipos a la liga (mínimo 2 para simular)`;
  };
  
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
      <FormControl fullWidth error={hasError}>
        <InputLabel>Añadir Equipo</InputLabel>
        <Select
          value={selectedTeam}
          onChange={(e) => onTeamChange(e.target.value)}
          label="Añadir Equipo"
          disabled={isLoading || noTeamsAvailable || !canAddMoreTeams}
        >
          {availableTeams.map(team => (
            <MenuItem key={team.id} value={team.id}>
              {team.name} {team.manager ? `(${team.manager})` : ''}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {getHelperText()}
        </FormHelperText>
      </FormControl>
      
      <IconButton 
        color="primary" 
        onClick={onAddTeam}
        disabled={isLoading || !selectedTeam || !canAddMoreTeams}
        sx={{ mt: 1 }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default TeamSelector;