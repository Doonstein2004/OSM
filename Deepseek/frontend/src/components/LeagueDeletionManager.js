import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Collapse,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeagueDeletionManager = ({ leagueId, leagueName }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Abrir diálogo de confirmación
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setConfirmationText('');
  };

  // Cerrar diálogo de confirmación
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConfirmationText('');
  };

  // Eliminar la liga
  const handleDeleteLeague = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Llamar al endpoint para eliminar la liga
      await axios.delete(`http://localhost:8000/leagues/${leagueId}`);

      setIsLoading(false);
      setOpenDialog(false);
      
      // Navegar a la lista de ligas
      navigate('/leagues', { 
        state: { 
          message: `La liga "${leagueName}" ha sido eliminada correctamente`,
          severity: 'success'
        } 
      });
    } catch (err) {
      setError('Error al eliminar la liga: ' + (err.response?.data?.detail || err.message));
      setIsLoading(false);
      setOpenDialog(false);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const expectedConfirmation = `ELIMINAR ${leagueName}`;

  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme.palette.error.light
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.error.main }}>
            <DeleteIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div" fontWeight="bold" color="error.main">
            Zona de Peligro
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
      
      <Divider sx={{ borderColor: theme.palette.error.light }} />
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 2, pb: 2, bgcolor: 'error.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <WarningIcon color="error" sx={{ mr: 1, mt: 0.3 }} />
            <Typography variant="body2" paragraph>
              Esta sección permite eliminar completamente la liga. Esta acción es irreversible y todos los datos asociados 
              (equipos, partidos, estadísticas) serán eliminados permanentemente.
            </Typography>
          </Box>
        </CardContent>
        <Divider sx={{ borderColor: theme.palette.error.light }} />
      </Collapse>

      <CardContent sx={{ bgcolor: 'error.50' }}>
        {error && (
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ mb: 3, '& .MuiAlert-message': { fontWeight: 500 } }}
          >
            {error}
          </Alert>
        )}
        
        <Box 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: theme.palette.error.light
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Eliminar Liga Permanentemente
            </Typography>
          </Box>
          
          <Typography variant="body2" paragraph>
            Esta acción eliminará permanentemente la liga <strong>{leagueName}</strong>, junto con todos sus 
            equipos asociados, partidos y estadísticas.
          </Typography>
          
          <Typography variant="body2" color="error" fontWeight="medium" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleOpenDialog}
          disabled={isLoading}
          fullWidth
          size="large"
          sx={{ py: 1.2 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Eliminar Liga'
          )}
        </Button>
      </CardContent>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{ 
          elevation: 5,
          sx: { 
            borderRadius: 2,
            maxWidth: 500 
          } 
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <WarningIcon />
          Confirmación de Eliminación
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ErrorIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
            <DialogContentText sx={{ color: 'text.primary', fontWeight: 'medium' }}>
              ¿Estás seguro de que deseas eliminar esta liga?
            </DialogContentText>
          </Box>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            Esta acción eliminará permanentemente la liga <strong>{leagueName}</strong> y todos sus datos asociados. 
            Esta acción no se puede deshacer.
          </Alert>

          <Typography variant="body2" sx={{ mb: 2, fontWeight: 'medium' }}>
            Para confirmar, escribe exactamente: <strong>"{expectedConfirmation}"</strong>
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            variant="outlined"
            placeholder={expectedConfirmation}
            error={confirmationText.length > 0 && confirmationText !== expectedConfirmation}
            helperText={
              confirmationText.length > 0 && 
              confirmationText !== expectedConfirmation && 
              "El texto no coincide exactamente"
            }
            InputProps={{
              sx: { fontWeight: 'medium' }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteLeague} 
            color="error" 
            variant="contained"
            disabled={confirmationText !== expectedConfirmation}
            startIcon={<DeleteIcon />}
          >
            Eliminar Permanentemente
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default LeagueDeletionManager;