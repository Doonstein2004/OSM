import React from 'react';
import { Button } from '@mui/material';

/**
 * Componente que muestra el botón para iniciar la simulación
 * @param {Array} teams - Lista de equipos para la simulación
 * @param {Function} onSimulate - Función para iniciar la simulación
 * @param {boolean} isLoading - Si está cargando la simulación
 */
const SimulateButton = ({ teams, onSimulate, isLoading = false }) => {
  // Verificar si hay suficientes equipos para simular
  const disabled = teams.length < 2 || isLoading;

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={onSimulate}
      disabled={disabled}
      fullWidth
    >
      {isLoading ? 'Simulando...' : 'Simular Torneo (42 Jornadas)'}
    </Button>
  );
};

export default SimulateButton;