import React from 'react';
import { TextField } from '@mui/material';

/**
 * Sección para introducir el nombre de la liga
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.name - Valor actual del nombre
 * @param {Function} props.onChange - Función para actualizar el nombre
 * @param {boolean} props.hasError - Indica si hay error en el nombre
 * @returns {JSX.Element} Sección del nombre
 */
const NameSection = ({ name, onChange, hasError }) => {
  return (
    <TextField
      label="Nombre de la Liga"
      value={name}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      required
      error={hasError}
      helperText={hasError ? "El nombre de la liga es obligatorio" : ""}
    />
  );
};

export default NameSection;