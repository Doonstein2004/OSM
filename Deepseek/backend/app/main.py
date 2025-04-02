from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.orm import joinedload

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

@app.put("/teams/{team_id}", response_model=models.Team)
def update_team(team_id: int, team_update: models.TeamCreate, db: Session = Depends(get_db)):
    db_team = crud.update_team(db, team_id, team_update)
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return db_team

@app.post("/simulate-tournament/")
def simulate_tournament(request: models.SimulationRequest, db: Session = Depends(get_db)):
    # Primero creamos los equipos si no existen

    teams_in_db = []
    team_names = []  # Lista de nombres para el simulador
    
    for team in request.teams:
        db_team = crud.get_team_by_name(db, name=team.name)
        if not db_team:
            db_team = crud.create_team(db, team)
        teams_in_db.append(db_team)
        team_names.append(db_team.name)  # Guardamos solo el nombre
    
    # Simulamos el torneo usando solo los nombres
    simulator = simulation.TournamentSimulator()
    simulated_matches = simulator.generate_fixture(
        teams=team_names,  # Pasamos la lista de nombres
        jornadas=request.jornadas,
        matches_per_jornada=request.matches_per_jornada
    )
    
    # Guardamos los partidos en la base de datos
    saved_matches = []
    for match in simulated_matches:
        # Obtenemos los equipos por nombre
        home_team = crud.get_team_by_name(db, name=match["home_team"])
        away_team = crud.get_team_by_name(db, name=match["away_team"])
        
        # Creamos el objeto MatchCreate
        match_data = models.MatchCreate(
            jornada=match["jornada"],
            home_team_id=home_team.id,
            away_team_id=away_team.id,
            home_formation=match["home_formation"],
            home_style=match["home_style"],
            home_attack=match["home_attack"],
            home_kicks=match["home_kicks"],
            home_possession=match["home_possession"],
            home_shots=match["home_shots"],
            home_goals=match["home_goals"],
            away_formation=match["away_formation"],
            away_style=match["away_style"],
            away_attack=match["away_attack"],
            away_kicks=match["away_kicks"],
            away_possession=match["away_possession"],
            away_shots=match["away_shots"],
            away_goals=match["away_goals"]
        )
        
        db_match = crud.create_match(db, match_data)
        saved_matches.append(db_match)
    
    return {"message": f"Torneo simulado con {len(saved_matches)} partidos"}

@app.get("/matches/", response_model=List[models.Match])
def read_matches(jornada: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(schemas.Match).options(
        joinedload(schemas.Match.home_team),
        joinedload(schemas.Match.away_team)
    )
    
    if jornada:
        matches = query.filter(schemas.Match.jornada == jornada)
    
    return query.offset(skip).limit(limit).all()

@app.post("/matches/", response_model=models.Match)
def create_match(match: models.MatchCreate, db: Session = Depends(get_db)):
    return crud.create_match(db=db, match=match)

@app.patch("/matches/{match_id}", response_model=models.Match)
def update_match(match_id: int, match_data: models.MatchUpdate, db: Session = Depends(get_db)):
    """
    Actualiza un partido existente.
    Solo se actualizarán los campos incluidos en la solicitud.
    """
    updated_match = crud.update_match_db(db, match_id, match_data)
    if not updated_match:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    return updated_match

@app.get("/standings/")
def get_standings(db: Session = Depends(get_db)):
    return crud.calculate_standings(db)

@app.get("/analysis/")
def get_analysis(db: Session = Depends(get_db)):
    return crud.get_tournament_analysis(db)