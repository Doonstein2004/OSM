import React from 'react';
import { Grid, Typography } from '@mui/material';
import { 
  Leaderboard as LeaderboardIcon, 
  SportsSoccer as SoccerIcon,
  Dashboard as DashboardIcon,
  Groups as TeamsIcon
} from '@mui/icons-material';
import FeatureCard from './FeatureCard';

const FeatureCards = ({ theme }) => {
  const features = [
    {
      icon: LeaderboardIcon,
      title: 'Tabla de Posiciones',
      description: 'Visualiza la clasificación completa con todos los datos relevantes de cada equipo.',
      link: '/standings',
      iconColor: theme.palette.primary.main,
      iconBgColor: 'rgba(33, 150, 243, 0.1)'
    },
    {
      icon: SoccerIcon,
      title: 'Resultados',
      description: 'Consulta todos los resultados de los partidos simulados del torneo.',
      link: '/matches',
      iconColor: theme.palette.secondary.main,
      iconBgColor: 'rgba(255, 152, 0, 0.1)'
    },
    {
      icon: DashboardIcon,
      title: 'Estadísticas',
      description: 'Analiza datos detallados y visualizaciones de rendimiento de los equipos.',
      link: '/analytics',
      iconColor: theme.palette.success.main,
      iconBgColor: 'rgba(76, 175, 80, 0.1)'
    },
    {
      icon: TeamsIcon,
      title: 'Gestión de Equipos',
      description: 'Configura y personaliza los equipos que participarán en el torneo.',
      link: '/teams',
      iconColor: theme.palette.error.main,
      iconBgColor: 'rgba(244, 67, 54, 0.1)'
    }
  ];

  return (
    <>
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 700,
          color: theme.palette.primary.main
        }}
      >
        CARACTERÍSTICAS PRINCIPALES
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FeatureCard {...feature} theme={theme} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FeatureCards;