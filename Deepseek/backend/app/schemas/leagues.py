from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from ..database import Base

# Definir enumeración para tipos de liga
class TipoLiga(str, enum.Enum):
    LIGA_TACTICA = "Liga Tactica"
    LIGA_INTERNA = "Liga Interna"
    TORNEO = "Torneo"
    BATALLAS = "Batallas"

class League(Base):
    __tablename__ = "leagues"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String, index=True, nullable=True)
    tipo_liga = Column(Enum(TipoLiga), index=True)
    league_type = Column(String, default="League")  # "League" o "Tournament"
    max_teams = Column(Integer)
    jornadas = Column(Integer)
    manager_id = Column(String, index=True, nullable=True)
    manager_name = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Estadísticas de valor de equipos
    highest_value_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    lowest_value_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    avg_team_value = Column(Float, nullable=True)
    value_difference = Column(Float, nullable=True)
    
    # Campos para contar (calculados dinámicamente)
    matches_count = Column(Integer, default=0)
    teams_count = Column(Integer, default=0)
    
    # Podium (winners)
    winner_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    runner_up_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    third_place_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Calendario generado
    calendar_generated = Column(Boolean, default=False)
    
    # Relationships
    matches = relationship("Match", back_populates="league")
    league_teams = relationship("LeagueTeam", back_populates="league")
    calendar_entries = relationship("Calendar", back_populates="league")
    
    # Podium relationships
    winner = relationship("Team", back_populates="winner_of_leagues", foreign_keys=[winner_id])
    runner_up = relationship("Team", back_populates="runner_up_of_leagues", foreign_keys=[runner_up_id])
    third_place = relationship("Team", back_populates="third_place_of_leagues", foreign_keys=[third_place_id])
    
    # Valor relationships
    highest_value_team = relationship("Team", foreign_keys=[highest_value_team_id], back_populates="highest_value_in_leagues")
    lowest_value_team = relationship("Team", foreign_keys=[lowest_value_team_id], back_populates="lowest_value_in_leagues")
    
    # Statistics
    statistics = relationship("LeagueStatistics", back_populates="league", uselist=False)


# League-Team relationship
class LeagueTeam(Base):
    __tablename__ = "league_teams"
    
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"), index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), index=True)
    registration_date = Column(DateTime, server_default=func.now())
    
    # Relationships
    league = relationship("League", back_populates="league_teams")
    team = relationship("Team", back_populates="league_teams")