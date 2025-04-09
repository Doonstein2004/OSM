from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

# Importaciones correctas
from ..models.leagues import League, LeagueTeam
from ..models.teams import Team
from ..models.matches import Match
from ..models.statistics import LeagueStatistics
from ..models.calendar import Calendar
from ..schemas.leagues import LeagueCreate, LeagueUpdate, LeagueTeamCreate, TipoLiga
from ..services.simulation import TournamentSimulator

def get_league(db: Session, league_id: int):
    """Obtiene una liga por su ID"""
    db_league = db.query(League).filter(League.id == league_id).first()
    
    if db_league:
        # Calcular conteo de partidos
        db_league.matches_count = db.query(func.count(Match.id)).filter(
            Match.league_id == league_id
        ).scalar() or 0
        
        # Calcular conteo de equipos
        db_league.teams_count = db.query(func.count(LeagueTeam.id)).filter(
            LeagueTeam.league_id == league_id
        ).scalar() or 0
    
    return db_league

def get_leagues(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = False, 
    manager_id: Optional[str] = None
):
    """Obtiene todas las ligas con opciones de filtrado"""
    query = db.query(League)
    
    if active_only:
        query = query.filter(League.active == True)
        
    if manager_id is not None:
        query = query.filter(League.manager_id == manager_id)
    
    leagues = query.offset(skip).limit(limit).all()
    
    # Calcular conteos para cada liga
    for league in leagues:
        # Conteo de partidos
        league.matches_count = db.query(func.count(Match.id)).filter(
            Match.league_id == league.id
        ).scalar() or 0
        
        # Conteo de equipos
        league.teams_count = db.query(func.count(LeagueTeam.id)).filter(
            LeagueTeam.league_id == league.id
        ).scalar() or 0
    
    return leagues

def get_manager_leagues(db: Session, manager_id: str, active_only: bool = False):
    """Obtiene todas las ligas creadas por un manager específico"""
    return get_leagues(db, active_only=active_only, manager_id=manager_id)

def create_league(db: Session, league: LeagueCreate):
    """Crea una nueva liga"""
    db_league = League(
        name=league.name,
        country=league.country,
        tipo_liga=league.tipo_liga,
        league_type=league.league_type,
        max_teams=league.max_teams,
        jornadas=league.jornadas,
        manager_id=league.manager_id,
        manager_name=league.manager_name,
        active=league.active,
        start_date=league.start_date,
        end_date=league.end_date,
        highest_value_team_id=league.highest_value_team_id,
        lowest_value_team_id=league.lowest_value_team_id,
        avg_team_value=league.avg_team_value,
        value_difference=league.value_difference,
        calendar_generated=False
    )
    db.add(db_league)
    db.commit()
    db.refresh(db_league)
    return db_league

def update_league(db: Session, league_id: int, league_data: LeagueUpdate):
    """Actualiza una liga existente"""
    db_league = get_league(db, league_id)
    if not db_league:
        return None
    
    # Actualizar datos
    update_data = league_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_league, key, value)
    
    db.commit()
    db.refresh(db_league)
    return db_league

def delete_league(db: Session, league_id: int):
    """Elimina una liga y todos sus registros relacionados"""
    # Primero eliminar las entradas del calendario asociadas a la liga
    db.query(Calendar).filter(Calendar.league_id == league_id).delete()
    
    # Eliminar los equipos asociados a la liga
    db.query(LeagueTeam).filter(LeagueTeam.league_id == league_id).delete()
    
    # Eliminar los partidos de la liga
    db.query(Match).filter(Match.league_id == league_id).delete()
    
    # Eliminar las estadísticas de la liga
    db.query(LeagueStatistics).filter(LeagueStatistics.league_id == league_id).delete()
    
    # Por último, eliminar la liga
    result = db.query(League).filter(League.id == league_id).delete()
    
    db.commit()
    return result > 0

