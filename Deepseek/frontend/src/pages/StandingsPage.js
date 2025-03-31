// StandingsPage.js
import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import StandingsTable from '../components/StandingsTable';

const StandingsPage = () => {
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
                Tabla de Clasificación
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Clasificación general del torneo
              </Typography>
            </Box>
            <StandingsTable fullPage={true} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StandingsPage;