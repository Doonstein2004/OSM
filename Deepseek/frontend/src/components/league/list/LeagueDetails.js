import React from 'react';
import { Box, Grid, Collapse, LinearProgress } from '@mui/material';
import StandingsPodium from './StandingsPodium';
import LeagueActions from './LeagueActions';

/**
 * Componente que muestra los detalles expandibles de una liga
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga
 * @param {boolean} props.isExpanded - Indica si la sección está expandida
 * @param {Object} props.details - Detalles de la liga
 * @param {boolean} props.isLoading - Indica si está cargando los detalles
 * @param {Function} props.onViewMatches - Función para ver partidos
 * @param {Function} props.onViewStandings - Función para ver clasificación
 * @param {Function} props.onViewStats - Función para ver estadísticas
 * @returns {JSX.Element} Detalles de liga expandibles
 */
const LeagueDetails = ({ 
  leagueId, 
  isExpanded, 
  details, 
  isLoading,
  onViewMatches,
  onViewStandings,
  onViewStats
}) => {
  return (
    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
      <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={2}>
            {details?.standings && details.standings.length > 0 && (
              <Grid item xs={12} md={8}>
                <StandingsPodium standings={details.standings} />
              </Grid>
            )}
            
            <Grid item xs={12} md={details?.standings?.length > 0 ? 4 : 12}>
              <LeagueActions 
                leagueId={leagueId}
                onViewMatches={onViewMatches}
                onViewStandings={onViewStandings}
                onViewStats={onViewStats}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Collapse>
  );
};

export default LeagueDetails;