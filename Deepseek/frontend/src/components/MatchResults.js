import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  LinearProgress,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import axios from 'axios';

const MatchResults = ({ onUpdateMatch }) => {
  const [matches, setMatches] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState('');
  const [loading, setLoading] = useState(true);
  
  // States for edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [postMatchData, setPostMatchData] = useState({
    home_possession: '',
    away_possession: '',
    home_shots: '',
    away_shots: '',
    home_goals: '',
    away_goals: ''
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/matches/');
      const processedMatches = response.data.map(match => ({
        ...match,
        home_team: match.home_team || { name: 'Equipo Desconocido', manager: 'Sin manager' },
        away_team: match.away_team || { name: 'Equipo Desconocido', manager: 'Sin manager' },
        home_formation: match.home_formation || 'No especificada',
        away_formation: match.away_formation || 'No especificada',
        home_style: match.home_style || 'No especificado',
        away_style: match.away_style || 'No especificado',
        home_kicks: match.home_kicks || 'No especificado',
        away_kicks: match.away_kicks || 'No especificado',
        home_attack: match.home_attack || '00-00-00',
        away_attack: match.away_attack || '00-00-00'
      }));
      
      setMatches(processedMatches);
      
      const uniqueJornadas = [...new Set(response.data.map(match => match.jornada))];
      setJornadas(uniqueJornadas.sort((a, b) => a - b));
      
      if (uniqueJornadas.length > 0) {
        setSelectedJornada(Math.max(...uniqueJornadas));
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJornadaChange = (event) => {
    setSelectedJornada(event.target.value);
  };

  const filteredMatches = selectedJornada 
    ? matches.filter(match => match.jornada === selectedJornada)
    : [];

  const openEditDialog = (match) => {
    setEditingMatch(match);
    setPostMatchData({
      home_possession: match.home_possession || '',
      away_possession: match.away_possession || '',
      home_shots: match.home_shots || '',
      away_shots: match.away_shots || '',
      home_goals: match.home_goals || '',
      away_goals: match.away_goals || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMatch(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numeric input for these fields
    if (isNaN(value) && value !== '') {
      return;
    }
    
    setPostMatchData({
      ...postMatchData,
      [name]: value
    });
  };

  const handleSaveResults = async () => {
    try {
      // Validate possession adds up to 100%
      const homePoss = parseInt(postMatchData.home_possession);
      const awayPoss = parseInt(postMatchData.away_possession);
      
      if (homePoss + awayPoss !== 100) {
        alert('La posesión local y visitante debe sumar 100%');
        return;
      }
      
      // Convert input values to numbers
      const updatedData = {
        home_possession: parseInt(postMatchData.home_possession),
        away_possession: parseInt(postMatchData.away_possession),
        home_shots: parseInt(postMatchData.home_shots),
        away_shots: parseInt(postMatchData.away_shots),
        home_goals: parseInt(postMatchData.home_goals),
        away_goals: parseInt(postMatchData.away_goals)
      };
      
      // Call API to update match
      await axios.patch(`http://localhost:8000/matches/${editingMatch.id}/`, updatedData);
      
      // Refresh matches data
      fetchMatches();
      handleCloseDialog();
      
      // Notify parent component if needed
      if (onUpdateMatch) {
        onUpdateMatch(editingMatch.id);
      }
    } catch (error) {
      console.error('Error updating match results:', error);
      alert('Error al guardar los resultados del partido');
    }
  };

  const isMatchPlayed = (match) => {
    return match.home_goals !== null && 
           match.away_goals !== null && 
           match.home_possession !== null &&
           match.away_possession !== null;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Resultados de Partidos
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="jornada-select-label">Jornada</InputLabel>
          <Select
            labelId="jornada-select-label"
            value={selectedJornada || ''}
            label="Jornada"
            onChange={handleJornadaChange}
          >
            {jornadas.map(jornada => (
              <MenuItem key={jornada} value={jornada}>{jornada}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <LinearProgress />
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Local</TableCell>
                <TableCell align="center">Resultado</TableCell>
                <TableCell>Visitante</TableCell>
                <TableCell>Alineación/Estilo</TableCell>
                <TableCell>Avanzadas/Patadas</TableCell>
                <TableCell>Posesión</TableCell>
                <TableCell>Tiros</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <TableRow 
                    key={match.id} 
                    hover
                    sx={isMatchPlayed(match) ? { backgroundColor: 'rgba(76, 175, 80, 0.1)' } : {}}
                  >
                    {/* Equipo Local */}
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {match.home_team.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manager: {match.home_team.manager}
                      </Typography>
                    </TableCell>
                    
                    {/* Resultado */}
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      <Typography variant="h6">
                        {match.home_goals !== null ? match.home_goals : '-'} - {match.away_goals !== null ? match.away_goals : '-'}
                      </Typography>
                    </TableCell>
                    
                    {/* Equipo Visitante */}
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {match.away_team.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manager: {match.away_team.manager}
                      </Typography>
                    </TableCell>
                    
                    {/* Alineación y Estilo */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {match.home_formation}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({match.home_style})
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          {match.away_formation}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({match.away_style})
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Avanzadas y Patadas */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {match.home_attack}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({match.home_kicks})
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          {match.away_attack}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({match.away_kicks})
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Posesión */}
                    <TableCell>
                      <Box textAlign="center">
                        <Typography variant="body2" color="primary">
                          {match.home_possession !== null ? `${match.home_possession}%` : '-'}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="secondary">
                          {match.away_possession !== null ? `${match.away_possession}%` : '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Tiros */}
                    <TableCell>
                      <Box textAlign="center">
                        <Typography variant="body2">
                          {match.home_shots !== null ? match.home_shots : '-'}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          {match.away_shots !== null ? match.away_shots : '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Acciones */}
                    <TableCell>
                      <Button 
                        size="small" 
                        onClick={() => openEditDialog(match)}
                        variant="outlined"
                        color={isMatchPlayed(match) ? "success" : "primary"}
                      >
                        {isMatchPlayed(match) ? "Actualizar" : "Ingresar datos"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay partidos disponibles para esta jornada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for editing match results */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMatch && (
            <>
              Resultados: {editingMatch.home_team.name} vs {editingMatch.away_team.name}
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {editingMatch && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Equipo</Typography>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>{editingMatch.home_team.name}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>{editingMatch.away_team.name}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="subtitle1">Goles</Typography>
                <TextField
                  name="home_goals"
                  label="Goles local"
                  type="number"
                  value={postMatchData.home_goals}
                  onChange={handleInputChange}
                  size="small"
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  name="away_goals"
                  label="Goles visitante"
                  type="number"
                  value={postMatchData.away_goals}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  size="small"
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  name="away_shots"
                  label="Tiros visitante"
                  type="number"
                  value={postMatchData.away_shots}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  size="small"
                  helperText="Debe sumar 100% con el visitante"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
                <TextField
                  name="away_possession"
                  label="Posesión visitante"
                  type="number"
                  value={postMatchData.away_possession}
                  onChange={handleInputChange}
                  size="small"
                  helperText="Debe sumar 100% con el local"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveResults} variant="contained" color="primary">
            Guardar resultados
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MatchResults;