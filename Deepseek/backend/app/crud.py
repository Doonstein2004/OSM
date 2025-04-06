from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from . import schemas, models
from typing import List, Dict, Any, Optional
import pandas as pd
import math

def get_team(db: Session, team_id: int):
    return db.query(schemas.Team).filter(schemas.Team.id == team_id).first()

def get_team_by_name(db: Session, name: str):
    return db.query(schemas.Team).filter(schemas.Team.name == name).first()

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Team).offset(skip).limit(limit).all()

def create_team(db: Session, team: models.TeamCreate):
    db_team = schemas.Team(
        name=team.name, 
        manager=team.manager, 
        clan=team.clan
    )
    
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def update_team(db: Session, team_id: int, team_data: models.TeamUpdate):
    db_team = db.query(schemas.Team).filter(schemas.Team.id == team_id).first()
    if not db_team:
        return None
    
    update_data = team_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_team, key, value)
    
    db.commit()
    db.refresh(db_team)
    return db_team

def get_matches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(schemas.Match).offset(skip).limit(limit).all()

def get_matches_by_jornada(db: Session, jornada: int, skip: int = 0, limit: int = 100):
    return db.query(schemas.Match).filter(schemas.Match.jornada == jornada).offset(skip).limit(limit).all()

def create_match(db: Session, match: models.MatchCreate):
    db_match = schemas.Match(**match.dict())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def update_match_db(db: Session, match_id: int, match_data: models.MatchUpdate):
    match = db.query(schemas.Match).filter(schemas.Match.id == match_id).first()
    if not match:
        return None
    
    # Actualiza solo los campos que no son None
    update_data = match_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:  # Solo actualiza si el valor no es None
            setattr(match, key, value)
    
    db.commit()
    db.refresh(match)
    return match

def calculate_standings(db: Session) -> List[Dict[str, Any]]:
    teams = get_teams(db)
    standings = []
    
    for team in teams:
        matches_as_home = db.query(schemas.Match).filter(schemas.Match.home_team_id == team.id).all()
        matches_as_away = db.query(schemas.Match).filter(schemas.Match.away_team_id == team.id).all()
        
        played = 0  # Ahora contaremos solo los partidos con resultados completos
        wins = 0
        draws = 0
        losses = 0
        goals_for = 0
        goals_against = 0
        
        # Función para validar goles
        def is_valid_goal(goal):
            if goal is None:
                return False
            if isinstance(goal, float) and math.isnan(goal):
                return False
            return True
        
        # Procesar partidos como local
        for match in matches_as_home:
            if not all(map(is_valid_goal, [match.home_goals, match.away_goals])):
                continue
                
            played += 1
            home_goals = match.home_goals
            away_goals = match.away_goals
            
            goals_for += home_goals
            goals_against += away_goals
            
            if home_goals > away_goals:
                wins += 1
            elif home_goals == away_goals:
                draws += 1
            else:
                losses += 1
                
        # Procesar partidos como visitante
        for match in matches_as_away:
            if not all(map(is_valid_goal, [match.away_goals, match.home_goals])):
                continue
                
            played += 1
            away_goals = match.away_goals
            home_goals = match.home_goals
            
            goals_for += away_goals
            goals_against += home_goals
            
            if away_goals > home_goals:
                wins += 1
            elif away_goals == home_goals:
                draws += 1
            else:
                losses += 1
                
        points = wins * 3 + draws
        goal_difference = goals_for - goals_against
        
        standings.append({
            "team_id": team.id,
            "team_name": team.name,
            "team_manager": team.manager,
            "played": played,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "goals_for": goals_for,
            "goals_against": goals_against,
            "goal_difference": goal_difference,
            "points": points
        })
    
    # Ordenar por puntos, diferencia de goles y goles a favor
    standings.sort(key=lambda x: (-x["points"], -x["goal_difference"], -x["goals_for"]))
    
    return standings

