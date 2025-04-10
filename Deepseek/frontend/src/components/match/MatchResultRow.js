import React from 'react';
import { TableRow, TableCell, Typography, Divider, Box, Button } from '@mui/material';
import { isMatchPlayed } from '../../utils/helpers/matchHelpers';

/**
 * Componente que representa una fila individual de un partido
 */
const MatchResultRow = ({ match, onEdit }) => {
  const played = isMatchPlayed(match);
  
  return (
    <TableRow 
      hover
      sx={played ? { backgroundColor: 'rgba(76, 175, 80, 0.1)' } : {}}
    >
      {/* Equipo Local */}
      <TableCell>
        <Typography variant="body1" fontWeight="bold">
          {match.home_team.name}
        </Typography>
        {match.home_team.manager && (
          <Typography variant="body2" color="text.secondary">
            ({match.home_team.manager})
          </Typography>
        )}
      </TableCell>
      
      {/* Resultado */}
      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
        <Typography variant="h6">
          {match.home_goals !== null ? match.home_goals : '-'} - {match.away_goals !== null ? match.away_goals : '-'}
        </Typography>
      </TableCell>
      
      {/* Equipo Visitante */}
      <TableCell>
        <Typography variant="body1" fontWeight="bold">
          {match.away_team.name}
        </Typography>
        {match.away_team.manager && (
          <Typography variant="body2" color="text.secondary">
            ({match.away_team.manager})
          </Typography>
        )}
      </TableCell>
      
      {/* Alineación y Estilo */}
      <TableCell>
        <Box>
        <Typography variant="body2">
          {match.home_formation}
        </Typography>
          <Typography variant="body2" color="text.secondary">
            ({match.home_style})
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
          {match.away_formation}
        </Typography>
          <Typography variant="body2" color="text.secondary">
            ({match.away_style})
          </Typography>
        </Box>
      </TableCell>

      {/* Avanzadas y Patadas */}
      <TableCell>
        <Box>
        <Typography variant="body2">
          {match.home_attack}
        </Typography>
          <Typography variant="body2" color="text.secondary">
            ({match.home_kicks})
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
          {match.away_attack}
        </Typography>
          <Typography variant="body2" color="text.secondary">
            ({match.away_kicks})
          </Typography>
        </Box>
      </TableCell>
      
      {/* Posesión */}
      <TableCell>
        <Box textAlign="center">
          <Typography variant="body2" color="primary">
            {match.home_possession !== null ? `${match.home_possession}%` : '-'}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="secondary">
            {match.away_possession !== null ? `${match.away_possession}%` : '-'}
          </Typography>
        </Box>
      </TableCell>
      
      {/* Tiros */}
      <TableCell>
        <Box textAlign="center">
          <Typography variant="body2">
            {match.home_shots !== null ? match.home_shots : '-'}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
            {match.away_shots !== null ? match.away_shots : '-'}
          </Typography>
        </Box>
      </TableCell>
      
      {/* Acciones */}
      <TableCell>
        <Button 
          size="small" 
          onClick={() => onEdit(match)}
          variant="outlined"
          color={played ? "success" : "primary"}
        >
          {played ? "Actualizar" : "Ingresar datos"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default MatchResultRow;