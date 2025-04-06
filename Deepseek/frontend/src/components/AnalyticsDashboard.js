import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useTheme
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

const safeToFixed = (num, digits = 2) => {
  if (num === undefined || num === null || isNaN(num)) {
    return 'N/A';
  }
  return Number(num).toFixed(digits);
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analysis/');
        setAnalytics(response.data);
        
        if (response.data && response.data.team_stats) {
          const teams = Object.keys(response.data.team_stats);
          if (teams.length > 0) {
            setSelectedTeam1(teams[0]);
            setSelectedTeam2(teams.length > 1 ? teams[1] : teams[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  // Preparación de datos
  const resultData = [
    { name: 'Victorias Local', value: analytics.home_wins },
    { name: 'Victorias Visitante', value: analytics.away_wins },
    { name: 'Empates', value: analytics.draws },
  ];

  const homeFormationData = Object.entries(analytics.formations?.home?.most_common || {})
    .map(([name, value]) => ({ name, value })).slice(0, 5);

  const awayFormationData = Object.entries(analytics.formations?.away?.most_common || {})
    .map(([name, value]) => ({ name, value })).slice(0, 5);

  const homeStyleData = Object.entries(analytics.play_styles?.home?.home_goals || {})
    .map(([name, value]) => ({ name, value: parseFloat(safeToFixed(value, 2)) })).slice(0, 5);

  const awayStyleData = Object.entries(analytics.play_styles?.away?.away_goals || {})
    .map(([name, value]) => ({ name, value: parseFloat(safeToFixed(value, 2)) })).slice(0, 5);

  const journeyTrendData = analytics.by_jornada ? 
    Object.entries(analytics.by_jornada.goals_trend?.home_goals || {}).map(([jornada, goals]) => ({
      name: `J${jornada}`,
      'Goles Local': goals,
      'Goles Visitante': analytics.by_jornada.goals_trend?.away_goals?.[jornada] || 0,
      'home_possession': analytics.by_jornada.possession_trend?.home_possession?.[jornada] || 0,
      'away_possession': analytics.by_jornada.possession_trend?.away_possession?.[jornada] || 0,
      ...analytics.by_jornada.results_distribution?.[jornada]
    })) : [];

  const teams = analytics.team_stats ? Object.keys(analytics.team_stats).sort() : [];

  const getTeamComparisonData = () => {
    if (!selectedTeam1 || !selectedTeam2 || !analytics.team_stats) return [];
    
    const team1 = analytics.team_stats[selectedTeam1];
    const team2 = analytics.team_stats[selectedTeam2];
    
    return [
      { category: 'Victorias Local', [selectedTeam1]: team1.home.wins, [selectedTeam2]: team2.home.wins },
      { category: 'Victorias Visitante', [selectedTeam1]: team1.away.wins, [selectedTeam2]: team2.away.wins },
      { category: 'Goles Anotados (L)', [selectedTeam1]: team1.home.goals_for, [selectedTeam2]: team2.home.goals_for },
      { category: 'Goles Anotados (V)', [selectedTeam1]: team1.away.goals_for, [selectedTeam2]: team2.away.goals_for },
      { category: 'Posesión Media (L)', [selectedTeam1]: team1.home.avg_possession, [selectedTeam2]: team2.home.avg_possession },
      { category: 'Posesión Media (V)', [selectedTeam1]: team1.away.avg_possession, [selectedTeam2]: team2.away.avg_possession },
    ];
  };

  const getTeamRadarData = (teamName) => {
    if (!teamName || !analytics.team_stats?.[teamName]) return [];
    
    const teamStats = analytics.team_stats[teamName];
    
    return [
      { subject: 'Victorias Local', A: teamStats.home.wins / (teamStats.home.played || 1) * 100 },
      { subject: 'Victorias Visitante', A: teamStats.away.wins / (teamStats.away.played || 1) * 100 },
      { subject: 'Goles Local', A: teamStats.home.goals_for / (teamStats.home.played || 1) * 10 },
      { subject: 'Goles Visitante', A: teamStats.away.goals_for / (teamStats.away.played || 1) * 10 },
      { subject: 'Posesión Local', A: teamStats.home.avg_possession },
      { subject: 'Posesión Visitante', A: teamStats.away.avg_possession },
      { subject: 'Conversión Tiros', A: (teamStats.home.shots_conversion + teamStats.away.shots_conversion) / 2 },
    ];
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Analítico del Torneo
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Resumen General" />
        <Tab label="Equipos" />
        <Tab label="Tácticas y Formaciones" />
        <Tab label="Tendencias del Torneo" />
      </Tabs>
      
      {/* Resumen General */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Distribución de Resultados
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${safeToFixed(percent * 100, 1)}%`}
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
            <Typography variant="h6" gutterBottom>
              Estadísticas Clave
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Partidos Totales</Typography>
                <Typography variant="h4" align="center">{analytics.total_matches}</Typography>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Goles promedio por partido</Typography>
                <Typography variant="h6">
                  Local: {safeToFixed(analytics.avg_home_goals, 2)} - Visitante: {safeToFixed(analytics.avg_away_goals, 2)}
                </Typography>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">Porcentaje de conversión de disparos</Typography>
                <Typography variant="h6">
                  Local: {safeToFixed(analytics.effectiveness?.shots_conversion?.home, 2)}% - Visitante: {safeToFixed(analytics.effectiveness?.shots_conversion?.away, 2)}%
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Equipos */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Typography variant="h6" gutterBottom>
              Comparación de Equipos
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Equipo 1</InputLabel>
                  <Select
                    value={selectedTeam1}
                    label="Equipo 1"
                    onChange={(e) => setSelectedTeam1(e.target.value)}
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
                    value={selectedTeam2}
                    label="Equipo 2"
                    onChange={(e) => setSelectedTeam2(e.target.value)}
                  >
                    {teams.map(team => (
                      <MenuItem key={team} value={team}>{team}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getTeamComparisonData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px' // Espacio adicional arriba de la leyenda
                    }}
                  />
                  <Bar dataKey={selectedTeam1} fill="#8884d8" name={selectedTeam1} />
                  <Bar dataKey={selectedTeam2} fill="#82ca9d" name={selectedTeam2}/>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Typography variant="h6" gutterBottom>
              Perfil de Rendimiento: {selectedTeam1}
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={getTeamRadarData(selectedTeam1)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar 
                    name={selectedTeam1} 
                    dataKey="A" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tácticas y Formaciones */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Formaciones Más Usadas (Local)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={homeFormationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Formaciones Más Usadas (Visitante)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={awayFormationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Estilos Más Efectivos (Local)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={homeStyleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ 
                      value: 'Goles por partido', 
                      angle: -90, 
                      position: 'left',
                      style: { fill: theme.palette.text.primary }
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Estilos Más Efectivos (Visitante)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={awayStyleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ 
                      value: 'Goles por partido', 
                      angle: -90, 
                      position: 'left',
                      style: { fill: theme.palette.text.primary }
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tendencias del Torneo */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Evolución de Goles por Jornada
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={journeyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Goles Local" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Goles Visitante" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Evolución de Posesión por Jornada
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={journeyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]}/>
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="home_possession" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    name="Posesión Local"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="away_possession" 
                    stroke="#413ea0" 
                    strokeWidth={2}
                    name="Posesión Visitante"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Distribución de Resultados por Jornada
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={journeyTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="H" stackId="a" fill="#8884d8" name="Victoria Local" />
                  <Bar dataKey="A" stackId="a" fill="#82ca9d" name="Victoria Visitante" />
                  <Bar dataKey="D" stackId="a" fill="#ffc658" name="Empates" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default AnalyticsDashboard;