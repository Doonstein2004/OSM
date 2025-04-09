import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  useTheme
} from '@mui/material';
import { Leaderboard as LeaderboardIcon } from '@mui/icons-material';
import StandingsTable from '../../components/standings/index';

const StandingsPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(to right, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))` 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LeaderboardIcon 
            sx={{ 
              mr: 2, 
              fontSize: 40, 
              color: theme.palette.secondary.main 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            color="primary"
            sx={{
              fontWeight: 700,
              background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TABLA DE POSICIONES
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary" paragraph>
          Consulta la clasificación actualizada de los equipos en el torneo. La tabla muestra los puntos obtenidos, partidos jugados, victorias, empates, derrotas, goles a favor y en contra, y diferencia de goles.
        </Typography>
      </Paper>

      <StandingsTable />
    </Container>
  );
};

export default StandingsPage;