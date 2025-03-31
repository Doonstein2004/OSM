import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import TeamInput from '../components/TeamInput';
import StandingsTable from '../components/StandingsTable';
import MatchResults from '../components/MatchResults';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSimulate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Simulador de Torneo de Fútbol
      </Typography>
      
      <TeamInput onSimulate={handleSimulate} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StandingsTable key={`standings-${refreshKey}`} />
        <MatchResults key={`matches-${refreshKey}`} />
        <AnalyticsDashboard key={`analytics-${refreshKey}`} />
      </Box>
    </Container>
  );
};

export default HomePage;