def get_tournament_analysis(db: Session) -> Dict[str, Any]:
    # Obtener todos los partidos
    matches = db.query(schemas.Match).all()
    
    if not matches:
        return {"message": "No hay partidos para analizar"}
    
    # Convertir a DataFrame para análisis más fácil
    data = []
    for match in matches:
        data.append({
            "jornada": match.jornada,
            "home_team": match.home_team.name,
            "away_team": match.away_team.name,
            "home_formation": match.home_formation,
            "away_formation": match.away_formation,
            "home_style": match.home_style,
            "away_style": match.away_style,
            "home_possession": match.home_possession,
            "away_possession": match.away_possession,
            "home_shots": match.home_shots,
            "away_shots": match.away_shots,
            "home_goals": match.home_goals,
            "away_goals": match.away_goals,
            "home_shots_on_target": match.home_shots_on_target if hasattr(match, 'home_shots_on_target') else None,
            "away_shots_on_target": match.away_shots_on_target if hasattr(match, 'away_shots_on_target') else None,
            "home_fouls": match.home_fouls if hasattr(match, 'home_fouls') else None,
            "away_fouls": match.away_fouls if hasattr(match, 'away_fouls') else None,
            "result": "H" if match.home_goals is not None and match.away_goals is not None and match.home_goals > match.away_goals else "A" if match.home_goals is not None and match.away_goals is not None and match.away_goals > match.home_goals else "D"
        })
    
    df = pd.DataFrame(data)
    
    # Análisis general
    analysis = {
        "total_matches": len(df),
        "home_wins": len(df[df["result"] == "H"]),
        "away_wins": len(df[df["result"] == "A"]),
        "draws": len(df[df["result"] == "D"]),
        "avg_home_goals": df["home_goals"].mean(),
        "avg_away_goals": df["away_goals"].mean(),
    }
    
    # Análisis por jornada
    analysis["by_jornada"] = {
        "goals_trend": df.groupby("jornada")[["home_goals", "away_goals"]].sum().to_dict(),
        "possession_trend": df.groupby("jornada")[["home_possession", "away_possession"]].mean().to_dict(),
        "results_distribution": df.groupby("jornada")["result"].value_counts().unstack().fillna(0).to_dict()
    }
    
    # Análisis de formaciones
    home_formation_stats = df.groupby("home_formation").agg({
        "home_goals": "mean",
        "away_goals": "mean",
        "result": lambda x: (x == "H").mean() * 100  # % de victorias como local
    }).sort_values("result", ascending=False)
    
    away_formation_stats = df.groupby("away_formation").agg({
        "away_goals": "mean",
        "home_goals": "mean",
        "result": lambda x: (x == "A").mean() * 100  # % de victorias como visitante
    }).sort_values("result", ascending=False)
    
    analysis["formations"] = {
        "home": {
            "most_common": df["home_formation"].value_counts().head(5).to_dict(),
            "most_effective": home_formation_stats.head(5).to_dict()
        },
        "away": {
            "most_common": df["away_formation"].value_counts().head(5).to_dict(),
            "most_effective": away_formation_stats.head(5).to_dict()
        }
    }
    
    # Análisis de estilos de juego
    home_style_stats = df.groupby("home_style").agg({
        "home_goals": "mean",
        "away_goals": "mean",
        "home_possession": "mean",
        "result": lambda x: (x == "H").mean() * 100  # % de victorias como local
    }).sort_values("home_goals", ascending=False)
    
    away_style_stats = df.groupby("away_style").agg({
        "away_goals": "mean",
        "home_goals": "mean",
        "away_possession": "mean",
        "result": lambda x: (x == "A").mean() * 100  # % de victorias como visitante
    }).sort_values("away_goals", ascending=False)
    
    analysis["play_styles"] = {
        "home": home_style_stats.head(5).to_dict(),
        "away": away_style_stats.head(5).to_dict()
    }
    
    # Efectividad y eficiencia
    analysis["effectiveness"] = {
        "possession_impact": {
            "home_win": df[df["result"] == "H"]["home_possession"].mean(),
            "away_win": df[df["result"] == "A"]["away_possession"].mean(),
            "draw": df[df["result"] == "D"]["home_possession"].mean()
        },
        "shots_conversion": {
            "home": (df["home_goals"].sum() / df["home_shots"].sum()) * 100 if df["home_shots"].sum() > 0 else 0,
            "away": (df["away_goals"].sum() / df["away_shots"].sum()) * 100 if df["away_shots"].sum() > 0 else 0
        }
    }
    
    # Análisis de enfrentamientos directos
    team_matchups = {}
    teams = set(df["home_team"].unique()) | set(df["away_team"].unique())
    
    for team in teams:
        team_matchups[team] = {}
        
        for opponent in teams:
            if team == opponent:
                continue
                
            # Partidos como local contra este oponente
            home_matches = df[(df["home_team"] == team) & (df["away_team"] == opponent)]
            # Partidos como visitante contra este oponente
            away_matches = df[(df["away_team"] == team) & (df["home_team"] == opponent)]
            
            total_matches = len(home_matches) + len(away_matches)
            
            if total_matches > 0:
                wins = len(home_matches[home_matches["result"] == "H"]) + len(away_matches[away_matches["result"] == "A"])
                draws = len(home_matches[home_matches["result"] == "D"]) + len(away_matches[away_matches["result"] == "D"])
                losses = total_matches - wins - draws
                
                goals_for = home_matches["home_goals"].sum() + away_matches["away_goals"].sum()
                goals_against = home_matches["away_goals"].sum() + away_matches["home_goals"].sum()
                
                team_matchups[team][opponent] = {
                    "played": total_matches,
                    "wins": wins,
                    "draws": draws,
                    "losses": losses,
                    "goals_for": float(goals_for),
                    "goals_against": float(goals_against),
                    "points": wins * 3 + draws
                }
    
    analysis["team_matchups"] = team_matchups
    
    # Estadísticas por local/visitante para cada equipo
    team_stats = {}
    for team in teams:
        home_stats = df[df["home_team"] == team]
        away_stats = df[df["away_team"] == team]
        
        team_stats[team] = {
            "home": {
                "played": len(home_stats),
                "wins": len(home_stats[home_stats["result"] == "H"]),
                "draws": len(home_stats[home_stats["result"] == "D"]),
                "losses": len(home_stats[home_stats["result"] == "A"]),
                "goals_for": float(home_stats["home_goals"].sum()),
                "goals_against": float(home_stats["away_goals"].sum()),
                "avg_possession": float(home_stats["home_possession"].mean()),
                "shots_conversion": float((home_stats["home_goals"].sum() / home_stats["home_shots"].sum()) * 100) if home_stats["home_shots"].sum() > 0 else 0
            },
            "away": {
                "played": len(away_stats),
                "wins": len(away_stats[away_stats["result"] == "A"]),
                "draws": len(away_stats[away_stats["result"] == "D"]),
                "losses": len(away_stats[away_stats["result"] == "H"]),
                "goals_for": float(away_stats["away_goals"].sum()),
                "goals_against": float(away_stats["home_goals"].sum()),
                "avg_possession": float(away_stats["away_possession"].mean()),
                "shots_conversion": float((away_stats["away_goals"].sum() / away_stats["away_shots"].sum()) * 100) if away_stats["away_shots"].sum() > 0 else 0
            }
        }
    
    analysis["team_stats"] = team_stats
    
    return analysis


