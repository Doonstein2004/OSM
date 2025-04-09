import React from 'react';
import { CardHeader, Avatar, Typography, IconButton, useTheme } from '@mui/material';
import { AdminPanelSettings as AdminIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

/**
 * Encabezado para el componente de gestión de creador de liga
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.expanded - Estado de expansión del panel de información
 * @param {Function} props.onToggleExpand - Función para toggle de expansión
 * @returns {JSX.Element} Encabezado del componente
 */
const CreatorHeader = ({ expanded, onToggleExpand }) => {
  const theme = useTheme();
  
  return (
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
          <AdminIcon />
        </Avatar>
      }
      title={
        <Typography variant="h6" component="div" fontWeight="bold">
          Creador de la Liga
        </Typography>
      }
      action={
        <IconButton
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-label="mostrar/ocultar"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      }
      sx={{ 
        pb: 1, 
        '& .MuiCardHeader-action': { 
          margin: 0,
          alignSelf: 'center'
        } 
      }}
    />
  );
};

export default CreatorHeader;