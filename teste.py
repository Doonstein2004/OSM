import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains


class OSMScraper:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.chrome_options = Options()
        #self.chrome_options.add_argument("--headless")
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
            # Esperar a que la página esté completamente cargada
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            self.driver.execute_script("return document.readyState === 'complete';")
            
            # Esperar a que los elementos de equipo estén visibles
            self.wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "career-teamslot-container")))
            
            # Encontrar el elemento específico por el nombre del equipo
            # Usando una búsqueda más precisa basada en la estructura HTML
            equipo_xpath = f"//h2[contains(@class, 'clubslot-main-title') and normalize-space(text())='{nombre_equipo}']"
            contenedor_xpath = f"//h2[contains(@class, 'clubslot-main-title') and normalize-space(text())='{nombre_equipo}']/ancestor::div[contains(@class, 'career-teamslot-container')]"
            
            # Verificar si el equipo existe
            if not self.driver.find_elements(By.XPATH, equipo_xpath):
                print(f"Equipo '{nombre_equipo}' no encontrado, intentando búsqueda parcial...")
                # Búsqueda alternativa por contención parcial
                equipo_xpath = f"//h2[contains(@class, 'clubslot-main-title') and contains(text(), '{nombre_equipo}')]"
                contenedor_xpath = f"//h2[contains(@class, 'clubslot-main-title') and contains(text(), '{nombre_equipo}')]/ancestor::div[contains(@class, 'career-teamslot-container')]"
            
            # Esperar y localizar el elemento del equipo
            titulo_equipo = self.wait.until(EC.presence_of_element_located((By.XPATH, equipo_xpath)))
            print(f"Equipo encontrado: {titulo_equipo.text}")
            
            # Localizar el contenedor clickable
            contenedor = self.wait.until(EC.element_to_be_clickable((By.XPATH, contenedor_xpath)))
            
            # Scroll al elemento con un pequeño margen
            self.driver.execute_script(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", 
                contenedor
            )
            time.sleep(1.5)  # Dar tiempo para que el scroll se complete
            
            # Guardar URL actual para verificar navegación
            current_url = self.driver.current_url
            
            # Estrategia de clic mejorada
            try:
                print("Intentando clic con ActionChains...")
                actions = ActionChains(self.driver)
                actions.move_to_element(contenedor).pause(0.5).click().perform()
            except ElementClickInterceptedException:
                print("Clic interceptado, intentando con JavaScript...")
                self.driver.execute_script("arguments[0].click();", contenedor)
            except Exception as e:
                print(f"Error en primer intento de clic: {str(e)}")
                # Intentar clic directamente en el título del equipo
                try:
                    titulo_equipo.click()
                except:
                    print("Intentando clic final con JavaScript...")
                    self.driver.execute_script("arguments[0].click();", titulo_equipo)
            
            # Esperar navegación con timeout más largo
            try:
                WebDriverWait(self.driver, 10).until(EC.url_changes(current_url))
                print(f"Navegación exitosa a: {self.driver.current_url}")
                return True
            except TimeoutException:
                print("La URL no cambió, verificando si hubo cambio en el DOM...")
                # Verificar si hay elementos que indiquen que se cargó la página del equipo
                try:
                    self.wait.until(EC.presence_of_element_located(
                        (By.XPATH, "//h1[contains(text(), 'Alineación')] | //div[contains(text(), 'Alineación')]")
                    ))
                    print("La página parece haber cargado correctamente a pesar de que la URL no cambió.")
                    return True
                except:
                    print("No se pudo confirmar la navegación.")
                    self.driver.save_screenshot("navegacion_fallida.png")
                    return False

        except Exception as e:
            print(f"Error al seleccionar el equipo: {str(e)}")
            self.driver.save_screenshot("error_seleccion_equipo.png")
            return False
    
    def get_lineup(self):
        print("Dirigiéndose a Alineación")
        self.driver.get("https://en.onlinesoccermanager.com/Lineup")

        self.wait.until(lambda d: d.find_elements(By.CLASS_NAME, "lineup-player"))

        # Titulares (los que están en la cancha)
        titulares = self.driver.find_elements(By.CSS_SELECTOR, "div.position.droppable[style*='left']")
        
        # Suplentes (los que están en el banco)
        suplentes = self.driver.find_elements(By.CSS_SELECTOR, "div.position.droppable:not([style*='left'])")

        # Reservas (los que están más abajo del banco)
        reservas = self.driver.find_elements(By.CSS_SELECTOR, "div.reserve-player")

        titulares_data = []
        suplentes_data = []
        reservas_data = []

        def extraer_datos(jugadores, tipo):
            datos = []
            for jugador in jugadores:
                try:
                    if tipo == "Reserva":
                        nombre = jugador.find_element(By.CLASS_NAME, "player-name").text.strip()
                        posicion = jugador.find_element(By.XPATH, ".//div[contains(@class, 'col-xs-1 center')]").text.strip()
                        fitness = jugador.find_element(By.XPATH, ".//div[contains(@class, 'progress') and contains(@title, '%')]")
                        fitness_value = int(fitness.get_attribute("title").replace('%', ''))
                    else:
                        nombre = jugador.find_element(By.CLASS_NAME, "lineup-player-name-content").text.strip()
                        posicion = jugador.find_element(By.CLASS_NAME, "player-specific-position").text.strip()
                        fitness = jugador.find_element(By.XPATH, ".//div[contains(@class, 'progress') and contains(@title, '%')]")
                        fitness_value = int(fitness.get_attribute("title").replace('%', ''))

                    datos.append({
                        "element": jugador,
                        "nombre": nombre,
                        "posicion": posicion,
                        "fitness": fitness_value
                    })

                    print(f"{tipo} -> {nombre} - {posicion} - {fitness_value}%")

                except Exception as e:
                    print(f"Error procesando {tipo}: {e}")
            return datos

        titulares_data = extraer_datos(titulares, "Titular")
        suplentes_data = extraer_datos(suplentes, "Suplente")
        reservas_data = extraer_datos(reservas, "Reserva")

        return titulares_data, suplentes_data, reservas_data
    
    
    
    def get_function(pos):
        if pos in ['LB', 'CB', 'RB']:
            return 'Defensa'
        if pos in ['CM', 'CDM', 'CAM', 'LM', 'RM']:
            return 'Mediocampo'
        if pos in ['ST', 'LW', 'RW']:
            return 'Delantero'
        if pos == 'GK':
            return 'Portero'
        return None

    def encontrar_reemplazo(jugador, candidatos):
        funcion = get_function(jugador['pos'])
        posibles = []

        for s in candidatos:
            if s['fitness'] <= 90:
                continue
            if s['pos'] == jugador['pos']:
                return s  # Mismo puesto
            if get_function(s['pos']) == funcion and funcion != 'Portero':
                posibles.append(s)

        return posibles[0] if posibles else None
    
    
    titulares, suplentes, reservas = self.get_lineup()

    # Suplentes y reservas se combinan como candidatos para reemplazo
    candidatos = suplentes + reservas
    usados = set()

    for titular in titulares:
        if titular['fitness'] < 90:
            reemplazo = encontrar_reemplazo(titular, [c for c in candidatos if c['nombre'] not in usados])
            if reemplazo:
                print(f"⚠️ Reemplazando a {titular['nombre']} ({titular['pos']}, {titular['fitness']}%) por {reemplazo['nombre']} ({reemplazo['pos']}, {reemplazo['fitness']}%)")
                usados.add(reemplazo['nombre'])

                # Aquí deberías implementar el método `realizar_cambio()`
                # realizar_cambio(titular['element'], reemplazo['element'])
            
        
            
            
            
bot = OSMScraper("Petriski", "80201302926")
bot.login()
bot.seleccionar_equipo("FC Energie Cottbus")
bot.get_lineup()
