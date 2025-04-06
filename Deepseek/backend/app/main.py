from fastapi import FastAPI, HTTPException, Depends, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import joinedload
import os, json
from datetime import datetime
import urllib.parse

from . import models, schemas, crud, simulation
from .database import SessionLocal, engine
from .league_templates import LeagueTemplateLoader

schemas.Base.metadata.create_all(bind=engine)

# Inicializar el loader de plantillas
template_loader = LeagueTemplateLoader()

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
def update_team(team_id: int, team_data: models.TeamUpdate, db: Session = Depends(get_db)):
    db_team = crud.get_team(db, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    updated_team = crud.update_team(db, team_id, team_data)
    return updated_team

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
    manager_id: Optional[str] = None,  # Parámetro actualizado
    db: Session = Depends(get_db)
):
    return crud.get_leagues(db, skip=skip, limit=limit, active_only=active_only, manager_id=manager_id)

# Este endpoint permite obtener todas las ligas creadas por un manager específico
@app.get("/managers/{manager_id}/leagues", response_model=List[models.League])
def get_manager_leagues(manager_id: str, active_only: bool = False, db: Session = Depends(get_db)):
    return crud.get_manager_leagues(db, manager_id, active_only=active_only)

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
        teams=teams,
        creator={
            "id": db_league.manager_id,
            "name": db_league.manager_name
        } if db_league.manager_id or db_league.manager_name else None
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
    
    # Verificar que haya equipos en la solicitud
    if not request.teams or len(request.teams) < 2:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 2 equipos para simular una liga")
    
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


@app.post("/templates/upload")
async def upload_template(
    template_name: str,
    file: UploadFile,
    db: Session = Depends(get_db)
):
    """Sube un nuevo archivo JSON de plantillas de ligas"""
    try:
        # Guardar el archivo
        file_path = os.path.join(template_loader.templates_dir, f"{template_name}.json")
        
        # Leer el contenido del archivo
        content = await file.read()
        
        # Verificar que sea un JSON válido
        try:
            json_data = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON file")
        
        # Guardar el archivo
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Actualizar la caché
        template_loader.templates_cache[template_name] = json_data
        
        # Contar ligas en el archivo
        league_count = len(json_data)
        
        return {
            "detail": f"Template uploaded successfully with {league_count} leagues",
            "template_name": template_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading template: {str(e)}")
    
    
# Endpoint para listar todas las plantillas disponibles
@app.get("/templates")
def list_templates():
    """Lista todas las plantillas disponibles"""
    try:
        templates = []
        for filename in os.listdir(template_loader.templates_dir):
            if filename.endswith(".json"):
                template_name = filename[:-5]  # Eliminar extensión .json
                templates.append(template_name)
        
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing templates: {str(e)}")

# Endpoint para listar todas las ligas en una plantilla
@app.get("/templates/{template_name}/leagues")
def list_template_leagues(
    template_name: str,
    type: Optional[str] = None,
    min_teams: Optional[int] = None,
    max_teams: Optional[int] = None,
    search: Optional[str] = None
):
    """Lista todas las ligas en una plantilla con filtros opcionales"""
    try:
        # Obtener ligas por tipo (si se especificó)
        leagues = template_loader.get_leagues_by_type(template_name, type)
        
        # Aplicar filtros adicionales
        filtered_leagues = []
        for league in leagues:
            # Filtrar por número de equipos
            team_count = league.get("team_count", len(league.get("teams", [])))
            if min_teams is not None and team_count < min_teams:
                continue
            if max_teams is not None and team_count > max_teams:
                continue
            
            # Filtrar por búsqueda de texto
            if search and search.lower() not in league["name"].lower():
                continue
            
            filtered_leagues.append({
                "name": league["name"],
                "type": league.get("type", "League"),
                "team_count": team_count,
                # Información de valor si está disponible
                "team_values": [team.get("value") for team in league.get("teams", [])]
            })
        
        return {"leagues": filtered_leagues}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing leagues: {str(e)}")

# Endpoint para obtener detalles de una liga específica
@app.get("/templates/{template_name}/leagues/{league_name:path}")
def get_template_league(template_name: str, league_name: str):
    """Obtiene los detalles de una liga específica de una plantilla"""
    try:
        # Decodificar el nombre de la liga para manejar caracteres especiales
        decoded_league_name = urllib.parse.unquote(league_name)
        
        league = template_loader.get_league_by_name(template_name, decoded_league_name)
        if not league:
            raise HTTPException(status_code=404, detail=f"League {decoded_league_name} not found in template {template_name}")
        
        return league
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting league: {str(e)}")

# Endpoint para crear una liga a partir de una plantilla
@app.post("/templates/{template_name}/create-league")
def create_league_from_template(
    template_name: str,
    league_select: models.LeagueTemplateSelect,
    db: Session = Depends(get_db)
):
    """Crea una liga a partir de una plantilla"""
    try:
        # Crear liga desde plantilla
        created_league, created_teams = template_loader.create_league_from_template(
            db=db,
            template_name=template_name,
            league_name=league_select.league_name,
            tipo_liga=league_select.tipo_liga,
            manager_id=league_select.manager_id,
            manager_name=league_select.manager_name
        )
        
        return {
            "detail": f"League created successfully with {len(created_teams)} teams",
            "league_id": created_league.id,
            "league_name": created_league.name,
            "teams_count": len(created_teams)
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating league: {str(e)}")