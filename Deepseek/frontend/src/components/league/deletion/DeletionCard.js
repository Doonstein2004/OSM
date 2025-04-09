import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  useTheme 
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  ErrorOutline as ErrorIcon 
} from '@mui/icons-material';

/**
 * Tarjeta con información sobre la eliminación y botón para iniciar el proceso
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.leagueName - Nombre de la liga a eliminar
 * @param {boolean} props.isLoading - Indica si está en proceso de carga
 * @param {Function} props.onDelete - Función para iniciar el proceso de eliminación
 * @returns {JSX.Element} Tarjeta de eliminación
 */
const DeletionCard = ({ leagueName, isLoading, onDelete }) => {
  const theme = useTheme();
  
  return (
    <>
      <Box 
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          border: '1px solid',
          borderColor: theme.palette.error.light
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ErrorIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Eliminar Liga Permanentemente
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          Esta acción eliminará permanentemente la liga <strong>{leagueName}</strong>, junto con todos sus 
          equipos asociados, partidos y estadísticas.
        </Typography>
        
        <Typography variant="body2" color="error" fontWeight="medium" sx={{ mb: 2 }}>
          Esta acción no se puede deshacer.
        </Typography>
      </Box>
      
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
        disabled={isLoading}
        fullWidth
        size="large"
        sx={{ py: 1.2 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Eliminar Liga'
        )}
      </Button>
    </>
  );
};

export default DeletionCard;