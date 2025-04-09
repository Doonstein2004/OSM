# app/models/matches.py

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, date
from ..models.teams import Team as TeamModel  # Modelo Pydantic para equipos

class MatchBase(BaseModel):
    jornada: int
    home_team_id: int
    away_team_id: int
    league_id: int

class MatchCreate(MatchBase):
    date: Optional[date] = None
    time: Optional[str] = None
    home_formation: Optional[str] = None
    home_style: Optional[str] = None
    home_attack: Optional[str] = None
    home_kicks: Optional[str] = None
    home_possession: Optional[int] = None
    home_shots: Optional[int] = None
    home_goals: Optional[int] = None
    home_shots_on_target: Optional[int] = None
    home_fouls: Optional[int] = None
    away_formation: Optional[str] = None
    away_style: Optional[str] = None
    away_attack: Optional[str] = None
    away_kicks: Optional[str] = None
    away_possession: Optional[int] = None
    away_shots: Optional[int] = None
    away_goals: Optional[int] = None
    away_shots_on_target: Optional[int] = None
    away_fouls: Optional[int] = None

class MatchUpdate(BaseModel):
    jornada: Optional[int] = None
    date: Optional[date] = None
    time: Optional[str] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
    league_id: Optional[int] = None
    home_formation: Optional[str] = None
    home_style: Optional[str] = None
    home_attack: Optional[str] = None
    home_kicks: Optional[str] = None
    home_possession: Optional[int] = None
    home_shots: Optional[int] = None
    home_goals: Optional[int] = None
    home_shots_on_target: Optional[int] = None
    home_fouls: Optional[int] = None
    away_formation: Optional[str] = None
    away_style: Optional[str] = None
    away_attack: Optional[str] = None
    away_kicks: Optional[str] = None
    away_possession: Optional[int] = None
    away_shots: Optional[int] = None
    away_goals: Optional[int] = None
    away_shots_on_target: Optional[int] = None
    away_fouls: Optional[int] = None

class Match(MatchBase):
    id: int
    date: Optional[date] = None
    time: Optional[str] = None
    home_formation: Optional[str] = None
    home_style: Optional[str] = None
    home_attack: Optional[str] = None
    home_kicks: Optional[str] = None
    home_possession: Optional[int] = None
    home_shots: Optional[int] = None
    home_goals: Optional[int] = None
    home_shots_on_target: Optional[int] = None
    home_fouls: Optional[int] = None
    away_formation: Optional[str] = None
    away_style: Optional[str] = None
    away_attack: Optional[str] = None
    away_kicks: Optional[str] = None
    away_possession: Optional[int] = None
    away_shots: Optional[int] = None
    away_goals: Optional[int] = None
    away_shots_on_target: Optional[int] = None
    away_fouls: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    home_team: Optional[TeamModel] = None
    away_team: Optional[TeamModel] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True  # Esto también puede ser útil

class MatchStatistics(BaseModel):
    match_id: int
    jornada: int
    league_id: int
    home_team: Dict[str, Any]
    away_team: Dict[str, Any]
    result: Dict[str, Any]
    stats: Dict[str, Any]
    date_time: Dict[str, Any]
    played_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class BatchMatchUpdate(BaseModel):
    match_ids: List[int]
    data: MatchUpdate
    
    class Config:
        schema_extra = {
            "example": {
                "match_ids": [1, 2, 3],
                "data": {
                    "home_goals": 2,
                    "away_goals": 1,
                    "home_possession": 55,
                    "away_possession": 45
                }
            }
        }