# League CRUD operations
def create_league(db: Session, league: models.LeagueCreate):
    # Crear la liga con manager en lugar de creator
    db_league = schemas.League(
        name=league.name,
        country=league.country,
        tipo_liga=league.tipo_liga,
        max_teams=league.max_teams,
        jornadas=league.jornadas,
        manager_id=league.manager_id,
        manager_name=league.manager_name,
        active=league.active,
        start_date=league.start_date,
        end_date=league.end_date,
        matches_count=0,
        teams_count=0
    )
    db.add(db_league)
    db.commit()
    db.refresh(db_league)
    return db_league

def get_league(db: Session, league_id: int):
    # Obtener la liga y calcular los totales
    db_league = db.query(schemas.League).filter(schemas.League.id == league_id).first()
    
    if db_league:
        # Calcular conteo de partidos
        db_league.matches_count = db.query(func.count(schemas.Match.id)).filter(
            schemas.Match.league_id == league_id
        ).scalar() or 0
        
        # Calcular conteo de equipos
        db_league.teams_count = db.query(func.count(schemas.LeagueTeam.id)).filter(
            schemas.LeagueTeam.league_id == league_id
        ).scalar() or 0
    
    return db_league

def get_leagues(db: Session, skip: int = 0, limit: int = 100, active_only: bool = False, manager_id: Optional[str] = None):
    # Obtener ligas con filtros opcionales
    query = db.query(schemas.League)
    
    if active_only:
        query = query.filter(schemas.League.active == True)
        
    if manager_id is not None:
        query = query.filter(schemas.League.manager_id == manager_id)
    
    leagues = query.offset(skip).limit(limit).all()
    
    # Calcular conteos para cada liga
    for league in leagues:
        # Conteo de partidos
        league.matches_count = db.query(func.count(schemas.Match.id)).filter(
            schemas.Match.league_id == league.id
        ).scalar() or 0
        
        # Conteo de equipos
        league.teams_count = db.query(func.count(schemas.LeagueTeam.id)).filter(
            schemas.LeagueTeam.league_id == league.id
        ).scalar() or 0
    
    return leagues

