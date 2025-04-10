# backend/app/models/calendar.py

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class CalendarEntryBase(BaseModel):
    league_id: int
    jornada: int
    match_id: Optional[int] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[str] = None
    venue: Optional[str] = None

class CalendarEntryCreate(CalendarEntryBase):
    pass

class CalendarEntryUpdate(BaseModel):
    jornada: Optional[int] = None
    match_id: Optional[int] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[str] = None
    venue: Optional[str] = None
    is_played: Optional[bool] = None

class CalendarEntry(CalendarEntryBase):
    id: int
    is_played: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CalendarEntryWithDetails(CalendarEntry):
    match: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class LeagueCalendarResponse(BaseModel):
    league_id: int
    league_name: str
    jornadas: int
    entries: List[CalendarEntryWithDetails]
    
    class Config:
        from_attributes = True

class GenerateCalendarRequest(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    auto_schedule: bool = False
    match_days: Optional[List[int]] = None  # Días de la semana (0=lunes, 6=domingo)
    
    class Config:
        schema_extra = {
            "example": {
                "start_date": "2023-09-01",
                "end_date": "2023-12-31",
                "auto_schedule": True,
                "match_days": [5, 6]  # Sábado y domingo
            }
        }

class ImportExternalCalendarRequest(BaseModel):
    external_url: str
    
    class Config:
        schema_extra = {
            "example": {
                "external_url": "https://www.flashscore.com/football/spain/laliga/fixtures/"
            }
        }