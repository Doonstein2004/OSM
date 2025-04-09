from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..schemas.leagues import LeagueCreate, LeagueUpdate, LeagueWithDetails, League, SimulationRequest
from ..models.teams import Team
from ..schemas.leagues import TipoLiga
from ..crud import leagues as leagues_crud
from ..crud import matches as matches_crud
from ..services.simulation import TournamentSimulator

router = APIRouter(
    prefix="/leagues",
    tags=["leagues"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=League)
def create_league(league: LeagueCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva liga
    """
    return leagues_crud.create_league(db, league)

@router.get("/", response_model=List[League])
def read_leagues(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = False,
    manager_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las ligas con opciones de filtrado
    
    - **active_only**: Solo ligas activas
    - **manager_id**: Filtrar por ID del manager
    """
    return leagues_crud.get_leagues(db, skip=skip, limit=limit, active_only=active_only, manager_id=manager_id)

@router.get("/manager/{manager_id}", response_model=List[League])
def get_manager_leagues(manager_id: str, active_only: bool = False, db: Session = Depends(get_db)):
    """
    Obtiene todas las ligas creadas por un manager específico
    """
    return leagues_crud.get_manager_leagues(db, manager_id, active_only=active_only)

@router.get("/{league_id}", response_model=LeagueWithDetails)
def read_league(league_id: int, db: Session = Depends(get_db)):
    """
    Obtiene una liga específica con todos sus detalles
    """
    league_details = leagues_crud.get_league_with_details(db, league_id)
    if not league_details:
        raise HTTPException(status_code=404, detail="League not found")
    
    return league_details

@router.put("/{league_id}", response_model=League)
def update_league(league_id: int, league_data: LeagueUpdate, db: Session = Depends(get_db)):
    """
    Actualiza una liga existente
    """
    updated_league = leagues_crud.update_league(db, league_id, league_data)
    if not updated_league:
        raise HTTPException(status_code=404, detail="League not found")
    return updated_league

@router.delete("/{league_id}")
def delete_league(league_id: int, db: Session = Depends(get_db)):
    """
    Elimina una liga y todos sus registros relacionados
    """
    success = leagues_crud.delete_league(db, league_id)
    if not success:
        raise HTTPException(status_code=404, detail="League not found")
    return {"detail": "League deleted successfully"}

@router.post("/{league_id}/teams/{team_id}")
def add_team_to_league(league_id: int, team_id: int, db: Session = Depends(get_db)):
    """
    Añade un equipo a una liga
    """
    league_team = {
        "league_id": league_id,
        "team_id": team_id,
        "registration_date": datetime.now()
    }
    
    db_league_team = leagues_crud.add_team_to_league(db, league_team)
    if not db_league_team:
        raise HTTPException(status_code=400, detail="League is full or team/league not found")
    return db_league_team

@router.get("/{league_id}/teams", response_model=List[Team])
def get_teams_in_league(league_id: int, db: Session = Depends(get_db)):
    """
    Obtiene todos los equipos de una liga
    """
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    league_teams = leagues_crud.get_league_teams(db, league_id)
    teams = []
    
    for lt in league_teams:
        team = db.query(Team).filter(Team.id == lt.team_id).first()
        if team:
            teams.append(team)
    
    return teams

@router.delete("/{league_id}/teams/{team_id}")
def remove_team_from_league(league_id: int, team_id: int, db: Session = Depends(get_db)):
    """
    Elimina un equipo de una liga
    """
    success = leagues_crud.remove_team_from_league(db, league_id, team_id)
    if not success:
        raise HTTPException(status_code=404, detail="Team not found in league")
    return {"detail": "Team removed from league successfully"}

@router.post("/{league_id}/simulate")
def simulate_league(league_id: int, request: SimulationRequest, db: Session = Depends(get_db)):
    """
    Simula una liga completa (solo disponible para ligas tácticas)
    
    Genera partidos automáticamente con resultados si es una liga táctica
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    # Verificar que la liga es de tipo táctico
    if not leagues_crud.can_simulate(db, league_id):
        raise HTTPException(
            status_code=400, 
            detail="Solo las ligas de tipo 'Liga Tactica' pueden ser simuladas automáticamente"
        )
    
    # Verificar que hay suficientes equipos
    if len(request.teams) < 2:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 2 equipos para simular una liga")
    
    # Crear simulador
    simulator = TournamentSimulator()
    
    # Simular liga
    simulated_matches = leagues_crud.simulate_league(db, league_id, simulator)
    
    if not simulated_matches:
        raise HTTPException(status_code=400, detail="Error al simular la liga")
    
    return {
        "detail": f"Liga simulada con {len(simulated_matches)} partidos",
        "simulated_matches": len(simulated_matches)
    }

@router.get("/{league_id}/standings")
def get_league_standings(league_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la tabla de posiciones de una liga
    """
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    standings = leagues_crud.calculate_league_standings(db, league_id)
    return standings

@router.get("/{league_id}/matches")
def get_league_matches(
    league_id: int, 
    jornada: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los partidos de una liga, opcionalmente filtrados por jornada
    """
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    return matches_crud.get_league_matches(db, league_id, jornada)

@router.post("/{league_id}/update-podium")
def update_league_podium(league_id: int, db: Session = Depends(get_db)):
    """
    Actualiza el podio de una liga (ganador, subcampeón y tercer lugar)
    """
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    updated_league = leagues_crud.update_league_podium(db, league_id)
    if not updated_league:
        raise HTTPException(status_code=400, detail="Failed to update podium. Not enough teams or matches")
    
    return {"message": "League podium updated successfully", "league": updated_league}

@router.post("/{league_id}/generate-calendar")
def generate_league_calendar(
    league_id: int,
    auto_schedule: bool = False, 
    db: Session = Depends(get_db)
):
    """
    Genera el calendario de partidos para una liga
    
    Si auto_schedule es True, se programarán automáticamente los partidos
    """
    from ..crud import calendar as calendar_crud
    
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    calendar_entries = calendar_crud.generate_league_calendar(
        db, 
        league_id, 
        auto_schedule=auto_schedule
    )
    
    if not calendar_entries:
        raise HTTPException(status_code=400, detail="No se pudo generar el calendario. Asegúrese de que la liga tenga partidos.")
    
    return {
        "detail": f"Calendario generado con {len(calendar_entries)} entradas",
        "calendar_entries_count": len(calendar_entries)
    }