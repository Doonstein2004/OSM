import React from 'react';
import { Paper, Typography, Grid, Button } from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const QuickAccessSection = ({ theme }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 6,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 3, 
          color: 'white',
          fontWeight: 700,
          textAlign: 'center'
        }}
      >
        ACCESO RÁPIDO
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Button 
            fullWidth
            variant="contained" 
            color="secondary"
            component={RouterLink}
            to="/teams"
            startIcon={<PlayIcon />}
            sx={{ 
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              }
            }}
          >
            Simular Nuevo Torneo
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuickAccessSection;