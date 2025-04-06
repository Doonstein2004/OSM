# schemas.py (SQLAlchemy models for database)

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

# Existing schemas
class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    manager = Column(String, index=True, nullable=True)
    manager_id = Column(String, index=True, nullable=True)  # Nuevo campo
    clan = Column(String, index=True, nullable=True)
    value = Column(String, nullable=True)  
    home_matches = relationship("Match", back_populates="home_team", foreign_keys="[Match.home_team_id]")
    away_matches = relationship("Match", back_populates="away_team", foreign_keys="[Match.away_team_id]")
    league_teams = relationship("LeagueTeam", back_populates="team")
    
    # League podium relationships
    winner_of_leagues = relationship("League", back_populates="winner", foreign_keys="[League.winner_id]")
    runner_up_of_leagues = relationship("League", back_populates="runner_up", foreign_keys="[League.runner_up_id]")
    third_place_of_leagues = relationship("League", back_populates="third_place", foreign_keys="[League.third_place_id]")



# Definir enumeración para tipos de liga
class TipoLiga(str, enum.Enum):
    LIGA_TACTICA = "Liga Tactica"
    LIGA_INTERNA = "Liga Interna"
    TORNEO = "Torneo"
    BATALLAS = "Batallas"


# Actualizar el esquema League
class League(Base):
    __tablename__ = "leagues"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String, index=True, nullable=True)  # País puede ser nulo
    tipo_liga = Column(Enum(TipoLiga), index=True)
    max_teams = Column(Integer)
    jornadas = Column(Integer)
    manager_id = Column(String, index=True, nullable=True)  # ID del manager (string)
    manager_name = Column(String, nullable=True)  # Nombre del manager para mostrar
    active = Column(Boolean, default=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Estadísticas de valor de equipos
    highest_value_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    lowest_value_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    avg_team_value = Column(Float, nullable=True)
    value_difference = Column(Float, nullable=True)
    
    # Añadir estas columnas para poder pasar los valores
    matches_count = Column(Integer, default=0)
    teams_count = Column(Integer, default=0)
    
    # Podium (winners)
    winner_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    runner_up_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    third_place_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Relationships
    matches = relationship("Match", back_populates="league")
    league_teams = relationship("LeagueTeam", back_populates="league")
    
    # Podium relationships
    winner = relationship("Team", back_populates="winner_of_leagues", foreign_keys=[winner_id])
    runner_up = relationship("Team", back_populates="runner_up_of_leagues", foreign_keys=[runner_up_id])
    third_place = relationship("Team", back_populates="third_place_of_leagues", foreign_keys=[third_place_id])
    
    # Valor relationships
    highest_value_team = relationship("Team", foreign_keys=[highest_value_team_id])
    lowest_value_team = relationship("Team", foreign_keys=[lowest_value_team_id])
    
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

# Update Match schema to include league reference
class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    jornada = Column(Integer)
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    league_id = Column(Integer, ForeignKey("leagues.id"), index=True)
    
    # Estadísticas del equipo local
    home_formation = Column(String)
    home_style = Column(String)
    home_attack = Column(String)
    home_kicks = Column(String)
    home_possession = Column(Integer)
    home_shots = Column(Integer)
    home_goals = Column(Integer)
    
    # Estadísticas del equipo visitante
    away_formation = Column(String)
    away_style = Column(String)
    away_attack = Column(String)
    away_kicks = Column(String)
    away_possession = Column(Integer)
    away_shots = Column(Integer)
    away_goals = Column(Integer)
    
    # Relationships
    home_team = relationship("Team", back_populates="home_matches", foreign_keys=[home_team_id])
    away_team = relationship("Team", back_populates="away_matches", foreign_keys=[away_team_id])
    league = relationship("League", back_populates="matches")

# League Statistics Schema
class LeagueStatistics(Base):
    __tablename__ = "league_statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"), unique=True)
    total_goals = Column(Integer, default=0)
    avg_goals_per_match = Column(Float, default=0.0)
    max_goals_in_match = Column(Integer, default=0)
    most_common_formation = Column(String)
    most_common_style = Column(String)
    highest_possession = Column(Integer, default=0)
    team_with_most_goals_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team_with_best_defense_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Relationships
    league = relationship("League", back_populates="statistics")
    team_with_most_goals = relationship("Team", foreign_keys=[team_with_most_goals_id])
    team_with_best_defense = relationship("Team", foreign_keys=[team_with_best_defense_id])