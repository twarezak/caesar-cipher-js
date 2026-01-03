/**
 * Scoring functions for different languages
 * Used to evaluate the likelihood of correct decryption
 */

import type { LanguageFrequencyData } from './languageData';
import { getLanguageFrequency, type SupportedLanguage } from './languageData';

/**
 * Generic scoring function based on letter frequency and common words
 * @param text - Text to score
 * @param freqData - Language frequency data
 * @returns Score (higher is better)
 */
export function scoreText(text: string, freqData: LanguageFrequencyData): number {
  if (!text) return 0;

  let score = 0;
  const upperText = text.toUpperCase();

  // Score letter frequency
  for (let i = 0; i < upperText.length; i++) {
    const char = upperText[i];
    if (char !== undefined && /[A-ZĄĆĘŁŃÓŚŹŻÄÖÜÑÉÈÊËÎÏÔŒÙÛŸÇ]/i.test(char)) {
      const freqIndex = freqData.letters.indexOf(char);
      if (freqIndex !== -1) {
        // More common letters get higher scores
        score += (freqData.letters.length - freqIndex) / freqData.letters.length;
      }
    }
  }

  // Score common words
  if (freqData.commonWords) {
    for (const word of freqData.commonWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = upperText.match(regex);
      if (matches) {
        score += matches.length * 5; // Boost score for common words
      }
    }
  }

  // Add points for reasonable word length distribution
  const spaces = (upperText.match(/ /g) || []).length;
  if (spaces > 0) {
    // Texts with reasonable spacing get higher scores
    const wordLength = upperText.length / (spaces + 1);
    if (wordLength >= 3 && wordLength <= 7) {
      score += 3;
    }
  }

  return score;
}

/**
 * Score English text
 * @param text - Text to score
 * @returns Score (higher is better)
 */
export function scoreEnglishText(text: string): number {
  return scoreText(text, getLanguageFrequency('english'));
}

/**
 * Score Polish text
 * @param text - Text to score
 * @returns Score (higher is better)
 */
export function scorePolishText(text: string): number {
  return scoreText(text, getLanguageFrequency('polish'));
}

/**
 * Score German text
 * @param text - Text to score
 * @returns Score (higher is better)
 */
export function scoreGermanText(text: string): number {
  return scoreText(text, getLanguageFrequency('german'));
}

/**
 * Score Spanish text
 * @param text - Text to score
 * @returns Score (higher is better)
 */
export function scoreSpanishText(text: string): number {
  return scoreText(text, getLanguageFrequency('spanish'));
}

/**
 * Score French text
 * @param text - Text to score
 * @returns Score (higher is better)
 */
export function scoreFrenchText(text: string): number {
  return scoreText(text, getLanguageFrequency('french'));
}

/**
 * Get scoring function for a specific language
 * @param language - Language identifier
 * @returns Scoring function for that language
 */
export function getScoreFunction(language: SupportedLanguage): (text: string) => number {
  const scoreFunctions: Record<SupportedLanguage, (text: string) => number> = {
    english: scoreEnglishText,
    polish: scorePolishText,
    german: scoreGermanText,
    spanish: scoreSpanishText,
    french: scoreFrenchText,
  };

  return scoreFunctions[language] ?? scoreEnglishText;
}
