import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Chip,
  Badge,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import axios from 'axios';

const LeagueCreatorManager = ({ league, onUpdate }) => {
  const theme = useTheme();
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [customManagerName, setCustomManagerName] = useState('');
  const [customManagerId, setCustomManagerId] = useState('');
  const [useCustomManager, setUseCustomManager] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expanded, setExpanded] = useState(false);

  const leagueId = league?.id;
  const currentManager = league?.creator || {};

  // Cargar managers disponibles
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setIsLoading(true);
        
        // En una aplicación real, esto vendría de un endpoint de managers
        // Aquí simulamos una respuesta
        // Idealmente: const response = await axios.get('http://localhost:8000/managers/');
        
        const dummyManagers = [
          { id: 'user123', name: 'Usuario Actual', verified: true },
          { id: 'manager1', name: 'José Mourinho', verified: true },
          { id: 'manager2', name: 'Pep Guardiola', verified: true },
          { id: 'manager3', name: 'Carlo Ancelotti', verified: false },
          { id: 'manager4', name: 'Jürgen Klopp', verified: true },
          { id: 'manager5', name: 'Diego Simeone', verified: false }
        ];
        
        setManagers(dummyManagers);
        
        // Si hay un manager actual, seleccionarlo
        if (currentManager && currentManager.id) {
          setSelectedManager(currentManager.id);
        } else if (currentManager && currentManager.name) {
          setUseCustomManager(true);
          setCustomManagerName(currentManager.name);
          setCustomManagerId(currentManager.id || '');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar managers: ' + (err.response?.data?.detail || err.message));
        setIsLoading(false);
      }
    };
    
    fetchManagers();
  }, [currentManager]);

  // Manejar cambio de manager seleccionado
  const handleManagerChange = (event) => {
    setSelectedManager(event.target.value);
    setUseCustomManager(false);
  };

  // Manejar cambio a modo custom manager
  const handleUseCustomManager = () => {
    setUseCustomManager(true);
    setSelectedManager('');
  };

  // Guardar creador de la liga
  const handleSaveCreator = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      let managerId, managerName;
      
      if (useCustomManager) {
        managerId = customManagerId;
        managerName = customManagerName;
      } else {
        const manager = managers.find(m => m.id === selectedManager);
        managerId = manager?.id || '';
        managerName = manager?.name || '';
      }
      
      // Actualizar el creador de la liga
      await axios.put(`http://localhost:8000/leagues/${leagueId}`, {
        manager_id: managerId,
        manager_name: managerName
      });
      
      setSuccess('Creador de la liga actualizado correctamente');
      
      // Llamar al callback si existe
      if (onUpdate) {
        onUpdate();
      }
      
      setIsLoading(false);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Error al actualizar creador: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Encontrar el manager actual en la lista si existe
  const currentManagerObj = managers.find(m => m.id === currentManager?.id);

  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
            <AdminIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div" fontWeight="bold">
            Creador de la Liga
          </Typography>
        }
        action={
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="mostrar/ocultar"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
        sx={{ 
          pb: 1, 
          '& .MuiCardHeader-action': { 
            margin: 0,
            alignSelf: 'center'
          } 
        }}
      />
      
      <Divider />
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            El creador de la liga es responsable de su gestión y administración. Puedes seleccionar un manager existente o crear uno nuevo para este rol.
          </Typography>
        </CardContent>
        <Divider />
      </Collapse>

      <CardContent>
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 1,
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
          >
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 1,
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
          >
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 2, 
                backgroundColor: theme.palette.background.default
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Creador Actual
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  bgcolor: theme.palette.background.paper,
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  {currentManagerObj?.verified ? (
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Avatar sx={{ width: 16, height: 16, bgcolor: 'success.main' }}>
                          <VerifiedIcon sx={{ fontSize: 12 }} />
                        </Avatar>
                      }
                    >
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: currentManager?.name ? theme.palette.secondary.main : theme.palette.grey[300],
                          mr: 2
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    </Badge>
                  ) : (
                    <Avatar 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        bgcolor: currentManager?.name ? theme.palette.secondary.main : theme.palette.grey[300],
                        mr: 2
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  )}
                  
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {currentManager?.name || 'Sin creador asignado'}
                    </Typography>
                    {currentManager?.id && (
                      <Typography variant="caption" color="text.secondary">
                        ID: {currentManager.id}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Cambiar Creador
            </Typography>
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="manager-select-label">Seleccionar Manager</InputLabel>
              <Select
                labelId="manager-select-label"
                value={selectedManager}
                onChange={handleManagerChange}
                label="Seleccionar Manager"
                disabled={useCustomManager || isLoading}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {manager.verified && (
                        <VerifiedIcon 
                          fontSize="small" 
                          sx={{ mr: 1, color: theme.palette.success.main }} 
                        />
                      )}
                      <PersonIcon 
                        fontSize="small" 
                        sx={{ mr: 1, color: theme.palette.text.secondary }} 
                      />
                      {manager.name}
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleUseCustomManager}>
                  <Typography color="primary" sx={{ fontWeight: 'medium' }}>
                    Ingresar Nuevo Manager...
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
            
            {useCustomManager && (
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
                      onChange={(e) => setCustomManagerId(e.target.value)}
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
                      onChange={(e) => setCustomManagerName(e.target.value)}
                      disabled={isLoading}
                      required
                      error={useCustomManager && !customManagerName}
                      helperText={useCustomManager && !customManagerName ? "El nombre es obligatorio" : ""}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setUseCustomManager(false)}
                      disabled={isLoading}
                      color="inherit"
                      sx={{ mt: 1 }}
                    >
                      Volver a Selección
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={handleSaveCreator}
              disabled={isLoading || (!selectedManager && (!useCustomManager || !customManagerName))}
              fullWidth
              size="large"
              sx={{ py: 1.2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LeagueCreatorManager;