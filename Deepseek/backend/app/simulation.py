import random
from typing import Dict, List, Tuple
import numpy as np

class MatchSimulator:
    def __init__(self):
        self.formations = {
            'common': ['433A', '433B', '442A', '442B', '451', '4231', '541A', '541B', '631A', '631B', '532', '523A', '523B', '5311'],
            'uncommon': ['334A', '334B', '352'],
            'rare': ['3322', '325']
        }
        
        self.styles = ['Bandas', 'Pases', 'Contraataque', 'Disparos', 'Balones Largos']
        self.kicks = ['Cuidado', 'Normal', 'Agresivo', 'Duro']
        self.supports = ['Medios a Defensa', 'Delanteros Bajan', 'Empujar hacia Adelante']
    
    def generate_formation(self) -> str:
        # Probabilidades: 80% comunes, 15% poco comunes, 5% raras
        choice = random.choices(
            ['common', 'uncommon', 'rare'],
            weights=[0.8, 0.15, 0.05],
            k=1
        )[0]
        return random.choice(self.formations[choice])
    
    def generate_attack(self) -> str:
        return f"{random.randint(0, 99)}-{random.randint(0, 99)}-{random.randint(0, 99)}"
    
    def simulate_match(self, home_team: str, away_team: str) -> Dict:
        home_formation = self.generate_formation()
        away_formation = self.generate_formation()
        
        home_style = random.choice(self.styles)
        away_style = random.choice(self.styles)
        
        home_attack = self.generate_attack()
        away_attack = self.generate_attack()
        
        home_kicks = random.choice(self.kicks)
        away_kicks = random.choice(self.kicks)
        
        # La posesión debe sumar 100 entre ambos equipos
        home_possession = random.randint(40, 65)
        away_possession = 100 - home_possession
        
        # Los disparos y goles dependen de varios factores
        home_shots = self.calculate_shots(home_formation, home_style, home_attack)
        away_shots = self.calculate_shots(away_formation, away_style, away_attack)
        
        home_goals = self.calculate_goals(home_shots, home_style, away_formation)
        away_goals = self.calculate_goals(away_shots, away_style, home_formation)
        
        return {
            "alineacion_local": home_formation,
            "estilo_local": home_style,
            "avanzadas_local": home_attack,
            "patadas_local": home_kicks,
            "posesion_local": home_possession,
            "disparos_local": home_shots,
            "goles_local": home_goals,
            "alineacion_visitante": away_formation,
            "estilo_visitante": away_style,
            "avanzadas_visitante": away_attack,
            "patadas_visitante": away_kicks,
            "posesion_visitante": away_possession,
            "disparos_visitante": away_shots,
            "goles_visitante": away_goals
        }
    
    def calculate_shots(self, formation: str, style: str, attack: str) -> int:
        """Calcula la cantidad de disparos basado en formación, estilo y avanzadas"""
        base_shots = 5
        
        # Ajuste por formación
        if '3' in formation[0]:  # Si tiene 3 delanteros
            base_shots += 2
        elif '2' in formation[0]:  # Si tiene 2 delanteros
            base_shots += 1
        elif '1' in formation[0]:  # Si tiene 1 delantero
            base_shots -= 1
            
        # Ajuste por estilo
        if style == 'Disparos':
            base_shots += 3
        elif style == 'Contraataque':
            base_shots += 1
            
        # Ajuste por avanzadas (tomamos el primer valor)
        attack_forward = int(attack.split('-')[0])
        base_shots += attack_forward // 30
        
        # Variación aleatoria
        base_shots += random.randint(-2, 2)
        
        return max(1, base_shots)
    
    def calculate_goals(self, shots: int, style: str, opponent_formation: str) -> int:
        """Calcula la cantidad de goles basado en disparos y otros factores"""
        conversion_rate = 0.12  # Tasa base de conversión
        
        # Ajuste por estilo
        if style == 'Disparos':
            conversion_rate *= 1.3
        elif style == 'Balones Largos':
            conversion_rate *= 0.9
            
        # Ajuste por formación contraria (defensivas tienen menos goles)
        if '5' in opponent_formation or '6' in opponent_formation:
            conversion_rate *= 0.8
            
        # Calcular goles esperados
        expected_goals = shots * conversion_rate
        
        # Redondear con cierta aleatoriedad
        goals = round(expected_goals)
        if random.random() < (expected_goals - goals):  # Para manejar decimales
            goals += 1
            
        # Asegurarnos de que no haya más goles que disparos
        return min(goals, shots)

class TournamentSimulator:
    def __init__(self):
        self.match_simulator = MatchSimulator()
    
    def generate_fixture(self, teams: List[str], jornadas: int = 42, matches_per_jornada: int = 10) -> List[Dict]:
        if len(teams) < 2:
            raise ValueError("Se necesitan al menos 2 equipos para generar un fixture")
            
        all_matches = []
        team_pairs = []
        
        # Generar todos los posibles emparejamientos
        for i in range(len(teams)):
            for j in range(i+1, len(teams)):
                team_pairs.append((teams[i], teams[j]))
                team_pairs.append((teams[j], teams[i]))  # Partido de vuelta
        
        # Mezclar los emparejamientos
        random.shuffle(team_pairs)
        
        # Dividir en jornadas
        for jornada in range(1, jornadas + 1):
            jornada_matches = []
            matches_to_assign = min(matches_per_jornada, len(team_pairs))
            
            for _ in range(matches_to_assign):
                if not team_pairs:
                    break
                    
                home, away = team_pairs.pop()
                match_data = self.match_simulator.simulate_match(home, away)
                match_data.update({
                    "jornada": jornada,
                    "home_team": home,
                    "away_team": away
                })
                jornada_matches.append(match_data)
            
            all_matches.extend(jornada_matches)
        
        return all_matches