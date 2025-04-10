# backend/app/crud/calendar.py

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import calendar

from ..schemas.calendar import Calendar
from ..schemas.matches import Match
from ..schemas.leagues import League
from ..models.calendar import CalendarEntryCreate, CalendarEntryUpdate
from ..utils.calendar_scraper import CalendarScraper
from . import leagues, matches, teams

def get_calendar_entry(db: Session, entry_id: int):
    """Obtiene una entrada del calendario por su ID"""
    return db.query(Calendar).filter(Calendar.id == entry_id).first()

def get_calendar_entry_by_match(db: Session, match_id: int):
    """Obtiene una entrada del calendario por el ID del partido"""
    return db.query(Calendar).filter(Calendar.match_id == match_id).first()

def get_league_calendar(db: Session, league_id: int, jornada: Optional[int] = None):
    """Obtiene todas las entradas del calendario de una liga, opcionalmente filtradas por jornada"""
    query = db.query(Calendar).filter(Calendar.league_id == league_id)
    
    if jornada:
        query = query.filter(Calendar.jornada == jornada)
    
    return query.order_by(Calendar.jornada).all()

def create_calendar_entry(db: Session, entry: CalendarEntryCreate):
    """Crea una nueva entrada en el calendario"""
    db_entry = Calendar(
        league_id=entry.league_id,
        jornada=entry.jornada,
        match_id=entry.match_id,
        scheduled_date=entry.scheduled_date,
        scheduled_time=entry.scheduled_time,
        venue=entry.venue,
        is_played=False
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def update_calendar_entry(db: Session, entry_id: int, entry_data: CalendarEntryUpdate):
    """Actualiza una entrada existente del calendario"""
    db_entry = get_calendar_entry(db, entry_id)
    if not db_entry:
        return None
    
    # Actualizar campos
    update_data = entry_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)
    
    db_entry.updated_at = datetime.now()
    db.commit()
    db.refresh(db_entry)
    return db_entry

def delete_calendar_entry(db: Session, entry_id: int):
    """Elimina una entrada del calendario"""
    result = db.query(Calendar).filter(Calendar.id == entry_id).delete()
    db.commit()
    return result > 0

def generate_league_calendar(
    db: Session, 
    league_id: int, 
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    auto_schedule: bool = False,
    match_days: Optional[List[int]] = None
):
    """
    Genera el calendario completo para una liga
    
    Args:
        db: Sesión de base de datos
        league_id: ID de la liga
        start_date: Fecha de inicio (opcional)
        end_date: Fecha de fin (opcional)
        auto_schedule: Si se deben programar automáticamente las fechas de los partidos
        match_days: Lista de días de la semana para jugar partidos (0=lunes, 6=domingo)
    
    Returns:
        Lista de entradas de calendario creadas
    """
    # Verificar que la liga existe
    league = db.query(League).filter(League.id == league_id).first()
    if not league:
        return None
    
    # Obtener partidos de la liga
    league_matches = db.query(Match).filter(Match.league_id == league_id).all()
    if not league_matches:
        return None
    
    # Crear calendario para cada partido, agrupados por jornada
    matches_by_jornada = {}
    for match in league_matches:
        if match.jornada not in matches_by_jornada:
            matches_by_jornada[match.jornada] = []
        matches_by_jornada[match.jornada].append(match)
    
    # Ordenar jornadas
    sorted_jornadas = sorted(matches_by_jornada.keys())
    
    # Configuración para programación automática
    current_date = start_date if start_date else datetime.now().date()
    if match_days is None:
        match_days = [5, 6]  # Por defecto, sábado y domingo
    
    # Crear entradas de calendario
    calendar_entries = []
    
    for jornada in sorted_jornadas:
        jornada_matches = matches_by_jornada[jornada]
        
        # Si es programación automática, calcular la fecha para esta jornada
        jornada_date = None
        if auto_schedule:
            # Buscar el próximo día de partido después de la fecha actual
            while current_date.weekday() not in match_days:
                current_date += timedelta(days=1)
            
            # Esta jornada será en esta fecha
            jornada_date = current_date
            
            # Avanzar a la siguiente semana para la siguiente jornada
            current_date += timedelta(days=7)
        
        # Distribuir los partidos de la jornada
        for i, match in enumerate(jornada_matches):
            # Verificar si ya existe una entrada para este partido
            existing_entry = get_calendar_entry_by_match(db, match.id)
            if existing_entry:
                continue
            
            # Crear nueva entrada
            entry = CalendarEntryCreate(
                league_id=league_id,
                jornada=jornada,
                match_id=match.id,
                scheduled_date=jornada_date if jornada_date else None,
                scheduled_time=f"{12 + (i % 4) * 2}:00" if auto_schedule else None  # Distribuir entre 12:00, 14:00, 16:00, 18:00
            )
            
            db_entry = create_calendar_entry(db, entry)
            calendar_entries.append(db_entry)
            
            # Actualizar también la fecha en el partido
            if jornada_date and auto_schedule:
                match.date = datetime.combine(jornada_date, datetime.min.time())
                match.time = entry.scheduled_time
                db.commit()
    
    # Marcar la liga como con calendario generado
    league.calendar_generated = True
    db.commit()
    
    return calendar_entries

