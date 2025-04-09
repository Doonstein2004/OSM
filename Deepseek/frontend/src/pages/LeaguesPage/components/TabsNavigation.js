import React from 'react';
import { 
  Box, 
  Tabs, 
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  FormatListBulleted as ListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const TabsNavigation = ({ activeTab, handleTabChange, theme, isSmallScreen }) => {
  return (
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
  );
};

export default TabsNavigation;