import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon, 
  Public as CountryIcon 
} from '@mui/icons-material';

/**
 * Sección para elegir el tipo de liga y país
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.tipoLiga - Tipo de liga seleccionado
 * @param {string} props.country - País seleccionado
 * @param {boolean} props.showCountry - Indica si se debe mostrar el campo país
 * @param {Function} props.onTipoLigaChange - Función para actualizar el tipo
 * @param {Function} props.onCountryChange - Función para actualizar el país
 * @param {Array<string>} props.tiposLiga - Lista de tipos de liga disponibles
 * @param {boolean} props.hasTypeError - Indica si hay error en el tipo
 * @param {boolean} props.hasCountryError - Indica si hay error en el país
 * @returns {JSX.Element} Sección de tipo y país
 */
const TypeSection = ({ 
  tipoLiga, 
  country, 
  showCountry, 
  onTipoLigaChange, 
  onCountryChange, 
  tiposLiga, 
  hasTypeError, 
  hasCountryError 
}) => {
  
  // Obtener texto de ayuda según el tipo de liga
  const getHelperText = (tipo) => {
    switch (tipo) {
      case 'Torneo':
        return 'Formato de eliminación con menos jornadas';
      case 'Batallas':
        return 'Enfrentamientos directos breves';
      case 'Liga Tactica':
        return 'Competición centrada en estrategia';
      case 'Liga Interna':
        return 'Competición entre miembros del mismo clan';
      default:
        return 'Selecciona el tipo de competición';
    }
  };
  
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControl fullWidth required error={hasTypeError}>
        <InputLabel>Tipo de Liga</InputLabel>
        <Select
          value={tipoLiga}
          onChange={(e) => onTipoLigaChange(e.target.value)}
          label="Tipo de Liga"
          startAdornment={<TrophyIcon sx={{ mr: 1, color: 'text.secondary' }} />}
        >
          {tiposLiga.map(tipo => (
            <MenuItem key={tipo} value={tipo}>
              {tipo}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {getHelperText(tipoLiga)}
        </FormHelperText>
      </FormControl>
      
      {showCountry && (
        <TextField
          label="País"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          fullWidth
          required={showCountry}
          error={hasCountryError}
          helperText={hasCountryError ? "El país es obligatorio para este tipo de liga" : ""}
          InputProps={{
            startAdornment: <CountryIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      )}
    </Box>
  );
};

export default TypeSection;