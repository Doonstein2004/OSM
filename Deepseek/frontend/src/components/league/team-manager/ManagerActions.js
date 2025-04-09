import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

/**
 * Componente con botones de acción para gestionar un manager
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.hasManager - Indica si el equipo tiene manager
 * @param {Function} props.onAssign - Función para asignar manager
 * @param {Function} props.onEdit - Función para editar manager
 * @param {Function} props.onRemove - Función para eliminar manager
 * @param {boolean} props.isLoading - Indica si está cargando
 * @returns {JSX.Element} Botones de acción
 */
const ManagerActions = ({ hasManager, onAssign, onEdit, onRemove, isLoading }) => {
  return (
    <Box>
      <Tooltip title="Asignar manager">
        <IconButton 
          edge="end" 
          aria-label="asignar manager"
          onClick={onAssign}
          disabled={isLoading}
          color="primary"
          sx={{ mr: 0.5 }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <span>
          <IconButton 
            edge="end" 
            aria-label="editar"
            onClick={onEdit}
            disabled={isLoading || !hasManager}
            color="primary"
            sx={{ mr: 0.5 }}
          >
            <EditIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Eliminar">
        <span>
          <IconButton 
            edge="end" 
            aria-label="eliminar"
            onClick={onRemove}
            disabled={isLoading || !hasManager}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ManagerActions;