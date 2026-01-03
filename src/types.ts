/**
 * Case handling strategy
 */
export type CaseStrategy = 'maintain' | 'upper' | 'lower';

/**
 * Options for encryption operations
 */
export interface EncryptOptions {
  /**
   * Custom alphabet to use for encryption.
   * If not provided, defaults to lowercase Latin alphabet (a-z).
   */
  alphabet?: string;

  /**
   * Whether to preserve the case of letters during encryption.
   * @default true
   * @deprecated Use caseStrategy instead
   */
  preserveCase?: boolean;

  /**
   * Strategy for handling letter case
   * - 'maintain': Preserve original case (default)
   * - 'upper': Convert all output to uppercase
   * - 'lower': Convert all output to lowercase
   * @default 'maintain'
   */
  caseStrategy?: CaseStrategy;

  /**
   * Whether to preserve characters that are not in the alphabet.
   * @default true
   * @deprecated Use preserveSpaces and preserveSpecialChars instead for finer control
   */
  preserveNonAlpha?: boolean;

  /**
   * Whether to preserve spaces in the output
   * @default true
   */
  preserveSpaces?: boolean;

  /**
   * Whether to preserve special characters (non-alphabetic, non-space)
   * @default true
   */
  preserveSpecialChars?: boolean;

  /**
   * Language for diacritics mapping (e.g., 'french')
   * If provided, characters with diacritics will be mapped to base letters
   */
  diacriticsLanguage?: string;
}

/**
 * Options for decryption operations
 */
export interface DecryptOptions {
  /**
   * Custom alphabet to use for decryption.
   * Must match the alphabet used during encryption.
   */
  alphabet?: string;

  /**
   * Whether to preserve the case of letters during decryption.
   * @default true
   * @deprecated Use caseStrategy instead
   */
  preserveCase?: boolean;

  /**
   * Strategy for handling letter case
   * - 'maintain': Preserve original case (default)
   * - 'upper': Convert all output to uppercase
   * - 'lower': Convert all output to lowercase
   * @default 'maintain'
   */
  caseStrategy?: CaseStrategy;

  /**
   * Whether to preserve characters that are not in the alphabet.
   * @default true
   * @deprecated Use preserveSpaces and preserveSpecialChars instead for finer control
   */
  preserveNonAlpha?: boolean;

  /**
   * Whether to preserve spaces in the output
   * @default true
   */
  preserveSpaces?: boolean;

  /**
   * Whether to preserve special characters (non-alphabetic, non-space)
   * @default true
   */
  preserveSpecialChars?: boolean;

  /**
   * Language for diacritics mapping (e.g., 'french')
   * If provided, characters with diacritics will be mapped to base letters
   */
  diacriticsLanguage?: string;
}

/**
 * Function that scores text to determine likelihood of correct decryption
 */
export type ScoreFunction = (text: string) => number;

/**
 * Options for bruteforce decryption operations
 */
export interface BruteforceOptions {
  /**
   * Custom alphabet to use for bruteforce.
   * If not provided, defaults to lowercase Latin alphabet (a-z).
   */
  alphabet?: string;

  /**
   * Maximum number of results to return.
   * If not provided, returns all possible results.
   */
  maxResults?: number;

  /**
   * Function to score the likelihood of each decrypted text.
   * Results will be sorted by score in descending order.
   * If not provided, results are returned in order of shift value.
   */
  scoreFunction?: ScoreFunction;
}

/**
 * Result of a bruteforce decryption attempt
 */
export interface BruteforceResult {
  /**
   * The shift value used for this result
   */
  shift: number;

  /**
   * The decrypted text with this shift value
   */
  text: string;

  /**
   * Optional score indicating likelihood of correct decryption
   * (only present if scoreFunction was provided)
   */
  score?: number;
}

/**
 * Options for CaesarCipher class constructor
 */
export interface CipherOptions {
  /**
   * Custom alphabet to use for all operations.
   * If not provided, defaults to lowercase Latin alphabet (a-z).
   */
  alphabet?: string;

  /**
   * Whether to preserve the case of letters.
   * @default true
   * @deprecated Use caseStrategy instead
   */
  preserveCase?: boolean;

  /**
   * Strategy for handling letter case
   * - 'maintain': Preserve original case (default)
   * - 'upper': Convert all output to uppercase
   * - 'lower': Convert all output to lowercase
   * @default 'maintain'
   */
  caseStrategy?: CaseStrategy;

  /**
   * Whether to preserve characters that are not in the alphabet.
   * @default true
   * @deprecated Use preserveSpaces and preserveSpecialChars instead for finer control
   */
  preserveNonAlpha?: boolean;

  /**
   * Whether to preserve spaces in the output
   * @default true
   */
  preserveSpaces?: boolean;

  /**
   * Whether to preserve special characters (non-alphabetic, non-space)
   * @default true
   */
  preserveSpecialChars?: boolean;

  /**
   * Language for diacritics mapping (e.g., 'french')
   * If provided, characters with diacritics will be mapped to base letters
   */
  diacriticsLanguage?: string;
}
