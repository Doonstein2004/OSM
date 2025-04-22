import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  Grid
} from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`match-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ResultsDialog = ({ 
  open, 
  match, 
  postMatchData, 
  onInputChange, 
  onClose, 
  onSave
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!match) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Resultados: {match.home_team.name} vs {match.away_team.name}
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="match data tabs">
          <Tab label="Resultado Básico" />
          <Tab label="Estadísticas Avanzadas" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Divider sx={{ my: 2 }}>Local: {match.home_team.name}</Divider>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Formación"
                name="home_formation"
                value={postMatchData.home_formation || match.home_formation || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: 4-4-2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estilo"
                name="home_style"
                value={postMatchData.home_style || match.home_style || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: Contraataque"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avanzadas"
                name="home_attack"
                value={postMatchData.home_attack || match.home_attack || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: Centros"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patadas"
                name="home_kicks"
                value={postMatchData.home_kicks || match.home_kicks || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: Agresivo"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }}>Visitante: {match.away_team.name}</Divider>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Formación"
                name="away_formation"
                value={postMatchData.away_formation || match.away_formation || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: 4-3-3"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estilo"
                name="away_style"
                value={postMatchData.away_style || match.away_style || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: Posesión"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avanzadas"
                name="away_attack"
                value={postMatchData.away_attack || match.away_attack || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: Pases Cortos"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patadas"
                name="away_kicks"
                value={postMatchData.away_kicks || match.away_kicks || ''}
                onChange={onInputChange}
                size="small"
                placeholder="Ej: Normal"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Guardar Resultados
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultsDialog;