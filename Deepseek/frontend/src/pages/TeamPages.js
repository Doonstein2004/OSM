// TeamsPage.js
import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import TeamInput from '../components/TeamInput';

const TeamsPage = () => {
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
                Gestión de Equipos
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Crea y gestiona los equipos para tu torneo de fútbol
              </Typography>
            </Box>
            <TeamInput fullPage={true} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeamsPage;