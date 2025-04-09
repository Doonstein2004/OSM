import React from 'react';
import { Box, Grid, Stack } from '@mui/material';
import LeagueTeamManager from '../../../components/league/team-manager/index';
import LeagueCreatorManager from '../../../components/league/creator/index';
import LeagueDeletionManager from '../../../components/league/deletion/index';

const ManagementSection = ({ leagueId, league, onUpdate }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LeagueTeamManager 
            leagueId={leagueId} 
            onUpdate={onUpdate}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <LeagueCreatorManager 
              league={league} 
              onUpdate={onUpdate}
            />
            <LeagueDeletionManager 
              leagueId={leagueId}
              leagueName={league.name} 
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagementSection;