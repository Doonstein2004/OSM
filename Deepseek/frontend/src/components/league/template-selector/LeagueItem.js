import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Groups as TeamsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import ValueStatistics from './ValueStatistics';

/**
 * Componente que representa un ítem de liga en la lista
 */
const LeagueItem = ({
  league,
  isExpanded,
  isLoading,
  onToggleExpand,
  onCreateLeague,
  stats,
  loadingStats,
  theme
}) => {
  return (
    <ListItem 
      alignItems="flex-start"
      sx={{ 
        cursor: 'pointer',
        bgcolor: isExpanded ? 'action.selected' : 'transparent',
        '&:hover': { bgcolor: 'action.hover' }
      }}
      onClick={() => onToggleExpand(league)}
      secondaryAction={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onCreateLeague(league);
            }}
            sx={{ mr: 1, minWidth: 110 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : 'Crear Liga'}
          </Button>
          <IconButton 
            edge="end" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(league);
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: league.type === "Tournament" ? theme.palette.secondary.main : theme.palette.primary.main }}>
          <TrophyIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={league.name}
        secondary={
          <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
              <TeamsIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {league.team_count} equipos
              </Typography>
              
              <Box component="span" sx={{ mx: 0.5, color: 'text.secondary' }}>•</Box>
              
              <Chip 
                label={league.type === "Tournament" ? "Torneo" : (league.type === "Battle" ? "Batalla" : "Liga")} 
                size="small"
                color={league.type === "Tournament" ? "secondary" : (league.type === "Battle" ? "warning" : "primary")}
                variant="outlined"
              />
            </Box>
            
            {/* Componente de estadísticas de valor */}
            <ValueStatistics stats={stats} isLoading={loadingStats} />
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default LeagueItem;