from sqlalchemy.orm import Session, joinedload
from typing import List, Dict, Any, Optional
from datetime import datetime
import random

from ..schemas.matches import Match
from ..schemas.leagues import League, LeagueTeam
from ..schemas.teams import Team
from ..models.matches import MatchCreate, MatchUpdate
from ..services.simulation import MatchSimulator

def get_match(db: Session, match_id: int):
    """Obtiene un partido por su ID con los detalles de los equipos"""
    return db.query(Match).options(
        joinedload(Match.home_team),
        joinedload(Match.away_team)
    ).filter(Match.id == match_id).first()

def get_matches(
    db: Session, 
    jornada: Optional[int] = None,
    league_id: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100
):
    """
    Obtiene todos los partidos con filtros opcionales
    
    Args:
        db: Sesión de base de datos
        jornada: Filtrar por jornada
        league_id: Filtrar por liga
        skip: Número de resultados a omitir
        limit: Número máximo de resultados
    
    Returns:
        Lista de partidos
    """
    query = db.query(Match).options(
        joinedload(Match.home_team),
        joinedload(Match.away_team)
    )
    
    if jornada is not None:
        query = query.filter(Match.jornada == jornada)
    
    if league_id is not None:
        query = query.filter(Match.league_id == league_id)
    
    return query.offset(skip).limit(limit).all()

def create_match(db: Session, match: MatchCreate):
    """Crea un nuevo partido"""
    db_match = Match(
        jornada=match.jornada,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        league_id=match.league_id,
        date=match.date,
        time=match.time,
        home_formation=match.home_formation,
        home_style=match.home_style,
        home_attack=match.home_attack,
        home_kicks=match.home_kicks,
        home_possession=match.home_possession,
        home_shots=match.home_shots,
        home_goals=match.home_goals,
        away_formation=match.away_formation,
        away_style=match.away_style,
        away_attack=match.away_attack,
        away_kicks=match.away_kicks,
        away_possession=match.away_possession,
        away_shots=match.away_shots,
        away_goals=match.away_goals
    )
    
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def create_league_match(db: Session, match: MatchCreate):
    """
    Crea un partido dentro de una liga, verificando que los equipos pertenezcan a la liga
    
    Args:
        db: Sesión de base de datos
        match: Datos del partido a crear
    
    Returns:
        Partido creado o None si no se pudo crear
    """
    # Verificar que los equipos pertenecen a la liga
    for team_id in [match.home_team_id, match.away_team_id]:
        team_in_league = db.query(LeagueTeam).filter(
            LeagueTeam.league_id == match.league_id,
            LeagueTeam.team_id == team_id
        ).first()
        
        if not team_in_league:
            return None  # Equipo no en liga
    
    # Crear partido
    return create_match(db, match)

def update_match(db: Session, match_id: int, match_data: MatchUpdate):
    """
    Actualiza un partido existente
    
    Solo se actualizarán los campos incluidos en match_data
    """
    match = get_match(db, match_id)
    if not match:
        return None
    
    # Actualizar solo los campos no nulos
    update_data = match_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:  # Solo actualizar si el valor no es None
            setattr(match, key, value)
    
    # Actualizar timestamp
    match.updated_at = datetime.now()
    
    db.commit()
    db.refresh(match)
    return match

def delete_match(db: Session, match_id: int):
    """Elimina un partido"""
    result = db.query(Match).filter(Match.id == match_id).delete()
    db.commit()
    return result > 0

def get_league_matches(db: Session, league_id: int, jornada: Optional[int] = None):
    """
    Obtiene todos los partidos de una liga, opcionalmente filtrados por jornada
    
    Args:
        db: Sesión de base de datos
        league_id: ID de la liga
        jornada: Número de jornada (opcional)
    
    Returns:
        Lista de partidos
    """
    query = db.query(Match).options(
        joinedload(Match.home_team),
        joinedload(Match.away_team)
    ).filter(Match.league_id == league_id)
    
    if jornada is not None:
        query = query.filter(Match.jornada == jornada)
    
    return query.all()

