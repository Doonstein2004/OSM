import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = ({ theme }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, md: 6 }, 
        mb: 6, 
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(33, 150, 243, 0.1) 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: { xs: '150px', md: '300px' }, 
          height: { xs: '150px', md: '300px' },
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 152, 0, 0.15) 0%, rgba(33, 150, 243, 0) 70%)`,
          zIndex: 0,
          transform: 'translate(30%, -30%)'
        }} 
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 800,
            mb: 2,
            background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          SIMULADOR DE TORNEO DE FÚTBOL
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            color: 'text.secondary',
            maxWidth: '800px',
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          Simula torneos completos, analiza estadísticas y descubre quién será el campeón en esta plataforma interactiva
        </Typography>
        
        <Button 
          variant="contained" 
          size="large" 
          component={RouterLink}
          to="/teams"
          startIcon={<PlayIcon />}
          sx={{ 
            px: 4, 
            py: 1.5,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
            borderRadius: 3,
            fontSize: '1.1rem',
            fontWeight: 700,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 20px rgba(33, 150, 243, 0.4)',
            }
          }}
        >
          COMENZAR SIMULACIÓN
        </Button>
      </Box>
    </Paper>
  );
};

export default HeroSection;