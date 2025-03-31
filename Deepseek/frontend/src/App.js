import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import darkTheme from './styles/theme';
import NavigationMenu from './components/NavigationMenu';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import MatchesPage from './pages/MatchesPage';
import StandingsPage from './pages/StandingsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${darkTheme.palette.background.default} 0%, #101d2c 100%)`,
          backgroundAttachment: 'fixed'
        }}>
          <NavigationMenu />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/standings" element={<StandingsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;