import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options


class OSMScraper:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(options=self.chrome_options)  # Asegúrate de tener ChromeDriver instalado
        self.wait = WebDriverWait(self.driver, 20)
        self.data = {}
    
    def login(self):
        print("Iniciando proceso de login...")
        self.driver.get("https://www.onlinesoccermanager.com")
        
        try:
            # Aceptar términos si es necesario
            accept_button = self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//button[@class='btn-new btn-orange']/span[contains(text(), 'Accept')]")))
            accept_button.click()
            print("Términos aceptados")
        except TimeoutException:
            print("No se encontró el botón de aceptar términos, continuando...")
        
        # Ir a login
        login_button = self.wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[@data-bind='click: goToLogin' and contains(text(), 'Log in')]")))
        login_button.click()
        print("Redirigiendo a página de login...")
        
        time.sleep(5)
        
        # Rellenar credenciales
        username_input = self.wait.until(EC.presence_of_element_located((By.ID, "manager-name")))
        password_input = self.driver.find_element(By.ID, "password")
        
        username_input.send_keys(self.username)
        password_input.send_keys(self.password)
        print("Credenciales ingresadas")
        
        # Hacer login
        submit_button = self.driver.find_element(By.ID, "login")
        submit_button.click()
        print("Iniciando sesión...")
        
        # Esperar a que cargue la página principal
        self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "menu-icon")))
        print("Login exitoso")
        
        
    def seleccionar_equipo(self, nombre_equipo="FC Energie Cottbus"):
        print(f"Buscando el equipo: {nombre_equipo}...")

        try:
            equipo_element = self.wait.until(EC.presence_of_all_elements_located(
                (By.XPATH, f"//h2[contains(@class, 'clubslot-main-title') and contains(text(), '{nombre_equipo}')]")
            ))

            for elemento in equipo_element:
                # Subir al contenedor clicable
                contenedor_clickable = elemento.find_element(By.XPATH, "./ancestor::div[contains(@class, 'row-h-xs-24')]")
                self.driver.execute_script("arguments[0].scrollIntoView();", contenedor_clickable)
                time.sleep(1)  # Esperar un segundo para asegurar visibilidad
                contenedor_clickable.click()
                print(f"Equipo '{nombre_equipo}' seleccionado con éxito.")
                return

            print("No se encontró el equipo en el dashboard.")

        except (TimeoutException, NoSuchElementException) as e:
            print(f"Error al buscar o seleccionar el equipo: {e}")
            
    
    def get_lineup(self):
        print("Dirigiendose a Alineacion")
        
        self.driver.get("https://onlinesoccermanager.com/Lineup")
        
        # Implementar la lógica para obtener realmente los 11 titulares
        # Verificar el cansancio de los jugadores: {
            # verde claro = otimo
            # verde oscuro = bueno
            # amarillo = regular (cambiar jugador)
            # naranja = malo (cambiar jugador)
            # rojo = extremo (cambiar jugador)
        # }
        
        # Cambiar jugadores en la medida de lo posible por su posicion natural, sino haber jugadores de la misma posicion: {
            # portero: (solo puede ser portero)
            # defensa: (para los DD y DI: DC) (para los DC dependera de su posicion, si es a la derecha un DD si es izquierdo un DI)
            # mediocampista: (para los CD/CI: CCA-CC-CCD) (para los CCA:CD/CI-CC-CCD) (para los CCD:CC-CCA-CD/CI)
            # delantero
        #}
                    
            
        
            
            
            
bot = OSMScraper("Petriski", "80201302926")
bot.login()
bot.seleccionar_equipo("FC Energie Cottbus")
