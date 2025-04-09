# app/schemas/statistics.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class LeagueStatistics(Base):
    __tablename__ = "league_statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"), unique=True)
    total_goals = Column(Integer, default=0)
    avg_goals_per_match = Column(Float, default=0.0)
    max_goals_in_match = Column(Integer, default=0)
    most_common_formation = Column(String, nullable=True)
    most_common_style = Column(String, nullable=True)
    highest_possession = Column(Integer, default=0)
    team_with_most_goals_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team_with_best_defense_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    # Relationships
    league = relationship("League", back_populates="statistics")
    team_with_most_goals = relationship("Team", foreign_keys=[team_with_most_goals_id], back_populates="most_goals_leagues")
    team_with_best_defense = relationship("Team", foreign_keys=[team_with_best_defense_id], back_populates="best_defense_leagues")