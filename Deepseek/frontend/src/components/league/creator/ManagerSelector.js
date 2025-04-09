import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  useTheme 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  VerifiedUser as VerifiedIcon 
} from '@mui/icons-material';

/**
 * Componente para seleccionar un manager existente
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.managers - Lista de managers disponibles
 * @param {string} props.selectedManager - ID del manager seleccionado
 * @param {boolean} props.isLoading - Indica si está en proceso de carga
 * @param {boolean} props.disabled - Indica si el selector está deshabilitado
 * @param {Function} props.onChange - Función al cambiar selección
 * @param {Function} props.onCustomManager - Función para cambiar a modo personalizado
 * @returns {JSX.Element} Selector de manager
 */
const ManagerSelector = ({ 
  managers, 
  selectedManager, 
  isLoading, 
  disabled, 
  onChange, 
  onCustomManager 
}) => {
  const theme = useTheme();
  
  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
      <InputLabel id="manager-select-label">Seleccionar Manager</InputLabel>
      <Select
        labelId="manager-select-label"
        value={selectedManager}
        onChange={onChange}
        label="Seleccionar Manager"
        disabled={disabled || isLoading}
      >
        <MenuItem value="">
          <em>Ninguno</em>
        </MenuItem>
        {managers.map((manager) => (
          <MenuItem key={manager.id} value={manager.id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {manager.verified && (
                <VerifiedIcon 
                  fontSize="small" 
                  sx={{ mr: 1, color: theme.palette.success.main }} 
                />
              )}
              <PersonIcon 
                fontSize="small" 
                sx={{ mr: 1, color: theme.palette.text.secondary }} 
              />
              {manager.name}
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={onCustomManager}>
          <Typography color="primary" sx={{ fontWeight: 'medium' }}>
            Ingresar Nuevo Manager...
          </Typography>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ManagerSelector;