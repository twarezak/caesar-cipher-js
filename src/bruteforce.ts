import type { BruteforceOptions, BruteforceResult } from './types';
import { DEFAULT_ALPHABET } from './utils/alphabets';
import { validateAlphabet } from './utils/helpers';
import { decrypt } from './decrypt';

/**
 * Attempts to decrypt Caesar cipher text by trying all possible shift values
 *
 * This function is useful when the shift value is unknown. It tries all possible
 * shifts and returns the results, optionally scored by a custom scoring function.
 *
 * @param text - The ciphertext to decrypt
 * @param options - Optional configuration for bruteforce behavior
 * @returns Array of possible decryption results, sorted by score if scoreFunction was provided
 *
 * @example
 * ```typescript
 * // Basic bruteforce
 * const results = bruteforce('Khoor Zruog');
 * console.log(results);
 * // [
 * //   { shift: 0, text: 'Khoor Zruog' },
 * //   { shift: 1, text: 'Jgnnq Yqtnf' },
 * //   { shift: 2, text: 'Ifmmp Xpsme' },
 * //   { shift: 3, text: 'Hello World' },
 * //   ...
 * // ]
 *
 * // With scoring function
 * const results = bruteforce('Khoor Zruog', {
 *   scoreFunction: (text) => {
 *     // Simple scoring: count common English words
 *     const commonWords = ['the', 'hello', 'world', 'is', 'a'];
 *     let score = 0;
 *     for (const word of commonWords) {
 *       if (text.toLowerCase().includes(word)) {
 *         score += 1;
 *       }
 *     }
 *     return score;
 *   }
 * });
 * // Results will be sorted by score (highest first)
 *
 * // Limit results
 * const top5 = bruteforce('ciphertext', { maxResults: 5 });
 * ```
 *
 * @throws {Error} If alphabet is empty or contains duplicate characters
 */
export function bruteforce(text: string, options: BruteforceOptions = {}): BruteforceResult[] {
  const { alphabet = DEFAULT_ALPHABET, maxResults, scoreFunction } = options;

  // Validate alphabet
  validateAlphabet(alphabet);

  // Handle empty text
  if (text.length === 0) {
    return [{ shift: 0, text: '' }];
  }

  const results: BruteforceResult[] = [];

  // Try all possible shifts
  for (let shift = 0; shift < alphabet.length; shift++) {
    const decrypted = decrypt(text, shift, {
      alphabet,
      preserveCase: true,
      preserveNonAlpha: true,
    });

    const result: BruteforceResult = {
      shift,
      text: decrypted,
    };

    // Calculate score if scoring function provided
    if (scoreFunction) {
      result.score = scoreFunction(decrypted);
    }

    results.push(result);
  }

  // Sort by score if scoring function was provided (highest score first)
  if (scoreFunction) {
    results.sort((a, b) => {
      const scoreA = a.score ?? 0;
      const scoreB = b.score ?? 0;
      return scoreB - scoreA;
    });
  }

  // Limit results if maxResults specified
  if (maxResults !== undefined && maxResults >= 0) {
    return results.slice(0, maxResults);
  }

  return results;
}