def get_manager_leagues(db: Session, manager_id: str, active_only: bool = False):
    """Obtener todas las ligas creadas por un manager específico"""
    return get_leagues(db, active_only=active_only, manager_id=manager_id)

def update_league(db: Session, league_id: int, league_data: models.LeagueUpdate):
    db_league = get_league(db, league_id)
    if not db_league:
        return None
    
    # Update league data
    update_data = league_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_league, key, value)
    
    db.commit()
    db.refresh(db_league)
    return db_league

def delete_league(db: Session, league_id: int):
    # Primero eliminar los equipos asociados a la liga
    db.query(schemas.LeagueTeam).filter(schemas.LeagueTeam.league_id == league_id).delete()
    
    # Eliminar los partidos de la liga
    db.query(schemas.Match).filter(schemas.Match.league_id == league_id).delete()
    
    # Eliminar las estadísticas de la liga
    db.query(schemas.LeagueStatistics).filter(schemas.LeagueStatistics.league_id == league_id).delete()
    
    # Por último, eliminar la liga
    result = db.query(schemas.League).filter(schemas.League.id == league_id).delete()
    
    db.commit()
    return result > 0

# League Team CRUD operations
def add_team_to_league(db: Session, league_team: models.LeagueTeamCreate):
    # Check if team already exists in league
    existing = db.query(schemas.LeagueTeam).filter(
        schemas.LeagueTeam.league_id == league_team.league_id,
        schemas.LeagueTeam.team_id == league_team.team_id
    ).first()
    
    if existing:
        return existing
    
    # Check if league has space for more teams
    league = get_league(db, league_team.league_id)
    teams_count = db.query(func.count(schemas.LeagueTeam.id)).filter(
        schemas.LeagueTeam.league_id == league_team.league_id
    ).scalar()
    
    if teams_count >= league.max_teams:
        return None  # League is full
    
    db_league_team = schemas.LeagueTeam(
        league_id=league_team.league_id,
        team_id=league_team.team_id,
        registration_date=league_team.registration_date
    )
    
    db.add(db_league_team)
    db.commit()
    db.refresh(db_league_team)
    return db_league_team

def get_league_teams(db: Session, league_id: int):
    return db.query(schemas.LeagueTeam).filter(
        schemas.LeagueTeam.league_id == league_id
    ).all()

def remove_team_from_league(db: Session, league_id: int, team_id: int):
    db_league_team = db.query(schemas.LeagueTeam).filter(
        schemas.LeagueTeam.league_id == league_id,
        schemas.LeagueTeam.team_id == team_id
    ).first()
    
    if not db_league_team:
        return False
    
    db.delete(db_league_team)
    db.commit()
    return True

