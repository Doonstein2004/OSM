import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert, 
  CircularProgress,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  AutoAwesome as SimulateIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { loadSimulationData, simulateLeague } from '../../../utils/api/simulationService';
import CalendarImport from '../calendar/CalendarImport';

/**
 * Componente para simular una liga completa
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga
 * @param {Function} props.onSimulationComplete - Función a ejecutar después de la simulación
 * @returns {JSX.Element}
 */
const LeagueSimulation = ({ leagueId, onSimulationComplete }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [simulationStatus, setSimulationStatus] = useState('pending'); // pending, running, completed
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    'Verificar equipos',
    'Crear calendario',
    'Simular partidos',
    'Actualizar clasificación'
  ];

  // Carga inicial de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await loadSimulationData(leagueId);
        setData(result);
      } catch (err) {
        setError('Error al cargar datos: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  const handleSimulate = async () => {
    try {
      setError('');
      setSimulationStatus('running');
      setActiveStep(0);
      
      // Step 1: Verificar equipos (ya completado al cargar)
      setActiveStep(1);
      
      // Step 2: Crear calendario (simulación automática)
      setActiveStep(2);
      
      // Step 3: Simular partidos
      const result = await simulateLeague(
        leagueId, 
        data.selectedTeams.map(team => team.id),
        data.league.jornadas
      );
      
      setActiveStep(3);
      
      // Step 4: Actualizar clasificación
      setTimeout(() => {
        setActiveStep(4);
        setSimulationStatus('completed');
        
        // Notificar al componente padre
        if (onSimulationComplete) {
          onSimulationComplete(result);
        }
      }, 1000);
      
    } catch (err) {
      setError('Error al simular: ' + (err.message || 'Error desconocido'));
      setSimulationStatus('pending');
    }
  };

  const handleImportComplete = () => {
    // Recargar los datos después de importar el calendario
    if (onSimulationComplete) {
      onSimulationComplete();
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Cargando datos para la simulación...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se pudieron cargar los datos para la simulación.
      </Alert>
    );
  }

  if (data.selectedTeams.length < 2) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Se necesitan al menos 2 equipos para simular la liga. 
        Por favor, añade equipos a la liga en la sección de configuración.
      </Alert>
    );
  }

  return (
    <Box>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        aria-label="Opciones de simulación"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab 
          label="Simulación Automática" 
          icon={<SimulateIcon />} 
          iconPosition="start"
        />
        <Tab 
          label="Importar Calendario" 
          icon={<CalendarIcon />} 
          iconPosition="start"
        />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Equipos participantes ({data.selectedTeams.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={1}>
              {data.selectedTeams.map(team => (
                <Grid item xs={12} sm={6} md={4} key={team.id}>
                  <Card variant="outlined" sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1, px: 2 }}>
                      <Typography variant="body2">
                        {team.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Proceso de simulación
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {simulationStatus === 'running' && (
              <Alert severity="info" icon={<CircularProgress size={20} />} sx={{ mb: 3 }}>
                Simulación en curso...
              </Alert>
            )}
            
            {simulationStatus === 'completed' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                ¡Simulación completada con éxito! Ahora puedes ver los resultados en las otras pestañas.
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<PlayIcon />} 
                onClick={handleSimulate}
                disabled={simulationStatus === 'running'}
                size="large"
                sx={{ minWidth: 200 }}
              >
                {simulationStatus === 'running' ? 'Simulando...' : 'Iniciar Simulación'}
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {activeTab === 1 && (
        <CalendarImport 
          leagueId={leagueId}
          onImport={handleImportComplete}
        />
      )}
    </Box>
  );
};

export default LeagueSimulation;