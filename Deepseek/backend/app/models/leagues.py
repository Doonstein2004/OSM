from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

class TipoLiga(str, Enum):
    LIGA_TACTICA = "Liga Tactica"
    LIGA_INTERNA = "Liga Interna"
    TORNEO = "Torneo"
    BATALLAS = "Batallas"

class LeagueBase(BaseModel):
    name: str
    country: Optional[str] = None
    tipo_liga: TipoLiga
    league_type: Optional[str] = "League"  # "League" o "Tournament"
    max_teams: int
    jornadas: int
    manager_id: Optional[str] = None
    manager_name: Optional[str] = None
    active: bool = True
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    highest_value_team_id: Optional[int] = None
    lowest_value_team_id: Optional[int] = None
    avg_team_value: Optional[float] = None
    value_difference: Optional[float] = None

class LeagueCreate(LeagueBase):
    pass

class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    tipo_liga: Optional[TipoLiga] = None
    league_type: Optional[str] = None
    max_teams: Optional[int] = None
    jornadas: Optional[int] = None
    manager_id: Optional[str] = None
    manager_name: Optional[str] = None
    active: Optional[bool] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    highest_value_team_id: Optional[int] = None
    lowest_value_team_id: Optional[int] = None
    avg_team_value: Optional[float] = None
    value_difference: Optional[float] = None
    winner_id: Optional[int] = None
    runner_up_id: Optional[int] = None
    third_place_id: Optional[int] = None
    calendar_generated: Optional[bool] = None

class League(LeagueBase):
    id: int
    created_at: datetime
    matches_count: int = Field(default=0)
    teams_count: int = Field(default=0)
    calendar_generated: bool = Field(default=False)
    winner_id: Optional[int] = None
    runner_up_id: Optional[int] = None
    third_place_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class LeagueWithDetails(League):
    winner: Optional[Dict[str, Any]] = None
    runner_up: Optional[Dict[str, Any]] = None
    third_place: Optional[Dict[str, Any]] = None
    highest_value_team: Optional[Dict[str, Any]] = None
    lowest_value_team: Optional[Dict[str, Any]] = None
    teams: List[Dict[str, Any]] = []
    creator: Optional[Dict[str, str]] = None
    
    class Config:
        from_attributes = True

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
    team: Dict[str, Any]
    league: Dict[str, Any]
    
    class Config:
        from_attributes = True

class LeagueStatistics(BaseModel):
    league_id: int
    total_goals: int
    avg_goals_per_match: float
    max_goals_in_match: int
    most_common_formation: str
    most_common_style: str
    highest_possession: int
    team_with_most_goals: Dict[str, Any]
    team_with_best_defense: Dict[str, Any]
    
    class Config:
        from_attributes = True

class LeagueTemplateImport(BaseModel):
    template_name: str  # Nombre del archivo JSON a importar

class LeagueTemplateSelect(BaseModel):
    league_name: str  # Nombre de la liga en el JSON
    tipo_liga: TipoLiga  # Tipo de liga a crear
    manager_id: str  # ID del manager que creará la liga
    manager_name: str  # Nombre del manager

class SimulationRequest(BaseModel):
    teams: List[int]
    jornadas: Optional[int] = None
    auto_schedule: Optional[bool] = False
    
    class Config:
        schema_extra = {
            "example": {
                "teams": [1, 2, 3, 4, 5, 6],
                "jornadas": 10,
                "auto_schedule": True
            }
        }