/**
 * Predefined alphabets for common use cases
 */

/**
 * Standard lowercase English alphabet (a-z)
 */
export const ALPHABET_ENGLISH_LOWER = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Standard uppercase English alphabet (A-Z)
 */
export const ALPHABET_ENGLISH_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Polish alphabet with lowercase letters including special characters
 */
export const ALPHABET_POLISH_LOWER = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';

/**
 * Polish alphabet with uppercase letters including special characters
 */
export const ALPHABET_POLISH_UPPER = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ';

/**
 * German alphabet with lowercase letters including special characters (ä, ö, ü, ß)
 */
export const ALPHABET_GERMAN_LOWER = 'aäbcdefghijklmnoöpqrstuüvwxyzß';

/**
 * German alphabet with uppercase letters including special characters (Ä, Ö, Ü, ß)
 */
export const ALPHABET_GERMAN_UPPER = 'AÄBCDEFGHIJKLMNOÖPQRSTUÜVWXYZß';

/**
 * Spanish alphabet with lowercase letters including special character (ñ)
 */
export const ALPHABET_SPANISH_LOWER = 'abcdefghijklmnñopqrstuvwxyz';

/**
 * Spanish alphabet with uppercase letters including special character (Ñ)
 */
export const ALPHABET_SPANISH_UPPER = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

/**
 * French alphabet with lowercase letters (standard Latin alphabet)
 * Note: French diacritics (é, è, ê, à, etc.) should be mapped to base letters
 */
export const ALPHABET_FRENCH_LOWER = 'abcdefghijklmnopqrstuvwxyz';

/**
 * French alphabet with uppercase letters (standard Latin alphabet)
 * Note: French diacritics (É, È, Ê, À, etc.) should be mapped to base letters
 */
export const ALPHABET_FRENCH_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Alphanumeric alphabet (lowercase letters + digits)
 */
export const ALPHABET_ALPHANUMERIC_LOWER = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Alphanumeric alphabet (uppercase letters + digits)
 */
export const ALPHABET_ALPHANUMERIC_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Default alphabet used when no custom alphabet is provided
 */
export const DEFAULT_ALPHABET = ALPHABET_ENGLISH_LOWER;
