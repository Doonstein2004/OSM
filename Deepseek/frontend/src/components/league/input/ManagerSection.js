import React from 'react';
import { TextField } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

/**
 * Sección para mostrar información del manager
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.manager - Datos del manager
 * @param {string} props.manager.name - Nombre del manager
 * @param {boolean} props.hasError - Indica si hay error en esta sección
 * @returns {JSX.Element} Sección del manager
 */
const ManagerSection = ({ manager, hasError }) => {
  return (
    <TextField
      label="Manager de la Liga"
      value={manager.name}
      InputProps={{
        readOnly: true,
        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
      }}
      helperText={hasError ? "Error con el usuario actual" : "La liga será creada por el usuario actual"}
      fullWidth
      error={hasError}
    />
  );
};

export default ManagerSection;