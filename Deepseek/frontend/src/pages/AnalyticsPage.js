// AnalyticsPage.js
import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AnalyticsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(to right, rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.6))',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box mb={3}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.light">
                Estadísticas y Análisis
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Visualización detallada de estadísticas del torneo
              </Typography>
            </Box>
            <AnalyticsDashboard fullPage={true} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;