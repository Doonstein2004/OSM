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
  Button
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
        // Asegurarse que los matches tengan la estructura correcta
        const processedMatches = response.data.map(match => ({
          ...match,
          home_team: match.home_team || { name: 'Equipo Desconocido' },
          away_team: match.away_team || { name: 'Equipo Desconocido' },
          home_formation: match.home_formation || 'No especificada',
          away_formation: match.away_formation || 'No especificada',
          home_style: match.home_style || 'No especificado',
          away_style: match.away_style || 'No especificado'
        }));
        
        setMatches(processedMatches);
        
        // Extraer jornadas únicas
        const uniqueJornadas = [...new Set(response.data.map(match => match.jornada))];
        setJornadas(uniqueJornadas.sort((a, b) => a - b));
        
        if (uniqueJornadas.length > 0) {
          setSelectedJornada(Math.max(...uniqueJornadas));
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMatches([]); // Establecer un array vacío en caso de error
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
                <TableCell>Formación Local</TableCell>
                <TableCell>Formación Visitante</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <TableRow key={match.id} hover>
                    <TableCell>{match.home_team.name}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      {match.home_goals || 0} - {match.away_goals || 0}
                    </TableCell>
                    <TableCell>{match.away_team.name}</TableCell>
                    <TableCell>{match.home_formation} ({match.home_style})</TableCell>
                    <TableCell>{match.away_formation} ({match.away_style})</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        onClick={() => handleUpdateMatch(match.id)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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