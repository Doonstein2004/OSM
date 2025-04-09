import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableContainer, 
  Paper, 
  Typography
} from '@mui/material';

// Componentes
import StandingsHeader from './StandingsHeader';
import StandingsRow from './StandingsRow';
import TablePaginationActions from './TablePaginationActions';
import LoadingState from './LoadingState';

// Servicios
import { fetchStandings } from '../../utils/api/standingsService';

/**
 * Componente principal que muestra la tabla de posiciones
 */
const StandingsTable = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cargar datos de la tabla de posiciones
  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true);
        const data = await fetchStandings();
        setStandings(data);
      } catch (error) {
        console.error('Error loading standings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStandings();
  }, []);

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mostrar estado de carga si está cargando
  if (loading) {
    return <LoadingState />;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Tabla de Posiciones
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <StandingsHeader />
          <TableBody>
            {standings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((team, index) => (
                <StandingsRow 
                  key={team.team_id} 
                  team={team} 
                  position={page * rowsPerPage + index + 1} 
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePaginationActions
        count={standings.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default StandingsTable;