def simulate_match(db: Session, match_id: int):
    """
    Simula los resultados de un partido
    
    Args:
        db: Sesión de base de datos
        match_id: ID del partido a simular
    
    Returns:
        Partido actualizado o None si no se pudo simular
    """
    match = get_match(db, match_id)
    if not match:
        return None
    
    # Verificar que el partido no ha sido jugado
    if match.home_goals is not None and match.away_goals is not None:
        return match  # Ya tiene resultados
    
    # Crear simulador
    simulator = MatchSimulator()
    
    # Simular posesión
    home_possession = random.randint(40, 60)
    away_possession = 100 - home_possession
    
    # Simular tiros
    home_shots = max(1, int((home_possession / 100) * random.randint(8, 16)))
    away_shots = max(1, int((away_possession / 100) * random.randint(8, 16)))
    
    # Simular goles (tasa de conversión entre 10% y 30%)
    home_conversion_rate = random.uniform(0.1, 0.3)
    away_conversion_rate = random.uniform(0.1, 0.3)
    
    home_goals = round(home_shots * home_conversion_rate)
    away_goals = round(away_shots * away_conversion_rate)
    
    # Actualizar datos del partido
    match.home_possession = home_possession
    match.away_possession = away_possession
    match.home_shots = home_shots
    match.away_shots = away_shots
    match.home_goals = home_goals
    match.away_goals = away_goals
    match.updated_at = datetime.now()
    
    db.commit()
    db.refresh(match)
    return match

def get_match_statistics(db: Session, match_id: int):
    """
    Obtiene estadísticas detalladas de un partido
    
    Args:
        db: Sesión de base de datos
        match_id: ID del partido
    
    Returns:
        Diccionario con estadísticas o None si no se encuentra el partido
    """
    match = get_match(db, match_id)
    if not match:
        return None
    
    # Verificar que el partido ha sido jugado
    if match.home_goals is None or match.away_goals is None:
        return {
            "match_id": match.id,
            "home_team": match.home_team.name,
            "away_team": match.away_team.name,
            "status": "No jugado",
            "date": match.date,
            "time": match.time
        }
    
    # Construir estadísticas
    stats = {
        "match_id": match.id,
        "jornada": match.jornada,
        "league_id": match.league_id,
        "home_team": {
            "id": match.home_team.id,
            "name": match.home_team.name,
            "manager": match.home_team.manager,
            "formation": match.home_formation,
            "style": match.home_style,
            "attack": match.home_attack,
            "kicks": match.home_kicks
        },
        "away_team": {
            "id": match.away_team.id,
            "name": match.away_team.name,
            "manager": match.away_team.manager,
            "formation": match.away_formation,
            "style": match.away_style,
            "attack": match.away_attack,
            "kicks": match.away_kicks
        },
        "result": {
            "home_goals": match.home_goals,
            "away_goals": match.away_goals,
            "winner": "home" if match.home_goals > match.away_goals else "away" if match.away_goals > match.home_goals else "draw"
        },
        "stats": {
            "possession": {
                "home": match.home_possession,
                "away": match.away_possession
            },
            "shots": {
                "home": match.home_shots,
                "away": match.away_shots
            },
            "shots_on_target": {
                "home": match.home_shots_on_target,
                "away": match.away_shots_on_target
            } if hasattr(match, 'home_shots_on_target') and match.home_shots_on_target is not None else None,
            "fouls": {
                "home": match.home_fouls,
                "away": match.away_fouls
            } if hasattr(match, 'home_fouls') and match.home_fouls is not None else None
        },
        "date_time": {
            "date": match.date,
            "time": match.time
        },
        "played_at": match.updated_at
    }
    
    return stats

def generate_match_formations(db: Session, home_team_id: int, away_team_id: int):
    """
    Genera formaciones y estilos aleatorios para un partido
    
    Útil para pre-configurar nuevos partidos
    
    Args:
        db: Sesión de base de datos
        home_team_id: ID del equipo local
        away_team_id: ID del equipo visitante
    
    Returns:
        Diccionario con formaciones y estilos generados
    """
    # Obtener nombres de equipos
    home_team = db.query(Team).filter(Team.id == home_team_id).first()
    away_team = db.query(Team).filter(Team.id == away_team_id).first()
    
    if not home_team or not away_team:
        return None
    
    # Crear simulador
    simulator = MatchSimulator()
    
    # Generar datos
    match_data = simulator.generate_pre_match_data(home_team.name, away_team.name)
    
    return {
        "home_formation": match_data["home_formation"],
        "home_style": match_data["home_style"],
        "home_attack": match_data["home_attack"],
        "home_kicks": match_data["home_kicks"],
        "away_formation": match_data["away_formation"],
        "away_style": match_data["away_style"],
        "away_attack": match_data["away_attack"],
        "away_kicks": match_data["away_kicks"]
    }