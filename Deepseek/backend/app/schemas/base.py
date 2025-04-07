from sqlalchemy.ext.declarative import declarative_base

# Base class for all SQLAlchemy table models
Base = declarative_base()

# Import all schema models to register them with the Base
from .teams import Team
from .leagues import League, LeagueTeam, TipoLiga
from .matches import Match
from .statistics import LeagueStatistics
from .calendar import Calendar