def import_calendar_from_external_source(db: Session, league_id: int, external_url: str):
    """
    Importa un calendario desde una fuente externa mediante web scraping
    
    Args:
        db: Sesión de base de datos
        league_id: ID de la liga
        external_url: URL del calendario externo
        
    Returns:
        Dict con información sobre la importación
    """
    # Verificar que la liga existe
    league = leagues.get_league(db, league_id)
    if not league:
        return {"success": False, "error": "Liga no encontrada"}
    
    # Obtener calendario desde la fuente externa
    scraped_matches = CalendarScraper.fetch_calendar(external_url)
    if not scraped_matches:
        return {"success": False, "error": "No se pudo obtener el calendario desde la URL proporcionada"}
    
    # Obtener equipos de la liga
    league_teams = db.query(League).filter(League.id == league_id).first().teams
    
    if not league_teams:
        return {"success": False, "error": "La liga no tiene equipos asignados"}
    
    team_name_map = {team.name.lower(): team for team in league_teams}
    
    # Crear o actualizar partidos y calendario
    created_matches = 0
    created_calendar_entries = 0
    errors = []
    
    for match_data in scraped_matches:
        try:
            home_team_name = match_data['home_team'].lower()
            away_team_name = match_data['away_team'].lower()
            
            # Buscar equipos por nombre
            home_team = None
            away_team = None
            
            # Intentar encontrar el equipo exacto
            if home_team_name in team_name_map:
                home_team = team_name_map[home_team_name]
            else:
                # Buscar coincidencia parcial
                for name, team in team_name_map.items():
                    if home_team_name in name or name in home_team_name:
                        home_team = team
                        break
            
            if away_team_name in team_name_map:
                away_team = team_name_map[away_team_name]
            else:
                # Buscar coincidencia parcial
                for name, team in team_name_map.items():
                    if away_team_name in name or name in away_team_name:
                        away_team = team
                        break
            
            if not home_team or not away_team:
                errors.append(f"No se encontraron equipos: {match_data['home_team']} vs {match_data['away_team']}")
                continue
            
            # Verificar si ya existe un partido entre estos equipos en esta jornada
            existing_match = db.query(Match).filter(
                Match.league_id == league_id,
                Match.home_team_id == home_team.id,
                Match.away_team_id == away_team.id,
                Match.jornada == match_data['jornada']
            ).first()
            
            # Si no existe, crearlo
            if not existing_match:
                # Crear nuevo partido
                match_create = {
                    "league_id": league_id,
                    "home_team_id": home_team.id,
                    "away_team_id": away_team.id,
                    "jornada": match_data['jornada'],
                    "date": datetime.strptime(match_data['date'], '%Y-%m-%d') if match_data['date'] else None,
                    "time": match_data['time']
                }
                
                # Usar el CRUD de matches para crear el partido
                match = matches.create_match(db, match_create)
                created_matches += 1
            else:
                match = existing_match
                
                # Actualizar fecha y hora si es necesario
                if (match_data['date'] or match_data['time']) and not match.date:
                    match.date = datetime.strptime(match_data['date'], '%Y-%m-%d') if match_data['date'] else None
                    match.time = match_data['time']
                    db.commit()
            
            # Verificar si ya existe una entrada de calendario para este partido
            existing_entry = get_calendar_entry_by_match(db, match.id)
            
            if not existing_entry:
                # Crear entrada de calendario
                entry = CalendarEntryCreate(
                    league_id=league_id,
                    jornada=match_data['jornada'],
                    match_id=match.id,
                    scheduled_date=datetime.strptime(match_data['date'], '%Y-%m-%d').date() if match_data['date'] else None,
                    scheduled_time=match_data['time'],
                    venue=match_data['venue']
                )
                
                create_calendar_entry(db, entry)
                created_calendar_entries += 1
        
        except Exception as e:
            errors.append(f"Error procesando partido: {str(e)}")
    
    # Actualizar estado de la liga
    league.calendar_generated = True
    league.external_calendar_url = external_url
    db.commit()
    
    return {
        "success": True,
        "matches_created": created_matches,
        "calendar_entries_created": created_calendar_entries,
        "errors": errors
    }

