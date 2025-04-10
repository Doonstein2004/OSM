import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import { 
  Leaderboard as StandingsIcon,
  Assessment as StatsIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon 
} from '@mui/icons-material';

const TabsNavigation = ({ activeTab, handleTabChange, theme }) => {
  return (
    <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        aria-label="league details tabs"
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.secondary.main,
            height: 3
          },
          '& .MuiTab-root': {
            py: 2
          }
        }}
      >
        <Tab 
          label="Calendario" 
          id="tab-0"
          aria-controls="tabpanel-0"
          icon={<TodayIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Tabla de Posiciones" 
          id="tab-1"
          aria-controls="tabpanel-1"
          icon={<StandingsIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Estadísticas" 
          id="tab-2"
          aria-controls="tabpanel-2"
          icon={<StatsIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Resultados" 
          id="tab-3"
          aria-controls="tabpanel-3"
          icon={<EditIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Simular" 
          id="tab-4"
          aria-controls="tabpanel-4"
          icon={<PlayIcon />}
          iconPosition="start"
        />
      </Tabs>
    </Paper>
  );
};

export default TabsNavigation;