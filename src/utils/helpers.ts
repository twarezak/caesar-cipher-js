/**
 * Helper functions for Caesar cipher operations
 */

/**
 * Normalizes the shift value to be within the alphabet length
 * @param shift - The shift value
 * @param alphabetLength - Length of the alphabet
 * @returns Normalized shift value (0 to alphabetLength-1)
 */
export function normalizeShift(shift: number, alphabetLength: number): number {
  if (alphabetLength === 0) {
    throw new Error('Alphabet length must be greater than 0');
  }

  // Handle negative shifts and shifts larger than alphabet length
  const normalized = ((shift % alphabetLength) + alphabetLength) % alphabetLength;
  return normalized;
}

/**
 * Checks if a character is uppercase
 * @param char - Character to check
 * @returns true if character is uppercase
 */
export function isUpperCase(char: string): boolean {
  return char === char.toUpperCase() && char !== char.toLowerCase();
}

/**
 * Shifts a single character by the given amount within the alphabet
 * @param char - Character to shift
 * @param shift - Amount to shift (can be negative)
 * @param alphabet - Alphabet to use
 * @param preserveCase - Whether to preserve the case of the character
 * @returns Shifted character
 */
export function shiftChar(
  char: string,
  shift: number,
  alphabet: string,
  preserveCase: boolean,
): string {
  const wasUpperCase = isUpperCase(char);
  const lowerChar = char.toLowerCase();

  // Find position in alphabet
  const index = alphabet.indexOf(lowerChar);

  // Character not in alphabet - return as is
  if (index === -1) {
    return char;
  }

  // Calculate new position
  const normalizedShift = normalizeShift(shift, alphabet.length);
  const newIndex = (index + normalizedShift) % alphabet.length;
  let shiftedChar = alphabet[newIndex];

  if (shiftedChar === undefined) {
    throw new Error('Invalid alphabet or shift calculation');
  }

  // Preserve original case if needed
  if (preserveCase && wasUpperCase) {
    shiftedChar = shiftedChar.toUpperCase();
  }

  return shiftedChar;
}

/**
 * Validates that the alphabet is valid (non-empty and has unique characters)
 * @param alphabet - Alphabet to validate
 * @throws Error if alphabet is invalid
 */
export function validateAlphabet(alphabet: string): void {
  if (!alphabet || alphabet.length === 0) {
    throw new Error('Alphabet cannot be empty');
  }

  // Check for duplicate characters
  const uniqueChars = new Set(alphabet);
  if (uniqueChars.size !== alphabet.length) {
    throw new Error('Alphabet cannot contain duplicate characters');
  }
}

/**
 * Validates that the shift value is a valid number
 * @param shift - Shift value to validate
 * @throws Error if shift is invalid
 */
export function validateShift(shift: number): void {
  // Check finite first (catches NaN and Infinity)
  if (!Number.isFinite(shift)) {
    throw new Error('Shift must be a finite number');
  }

  if (!Number.isInteger(shift)) {
    throw new Error('Shift must be an integer');
  }
}

/**
 * Simple scoring function based on frequency of common English letters
 * This is a basic heuristic - more sophisticated analysis could be implemented
 * @param text - Text to score
 * @returns Score (higher is better)
 */
export function scoreEnglishText(text: string): number {
  // Common English letters (in order of frequency: etaoin shrdlu)
  const commonLetters = 'etaoinshrdlucmfwypvbgkjqxz';
  const weights = new Map<string, number>();

  // Assign weights based on frequency (most common = highest weight)
  for (let i = 0; i < commonLetters.length; i++) {
    const char = commonLetters[i];
    if (char !== undefined) {
      weights.set(char, commonLetters.length - i);
    }
  }

  let score = 0;
  const lowerText = text.toLowerCase();

  for (const char of lowerText) {
    const weight = weights.get(char);
    if (weight !== undefined) {
      score += weight;
    }
  }

  // Normalize by text length
  return text.length > 0 ? score / text.length : 0;
}
