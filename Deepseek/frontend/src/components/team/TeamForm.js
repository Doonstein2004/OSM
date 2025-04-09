import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

/**
 * Componente de formulario para agregar equipos
 */
const TeamForm = ({ onAddTeam, error }) => {
  const [teamName, setTeamName] = useState('');
  const [manager, setManager] = useState('');
  const [clan, setClan] = useState('');

  /**
   * Maneja la acción de agregar un equipo
   */
  const handleSubmit = () => {
    onAddTeam({
      name: teamName.trim(),
      manager: manager.trim(),
      clan: clan.trim() || 'Sin Clan'
    });
    
    // Limpiar el formulario
    setTeamName('');
    setManager('');
    setClan('');
  };

  /**
   * Maneja la tecla Enter para enviar el formulario
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Nombre del equipo"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        fullWidth
        error={!!error}
        helperText={error}
        onKeyPress={handleKeyPress}
      />
      <TextField
        label="Manager"
        value={manager}
        onChange={(e) => setManager(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Clan"
        value={clan}
        onChange={(e) => setClan(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={handleSubmit}
        sx={{ minWidth: '120px' }}
      >
        Agregar
      </Button>
    </Box>
  );
};

export default TeamForm;