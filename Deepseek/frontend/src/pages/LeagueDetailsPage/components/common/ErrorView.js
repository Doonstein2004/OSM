import React from 'react';
import { Container, Alert, Button } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const ErrorView = ({ error, warning, onBack }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {warning && (
        <Alert severity="warning" variant="filled" sx={{ mb: 4 }}>
          {warning}
        </Alert>
      )}
      
      <Button 
        variant="contained"
        startIcon={<BackIcon />} 
        onClick={onBack}
        size="large"
      >
        Volver a Ligas
      </Button>
    </Container>
  );
};

export default ErrorView;