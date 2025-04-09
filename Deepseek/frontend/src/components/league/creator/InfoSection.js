import React from 'react';
import { Collapse, CardContent, Typography, Divider } from '@mui/material';

/**
 * Sección colapsable con información sobre el creador de liga
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.expanded - Estado de expansión de la sección
 * @returns {JSX.Element} Sección de información
 */
const InfoSection = ({ expanded }) => {
  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent sx={{ pt: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          El creador de la liga es responsable de su gestión y administración. Puedes seleccionar un manager existente o crear uno nuevo para este rol.
        </Typography>
      </CardContent>
      <Divider />
    </Collapse>
  );
};

export default InfoSection;