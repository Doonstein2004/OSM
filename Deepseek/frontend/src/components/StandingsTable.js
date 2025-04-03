import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  TablePagination,
  LinearProgress
} from '@mui/material';
import axios from 'axios';

const StandingsTable = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/standings/');
        setStandings(response.data);
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStandings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <LinearProgress />;
  }



  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Tabla de Posiciones
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Equipo</TableCell>
              <TableCell align="center">PJ</TableCell>
              <TableCell align="center">G</TableCell>
              <TableCell align="center">E</TableCell>
              <TableCell align="center">P</TableCell>
              <TableCell align="center">GF</TableCell>
              <TableCell align="center">GC</TableCell>
              <TableCell align="center">DG</TableCell>
              <TableCell align="center">Pts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((team, index) => (
                <TableRow key={team.team_id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    {team.team_name}
                    {team.team_manager && (
                      <Typography variant="body2" color="text.secondary">
                        ({team.team_manager ?? "Computadora"})
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{team.played}</TableCell>
                  <TableCell align="center">{team.wins}</TableCell>
                  <TableCell align="center">{team.draws}</TableCell>
                  <TableCell align="center">{team.losses}</TableCell>
                  <TableCell align="center">{team.goals_for}</TableCell>
                  <TableCell align="center">{team.goals_against}</TableCell>
                  <TableCell align="center">{team.goal_difference}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{team.points}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50,]}
        component="div"
        count={standings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
      />
    </Paper>
  );
};

export default StandingsTable;