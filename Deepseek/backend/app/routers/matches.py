from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.matches import MatchCreate, MatchUpdate, Match
from ..crud import matches as matches_crud
from ..crud import leagues as leagues_crud

router = APIRouter(
    prefix="/matches",
    tags=["matches"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Match)
def create_match(match: MatchCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo partido
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, match.league_id)
    if not league:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    # Verificar que los equipos existen y están en la liga
    created_match = matches_crud.create_league_match(db, match)
    if not created_match:
        raise HTTPException(
            status_code=400, 
            detail="No se pudo crear el partido. Verifica que los equipos existan y estén en la liga"
        )
    
    return created_match

@router.get("/", response_model=List[Match])
def read_matches(
    jornada: Optional[int] = None, 
    league_id: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los partidos con opciones de filtrado
    
    - **jornada**: Filtrar por jornada
    - **league_id**: Filtrar por liga
    """
    return matches_crud.get_matches(db, jornada=jornada, league_id=league_id, skip=skip, limit=limit)

@router.get("/{match_id}", response_model=Match)
def read_match(match_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un partido específico por su ID
    """
    db_match = matches_crud.get_match(db, match_id)
    if not db_match:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return db_match

@router.patch("/{match_id}", response_model=Match)
def update_match(match_id: int, match_data: MatchUpdate, db: Session = Depends(get_db)):
    """
    Actualiza un partido existente (solo los campos proporcionados)
    """
    updated_match = matches_crud.update_match(db, match_id, match_data)
    if not updated_match:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    # Si se actualizaron los resultados, sincronizar con el calendario
    if (
        match_data.home_goals is not None or 
        match_data.away_goals is not None or
        match_data.home_possession is not None or
        match_data.away_possession is not None
    ):
        from ..crud import calendar as calendar_crud
        
        calendar_entry = calendar_crud.get_calendar_entry_by_match(db, match_id)
        if calendar_entry and not calendar_entry.is_played:
            calendar_entry.is_played = True
            db.commit()
    
    return updated_match

@router.delete("/{match_id}")
def delete_match(match_id: int, db: Session = Depends(get_db)):
    """
    Elimina un partido
    """
    # Verificar si existe una entrada de calendario para este partido
    from ..crud import calendar as calendar_crud
    calendar_entry = calendar_crud.get_calendar_entry_by_match(db, match_id)
    if calendar_entry:
        # Eliminar la entrada del calendario primero
        calendar_crud.delete_calendar_entry(db, calendar_entry.id)
    
    # Eliminar el partido
    success = matches_crud.delete_match(db, match_id)
    if not success:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    return {"detail": "Partido eliminado correctamente"}

@router.post("/{match_id}/simulate")
def simulate_match(match_id: int, db: Session = Depends(get_db)):
    """
    Simula los resultados de un partido (solo para ligas tácticas)
    """
    # Obtener el partido
    db_match = matches_crud.get_match(db, match_id)
    if not db_match:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    # Verificar que el partido pertenece a una liga táctica
    league = leagues_crud.get_league(db, db_match.league_id)
    if not leagues_crud.can_simulate(db, db_match.league_id):
        raise HTTPException(
            status_code=400, 
            detail="Solo se pueden simular partidos de ligas tácticas"
        )
    
    # Verificar que el partido no ha sido jugado
    if db_match.home_goals is not None and db_match.away_goals is not None:
        raise HTTPException(status_code=400, detail="Este partido ya ha sido jugado")
    
    # Simular el partido
    simulated_match = matches_crud.simulate_match(db, match_id)
    if not simulated_match:
        raise HTTPException(status_code=400, detail="Error al simular el partido")
    
    # Actualizar el calendario si existe
    from ..crud import calendar as calendar_crud
    calendar_entry = calendar_crud.get_calendar_entry_by_match(db, match_id)
    if calendar_entry:
        calendar_entry.is_played = True
        db.commit()
    
    return simulated_match