import React from 'react';
import { Alert } from '@mui/material';

/**
 * Componente para mostrar mensajes de estado (éxito/error)
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.successMessage - Mensaje de éxito
 * @param {string} props.errorMessage - Mensaje de error
 * @returns {JSX.Element} Mensajes de estado
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