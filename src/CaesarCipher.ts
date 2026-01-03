import type { CipherOptions, BruteforceResult, CaseStrategy } from './types';
import { encrypt } from './encrypt';
import { decrypt } from './decrypt';
import { bruteforce } from './bruteforce';
import { DEFAULT_ALPHABET } from './utils/alphabets';
import { validateAlphabet } from './utils/helpers';

/**
 * Object-oriented interface for Caesar cipher operations
 *
 * This class provides a stateful alternative to the functional API,
 * allowing you to configure cipher settings once and reuse them.
 *
 * @example
 * ```typescript
 * // Create cipher with default settings
 * const cipher = new CaesarCipher();
 * const encrypted = cipher.encrypt('Hello', 3);
 * const decrypted = cipher.decrypt(encrypted, 3);
 *
 * // Create cipher with custom alphabet
 * const customCipher = new CaesarCipher({
 *   alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
 *   preserveCase: true
 * });
 * const result = customCipher.encrypt('test123', 5);
 *
 * // Change alphabet on the fly
 * cipher.setAlphabet('abcdef');
 * ```
 */
export class CaesarCipher {
  private alphabet: string;
  private preserveCase: boolean;
  private preserveNonAlpha: boolean;
  private caseStrategy: CaseStrategy;
  private preserveSpaces: boolean;
  private preserveSpecialChars: boolean;
  private diacriticsLanguage?: string;

  /**
   * Creates a new CaesarCipher instance
   *
   * @param options - Configuration options for the cipher
   * @throws {Error} If alphabet is empty or contains duplicate characters
   */
  constructor(options: CipherOptions = {}) {
    const {
      alphabet = DEFAULT_ALPHABET,
      preserveCase = true,
      preserveNonAlpha = true,
      caseStrategy = preserveCase === false ? 'lower' : 'maintain',
      preserveSpaces = preserveNonAlpha,
      preserveSpecialChars = preserveNonAlpha,
      diacriticsLanguage,
    } = options;

    // Validate alphabet
    validateAlphabet(alphabet);

    this.alphabet = alphabet;
    this.preserveCase = preserveCase;
    this.preserveNonAlpha = preserveNonAlpha;
    this.caseStrategy = caseStrategy;
    this.preserveSpaces = preserveSpaces;
    this.preserveSpecialChars = preserveSpecialChars;
    this.diacriticsLanguage = diacriticsLanguage;
  }

  /**
   * Encrypts text using the configured settings
   *
   * @param text - The plaintext to encrypt
   * @param shift - The number of positions to shift each character
   * @returns The encrypted text
   * @throws {Error} If shift is not a valid integer
   *
   * @example
   * ```typescript
   * const cipher = new CaesarCipher();
   * const encrypted = cipher.encrypt('Hello', 3);
   * console.log(encrypted); // 'Khoor'
   * ```
   */
  encrypt(text: string, shift: number): string {
    return encrypt(text, shift, {
      alphabet: this.alphabet,
      caseStrategy: this.caseStrategy,
      preserveSpaces: this.preserveSpaces,
      preserveSpecialChars: this.preserveSpecialChars,
      diacriticsLanguage: this.diacriticsLanguage,
    });
  }

  /**
   * Decrypts text using the configured settings
   *
   * @param text - The ciphertext to decrypt
   * @param shift - The shift value that was used during encryption
   * @returns The decrypted plaintext
   * @throws {Error} If shift is not a valid integer
   *
   * @example
   * ```typescript
   * const cipher = new CaesarCipher();
   * const decrypted = cipher.decrypt('Khoor', 3);
   * console.log(decrypted); // 'Hello'
   * ```
   */
  decrypt(text: string, shift: number): string {
    return decrypt(text, shift, {
      alphabet: this.alphabet,
      caseStrategy: this.caseStrategy,
      preserveSpaces: this.preserveSpaces,
      preserveSpecialChars: this.preserveSpecialChars,
      diacriticsLanguage: this.diacriticsLanguage,
    });
  }

  /**
   * Attempts to decrypt text by trying all possible shift values
   *
   * @param text - The ciphertext to decrypt
   * @param maxResults - Optional limit on number of results to return
   * @returns Array of possible decryption results
   *
   * @example
   * ```typescript
   * const cipher = new CaesarCipher();
   * const results = cipher.bruteforce('Khoor');
   * // Find the result that looks like English text
   * const correctResult = results.find(r => r.text === 'Hello');
   * ```
   */
  bruteforce(text: string, maxResults?: number): BruteforceResult[] {
    return bruteforce(text, {
      alphabet: this.alphabet,
      maxResults,
    });
  }

