from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.teams import TeamCreate, TeamUpdate, Team
from ..crud import teams as teams_crud

router = APIRouter(
    prefix="/teams",
    tags=["teams"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Team)
def create_team(team: TeamCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo equipo
    """
    db_team = teams_crud.get_team_by_name(db, name=team.name)
    if db_team:
        raise HTTPException(status_code=400, detail="El equipo ya existe")
    return teams_crud.create_team(db=db, team=team)

@router.get("/", response_model=List[Team])
def read_teams(
    skip: int = 0, 
    limit: int = 100, 
    manager_id: Optional[str] = None,
    clan: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los equipos con opciones de filtrado
    
    - **manager_id**: Filtrar por ID del manager
    - **clan**: Filtrar por clan
    """
    return teams_crud.get_teams(db, skip=skip, limit=limit, manager_id=manager_id, clan=clan)

@router.get("/{team_id}", response_model=Team)
def read_team(team_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un equipo específico por su ID
    """
    db_team = teams_crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")
    return db_team

@router.put("/{team_id}", response_model=Team)
def update_team(team_id: int, team_data: TeamUpdate, db: Session = Depends(get_db)):
    """
    Actualiza un equipo existente
    """
    db_team = teams_crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # Verificar si el nuevo nombre ya existe
    if team_data.name and team_data.name != db_team.name:
        existing_team = teams_crud.get_team_by_name(db, team_data.name)
        if existing_team:
            raise HTTPException(status_code=400, detail="Ya existe un equipo con ese nombre")
    
    updated_team = teams_crud.update_team(db, team_id, team_data)
    return updated_team

@router.delete("/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db)):
    """
    Elimina un equipo
    """
    db_team = teams_crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    success = teams_crud.delete_team(db, team_id)
    return {"detail": "Equipo eliminado correctamente"}

@router.get("/{team_id}/leagues")
def get_team_leagues(team_id: int, active_only: bool = False, db: Session = Depends(get_db)):
    """
    Obtiene todas las ligas en las que participa un equipo
    """
    db_team = teams_crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    leagues = teams_crud.get_team_leagues(db, team_id, active_only)
    return leagues

@router.get("/{team_id}/matches")
def get_team_matches(team_id: int, db: Session = Depends(get_db)):
    """
    Obtiene todos los partidos de un equipo
    """
    db_team = teams_crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    matches = teams_crud.get_team_matches(db, team_id)
    return matches

@router.get("/{team_id}/stats")
def get_team_stats(team_id: int, db: Session = Depends(get_db)):
    """
    Obtiene estadísticas globales de un equipo
    """
    db_team = teams_crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    stats = teams_crud.get_team_stats(db, team_id)
    return stats