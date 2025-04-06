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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Chip,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Sports as SportsIcon
} from '@mui/icons-material';
import axios from 'axios';

const LeagueTeamManager = ({ leagueId, onUpdate }) => {
  const theme = useTheme();
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState({});
  const [managerInputs, setManagerInputs] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogManagerId, setDialogManagerId] = useState('');
  const [dialogTeamId, setDialogTeamId] = useState(null);
  const [dialogManagerName, setDialogManagerName] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Obtener equipos de la liga y managers disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Obtener equipos de la liga
        const teamsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/teams`);
        setTeams(teamsResponse.data);

        // Inicializar estados para la edición
        const initialEditMode = {};
        const initialManagerInputs = {};
        teamsResponse.data.forEach(team => {
          initialEditMode[team.id] = false;
          initialManagerInputs[team.id] = team.manager || '';
        });
        setEditMode(initialEditMode);
        setManagerInputs(initialManagerInputs);

        // Obtener lista de managers disponibles (simulado)
        // En una aplicación real, esto vendría de un endpoint /managers
        // Por ahora simulamos algunos managers para la demo
        setManagers([
          { id: 'user123', name: 'Usuario Actual' },
          { id: 'manager1', name: 'José Mourinho' },
          { id: 'manager2', name: 'Pep Guardiola' },
          { id: 'manager3', name: 'Carlo Ancelotti' },
          { id: 'manager4', name: 'Jürgen Klopp' },
          { id: 'manager5', name: 'Diego Simeone' }
        ]);

        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar datos: ' + (err.response?.data?.detail || err.message));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  // Activar modo de edición para un equipo
  const handleEditClick = (teamId) => {
    setEditMode({ ...editMode, [teamId]: true });
  };

  // Cancelar la edición
  const handleCancelEdit = (teamId) => {
    // Restaurar el valor original
    const team = teams.find(t => t.id === teamId);
    setManagerInputs({ ...managerInputs, [teamId]: team.manager || '' });
    setEditMode({ ...editMode, [teamId]: false });
  };

  // Manejar cambios en el input del manager
  const handleManagerInputChange = (teamId, value) => {
    setManagerInputs({ ...managerInputs, [teamId]: value });
  };

  // Guardar los cambios del manager para un equipo
  const handleSaveManager = async (teamId) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Actualizar el manager del equipo en el backend
      const response = await axios.put(`http://localhost:8000/teams/${teamId}`, {
        manager: managerInputs[teamId]
      });

      // Actualizar el equipo en el estado local
      const updatedTeams = teams.map(team => 
        team.id === teamId ? { ...team, manager: managerInputs[teamId] } : team
      );
      setTeams(updatedTeams);
      
      setEditMode({ ...editMode, [teamId]: false });
      setSuccess(`Manager actualizado para ${response.data.name}`);
      
      // Llamar al callback si existe
      if (onUpdate) {
        onUpdate();
      }

      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setIsLoading(false);
    } catch (err) {
      setError('Error al actualizar manager: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
  };

  // Abrir diálogo para asignar manager
  const handleOpenDialog = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setDialogTeamId(teamId);
    setDialogManagerId(team.manager_id || '');
    setDialogManagerName(team.manager || '');
    setOpenDialog(true);
  };

  // Asignar manager desde el diálogo
  const handleAssignManager = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Si se seleccionó un manager existente
      if (dialogManagerId) {
        const selectedManager = managers.find(m => m.id === dialogManagerId);
        // Actualizar el manager del equipo en el backend
        await axios.put(`http://localhost:8000/teams/${dialogTeamId}`, {
          manager_id: dialogManagerId,
          manager: selectedManager.name
        });

        // Actualizar el equipo en el estado local
        const updatedTeams = teams.map(team => 
          team.id === dialogTeamId ? { ...team, manager_id: dialogManagerId, manager: selectedManager.name } : team
        );
        setTeams(updatedTeams);
      } 
      // Si se ingresó un nombre de manager nuevo
      else if (dialogManagerName) {
        // Actualizar el manager del equipo en el backend
        await axios.put(`http://localhost:8000/teams/${dialogTeamId}`, {
          manager: dialogManagerName
        });

        // Actualizar el equipo en el estado local
        const updatedTeams = teams.map(team => 
          team.id === dialogTeamId ? { ...team, manager: dialogManagerName } : team
        );
        setTeams(updatedTeams);
      }

      setSuccess('Manager asignado correctamente');
      setOpenDialog(false);
      
      // Llamar al callback si existe
      if (onUpdate) {
        onUpdate();
      }

      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setIsLoading(false);
    } catch (err) {
      setError('Error al asignar manager: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
      setOpenDialog(false);
    }
  };

  // Eliminar manager de un equipo
  const handleRemoveManager = async (teamId) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Actualizar el manager del equipo en el backend
      await axios.put(`http://localhost:8000/teams/${teamId}`, {
        manager: null,
        manager_id: null
      });

      // Actualizar el equipo en el estado local
      const updatedTeams = teams.map(team => 
        team.id === teamId ? { ...team, manager: null, manager_id: null } : team
      );
      setTeams(updatedTeams);
      
      setSuccess('Manager eliminado correctamente');
      
      // Llamar al callback si existe
      if (onUpdate) {
        onUpdate();
      }

      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setIsLoading(false);
    } catch (err) {
      setError('Error al eliminar manager: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (isLoading && teams.length === 0) {
    return (
      <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
        <CardContent sx={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <GroupIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div" fontWeight="bold">
            Gestión de Managers
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
            Asigna, edita o elimina managers para cada equipo de la liga. El manager será responsable de las decisiones técnicas y tácticas de su equipo.
          </Typography>
        </CardContent>
        <Divider />
      </Collapse>

      <CardContent sx={{ p: 0 }}>
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              m: 2, 
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
              m: 2, 
              borderRadius: 1,
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
          >
            {error}
          </Alert>
        )}
        
        {teams.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No hay equipos disponibles en esta liga.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {teams.map((team, index) => (
              <React.Fragment key={team.id}>
                {index > 0 && <Divider variant="inset" component="li" />}
                <ListItem
                  sx={{ 
                    py: 2,
                    px: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: team.manager ? theme.palette.success.light : theme.palette.grey[300],
                        color: team.manager ? 'white' : theme.palette.text.secondary
                      }}
                    >
                      {team.manager ? <PersonIcon /> : <SportsIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {team.name}
                      </Typography>
                    }
                    secondary={
                      editMode[team.id] ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={managerInputs[team.id]}
                          onChange={(e) => handleManagerInputChange(team.id, e.target.value)}
                          placeholder="Nombre del manager"
                          sx={{ mt: 1, width: '100%' }}
                          InputProps={{
                            startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      ) : (
                        team.manager ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                            <Typography variant="body2" color="text.secondary">
                              {team.manager}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Sin manager asignado
                          </Typography>
                        )
                      )
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    {editMode[team.id] ? (
                      <Box>
                        <Tooltip title="Guardar">
                          <IconButton 
                            edge="end" 
                            aria-label="guardar"
                            onClick={() => handleSaveManager(team.id)}
                            disabled={isLoading}
                            color="primary"
                            sx={{ mr: 0.5 }}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                          <IconButton 
                            edge="end" 
                            aria-label="cancelar"
                            onClick={() => handleCancelEdit(team.id)}
                            disabled={isLoading}
                            color="default"
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box>
                        <Tooltip title="Asignar manager">
                          <IconButton 
                            edge="end" 
                            aria-label="asignar manager"
                            onClick={() => handleOpenDialog(team.id)}
                            disabled={isLoading}
                            color="primary"
                            sx={{ mr: 0.5 }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <span>
                            <IconButton 
                              edge="end" 
                              aria-label="editar"
                              onClick={() => handleEditClick(team.id)}
                              disabled={isLoading || !team.manager}
                              color="primary"
                              sx={{ mr: 0.5 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <span>
                            <IconButton 
                              edge="end" 
                              aria-label="eliminar"
                              onClick={() => handleRemoveManager(team.id)}
                              disabled={isLoading || !team.manager}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>

      {/* Diálogo para asignar manager */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
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
                  value={dialogManagerId}
                  onChange={(e) => {
                    setDialogManagerId(e.target.value);
                    if (e.target.value) {
                      const selectedManager = managers.find(m => m.id === e.target.value);
                      setDialogManagerName(selectedManager?.name || '');
                    }
                  }}
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
                value={dialogManagerName}
                onChange={(e) => {
                  setDialogManagerName(e.target.value);
                  setDialogManagerId('');
                }}
                disabled={!!dialogManagerId}
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
            onClick={() => setOpenDialog(false)} 
            color="inherit"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAssignManager} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!dialogManagerId && !dialogManagerName}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default LeagueTeamManager;