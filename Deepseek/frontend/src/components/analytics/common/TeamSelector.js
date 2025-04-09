import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

/**
 * Component for selecting teams for comparison
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.teams - List of team names to select from
 * @param {string} props.team1 - Currently selected team 1
 * @param {string} props.team2 - Currently selected team 2
 * @param {Function} props.onTeam1Change - Callback when team 1 changes
 * @param {Function} props.onTeam2Change - Callback when team 2 changes
 * @returns {JSX.Element} The TeamSelector component
 */
const TeamSelector = ({ teams, team1, team2, onTeam1Change, onTeam2Change }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Equipo 1</InputLabel>
          <Select
            value={team1}
            label="Equipo 1"
            onChange={(e) => onTeam1Change(e.target.value)}
          >
            {teams.map(team => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Equipo 2</InputLabel>
          <Select
            value={team2}
            label="Equipo 2"
            onChange={(e) => onTeam2Change(e.target.value)}
          >
            {teams.map(team => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default TeamSelector;