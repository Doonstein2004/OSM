import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Chip, Paper } from '@mui/material';
import axios from 'axios';

const TeamInput = ({ onSimulate }) => {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  const handleAddTeam = () => {
    if (!teamName.trim()) {
      setError('El nombre del equipo no puede estar vacío');
      return;
    }
    
    if (teams.includes(teamName.trim())) {
      setError('Este equipo ya fue agregado');
      return;
    }
    
    setTeams([...teams, teamName.trim()]);
    setTeamName('');
    setError('');
  };

  const handleRemoveTeam = (teamToRemove) => {
    setTeams(teams.filter(team => team !== teamToRemove));
  };

  const handleSimulate = async () => {
    if (teams.length < 2) {
      setError('Se necesitan al menos 2 equipos para simular');
      return;
    }
    
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://localhost:8000/simulate-tournament/', {
        teams: teams,
        jornadas: 42,
        matches_per_jornada: 10
      });
      
      if (onSimulate) {
        onSimulate();
      }
    } catch (err) {
      setError('Error al simular el torneo: ' + err.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Equipos
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Nombre del equipo"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
        />
        <Button 
          variant="contained" 
          onClick={handleAddTeam}
          sx={{ minWidth: '120px' }}
        >
          Agregar
        </Button>
      </Box>
      
      {teams.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Equipos agregados ({teams.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {teams.map(team => (
              <Chip
                key={team}
                label={team}
                onDelete={() => handleRemoveTeam(team)}
              />
            ))}
          </Box>
        </Box>
      )}
      
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSimulate}
        disabled={teams.length < 2}
        fullWidth
      >
        Simular Torneo (42 Jornadas)
      </Button>
    </Paper>
  );
};

export default TeamInput;