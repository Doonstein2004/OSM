import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import BarChartComponent from '../charts/BarChartComponent';
import { 
  prepareFormationsData, 
  preparePlayStylesData 
} from '../../../utils/dataTransformers';

/**
 * Tactics and Formations tab component showing tactical analysis
 * 
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @returns {JSX.Element} The TacticsFormations component
 */
const TacticsFormations = ({ analytics }) => {
  const theme = useTheme();
  
  const homeFormationData = prepareFormationsData(analytics.formations, 'home');
  const awayFormationData = prepareFormationsData(analytics.formations, 'away');
  const homeStyleData = preparePlayStylesData(analytics.play_styles, 'home');
  const awayStyleData = preparePlayStylesData(analytics.play_styles, 'away');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Formaciones Más Usadas (Local)
        </Typography>
        <BarChartComponent 
          data={homeFormationData} 
          dataKey="value" 
          fill="#8884d8"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Formaciones Más Usadas (Visitante)
        </Typography>
        <BarChartComponent 
          data={awayFormationData} 
          dataKey="value" 
          fill="#82ca9d"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Estilos Más Efectivos (Local)
        </Typography>
        <BarChartComponent 
          data={homeStyleData} 
          dataKey="value" 
          fill={theme.palette.primary.main}
          yAxisLabel="Goles por partido"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Estilos Más Efectivos (Visitante)
        </Typography>
        <BarChartComponent 
          data={awayStyleData} 
          dataKey="value" 
          fill={theme.palette.secondary.main}
          yAxisLabel="Goles por partido"
        />
      </Grid>
    </Grid>
  );
};

export default TacticsFormations;