from sqlalchemy.orm import Session
from . import schemas, models
from typing import List, Dict, Any
import pandas as pd

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

def update_team(db: Session, team_id: int, team_update: models.TeamCreate):
    db_team = db.query(schemas.Team).filter(schemas.Team.id == team_id).first()
    if db_team:
        db_team.manager = team_update.manager
        db_team.clan = team_update.clan
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
        
        # Procesar partidos como local
        for match in matches_as_home:
            # Verificar que ambos goles tengan valor
            if match.home_goals is None or match.away_goals is None:
                continue  # Saltar partidos sin resultado
                
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
            # Verificar que ambos goles tengan valor
            if match.away_goals is None or match.home_goals is None:
                continue  # Saltar partidos sin resultado
                
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