# League statistics
def calculate_league_statistics(db: Session, league_id: int):
    # Get all completed matches in the league
    matches = db.query(schemas.Match).filter(
        schemas.Match.league_id == league_id,
        schemas.Match.home_goals != None,
        schemas.Match.away_goals != None
    ).all()
    
    if not matches:
        return None
    
    total_goals = 0
    max_goals_in_match = 0
    max_goals_match_id = None
    formations = {}
    styles = {}
    highest_possession = 0
    team_goals = {}  # Track goals scored by each team
    team_goals_against = {}  # Track goals conceded by each team
    
    for match in matches:
        # Total goals in match
        match_goals = (match.home_goals or 0) + (match.away_goals or 0)
        total_goals += match_goals
        
        # Max goals in a match
        if match_goals > max_goals_in_match:
            max_goals_in_match = match_goals
            max_goals_match_id = match.id
        
        # Track formations
        if match.home_formation:
            formations[match.home_formation] = formations.get(match.home_formation, 0) + 1
        if match.away_formation:
            formations[match.away_formation] = formations.get(match.away_formation, 0) + 1
        
        # Track styles
        if match.home_style:
            styles[match.home_style] = styles.get(match.home_style, 0) + 1
        if match.away_style:
            styles[match.away_style] = styles.get(match.away_style, 0) + 1
        
        # Track highest possession
        if match.home_possession and match.home_possession > highest_possession:
            highest_possession = match.home_possession
        if match.away_possession and match.away_possession > highest_possession:
            highest_possession = match.away_possession
        
        # Track team goals
        if match.home_team_id not in team_goals:
            team_goals[match.home_team_id] = 0
            team_goals_against[match.home_team_id] = 0
        if match.away_team_id not in team_goals:
            team_goals[match.away_team_id] = 0
            team_goals_against[match.away_team_id] = 0
        
        if match.home_goals:
            team_goals[match.home_team_id] += match.home_goals
            team_goals_against[match.away_team_id] += match.home_goals
        
        if match.away_goals:
            team_goals[match.away_team_id] += match.away_goals
            team_goals_against[match.home_team_id] += match.away_goals
    
    # Find most common formation and style
    most_common_formation = max(formations.items(), key=lambda x: x[1])[0] if formations else None
    most_common_style = max(styles.items(), key=lambda x: x[1])[0] if styles else None
    
    # Find team with most goals and best defense
    team_with_most_goals_id = max(team_goals.items(), key=lambda x: x[1])[0] if team_goals else None
    team_with_best_defense_id = min(team_goals_against.items(), key=lambda x: x[1])[0] if team_goals_against else None
    
    # Save or update statistics
    db_stats = db.query(schemas.LeagueStatistics).filter(
        schemas.LeagueStatistics.league_id == league_id
    ).first()
    
    if not db_stats:
        db_stats = schemas.LeagueStatistics(
            league_id=league_id,
            total_goals=total_goals,
            avg_goals_per_match=total_goals / len(matches) if matches else 0,
            max_goals_in_match=max_goals_in_match,
            most_common_formation=most_common_formation,
            most_common_style=most_common_style,
            highest_possession=highest_possession,
            team_with_most_goals_id=team_with_most_goals_id,
            team_with_best_defense_id=team_with_best_defense_id
        )
        db.add(db_stats)
    else:
        db_stats.total_goals = total_goals
        db_stats.avg_goals_per_match = total_goals / len(matches) if matches else 0
        db_stats.max_goals_in_match = max_goals_in_match
        db_stats.most_common_formation = most_common_formation
        db_stats.most_common_style = most_common_style
        db_stats.highest_possession = highest_possession
        db_stats.team_with_most_goals_id = team_with_most_goals_id
        db_stats.team_with_best_defense_id = team_with_best_defense_id
    
    db.commit()
    db.refresh(db_stats)
    return db_stats

def calculate_league_standings(db: Session, league_id: int):
    # Get all teams in the league
    league_teams = get_league_teams(db, league_id)
    team_ids = [lt.team_id for lt in league_teams]
    
    # Initialize standings
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
    
    # Get all completed matches in the league
    matches = db.query(schemas.Match).filter(
        schemas.Match.league_id == league_id,
        schemas.Match.home_goals != None,
        schemas.Match.away_goals != None
    ).all()
    
    # Calculate standings
    for match in matches:
        home_id = match.home_team_id
        away_id = match.away_team_id
        
        # Skip if teams are not in the league (could happen if teams were removed)
        if home_id not in standings or away_id not in standings:
            continue
        
        home_goals = match.home_goals or 0
        away_goals = match.away_goals or 0
        
        # Update matches played
        standings[home_id]["played"] += 1
        standings[away_id]["played"] += 1
        
        # Update goals
        standings[home_id]["goals_for"] += home_goals
        standings[home_id]["goals_against"] += away_goals
        standings[away_id]["goals_for"] += away_goals
        standings[away_id]["goals_against"] += home_goals
        
        # Update win/draw/loss and points
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
    
    # Calculate goal difference
    for team_id in standings:
        standings[team_id]["goal_difference"] = standings[team_id]["goals_for"] - standings[team_id]["goals_against"]
    
    # Sort by points, then goal difference, then goals scored
    sorted_standings = sorted(
        standings.values(),
        key=lambda x: (x["points"], x["goal_difference"], x["goals_for"]),
        reverse=True
    )
    
    # Add team details
    for i, team_standing in enumerate(sorted_standings):
        team = db.query(schemas.Team).filter(schemas.Team.id == team_standing["team_id"]).first()
        sorted_standings[i]["team"] = team
        sorted_standings[i]["position"] = i + 1
    
    return sorted_standings