def synchronize_calendar_with_matches(db: Session, league_id: int):
    """
    Sincroniza el estado 'is_played' del calendario con los partidos jugados
    """
    # Obtener todos los partidos jugados (con resultados)
    played_matches = db.query(Match).filter(
        Match.league_id == league_id,
        Match.home_goals.isnot(None),
        Match.away_goals.isnot(None)
    ).all()
    
    # Actualizar el estado de las entradas del calendario
    for match in played_matches:
        calendar_entry = get_calendar_entry_by_match(db, match.id)
        if calendar_entry and not calendar_entry.is_played:
            calendar_entry.is_played = True
            db.commit()
    
    return True

def get_calendar_with_match_details(db: Session, league_id: int, jornada: Optional[int] = None):
    """
    Obtiene el calendario de una liga con detalles de los partidos
    """
    calendar_entries = get_league_calendar(db, league_id, jornada)
    
    result = []
    for entry in calendar_entries:
        entry_dict = {
            "id": entry.id,
            "league_id": entry.league_id,
            "jornada": entry.jornada,
            "match_id": entry.match_id,
            "scheduled_date": entry.scheduled_date,
            "scheduled_time": entry.scheduled_time,
            "venue": entry.venue,
            "is_played": entry.is_played,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at,
            "match": None
        }
        
        # Obtener detalles del partido si existe
        if entry.match_id:
            match = db.query(Match).options(
                joinedload(Match.home_team),
                joinedload(Match.away_team)
            ).filter(Match.id == entry.match_id).first()
            
            if match:
                entry_dict["match"] = {
                    "id": match.id,
                    "jornada": match.jornada,
                    "home_team": {
                        "id": match.home_team.id,
                        "name": match.home_team.name,
                        "manager": match.home_team.manager
                    },
                    "away_team": {
                        "id": match.away_team.id,
                        "name": match.away_team.name,
                        "manager": match.away_team.manager
                    },
                    "home_formation": match.home_formation,
                    "away_formation": match.away_formation,
                    "home_style": match.home_style,
                    "away_style": match.away_style,
                    "home_goals": match.home_goals,
                    "away_goals": match.away_goals,
                    "date": match.date,
                    "time": match.time
                }
        
        result.append(entry_dict)
    
    # Agrupar por jornadas
    grouped_result = {}
    for entry in result:
        jornada = entry["jornada"]
        if jornada not in grouped_result:
            grouped_result[jornada] = []
        grouped_result[jornada].append(entry)
    
    # Ordenar por fecha dentro de cada jornada
    for jornada in grouped_result:
        grouped_result[jornada].sort(
            key=lambda x: (
                x["scheduled_date"] or date.max,
                x["scheduled_time"] or "99:99"
            )
        )
    
    return {
        "league_id": league_id,
        "league_name": db.query(League).filter(League.id == league_id).first().name,
        "jornadas": len(grouped_result),
        "entries_by_jornada": grouped_result
    }