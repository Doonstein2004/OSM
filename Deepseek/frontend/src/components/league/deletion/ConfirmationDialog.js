import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogContentText, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Alert 
} from '@mui/material';
import { 
  Warning as WarningIcon, 
  Delete as DeleteIcon, 
  ErrorOutline as ErrorIcon 
} from '@mui/icons-material';

/**
 * Diálogo de confirmación para eliminar una liga
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.open - Estado de apertura del diálogo
 * @param {string} props.leagueName - Nombre de la liga a eliminar
 * @param {string} props.confirmationText - Texto de confirmación actual
 * @param {string} props.expectedText - Texto de confirmación esperado
 * @param {boolean} props.isLoading - Indica si está en proceso de carga
 * @param {Function} props.onClose - Función para cerrar el diálogo
 * @param {Function} props.onConfirm - Función para confirmar la eliminación
 * @param {Function} props.onTextChange - Función para cambiar el texto de confirmación
 * @returns {JSX.Element} Diálogo de confirmación
 */
const ConfirmationDialog = ({ 
  open, 
  leagueName, 
  confirmationText, 
  expectedText, 
  isLoading, 
  onClose, 
  onConfirm, 
  onTextChange 
}) => {
  const isConfirmationValid = confirmationText === expectedText;
  const hasText = confirmationText.length > 0;
  const isTextError = hasText && !isConfirmationValid;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Para confirmar, escribe exactamente: <strong>"{expectedText}"</strong>
        </Typography>
        
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          value={confirmationText}
          onChange={(e) => onTextChange(e.target.value)}
          variant="outlined"
          placeholder={expectedText}
          error={isTextError}
          helperText={isTextError && "El texto no coincide exactamente"}
          InputProps={{
            sx: { fontWeight: 'medium' }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={!isConfirmationValid || isLoading}
          startIcon={<DeleteIcon />}
        >
          Eliminar Permanentemente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;