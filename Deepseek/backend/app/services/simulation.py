import random
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

class MatchSimulator:
    """
    Clase para simular partidos de fútbol con comportamientos y resultados realistas
    """
    
    def __init__(self):
        self.formations = {
            'common': ['433A', '433B', '442A', '442B', '451', '4231', '541A', '541B', 
                      '631A', '631B', '532', '523A', '523B', '5311'],
            'uncommon': ['334A', '334B', '352'],  # 0.5% probabilidad
            'rare': ['3322', '325']  # 0.01% probabilidad
        }
        
        self.formation_styles = {
            # Formaciones comunes
            '433A': ['Bandas', 'Pases'],
            '433B': ['Bandas', 'Pases'],
            '442A': ['Bandas', 'Pases'],
            '442B': ['Bandas', 'Pases'],
            '451': ['Disparos'],
            '4231': ['Disparos'],
            '541A': ['Disparos', 'Contraataque'],
            '541B': ['Disparos', 'Contraataque'],
            '631A': ['Contraataque'],
            '631B': ['Contraataque'],
            '532': ['Contraataque'],
            '523A': ['Contraataque'],
            '523B': ['Contraataque'],
            '5311': ['Contraataque'],
            
            # Formaciones poco comunes
            '334A': ['Balones Largos'],
            '334B': ['Balones Largos'],
            '352': ['Disparos'],
            
            # Formaciones raras
            '3322': ['Disparos', 'Balones Largos'],
            '325': ['Balones Largos']
        }
        
        self.kicks = ['Cuidado', 'Normal', 'Agresivo', 'Duro']
        self.supports = ['Medios a Defensa', 'Delanteros Bajan', 'Empujar hacia Adelante']

    def generate_formation(self) -> str:
        """Genera una formación aleatoria basada en las probabilidades definidas"""
        choice = random.choices(
            ['common', 'uncommon', 'rare'],
            weights=[0.8, 0.005, 0.0001],  # 80% - 0.5% - 0.01%
            k=1
        )[0]
        
        try:
            return random.choice(self.formations[choice])
        except IndexError:
            return random.choice(self.formations['common'])

    def generate_style(self, formation: str) -> str:
        """Genera un estilo de juego compatible con la formación dada"""
        return random.choice(self.formation_styles.get(formation, ['Pases']))

    def generate_attack(self) -> str:
        """Genera valores de ataque aleatorios"""
        return f"{random.randint(0, 99)}-{random.randint(0, 99)}-{random.randint(0, 99)}"
    
    def generate_pre_match_data(self, home_team: str, away_team: str) -> Dict[str, Any]:
        """
        Genera datos previos al partido sin calcular resultados
        
        Incluye formaciones, estilos, tácticas pero no resultados finales
        """
        home_formation = self.generate_formation()
        away_formation = self.generate_formation()
        
        home_style = self.generate_style(home_formation)
        away_style = self.generate_style(away_formation)
        
        home_attack = self.generate_attack()
        away_attack = self.generate_attack()
        
        home_kicks = random.choice(self.kicks)
        away_kicks = random.choice(self.kicks)
        
        return {
            "jornada": 1,  # Valor por defecto, se actualiza al asignar
            "home_team": home_team,
            "away_team": away_team,
            "home_formation": home_formation,
            "home_style": home_style,
            "home_attack": home_attack,
            "home_kicks": home_kicks,
            "away_formation": away_formation,
            "away_style": away_style,
            "away_attack": away_attack,
            "away_kicks": away_kicks,
            # Valores para resultados (se calcularán después)
            "home_possession": None,
            "away_possession": None,
            "home_shots": None,
            "away_shots": None,
            "home_goals": None,
            "away_goals": None
        }
    
    def simulate_match(self, home_team: str, away_team: str, team_strengths: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        """
        Simula un partido completo con resultados
        
        Args:
            home_team: Nombre del equipo local
            away_team: Nombre del equipo visitante
            team_strengths: Diccionario con los valores de fuerza de cada equipo (opcional)
        
        Returns:
            Diccionario con todos los datos del partido simulado
        """
        # Generar datos pre-partido
        match_data = self.generate_pre_match_data(home_team, away_team)
        
        # Determinar fortalezas de equipos (equilibradas por defecto)
        home_strength = 1.0
        away_strength = 1.0
        
        if team_strengths:
            home_strength = team_strengths.get(home_team, 1.0)
            away_strength = team_strengths.get(away_team, 1.0)
        
        # Simular posesión
        base_home_possession = random.randint(40, 60)
        possession_modifier = (home_strength - away_strength) * 5  # +/- 5% por punto de diferencia
        home_possession = min(max(int(base_home_possession + possession_modifier), 30), 70)
        away_possession = 100 - home_possession
        
        # Simular tiros
        home_shots_base = int((home_possession / 100) * random.randint(8, 16))
        away_shots_base = int((away_possession / 100) * random.randint(8, 16))
        
        home_shots = max(1, int(home_shots_base * home_strength))
        away_shots = max(1, int(away_shots_base * away_strength))
        
        # Simular goles
        home_conversion_rate = random.uniform(0.1, 0.3) * home_strength
        away_conversion_rate = random.uniform(0.1, 0.3) * away_strength
        
        home_goals = round(home_shots * home_conversion_rate)
        away_goals = round(away_shots * away_conversion_rate)
        
        # Actualizar datos del partido
        match_data.update({
            "home_possession": home_possession,
            "away_possession": away_possession,
            "home_shots": home_shots,
            "away_shots": away_shots,
            "home_goals": home_goals,
            "away_goals": away_goals,
            "simulated_at": datetime.now().isoformat()
        })
        
        return match_data


class TournamentSimulator:
    """
    Clase para simular torneos completos, generando calendarios y resultados
    """
    
    def __init__(self):
        self.match_simulator = MatchSimulator()
    
    def generate_fixture(
        self, 
        teams: List[str], 
        jornadas: int = 42, 
        matches_per_jornada: int = 10,
        simulate_results: bool = False,
        team_strengths: Optional[Dict[str, float]] = None
    ) -> List[Dict]:
        """
        Genera el fixture (calendario) de partidos para un torneo
        
        Args:
            teams: Lista de nombres de equipos
            jornadas: Número máximo de jornadas
            matches_per_jornada: Número máximo de partidos por jornada
            simulate_results: Si se deben simular resultados o solo datos pre-partido
            team_strengths: Diccionario de fortalezas de equipos (opcional)
        
        Returns:
            Lista de partidos generados
        """
        if len(teams) < 2:
            raise ValueError("Se necesitan al menos 2 equipos para generar un fixture")
            
        all_matches = []
        team_pairs = []
        
        # Generar todos los emparejamientos posibles (ida y vuelta)
        for i in range(len(teams)):
            for j in range(i+1, len(teams)):
                team_pairs.append((teams[i], teams[j]))  # Partido de ida
                team_pairs.append((teams[j], teams[i]))  # Partido de vuelta
        
        # Mezclar aleatoriamente
        random.shuffle(team_pairs)
        
        # Asignar los partidos a jornadas
        for jornada in range(1, jornadas + 1):
            jornada_matches = []
            matches_to_assign = min(matches_per_jornada, len(team_pairs))
            
            for _ in range(matches_to_assign):
                if not team_pairs:
                    break
                    
                home, away = team_pairs.pop()
                
                if simulate_results:
                    match_data = self.match_simulator.simulate_match(home, away, team_strengths)
                else:
                    match_data = self.match_simulator.generate_pre_match_data(home, away)
                
                match_data.update({
                    "jornada": jornada,
                    "home_team": home,
                    "away_team": away
                })
                
                jornada_matches.append(match_data)
            
            all_matches.extend(jornada_matches)
        
        return all_matches
    
    def auto_balance_teams(self, teams: List[str]) -> Dict[str, float]:
        """
        Asigna fortalezas balanceadas a los equipos para simulaciones más realistas
        
        Args:
            teams: Lista de nombres de equipos
        
        Returns:
            Diccionario con las fortalezas asignadas a cada equipo
        """
        team_strengths = {}
        
        # Asignar fortalezas aleatorias entre 0.7 y 1.3
        for team in teams:
            team_strengths[team] = random.uniform(0.7, 1.3)
        
        return team_strengths
    
    def simulate_league(
        self, 
        teams: List[str], 
        jornadas: int = 38, 
        balance_teams: bool = True
    ) -> Tuple[List[Dict], Dict[str, Dict]]:
        """
        Simula una liga completa con partidos y resultados
        
        Args:
            teams: Lista de nombres de equipos
            jornadas: Número de jornadas
            balance_teams: Si se deben balancear automáticamente las fortalezas de los equipos
        
        Returns:
            Tupla con (lista de partidos, tabla de posiciones)
        """
        # Generar fortalezas de equipos
        team_strengths = self.auto_balance_teams(teams) if balance_teams else None
        
        # Generar fixtures con resultados
        matches = self.generate_fixture(
            teams=teams,
            jornadas=jornadas,
            matches_per_jornada=len(teams) // 2,
            simulate_results=True,
            team_strengths=team_strengths
        )
        
        # Calcular tabla de posiciones
        standings = self._calculate_standings(matches)
        
        return matches, standings
    
    def _calculate_standings(self, matches: List[Dict]) -> Dict[str, Dict]:
        """
        Calcula la tabla de posiciones a partir de los partidos simulados
        
        Args:
            matches: Lista de partidos con resultados
        
        Returns:
            Diccionario con estadísticas de cada equipo
        """
        standings = {}
        
        # Inicializar estadísticas para cada equipo
        teams = set()
        for match in matches:
            teams.add(match["home_team"])
            teams.add(match["away_team"])
        
        for team in teams:
            standings[team] = {
                "played": 0,
                "won": 0,
                "drawn": 0,
                "lost": 0,
                "goals_for": 0,
                "goals_against": 0,
                "goal_difference": 0,
                "points": 0
            }
        
        # Procesar resultados de partidos
        for match in matches:
            # Omitir partidos sin resultados
            if match["home_goals"] is None or match["away_goals"] is None:
                continue
            
            home_team = match["home_team"]
            away_team = match["away_team"]
            
            # Actualizar partidos jugados
            standings[home_team]["played"] += 1
            standings[away_team]["played"] += 1
            
            # Actualizar goles
            standings[home_team]["goals_for"] += match["home_goals"]
            standings[home_team]["goals_against"] += match["away_goals"]
            standings[away_team]["goals_for"] += match["away_goals"]
            standings[away_team]["goals_against"] += match["home_goals"]
            
            # Actualizar resultados y puntos
            if match["home_goals"] > match["away_goals"]:
                standings[home_team]["won"] += 1
                standings[away_team]["lost"] += 1
                standings[home_team]["points"] += 3
            elif match["home_goals"] < match["away_goals"]:
                standings[home_team]["lost"] += 1
                standings[away_team]["won"] += 1
                standings[away_team]["points"] += 3
            else:
                standings[home_team]["drawn"] += 1
                standings[away_team]["drawn"] += 1
                standings[home_team]["points"] += 1
                standings[away_team]["points"] += 1
        
        # Calcular diferencia de goles
        for team in standings:
            standings[team]["goal_difference"] = standings[team]["goals_for"] - standings[team]["goals_against"]
        
        return standings