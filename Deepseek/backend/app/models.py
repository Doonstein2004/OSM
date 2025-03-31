from pydantic import BaseModel
from typing import List, Optional

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    
    class Config:
        from_attributes = True

class MatchBase(BaseModel):
    jornada: int
    home_team_id: int
    away_team_id: int

class MatchCreate(MatchBase):
    home_formation: Optional[str] = None
    home_style: Optional[str] = None
    home_attack: Optional[str] = None
    home_kicks: Optional[str] = None
    home_possession: Optional[int] = None
    home_shots: Optional[int] = None
    home_goals: Optional[int] = None
    away_formation: Optional[str] = None
    away_style: Optional[str] = None
    away_attack: Optional[str] = None
    away_kicks: Optional[str] = None
    away_possession: Optional[int] = None
    away_shots: Optional[int] = None
    away_goals: Optional[int] = None

class Match(MatchBase):
    id: int
    home_formation: Optional[str] = None
    home_style: Optional[str] = None
    home_attack: Optional[str] = None
    home_kicks: Optional[str] = None
    home_possession: Optional[int] = None
    home_shots: Optional[int] = None
    home_goals: Optional[int] = None
    away_formation: Optional[str] = None
    away_style: Optional[str] = None
    away_attack: Optional[str] = None
    away_kicks: Optional[str] = None
    away_possession: Optional[int] = None
    away_shots: Optional[int] = None
    away_goals: Optional[int] = None
    
    class Config:
        from_attributes = True

class SimulationRequest(BaseModel):
    teams: List[str]
    jornadas: int = 42
    matches_per_jornada: int = 10