def add_team_to_league(db: Session, league_team: LeagueTeamCreate):
    """Añade un equipo a una liga"""
    # Verificar si el equipo ya existe en la liga
    existing = db.query(LeagueTeam).filter(
        LeagueTeam.league_id == league_team.league_id,
        LeagueTeam.team_id == league_team.team_id
    ).first()
    
    if existing:
        return existing
    
    # Verificar si hay espacio para más equipos
    league = get_league(db, league_team.league_id)
    teams_count = db.query(func.count(LeagueTeam.id)).filter(
        LeagueTeam.league_id == league_team.league_id
    ).scalar()
    
    if teams_count >= league.max_teams:
        return None  # La liga está llena
    
    db_league_team = LeagueTeam(
        league_id=league_team.league_id,
        team_id=league_team.team_id,
        registration_date=league_team.registration_date or datetime.now()
    )
    
    db.add(db_league_team)
    db.commit()
    db.refresh(db_league_team)
    return db_league_team

def get_league_teams(db: Session, league_id: int):
    """Obtiene todos los equipos de una liga"""
    return db.query(LeagueTeam).filter(
        LeagueTeam.league_id == league_id
    ).all()

def remove_team_from_league(db: Session, league_id: int, team_id: int):
    """Elimina un equipo de una liga"""
    db_league_team = db.query(LeagueTeam).filter(
        LeagueTeam.league_id == league_id,
        LeagueTeam.team_id == team_id
    ).first()
    
    if not db_league_team:
        return False
    
    db.delete(db_league_team)
    db.commit()
    return True

def can_simulate(db: Session, league_id: int) -> bool:
    """Verifica si una liga puede ser simulada (solo para ligas tácticas)"""
    league = get_league(db, league_id)
    if not league:
        return False
    
    # Solo las ligas tácticas pueden ser simuladas
    return league.tipo_liga == TipoLiga.LIGA_TACTICA

def simulate_league(db: Session, league_id: int, simulator: TournamentSimulator):
    """
    Simula una liga completa, generando partidos automáticamente
    
    Solo permitido para ligas de tipo 'Liga Tactica'
    """
    if not can_simulate(db, league_id):
        return None
    
    # Obtener todos los equipos en la liga
    league_teams = get_league_teams(db, league_id)
    team_ids = [lt.team_id for lt in league_teams]
    
    if not team_ids or len(team_ids) < 2:
        return None
    
    # Obtener detalles de los equipos
    teams = []
    for team_id in team_ids:
        team = db.query(Team).filter(Team.id == team_id).first()
        if team:
            teams.append(team)
    
    # Obtener detalles de la liga
    league = get_league(db, league_id)
    
    # Generar fixtures usando el simulador
    team_names = [team.name for team in teams]
    matches_per_jornada = len(teams) // 2  # Cada equipo juega un partido por jornada
    
    simulated_matches = simulator.generate_fixture(
        teams=team_names,
        jornadas=league.jornadas,
        matches_per_jornada=matches_per_jornada
    )
    
    # Guardar partidos con el ID de la liga
    saved_matches = []
    team_name_to_id = {team.name: team.id for team in teams}
    
    for match in simulated_matches:
        home_team_id = team_name_to_id.get(match["home_team"])
        away_team_id = team_name_to_id.get(match["away_team"])
        
        if not home_team_id or not away_team_id:
            continue
        
        # Crear partido
        db_match = Match(
            jornada=match["jornada"],
            home_team_id=home_team_id,
            away_team_id=away_team_id,
            league_id=league_id,
            home_formation=match["home_formation"],
            home_style=match["home_style"],
            home_attack=match["home_attack"],
            home_kicks=match["home_kicks"],
            home_goals=match.get("home_goals"),
            home_possession=match.get("home_possession"),
            home_shots=match.get("home_shots"),
            away_formation=match["away_formation"],
            away_style=match["away_style"],
            away_attack=match["away_attack"],
            away_kicks=match["away_kicks"],
            away_goals=match.get("away_goals"),
            away_possession=match.get("away_possession"),
            away_shots=match.get("away_shots")
        )
        
        db.add(db_match)
        db.commit()
        db.refresh(db_match)
        saved_matches.append(db_match)
    
    return saved_matches

