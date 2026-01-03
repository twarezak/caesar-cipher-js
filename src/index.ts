/**
 * Caesar Cipher JS - Lightweight JavaScript/TypeScript library for Caesar cipher operations
 *
 * @packageDocumentation
 */

// Main functions
export { encrypt } from './encrypt';
export { decrypt } from './decrypt';
export { bruteforce } from './bruteforce';

// Class-based API
export { CaesarCipher } from './CaesarCipher';

// Types
export type {
  EncryptOptions,
  DecryptOptions,
  BruteforceOptions,
  BruteforceResult,
  CipherOptions,
  ScoreFunction,
  CaseStrategy,
} from './types';

// Utility exports
export {
  ALPHABET_ENGLISH_LOWER,
  ALPHABET_ENGLISH_UPPER,
  ALPHABET_POLISH_LOWER,
  ALPHABET_POLISH_UPPER,
  ALPHABET_GERMAN_LOWER,
  ALPHABET_GERMAN_UPPER,
  ALPHABET_SPANISH_LOWER,
  ALPHABET_SPANISH_UPPER,
  ALPHABET_FRENCH_LOWER,
  ALPHABET_FRENCH_UPPER,
  ALPHABET_ALPHANUMERIC_LOWER,
  ALPHABET_ALPHANUMERIC_UPPER,
  DEFAULT_ALPHABET,
} from './utils/alphabets';

// Scoring functions
export { scoreEnglishText } from './utils/helpers';
export {
  scoreText,
  scorePolishText,
  scoreGermanText,
  scoreSpanishText,
  scoreFrenchText,
  getScoreFunction,
} from './utils/scoring';

// Language data
export type { LanguageFrequencyData, SupportedLanguage } from './utils/languageData';
export {
  ENGLISH_FREQUENCY,
  POLISH_FREQUENCY,
  GERMAN_FREQUENCY,
  SPANISH_FREQUENCY,
  FRENCH_FREQUENCY,
  LANGUAGE_FREQUENCIES,
  getLanguageFrequency,
} from './utils/languageData';

// Diacritics mapping
export { FRENCH_DIACRITICS_MAP, DIACRITICS_MAPS, mapDiacritic, mapDiacritics } from './utils/diacritics';
