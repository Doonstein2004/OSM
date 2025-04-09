import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { MonetizationOn as MoneyIcon } from '@mui/icons-material';

/**
 * Componente para mostrar estadísticas de valor de una liga
 */
const ValueStatistics = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <CircularProgress size={16} />
      </Box>
    );
  }
  
  if (!stats) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay estadísticas disponibles
      </Typography>
    );
  }
  
  return (
    <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
        <Typography variant="body2" noWrap title={`${stats.highestValueTeam?.name} (${stats.highestValueTeam?.value})`}>
          Mayor: {stats.highestValueTeam?.value} ({stats.highestValueTeam?.name})
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'error.main' }} />
        <Typography variant="body2" noWrap title={`${stats.lowestValueTeam?.name} (${stats.lowestValueTeam?.value})`}>
          Menor: {stats.lowestValueTeam?.value} ({stats.lowestValueTeam?.name})
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'info.main' }} />
        <Typography variant="body2" noWrap>
          Prom: {stats.avgValueFormatted}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.main' }} />
        <Typography variant="body2" noWrap>
          Dif: {stats.valueDifferenceFormatted}
        </Typography>
      </Box>
    </Box>
  );
};

export default ValueStatistics;