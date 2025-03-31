from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    manager = Column(String, unique=True, index=True, nullable=False)
    clan = Column(String, index=True, nullable=True)
    home_matches = relationship("Match", back_populates="home_team", foreign_keys="[Match.home_team_id]")
    away_matches = relationship("Match", back_populates="away_team", foreign_keys="[Match.away_team_id]")

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    jornada = Column(Integer)
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    
    # Estadísticas del equipo local
    home_formation = Column(String)
    home_style = Column(String)
    home_attack = Column(String)  # "51-31-71"
    home_kicks = Column(String)
    home_possession = Column(Integer)
    home_shots = Column(Integer)
    home_goals = Column(Integer)
    
    # Estadísticas del equipo visitante
    away_formation = Column(String)
    away_style = Column(String)
    away_attack = Column(String)  # "63-35-68"
    away_kicks = Column(String)
    away_possession = Column(Integer)
    away_shots = Column(Integer)
    away_goals = Column(Integer)
    
    home_team = relationship("Team", back_populates="home_matches", foreign_keys=[home_team_id])
    away_team = relationship("Team", back_populates="away_matches", foreign_keys=[away_team_id])