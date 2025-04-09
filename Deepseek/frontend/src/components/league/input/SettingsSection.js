import React from 'react';
import { Box, TextField } from '@mui/material';

/**
 * Sección para configurar equipos y jornadas de la liga
 * 
 * @param {Object} props - Props del componente
 * @param {number} props.maxTeams - Número máximo de equipos
 * @param {number} props.jornadas - Número de jornadas
 * @param {string} props.tipoLiga - Tipo de liga seleccionado
 * @param {Function} props.onMaxTeamsChange - Función para actualizar máximo de equipos
 * @param {Function} props.onJornadasChange - Función para actualizar jornadas
 * @param {boolean} props.hasError - Indica si hay error en esta sección
 * @returns {JSX.Element} Sección de configuración
 */
const SettingsSection = ({ 
  maxTeams, 
  jornadas, 
  tipoLiga, 
  onMaxTeamsChange, 
  onJornadasChange, 
  hasError 
}) => {
  // Determinar límites según el tipo de liga
  const getTeamsLimits = () => {
    switch (tipoLiga) {
      case 'Torneo':
        return { min: 2, max: 32, helperText: 'Máximo 32 equipos para torneos' };
      case 'Batallas':
        return { min: 2, max: 8, helperText: 'Máximo 8 equipos para batallas' };
      default:
        return { min: 2, max: 50, helperText: 'Entre 2 y 50 equipos' };
    }
  };
  
  const getJornadasLimits = () => {
    switch (tipoLiga) {
      case 'Torneo':
        return { min: 2, max: 10, helperText: 'Máximo 10 jornadas para torneos' };
      case 'Batallas':
        return { min: 2, max: 5, helperText: 'Máximo 5 jornadas para batallas' };
      default:
        return { min: 2, max: 100, helperText: 'Entre 2 y 100 jornadas' };
    }
  };
  
  const teamsLimits = getTeamsLimits();
  const jornadasLimits = getJornadasLimits();
  
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Número Máximo de Equipos"
        type="number"
        value={maxTeams}
        onChange={(e) => onMaxTeamsChange(Number(e.target.value))}
        inputProps={{ 
          min: teamsLimits.min, 
          max: teamsLimits.max
        }}
        fullWidth
        helperText={teamsLimits.helperText}
        error={hasError}
      />
      
      <TextField
        label="Número de Jornadas"
        type="number"
        value={jornadas}
        onChange={(e) => onJornadasChange(Number(e.target.value))}
        inputProps={{ 
          min: jornadasLimits.min, 
          max: jornadasLimits.max
        }}
        fullWidth
        helperText={jornadasLimits.helperText}
        error={hasError}
      />
    </Box>
  );
};

export default SettingsSection;