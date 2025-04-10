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
        jornadas: Optional[int] = None,
        matches_per_jornada: Optional[int] = None,
        simulate_results: bool = False,
        team_strengths: Optional[Dict[str, float]] = None
    ) -> List[Dict]:
        """
        Genera el fixture (calendario) de partidos para un torneo
        
        Args:
            teams: Lista de nombres de equipos
            jornadas: Número de jornadas (opcional, se calcula automáticamente si es None)
            matches_per_jornada: Número de partidos por jornada (opcional, se calcula como equipos/2)
            simulate_results: Si se deben simular resultados o solo datos pre-partido
            team_strengths: Diccionario de fortalezas de equipos (opcional)
        
        Returns:
            Lista de partidos generados
        """
        if len(teams) < 2:
            raise ValueError("Se necesitan al menos 2 equipos para generar un fixture")
        
        # Calcular automáticamente los valores si no se proporcionan
        n_teams = len(teams)
        required_jornadas = 2 * (n_teams - 1)  # Ida y vuelta
        matches_per_round = n_teams // 2
        
        if jornadas is None:
            jornadas = required_jornadas
        else:
            jornadas = min(jornadas, required_jornadas)
        
        if matches_per_jornada is None:
            matches_per_jornada = matches_per_round
        
        # Crear un número par de equipos añadiendo uno ficticio si es necesario
        has_dummy = False
        teams_copy = teams.copy()
        if len(teams_copy) % 2 == 1:
            teams_copy.append("Dummy")  # Equipo ficticio para hacer par
            has_dummy = True
        
        n = len(teams_copy)
        fixtures = []
        
        # Implementación del algoritmo de rotación circular
        # Un equipo fijo y los demás rotan
        for round_num in range(n - 1):
            round_fixtures = []
            for i in range(n // 2):
                team1 = teams_copy[i]
                team2 = teams_copy[n - 1 - i]
                
                # Saltar partidos con el equipo ficticio
                if has_dummy and (team1 == "Dummy" or team2 == "Dummy"):
                    continue
                
                # En rounds alternos, intercambiar local y visitante
                if round_num % 2 == 0:
                    round_fixtures.append((team1, team2, round_num + 1))
                else:
                    round_fixtures.append((team2, team1, round_num + 1))
            
            fixtures.extend(round_fixtures)
            
            # Rotar equipos para la siguiente jornada: el primero se queda fijo, el resto rota
            teams_copy = [teams_copy[0]] + [teams_copy[-1]] + teams_copy[1:-1]
        
        # Crear partidos de vuelta (invertir local/visitante)
        first_leg_count = len(fixtures)
        for i in range(first_leg_count):
            home, away, round_num = fixtures[i]
            # La vuelta va después de todas las jornadas de ida
            fixtures.append((away, home, round_num + (n - 1)))
        
        # Limitar al número de jornadas solicitado
        fixtures = [f for f in fixtures if f[2] <= jornadas]
        
        # Convertir fixtures a objetos de partido
        all_matches = []
        for home, away, jornada_num in fixtures:
            if simulate_results:
                match_data = self.match_simulator.simulate_match(home, away, team_strengths)
            else:
                match_data = self.match_simulator.generate_pre_match_data(home, away)
            
            match_data.update({
                "jornada": jornada_num,
                "home_team": home,
                "away_team": away
            })
            
            all_matches.append(match_data)
        
        # Verificación de integridad de datos
        expected_matches = n_teams * (n_teams - 1)
        if jornadas < required_jornadas:
            expected_matches = (jornadas * n_teams) // 2
        
        if len(all_matches) != expected_matches:
            print(f"Advertencia: Se generaron {len(all_matches)} partidos, esperados {expected_matches}")
        
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
        jornadas: Optional[int] = None, 
        balance_teams: bool = True
    ) -> Tuple[List[Dict], Dict[str, Dict]]:
        """
        Simula una liga completa con partidos y resultados
        
        Args:
            teams: Lista de nombres de equipos
            jornadas: Número de jornadas (opcional, se calcula automáticamente si es None)
            balance_teams: Si se deben balancear automáticamente las fortalezas de los equipos
        
        Returns:
            Tupla con (lista de partidos, tabla de posiciones)
        """
        # Generar fortalezas de equipos
        team_strengths = self.auto_balance_teams(teams) if balance_teams else None
        
        # Calcular número de partidos por jornada
        matches_per_jornada = len(teams) // 2
        
        # Generar fixtures con resultados
        matches = self.generate_fixture(
            teams=teams,
            jornadas=jornadas,
            matches_per_jornada=matches_per_jornada,
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