import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Badge, 
  Card, 
  CardContent, 
  useTheme 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  VerifiedUser as VerifiedIcon 
} from '@mui/icons-material';

/**
 * Componente que muestra información del manager actual de la liga
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.manager - Datos del manager actual
 * @param {Array} props.managers - Lista de managers para buscar verificación
 * @returns {JSX.Element} Card de manager actual
 */
const CurrentManagerCard = ({ manager, managers }) => {
  const theme = useTheme();
  
  // Buscar en la lista de managers si el manager actual está verificado
  const isVerified = manager?.id && managers.some(m => 
    m.id === manager.id && m.verified
  );

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: 2, 
        backgroundColor: theme.palette.background.default
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Creador Actual
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: theme.palette.background.paper,
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1
        }}>
          {isVerified ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar sx={{ width: 16, height: 16, bgcolor: 'success.main' }}>
                  <VerifiedIcon sx={{ fontSize: 12 }} />
                </Avatar>
              }
            >
              <Avatar 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  bgcolor: manager?.name ? theme.palette.secondary.main : theme.palette.grey[300],
                  mr: 2
                }}
              >
                <PersonIcon />
              </Avatar>
            </Badge>
          ) : (
            <Avatar 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: manager?.name ? theme.palette.secondary.main : theme.palette.grey[300],
                mr: 2
              }}
            >
              <PersonIcon />
            </Avatar>
          )}
          
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {manager?.name || 'Sin creador asignado'}
            </Typography>
            {manager?.id && (
              <Typography variant="caption" color="text.secondary">
                ID: {manager.id}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CurrentManagerCard;