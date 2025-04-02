import random
from typing import Dict, List

class MatchSimulator:
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
        return random.choice(self.formation_styles[formation])

    def generate_attack(self) -> str:
        return f"{random.randint(0, 99)}-{random.randint(0, 99)}-{random.randint(0, 99)}"
    
    def generate_pre_match_data(self, home_team: str, away_team: str) -> Dict:
        """Generate only pre-match data without calculating shots, possession, or goals."""
        home_formation = self.generate_formation()
        away_formation = self.generate_formation()
        
        home_style = self.generate_style(home_formation)
        away_style = self.generate_style(away_formation)
        
        home_attack = self.generate_attack()
        away_attack = self.generate_attack()
        
        home_kicks = random.choice(self.kicks)
        away_kicks = random.choice(self.kicks)
        
        return {
            "jornada": 1,
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
            # Set default values for post-match data (to be filled later)
            "home_possession": None,
            "away_possession": None,
            "home_shots": None,
            "away_shots": None,
            "home_goals": None,
            "away_goals": None
        }


class TournamentSimulator:
    def __init__(self):
        self.match_simulator = MatchSimulator()
    
    def generate_fixture(self, teams: List[str], jornadas: int = 42, matches_per_jornada: int = 10) -> List[Dict]:
        if len(teams) < 2:
            raise ValueError("Se necesitan al menos 2 equipos para generar un fixture")
            
        all_matches = []
        team_pairs = []
        
        for i in range(len(teams)):
            for j in range(i+1, len(teams)):
                team_pairs.append((teams[i], teams[j]))
                team_pairs.append((teams[j], teams[i]))
        
        random.shuffle(team_pairs)
        
        for jornada in range(1, jornadas + 1):
            jornada_matches = []
            matches_to_assign = min(matches_per_jornada, len(team_pairs))
            
            for _ in range(matches_to_assign):
                if not team_pairs:
                    break
                    
                home, away = team_pairs.pop()
                match_data = self.match_simulator.generate_pre_match_data(home, away)
                match_data.update({
                    "jornada": jornada,
                    "home_team": home,
                    "away_team": away
                })
                jornada_matches.append(match_data)
            
            all_matches.extend(jornada_matches)
        
        return all_matches