import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

/**
 * Componente para filtrar ligas por tipo, texto y número de equipos
 */
const LeagueFilters = ({
  tipoLiga,
  searchText,
  minTeams,
  maxTeams,
  onTipoLigaChange,
  onSearchTextChange,
  onMinTeamsChange,
  onMaxTeamsChange
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Tipo de Liga</InputLabel>
        <Select
          value={tipoLiga}
          onChange={(e) => onTipoLigaChange(e.target.value)}
          label="Tipo de Liga"
          size="small"
        >
          <MenuItem value="Liga Tactica">Liga Táctica</MenuItem>
          <MenuItem value="Liga Interna">Liga Interna</MenuItem>
          <MenuItem value="Torneo">Torneo</MenuItem>
          <MenuItem value="Batallas">Batallas</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        label="Buscar"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        sx={{ flexGrow: 1 }}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        label="Mín. Equipos"
        type="number"
        value={minTeams}
        onChange={(e) => onMinTeamsChange(e.target.value)}
        inputProps={{ min: 2 }}
        size="small"
        sx={{ width: 110 }}
      />
      
      <TextField
        label="Máx. Equipos"
        type="number"
        value={maxTeams}
        onChange={(e) => onMaxTeamsChange(e.target.value)}
        inputProps={{ min: 2 }}
        size="small"
        sx={{ width: 110 }}
      />
    </Box>
  );
};

export default LeagueFilters;