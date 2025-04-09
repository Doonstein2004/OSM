import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * Componente para seleccionar una jornada específica
 */
const JornadaSelector = ({ jornadas, selectedJornada, onJornadaChange, disabled }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="jornada-select-label">Jornada</InputLabel>
      <Select
        labelId="jornada-select-label"
        value={selectedJornada || ''}
        label="Jornada"
        onChange={onJornadaChange}
        disabled={disabled || jornadas.length === 0}
      >
        {jornadas.map(jornada => (
          <MenuItem key={jornada} value={jornada}>Jornada {jornada}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default JornadaSelector;