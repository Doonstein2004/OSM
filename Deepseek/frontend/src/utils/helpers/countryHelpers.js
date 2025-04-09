/**
 * Obtiene la URL de la bandera de un país
 * 
 * @param {string|null} country - Nombre del país
 * @param {number} width - Ancho de la imagen (default: 40)
 * @returns {string} URL de la imagen de la bandera
 */
export const getCountryFlag = (country, width = 40) => {
    try {
      // Si country es nulo o indefinido, usamos una imagen por defecto
      if (!country) {
        return "/placeholder-flag.png";
      }
      
      // Intentamos obtener un código de país (primeras 2 letras)
      const countryCode = country.toLowerCase().slice(0, 2);
      
      // Si no hay código de país válido, usa un valor predeterminado
      if (!countryCode || countryCode.length < 2) {
        return "/placeholder-flag.png";
      }
      
      // Devolver URL de la bandera
      return `https://flagcdn.com/w${width}/${countryCode}.png`;
    } catch (error) {
      console.warn("Error al procesar el código de país:", error);
      return "/placeholder-flag.png";
    }
  };
  
  /**
   * Lista de países comunes para ligas deportivas
   * 
   * @returns {Array<string>} Lista de nombres de países
   */
  export const getCommonCountries = () => {
    return [
      "España",
      "Italia",
      "Inglaterra",
      "Alemania",
      "Francia",
      "Portugal",
      "Brasil",
      "Argentina",
      "México",
      "Estados Unidos"
    ];
  };