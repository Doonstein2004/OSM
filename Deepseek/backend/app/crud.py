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
        
        played = len(matches_as_home) + len(matches_as_away)
        wins = 0
        draws = 0
        losses = 0
        goals_for = 0
        goals_against = 0
        
        for match in matches_as_home:
            goals_for += match.home_goals if match.home_goals is not None else 0
            goals_against += match.away_goals if match.away_goals is not None else 0
            if match.home_goals > match.away_goals:
                wins += 1
            elif match.home_goals == match.away_goals:
                draws += 1
            else:
                losses += 1
                
        for match in matches_as_away:
            goals_for += match.away_goals
            goals_against += match.home_goals
            if match.away_goals > match.home_goals:
                wins += 1
            elif match.away_goals == match.home_goals:
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
            "result": "H" if match.home_goals is not None and match.away_goals is not None and match.home_goals > match.away_goals else "A" if match.home_goals is not None and match.away_goals is not None and match.away_goals > match.home_goals else "D"
        })
    
    df = pd.DataFrame(data)
    
    # Análisis básico
    analysis = {
        "total_matches": len(df),
        "home_wins": len(df[df["result"] == "H"]),
        "away_wins": len(df[df["result"] == "A"]),
        "draws": len(df[df["result"] == "D"]),
        "avg_home_goals": df["home_goals"].mean(),
        "avg_away_goals": df["away_goals"].mean(),
        "most_common_formations": {
            "home": df["home_formation"].value_counts().head(3).to_dict(),
            "away": df["away_formation"].value_counts().head(3).to_dict()
        },
        "most_effective_styles": {
            "home": df.groupby("home_style")["home_goals"].mean().sort_values(ascending=False).head(3).to_dict(),
            "away": df.groupby("away_style")["away_goals"].mean().sort_values(ascending=False).head(3).to_dict()
        },
        "possession_impact": {
            "home_win": df[df["result"] == "H"]["home_possession"].mean(),
            "away_win": df[df["result"] == "A"]["away_possession"].mean(),
            "draw": df[df["result"] == "D"]["home_possession"].mean()
        },
        "shots_conversion": {
            "home": (df["home_goals"].sum() / df["home_shots"].sum()) * 100,
            "away": (df["away_goals"].sum() / df["away_shots"].sum()) * 100
        }
    }
    
    return analysis