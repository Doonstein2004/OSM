import React from 'react';
import { Grid, Typography } from '@mui/material';
import LineChartComponent from '../charts/LineChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import { prepareJourneyTrendData } from '../../../utils/dataTransformers';

/**
 * Tournament Trends tab component showing trends over time
 * 
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @returns {JSX.Element} The TournamentTrends component
 */
const TournamentTrends = ({ analytics }) => {
  const journeyTrendData = prepareJourneyTrendData(analytics.by_jornada);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Evolución de Goles por Jornada
        </Typography>
        <LineChartComponent 
          data={journeyTrendData} 
          lines={[
            { dataKey: 'Goles Local', stroke: '#8884d8' },
            { dataKey: 'Goles Visitante', stroke: '#82ca9d' }
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Evolución de Posesión por Jornada
        </Typography>
        <LineChartComponent 
          data={journeyTrendData} 
          lines={[
            { dataKey: 'home_possession', stroke: '#ff7300', name: 'Posesión Local' },
            { dataKey: 'away_possession', stroke: '#413ea0', name: 'Posesión Visitante' }
          ]}
          yAxisConfig={{ domain: [0, 100] }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Distribución de Resultados por Jornada
        </Typography>
        <BarChartComponent 
          data={journeyTrendData}
          xAxisKey="name"
          dataKey="H"
          height={400}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          xAxisConfig={{
            angle: -45,
            textAnchor: "end",
            height: 80
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TournamentTrends;