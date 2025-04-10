"""
Módulo para realizar web scraping de calendarios de ligas predefinidas.
"""
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from urllib.parse import urlparse

# Configurar logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CalendarScraper:
    """Clase para extraer calendarios de ligas desde fuentes externas"""
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """
        Valida si una URL es compatible con nuestro scraper
        
        Args:
            url: URL del calendario externo
            
        Returns:
            bool: True si la URL es válida y compatible
        """
        try:
            parsed_url = urlparse(url)
            valid_domains = [
                'www.flashscore.com', 
                'www.marca.com',
                'www.as.com',
                'www.sportingnews.com',
                'www.fcstats.com'
            ]
            
            return parsed_url.netloc in valid_domains and parsed_url.scheme in ['http', 'https']
        except Exception as e:
            logger.error(f"Error validando URL: {str(e)}")
            return False
    
    @staticmethod
    def detect_source(url: str) -> str:
        """
        Detecta la fuente del calendario basado en la URL
        
        Args:
            url: URL del calendario externo
            
        Returns:
            str: Nombre de la fuente ('flashscore', 'marca', etc.)
        """
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()
        
        if 'flashscore' in domain:
            return 'flashscore'
        elif 'marca.com' in domain:
            return 'marca'
        elif 'as.com' in domain:
            return 'as'
        elif 'sportingnews' in domain:
            return 'sportingnews'
        elif 'fcstats' in domain:
            return 'fcstats'
        else:
            return 'unknown'
    
    @staticmethod
    def fetch_calendar(url: str) -> Optional[List[Dict[str, Any]]]:
        """
        Obtiene el calendario desde una URL externa
        
        Args:
            url: URL del calendario externo
            
        Returns:
            List[Dict[str, Any]]: Lista de partidos con formato estandarizado
        """
        if not CalendarScraper.validate_url(url):
            logger.error(f"URL inválida o no compatible: {url}")
            return None
        
        source = CalendarScraper.detect_source(url)
        
        try:
            # Headers para simular un navegador
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()  # Lanzar excepción si hay error HTTP
            
            # Seleccionar el método de scraping según la fuente
            if source == 'flashscore':
                return CalendarScraper._parse_flashscore(response.text)
            elif source == 'marca':
                return CalendarScraper._parse_marca(response.text)
            elif source == 'as':
                return CalendarScraper._parse_as(response.text)
            elif source == 'sportingnews':
                return CalendarScraper._parse_sportingnews(response.text)
            elif source == 'fcstats':
                return CalendarScraper._parse_fcstats(response.text)
            else:
                logger.error(f"Fuente no compatible: {source}")
                return None
        
        except requests.RequestException as e:
            logger.error(f"Error al obtener calendario desde {url}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error procesando datos de {url}: {str(e)}")
            return None
    
    @staticmethod
    def _parse_flashscore(html_content: str) -> List[Dict[str, Any]]:
        """
        Parsea el calendario de FlashScore
        
        Args:
            html_content: Contenido HTML de la página
            
        Returns:
            List[Dict[str, Any]]: Lista de partidos con formato estandarizado
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        matches = []
        
        try:
            # Obtener todas las jornadas/días
            rounds = soup.select('div.sportName.soccer div.event__round')
            
            # Para cada jornada, obtener sus partidos
            current_jornada = 1
            
            for round_elem in rounds:
                jornada_text = round_elem.text.strip()
                
                # Intentar extraer el número de jornada
                try:
                    # Formato típico: "Round 1" o "Jornada 1"
                    jornada_num = int(''.join(filter(str.isdigit, jornada_text)))
                    current_jornada = jornada_num
                except ValueError:
                    # Si no podemos extraer el número, usamos el contador
                    pass
                
                # Obtener los partidos de esta jornada
                match_elements = soup.select(f'div.sportName.soccer div.event__round:contains("{jornada_text}") + div.event__match')
                
                for match_elem in match_elements:
                    try:
                        date_str = match_elem.select_one('div.event__time').text.strip()
                        home_team = match_elem.select_one('div.event__participant--home').text.strip()
                        away_team = match_elem.select_one('div.event__participant--away').text.strip()
                        
                        # Intentar parsear la fecha y hora
                        try:
                            match_date = datetime.strptime(date_str, '%d.%m. %H:%M')
                            # Agregar el año actual
                            match_date = match_date.replace(year=datetime.now().year)
                        except ValueError:
                            match_date = None
                        
                        # Crear diccionario del partido
                        match_data = {
                            'jornada': current_jornada,
                            'home_team': home_team,
                            'away_team': away_team,
                            'date': match_date.date().isoformat() if match_date else None,
                            'time': match_date.strftime('%H:%M') if match_date else None,
                            'venue': None  # FlashScore normalmente no muestra el estadio en la lista
                        }
                        
                        matches.append(match_data)
                    except Exception as e:
                        logger.warning(f"Error procesando partido en FlashScore: {str(e)}")
                        continue
                
                # Incrementar el contador de jornadas
                current_jornada += 1
        
        except Exception as e:
            logger.error(f"Error parseando FlashScore: {str(e)}")
        
        return matches
    
    @staticmethod
    def _parse_marca(html_content: str) -> List[Dict[str, Any]]:
        """Parsea el calendario de Marca"""
        soup = BeautifulSoup(html_content, 'html.parser')
        matches = []
        
        try:
            # Implementar según la estructura de MARCA
            # Ejemplo simplificado, ajustar según HTML real
            jornada_elements = soup.select('div.jornada')
            
            for jornada_idx, jornada_elem in enumerate(jornada_elements, 1):
                jornada_title = jornada_elem.select_one('h2').text.strip()
                jornada_num = jornada_idx
                
                # Intentar extraer el número de jornada del título
                try:
                    jornada_num = int(''.join(filter(str.isdigit, jornada_title)))
                except ValueError:
                    pass
                
                match_elements = jornada_elem.select('div.partido')
                
                for match_elem in match_elements:
                    try:
                        home_team = match_elem.select_one('span.local').text.strip()
                        away_team = match_elem.select_one('span.visitante').text.strip()
                        date_elem = match_elem.select_one('span.fecha')
                        time_elem = match_elem.select_one('span.hora')
                        
                        date_str = date_elem.text.strip() if date_elem else None
                        time_str = time_elem.text.strip() if time_elem else None
                        
                        # Crear diccionario del partido
                        match_data = {
                            'jornada': jornada_num,
                            'home_team': home_team,
                            'away_team': away_team,
                            'date': date_str,
                            'time': time_str,
                            'venue': None
                        }
                        
                        matches.append(match_data)
                    except Exception as e:
                        logger.warning(f"Error procesando partido en Marca: {str(e)}")
                        continue
        
        except Exception as e:
            logger.error(f"Error parseando Marca: {str(e)}")
        
        return matches
    
    @staticmethod
    def _parse_as(html_content: str) -> List[Dict[str, Any]]:
        """Parsea el calendario de AS"""
        # Implementar según la estructura de AS.com
        # Estructura similar a la de _parse_marca
        return []
    
    @staticmethod
    def _parse_sportingnews(html_content: str) -> List[Dict[str, Any]]:
        """Parsea el calendario de Sporting News"""
        # Implementar según la estructura de SportingNews
        return []
    
    @staticmethod
    def _parse_fcstats(html_content: str) -> List[Dict[str, Any]]:
        """Parsea el calendario de FCStats"""
        # Implementar según la estructura de FCStats
        return []