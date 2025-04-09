import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const AssignManagerDialog = ({
  open,
  managerId,
  managerName,
  managers,
  onClose,
  onAssign,
  onManagerIdChange,
  onManagerNameChange,
  isLoading
}) => {
  const theme = useTheme();

  const handleManagerIdChange = (e) => {
    const value = e.target.value;
    onManagerIdChange(value);
    
    if (value) {
      const selectedManager = managers.find(m => m.id === value);
      onManagerNameChange(selectedManager?.name || '');
    }
  };

  const handleManagerNameChange = (e) => {
    onManagerNameChange(e.target.value);
    onManagerIdChange('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          Asignar Manager
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          Selecciona un manager existente o crea uno nuevo para este equipo.
        </DialogContentText>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Seleccionar Manager Existente</InputLabel>
              <Select
                value={managerId}
                onChange={handleManagerIdChange}
                label="Seleccionar Manager Existente"
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      {manager.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider>
              <Chip label="O" />
            </Divider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Nuevo Manager"
              value={managerName}
              onChange={handleManagerNameChange}
              disabled={!!managerId}
              variant="outlined"
              placeholder="Ej. Luis Enrique"
              InputProps={{
                startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onAssign} 
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={(!managerId && !managerName) || isLoading}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignManagerDialog;