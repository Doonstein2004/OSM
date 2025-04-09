import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

/**
 * Componente para mostrar equipos seleccionados
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.teams - Lista de equipos seleccionados
 * @param {number} props.maxTeams - Número máximo de equipos permitidos
 * @param {Function} props.onRemoveTeam - Función para eliminar un equipo
 * @returns {JSX.Element} Lista de equipos seleccionados
 */
const SelectedTeams = ({ teams, maxTeams, onRemoveTeam }) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Equipos Participantes ({teams.length}/{maxTeams || 0})
      </Typography>
      
      {teams.length > 0 ? (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {teams.map(team => (
            <Chip
              key={team.id}
              label={`${team.name} ${team.manager ? `(${team.manager})` : ''}`}
              onDelete={() => onRemoveTeam(team)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          No hay equipos seleccionados. Añade al menos 2 equipos para poder simular la liga.
        </Typography>
      )}
    </>
  );
};

export default SelectedTeams;