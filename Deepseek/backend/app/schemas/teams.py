from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    manager = Column(String, index=True, nullable=True)
    manager_id = Column(String, index=True, nullable=True)
    clan = Column(String, index=True, nullable=True)
    value = Column(String, nullable=True)  
    
    # Relationships
    home_matches = relationship("Match", back_populates="home_team", foreign_keys="[Match.home_team_id]")
    away_matches = relationship("Match", back_populates="away_team", foreign_keys="[Match.away_team_id]")
    league_teams = relationship("LeagueTeam", back_populates="team")
    
    # League podium relationships
    winner_of_leagues = relationship("League", back_populates="winner", foreign_keys="[League.winner_id]")
    runner_up_of_leagues = relationship("League", back_populates="runner_up", foreign_keys="[League.runner_up_id]")
    third_place_of_leagues = relationship("League", back_populates="third_place", foreign_keys="[League.third_place_id]")
    
    # Valor relationships in leagues
    highest_value_in_leagues = relationship("League", foreign_keys="[League.highest_value_team_id]")
    lowest_value_in_leagues = relationship("League", foreign_keys="[League.lowest_value_team_id]")
    
    # Statistics relationships
    most_goals_leagues = relationship("LeagueStatistics", foreign_keys="[LeagueStatistics.team_with_most_goals_id]")
    best_defense_leagues = relationship("LeagueStatistics", foreign_keys="[LeagueStatistics.team_with_best_defense_id]")