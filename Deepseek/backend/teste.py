import os
import json
from typing import Dict, List, Tuple
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from .app.models import TeamCreate, MatchCreate
from .app.database import SessionLocal, engine, Base
from .app.crud import create_team, create_match

load_dotenv()

def generate_clan(team_name: str, manager_name: str) -> str:
    """Genera un clan único de 3 letras mayúsculas basado en equipo y manager"""
    # Intentar obtener 3 letras del apellido del manager
    manager_parts = manager_name.upper().split()
    if len(manager_parts) > 1:
        last_name = manager_parts[-1]
        clean_last = ''.join([c for c in last_name if c.isalpha()])[:3]
        if len(clean_last) == 3:
            return clean_last
    
    # Si no tiene apellido válido, usar código del equipo
    team_keywords = {
        "REAL": "REL",
        "ATLÉTICO": "ATL",
        "DEPORTIVO": "DEP",
        "UNIÓN": "UNI",
        "SPORTING": "SPO"
    }
    
    # Buscar palabras clave en el nombre del equipo
    for keyword, code in team_keywords.items():
        if keyword in team_name.upper():
            return code
    
    # Tomar primeras 3 letras limpias del primer palabra del equipo
    first_word = team_name.upper().split()[0]
    clean_word = ''.join([c for c in first_word if c.isalpha()])
    return clean_word[:3] if len(clean_word) >= 3 else "CLN"

def calculate_jornadas(matches: List[Dict], matches_per_jornada: int = 10) -> List[Dict]:
    """Organiza los partidos en jornadas de forma equilibrada"""
    for i, match in enumerate(matches):
        match["jornada"] = (i // matches_per_jornada) + 1
    return matches

def process_managers(matches: List[Dict]) -> Dict[str, List[str]]:
    """Registra todos los managers por equipo y detecta cambios"""
    team_managers: Dict[str, List[str]] = {}
    
    for match in matches:
        # Registrar managers locales
        local_team = match["equipo_local"]
        if local_team not in team_managers:
            team_managers[local_team] = []
        if match["manager_local"] not in team_managers[local_team]:
            team_managers[local_team].append(match["manager_local"])
            
        # Registrar managers visitantes
        visitor_team = match["equipo_visitante"]
        if visitor_team not in team_managers:
            team_managers[visitor_team] = []
        if match["manager_visitante"] not in team_managers[visitor_team]:
            team_managers[visitor_team].append(match["manager_visitante"])
    
    return team_managers

def init_db_from_json(json_file: str = "matches.json"):
    """Inicializa la base de datos con datos mejorados"""
    
    db = SessionLocal()
    
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            raw_matches: List[Dict] = json.load(f)

        # Paso 1: Calcular jornadas
        processed_matches = calculate_jornadas(raw_matches)
        total_jornadas = processed_matches[-1]["jornada"]
        
        # Paso 2: Procesar managers y equipos
        team_managers = process_managers(processed_matches)
        teams: Dict[str, Dict] = {}
        
        for team_name, managers in team_managers.items():
            clan = generate_clan(team_name, managers[0])
            teams[team_name] = {
                "manager": managers[0],  # Primer manager encontrado
                "managers": managers,    # Todos los managers históricos
                "clan": clan
            }

        # Paso 3: Crear equipos
        team_ids: Dict[str, int] = {}
        
        for team_name, team_info in teams.items():
            team = TeamCreate(
                name=team_name,
                manager=team_info["manager"],
                clan=team_info["clan"]
            )
            db_team = create_team(db, team)
            team_ids[team_name] = db_team.id

        # Paso 4: Crear partidos
        for match in processed_matches:
            # Manejar datos numéricos faltantes
            def safe_int(value, default=0):
                try:
                    return int(value)
                except:
                    return default

            match_create = MatchCreate(
                jornada=match["jornada"],
                home_team_id=team_ids[match["equipo_local"]],
                away_team_id=team_ids[match["equipo_visitante"]],
                home_formation=match.get("alineacion_local", "4-4-2"),
                home_style=match.get("estilo_local", "Balanced"),
                home_attack=match.get("avanzadas_local", "50-50-50"),
                home_kicks=match.get("patadas_local", "Normal"),
                home_possession=safe_int(match.get("posesion_local", 50)),
                home_shots=safe_int(match.get("disparos_local", 0)),
                home_goals=safe_int(match.get("goles_local", 0)),
                away_formation=match.get("alineacion_visitante", "4-4-2"),
                away_style=match.get("estilo_visitante", "Balanced"),
                away_attack=match.get("avanzadas_visitante", "50-50-50"),
                away_kicks=match.get("patadas_visitante", "Normal"),
                away_possession=safe_int(match.get("posesion_visitante", 50)),
                away_shots=safe_int(match.get("disparos_visitante", 0)),
                away_goals=safe_int(match.get("goles_visitante", 0))
            )
            
            create_match(db, match_create)

        db.commit()
        print(f"✅ Base de datos inicializada con éxito!")
        print(f"• {len(teams)} equipos creados")
        print(f"• {len(processed_matches)} partidos en {total_jornadas} jornadas")
        print(f"• {sum(len(['managers']) for v in teams.values())} relaciones manager-equipo registradas")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    # Crear tablas primero
    Base.metadata.create_all(bind=engine)
    
    # Ejecutar inicialización
    init_db_from_json("../new_data.json")