def calculate_league_standings(db: Session, league_id: int):
    """Calcula la tabla de posiciones de una liga"""
    # Obtener todos los equipos en la liga
    league_teams = get_league_teams(db, league_id)
    team_ids = [lt.team_id for lt in league_teams]
    
    # Inicializar tabla de posiciones
    standings = {team_id: {
        "team_id": team_id,
        "played": 0,
        "won": 0,
        "drawn": 0,
        "lost": 0,
        "goals_for": 0,
        "goals_against": 0,
        "goal_difference": 0,
        "points": 0
    } for team_id in team_ids}
    
    # Obtener todos los partidos jugados en la liga
    matches = db.query(Match).filter(
        Match.league_id == league_id,
        Match.home_goals != None,
        Match.away_goals != None
    ).all()
    
    # Calcular estadísticas
    for match in matches:
        home_id = match.home_team_id
        away_id = match.away_team_id
        
        # Omitir si los equipos no están en la liga (podrían haber sido eliminados)
        if home_id not in standings or away_id not in standings:
            continue
        
        home_goals = match.home_goals or 0
        away_goals = match.away_goals or 0
        
        # Actualizar partidos jugados
        standings[home_id]["played"] += 1
        standings[away_id]["played"] += 1
        
        # Actualizar goles
        standings[home_id]["goals_for"] += home_goals
        standings[home_id]["goals_against"] += away_goals
        standings[away_id]["goals_for"] += away_goals
        standings[away_id]["goals_against"] += home_goals
        
        # Actualizar victorias/empates/derrotas y puntos
        if home_goals > away_goals:
            standings[home_id]["won"] += 1
            standings[away_id]["lost"] += 1
            standings[home_id]["points"] += 3
        elif away_goals > home_goals:
            standings[away_id]["won"] += 1
            standings[home_id]["lost"] += 1
            standings[away_id]["points"] += 3
        else:
            standings[home_id]["drawn"] += 1
            standings[away_id]["drawn"] += 1
            standings[home_id]["points"] += 1
            standings[away_id]["points"] += 1
    
    # Calcular diferencia de goles
    for team_id in standings:
        standings[team_id]["goal_difference"] = standings[team_id]["goals_for"] - standings[team_id]["goals_against"]
    
    # Ordenar por puntos, diferencia de goles, goles a favor
    sorted_standings = sorted(
        standings.values(),
        key=lambda x: (x["points"], x["goal_difference"], x["goals_for"]),
        reverse=True
    )
    
    # Añadir detalles del equipo
    for i, team_standing in enumerate(sorted_standings):
        team = db.query(Team).filter(Team.id == team_standing["team_id"]).first()
        sorted_standings[i]["team"] = team
        sorted_standings[i]["position"] = i + 1
    
    return sorted_standings

def update_league_podium(db: Session, league_id: int):
    """Actualiza el podio de una liga (ganador, subcampeón y tercer lugar)"""
    standings = calculate_league_standings(db, league_id)
    if len(standings) < 3:
        return None
    
    league = get_league(db, league_id)
    if not league:
        return None
    
    # Actualizar podio
    league.winner_id = standings[0]["team_id"]
    league.runner_up_id = standings[1]["team_id"]
    league.third_place_id = standings[2]["team_id"]
    
    db.commit()
    db.refresh(league)
    return league

