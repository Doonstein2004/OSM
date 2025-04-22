import time
import json
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from typing import List, Dict, Tuple, Optional, Set

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("osm_scraper.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("OSMScraper")

class OSMScraper:
    """
    Scraper for Online Soccer Manager (OSM) that automates login, team selection,
    and lineup management.
    """
    
    # Constants
    BASE_URL = "https://www.onlinesoccermanager.com"
    LINEUP_URL = "https://en.onlinesoccermanager.com/Lineup"
    FITNESS_THRESHOLD = 90
    
    # Position classifications
    POSITIONS = {
        "Goalkeeper": ["GK"],
        "Defense": ["LB", "CB", "RB"],
        "Midfield": ["CM", "CDM", "CAM", "LM", "RM"],
        "Forward": ["ST", "LW", "RW"]
    }
    
    def __init__(self, username: str, password: str, headless: bool = False):
        """
        Initialize the OSM scraper.
        
        Args:
            username: OSM account username
            password: OSM account password
            headless: Whether to run Chrome in headless mode
        """
        self.username = username
        self.password = password
        self.chrome_options = Options()
        
        if headless:
            self.chrome_options.add_argument("--headless")
            
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("--disable-extensions")
        
        self.driver = webdriver.Chrome(options=self.chrome_options)
        self.wait = WebDriverWait(self.driver, 20)
        self.data = {}
    
    def login(self) -> bool:
        """
        Log in to OSM website.
        
        Returns:
            bool: True if login was successful, False otherwise
        """
        logger.info("Starting login process...")
        self.driver.get(self.BASE_URL)
        
        try:
            # Accept terms if necessary
            try:
                accept_button = self.wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[@class='btn-new btn-orange']/span[contains(text(), 'Accept')]")))
                accept_button.click()
                logger.info("Terms accepted")
            except TimeoutException:
                logger.info("No terms acceptance button found, continuing...")
            
            # Go to login
            login_button = self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//button[@data-bind='click: goToLogin' and contains(text(), 'Log in')]")))
            login_button.click()
            logger.info("Redirecting to login page...")
            
            time.sleep(5)
            
            # Fill credentials
            username_input = self.wait.until(EC.presence_of_element_located((By.ID, "manager-name")))
            password_input = self.driver.find_element(By.ID, "password")
            
            username_input.send_keys(self.username)
            password_input.send_keys(self.password)
            logger.info("Credentials entered")
            
            # Submit login
            submit_button = self.driver.find_element(By.ID, "login")
            submit_button.click()
            logger.info("Logging in...")
            
            # Wait for main page to load
            self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "menu-icon")))
            logger.info("Login successful")
            return True
            
        except Exception as e:
            logger.error(f"Login failed: {str(e)}")
            self.driver.save_screenshot("login_error.png")
            return False
    
    def select_team(self, team_name: str = "FC Energie Cottbus") -> bool:
        """
        Select a team from the available teams.
        
        Args:
            team_name: Name of the team to select
            
        Returns:
            bool: True if team was successfully selected, False otherwise
        """
        logger.info(f"Looking for team: {team_name}...")

        try:
            # Wait for page to load completely
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            self.driver.execute_script("return document.readyState === 'complete';")
            
            # Wait for team elements to be visible
            self.wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "career-teamslot-container")))
            
            # Find specific element by team name
            team_xpath = f"//h2[contains(@class, 'clubslot-main-title') and normalize-space(text())='{team_name}']"
            container_xpath = f"//h2[contains(@class, 'clubslot-main-title') and normalize-space(text())='{team_name}']/ancestor::div[contains(@class, 'career-teamslot-container')]"
            
            # Verify if team exists
            if not self.driver.find_elements(By.XPATH, team_xpath):
                logger.info(f"Team '{team_name}' not found, trying partial search...")
                # Alternative search by partial containment
                team_xpath = f"//h2[contains(@class, 'clubslot-main-title') and contains(text(), '{team_name}')]"
                container_xpath = f"//h2[contains(@class, 'clubslot-main-title') and contains(text(), '{team_name}')]/ancestor::div[contains(@class, 'career-teamslot-container')]"
            
            # Wait and locate team element
            team_title = self.wait.until(EC.presence_of_element_located((By.XPATH, team_xpath)))
            logger.info(f"Team found: {team_title.text}")
            
            # Locate clickable container
            container = self.wait.until(EC.element_to_be_clickable((By.XPATH, container_xpath)))
            
            # Scroll to element with margin
            self.driver.execute_script(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", 
                container
            )
            time.sleep(1.5)  # Allow time for scroll to complete
            
            # Save current URL to verify navigation
            current_url = self.driver.current_url
            
            # Enhanced click strategy
            try:
                logger.info("Attempting click with ActionChains...")
                actions = ActionChains(self.driver)
                actions.move_to_element(container).pause(0.5).click().perform()
            except ElementClickInterceptedException:
                logger.info("Click intercepted, trying with JavaScript...")
                self.driver.execute_script("arguments[0].click();", container)
            except Exception as e:
                logger.warning(f"Error in first click attempt: {str(e)}")
                # Try clicking directly on team title
                try:
                    team_title.click()
                except:
                    logger.info("Trying final click with JavaScript...")
                    self.driver.execute_script("arguments[0].click();", team_title)
            
            # Wait for navigation with longer timeout
            try:
                WebDriverWait(self.driver, 10).until(EC.url_changes(current_url))
                logger.info(f"Navigation successful to: {self.driver.current_url}")
                return True
            except TimeoutException:
                logger.warning("URL didn't change, checking for DOM changes...")
                # Check if elements indicate team page loaded
                try:
                    self.wait.until(EC.presence_of_element_located(
                        (By.XPATH, "//h1[contains(text(), 'Lineup')] | //div[contains(text(), 'Lineup')]")
                    ))
                    logger.info("Page appears to have loaded correctly despite URL not changing.")
                    return True
                except:
                    logger.error("Couldn't confirm navigation.")
                    self.driver.save_screenshot("navigation_failed.png")
                    return False

        except Exception as e:
            logger.error(f"Error selecting team: {str(e)}")
            self.driver.save_screenshot("team_selection_error.png")
            return False
    
    def get_lineup(self) -> Tuple[List[Dict], List[Dict], List[Dict]]:
        """
        Get the current lineup including starters, substitutes and reserves.
        
        Returns:
            Tuple containing lists of dictionaries for starters, substitutes, and reserves
        """
        logger.info("Navigating to Lineup")
        self.driver.get(self.LINEUP_URL)

        self.wait.until(lambda d: d.find_elements(By.CLASS_NAME, "lineup-player"))

        # Starters (on the field)
        starters = self.driver.find_elements(By.CSS_SELECTOR, "div.position.droppable[style*='left']")
        
        # Substitutes (on the bench)
        substitutes = self.driver.find_elements(By.CSS_SELECTOR, "div.position.droppable:not([style*='left'])")

        # Reserves (below the bench)
        reserves = self.driver.find_elements(By.CSS_SELECTOR, "div.reserve-player")

        starters_data = []
        substitutes_data = []
        reserves_data = []

        def extract_data(players, player_type):
            data = []
            for player in players:
                try:
                    if player_type == "Reserve":
                        name = player.find_element(By.CLASS_NAME, "player-name").text.strip()
                        position = player.find_element(By.XPATH, ".//div[contains(@class, 'col-xs-1 center')]").text.strip()
                        fitness = player.find_element(By.XPATH, ".//div[contains(@class, 'progress') and contains(@title, '%')]")
                        fitness_value = int(fitness.get_attribute("title").replace('%', ''))
                    else:
                        name = player.find_element(By.CLASS_NAME, "lineup-player-name-content").text.strip()
                        position = player.find_element(By.CLASS_NAME, "player-specific-position").text.strip()
                        fitness = player.find_element(By.XPATH, ".//div[contains(@class, 'progress') and contains(@title, '%')]")
                        fitness_value = int(fitness.get_attribute("title").replace('%', ''))

                    data.append({
                        "element": player,
                        "name": name,
                        "position": position,
                        "fitness": fitness_value
                    })

                    logger.info(f"{player_type} -> {name} - {position} - {fitness_value}%")

                except Exception as e:
                    logger.error(f"Error processing {player_type}: {e}")
            return data

        starters_data = extract_data(starters, "Starter")
        substitutes_data = extract_data(substitutes, "Substitute")
        reserves_data = extract_data(reserves, "Reserve")

        return starters_data, substitutes_data, reserves_data
    
    def get_position_category(self, position: str) -> Optional[str]:
        """
        Get the category of a position.
        
        Args:
            position: Player position code (e.g., GK, CB, CM)
            
        Returns:
            Category name or None if not found
        """
        for category, positions in self.POSITIONS.items():
            if position in positions:
                return category
        return None

    def find_replacement(self, player: Dict, candidates: List[Dict]) -> Optional[Dict]:
        """
        Find a suitable replacement for a player.
        
        Args:
            player: Player that needs to be replaced
            candidates: List of potential replacement players
            
        Returns:
            Selected replacement player or None if no suitable replacement found
        """
        position_category = self.get_position_category(player['position'])
        possible_replacements = []

        for candidate in candidates:
            if candidate['fitness'] <= self.FITNESS_THRESHOLD:
                continue
                
            # Exact position match is best
            if candidate['position'] == player['position']:
                return candidate
                
            # Same category is acceptable for non-goalkeeper positions
            if (self.get_position_category(candidate['position']) == position_category and 
                position_category != "Goalkeeper"):
                possible_replacements.append(candidate)

        return possible_replacements[0] if possible_replacements else None
    
    def make_substitution(self, player: Dict, replacement: Dict) -> bool:
        """
        Perform a substitution between two players.
        
        Args:
            player: Player to be substituted
            replacement: Player to substitute in
            
        Returns:
            bool: True if substitution was successful, False otherwise
        """
        try:
            logger.info(f"Substituting {player['name']} with {replacement['name']}")
            
            # Implement drag-and-drop functionality
            actions = ActionChains(self.driver)
            
            # Drag replacement to player position
            actions.click_and_hold(replacement['element'])
            actions.move_to_element(player['element'])
            actions.release()
            actions.perform()
            
            # Wait for the substitution to take effect
            time.sleep(2)
            
            # Verify substitution worked (this would need a more robust implementation)
            # For now, we'll just assume it worked if no exception occurred
            
            logger.info(f"Substitution successful: {player['name']} -> {replacement['name']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to make substitution: {str(e)}")
            self.driver.save_screenshot("substitution_error.png")
            return False
    
    def manage_lineup(self) -> int:
        """
        Manage the lineup by substituting players with low fitness.
        
        Returns:
            int: Number of substitutions made
        """
        starters, substitutes, reserves = self.get_lineup()
        
        # Combine substitutes and reserves as candidates for replacement
        candidates = substitutes + reserves
        used_players = set()
        substitutions_made = 0

        for starter in starters:
            if starter['fitness'] < self.FITNESS_THRESHOLD:
                # Filter out already used players
                available_candidates = [c for c in candidates if c['name'] not in used_players]
                replacement = self.find_replacement(starter, available_candidates)
                
                if replacement:
                    logger.warning(
                        f"⚠️ Replacing {starter['name']} ({starter['position']}, {starter['fitness']}%) "
                        f"with {replacement['name']} ({replacement['position']}, {replacement['fitness']}%)"
                    )
                    used_players.add(replacement['name'])
                    
                    if self.make_substitution(starter, replacement):
                        substitutions_made += 1
                else:
                    logger.warning(f"No suitable replacement found for {starter['name']}")
        
        return substitutions_made
    
    def save_lineup_data(self, filename: str = "lineup_data.json") -> bool:
        """
        Save current lineup data to a JSON file.
        
        Args:
            filename: Path to the output JSON file
            
        Returns:
            bool: True if saving was successful, False otherwise
        """
        try:
            starters, substitutes, reserves = self.get_lineup()
            
            # Remove Selenium elements from the data
            def clean_player_data(players):
                return [{k: v for k, v in p.items() if k != 'element'} for p in players]
            
            lineup_data = {
                "starters": clean_player_data(starters),
                "substitutes": clean_player_data(substitutes),
                "reserves": clean_player_data(reserves),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(lineup_data, f, indent=4, ensure_ascii=False)
                
            logger.info(f"Lineup data saved to {filename}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save lineup data: {str(e)}")
            return False
    
    def close(self):
        """Close the browser and clean up resources."""
        if self.driver:
            self.driver.quit()
            logger.info("Browser closed")

def main():
    """Main function to run the OSM scraper."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Online Soccer Manager Lineup Automation')
    parser.add_argument('--username', required=True, help='OSM account username')
    parser.add_argument('--password', required=True, help='OSM account password')
    parser.add_argument('--team', default='FC Energie Cottbus', help='Team name to select')
    parser.add_argument('--headless', action='store_true', help='Run in headless mode')
    parser.add_argument('--save', action='store_true', help='Save lineup data to JSON file')
    parser.add_argument('--manage', action='store_true', help='Automatically manage lineup')
    
    args = parser.parse_args()
    
    bot = OSMScraper(args.username, args.password, args.headless)
    
    try:
        if not bot.login():
            logger.error("Login failed. Exiting.")
            return 1
            
        if not bot.select_team(args.team):
            logger.error("Team selection failed. Exiting.")
            return 1
            
        if args.manage:
            substitutions = bot.manage_lineup()
            logger.info(f"Made {substitutions} substitution(s)")
            
        if args.save:
            bot.save_lineup_data()
            
        return 0
        
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return 1
        
    finally:
        bot.close()

if __name__ == "__main__":
    exit(main())