import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

// Componentes
import CreatorHeader from './CreatorHeader';
import InfoSection from './InfoSection';
import CurrentManagerCard from './CurrentManagerCard';
import ManagerSelector from './ManagerSelector';
import CustomManagerForm from './CustomManagerForm';

// Utilidades
import { updateLeagueCreator, fetchManagers } from '../../../utils/api/leagueManager';
import { formatManagerData } from '../../../utils/models/managerData';

/**
 * Componente principal para gestionar el creador de una liga
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.league - Datos de la liga
 * @param {Function} props.onUpdate - Callback para notificar actualizaciones
 * @returns {JSX.Element} Componente LeagueCreatorManager
 */
const LeagueCreatorManager = ({ league, onUpdate }) => {
  // Estados
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
    const loadManagers = async () => {
      try {
        setIsLoading(true);
        
        const loadedManagers = await fetchManagers();
        setManagers(loadedManagers);
        
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
    
    loadManagers();
  }, [currentManager]);

  // Manejadores de eventos
  const handleManagerChange = (event) => {
    setSelectedManager(event.target.value);
    setUseCustomManager(false);
  };

  const handleUseCustomManager = () => {
    setUseCustomManager(true);
    setSelectedManager('');
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSaveCreator = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      let managerId, managerName;
      
      if (useCustomManager) {
        managerId = customManagerId;
        managerName = customManagerName;
        
        if (!managerName) {
          setError('El nombre del manager es obligatorio');
          setIsLoading(false);
          return;
        }
      } else {
        const manager = managers.find(m => m.id === selectedManager);
        managerId = manager?.id || '';
        managerName = manager?.name || '';
      }
      
      // Preparar datos
      const managerData = formatManagerData(managerId, managerName);
      
      // Actualizar el creador de la liga
      await updateLeagueCreator(leagueId, managerData);
      
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

  // Renderizado del componente
  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CreatorHeader 
        expanded={expanded} 
        onToggleExpand={handleExpandClick} 
      />
      
      <Divider />
      
      <InfoSection expanded={expanded} />

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
            <CurrentManagerCard 
              manager={currentManager} 
              managers={managers} 
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Cambiar Creador
            </Typography>
            
            <ManagerSelector 
              managers={managers}
              selectedManager={selectedManager}
              isLoading={isLoading}
              disabled={useCustomManager}
              onChange={handleManagerChange}
              onCustomManager={handleUseCustomManager}
            />
            
            {useCustomManager && (
              <CustomManagerForm 
                customManagerId={customManagerId}
                customManagerName={customManagerName}
                isLoading={isLoading}
                onIdChange={setCustomManagerId}
                onNameChange={setCustomManagerName}
                onBack={() => setUseCustomManager(false)}
              />
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