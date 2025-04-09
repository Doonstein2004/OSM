import React, { useState } from 'react';
import { Card, CardContent, Divider, Alert, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Componentes
import DeletionHeader from './DeletionHeader';
import InfoSection from './InfoSection';
import DeletionCard from './DeletionCard';
import ConfirmationDialog from './ConfirmationDialog';

// Utilidades
import { deleteLeague, getExpectedConfirmationText } from '../../../utils/api/leagueOperations';

/**
 * Componente principal para la eliminación de una liga
 * 
 * @param {Object} props - Props del componente
 * @param {string|number} props.leagueId - ID de la liga a eliminar
 * @param {string} props.leagueName - Nombre de la liga
 * @returns {JSX.Element} Componente de eliminación de liga
 */
const LeagueDeletionManager = ({ leagueId, leagueName }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  // Texto de confirmación esperado
  const expectedConfirmation = getExpectedConfirmationText(leagueName);
  
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

  // Manejar cambio en el texto de confirmación
  const handleConfirmationTextChange = (text) => {
    setConfirmationText(text);
  };
  
  // Toggle de la sección expandible
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Eliminar la liga
  const handleDeleteLeague = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Llamar al endpoint para eliminar la liga
      await deleteLeague(leagueId);

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

  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme.palette.error.light
      }}
    >
      <DeletionHeader 
        expanded={expanded} 
        onToggleExpand={handleExpandClick} 
      />
      
      <Divider sx={{ borderColor: theme.palette.error.light }} />
      
      <InfoSection expanded={expanded} />

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
        
        <DeletionCard 
          leagueName={leagueName} 
          isLoading={isLoading} 
          onDelete={handleOpenDialog} 
        />
      </CardContent>

      <ConfirmationDialog 
        open={openDialog}
        leagueName={leagueName}
        confirmationText={confirmationText}
        expectedText={expectedConfirmation}
        isLoading={isLoading}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteLeague}
        onTextChange={handleConfirmationTextChange}
      />
    </Card>
  );
};

export default LeagueDeletionManager;