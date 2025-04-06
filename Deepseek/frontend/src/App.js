// Actualizar App.js para incluir la nueva ruta de plantillas de ligas

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import darkTheme  from './styles/theme';
import Navigation from './components/NavigationMenu';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import MatchesPage from './pages/MatchesPage';
import StandingsPage from './pages/StandingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LeaguesPage from './pages/LeaguesPage';
import LeagueDetailsPage from './pages/LeagueDetailsPage';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          background: `radial-gradient(circle at 10% 20%, ${darkTheme.palette.background.default} 0%, ${darkTheme.palette.background.paper} 90%)`,
          backgroundAttachment: 'fixed'
        }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/standings" element={<StandingsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              
              {/* Rutas para ligas */}
              <Route path="/leagues" element={<LeaguesPage />} />
              <Route path="/leagues/create" element={<LeaguesPage />} />
              <Route path="/leagues/templates" element={<LeaguesPage />} />
              <Route path="/leagues/:leagueId" element={<LeagueDetailsPage />} />
              
              {/* Estas rutas redirigen a la página principal de detalles con una pestaña específica */}
              <Route 
                path="/leagues/:leagueId/matches" 
                element={<Navigate to="/leagues/:leagueId" replace />} 
              />
              <Route 
                path="/leagues/:leagueId/standings" 
                element={<Navigate to="/leagues/:leagueId" replace />} 
              />
              <Route 
                path="/leagues/:leagueId/statistics" 
                element={<Navigate to="/leagues/:leagueId" replace />} 
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;