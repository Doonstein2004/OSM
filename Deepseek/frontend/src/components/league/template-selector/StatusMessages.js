import React from 'react';
import { Alert } from '@mui/material';

/**
 * Componente para mostrar mensajes de éxito o error
 * @param {string} successMessage - Mensaje de éxito a mostrar
 * @param {string} errorMessage - Mensaje de error a mostrar
 */
const StatusMessages = ({ successMessage, errorMessage }) => {
  return (
    <>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </>
  );
};

export default StatusMessages;