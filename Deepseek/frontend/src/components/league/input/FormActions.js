import React from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';

/**
 * Componente para las acciones del formulario (botones)
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onCreateLeague - Función para crear la liga
 * @param {boolean} props.isLoading - Indica si está en proceso de carga
 * @param {boolean} props.isDisabled - Indica si el botón debe estar deshabilitado
 * @returns {JSX.Element} Acciones del formulario
 */
const FormActions = ({ onCreateLeague, isLoading, isDisabled }) => {
  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Después de crear la liga, podrás añadir equipos y simular partidos desde la página de detalles.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={onCreateLeague}
        disabled={isLoading || isDisabled}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Creando Liga...' : 'Crear Liga'}
      </Button>
    </>
  );
};

export default FormActions;