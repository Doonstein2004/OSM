import React from 'react';
import { Grid, Box, Typography, Card } from '@mui/material';
import MatchCard from './MatchCard';

/**
 * Componente que muestra la lista de partidos agrupados por fecha
 * 
 * @param {Object} props - Props del componente
 * @param {Array<Object>} props.matches - Lista de partidos
 * @param {Function} props.onEditMatch - Función para editar un partido
 * @param {Function} props.onDeleteMatch - Función para eliminar un partido
 * @returns {JSX.Element} Lista de partidos
 */
const MatchesList = ({ matches, onEditMatch, onDeleteMatch }) => {
  // Agrupar partidos por fecha
  const matchesByDate = matches.reduce((acc, match) => {
    const dateKey = match.date ? new Date(match.date).toLocaleDateString() : 'Sin fecha';
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(match);
    return acc;
  }, {});

  return (
    <Grid container spacing={3}>
      {Object.entries(matchesByDate).map(([date, dateMatches]) => (
        <Grid item xs={12} key={date}>
          <Box sx={{ 
            mb: 1, 
            pl: 2, 
            borderLeft: '4px solid',
            borderColor: 'primary.main'
          }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {date === 'Sin fecha' ? 'Sin fecha asignada' : date}
            </Typography>
          </Box>

          <Card variant="outlined">
            {dateMatches.map((match, index) => (
              <MatchCard 
                key={match.id}
                match={match}
                onEdit={onEditMatch}
                onDelete={onDeleteMatch}
                showDivider={index > 0}
              />
            ))}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MatchesList;