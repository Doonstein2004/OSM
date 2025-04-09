import React, { useState } from 'react';
import { Alert, Button, Box, Typography } from '@mui/material';

/**
 * Componente para mostrar mensajes de estado (éxito/error)
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.successMessage - Mensaje de éxito
 * @param {string} props.errorMessage - Mensaje de error
 * @param {string} props.errorDetails - Detalles técnicos del error
 * @returns {JSX.Element} Componente de mensajes de estado
 */
const StatusMessages = ({ successMessage, errorMessage, errorDetails }) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  
  // Si no hay mensajes, no renderizar nada
  if (!successMessage && !errorMessage) {
    return null;
  }
  
  return (
    <>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            errorDetails && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setShowErrorDetails(!showErrorDetails)}
              >
                {showErrorDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
              </Button>
            )
          }
        >
          {errorMessage}
          {showErrorDetails && errorDetails && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1, overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {errorDetails}
              </Typography>
            </Box>
          )}
        </Alert>
      )}
    </>
  );
};

export default StatusMessages;