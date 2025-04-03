from pydantic import BaseModel
from typing import List, Optional

class TeamBase(BaseModel):
    name: str
    manager: Optional[str] = None
    clan: Optional[str] = None

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
    id: Optional[int] = None
    home_team: Optional[Team] = None
    away_team: Optional[Team] = None
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
    home_team: Team
    away_team: Team
    
    class Config:
        from_attributes = True
        
class MatchUpdate(BaseModel):
    jornada: Optional[int] = None
    home_team_id: Optional[int] = None
    away_team_id: Optional[int] = None
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
    teams: List[TeamCreate]
    jornadas: int = 42
    matches_per_jornada: int = 10