import React from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@mui/material';
import MatchResultRow from './MatchResultRow';

/**
 * Componente que muestra la tabla de resultados de partidos
 */
const MatchResultsTable = ({ matches, onEditMatch }) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Local</TableCell>
            <TableCell align="center">Resultado</TableCell>
            <TableCell>Visitante</TableCell>
            <TableCell>Alineación/Estilo</TableCell>
            <TableCell>Posesión</TableCell>
            <TableCell>Tiros</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchResultRow 
                key={match.id} 
                match={match} 
                onEdit={onEditMatch}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No hay partidos disponibles para esta jornada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MatchResultsTable;