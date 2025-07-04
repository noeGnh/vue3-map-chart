/**
 * Checks if the given value is an object and not an array or null.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the value is an object and not an array or null, false otherwise.
 */
export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Formats a number with a magnitude suffix.
 *
 * @param {number} number - The number to be formatted.
 * @return {string|number} The formatted number with the magnitude suffix.
 */
export function formatNumberWithSIPrefix(number: number): string | number {
  var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

  var tier = (Math.log10(Math.abs(number)) / 3) | 0

  if (tier == 0) return number

  var suffix = SI_SYMBOL[tier]
  var scale = Math.pow(10, tier * 3)

  var scaled = number / scale

  return scaled.toFixed(1) + suffix
}

/**
 * Generates a random integer between the provided minimum and maximum values (inclusive).
 *
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @return {number} The randomly generated integer.
 */
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Checks if the given code is a valid ISO code.
 *
 * @param {string} code - The code to be checked.
 * @return {boolean} Returns true if the code is a valid ISO code, false otherwise.
 */
export function isValidIsoCode(code: string): boolean {
  const isoCodeRegex = /^(?:[A-Z]{2,3}|[A-Z]{2}-[A-Z0-9]{1,3})$/
  return isoCodeRegex.test(code)
}
