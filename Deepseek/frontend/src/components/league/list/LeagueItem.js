import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Box, 
  Typography, 
  Chip,
  useTheme
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon, 
  EmojiEvents as TrophyIcon, 
  Public as CountryIcon, 
  SportsSoccer as SoccerIcon,
  Groups as TeamsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getCountryFlag } from '../../../utils/helpers/countryHelpers';

/**
 * Componente que representa un item de liga en la lista
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.league - Datos de la liga
 * @param {boolean} props.isExpanded - Indica si está expandido
 * @param {Function} props.onToggleExpand - Función para expandir/colapsar
 * @returns {JSX.Element} Item de liga
 */
const LeagueItem = ({ league, isExpanded, onToggleExpand }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleItemClick = (e) => {
    navigate(`/leagues/${league.id}`);
  };
  
  const handleToggleClick = (e) => {
    e.stopPropagation(); // Detener propagación para evitar navegación
    onToggleExpand(league.id);
  };
  
  return (
    <ListItem 
      alignItems="flex-start" 
      sx={{ 
        bgcolor: isExpanded ? 'action.selected' : 'transparent',
        borderRadius: 1,
        mb: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        }
      }}
      onClick={handleItemClick}
      secondaryAction={
        <IconButton 
          edge="end" 
          onClick={handleToggleClick}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      }
    >

      <ListItemAvatar>
        <Avatar 
          alt={league.country || "Sin país"} 
          src={getCountryFlag(league.country)}
          sx={{ bgcolor: theme.palette.primary.main }}
        >
          <CountryIcon />
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Typography variant="subtitle1" component="span" fontWeight="bold">
            {league.name}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <TrophyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" component="span">
                {league.tipo_liga}
              </Typography>
              
              {league.country && (
                <>
                  <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
                  <CountryIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" component="span">
                    {league.country}
                  </Typography>
                </>
              )}
              
              <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
              
              <TeamsIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" component="span">
                {league.teams_count || 0} equipos
              </Typography>
              
              <Box sx={{ mx: 1, color: 'text.secondary' }}>•</Box>
              
              <SoccerIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" component="span">
                {league.matches_count || 0} partidos
              </Typography>
            </Box>
            
            {/* Información del creador si existe */}
            {league.creator && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" component="span">
                  Creada por: {league.creator.name}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Chip 
                label={league.active ? 'Activa' : 'Finalizada'} 
                size="small" 
                color={league.active ? 'success' : 'default'}
                variant="outlined"
              />
              <Chip 
                label={league.tipo_liga} 
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            </Box>
          </React.Fragment>
        }
      />
      
      <IconButton 
        edge="end" 
        onClick={() => onToggleExpand(league.id)}
        aria-expanded={isExpanded}
        aria-label="show more"
      >
        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </ListItem>
  );
};

export default LeagueItem;