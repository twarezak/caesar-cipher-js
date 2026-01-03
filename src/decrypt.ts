import type { DecryptOptions } from './types';
import { encrypt } from './encrypt';

/**
 * Decrypts text that was encrypted using the Caesar cipher algorithm
 *
 * This function is equivalent to encrypting with a negative shift value.
 *
 * @param text - The ciphertext to decrypt
 * @param shift - The number of positions that were used to shift each character during encryption
 * @param options - Optional configuration for decryption behavior
 * @returns The decrypted plaintext
 *
 * @example
 * ```typescript
 * // Basic decryption
 * const decrypted = decrypt('Khoor Zruog', 3);
 * console.log(decrypted); // 'Hello World'
 *
 * // With custom alphabet
 * const decrypted = decrypt('ciphertext', 5, {
 *   alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789'
 * });
 *
 * // Must use same alphabet that was used for encryption
 * const encrypted = encrypt('test', 5, { alphabet: 'abc' });
 * const decrypted = decrypt(encrypted, 5, { alphabet: 'abc' });
 * ```
 *
 * @throws {Error} If alphabet is empty or contains duplicate characters
 * @throws {Error} If shift is not a valid integer
 */
export function decrypt(text: string, shift: number, options: DecryptOptions = {}): string {
  // Decryption is just encryption with negative shift
  return encrypt(text, -shift, options);
}
