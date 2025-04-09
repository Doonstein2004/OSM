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
  Button
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

/**
 * Componente de formulario para crear/editar partidos
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.open - Indica si el diálogo está abierto
 * @param {boolean} props.editMode - Indica si está en modo edición
 * @param {Object} props.formData - Datos del formulario
 * @param {Array<Object>} props.teams - Lista de equipos disponibles
 * @param {Function} props.onClose - Función al cerrar el diálogo
 * @param {Function} props.onSubmit - Función al enviar el formulario
 * @param {Function} props.onChange - Función al cambiar un campo
 * @returns {JSX.Element} Formulario de partido
 */
const MatchForm = ({ 
  open, 
  editMode, 
  formData, 
  teams, 
  onClose, 
  onSubmit, 
  onChange 
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode ? 'Editar Partido' : 'Agregar Nuevo Partido'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="jornada"
            label="Jornada"
            type="number"
            value={formData.jornada}
            onChange={handleInputChange}
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
          />
          
          <FormControl fullWidth>
            <InputLabel id="home-team-label">Equipo Local</InputLabel>
            <Select
              labelId="home-team-label"
              name="home_team_id"
              value={formData.home_team_id}
              label="Equipo Local"
              onChange={handleInputChange}
            >
              {teams.map(team => (
                <MenuItem key={`home-${team.id}`} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="away-team-label">Equipo Visitante</InputLabel>
            <Select
              labelId="away-team-label"
              name="away_team_id"
              value={formData.away_team_id}
              label="Equipo Visitante"
              onChange={handleInputChange}
            >
              {teams.map(team => (
                <MenuItem key={`away-${team.id}`} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            name="date"
            label="Fecha"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            name="time"
            label="Hora"
            type="time"
            value={formData.time}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          color="primary"
          startIcon={<CheckIcon />}
        >
          {editMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchForm;