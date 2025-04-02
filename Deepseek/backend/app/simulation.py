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
    
    def simulate_match(self, home_team: str, away_team: str) -> Dict:
        home_formation = self.generate_formation()
        away_formation = self.generate_formation()
        
        home_style = self.generate_style(home_formation)
        away_style = self.generate_style(away_formation)
        
        home_attack = self.generate_attack()
        away_attack = self.generate_attack()
        
        home_kicks = random.choice(self.kicks)
        away_kicks = random.choice(self.kicks)
        
        home_possession = random.randint(40, 65)
        away_possession = 100 - home_possession
        
        home_shots = self.calculate_shots(home_formation, home_style, home_attack)
        away_shots = self.calculate_shots(away_formation, away_style, away_attack)
        
        home_goals = self.calculate_goals(home_shots, home_style, away_formation)
        away_goals = self.calculate_goals(away_shots, away_style, home_formation)
        
        return {
            "jornada": 1,
            "home_team": home_team,
            "away_team": away_team,
            "home_formation": home_formation,
            "home_style": home_style,
            "home_attack": home_attack,
            "home_kicks": home_kicks,
            "home_possession": home_possession,
            "home_shots": home_shots,
            "home_goals": home_goals,
            "away_formation": away_formation,
            "away_style": away_style,
            "away_attack": away_attack,
            "away_kicks": away_kicks,
            "away_possession": away_possession,
            "away_shots": away_shots,
            "away_goals": away_goals
        }

    def calculate_shots(self, formation: str, style: str, attack: str) -> int:
        base_shots = 5
        
        if '3' in formation[0]:
            base_shots += 2
        elif '2' in formation[0]:
            base_shots += 1
        elif '1' in formation[0]:
            base_shots -= 1
            
        if style == 'Disparos':
            base_shots += 3
        elif style == 'Contraataque':
            base_shots += 1
            
        attack_forward = int(attack.split('-')[0])
        base_shots += attack_forward // 30
        
        base_shots += random.randint(-2, 2)
        return max(1, base_shots)
    
    def calculate_goals(self, shots: int, style: str, opponent_formation: str) -> int:
        conversion_rate = 0.12
        
        if style == 'Disparos':
            conversion_rate *= 1.3
        elif style == 'Balones Largos':
            conversion_rate *= 0.9
            
        if '5' in opponent_formation or '6' in opponent_formation:
            conversion_rate *= 0.8
            
        expected_goals = shots * conversion_rate
        goals = round(expected_goals)
        
        if random.random() < (expected_goals - goals):
            goals += 1
            
        return min(goals, shots)

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
                match_data = self.match_simulator.simulate_match(home, away)
                match_data.update({
                    "jornada": jornada,
                    "home_team": home,
                    "away_team": away
                })
                jornada_matches.append(match_data)
            
            all_matches.extend(jornada_matches)
        
        return all_matches