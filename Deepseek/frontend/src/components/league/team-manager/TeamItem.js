import React from 'react';
import {
  Box,
  TextField,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Sports as SportsIcon
} from '@mui/icons-material';

const TeamItem = ({
  team,
  editMode,
  managerInput,
  onInputChange,
  onEdit,
  onCancel,
  onSave,
  onOpenDialog,
  onRemove,
  isLoading,
  index
}) => {
  const theme = useTheme();

  return (
    <React.Fragment>
      {index > 0 && <li><hr style={{ margin: 0, opacity: 0.1, marginLeft: '72px' }} /></li>}
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
            editMode ? (
              <TextField
                variant="outlined"
                size="small"
                value={managerInput}
                onChange={(e) => onInputChange(e.target.value)}
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
          {editMode ? (
            <Box>
              <Tooltip title="Guardar">
                <IconButton 
                  edge="end" 
                  aria-label="guardar"
                  onClick={onSave}
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
                  onClick={onCancel}
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
                  onClick={onOpenDialog}
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
                    onClick={onEdit}
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
                    onClick={onRemove}
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
  );
};

export default TeamItem;