import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from app.schemas import Base
from app.crud import create_team, create_match
from app.models import TeamCreate, MatchCreate
from app.database import SessionLocal
from datetime import datetime

load_dotenv()

def init_db():
    db = SessionLocal()
    
    try:
        # Crear equipos de ejemplo más completos
        teams_data = [
            {"name": "Real Madrid", "manager": "Carlo Ancelotti", "clan": "La Casa Blanca"},
            {"name": "Barcelona", "manager": "Xavi Hernández", "clan": "Culés"},
            {"name": "Atlético de Madrid", "manager": "Diego Simeone", "clan": "Colchoneros"},
            {"name": "Sevilla", "manager": "Quique Sánchez Flores", "clan": "Nervionenses"},
            {"name": "Valencia", "manager": "Rubén Baraja", "clan": "Che"},
            {"name": "Villarreal", "manager": "Marcelino García", "clan": "Submarino Amarillo"},
            {"name": "Real Sociedad", "manager": "Imanol Alguacil", "clan": "Txuri-Urdin"},
            {"name": "Athletic Bilbao", "manager": "Ernesto Valverde", "clan": "Leones"}
        ]
        
        team_ids = {}
        
        for team in teams_data:
            db_team = create_team(db, TeamCreate(
                name=team["name"],
                manager=team["manager"],
                clan=team["clan"]
            ))
            team_ids[team["name"]] = db_team.id
        
        # Crear partidos de ejemplo más realistas
        matches = [
            # Jornada 1
            MatchCreate(
                jornada=1,
                home_team_id=team_ids["Real Madrid"],
                away_team_id=team_ids["Barcelona"],
                home_formation="433A",
                home_style="Pases",
                home_attack="65-35-70",
                home_kicks="Normal",
                home_possession=58,
                home_shots=12,
                home_goals=3,
                away_formation="442B",
                away_style="Contraataque",
                away_attack="55-40-65",
                away_kicks="Agresivo",
                away_possession=42,
                away_shots=8,
                away_goals=1,
            ),
            MatchCreate(
                jornada=1,
                home_team_id=team_ids["Atlético de Madrid"],
                away_team_id=team_ids["Sevilla"],
                home_formation="442A",
                home_style="Bandas",
                home_attack="60-40-70",
                home_kicks="Duro",
                home_possession=52,
                home_shots=10,
                home_goals=2,
                away_formation="541A",
                away_style="Disparos",
                away_attack="50-45-60",
                away_kicks="Normal",
                away_possession=48,
                away_shots=6,
                away_goals=1,
            ),
            
            # Jornada 2
            MatchCreate(
                jornada=2,
                home_team_id=team_ids["Barcelona"],
                away_team_id=team_ids["Atlético de Madrid"],
                home_formation="433B",
                home_style="Posesión",
                home_attack="70-30-75",
                home_kicks="Normal",
                home_possession=65,
                home_shots=14,
                home_goals=2,
                away_formation="532",
                away_style="Contraataque",
                away_attack="45-50-55",
                away_kicks="Cuidado",
                away_possession=35,
                away_shots=4,
                away_goals=0,
            ),
            MatchCreate(
                jornada=2,
                home_team_id=team_ids["Valencia"],
                away_team_id=team_ids["Real Madrid"],
                home_formation="4231",
                home_style="Disparos",
                home_attack="55-45-65",
                home_kicks="Agresivo",
                home_possession=45,
                home_shots=9,
                home_goals=1,
                away_formation="433A",
                away_style="Pases",
                away_attack="60-35-70",
                away_kicks="Normal",
                away_possession=55,
                away_shots=11,
                away_goals=3,
            ),
            
            # Jornada 3 - Clásicos regionales
            MatchCreate(
                jornada=3,
                home_team_id=team_ids["Real Sociedad"],
                away_team_id=team_ids["Athletic Bilbao"],
                home_formation="442B",
                home_style="Bandas",
                home_attack="58-42-68",
                home_kicks="Normal",
                home_possession=50,
                home_shots=10,
                home_goals=2,
                away_formation="442A",
                away_style="Balones Largos",
                away_attack="52-48-62",
                away_kicks="Duro",
                away_possession=50,
                away_shots=10,
                away_goals=2,
            ),
            MatchCreate(
                jornada=3,
                home_team_id=team_ids["Villarreal"],
                away_team_id=team_ids["Valencia"],
                home_formation="4231",
                home_style="Posesión",
                home_attack="62-38-72",
                home_kicks="Normal",
                home_possession=60,
                home_shots=13,
                home_goals=3,
                away_formation="541B",
                away_style="Contraataque",
                away_attack="48-52-58",
                away_kicks="Agresivo",
                away_possession=40,
                away_shots=5,
                away_goals=1,
            )
        ]
        
        for match in matches:
            create_match(db, match)
        
        db.commit()
        print(f"Base de datos inicializada con éxito! {len(teams_data)} equipos y {len(matches)} partidos creados.")
    except Exception as e:
        db.rollback()
        print(f"Error al inicializar la base de datos: {e}")
        raise  # Re-lanza la excepción para ver el traceback completo
    finally:
        db.close()

if __name__ == "__main__":
    init_db()