import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const ScheduleForm = ({ 
  open, 
  match, 
  jornadas,
  teams,
  formData, 
  onChange, 
  onClose, 
  onSubmit 
}) => {
  if (!match) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // Filtrar equipos para evitar enfrentamiento del mismo equipo
  const filteredAwayTeams = teams.filter(team => team.id !== parseInt(formData.home_team_id));
  const filteredHomeTeams = teams.filter(team => team.id !== parseInt(formData.away_team_id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Editar Partido
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="jornada-label">Jornada</InputLabel>
            <Select
              labelId="jornada-label"
              name="jornada"
              value={formData.jornada}
              label="Jornada"
              onChange={handleInputChange}
            >
              {jornadas.map(jornada => (
                <MenuItem key={jornada} value={jornada}>
                  Jornada {jornada}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Divider>Equipos</Divider>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="home-team-label">Equipo Local</InputLabel>
                <Select
                  labelId="home-team-label"
                  name="home_team_id"
                  value={formData.home_team_id}
                  label="Equipo Local"
                  onChange={handleInputChange}
                >
                  {filteredHomeTeams.map(team => (
                    <MenuItem key={`home-${team.id}`} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="away-team-label">Equipo Visitante</InputLabel>
                <Select
                  labelId="away-team-label"
                  name="away_team_id"
                  value={formData.away_team_id}
                  label="Equipo Visitante"
                  onChange={handleInputChange}
                >
                  {filteredAwayTeams.map(team => (
                    <MenuItem key={`away-${team.id}`} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Divider>Fecha y Hora</Divider>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="date"
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="time"
                label="Hora"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          color="primary"
          startIcon={<SaveIcon />}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleForm;