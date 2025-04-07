from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Dict, Any, Optional

from ..schemas.teams import Team
from ..schemas.leagues import LeagueTeam, League
from ..schemas.matches import Match
from ..models.teams import TeamCreate, TeamUpdate

def get_team(db: Session, team_id: int):
    """Obtiene un equipo por su ID"""
    return db.query(Team).filter(Team.id == team_id).first()

def get_team_by_name(db: Session, name: str):
    """Obtiene un equipo por su nombre"""
    return db.query(Team).filter(Team.name == name).first()

def get_teams(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    manager_id: Optional[str] = None,
    clan: Optional[str] = None
):
    """
    Obtiene todos los equipos con filtros opcionales
    
    Args:
        db: Sesión de base de datos
        skip: Número de resultados a omitir
        limit: Número máximo de resultados
        manager_id: Filtrar por ID del manager
        clan: Filtrar por clan
    
    Returns:
        Lista de equipos
    """
    query = db.query(Team)
    
    if manager_id:
        query = query.filter(Team.manager_id == manager_id)
    
    if clan:
        query = query.filter(Team.clan == clan)
    
    return query.offset(skip).limit(limit).all()

def create_team(db: Session, team: TeamCreate):
    """Crea un nuevo equipo"""
    db_team = Team(
        name=team.name, 
        manager=team.manager, 
        manager_id=team.manager_id,
        clan=team.clan,
        value=team.value
    )
    
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def update_team(db: Session, team_id: int, team_data: TeamUpdate):
    """Actualiza un equipo existente"""
    db_team = get_team(db, team_id)
    if not db_team:
        return None
    
    # Actualizar solo los campos no nulos
    update_data = team_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_team, key, value)
    
    db.commit()
    db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int):
    """
    Elimina un equipo
    
    Nota: Esto eliminará también todas las relaciones del equipo con ligas y partidos
    """
    # Primero eliminar las relaciones con ligas
    db.query(LeagueTeam).filter(LeagueTeam.team_id == team_id).delete()
    
    # Intentar eliminar los partidos donde participa este equipo
    # Nota: Esto podría ser peligroso si hay muchas referencias
    db.query(Match).filter(
        or_(
            Match.home_team_id == team_id,
            Match.away_team_id == team_id
        )
    ).delete()
    
    # Finalmente eliminar el equipo
    result = db.query(Team).filter(Team.id == team_id).delete()
    
    db.commit()
    return result > 0

def get_team_leagues(db: Session, team_id: int, active_only: bool = False):
    """Obtiene todas las ligas en las que participa un equipo"""
    query = db.query(League).join(
        LeagueTeam, 
        LeagueTeam.league_id == League.id
    ).filter(
        LeagueTeam.team_id == team_id
    )
    
    if active_only:
        query = query.filter(League.active == True)
    
    return query.all()

def get_team_matches(db: Session, team_id: int):
    """Obtiene todos los partidos de un equipo"""
    return db.query(Match).filter(
        or_(
            Match.home_team_id == team_id,
            Match.away_team_id == team_id
        )
    ).all()

def get_team_stats(db: Session, team_id: int):
    """
    Calcula estadísticas globales para un equipo
    
    Incluye partidos jugados, victorias, empates, derrotas, goles a favor/en contra, etc.
    """
    # Obtener todos los partidos donde participó el equipo
    matches = get_team_matches(db, team_id)
    
    # Inicializar estadísticas
    stats = {
        "played": 0,
        "won": 0,
        "drawn": 0,
        "lost": 0,
        "goals_for": 0,
        "goals_against": 0,
        "home_matches": 0,
        "away_matches": 0,
        "home_wins": 0,
        "home_draws": 0,
        "home_losses": 0,
        "away_wins": 0,
        "away_draws": 0,
        "away_losses": 0,
        "clean_sheets": 0,
        "failed_to_score": 0,
        "leagues_participated": len(get_team_leagues(db, team_id))
    }
    
    # Procesar cada partido
    for match in matches:
        # Omitir partidos sin resultados
        if match.home_goals is None or match.away_goals is None:
            continue
        
        # Determinar si el equipo jugaba como local o visitante
        if match.home_team_id == team_id:
            # Equipo jugaba como local
            stats["home_matches"] += 1
            stats["goals_for"] += match.home_goals
            stats["goals_against"] += match.away_goals
            
            # Resultado
            if match.home_goals > match.away_goals:
                stats["won"] += 1
                stats["home_wins"] += 1
            elif match.home_goals < match.away_goals:
                stats["lost"] += 1
                stats["home_losses"] += 1
            else:
                stats["drawn"] += 1
                stats["home_draws"] += 1
            
            # Portería a cero / No marcar
            if match.away_goals == 0:
                stats["clean_sheets"] += 1
            if match.home_goals == 0:
                stats["failed_to_score"] += 1
        else:
            # Equipo jugaba como visitante
            stats["away_matches"] += 1
            stats["goals_for"] += match.away_goals
            stats["goals_against"] += match.home_goals
            
            # Resultado
            if match.away_goals > match.home_goals:
                stats["won"] += 1
                stats["away_wins"] += 1
            elif match.away_goals < match.home_goals:
                stats["lost"] += 1
                stats["away_losses"] += 1
            else:
                stats["drawn"] += 1
                stats["away_draws"] += 1
            
            # Portería a cero / No marcar
            if match.home_goals == 0:
                stats["clean_sheets"] += 1
            if match.away_goals == 0:
                stats["failed_to_score"] += 1
    
    # Calcular totales
    stats["played"] = stats["home_matches"] + stats["away_matches"]
    stats["points"] = stats["won"] * 3 + stats["drawn"]
    stats["goal_difference"] = stats["goals_for"] - stats["goals_against"]
    
    # Calcular porcentajes (evitar división por cero)
    if stats["played"] > 0:
        stats["win_percentage"] = round((stats["won"] / stats["played"]) * 100, 2)
        stats["draw_percentage"] = round((stats["drawn"] / stats["played"]) * 100, 2)
        stats["loss_percentage"] = round((stats["lost"] / stats["played"]) * 100, 2)
        stats["points_per_game"] = round(stats["points"] / stats["played"], 2)
        stats["goals_for_per_game"] = round(stats["goals_for"] / stats["played"], 2)
        stats["goals_against_per_game"] = round(stats["goals_against"] / stats["played"], 2)
    else:
        stats["win_percentage"] = 0
        stats["draw_percentage"] = 0
        stats["loss_percentage"] = 0
        stats["points_per_game"] = 0
        stats["goals_for_per_game"] = 0
        stats["goals_against_per_game"] = 0
    
    return stats