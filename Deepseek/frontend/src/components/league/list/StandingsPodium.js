import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar 
} from '@mui/material';

/**
 * Componente que muestra el podio con los tres primeros equipos
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.standings - Lista de equipos en la clasificación
 * @returns {JSX.Element} Podio de clasificación
 */
const StandingsPodium = ({ standings }) => {
  // Si no hay clasificación o está vacía, no renderizar nada
  if (!standings || standings.length === 0) {
    return null;
  }

  // Obtener solo los 3 primeros equipos
  const topTeams = standings.slice(0, 3);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Podio Actual
        </Typography>
        
        <List dense>
          {topTeams.map((team, index) => (
            <ListItem key={team.team_id}>
              <ListItemIcon>
                <Avatar 
                  sx={{ 
                    bgcolor: 
                      index === 0 ? 'gold' : 
                      index === 1 ? 'silver' : 
                      '#cd7f32'
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={team.team.name}
                secondary={`${team.points} pts • ${team.won}G ${team.drawn}E ${team.lost}P • GD: ${team.goal_difference}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default StandingsPodium;