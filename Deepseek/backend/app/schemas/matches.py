from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    jornada = Column(Integer)
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    league_id = Column(Integer, ForeignKey("leagues.id"), index=True)
    date = Column(DateTime, nullable=True)
    time = Column(String, nullable=True)
    
    # Estadísticas del equipo local
    home_formation = Column(String)
    home_style = Column(String)
    home_attack = Column(String)
    home_kicks = Column(String)
    home_possession = Column(Integer, nullable=True)
    home_shots = Column(Integer, nullable=True)
    home_goals = Column(Integer, nullable=True)
    home_shots_on_target = Column(Integer, nullable=True)
    home_fouls = Column(Integer, nullable=True)
    
    # Estadísticas del equipo visitante
    away_formation = Column(String)
    away_style = Column(String)
    away_attack = Column(String)
    away_kicks = Column(String)
    away_possession = Column(Integer, nullable=True)
    away_shots = Column(Integer, nullable=True)
    away_goals = Column(Integer, nullable=True)
    away_shots_on_target = Column(Integer, nullable=True)
    away_fouls = Column(Integer, nullable=True)
    
    # Control de timestamp
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    home_team = relationship("Team", back_populates="home_matches", foreign_keys=[home_team_id])
    away_team = relationship("Team", back_populates="away_matches", foreign_keys=[away_team_id])
    league = relationship("League", back_populates="matches")
    calendar_entry = relationship("Calendar", back_populates="match", uselist=False)