import React, { useEffect, useState } from 'react';
import { Typography, Paper, LinearProgress, Tabs, Tab } from '@mui/material';
import TabPanel from '../common/TabPanel';
import GeneralSummary from './GeneralSummary';
import TeamComparison from './TeamComparison';
import TacticsFormations from './TacticsFormations';
import TournamentTrends from './TournamentTrends';
import { fetchAnalyticsData } from '../../../utils/api/analytics';

/**
 * Main Analytics Dashboard component
 * Orchestrates the dashboard tabs and data fetching
 * 
 * @returns {JSX.Element} The AnalyticsDashboard component
 */
const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const data = await fetchAnalyticsData();
        setAnalytics(data);
        
        // Initialize teams if data is available
        if (data && data.team_stats) {
          const teams = Object.keys(data.team_stats);
          if (teams.length > 0) {
            setSelectedTeam1(teams[0]);
            setSelectedTeam2(teams.length > 1 ? teams[1] : teams[0]);
          }
        }
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!analytics) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography>No hay datos de análisis disponibles</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Analítico del Torneo
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Resumen General" />
        <Tab label="Equipos" />
        <Tab label="Tácticas y Formaciones" />
        <Tab label="Tendencias del Torneo" />
      </Tabs>
      
      {/* Resumen General */}
      <TabPanel value={tabValue} index={0}>
        <GeneralSummary analytics={analytics} />
      </TabPanel>

      {/* Equipos */}
      <TabPanel value={tabValue} index={1}>
        <TeamComparison 
          analytics={analytics}
          selectedTeam1={selectedTeam1}
          selectedTeam2={selectedTeam2}
          onTeam1Change={setSelectedTeam1}
          onTeam2Change={setSelectedTeam2}
        />
      </TabPanel>

      {/* Tácticas y Formaciones */}
      <TabPanel value={tabValue} index={2}>
        <TacticsFormations analytics={analytics} />
      </TabPanel>

      {/* Tendencias del Torneo */}
      <TabPanel value={tabValue} index={3}>
        <TournamentTrends analytics={analytics} />
      </TabPanel>
    </Paper>
  );
};

export default AnalyticsDashboard;