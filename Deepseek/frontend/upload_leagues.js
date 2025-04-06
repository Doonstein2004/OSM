// uploadTemplate.js - Script para subir plantillas de ligas al servidor
// Puedes ejecutar este script con Node.js para cargar tus plantillas

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuración
const API_URL = 'http://localhost:8000';
const TEMPLATES_FILE = path.join(__dirname, '../osm_teams_data.json');
const TEMPLATE_NAME = 'leagues';

// Función para subir la plantilla
async function uploadTemplate() {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(TEMPLATES_FILE)) {
      console.error(`El archivo ${TEMPLATES_FILE} no existe`);
      return;
    }
    
    // Leer el archivo
    const fileContent = fs.readFileSync(TEMPLATES_FILE);
    
    // Verificar que es un JSON válido
    try {
      JSON.parse(fileContent);
    } catch (e) {
      console.error('El archivo no es un JSON válido:', e.message);
      return;
    }
    
    // Crear el FormData para la subida
    const formData = new FormData();
    formData.append('file', fileContent, 'leagues_template.json');
    
    // Hacer la petición
    const response = await axios.post(
      `${API_URL}/templates/upload?template_name=${TEMPLATE_NAME}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    
    // Mostrar respuesta
    console.log('Respuesta del servidor:', response.data);
    
  } catch (error) {
    console.error('Error al subir la plantilla:', error.response?.data || error.message);
  }
}

// Ejecutar la función
uploadTemplate().then(() => {
  console.log('Proceso completado');
});