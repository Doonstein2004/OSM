import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Componentes
import LeagueFormHeader from './LeagueFormHeader';
import NameSection from './NameSection';
import TypeSection from './TypeSection';
import SettingsSection from './SettingsSection';
import ManagerSection from './ManagerSection';
import StatusMessages from './StatusMessages';
import FormActions from './FormActions';

// Utilidades
import { createLeague, formatLeagueData } from '../../../utils/api/leagueCreation';
import { validateLeagueForm } from '../../../utils/validators/leagueFormValidators';

/**
 * Componente principal para la creación de una liga
 * 
 * @param {Object} props - Props del componente
 * @param {Function} props.onCreateLeague - Callback para cuando se crea una liga
 * @returns {JSX.Element} Formulario de creación de liga
 */
const LeagueInput = ({ onCreateLeague }) => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [showCountry, setShowCountry] = useState(false);
  const [country, setCountry] = useState('');
  const [tipoLiga, setTipoLiga] = useState('');
  const [maxTeams, setMaxTeams] = useState(20);
  const [jornadas, setJornadas] = useState(38);
  
  // Estados de interfaz
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  
  // Información del manager actual (simulada/hardcoded)
  const [manager, setManager] = useState(() => {
    // En una aplicación real, estos datos vendrían de un sistema de autenticación
    return {
      id: localStorage.getItem('userId') || 'user123',
      name: localStorage.getItem('userName') || 'Usuario Actual'
    };
  });

  // Tipos de liga disponibles
  const tiposLiga = [
    "Liga Tactica",
    "Liga Interna",
    "Torneo",
    "Batallas"
  ];

  // Determinar si el país es necesario basado en el tipo de liga
  useEffect(() => {
    if (tipoLiga === "Batallas" || tipoLiga === "Liga Interna") {
      setShowCountry(false);
      setCountry('');
    } else if (tipoLiga === "Liga Tactica" || tipoLiga === "Torneo") {
      setShowCountry(true);
    }
  }, [tipoLiga]);

  // Ajustar número de jornadas según tipo de liga
  useEffect(() => {
    if (tipoLiga === "Torneo") {
      setJornadas(Math.min(jornadas, 10)); // Torneos con menos jornadas
    } else if (tipoLiga === "Batallas") {
      setJornadas(Math.min(jornadas, 5)); // Batallas con muy pocas jornadas
    }
  }, [tipoLiga, jornadas]);

  // Crear la liga
  const handleCreateLeague = async () => {
    // Recopilar datos del formulario
    const formData = {
      name,
      country,
      showCountry,
      tipoLiga,
      maxTeams,
      jornadas
    };
    
    // Validar formulario
    const validationError = validateLeagueForm(formData, manager);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    setErrorDetails('');
    
    try {
      // Formatear datos para la API
      const leagueData = formatLeagueData(formData, manager);
      
      // Crear la liga
      const response = await createLeague(leagueData);
      const leagueId = response.id;
      
      // Mostrar mensaje de éxito
      setSuccess('Liga creada exitosamente. Ahora puedes añadir equipos y simular partidos.');
      
      // Reset form
      resetForm();
      
      // Llamar al callback si existe
      if (onCreateLeague) {
        onCreateLeague(leagueId);
      }
      
      // Redirigir a la página de detalles
      navigate(`/leagues/${leagueId}`);
      
    } catch (err) {
      // Manejar error
      setError(err.message || 'Error al crear la liga');
      
      // Guardar detalles del error si existen
      if (err.details) {
        setErrorDetails(JSON.stringify(err.details, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setName('');
    setCountry('');
    setTipoLiga('');
    setMaxTeams(20);
    setJornadas(38);
  };

  // Verificar si hay error en cada sección
  const hasNameError = error.includes('nombre');
  const hasTypeError = error.includes('tipo');
  const hasCountryError = error.includes('país');
  const hasSettingsError = error.includes('equipos') || error.includes('jornadas');
  const hasManagerError = error.includes('manager');

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <LeagueFormHeader />
      
      <StatusMessages 
        successMessage={success}
        errorMessage={error}
        errorDetails={errorDetails}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <NameSection 
          name={name}
          onChange={setName}
          hasError={hasNameError}
        />
        
        <TypeSection 
          tipoLiga={tipoLiga}
          country={country}
          showCountry={showCountry}
          onTipoLigaChange={setTipoLiga}
          onCountryChange={setCountry}
          tiposLiga={tiposLiga}
          hasTypeError={hasTypeError}
          hasCountryError={hasCountryError}
        />
        
        <SettingsSection 
          maxTeams={maxTeams}
          jornadas={jornadas}
          tipoLiga={tipoLiga}
          onMaxTeamsChange={setMaxTeams}
          onJornadasChange={setJornadas}
          hasError={hasSettingsError}
        />
        
        <ManagerSection 
          manager={manager}
          hasError={hasManagerError}
        />
      </Box>
      
      <FormActions 
        onCreateLeague={handleCreateLeague}
        isLoading={isLoading}
        isDisabled={!name || !tipoLiga || (showCountry && !country)}
      />
    </Paper>
  );
};

export default LeagueInput;