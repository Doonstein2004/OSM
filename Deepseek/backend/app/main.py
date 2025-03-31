from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud, simulation
from .database import SessionLocal, engine

schemas.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Simulador de Torneo de Fútbol",
    description="API para simular y gestionar un torneo de fútbol con estadísticas avanzadas",
    version="0.1.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/teams/", response_model=models.Team)
def create_team(team: models.TeamCreate, db: Session = Depends(get_db)):
    db_team = crud.get_team_by_name(db, name=team.name)
    if db_team:
        raise HTTPException(status_code=400, detail="El equipo ya existe")
    return crud.create_team(db=db, team=team)

@app.get("/teams/", response_model=List[models.Team])
def read_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    teams = crud.get_teams(db, skip=skip, limit=limit)
    return teams

@app.post("/simulate-tournament/")
def simulate_tournament(request: models.SimulationRequest, db: Session = Depends(get_db)):
    # Primero creamos los equipos si no existen
    teams_in_db = []
    for team_name in request.teams:
        db_team = crud.get_team_by_name(db, name=team_name)
        if not db_team:
            db_team = crud.create_team(db, models.TeamCreate(name=team_name))
        teams_in_db.append(db_team)
    
    # Simulamos el torneo
    simulator = simulation.TournamentSimulator()
    simulated_matches = simulator.generate_fixture(
        teams=request.teams,
        jornadas=request.jornadas,
        matches_per_jornada=request.matches_per_jornada
    )
    
    # Guardamos los partidos en la base de datos
    saved_matches = []
    for match in simulated_matches:
        home_team = crud.get_team_by_name(db, name=match["home_team"])
        away_team = crud.get_team_by_name(db, name=match["away_team"])
        
        match_data = models.MatchCreate(
            jornada=match["jornada"],
            home_team_id=home_team.id,
            away_team_id=away_team.id,
            home_formation=match["alineacion_local"],
            home_style=match["estilo_local"],
            home_attack=match["avanzadas_local"],
            home_kicks=match["patadas_local"],
            home_possession=match["posesion_local"],
            home_shots=match["disparos_local"],
            home_goals=match["goles_local"],
            away_formation=match["alineacion_visitante"],
            away_style=match["estilo_visitante"],
            away_attack=match["avanzadas_visitante"],
            away_kicks=match["patadas_visitante"],
            away_possession=match["posesion_visitante"],
            away_shots=match["disparos_visitante"],
            away_goals=match["goles_visitante"]
        )
        
        db_match = crud.create_match(db, match_data)
        saved_matches.append(db_match)
    
    return {"message": f"Torneo simulado con {len(saved_matches)} partidos"}

@app.get("/matches/", response_model=List[models.Match])
def read_matches(jornada: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if jornada:
        matches = crud.get_matches_by_jornada(db, jornada=jornada, skip=skip, limit=limit)
    else:
        matches = crud.get_matches(db, skip=skip, limit=limit)
    return matches

@app.post("/matches/", response_model=models.Match)
def create_match(match: models.MatchCreate, db: Session = Depends(get_db)):
    return crud.create_match(db=db, match=match)

@app.get("/standings/")
def get_standings(db: Session = Depends(get_db)):
    return crud.calculate_standings(db)

@app.get("/analysis/")
def get_analysis(db: Session = Depends(get_db)):
    return crud.get_tournament_analysis(db)