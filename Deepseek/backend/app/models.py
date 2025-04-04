from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

TipoLiga = Literal["Liga Tactica", "Liga Interna", "Torneo", "Batallas"]


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
        
# New League models
class LeagueBase(BaseModel):
    name: str
    country: Optional[str] = None  # País ahora es opcional
    tipo_liga: TipoLiga
    max_teams: int
    jornadas: int
    creator_id: Optional[int] = None  # ID del creador de la liga
    active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class LeagueCreate(LeagueBase):
    pass

class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    tipo_liga: Optional[TipoLiga] = None
    max_teams: Optional[int] = None
    jornadas: Optional[int] = None
    creator_id: Optional[int] = None
    active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    winner_id: Optional[int] = None
    runner_up_id: Optional[int] = None
    third_place_id: Optional[int] = None

class League(LeagueBase):
    id: int
    created_at: datetime
    matches_count: int = Field(default=0)
    teams_count: int = Field(default=0)
    winner_id: Optional[int] = None
    runner_up_id: Optional[int] = None
    third_place_id: Optional[int] = None
    
    class Config:
        from_attributes = True
        
        
class LeagueWithDetails(League):
    winner: Optional["Team"] = None
    runner_up: Optional["Team"] = None
    third_place: Optional["Team"] = None
    creator: Optional["Team"] = None  # Información del creador
    teams: List["Team"] = []
    
    class Config:
        from_attributes = True

# League Team relationship
class LeagueTeamBase(BaseModel):
    league_id: int
    team_id: int
    registration_date: Optional[datetime] = None

class LeagueTeamCreate(LeagueTeamBase):
    pass

class LeagueTeam(LeagueTeamBase):
    id: int
    
    class Config:
        from_attributes = True

class LeagueTeamWithDetails(LeagueTeam):
    team: Team
    league: League
    
    class Config:
        from_attributes = True

# Update Match model to include league_id
class MatchCreate(BaseModel):
    jornada: int
    home_team_id: int
    away_team_id: int
    league_id: int
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

# League Statistics
class LeagueStatistics(BaseModel):
    league_id: int
    total_goals: int
    avg_goals_per_match: float
    max_goals_in_match: int
    most_common_formation: str
    most_common_style: str
    highest_possession: int
    team_with_most_goals: str
    team_with_best_defense: str
    
    class Config:
        from_attributes = True

# Update SimulationRequest to include league
class SimulationRequest(BaseModel):
    league_id: int
    teams: List[int]  # Now just team IDs
    jornadas: int = 42
    matches_per_jornada: Optional[int] = None

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