// frontend/src/pages/LeaguesPage/index.js

import React, { useState } from 'react';
import { 
  Container, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LeagueTemplateSelector from '../../components/league/template-selector/index';
import LeagueList from '../../components/league/list/index';
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes
import Header from './components/Header';
import TabsNavigation from './components/TabsNavigation';

const LeaguesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Determinar la pestaña activa basada en la ruta
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/leagues/create') return 1;
    if (location.pathname === '/leagues/templates') return 2;
    return 0;
  });

  // Actualizar la URL cuando se cambia de pestaña
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) navigate('/leagues');
    if (newValue === 1) navigate('/leagues/create');
    if (newValue === 2) navigate('/leagues/templates');
  };

  const handleCreateLeague = (leagueId) => {
    // Switch to league list tab after creation
    setActiveTab(0);
    navigate('/leagues');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Header theme={theme} />
      
      <TabsNavigation 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
        theme={theme} 
        isSmallScreen={isSmallScreen} 
      />

      <Box
        role="tabpanel"
        hidden={activeTab !== 0}
        id="leagues-tabpanel-0"
        aria-labelledby="leagues-tab-0"
      >
        {activeTab === 0 && (
          <LeagueList onCreateLeague={() => handleTabChange(null, 1)} />
        )}
      </Box>
  
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 1}
        id="leagues-tabpanel-1"
        aria-labelledby="leagues-tab-1"
      >
        {activeTab === 1 && <LeagueTemplateSelector onLeagueCreate={handleCreateLeague} />}
      </Box>
    </Container>
  );
};

export default LeaguesPage;