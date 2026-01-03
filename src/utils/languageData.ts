/**
 * Language frequency data for scoring decrypted text
 * Includes letter frequency and common words for various languages
 */

/**
 * Language frequency data structure
 */
export interface LanguageFrequencyData {
  /**
   * Letters ordered by frequency (most common first)
   */
  letters: string;
  /**
   * Array of common words in the language
   */
  commonWords: string[];
}

/**
 * English language frequency data
 */
export const ENGLISH_FREQUENCY: LanguageFrequencyData = {
  letters: 'ETAOINSRHDLUCMFYWGPBVKXQJZ',
  commonWords: ['THE', 'AND', 'THAT', 'HAVE', 'FOR', 'NOT', 'WITH', 'YOU', 'THIS', 'BUT'],
};

/**
 * Polish language frequency data
 */
export const POLISH_FREQUENCY: LanguageFrequencyData = {
  letters: 'EAOINZWSCRTKDPMUJLŁYĆBGĘHĄŻŚŃÓŹFVX',
  commonWords: ['JEST', 'NIE', 'SIĘ', 'BYŁ', 'TAK', 'PAN', 'CZY', 'COŚ', 'BYĆ', 'MOŻE'],
};

/**
 * German language frequency data
 */
export const GERMAN_FREQUENCY: LanguageFrequencyData = {
  letters: 'ENSRITADHULGCOMWFKZPVBÜÖÄYJQX',
  commonWords: ['DER', 'DIE', 'UND', 'IST', 'DEN', 'ICH', 'NICHT', 'VON', 'EINE', 'DAS'],
};

/**
 * Spanish language frequency data
 */
export const SPANISH_FREQUENCY: LanguageFrequencyData = {
  letters: 'EAOSNRILDCTUMPHQYVBGFÑZJXKW',
  commonWords: ['EL', 'LA', 'DE', 'QUE', 'EN', 'UN', 'POR', 'CON', 'NO', 'UNA'],
};

/**
 * French language frequency data
 */
export const FRENCH_FREQUENCY: LanguageFrequencyData = {
  letters: 'EAISNTRULODCMPÉVQFBGHJÀXZÈÊÇÙŒWÏYËÜÎ',
  commonWords: ['DE', 'LA', 'LE', 'ET', 'LES', 'DES', 'UN', 'EN', 'QUE', 'EST', 'DANS', 'POUR', 'PAS', 'SUR'],
};

/**
 * Collection of all language frequency data
 */
export const LANGUAGE_FREQUENCIES: Record<string, LanguageFrequencyData> = {
  english: ENGLISH_FREQUENCY,
  polish: POLISH_FREQUENCY,
  german: GERMAN_FREQUENCY,
  spanish: SPANISH_FREQUENCY,
  french: FRENCH_FREQUENCY,
};

/**
 * Supported language identifiers
 */
export type SupportedLanguage = 'english' | 'polish' | 'german' | 'spanish' | 'french';

/**
 * Get frequency data for a specific language
 * @param language - Language identifier
 * @returns Language frequency data or English as fallback
 */
export function getLanguageFrequency(language: string): LanguageFrequencyData {
  return LANGUAGE_FREQUENCIES[language] ?? ENGLISH_FREQUENCY;
}