def get_league_with_details(db: Session, league_id: int):
    """Obtiene una liga con todos sus detalles (equipos, estadísticas, etc.)"""
    league = get_league(db, league_id)
    if not league:
        return None
    
    # Obtener equipos en la liga
    league_teams = get_league_teams(db, league_id)
    teams = []
    for lt in league_teams:
        team = db.query(Team).filter(Team.id == lt.team_id).first()
        if team:
            # Convertir equipo a diccionario
            teams.append({
                "id": team.id,
                "name": team.name,
                "manager": team.manager,
                "manager_id": team.manager_id,
                "clan": team.clan,
                "value": team.value
            })
    
    # Obtener ganadores (podio)
    winner = db.query(Team).filter(Team.id == league.winner_id).first() if league.winner_id else None
    runner_up = db.query(Team).filter(Team.id == league.runner_up_id).first() if league.runner_up_id else None
    third_place = db.query(Team).filter(Team.id == league.third_place_id).first() if league.third_place_id else None
    
    # Convertir a diccionarios
    winner_dict = {
        "id": winner.id,
        "name": winner.name,
        "manager": winner.manager,
        "manager_id": winner.manager_id
    } if winner else None
    
    runner_up_dict = {
        "id": runner_up.id,
        "name": runner_up.name,
        "manager": runner_up.manager,
        "manager_id": runner_up.manager_id
    } if runner_up else None
    
    third_place_dict = {
        "id": third_place.id,
        "name": third_place.name,
        "manager": third_place.manager,
        "manager_id": third_place.manager_id
    } if third_place else None
    
    # Obtener equipos de mayor/menor valor
    highest_value_team = db.query(Team).filter(Team.id == league.highest_value_team_id).first() if league.highest_value_team_id else None
    lowest_value_team = db.query(Team).filter(Team.id == league.lowest_value_team_id).first() if league.lowest_value_team_id else None
    
    # Convertir a diccionarios
    highest_value_team_dict = {
        "id": highest_value_team.id,
        "name": highest_value_team.name,
        "value": highest_value_team.value
    } if highest_value_team else None
    
    lowest_value_team_dict = {
        "id": lowest_value_team.id,
        "name": lowest_value_team.name,
        "value": lowest_value_team.value
    } if lowest_value_team else None
    
    # Crear respuesta
    result = {
        "id": league.id,
        "name": league.name,
        "country": league.country,
        "tipo_liga": league.tipo_liga,
        "league_type": league.league_type,
        "max_teams": league.max_teams,
        "jornadas": league.jornadas,
        "manager_id": league.manager_id,
        "manager_name": league.manager_name,
        "active": league.active,
        "start_date": league.start_date,
        "end_date": league.end_date,
        "created_at": league.created_at,
        "matches_count": league.matches_count,
        "teams_count": league.teams_count,
        "calendar_generated": league.calendar_generated,
        "teams": teams,
        "winner": winner_dict,
        "runner_up": runner_up_dict,
        "third_place": third_place_dict,
        "highest_value_team": highest_value_team_dict,
        "lowest_value_team": lowest_value_team_dict,
        "avg_team_value": league.avg_team_value,
        "value_difference": league.value_difference,
        "creator": {
            "id": league.manager_id,
            "name": league.manager_name
        } if league.manager_id or league.manager_name else None
    }
    
    return result

