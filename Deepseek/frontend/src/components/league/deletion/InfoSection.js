import React from 'react';
import { 
  Box, 
  Typography, 
  Collapse, 
  CardContent, 
  Divider, 
  useTheme 
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

/**
 * Sección colapsable con información sobre el proceso de eliminación
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.expanded - Estado de expansión de la sección
 * @returns {JSX.Element} Sección de información
 */
const InfoSection = ({ expanded }) => {
  const theme = useTheme();
  
  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent sx={{ pt: 2, pb: 2, bgcolor: 'error.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <WarningIcon color="error" sx={{ mr: 1, mt: 0.3 }} />
          <Typography variant="body2" paragraph>
            Esta sección permite eliminar completamente la liga. Esta acción es irreversible y todos los datos asociados 
            (equipos, partidos, estadísticas) serán eliminados permanentemente.
          </Typography>
        </Box>
      </CardContent>
      <Divider sx={{ borderColor: theme.palette.error.light }} />
    </Collapse>
  );
};

export default InfoSection;