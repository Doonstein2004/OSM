import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper,
  Box,
  Breadcrumbs,
  Typography,
  Link,
  useTheme
} from '@mui/material';
import { 
  NavigateNext as BreadcrumbIcon 
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

// Components
import LeagueHeader from './components/LeagueHeader';
import ManagementSection from './components/ManagementSection';
import TabsNavigation from './components/TabsNavigation';
import LoadingView from './components/common/LoadingView';
import ErrorView from './components/common/ErrorView';

// Tabs
import MatchesTab from './components/tabs/MatchesTab';
import StandingsTab from './components/tabs/StandingsTab';
import StatisticsTab from './components/tabs/StatisticsTab';
import MatchResults from '../../components/match/index';
import LeagueSimulation from '../../components/league/simulation/index';

// Utils
import { fetchLeagueData } from './utils/dataFetcher';

const LeagueDetailsPage = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [league, setLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showManagers, setShowManagers] = useState(false);

  // Cargar datos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await fetchLeagueData(leagueId);
        setLeague(data.league);
        setMatches(data.matches);
        setStandings(data.standings);
        setStatistics(data.statistics);
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar los datos de la liga: ' + (err.response?.data?.detail || err.message));
        setIsLoading(false);
      }
    };

    loadData();
  }, [leagueId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const refreshData = async () => {
    try {
      const data = await fetchLeagueData(leagueId);
      setLeague(data.league);
      setMatches(data.matches);
      setStandings(data.standings);
      setStatistics(data.statistics);
    } catch (err) {
      console.error('Error al actualizar los datos:', err);
    }
  };

  // Vista de carga
  if (isLoading) {
    return <LoadingView />;
  }

  // Vista de error
  if (error) {
    return <ErrorView error={error} onBack={() => navigate('/leagues')} />;
  }

  // Liga no encontrada
  if (!league) {
    return <ErrorView warning="Liga no encontrada" onBack={() => navigate('/leagues')} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<BreadcrumbIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3, mt: 1 }}
      >
        <Link 
          component={RouterLink} 
          to="/"
          underline="hover"
          color="inherit"
        >
          Inicio
        </Link>
        <Link 
          component={RouterLink} 
          to="/leagues"
          underline="hover"
          color="inherit"
        >
          Ligas
        </Link>
        <Typography color="text.primary" fontWeight="medium">{league.name}</Typography>
      </Breadcrumbs>

      {/* League Header */}
      <LeagueHeader 
        league={league} 
        theme={theme} 
        showManagers={showManagers} 
        setShowManagers={setShowManagers} 
        onSimulate={() => setActiveTab(4)} 
      />

      {/* Management Section */}
      {showManagers && (
        <ManagementSection 
          leagueId={leagueId} 
          league={league} 
          onUpdate={refreshData} 
        />
      )}

      {/* Tabs Navigation */}
      <TabsNavigation 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
        theme={theme} 
      />
      
      {/* Tab Panels */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
        >
          {activeTab === 0 && <MatchesTab matches={matches} />}
        </Box>
        
        <Box
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
        >
          {activeTab === 1 && <StandingsTab standings={standings} />}
        </Box>
        
        <Box
          role="tabpanel"
          hidden={activeTab !== 2}
          id="tabpanel-2"
          aria-labelledby="tab-2"
        >
          {activeTab === 2 && <StatisticsTab stats={statistics} />}
        </Box>

        <Box
          role="tabpanel"
          hidden={activeTab !== 3}
          id="tabpanel-3"
          aria-labelledby="tab-3"
        >
          {activeTab === 3 && (
            <MatchResults 
              leagueId={leagueId} 
              onUpdateMatch={refreshData}
            />
          )}
        </Box>

        <Box
          role="tabpanel"
          hidden={activeTab !== 4}
          id="tabpanel-4"
          aria-labelledby="tab-4"
        >
          {activeTab === 4 && (
            <LeagueSimulation 
              leagueId={leagueId} 
              onSimulationComplete={() => {
                refreshData();
                setActiveTab(0);
              }}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LeagueDetailsPage;