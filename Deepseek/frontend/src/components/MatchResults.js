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
  Divider
} from '@mui/material';
import axios from 'axios';

const MatchResults = ({ onUpdateMatch }) => {
  const [matches, setMatches] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
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
    
    fetchMatches();
  }, []);

  const handleJornadaChange = (event) => {
    setSelectedJornada(event.target.value);
  };

  const filteredMatches = selectedJornada 
    ? matches.filter(match => match.jornada === selectedJornada)
    : [];

  const handleUpdateMatch = async (matchId) => {
    if (onUpdateMatch) {
      onUpdateMatch(matchId);
    }
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
                  <TableRow key={match.id} hover>
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
                        {match.home_goals || 0} - {match.away_goals || 0}
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
                          {match.home_possession}%
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="secondary">
                          {match.away_possession}%
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Tiros */}
                    <TableCell>
                      <Box textAlign="center">
                        <Typography variant="body2">
                          {match.home_shots}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          {match.away_shots}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Acciones */}
                    <TableCell>
                      <Button 
                        size="small" 
                        onClick={() => handleUpdateMatch(match.id)}
                        variant="outlined"
                      >
                        Editar
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
    </Paper>
  );
};

export default MatchResults;