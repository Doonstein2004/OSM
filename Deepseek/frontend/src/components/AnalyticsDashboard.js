import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analysis/');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  if (!analytics) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography>No hay datos de análisis disponibles</Typography>
      </Paper>
    );
  }

  const resultData = [
    { name: 'Victorias Local', value: analytics.home_wins },
    { name: 'Victorias Visitante', value: analytics.away_wins },
    { name: 'Empates', value: analytics.draws },
  ];

  const formationData = Object.entries(analytics.most_common_formations.home).map(([name, value]) => ({
    name,
    value
  }));

  const styleEffectivenessData = Object.entries(analytics.most_effective_styles.home).map(([name, value]) => ({
    name,
    value: value * 100 // Convertir a porcentaje
  }));

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Análisis del Torneo
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Distribución de Resultados
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {resultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Formaciones Más Usadas (Local)
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Partidos" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Efectividad de Estilos (Goles por Partido)
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={styleEffectivenessData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: '% de conversión', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Conversión']} />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Conversión" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Estadísticas Clave
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography>Goles promedio por partido:</Typography>
              <Typography variant="h6">
                Local: {analytics.avg_home_goals.toFixed(2)} - Visitante: {analytics.avg_away_goals.toFixed(2)}
              </Typography>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography>Porcentaje de conversión de disparos:</Typography>
              <Typography variant="h6">
                Local: {analytics.shots_conversion.home.toFixed(2)}% - Visitante: {analytics.shots_conversion.away.toFixed(2)}%
              </Typography>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography>Posesión promedio en:</Typography>
              <Typography variant="h6">
                Victorias local: {analytics.possession_impact.home_win.toFixed(1)}%
              </Typography>
              <Typography variant="h6">
                Victorias visitante: {analytics.possession_impact.away_win.toFixed(1)}%
              </Typography>
              <Typography variant="h6">
                Empates: {analytics.possession_impact.draw.toFixed(1)}%
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AnalyticsDashboard;