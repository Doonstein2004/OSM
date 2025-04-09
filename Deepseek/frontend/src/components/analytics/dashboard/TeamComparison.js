import React from 'react';
import { Grid, Typography } from '@mui/material';
import BarChartComponent from '../charts/BarChartComponent';
import RadarChartComponent from '../charts/RadarChartComponent';
import TeamSelector from '../common/TeamSelector';
import { 
  prepareTeamComparisonData, 
  prepareTeamRadarData 
} from '../../../utils/dataTransformers';

/**
 * Team Comparison tab component for comparing team performances
 * 
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @param {string} props.selectedTeam1 - First selected team
 * @param {string} props.selectedTeam2 - Second selected team
 * @param {Function} props.onTeam1Change - Callback when team 1 changes
 * @param {Function} props.onTeam2Change - Callback when team 2 changes
 * @returns {JSX.Element} The TeamComparison component
 */
const TeamComparison = ({ 
  analytics, 
  selectedTeam1, 
  selectedTeam2, 
  onTeam1Change, 
  onTeam2Change 
}) => {
  const teams = analytics.team_stats ? Object.keys(analytics.team_stats).sort() : [];
  
  const comparisonData = prepareTeamComparisonData(
    analytics.team_stats, 
    selectedTeam1, 
    selectedTeam2
  );
  
  const radarData = prepareTeamRadarData(
    analytics.team_stats, 
    selectedTeam1
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Typography variant="h6" gutterBottom>
          Comparación de Equipos
        </Typography>
        
        <TeamSelector 
          teams={teams}
          team1={selectedTeam1}
          team2={selectedTeam2}
          onTeam1Change={onTeam1Change}
          onTeam2Change={onTeam2Change}
        />
        
        <BarChartComponent 
          data={comparisonData} 
          dataKey={selectedTeam1} 
          xAxisKey="category"
          height={400}
          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
          xAxisConfig={{
            angle: -45,
            textAnchor: "end",
            height: 100
          }}
        />
      </Grid>
      
      <Grid item xs={12} lg={6}>
        <Typography variant="h6" gutterBottom>
          Perfil de Rendimiento: {selectedTeam1}
        </Typography>
        
        <RadarChartComponent 
          data={radarData} 
          dataKey="A" 
          name={selectedTeam1}
        />
      </Grid>
    </Grid>
  );
};

export default TeamComparison;