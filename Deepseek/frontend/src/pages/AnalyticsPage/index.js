import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  useTheme
} from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import AnalyticsDashboard from '../../components/analytics/dashboard/index';

const AnalyticsPage = () => {
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
          <DashboardIcon 
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
            ESTADÍSTICAS DEL TORNEO
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary" paragraph>
          Explora datos analíticos sobre el torneo. Visualiza estadísticas detalladas de rendimiento, goles, posesión y otros indicadores clave que te ayudarán a entender mejor el desarrollo de la competición.
        </Typography>
      </Paper>

      <AnalyticsDashboard />
    </Container>
  );
};

export default AnalyticsPage;