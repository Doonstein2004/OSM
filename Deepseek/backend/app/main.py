from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.orm import joinedload
from datetime import datetime

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

@app.post("/leagues/", response_model=models.League)
def create_league(league: models.LeagueCreate, db: Session = Depends(get_db)):
    return crud.create_league(db, league)

@app.get("/leagues/", response_model=List[models.League])
def read_leagues(
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = False,
    creator_id: Optional[int] = None,  # Parámetro añadido
    db: Session = Depends(get_db)
):
    return crud.get_leagues(db, skip=skip, limit=limit, active_only=active_only, creator_id=creator_id)

@app.get("/leagues/{league_id}", response_model=models.LeagueWithDetails)
def read_league(league_id: int, db: Session = Depends(get_db)):
    db_league = crud.get_league(db, league_id)
    if not db_league:
        raise HTTPException(status_code=404, detail="League not found")
    
    # Get teams in league
    league_teams = crud.get_league_teams(db, league_id)
    teams = []
    for lt in league_teams:
        team = db.query(schemas.Team).filter(schemas.Team.id == lt.team_id).first()
        if team:
            teams.append(team)
    
    # Create response model
    league_details = models.LeagueWithDetails(
        **{k: getattr(db_league, k) for k in dir(db_league) if not k.startswith('_') and k != 'metadata'},
        teams=teams
    )
    
    return league_details

@app.put("/leagues/{league_id}", response_model=models.League)
def update_league(league_id: int, league_data: models.LeagueUpdate, db: Session = Depends(get_db)):
    updated_league = crud.update_league(db, league_id, league_data)
    if not updated_league:
        raise HTTPException(status_code=404, detail="League not found")
    return updated_league

@app.delete("/leagues/{league_id}")
def delete_league(league_id: int, db: Session = Depends(get_db)):
    success = crud.delete_league(db, league_id)
    if not success:
        raise HTTPException(status_code=404, detail="League not found")
    return {"detail": "League deleted successfully"}

@app.post("/leagues/{league_id}/teams/{team_id}", response_model=models.LeagueTeam)
def add_team_to_league(league_id: int, team_id: int, db: Session = Depends(get_db)):
    league_team = models.LeagueTeamCreate(
        league_id=league_id,
        team_id=team_id,
        registration_date=datetime.now()
    )
    db_league_team = crud.add_team_to_league(db, league_team)
    if not db_league_team:
        raise HTTPException(status_code=400, detail="League is full or team/league not found")
    return db_league_team

@app.get("/leagues/{league_id}/teams", response_model=List[models.Team])
def get_teams_in_league(league_id: int, db: Session = Depends(get_db)):
    league_teams = crud.get_league_teams(db, league_id)
    teams = []
    for lt in league_teams:
        team = db.query(schemas.Team).filter(schemas.Team.id == lt.team_id).first()
        if team:
            teams.append(team)
    return teams

@app.delete("/leagues/{league_id}/teams/{team_id}")
def remove_team_from_league(league_id: int, team_id: int, db: Session = Depends(get_db)):
    success = crud.remove_team_from_league(db, league_id, team_id)
    if not success:
        raise HTTPException(status_code=404, detail="Team not found in league")
    return {"detail": "Team removed from league successfully"}

@app.post("/leagues/{league_id}/simulate")
def simulate_league(
    league_id: int, 
    request: models.SimulationRequest,
    db: Session = Depends(get_db)
):
    # Verify league exists
    league = crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    # Verify teams exist and are in the league
    for team_id in request.teams:
        team = db.query(schemas.Team).filter(schemas.Team.id == team_id).first()
        if not team:
            raise HTTPException(status_code=404, detail=f"Team with ID {team_id} not found")
        
        # Add team to league if not already in it
        team_in_league = db.query(schemas.LeagueTeam).filter(
            schemas.LeagueTeam.league_id == league_id,
            schemas.LeagueTeam.team_id == team_id
        ).first()
        
        if not team_in_league:
            league_team = models.LeagueTeamCreate(
                league_id=league_id,
                team_id=team_id,
                registration_date=datetime.now()
            )
            db_league_team = crud.add_team_to_league(db, league_team)
            if not db_league_team:
                raise HTTPException(status_code=400, detail="League is full")
    
    # Setup simulator
    simulator = simulation.TournamentSimulator()
    
    # Generate fixtures for the league
    simulated_matches = crud.generate_league_fixture(db, league_id, simulator)
    
    if not simulated_matches:
        raise HTTPException(status_code=400, detail="Failed to generate fixtures")
    
    return {"message": f"League simulated with {len(simulated_matches)} matches"}

@app.get("/leagues/{league_id}/standings")
def get_league_standings(league_id: int, db: Session = Depends(get_db)):
    # Verify league exists
    league = crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    standings = crud.calculate_league_standings(db, league_id)
    return standings

@app.get("/leagues/{league_id}/statistics", response_model=models.LeagueStatistics)
def get_league_statistics(league_id: int, db: Session = Depends(get_db)):
    # Verify league exists
    league = crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    statistics = crud.calculate_league_statistics(db, league_id)
    if not statistics:
        raise HTTPException(status_code=404, detail="No statistics available for this league")
    
    return statistics

@app.post("/leagues/{league_id}/matches")
def create_match_in_league(
    league_id: int, 
    match: models.MatchCreate, 
    db: Session = Depends(get_db)
):
    # Override league_id in the request to ensure match is created in the correct league
    match.league_id = league_id
    
    db_match = crud.create_league_match(db, match)
    if not db_match:
        raise HTTPException(status_code=400, detail="Failed to create match. Teams may not be in the league")
    
    return db_match

@app.get("/leagues/{league_id}/matches", response_model=List[models.Match])
def get_matches_in_league(
    league_id: int, 
    jornada: Optional[int] = None, 
    db: Session = Depends(get_db)
):
    return crud.get_league_matches(db, league_id, jornada)

@app.post("/leagues/{league_id}/update-podium")
def update_league_podium(league_id: int, db: Session = Depends(get_db)):
    # Verify league exists
    league = crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    updated_league = crud.update_league_podium(db, league_id)
    if not updated_league:
        raise HTTPException(status_code=400, detail="Failed to update podium. Not enough teams or matches")
    
    return {"message": "League podium updated successfully", "league": updated_league}


# Este endpoint permite obtener todas las ligas creadas por un equipo específico
@app.get("/teams/{team_id}/leagues", response_model=List[models.League])
def get_team_leagues(team_id: int, active_only: bool = False, db: Session = Depends(get_db)):
    # Verificar que el equipo existe
    team = db.query(schemas.Team).filter(schemas.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # Obtener ligas donde este equipo es el creador
    return crud.get_leagues(db, active_only=active_only, creator_id=team_id)