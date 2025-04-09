import React from 'react';
import { Alert } from '@mui/material';

/**
 * Componente para mostrar un mensaje de error
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.message - Mensaje de error
 * @returns {JSX.Element} Alerta de error
 */
const ErrorState = ({ message }) => {
  return (
    <Alert severity="error" sx={{ mb: 4 }}>
      {message}
    </Alert>
  );
};

export default ErrorState;