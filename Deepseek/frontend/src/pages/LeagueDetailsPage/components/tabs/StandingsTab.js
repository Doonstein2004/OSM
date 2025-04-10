import React from 'react';
import { Box, Typography, Card, useTheme } from '@mui/material';
import { Leaderboard as StandingsIcon } from '@mui/icons-material';

const StandingsTab = ({ standings }) => {
  const theme = useTheme();
  
  if (!standings || standings.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: 'text.secondary'
      }}>
        <StandingsIcon sx={{ fontSize: 60, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay tabla de posiciones disponible para esta liga
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Simula algunos partidos para generar la tabla de posiciones
        </Typography>
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '60px 2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', 
        width: '100%',
        bgcolor: theme.palette.primary.main,
        color: 'white',
        px: 2,
        py: 1.5,
      }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>#</Typography>
        <Typography variant="subtitle2" fontWeight="bold">Equipo</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>PJ</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>G</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>E</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>P</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>GF</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>GC</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>DG</Typography>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ textAlign: 'center' }}>PTS</Typography>
      </Box>
      
      {standings.map((team, index) => (
        <Box key={team.team_id} sx={{ 
          display: 'grid', 
          gridTemplateColumns: '60px 2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', 
          width: '100%',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: index < 3 ? 'success.50' : (index > (standings.length - 4) ? 'error.50' : 'transparent'),
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}>
          <Box sx={{ 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 
              index === 0 ? 'success.dark' : 
              index === 1 ? 'success.dark' : 
              index === 2 ? 'success.dark' : 
              index > (standings.length - 4) ? 'error.main' : 'text.primary'
          }}>
            {index + 1}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: team.team.manager?.trim() ? 'flex-start' : 'center',
              height: '100%',
              minHeight: '3rem', // Altura mínima para mantener consistencia
            }}
          >
            <Typography
              fontWeight={500}
              sx={{
                // Alineación horizontal siempre a la izquierda
                textAlign: 'left',
                // Asegura que el texto ocupe todo el ancho disponible
                alignSelf: 'stretch',
              }}
            >
              {team.team.name}
            </Typography>

            {/* Render condicional del manager */}
            {team.team.manager?.trim() && (
              <Box sx={{ height: '1.25rem' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {team.team.manager}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Typography sx={{ textAlign: 'center' }}>{team.played}</Typography>
          <Typography sx={{ textAlign: 'center', color: 'success.main', fontWeight: team.won > 0 ? 'bold' : 'normal' }}>{team.won}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.drawn}</Typography>
          <Typography sx={{ textAlign: 'center', color: 'error.main', fontWeight: team.lost > 0 ? 'bold' : 'normal' }}>{team.lost}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.goals_for}</Typography>
          <Typography sx={{ textAlign: 'center' }}>{team.goals_against}</Typography>
          <Typography sx={{ textAlign: 'center', color: team.goal_difference > 0 ? 'success.main' : team.goal_difference < 0 ? 'error.main' : 'text.primary', fontWeight: 'bold' }}>
            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
          </Typography>
          <Typography sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{team.points}</Typography>
        </Box>
      ))}
    </Card>
  );
};

export default StandingsTab;