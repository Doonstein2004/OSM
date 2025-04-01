import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  useTheme
} from '@mui/material';
import { Groups as TeamsIcon } from '@mui/icons-material';
import TeamInput from '../components/TeamInput';

const TeamsPage = () => {
  const theme = useTheme();
  const handleSimulate = () => {
    // La simulación se manejará desde aquí
    window.location.href = '/';
  };

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
          <TeamsIcon 
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
            GESTIÓN DE EQUIPOS
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary" paragraph>
          Configura los equipos que participarán en el torneo. Puedes agregar equipos, establecer sus atributos y luego simular el torneo completo para ver los resultados.
        </Typography>
      </Paper>

      <TeamInput onSimulate={handleSimulate} />
    </Container>
  );
};

export default TeamsPage;