import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button 
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon, 
  Add as AddIcon, 
  Refresh as RefreshIcon 
} from '@mui/icons-material';

/**
 * Componente de encabezado del calendario con controles
 * 
 * @param {Object} props - Props del componente
 * @param {number} props.selectedJornada - Jornada seleccionada
 * @param {Array<number>} props.jornadas - Lista de jornadas disponibles
 * @param {Function} props.onJornadaChange - Función al cambiar la jornada
 * @param {Function} props.onAddMatch - Función para añadir un partido
 * @param {Function} props.onGenerateCalendar - Función para generar el calendario
 * @returns {JSX.Element} Encabezado del calendario
 */
const CalendarHeader = ({ 
  selectedJornada, 
  jornadas, 
  onJornadaChange, 
  onAddMatch, 
  onGenerateCalendar 
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6">
        <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Calendario de Partidos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="jornada-select-label">Jornada</InputLabel>
          <Select
            labelId="jornada-select-label"
            value={selectedJornada || ''}
            label="Jornada"
            onChange={(e) => onJornadaChange(e.target.value)}
          >
            {jornadas.map(jornada => (
              <MenuItem key={jornada} value={jornada}>Jornada {jornada}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddMatch}
          size="small"
        >
          Agregar Partido
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={onGenerateCalendar}
          size="small"
        >
          Generar Calendario
        </Button>
      </Box>
    </Box>
  );
};

export default CalendarHeader;