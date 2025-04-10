// frontend/src/components/league/list/LeagueListHeader.js

import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { 
  EmojiEvents as TrophyIcon, 
  Add as AddIcon 
} from '@mui/icons-material';

/**
 * Encabezado para la lista de ligas
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onCreateLeague - Función para crear nueva liga
 * @returns {JSX.Element} Encabezado de la lista
 */
const LeagueListHeader = ({ onCreateLeague }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrophyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Ligas Disponibles
          </Typography>
        </Box>
        
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateLeague}
          size="small"
        >
          Nueva Liga
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />
    </>
  );
};

export default LeagueListHeader;