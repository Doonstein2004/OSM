import React from 'react';
import { TablePagination } from '@mui/material';

/**
 * Componente que muestra los controles de paginación para la tabla
 */
const TablePaginationActions = ({ 
  count, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 50]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="Filas por página:"
    />
  );
};

export default TablePaginationActions;