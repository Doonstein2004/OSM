import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from app.schemas import Base
from app.crud import create_team, create_match
from app.models import TeamCreate, MatchCreate
from app.database import SessionLocal

load_dotenv()

def init_db():
    # Usa la conexión directamente desde database.py
    db = SessionLocal()
    
    try:
        # Crear equipos de ejemplo
        teams = ["Real Madrid", "Barcelona", "Atlético de Madrid", "Sevilla"]
        team_ids = {}
        
        for team in teams:
            db_team = create_team(db, TeamCreate(name=team))
            team_ids[team] = db_team.id
        
        # Crear partidos de ejemplo
        matches = [
            MatchCreate(
                jornada=1,
                home_team_id=team_ids["Real Madrid"],
                away_team_id=team_ids["Barcelona"],
                home_formation="433A",
                home_style="Pases",
                home_attack="65-35-70",
                home_kicks="Normal",
                home_possession=60,
                home_shots=8,
                home_goals=3,
                away_formation="442B",
                away_style="Contraataque",
                away_attack="55-40-65",
                away_kicks="Agresivo",
                away_possession=40,
                away_shots=5,
                away_goals=1
            )
        ]
        
        for match in matches:
            create_match(db, match)
        
        db.commit()
        print("Base de datos inicializada con éxito!")
    except Exception as e:
        db.rollback()
        print(f"Error al inicializar la base de datos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()