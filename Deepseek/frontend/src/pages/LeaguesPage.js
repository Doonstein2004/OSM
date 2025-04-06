// Actualización de LeaguesPage.js para incluir el selector de plantillas

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  FormatListBulleted as ListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import LeagueInput from '../components/LeagueInput';
import LeagueList from '../components/LeagueList';
import LeagueTemplateSelector from '../components/LeagueTemplateSelector';
import { useLocation, useNavigate } from 'react-router-dom';

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
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(to right, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))` 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrophyIcon 
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
            GESTIÓN DE LIGAS
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Crea y gestiona ligas de fútbol para tus equipos. Puedes configurar parámetros como el tipo de liga, el número de equipos y jornadas, y ver estadísticas detalladas de cada liga.
        </Typography>
      </Paper>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="league tabs"
          variant={isSmallScreen ? "scrollable" : "fullWidth"}
          scrollButtons={isSmallScreen ? "auto" : false}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        >
          <Tab 
            label="Ligas Existentes" 
            id="leagues-tab-0"
            aria-controls="leagues-tabpanel-0"
            icon={<ListIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Crear Liga Manual" 
            id="leagues-tab-1"
            aria-controls="leagues-tabpanel-1"
            icon={<AddIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Ligas Predefinidas" 
            id="leagues-tab-2"
            aria-controls="leagues-tabpanel-2"
            icon={<DashboardIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 0}
        id="leagues-tabpanel-0"
        aria-labelledby="leagues-tab-0"
      >
        {activeTab === 0 && <LeagueList />}
      </Box>
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 1}
        id="leagues-tabpanel-1"
        aria-labelledby="leagues-tab-1"
      >
        {activeTab === 1 && <LeagueInput onCreateLeague={handleCreateLeague} />}
      </Box>
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 2}
        id="leagues-tabpanel-2"
        aria-labelledby="leagues-tab-2"
      >
        {activeTab === 2 && <LeagueTemplateSelector onLeagueCreate={handleCreateLeague} />}
      </Box>
    </Container>
  );
};

export default LeaguesPage;