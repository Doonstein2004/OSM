import React from 'react';
import { Collapse, CardContent, Typography, Divider } from '@mui/material';

/**
 * Sección colapsable con información sobre la gestión de managers
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
          Asigna, edita o elimina managers para cada equipo de la liga. El manager será responsable de las decisiones técnicas y tácticas de su equipo.
        </Typography>
      </CardContent>
      <Divider />
    </Collapse>
  );
};

export default InfoSection;