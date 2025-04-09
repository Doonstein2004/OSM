import React from 'react';
import { TableRow, TableCell, Typography } from '@mui/material';

/**
 * Componente que muestra una fila individual de equipo en la tabla de posiciones
 * @param {Object} team - Datos del equipo
 * @param {number} position - Posición del equipo en la tabla
 */
const StandingsRow = ({ team, position }) => {
  return (
    <TableRow hover>
      <TableCell>{position}</TableCell>
      <TableCell>
        {team.team_name}
        {team.team_manager && (
          <Typography variant="body2" color="text.secondary">
            ({team.team_manager ?? "Computadora"})
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">{team.played}</TableCell>
      <TableCell align="center">{team.wins}</TableCell>
      <TableCell align="center">{team.draws}</TableCell>
      <TableCell align="center">{team.losses}</TableCell>
      <TableCell align="center">{team.goals_for}</TableCell>
      <TableCell align="center">{team.goals_against}</TableCell>
      <TableCell align="center">{team.goal_difference}</TableCell>
      <TableCell align="center" sx={{ fontWeight: 'bold' }}>{team.points}</TableCell>
    </TableRow>
  );
};

export default StandingsRow;