def calculate_league_statistics(db: Session, league_id: int):
    """Calcula estadísticas generales de una liga"""
    # Obtener todos los partidos jugados de la liga
    matches = db.query(Match).filter(
        Match.league_id == league_id,
        Match.home_goals != None,
        Match.away_goals != None
    ).all()
    
    if not matches:
        return None
    
    # Inicializar estadísticas
    stats = {
        "total_goals": 0,
        "avg_goals_per_match": 0,
        "max_goals_in_match": 0,
        "max_goals_match_id": None,
        "formations": {},
        "styles": {},
        "highest_possession": 0,
        "team_goals": {},
        "team_goals_against": {},
        "home_wins": 0,
        "away_wins": 0,
        "draws": 0,
        "clean_sheets": 0
    }
    
    # Procesar cada partido
    for match in matches:
        # Total de goles en el partido
        match_goals = (match.home_goals or 0) + (match.away_goals or 0)
        stats["total_goals"] += match_goals
        
        # Máximo de goles en un partido
        if match_goals > stats["max_goals_in_match"]:
            stats["max_goals_in_match"] = match_goals
            stats["max_goals_match_id"] = match.id
        
        # Contar formaciones
        if match.home_formation:
            stats["formations"][match.home_formation] = stats["formations"].get(match.home_formation, 0) + 1
        if match.away_formation:
            stats["formations"][match.away_formation] = stats["formations"].get(match.away_formation, 0) + 1
        
        # Contar estilos
        if match.home_style:
            stats["styles"][match.home_style] = stats["styles"].get(match.home_style, 0) + 1
        if match.away_style:
            stats["styles"][match.away_style] = stats["styles"].get(match.away_style, 0) + 1
        
        # Máxima posesión
        if match.home_possession and match.home_possession > stats["highest_possession"]:
            stats["highest_possession"] = match.home_possession
        if match.away_possession and match.away_possession > stats["highest_possession"]:
            stats["highest_possession"] = match.away_possession
        
        # Contar goles por equipo
        if match.home_team_id not in stats["team_goals"]:
            stats["team_goals"][match.home_team_id] = 0
            stats["team_goals_against"][match.home_team_id] = 0
        if match.away_team_id not in stats["team_goals"]:
            stats["team_goals"][match.away_team_id] = 0
            stats["team_goals_against"][match.away_team_id] = 0
        
        # Sumar goles
        stats["team_goals"][match.home_team_id] += match.home_goals or 0
        stats["team_goals"][match.away_team_id] += match.away_goals or 0
        stats["team_goals_against"][match.home_team_id] += match.away_goals or 0
        stats["team_goals_against"][match.away_team_id] += match.home_goals or 0
        
        # Contar resultados
        if match.home_goals > match.away_goals:
            stats["home_wins"] += 1
        elif match.home_goals < match.away_goals:
            stats["away_wins"] += 1
        else:
            stats["draws"] += 1
        
        # Contar porterías a cero
        if match.home_goals == 0 or match.away_goals == 0:
            stats["clean_sheets"] += 1
    
    # Calcular promedio de goles por partido
    stats["avg_goals_per_match"] = stats["total_goals"] / len(matches) if matches else 0
    
    # Encontrar formación y estilo más comunes
    most_common_formation = max(stats["formations"].items(), key=lambda x: x[1])[0] if stats["formations"] else None
    most_common_style = max(stats["styles"].items(), key=lambda x: x[1])[0] if stats["styles"] else None
    
    # Encontrar equipo con más goles y mejor defensa
    team_with_most_goals_id = max(stats["team_goals"].items(), key=lambda x: x[1])[0] if stats["team_goals"] else None
    team_with_best_defense_id = min(stats["team_goals_against"].items(), key=lambda x: x[1])[0] if stats["team_goals_against"] else None
    
    # Obtener datos de equipos
    team_with_most_goals = db.query(Team).filter(Team.id == team_with_most_goals_id).first() if team_with_most_goals_id else None
    team_with_best_defense = db.query(Team).filter(Team.id == team_with_best_defense_id).first() if team_with_best_defense_id else None
    
    # Crear o actualizar registro de estadísticas
    db_stats = db.query(LeagueStatistics).filter(LeagueStatistics.league_id == league_id).first()
    
    if not db_stats:
        # Crear nuevo registro
        db_stats = LeagueStatistics(
            league_id=league_id,
            total_goals=stats["total_goals"],
            avg_goals_per_match=stats["avg_goals_per_match"],
            max_goals_in_match=stats["max_goals_in_match"],
            most_common_formation=most_common_formation,
            most_common_style=most_common_style,
            highest_possession=stats["highest_possession"],
            team_with_most_goals_id=team_with_most_goals_id,
            team_with_best_defense_id=team_with_best_defense_id
        )
        db.add(db_stats)
    else:
        # Actualizar registro existente
        db_stats.total_goals = stats["total_goals"]
        db_stats.avg_goals_per_match = stats["avg_goals_per_match"]
        db_stats.max_goals_in_match = stats["max_goals_in_match"]
        db_stats.most_common_formation = most_common_formation
        db_stats.most_common_style = most_common_style
        db_stats.highest_possession = stats["highest_possession"]
        db_stats.team_with_most_goals_id = team_with_most_goals_id
        db_stats.team_with_best_defense_id = team_with_best_defense_id
    
    db.commit()
    db.refresh(db_stats)
    
    # Preparar respuesta
    result = {
        "league_id": league_id,
        "total_goals": stats["total_goals"],
        "avg_goals_per_match": stats["avg_goals_per_match"],
        "max_goals_in_match": stats["max_goals_in_match"],
        "most_common_formation": most_common_formation,
        "most_common_style": most_common_style,
        "highest_possession": stats["highest_possession"],
        "team_with_most_goals": {
            "id": team_with_most_goals.id,
            "name": team_with_most_goals.name,
            "goals": stats["team_goals"][team_with_most_goals_id]
        } if team_with_most_goals else None,
        "team_with_best_defense": {
            "id": team_with_best_defense.id,
            "name": team_with_best_defense.name,
            "goals_against": stats["team_goals_against"][team_with_best_defense_id]
        } if team_with_best_defense else None,
        "home_wins": stats["home_wins"],
        "away_wins": stats["away_wins"],
        "draws": stats["draws"],
        "clean_sheets": stats["clean_sheets"]
    }
    
    return result