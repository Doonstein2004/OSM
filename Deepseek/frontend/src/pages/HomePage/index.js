import React, { useState } from 'react';
import { Container, useTheme } from '@mui/material';
import HeroSection from './HeroSection';
import FeatureCards from './FeatureCards';
import OverviewSection from './OverviewSection';

const HomePage = () => {
  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSimulate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <HeroSection theme={theme} />
      <FeatureCards theme={theme} />
      <OverviewSection theme={theme} />
    </Container>
  );
};

export default HomePage;