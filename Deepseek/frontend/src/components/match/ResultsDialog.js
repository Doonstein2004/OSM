import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';

/**
 * Componente de diálogo para editar los resultados de un partido
 */
const ResultsDialog = ({ 
  open, 
  match, 
  postMatchData, 
  onInputChange, 
  onClose, 
  onSave
}) => {
  if (!match) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Resultados: {match.home_team.name} vs {match.away_team.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Equipo</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>{match.home_team.name}</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>{match.away_team.name}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="subtitle1">Goles</Typography>
            <TextField
              name="home_goals"
              label="Goles local"
              type="number"
              value={postMatchData.home_goals}
              onChange={onInputChange}
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              name="away_goals"
              label="Goles visitante"
              type="number"
              value={postMatchData.away_goals}
              onChange={onInputChange}
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="subtitle1">Tiros</Typography>
            <TextField
              name="home_shots"
              label="Tiros local"
              type="number"
              value={postMatchData.home_shots}
              onChange={onInputChange}
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              name="away_shots"
              label="Tiros visitante"
              type="number"
              value={postMatchData.away_shots}
              onChange={onInputChange}
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="subtitle1">Posesión (%)</Typography>
            <TextField
              name="home_possession"
              label="Posesión local"
              type="number"
              value={postMatchData.home_possession}
              onChange={onInputChange}
              size="small"
              helperText="Debe sumar 100% con el visitante"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            <TextField
              name="away_possession"
              label="Posesión visitante"
              type="number"
              value={postMatchData.away_possession}
              onChange={onInputChange}
              size="small"
              helperText="Debe sumar 100% con el local"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Guardar resultados
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultsDialog;