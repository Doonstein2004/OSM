/**
 * Obtiene la URL de la bandera basada en el país contenido en el nombre de la liga
 * @param {string|null} leagueName - Nombre de la liga que contiene el país
 * @param {number} width - Ancho de la imagen (default: 40)
 * @returns {string} URL de la imagen de la bandera
 */
export const getCountryFlag = (leagueName, width = 40) => {
  try {
    if (!leagueName) return "/placeholder-flag.png";

    // Primero, intentamos identificar ligas continentales o internacionales
    if (
      /\b(uefa|conmebol|concacaf|fifa|afc|caf|ofc|copa mundial|world cup|champions league|libertadores|mundial de clubes)\b/i.test(leagueName)
    ) {
      // Para competiciones internacionales, devolvemos una bandera genérica
      return "/international-flag.png";
    }

    // Casos específicos de ligas que sabemos exactamente a qué país pertenecen
    const LEAGUE_TO_COUNTRY = {
      // Casos especiales que necesitan atención específica
      'premier league of belize': 'bz',
      'kazakhstan premier league': 'kz',
      
      // Ligas europeas
      'premier league': 'gb',
      'laliga': 'es',
      'serie a': 'it',
      'bundesliga': 'de',
      'ligue 1': 'fr',
      'eredivisie': 'nl',
      'liga portugal': 'pt',
      'primeira liga': 'pt',
      'jupiler pro league': 'be',
      'super league': 'ch',
      'superliga': 'dk',
      'eliteserien': 'no',
      'allsvenskan': 'se',
      'veikkausliiga': 'fi',
      'hnl': 'hr',
      'spl': 'gb-sct',
      
      // Ligas asiáticas
      'j-league': 'jp',
      'j1 league': 'jp',
      'k-league': 'kr',
      'k league': 'kr',
      'csl': 'cn',
      'chinese super league': 'cn',
      'cfa super league': 'cn',
      'china super league': 'cn',
      'thai league': 'th',
      'arabian gulf league': 'ae',
      'saudi pro league': 'sa',
      'qsl': 'qa',
      'qatar stars league': 'qa',
      'indian super league': 'in',
      
      // Ligas oceánicas
      'a-league': 'au',
      
      // Ligas americanas
      'liga mx': 'mx',
      'liga de expansión mx': 'mx',
      'liga expansion mx': 'mx',
      'mls': 'us',
      'major league soccer': 'us',
      'liga profesional': 'ar',
      'copa chile': 'cl',
      'brasileirao': 'br',
      'campeonato brasileiro': 'br',
      'liga betplay': 'co',
      'primera division uruguay': 'uy',
      
      // Ligas africanas
      'botola pro': 'ma',
      'egypt premier league': 'eg',
      'nigeria professional football league': 'ng',
      'south african premier division': 'za',
      'ghanaian premier league': 'gh'
    };

    // Buscar coincidencias exactas de ligas conocidas
    const normalizedLeagueName = leagueName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, '');
      
    // Primero intentar con coincidencias completas (para evitar confusiones)
    for (const [leagueKey, countryCode] of Object.entries(LEAGUE_TO_COUNTRY)) {
      if (normalizedLeagueName === leagueKey) {
        return `https://flagcdn.com/w${width}/${countryCode}.png`;
      }
    }
    
    // Luego buscar coincidencias parciales con límites de palabra
    for (const [leagueKey, countryCode] of Object.entries(LEAGUE_TO_COUNTRY)) {
      const regex = new RegExp(`\\b${leagueKey}\\b`, 'i');
      if (regex.test(normalizedLeagueName)) {
        return `https://flagcdn.com/w${width}/${countryCode}.png`;
      }
    }

    // Caso especial para ligas donde se puede inferir del nombre sin formato explícito
    const leagueTokens = leagueName.toLowerCase().split(/\s+/);
    
    if (leagueTokens.includes("mx") || 
        (leagueTokens.includes("liga") && leagueTokens.includes("expansion") && leagueTokens.includes("mx")) ||
        (leagueTokens.includes("liga") && leagueTokens.includes("expansión") && leagueTokens.includes("mx"))) {
      return `https://flagcdn.com/w${width}/mx.png`;
    }
    
    if (leagueTokens.includes("mls") || 
        (leagueTokens.includes("major") && leagueTokens.includes("league") && leagueTokens.includes("soccer"))) {
      return `https://flagcdn.com/w${width}/us.png`;
    }

    // Expresión regular mejorada para capturar diferentes formatos
    const countryMatch = leagueName.match(
      /(?:\s*[-–—(]\s*)?(?:en\s|de\s)?([A-Za-záéíóúñÁÉÍÓÚÑ\s.]{3,})(?:[)\]])?$/i
    );

    // Si es "of X", capturar X como país (ej: Premier League of Belize)
    const ofCountryMatch = !countryMatch && leagueName.match(/\bof\s+([A-Za-záéíóúñÁÉÍÓÚÑ\s.]{3,})$/i);

    let rawCountry = null;
    if (countryMatch) {
      rawCountry = countryMatch[1].trim();
    } else if (ofCountryMatch) {
      rawCountry = ofCountryMatch[1].trim();
    }
    
    if (!rawCountry) {
      // Intentar buscar nombres de países en cualquier parte del string
      for (const [countryName, code] of Object.entries(COUNTRY_CODES)) {
        // Usamos una expresión regular con límites de palabra para evitar falsos positivos
        const countryRegex = new RegExp(`\\b${countryName}\\b`, 'i');
        if (countryRegex.test(leagueName.toLowerCase())) {
          return `https://flagcdn.com/w${width}/${code}.png`;
        }
      }
      return "/placeholder-flag.png";
    }

    // Normalización avanzada
    const normalizedCountry = rawCountry
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z\s]/g, '') // Eliminar caracteres especiales
      .trim();

    // Buscar coincidencia exacta primero
    const specialCode = COUNTRY_CODES[normalizedCountry];
    if (specialCode) return `https://flagcdn.com/w${width}/${specialCode}.png`;

    // Si hay espacios, intentar buscar por cada palabra (para países compuestos)
    if (normalizedCountry.includes(' ')) {
      const parts = normalizedCountry.split(' ');
      for (const part of parts) {
        if (part.length >= 3 && COUNTRY_CODES[part]) {
          return `https://flagcdn.com/w${width}/${COUNTRY_CODES[part]}.png`;
        }
      }
    }

    // Si aún no hay coincidencia, intentar buscar por aproximación
    for (const [countryName, code] of Object.entries(COUNTRY_CODES)) {
      if (normalizedCountry.includes(countryName) || countryName.includes(normalizedCountry)) {
        return `https://flagcdn.com/w${width}/${code}.png`;
      }
    }

    return "/placeholder-flag.png";
  } catch (error) {
    console.warn("Error al procesar el nombre de la liga:", error);
    return "/placeholder-flag.png";
  }
};

// Importamos el mapeo completo de países desde el archivo original
import { COUNTRY_CODES } from './country-codes.js';

/**
 * Función para probar la extracción de banderas
 * @param {string[]} leagueNames - Lista de nombres de ligas para probar
 */
export const testCountryFlagExtraction = (leagueNames) => {
  console.log("=== PRUEBA DE EXTRACCIÓN DE BANDERAS ===");
  
  leagueNames.forEach(leagueName => {
    const flagUrl = getCountryFlag(leagueName);
    const countryCode = flagUrl.includes('/w40/') 
      ? flagUrl.split('/w40/')[1].split('.')[0] 
      : 'no identificado';
      
    console.log(`Liga: "${leagueName}"`);
    console.log(`  País detectado: ${countryCode}`);
    console.log(`  URL bandera: ${flagUrl}`);
    console.log('---');
  });
};