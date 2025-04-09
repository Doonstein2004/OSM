from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import date

from ..database import get_db
from ..models.calendar import (
    CalendarEntryCreate, 
    CalendarEntryUpdate, 
    CalendarEntry,
    CalendarEntryWithDetails,
    GenerateCalendarRequest
)
from ..crud import calendar as calendar_crud
from ..crud import leagues as leagues_crud
from ..schemas.matches import Match

router = APIRouter(
    prefix="/calendar",
    tags=["calendar"],
    responses={404: {"description": "Not found"}},
)

@router.get("/leagues/{league_id}", response_model=Dict[str, Any])
def get_league_calendar(
    league_id: int, 
    jornada: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene el calendario completo de una liga con detalles de los partidos
    
    Opcionalmente, se puede filtrar por jornada
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    calendar_data = calendar_crud.get_calendar_with_match_details(db, league_id, jornada)
    return calendar_data

@router.post("/entries", response_model=CalendarEntry)
def create_calendar_entry(entry: CalendarEntryCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva entrada en el calendario
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, entry.league_id)
    if not league:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    # Verificar que la jornada es válida
    if entry.jornada < 1 or entry.jornada > league.jornadas:
        raise HTTPException(status_code=400, detail=f"Jornada inválida. Debe estar entre 1 y {league.jornadas}")
    
    # Verificar que el partido existe si se especifica
    if entry.match_id:
        match = db.query(Match).filter(Match.id == entry.match_id).first()
        if not match:
            raise HTTPException(status_code=404, detail="Partido no encontrado")
        
        # Verificar que el partido pertenece a la liga
        if match.league_id != entry.league_id:
            raise HTTPException(status_code=400, detail="El partido no pertenece a esta liga")
        
        # Verificar que no existe otra entrada para este partido
        existing_entry = calendar_crud.get_calendar_entry_by_match(db, entry.match_id)
        if existing_entry:
            raise HTTPException(status_code=400, detail="Ya existe una entrada para este partido")
    
    return calendar_crud.create_calendar_entry(db, entry)

@router.put("/entries/{entry_id}", response_model=CalendarEntry)
def update_calendar_entry(entry_id: int, entry_data: CalendarEntryUpdate, db: Session = Depends(get_db)):
    """
    Actualiza una entrada existente del calendario
    """
    db_entry = calendar_crud.get_calendar_entry(db, entry_id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entrada de calendario no encontrada")
    
    # Verificar que la jornada es válida si se especifica
    if entry_data.jornada is not None:
        league = leagues_crud.get_league(db, db_entry.league_id)
        if entry_data.jornada < 1 or entry_data.jornada > league.jornadas:
            raise HTTPException(status_code=400, detail=f"Jornada inválida. Debe estar entre 1 y {league.jornadas}")
    
    # Verificar que el partido existe si se especifica
    if entry_data.match_id is not None:
        match = db.query(Match).filter(Match.id == entry_data.match_id).first()
        if not match:
            raise HTTPException(status_code=404, detail="Partido no encontrado")
        
        # Verificar que el partido pertenece a la liga
        if match.league_id != db_entry.league_id:
            raise HTTPException(status_code=400, detail="El partido no pertenece a esta liga")
        
        # Verificar que no existe otra entrada para este partido (excepto la actual)
        existing_entry = calendar_crud.get_calendar_entry_by_match(db, entry_data.match_id)
        if existing_entry and existing_entry.id != entry_id:
            raise HTTPException(status_code=400, detail="Ya existe otra entrada para este partido")
    
    updated_entry = calendar_crud.update_calendar_entry(db, entry_id, entry_data)
    return updated_entry

@router.delete("/entries/{entry_id}")
def delete_calendar_entry(entry_id: int, db: Session = Depends(get_db)):
    """
    Elimina una entrada del calendario
    """
    db_entry = calendar_crud.get_calendar_entry(db, entry_id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entrada de calendario no encontrada")
    
    success = calendar_crud.delete_calendar_entry(db, entry_id)
    return {"detail": "Entrada eliminada correctamente"}

@router.post("/leagues/{league_id}/generate")
def generate_league_calendar(
    league_id: int, 
    request: GenerateCalendarRequest, 
    db: Session = Depends(get_db)
):
    """
    Genera automáticamente el calendario para una liga
    
    Se pueden especificar opciones de programación automática
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    # Verificar fechas
    if request.start_date and request.end_date and request.start_date > request.end_date:
        raise HTTPException(status_code=400, detail="La fecha de inicio debe ser anterior a la fecha de fin")
    
    # Verificar días de partidos
    if request.match_days:
        for day in request.match_days:
            if day < 0 or day > 6:
                raise HTTPException(status_code=400, detail="Los días de partido deben estar entre 0 (lunes) y 6 (domingo)")
    
    # Generar calendario
    calendar_entries = calendar_crud.generate_league_calendar(
        db, 
        league_id, 
        start_date=request.start_date,
        end_date=request.end_date,
        auto_schedule=request.auto_schedule,
        match_days=request.match_days
    )
    
    if not calendar_entries:
        raise HTTPException(status_code=400, detail="No se pudo generar el calendario. Verifique que haya partidos en la liga.")
    
    return {
        "detail": f"Calendario generado con {len(calendar_entries)} entradas",
        "calendar_entries_count": len(calendar_entries)
    }

@router.post("/leagues/{league_id}/sync")
def sync_league_calendar(league_id: int, db: Session = Depends(get_db)):
    """
    Sincroniza el estado 'is_played' del calendario con los partidos jugados
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    success = calendar_crud.synchronize_calendar_with_matches(db, league_id)
    if not success:
        raise HTTPException(status_code=400, detail="Error al sincronizar el calendario")
    
    return {"detail": "Calendario sincronizado correctamente"}