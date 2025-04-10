// frontend/src/components/league/list/index.js

import React, { useState, useEffect } from 'react';
import { Paper, List, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Componentes
import LeagueListHeader from './LeagueListHeader';
import LeagueItem from './LeagueItem';
import LeagueDetails from './LeagueDetails';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

// Servicios y utilidades
import { fetchLeagues, fetchLeagueFullDetails } from '../../../utils/api/leagueServices';

/**
 * Componente principal para mostrar una lista de ligas
 * 
 * @returns {JSX.Element} Lista de ligas
 */
const LeagueList = ({onCreateLeague }) => {
  // Estados
  const [leagues, setLeagues] = useState([]);
  const [expandedLeague, setExpandedLeague] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [leagueDetails, setLeagueDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});
  
  // Hooks
  const navigate = useNavigate();

  // Cargar ligas al montar el componente
  useEffect(() => {
    loadLeagues();
  }, []);

  // Función para cargar la lista de ligas
  const loadLeagues = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const data = await fetchLeagues();
      setLeagues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar la expansión/colapso de una liga
  const handleToggleLeague = async (leagueId) => {
    // Si ya está expandida, la colapsamos
    if (expandedLeague === leagueId) {
      setExpandedLeague(null);
      return;
    }
    
    // Expandir la nueva liga
    setExpandedLeague(leagueId);
    
    // Cargar detalles si no los tenemos aún
    if (!leagueDetails[leagueId]) {
      try {
        // Marcar como cargando
        setDetailsLoading(prev => ({ ...prev, [leagueId]: true }));
        
        // Cargar detalles
        const details = await fetchLeagueFullDetails(leagueId);
        
        // Actualizar detalles
        setLeagueDetails(prev => ({
          ...prev,
          [leagueId]: details
        }));
      } catch (err) {
        console.error('Error al cargar detalles de liga:', err);
      } finally {
        // Marcar como no cargando
        setDetailsLoading(prev => ({ ...prev, [leagueId]: false }));
      }
    }
  };

  // Funciones de navegación

  const handleViewMatches = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  const handleViewStandings = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  const handleViewStats = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  // Renderizado condicional
  if (isLoading && leagues.length === 0) {
    return <LoadingState />;
  }

  if (error && leagues.length === 0) {
    return <ErrorState message={error} />;
  }

  if (leagues.length === 0) {
    return <EmptyState onCreateLeague={onCreateLeague} />;
  }

  // Renderizado principal
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <LeagueListHeader onCreateLeague={onCreateLeague} />

      <List sx={{ width: '100%' }}>
        {leagues.map((league) => (
          <React.Fragment key={league.id}>
            <LeagueItem 
              league={league} 
              isExpanded={expandedLeague === league.id}
              onToggleExpand={handleToggleLeague}
            />
            
            <LeagueDetails 
              leagueId={league.id}
              isExpanded={expandedLeague === league.id}
              details={leagueDetails[league.id]}
              isLoading={detailsLoading[league.id]}
              onViewMatches={handleViewMatches}
              onViewStandings={handleViewStandings}
              onViewStats={handleViewStats}
            />
            
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default LeagueList;