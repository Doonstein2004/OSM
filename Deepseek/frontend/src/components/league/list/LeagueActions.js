import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { 
  SportsSoccer as SoccerIcon, 
  Leaderboard as StandingsIcon, 
  Assessment as StatsIcon 
} from '@mui/icons-material';

/**
 * Componente con botones de acciones para una liga
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga
 * @param {Function} props.onViewMatches - Función para ver partidos
 * @param {Function} props.onViewStandings - Función para ver clasificación
 * @param {Function} props.onViewStats - Función para ver estadísticas
 * @returns {JSX.Element} Acciones de liga
 */
const LeagueActions = ({ leagueId, onViewMatches, onViewStandings, onViewStats }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Acciones
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          startIcon={<SoccerIcon />} 
          size="small"
          onClick={() => onViewMatches(leagueId)}
        >
          Partidos
        </Button>
        <Button 
          startIcon={<StandingsIcon />} 
          size="small"
          onClick={() => onViewStandings(leagueId)}
        >
          Tabla
        </Button>
        <Button 
          startIcon={<StatsIcon />} 
          size="small"
          onClick={() => onViewStats(leagueId)}
        >
          Estadísticas
        </Button>
      </CardActions>
    </Card>
  );
};

export default LeagueActions;