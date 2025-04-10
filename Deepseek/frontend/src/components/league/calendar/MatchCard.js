import React from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip, 
  CardContent,
  Divider
} from '@mui/material';
import { Edit as EditIcon, DeleteOutline as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';

/**
 * Componente que muestra la información de un partido
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.match - Datos del partido
 * @param {Function} props.onEdit - Función para editar el partido
 * @param {Function} props.onDelete - Función para eliminar el partido
 * @param {boolean} props.showDivider - Indica si se debe mostrar el divisor (default: true)
 * @returns {JSX.Element} Tarjeta de partido
 */
const MatchCard = ({ match, onEdit, onDelete, showDivider = true }) => {
  return (
    <React.Fragment>
      {showDivider && <Divider />}
      <CardContent sx={{ py: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs={5} textAlign="right">
            <Box sx={{ p: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                {match.home_team.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {match.home_formation || 'Formación no definida'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={2}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              mx: 'auto',
              textAlign: 'center'
            }}>
              <Chip 
                label={match.time || 'Hora no definida'} 
                size="small"
                color="primary"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                vs
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={5}>
            <Box sx={{ p: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                {match.away_team.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {match.away_formation || 'Formación no definida'}
              </Typography>
            </Box>
          </Grid>

          {/* Agregando información del manager */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 1,
              mb: 1,
              color: 'text.secondary'
            }}>
              <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption">
                Manager: {match.manager?.name || 'No asignado'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Tooltip title="Editar partido">
                <IconButton size="small" onClick={() => onEdit(match)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar partido">
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onDelete(match.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </React.Fragment>
  );
};

export default MatchCard;