## routers/analytics.py

from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import leagues as leagues_crud

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    responses={404: {"description": "Not found"}},
)

@router.get("/leagues/{league_id}")
def get_league_analytics(league_id: int, db: Session = Depends(get_db)):
    """
    Obtiene análisis detallado de una liga
    
    Incluye estadísticas de equipos, formaciones, estilos, resultados, etc.
    """
    # Verificar que la liga existe
    league = leagues_crud.get_league(db, league_id)
    if not league:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    # Obtener estadísticas de la liga
    statistics = leagues_crud.calculate_league_statistics(db, league_id)
    if not statistics:
        raise HTTPException(status_code=404, detail="No hay estadísticas disponibles para esta liga")
    
    return statistics

@router.get("")
def get_global_analytics(db: Session = Depends(get_db)):
    """
    Obtiene análisis global de todas las ligas
    
    Incluye estadísticas agregadas de todas las ligas
    """
    # Obtener todas las ligas
    leagues = leagues_crud.get_leagues(db)
    
    # Inicializar estadísticas globales
    global_stats = {
        "total_leagues": len(leagues),
        "active_leagues": 0,
        "total_teams": 0,
        "total_matches": 0,
        "total_goals": 0,
        "avg_goals_per_match": 0,
        "leagues_by_type": {},
        "most_common_formations": {},
        "most_common_styles": {}
    }
    
    # Calcular estadísticas para cada liga
    all_formations = {}
    all_styles = {}
    total_goals = 0
    total_matches_played = 0
    
    for league in leagues:
        # Contar ligas activas
        if league.active:
            global_stats["active_leagues"] += 1
        
        # Contar equipos
        global_stats["total_teams"] += league.teams_count
        
        # Contar por tipo
        liga_type = str(league.tipo_liga)
        global_stats["leagues_by_type"][liga_type] = global_stats["leagues_by_type"].get(liga_type, 0) + 1
        
        # Obtener estadísticas de la liga
        stats = leagues_crud.calculate_league_statistics(db, league.id)
        if stats:
            # Sumar goles y partidos
            total_goals += stats["total_goals"]
            matches_played = int(stats["total_goals"] / stats["avg_goals_per_match"]) if stats["avg_goals_per_match"] > 0 else 0
            total_matches_played += matches_played
            global_stats["total_matches"] += matches_played
            
            # Actualizar formaciones
            if stats["most_common_formation"]:
                all_formations[stats["most_common_formation"]] = all_formations.get(stats["most_common_formation"], 0) + 1
            
            # Actualizar estilos
            if stats["most_common_style"]:
                all_styles[stats["most_common_style"]] = all_styles.get(stats["most_common_style"], 0) + 1
    
    # Calcular promedio global de goles por partido
    global_stats["avg_goals_per_match"] = total_goals / total_matches_played if total_matches_played > 0 else 0
    
    # Ordenar formaciones y estilos por popularidad
    global_stats["most_common_formations"] = dict(sorted(all_formations.items(), key=lambda x: x[1], reverse=True)[:5])
    global_stats["most_common_styles"] = dict(sorted(all_styles.items(), key=lambda x: x[1], reverse=True)[:5])
    
    return global_stats