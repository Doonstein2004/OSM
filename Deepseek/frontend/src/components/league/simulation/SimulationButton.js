import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';

/**
 * Botón para iniciar la simulación de la liga
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onSimulate - Función para simular la liga
 * @param {boolean} props.isSimulating - Indica si está en proceso de simulación
 * @param {boolean} props.isDisabled - Indica si el botón debe estar deshabilitado
 * @returns {JSX.Element} Botón de simulación
 */
const SimulationButton = ({ onSimulate, isSimulating, isDisabled }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onSimulate}
      disabled={isSimulating || isDisabled}
      fullWidth
      startIcon={isSimulating ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
      sx={{ mt: 2 }}
    >
      {isSimulating ? 'Simulando...' : 'Simular Liga'}
    </Button>
  );
};

export default SimulationButton;