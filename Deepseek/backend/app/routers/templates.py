from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import os
import json
import urllib.parse

from ..database import get_db
from ..models.leagues import LeagueTemplateSelect, LeagueCreate, League
from ..services.template_loader import LeagueTemplateLoader

router = APIRouter(
    prefix="/templates",
    tags=["templates"],
    responses={404: {"description": "Not found"}},
)

# Inicializar el loader de plantillas
template_loader = LeagueTemplateLoader()

@router.post("/upload")
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

@router.get("")
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

@router.get("/{template_name}/leagues")
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

@router.get("/{template_name}/leagues/{league_name:path}")
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

@router.post("/{template_name}/create-league")
def create_league_from_template(
    template_name: str,
    league_select: LeagueTemplateSelect,
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