def update_league_podium(db: Session, league_id: int):
    standings = calculate_league_standings(db, league_id)
    if len(standings) < 3:
        return None
    
    league = get_league(db, league_id)
    if not league:
        return None
    
    # Update podium
    league.winner_id = standings[0]["team_id"]
    league.runner_up_id = standings[1]["team_id"]
    league.third_place_id = standings[2]["team_id"]
    
    db.commit()
    db.refresh(league)
    return league

# Match operations with league support
def create_league_match(db: Session, match: models.MatchCreate):
    # Check if teams are in the league
    for team_id in [match.home_team_id, match.away_team_id]:
        team_in_league = db.query(schemas.LeagueTeam).filter(
            schemas.LeagueTeam.league_id == match.league_id,
            schemas.LeagueTeam.team_id == team_id
        ).first()
        
        if not team_in_league:
            return None  # Team not in league
    
    db_match = schemas.Match(
        jornada=match.jornada,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        league_id=match.league_id,
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

def get_league_matches(db: Session, league_id: int, jornada: Optional[int] = None):
    query = db.query(schemas.Match).filter(schemas.Match.league_id == league_id)
    
    if jornada is not None:
        query = query.filter(schemas.Match.jornada == jornada)
    
    return query.all()

def generate_league_fixture(db: Session, league_id: int, simulator):
    # Get all teams in the league
    league_teams = get_league_teams(db, league_id)
    team_ids = [lt.team_id for lt in league_teams]
    
    # Get team names for simulation
    teams = []
    for team_id in team_ids:
        team = db.query(schemas.Team).filter(schemas.Team.id == team_id).first()
        if team:
            teams.append(team.name)
    
    # Get league details
    league = get_league(db, league_id)
    if not league:
        return None
    
    # Calculate matches per jornada
    teams_count = len(teams)
    matches_per_jornada = teams_count // 2  # Each team plays one match per jornada
    
    # Generate fixtures using the simulator
    simulated_matches = simulator.generate_fixture(
        teams=teams,
        jornadas=league.jornadas,
        matches_per_jornada=matches_per_jornada
    )
    
    # Save matches with league ID
    saved_matches = []
    for match in simulated_matches:
        # Get team IDs by name
        home_team = db.query(schemas.Team).filter(schemas.Team.name == match["home_team"]).first()
        away_team = db.query(schemas.Team).filter(schemas.Team.name == match["away_team"]).first()
        
        if not home_team or not away_team:
            continue
        
        # Create match with league ID
        match_data = models.MatchCreate(
            jornada=match["jornada"],
            home_team_id=home_team.id,
            away_team_id=away_team.id,
            league_id=league_id,
            home_formation=match["home_formation"],
            home_style=match["home_style"],
            home_attack=match["home_attack"],
            home_kicks=match["home_kicks"],
            home_possession=match["home_possession"],
            home_shots=match["home_shots"],
            home_goals=match["home_goals"],
            away_formation=match["away_formation"],
            away_style=match["away_style"],
            away_attack=match["away_attack"],
            away_kicks=match["away_kicks"],
            away_possession=match["away_possession"],
            away_shots=match["away_shots"],
            away_goals=match["away_goals"]
        )
        
        db_match = create_league_match(db, match_data)
        if db_match:
            saved_matches.append(db_match)
    
    return saved_matches