import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  useTheme
} from '@mui/material';
import { SportsSoccer as SoccerIcon } from '@mui/icons-material';
import MatchResults from '../components/MatchResults';

const MatchesPage = () => {
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
          <SoccerIcon 
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
            RESULTADOS DE PARTIDOS
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary" paragraph>
          Revisa todos los resultados de los partidos del torneo. Para cada partido se muestra el equipo local, visitante y el resultado final, así como información adicional relevante.
        </Typography>
      </Paper>

      <MatchResults />
    </Container>
  );
};

export default MatchesPage;