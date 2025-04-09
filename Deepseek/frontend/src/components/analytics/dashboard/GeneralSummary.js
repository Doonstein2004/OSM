import React from 'react';
import { Grid, Typography } from '@mui/material';
import PieChartComponent from '../charts/PieChartComponent';
import KeyStatsCard from '../common/KeyStatsCard';
import { prepareResultsDistributionData } from '../../../utils/dataTransformers';
import { safeToFixed } from '../../../utils/formatters';

/**
 * General Summary tab component showing overall tournament statistics
 * 
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @returns {JSX.Element} The GeneralSummary component
 */
const GeneralSummary = ({ analytics }) => {
  const resultData = prepareResultsDistributionData(analytics);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Distribución de Resultados
        </Typography>
        <PieChartComponent data={resultData} dataKey="value" />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Estadísticas Clave
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <KeyStatsCard 
              title="Partidos Totales" 
              value={analytics.total_matches} 
            />
          </Grid>
          
          <Grid item xs={12}>
            <KeyStatsCard 
              title="Goles promedio por partido" 
              value={`Local: ${safeToFixed(analytics.avg_home_goals, 2)} - Visitante: ${safeToFixed(analytics.avg_away_goals, 2)}`} 
              variant="h6" 
            />
          </Grid>
          
          <Grid item xs={12}>
            <KeyStatsCard 
              title="Porcentaje de conversión de disparos"
              value={`Local: ${safeToFixed(analytics.effectiveness?.shots_conversion?.home, 2)}% - Visitante: ${safeToFixed(analytics.effectiveness?.shots_conversion?.away, 2)}%`} 
              variant="h6" 
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralSummary;