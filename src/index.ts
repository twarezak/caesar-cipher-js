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
} from './types';

// Utility exports
export {
  ALPHABET_ENGLISH_LOWER,
  ALPHABET_ENGLISH_UPPER,
  ALPHABET_POLISH_LOWER,
  ALPHABET_POLISH_UPPER,
  ALPHABET_ALPHANUMERIC_LOWER,
  ALPHABET_ALPHANUMERIC_UPPER,
  DEFAULT_ALPHABET,
} from './utils/alphabets';

export { scoreEnglishText } from './utils/helpers';
