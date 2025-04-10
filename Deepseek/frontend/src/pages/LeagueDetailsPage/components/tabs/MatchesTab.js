import React from 'react';
import { Box, Typography, Card, Divider, Grid, useTheme } from '@mui/material';
import { SportsSoccer as SoccerIcon, Person as PersonIcon } from '@mui/icons-material';

const MatchesTab = ({ matches }) => {
  const theme = useTheme();
  
  if (!matches || matches.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: 'text.secondary'
      }}>
        <SoccerIcon sx={{ fontSize: 60, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay partidos disponibles para esta liga
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Utiliza la pestaña "Simular" para generar partidos
        </Typography>
      </Box>
    );
  }

  // Group matches by jornada
  const matchesByJornada = matches.reduce((acc, match) => {
    if (!acc[match.jornada]) {
      acc[match.jornada] = [];
    }
    acc[match.jornada].push(match);
    return acc;
  }, {});

  return (
    <Box>
      {Object.entries(matchesByJornada).map(([jornada, jornadaMatches]) => (
        <Box key={jornada} sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 1,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: 2
          }}>
            <Typography variant="h6" fontWeight="bold">
              Jornada {jornada}
            </Typography>
          </Box>
          
          <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {jornadaMatches.map((match, index) => (
              <React.Fragment key={match.id}>
                {index > 0 && <Divider />}
                <Box 
                  sx={{ 
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={5} textAlign="right">
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {match.home_team.name}
                        </Typography>
                        {match.home_team.manager && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <PersonIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                            {match.home_team.manager}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {match.home_formation} • {match.home_style}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        bgcolor: match.home_goals !== null ? 'background.default' : 'action.disabledBackground',
                        borderRadius: 1,
                        mx: 'auto',
                        width: '80px',
                        height: '40px'
                      }}>
                        {match.home_goals !== null && match.away_goals !== null ? (
                          <Typography variant="h6" fontWeight="bold" sx={{ textAlign: 'center' }}>
                            {match.home_goals} - {match.away_goals}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            Pendiente
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={5}>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {match.away_team.name}
                        </Typography>
                        {match.away_team.manager && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                            {match.away_team.manager}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {match.away_formation} • {match.away_style}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </React.Fragment>
            ))}
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default MatchesTab;