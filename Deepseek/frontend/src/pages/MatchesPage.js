// MatchesPage.js
import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Tabs, Tab } from '@mui/material';
import MatchResults from '../components/MatchResults';

const MatchesPage = () => {
  const [jornada, setJornada] = useState(null);
  
  // Supongamos que tienes 42 jornadas máximo
  const maxJornadas = 42;
  const jornadas = Array.from({ length: maxJornadas }, (_, i) => i + 1);
  
  const handleChange = (event, newValue) => {
    setJornada(newValue === 0 ? null : newValue);
  };

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
                Resultados de Partidos
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Visualiza los resultados de todos los partidos del torneo
              </Typography>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={jornada === null ? 0 : jornada} 
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ 
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3
                  }
                }}
              >
                <Tab 
                  label="Todos" 
                  value={0} 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: jornada === null ? 'primary.main' : 'text.secondary',
                    '&.Mui-selected': { color: 'primary.main' }
                  }}
                />
                {jornadas.map((j) => (
                  <Tab 
                    key={j} 
                    label={`Jornada ${j}`} 
                    value={j}
                    sx={{ 
                      fontWeight: 'bold', 
                      color: jornada === j ? 'primary.main' : 'text.secondary',
                      '&.Mui-selected': { color: 'primary.main' }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            
            <MatchResults jornada={jornada} fullPage={true} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchesPage;