import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  CircularProgress,
  Typography
} from '@mui/material';
import axios from 'axios';

// Importar componentes refactorizados
import ManagerHeader from './ManagerHeader';
import InfoSection from './InfoSection';
import TeamItem from './TeamItem';
import StatusMessages from './StatusMessages';
import AssignManagerDialog from './AssignManagerDialog';

// Importar servicios API
import { fetchTeams, updateTeamManager, removeManager } from '../../../utils/api/teamManagerService';
import { getDummyManagers, formatManagerData } from '../../../utils/models/managerData';

const LeagueTeamManager = ({ leagueId, onUpdate }) => {
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
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // En una implementación real, esto usaría el servicio importado
        // const teamsData = await fetchTeams(leagueId);
        const teamsResponse = await axios.get(`http://localhost:8000/leagues/${leagueId}/teams`);
        const teamsData = teamsResponse.data;
        
        setTeams(teamsData);

        // Inicializar estados para la edición
        const initialEditMode = {};
        const initialManagerInputs = {};
        teamsData.forEach(team => {
          initialEditMode[team.id] = false;
          initialManagerInputs[team.id] = team.manager || '';
        });
        setEditMode(initialEditMode);
        setManagerInputs(initialManagerInputs);

        // En una implementación real, esto usaría el servicio importado
        // const managersData = await getDummyManagers();
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

    loadData();
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

      // En una implementación real, esto usaría el servicio importado
      // await updateTeamManager(teamId, managerInputs[teamId]);
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
        // En una implementación real, esto usaría el servicio importado
        // await updateTeamManager(dialogTeamId, formatManagerData(dialogManagerId, selectedManager.name));
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
        // En una implementación real, esto usaría el servicio importado
        // await updateTeamManager(dialogTeamId, formatManagerData(null, dialogManagerName));
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

      // En una implementación real, esto usaría el servicio importado
      // await removeManager(teamId);
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

  // Componente de carga
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
      <ManagerHeader 
        expanded={expanded} 
        onToggleExpand={handleExpandClick} 
      />
      
      <InfoSection expanded={expanded} />

      <CardContent sx={{ p: 0 }}>
        <StatusMessages 
          successMessage={success} 
          errorMessage={error} 
        />
        
        {teams.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No hay equipos disponibles en esta liga.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {teams.map((team, index) => (
              <TeamItem
                key={team.id}
                team={team}
                editMode={editMode[team.id]}
                managerInput={managerInputs[team.id]}
                onInputChange={(value) => handleManagerInputChange(team.id, value)}
                onEdit={() => handleEditClick(team.id)}
                onCancel={() => handleCancelEdit(team.id)}
                onSave={() => handleSaveManager(team.id)}
                onOpenDialog={() => handleOpenDialog(team.id)}
                onRemove={() => handleRemoveManager(team.id)}
                isLoading={isLoading}
                index={index}
              />
            ))}
          </List>
        )}
      </CardContent>

      <AssignManagerDialog
        open={openDialog}
        managerId={dialogManagerId}
        managerName={dialogManagerName}
        managers={managers}
        onClose={() => setOpenDialog(false)}
        onAssign={handleAssignManager}
        onManagerIdChange={setDialogManagerId}
        onManagerNameChange={setDialogManagerName}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default LeagueTeamManager;