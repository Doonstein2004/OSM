import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

/**
 * Componente que muestra el encabezado de la tabla de posiciones
 */
const StandingsHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Pos</TableCell>
        <TableCell>Equipo</TableCell>
        <TableCell align="center">PJ</TableCell>
        <TableCell align="center">G</TableCell>
        <TableCell align="center">E</TableCell>
        <TableCell align="center">P</TableCell>
        <TableCell align="center">GF</TableCell>
        <TableCell align="center">GC</TableCell>
        <TableCell align="center">DG</TableCell>
        <TableCell align="center">Pts</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default StandingsHeader;