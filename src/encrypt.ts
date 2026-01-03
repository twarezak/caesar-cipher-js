import type { EncryptOptions } from './types';
import { DEFAULT_ALPHABET } from './utils/alphabets';
import { shiftChar, validateAlphabet, validateShift } from './utils/helpers';
import { mapDiacritic } from './utils/diacritics';

/**
 * Encrypts text using the Caesar cipher algorithm
 *
 * @param text - The plaintext to encrypt
 * @param shift - The number of positions to shift each character (can be negative)
 * @param options - Optional configuration for encryption behavior
 * @returns The encrypted text
 *
 * @example
 * ```typescript
 * // Basic encryption
 * const encrypted = encrypt('Hello World', 3);
 * console.log(encrypted); // 'Khoor Zruog'
 *
 * // With custom alphabet
 * const encrypted = encrypt('test', 5, {
 *   alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789'
 * });
 *
 * // Without preserving case
 * const encrypted = encrypt('Hello', 3, { preserveCase: false });
 * ```
 *
 * @throws {Error} If alphabet is empty or contains duplicate characters
 * @throws {Error} If shift is not a valid integer
 */
export function encrypt(text: string, shift: number, options: EncryptOptions = {}): string {
  // Extract options with defaults (with backward compatibility)
  const {
    alphabet = DEFAULT_ALPHABET,
    preserveCase,
    caseStrategy = preserveCase === false ? 'lower' : 'maintain',
    preserveNonAlpha,
    preserveSpaces = preserveNonAlpha ?? true,
    preserveSpecialChars = preserveNonAlpha ?? true,
    diacriticsLanguage,
  } = options;

  // Validate inputs
  validateAlphabet(alphabet);
  validateShift(shift);

  // Empty text case
  if (text.length === 0) {
    return '';
  }

  // Build result string
  let result = '';

  for (let char of text) {
    // Map diacritics if language specified
    if (diacriticsLanguage) {
      char = mapDiacritic(char, diacriticsLanguage);
    }

    // Handle spaces
    if (char === ' ') {
      if (preserveSpaces) {
        result += char;
      }
      continue;
    }

    // Handle line breaks and other whitespace
    if (char === '\n' || char === '\r' || char === '\t') {
      if (preserveSpaces) {
        result += char;
      }
      continue;
    }

    const lowerChar = char.toLowerCase();
    const charInAlphabet = alphabet.includes(lowerChar);

    if (!charInAlphabet) {
      // Character not in alphabet
      if (preserveSpecialChars) {
        result += char;
      }
      // else skip the character
    } else {
      // Determine if we should preserve case for this character
      const shouldPreserveCase = caseStrategy === 'maintain';

      // Shift the character
      let shiftedChar = shiftChar(char, shift, alphabet, shouldPreserveCase);

      // Apply case strategy
      if (caseStrategy === 'upper') {
        shiftedChar = shiftedChar.toUpperCase();
      } else if (caseStrategy === 'lower') {
        shiftedChar = shiftedChar.toLowerCase();
      }

      result += shiftedChar;
    }
  }

  return result;
}
