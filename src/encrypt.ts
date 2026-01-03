import type { EncryptOptions } from './types';
import { DEFAULT_ALPHABET } from './utils/alphabets';
import { shiftChar, validateAlphabet, validateShift } from './utils/helpers';

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
  // Extract options with defaults
  const {
    alphabet = DEFAULT_ALPHABET,
    preserveCase = true,
    preserveNonAlpha = true,
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

  for (const char of text) {
    const lowerChar = char.toLowerCase();
    const charInAlphabet = alphabet.includes(lowerChar);

    if (!charInAlphabet) {
      // Character not in alphabet
      if (preserveNonAlpha) {
        result += char;
      }
      // else skip the character
    } else {
      // Shift the character
      const shiftedChar = shiftChar(char, shift, alphabet, preserveCase);
      result += shiftedChar;
    }
  }

  return result;
}
