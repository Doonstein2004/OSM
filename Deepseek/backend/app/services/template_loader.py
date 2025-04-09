import json
import os
from typing import Dict, List, Any, Optional, Tuple
from sqlalchemy.orm import Session

from ..models.leagues import LeagueCreate
from ..models.teams import TeamCreate
from ..schemas.leagues import League
from ..schemas.teams import Team
from ..crud import leagues as leagues_crud
from ..crud import teams as teams_crud

class LeagueTemplateLoader:
    """Clase para cargar y gestionar plantillas de ligas desde archivos JSON"""
    
    def __init__(self, templates_dir: str = "templates"):
        self.templates_dir = templates_dir
        self.templates_cache = {}
        
        # Asegurar que existe el directorio
        os.makedirs(templates_dir, exist_ok=True)
    
    def load_template(self, template_name: str) -> Dict[str, Any]:
        """
        Carga una plantilla desde un archivo JSON
        
        Args:
            template_name: Nombre de la plantilla (sin extensión)
        
        Returns:
            Diccionario con los datos de la plantilla
            
        Raises:
            ValueError: Si la plantilla no existe o tiene formato inválido
        """
        if template_name in self.templates_cache:
            return self.templates_cache[template_name]
            
        file_path = os.path.join(self.templates_dir, f"{template_name}.json")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                template_data = json.load(f)
                self.templates_cache[template_name] = template_data
                return template_data
        except FileNotFoundError:
            raise ValueError(f"Template file {file_path} not found")
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON in template file {file_path}")
    
    def get_leagues_by_type(self, template_name: str, league_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Obtiene todas las ligas de un tipo específico de la plantilla
        
        Args:
            template_name: Nombre de la plantilla
            league_type: Tipo de liga a filtrar (opcional)
            
        Returns:
            Lista de ligas que coinciden con el tipo
        """
        template = self.load_template(template_name)
        
        result = []
        for league_name, league_data in template.items():
            if league_type is None or league_data.get("type") == league_type:
                # Añadir el nombre de la liga a los datos
                league_info = {**league_data, "name": league_name}
                result.append(league_info)
        
        return result
    
    def get_league_by_name(self, template_name: str, league_name: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene una liga específica por su nombre
        
        Args:
            template_name: Nombre de la plantilla
            league_name: Nombre de la liga
            
        Returns:
            Datos de la liga o None si no existe
        """
        template = self.load_template(template_name)
        
        if league_name in template:
            # Añadir el nombre de la liga a los datos
            return {**template[league_name], "name": league_name}
        
        return None
    
    def create_league_from_template(
        self, 
        db: Session, 
        template_name: str, 
        league_name: str, 
        tipo_liga: str,
        manager_id: str,
        manager_name: str
    ) -> Tuple[League, List[Team]]:
        """
        Crea una liga y sus equipos a partir de una plantilla
        
        Args:
            db: Sesión de base de datos
            template_name: Nombre de la plantilla
            league_name: Nombre de la liga en la plantilla
            tipo_liga: Tipo de liga a crear
            manager_id: ID del manager que crea la liga
            manager_name: Nombre del manager
            
        Returns:
            Tupla con (liga creada, lista de equipos creados)
            
        Raises:
            ValueError: Si la liga no existe en la plantilla
        """
        # Obtener datos de la liga
        league_data = self.get_league_by_name(template_name, league_name)
        if not league_data:
            raise ValueError(f"League {league_name} not found in template {template_name}")
        
        # Calcular estadísticas de valor
        teams_data = league_data.get("teams", [])
        team_values = []
        lowest_value = float('inf')
        highest_value = 0
        lowest_value_team = None
        highest_value_team = None
        
        for team in teams_data:
            value_str = team.get("value", "0")
            # Convertir valor (ejemplo: "30,3M") a un número
            value_num = self._parse_value(value_str)
            team_values.append(value_num)
            
            if value_num < lowest_value:
                lowest_value = value_num
                lowest_value_team = team
            
            if value_num > highest_value:
                highest_value = value_num
                highest_value_team = team
        
        avg_value = sum(team_values) / len(team_values) if team_values else 0
        value_difference = highest_value - lowest_value
        
        # Crear primero los equipos
        created_teams = []
        for team_data in teams_data:
            team_create = TeamCreate(
                name=team_data["name"],
                value=team_data.get("value"),
                # No asignar manager ni clan aquí, se hará después
            )
            
            # Verificar si el equipo ya existe
            existing_team = teams_crud.get_team_by_name(db, team_data["name"])
            if existing_team:
                # Actualizar valor si es necesario
                if existing_team.value != team_data.get("value"):
                    existing_team.value = team_data.get("value")
                    db.commit()
                created_teams.append(existing_team)
            else:
                # Crear nuevo equipo
                new_team = teams_crud.create_team(db, team_create)
                created_teams.append(new_team)
        
        # Crear la liga
        league_create = LeagueCreate(
            name=league_name,
            country=league_data.get("country"),
            tipo_liga=tipo_liga,
            league_type=league_data.get("type", "League"),
            max_teams=league_data.get("team_count", len(teams_data)),
            jornadas=league_data.get("jornadas", 38),  # Valor por defecto
            manager_id=manager_id,
            manager_name=manager_name,
            active=True,
            highest_value_team_id=next((t.id for t in created_teams if t.name == highest_value_team["name"]), None) if highest_value_team else None,
            lowest_value_team_id=next((t.id for t in created_teams if t.name == lowest_value_team["name"]), None) if lowest_value_team else None,
            avg_team_value=avg_value,
            value_difference=value_difference
        )
        
        created_league = leagues_crud.create_league(db, league_create)
        
        # Asociar equipos a la liga
        for team in created_teams:
            leagues_crud.add_team_to_league(db, {
                "league_id": created_league.id,
                "team_id": team.id
            })
        
        return created_league, created_teams
    
    @staticmethod
    def _parse_value(value_str: str) -> float:
        """
        Convierte una cadena de valor (ej: "30,3M") a un número
        
        Args:
            value_str: Cadena con el valor (ej: "30,3M")
            
        Returns:
            Valor numérico
        """
        try:
            # Eliminar espacios y convertir comas a puntos
            clean_str = value_str.replace(" ", "").replace(",", ".")
            
            # Extraer el multiplicador (M, K, etc.)
            multiplier = 1
            if clean_str.endswith("M"):
                multiplier = 1000000
                clean_str = clean_str[:-1]
            elif clean_str.endswith("K"):
                multiplier = 1000
                clean_str = clean_str[:-1]
            
            # Convertir a número y aplicar multiplicador
            return float(clean_str) * multiplier
        except (ValueError, AttributeError):
            return 0