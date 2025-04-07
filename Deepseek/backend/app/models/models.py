from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class TeamBase(BaseModel):
    name: str
    manager: Optional[str] = None
    manager_id: Optional[str] = None
    clan: Optional[str] = None
    value: Optional[str] = None  # Valor del equipo (ej: "30,3M")

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    manager: Optional[str] = None
    manager_id: Optional[str] = None
    clan: Optional[str] = None
    value: Optional[str] = None

class Team(TeamBase):
    id: int
    
    class Config:
        from_attributes = True

class TeamWithStats(Team):
    stats: Dict[str, Any]
    leagues: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True

class TeamBatchCreate(BaseModel):
    teams: List[TeamCreate]
    
    class Config:
        schema_extra = {
            "example": {
                "teams": [
                    {"name": "Real Madrid", "value": "1200M"},
                    {"name": "Barcelona", "value": "1100M"},
                    {"name": "Atlético Madrid", "value": "800M"}
                ]
            }
        }

class TeamBatchUpdate(BaseModel):
    team_ids: List[int]
    data: TeamUpdate
    
    class Config:
        schema_extra = {
            "example": {
                "team_ids": [1, 2, 3],
                "data": {
                    "clan": "ClubA"
                }
            }
        }