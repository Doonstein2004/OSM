import React from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon, 
  Person as PersonIcon 
} from '@mui/icons-material';

/**
 * Componente para editar el nombre de un manager
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.managerName - Nombre actual del manager
 * @param {Function} props.onChange - Función al cambiar el nombre
 * @param {Function} props.onSave - Función para guardar cambios
 * @param {Function} props.onCancel - Función para cancelar edición
 * @param {boolean} props.isLoading - Indica si está cargando
 * @returns {JSX.Element} Editor de manager
 */
const ManagerEditor = ({ managerName, onChange, onSave, onCancel, isLoading }) => {
  return (
    <Box>
      <TextField
        variant="outlined"
        size="small"
        value={managerName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nombre del manager"
        sx={{ mt: 1, width: '100%' }}
        InputProps={{
          startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Tooltip title="Guardar">
          <IconButton 
            edge="end" 
            aria-label="guardar"
            onClick={onSave}
            disabled={isLoading}
            color="primary"
            sx={{ mr: 0.5 }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancelar">
          <IconButton 
            edge="end" 
            aria-label="cancelar"
            onClick={onCancel}
            disabled={isLoading}
            color="default"
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ManagerEditor;