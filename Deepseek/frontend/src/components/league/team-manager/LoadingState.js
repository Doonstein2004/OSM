import React from 'react';
import { Card, CardContent, CircularProgress } from '@mui/material';

/**
 * Componente para mostrar el estado de carga
 * 
 * @returns {JSX.Element} Estado de carga
 */
const LoadingState = () => {
  return (
    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </CardContent>
    </Card>
  );
};

export default LoadingState;