/**
 * Diacritics mapping for various languages
 * Maps accented characters to their base form
 */

/**
 * French diacritics mapping
 * Maps French accented characters to their base letters
 */
export const FRENCH_DIACRITICS_MAP: Record<string, string> = {
  // Uppercase
  À: 'A',
  Â: 'A',
  Ä: 'A',
  Æ: 'A',
  É: 'E',
  È: 'E',
  Ê: 'E',
  Ë: 'E',
  Î: 'I',
  Ï: 'I',
  Ô: 'O',
  Œ: 'O',
  Ù: 'U',
  Û: 'U',
  Ü: 'U',
  Ÿ: 'Y',
  Ç: 'C',
  // Lowercase
  à: 'a',
  â: 'a',
  ä: 'a',
  æ: 'a',
  é: 'e',
  è: 'e',
  ê: 'e',
  ë: 'e',
  î: 'i',
  ï: 'i',
  ô: 'o',
  œ: 'o',
  ù: 'u',
  û: 'u',
  ü: 'u',
  ÿ: 'y',
  ç: 'c',
};

/**
 * Collection of all diacritics maps by language
 */
export const DIACRITICS_MAPS: Record<string, Record<string, string>> = {
  french: FRENCH_DIACRITICS_MAP,
};

/**
 * Maps a character with diacritics to its base form for a specific language
 * @param char - Character to map
 * @param language - Language identifier (e.g., 'french')
 * @returns Base character or original character if no mapping exists
 */
export function mapDiacritic(char: string, language: string): string {
  const map = DIACRITICS_MAPS[language];
  if (!map) {
    return char;
  }
  return map[char] ?? char;
}

/**
 * Maps all diacritics in a text to their base forms for a specific language
 * @param text - Text to process
 * @param language - Language identifier (e.g., 'french')
 * @returns Text with diacritics mapped to base characters
 */
export function mapDiacritics(text: string, language: string): string {
  const map = DIACRITICS_MAPS[language];
  if (!map) {
    return text;
  }

  return [...text].map((char) => map[char] ?? char).join('');
}
