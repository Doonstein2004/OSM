from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base

class Calendar(Base):
    __tablename__ = "calendar"
    
    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"), index=True)
    jornada = Column(Integer, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=True, unique=True)
    scheduled_date = Column(DateTime, nullable=True)
    scheduled_time = Column(String, nullable=True)
    venue = Column(String, nullable=True)
    is_played = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    league = relationship("League", back_populates="calendar_entries")
    match = relationship("Match", back_populates="calendar_entry")