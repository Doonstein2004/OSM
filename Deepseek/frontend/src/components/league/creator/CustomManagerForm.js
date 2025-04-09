import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  useTheme 
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

/**
 * Formulario para ingresar datos de un manager personalizado
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.customManagerId - ID del manager personalizado
 * @param {string} props.customManagerName - Nombre del manager personalizado
 * @param {boolean} props.isLoading - Indica si está en proceso de carga
 * @param {Function} props.onIdChange - Función al cambiar ID
 * @param {Function} props.onNameChange - Función al cambiar nombre
 * @param {Function} props.onBack - Función para volver al selector
 * @returns {JSX.Element} Formulario de manager personalizado
 */
const CustomManagerForm = ({ 
  customManagerId, 
  customManagerName, 
  isLoading, 
  onIdChange, 
  onNameChange, 
  onBack 
}) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        p: 2, 
        mb: 3, 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 1,
        bgcolor: theme.palette.background.default
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="ID del Manager (opcional)"
            value={customManagerId}
            onChange={(e) => onIdChange(e.target.value)}
            disabled={isLoading}
            helperText="ID único para el manager, si lo tienes"
            variant="outlined"
            InputProps={{
              startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre del Manager"
            value={customManagerName}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isLoading}
            required
            error={!customManagerName}
            helperText={!customManagerName ? "El nombre es obligatorio" : ""}
            variant="outlined"
            InputProps={{
              startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            disabled={isLoading}
            color="inherit"
            sx={{ mt: 1 }}
          >
            Volver a Selección
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomManagerForm;