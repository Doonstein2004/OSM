import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Divider
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

const Header = ({ theme }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4, 
        background: `linear-gradient(to right, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.8))` 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrophyIcon 
          sx={{ 
            mr: 2, 
            fontSize: 40, 
            color: theme.palette.secondary.main 
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          color="primary"
          sx={{
            fontWeight: 700,
            background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GESTIÓN DE LIGAS
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Crea y gestiona ligas de fútbol para tus equipos. Puedes configurar parámetros como el tipo de liga, el número de equipos y jornadas, y ver estadísticas detalladas de cada liga.
      </Typography>
    </Paper>
  );
};

export default Header;