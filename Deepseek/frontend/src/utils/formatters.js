/**
 * Safely formats a number to a fixed number of decimal places
 * Returns 'N/A' if the input is undefined, null, or NaN
 * 
 * @param {number} num - The number to format
 * @param {number} digits - Number of decimal places (default: 2)
 * @returns {string} Formatted number or 'N/A'
 */
export const safeToFixed = (num, digits = 2) => {
    if (num === undefined || num === null || isNaN(num)) {
      return 'N/A';
    }
    return Number(num).toFixed(digits);
  };
  
  /**
   * Formats a percentage value with % symbol
   * 
   * @param {number} value - The value to format as percentage
   * @param {number} digits - Number of decimal places (default: 1)
   * @returns {string} Formatted percentage or 'N/A'
   */
  export const formatPercentage = (value, digits = 1) => {
    const formatted = safeToFixed(value, digits);
    return formatted === 'N/A' ? formatted : `${formatted}%`;
  };