  /**
   * Changes the alphabet used for encryption/decryption
   *
   * @param alphabet - The new alphabet to use
   * @throws {Error} If alphabet is empty or contains duplicate characters
   *
   * @example
   * ```typescript
   * const cipher = new CaesarCipher();
   * cipher.setAlphabet('abcdefghijklmnopqrstuvwxyz0123456789');
   * ```
   */
  setAlphabet(alphabet: string): void {
    validateAlphabet(alphabet);
    this.alphabet = alphabet;
  }

  /**
   * Gets the current alphabet
   *
   * @returns The current alphabet string
   */
  getAlphabet(): string {
    return this.alphabet;
  }

  /**
   * Sets whether to preserve letter case during encryption/decryption
   *
   * @param preserve - true to preserve case, false otherwise
   * @deprecated Use setCaseStrategy instead
   */
  setPreserveCase(preserve: boolean): void {
    this.preserveCase = preserve;
    this.caseStrategy = preserve ? 'maintain' : 'lower';
  }

  /**
   * Gets the current preserveCase setting
   *
   * @returns true if case is preserved, false otherwise
   * @deprecated Use getCaseStrategy instead
   */
  getPreserveCase(): boolean {
    return this.preserveCase;
  }

  /**
   * Sets whether to preserve non-alphabetic characters during encryption/decryption
   *
   * @param preserve - true to preserve non-alphabetic characters, false otherwise
   * @deprecated Use setPreserveSpaces and setPreserveSpecialChars instead
   */
  setPreserveNonAlpha(preserve: boolean): void {
    this.preserveNonAlpha = preserve;
    this.preserveSpaces = preserve;
    this.preserveSpecialChars = preserve;
  }

  /**
   * Gets the current preserveNonAlpha setting
   *
   * @returns true if non-alphabetic characters are preserved, false otherwise
   * @deprecated Use getPreserveSpaces and getPreserveSpecialChars instead
   */
  getPreserveNonAlpha(): boolean {
    return this.preserveNonAlpha;
  }

  /**
   * Sets the case handling strategy
   *
   * @param strategy - The case strategy to use ('maintain', 'upper', or 'lower')
   */
  setCaseStrategy(strategy: CaseStrategy): void {
    this.caseStrategy = strategy;
    this.preserveCase = strategy === 'maintain';
  }

  /**
   * Gets the current case strategy
   *
   * @returns The current case strategy
   */
  getCaseStrategy(): CaseStrategy {
    return this.caseStrategy;
  }

  /**
   * Sets whether to preserve spaces
   *
   * @param preserve - true to preserve spaces, false otherwise
   */
  setPreserveSpaces(preserve: boolean): void {
    this.preserveSpaces = preserve;
  }

  /**
   * Gets the current preserveSpaces setting
   *
   * @returns true if spaces are preserved, false otherwise
   */
  getPreserveSpaces(): boolean {
    return this.preserveSpaces;
  }

  /**
   * Sets whether to preserve special characters
   *
   * @param preserve - true to preserve special characters, false otherwise
   */
  setPreserveSpecialChars(preserve: boolean): void {
    this.preserveSpecialChars = preserve;
  }

  /**
   * Gets the current preserveSpecialChars setting
   *
   * @returns true if special characters are preserved, false otherwise
   */
  getPreserveSpecialChars(): boolean {
    return this.preserveSpecialChars;
  }

  /**
   * Sets the language for diacritics mapping
   *
   * @param language - Language identifier (e.g., 'french') or undefined to disable
   */
  setDiacriticsLanguage(language: string | undefined): void {
    this.diacriticsLanguage = language;
  }

  /**
   * Gets the current diacritics language setting
   *
   * @returns The language identifier or undefined
   */
  getDiacriticsLanguage(): string | undefined {
    return this.diacriticsLanguage;
  }

  /**
   * Resets all settings to their default values
   */
  reset(): void {
    this.alphabet = DEFAULT_ALPHABET;
    this.preserveCase = true;
    this.preserveNonAlpha = true;
    this.caseStrategy = 'maintain';
    this.preserveSpaces = true;
    this.preserveSpecialChars = true;
    this.diacriticsLanguage = undefined;
  }
}
