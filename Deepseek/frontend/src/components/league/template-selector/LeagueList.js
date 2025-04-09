import React from 'react';
import {
  List,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Collapse,
  useTheme
} from '@mui/material';
import LeagueItem from './LeagueItem';
import LeagueTeamList from './LeagueTeamList';

/**
 * Componente que muestra la lista de ligas disponibles
 */
const LeagueList = ({
  leagues,
  isLoading,
  expandedLeague,
  onToggleExpand,
  onCreateLeague,
  leagueStats,
  loadingLeagues
}) => {
  const theme = useTheme();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!leagues || leagues.length === 0) {
    return (
      <Alert severity="info">
        No se encontraron ligas con los filtros seleccionados
      </Alert>
    );
  }
  
  return (
    <List sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 1,
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
      }
    }}>
      {leagues.map((league) => {
        const isExpanded = expandedLeague && expandedLeague.name === league.name;
        const isLoading = loadingLeagues[league.name];
        const stats = leagueStats[league.name]?.stats;
        
        return (
          <React.Fragment key={league.name}>
            <LeagueItem
              league={league}
              isExpanded={isExpanded}
              isLoading={isLoading}
              onToggleExpand={onToggleExpand}
              onCreateLeague={onCreateLeague}
              stats={stats}
              loadingStats={isLoading}
              theme={theme}
            />
            
            {/* Sección expandible con la lista de equipos */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                <LeagueTeamList 
                  league={expandedLeague} 
                  leagueStats={leagueStats}
                  isLoading={isLoading} 
                />
              </Box>
            </Collapse>
            
            <Divider component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default LeagueList;