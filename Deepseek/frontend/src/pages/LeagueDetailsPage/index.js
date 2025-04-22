import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import ResultsDialog from '../../components/match/ResultsDialog';
import MatchResults from '../../components/match/index';
import LeagueSimulation from '../../components/league/simulation/index';
import ScheduleForm from '../../components/league/calendar/ScheduleForm';

// Utils
import { fetchLeagueData } from './utils/dataFetcher';
import { updateMatch } from '../../utils/api/calendar';

const LeagueDetailsPage = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [allTeams, setAllTeams] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [league, setLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showManagers, setShowManagers] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    jornada: 1,
    home_team_id: '',
    away_team_id: '',
    date: '',
    time: ''
  });
  const [matchForm, setMatchForm] = useState({
    home_goals: '',
    away_goals: '',
    home_shots: '',
    away_shots: '',
    home_possession: '',
    away_possession: '',
    home_formation: '',
    away_formation: '',
    home_style: '',
    away_style: '',
    home_attack: '',
    away_attack: '',
    home_kicks: '',
    away_kicks: ''
  });

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

  // Cargar equipos al inicio junto con los otros datos
useEffect(() => {
  const loadTeams = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/teams/`);
      setAllTeams(response.data);
    } catch (err) {
      console.error('Error al cargar equipos:', err);
    }
  };
  
  if (!isLoading) {
    loadTeams();
  }
}, [isLoading]);

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

  // Funciones para gestionar la edición de partidos
  const handleEditSchedule = (match) => {
    setCurrentMatch(match);
    setScheduleForm({
      jornada: match.jornada,
      home_team_id: match.home_team_id || match.home_team.id,
      away_team_id: match.away_team_id || match.away_team.id,
      date: match.date ? match.date.split('T')[0] : '',
      time: match.time || ''
    });
    setScheduleDialogOpen(true);
  };
  
  const handleEditMatch = (match) => {
    setCurrentMatch(match);
    setMatchForm({
      home_goals: match.home_goals || '',
      away_goals: match.away_goals || '',
      home_shots: match.home_shots || '',
      away_shots: match.away_shots || '',
      home_possession: match.home_possession || '',
      away_possession: match.away_possession || '',
      home_formation: match.home_formation || '',
      away_formation: match.away_formation || '',
      home_style: match.home_style || '',
      away_style: match.away_style || '',
      home_attack: match.home_attack || '',
      away_attack: match.away_attack || '',
      home_kicks: match.home_kicks || '',
      away_kicks: match.away_kicks || ''
    });
    setEditDialogOpen(true);
  };
  
  const handleScheduleChange = (name, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMatchChange = (e) => {
    const { name, value } = e.target;
    setMatchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSchedule = async () => {
    try {
      // Validar que los equipos sean diferentes
    if (scheduleForm.home_team_id === scheduleForm.away_team_id) {
      alert('El equipo local y visitante no pueden ser el mismo');
      return;
    }
      await updateMatch(currentMatch.id, {
        jornada: scheduleForm.jornada,
        home_team_id: scheduleForm.home_team_id,
        away_team_id: scheduleForm.away_team_id,
        date: scheduleForm.date,
        time: scheduleForm.time
      });
      
      // Recargar datos
      refreshData();
      setScheduleDialogOpen(false);
    } catch (err) {
      console.error('Error al guardar programación:', err);
      alert('Error al guardar programación: ' + (err.response?.data?.detail || err.message));
    }
  };
  
  const handleSaveMatch = async () => {
    try {
      await updateMatch(currentMatch.id, matchForm);
      
      // Recargar datos
      refreshData();
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error al guardar datos del partido:', err);
      alert('Error al guardar datos del partido: ' + (err.response?.data?.detail || err.message));
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
          {activeTab === 0 && (
            <MatchesTab 
              matches={matches}
              onEditSchedule={handleEditSchedule}
              onEditMatch={handleEditMatch}
            />
          )}
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
      {/* Agregar diálogos de edición */}
      <ScheduleForm
        open={scheduleDialogOpen}
        match={currentMatch}
        jornadas={Array.from({ length: league?.jornadas || 0 }, (_, i) => i + 1)}
        teams={allTeams}
        formData={scheduleForm}
        onChange={handleScheduleChange}
        onClose={() => setScheduleDialogOpen(false)}
        onSubmit={handleSaveSchedule}
      />
      
      <ResultsDialog
        open={editDialogOpen}
        match={currentMatch}
        postMatchData={matchForm}
        onInputChange={handleMatchChange}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveMatch}
      />
    </Container>
  );
};

export default LeagueDetailsPage;