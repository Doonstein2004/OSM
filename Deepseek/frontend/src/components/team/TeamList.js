import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

/**
 * Componente que muestra la lista de equipos agregados
 * @param {Array} teams - Lista de equipos
 * @param {Function} onRemoveTeam - Función para eliminar un equipo
 */
const TeamList = ({ teams, onRemoveTeam }) => {
  if (!teams || teams.length === 0) {
    return null;
  }
  
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Equipos agregados ({teams.length}):
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {teams.map((team, index) => (
          <Chip
            key={`${team.name}-${index}`}
            label={`${team.name} (Manager: ${team.manager}, Clan: ${team.clan})`}
            onDelete={() => onRemoveTeam(team)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TeamList;