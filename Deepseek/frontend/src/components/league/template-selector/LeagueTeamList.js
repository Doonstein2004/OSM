import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { parseValueToNumber } from '../../../utils/helpers/valueFormatters';

/**
 * Componente para mostrar la lista de equipos de una liga
 */
const LeagueTeamList = ({ league, leagueStats, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  if (!league || !league.teams || league.teams.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay información de equipos disponible
      </Typography>
    );
  }
  
  // Obtener estadísticas si están disponibles
  const stats = leagueStats[league.name]?.stats;
  
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="subtitle2" gutterBottom>
          Equipos de la Liga ({league.teams.length})
        </Typography>
        
        <Grid container spacing={1}>
          {/* Ordenar equipos de mayor a menor valor */}
          {league.teams
            .slice()
            .sort((a, b) => {
              const valueA = parseValueToNumber(a.value || '0');
              const valueB = parseValueToNumber(b.value || '0');
              return valueB - valueA; // Orden descendente
            })
            .map(team => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={team.name}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: stats && team.name === stats.highestValueTeam?.name 
                      ? 'success.50' 
                      : stats && team.name === stats.lowestValueTeam?.name 
                        ? 'error.50' 
                        : 'background.default'
                  }}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                      {team.name}
                    </Typography>
                    <Chip 
                      label={team.value || "N/A"} 
                      size="small"
                      color={
                        stats && team.name === stats.highestValueTeam?.name 
                          ? "success" 
                          : stats && team.name === stats.lowestValueTeam?.name 
                            ? "error" 
                            : "default"
                      }
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              );
            })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LeagueTeamList;