import { describe, it, expect } from 'vitest';
import { encrypt } from '../src/encrypt';
import { bruteforce } from '../src/bruteforce';
import { scoreEnglishText } from '../src/utils/helpers';

describe('bruteforce', () => {
  describe('basic bruteforce', () => {
    it('should return all possible decryptions', () => {
      const ciphertext = 'abc';
      const results = bruteforce(ciphertext);

      // Should have 26 results (one for each letter in English alphabet)
      expect(results).toHaveLength(26);

      // Should include the original text (shift 0)
      expect(results[0]).toEqual({ shift: 0, text: 'abc' });
    });

    it('should find correct decryption among results', () => {
      const plaintext = 'hello';
      const shift = 7;
      const ciphertext = encrypt(plaintext, shift);
      const results = bruteforce(ciphertext);

      // Find result with matching shift
      const correctResult = results.find((r) => r.shift === shift);
      expect(correctResult).toBeDefined();
      expect(correctResult?.text).toBe(plaintext);
    });

    it('should handle empty text', () => {
      const results = bruteforce('');
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({ shift: 0, text: '' });
    });

    it('should preserve case and non-alphabetic characters', () => {
      const ciphertext = 'Khoor, Zruog!';
      const results = bruteforce(ciphertext);

      expect(results[3]?.text).toBe('Hello, World!');
    });
  });

  describe('with scoring function', () => {
    it('should include scores when scoreFunction is provided', () => {
      const ciphertext = 'khoor';
      const scoreFunction = (text: string): number => {
        return text.includes('hello') ? 100 : 0;
      };

      const results = bruteforce(ciphertext, { scoreFunction });

      // All results should have a score
      for (const result of results) {
        expect(result.score).toBeDefined();
        expect(typeof result.score).toBe('number');
      }
    });

    it('should sort results by score (highest first)', () => {
      const plaintext = 'hello world';
      const shift = 5;
      const ciphertext = encrypt(plaintext, shift);

      const scoreFunction = (text: string): number => {
        // Give high score to text containing "hello" or "world"
        let score = 0;
        if (text.toLowerCase().includes('hello')) {
          score += 100;
        }
        if (text.toLowerCase().includes('world')) {
          score += 100;
        }
        return score;
      };

      const results = bruteforce(ciphertext, { scoreFunction });

      // First result should have the highest score
      expect(results[0]?.score).toBeGreaterThan(0);

      // Results should be sorted by score (descending)
      for (let i = 1; i < results.length; i++) {
        const currentScore = results[i]?.score ?? 0;
        const previousScore = results[i - 1]?.score ?? 0;
        expect(currentScore).toBeLessThanOrEqual(previousScore);
      }

      // The correct plaintext should be first or near first
      const topResult = results[0];
      expect(topResult?.text.toLowerCase()).toContain('hello');
      expect(topResult?.text.toLowerCase()).toContain('world');
    });

    it('should work with built-in scoreEnglishText function', () => {
      const plaintext = 'the quick brown fox';
      const shift = 13;
      const ciphertext = encrypt(plaintext, shift);

      const results = bruteforce(ciphertext, {
        scoreFunction: scoreEnglishText,
      });

      // All results should have scores
      expect(results.every((r) => r.score !== undefined)).toBe(true);

      // Results should be sorted
      for (let i = 1; i < results.length; i++) {
        const currentScore = results[i]?.score ?? 0;
        const previousScore = results[i - 1]?.score ?? 0;
        expect(currentScore).toBeLessThanOrEqual(previousScore);
      }
    });
  });

  describe('maxResults option', () => {
    it('should limit results to maxResults', () => {
      const ciphertext = 'test';
      const results = bruteforce(ciphertext, { maxResults: 5 });

      expect(results).toHaveLength(5);
    });

    it('should return top scored results when combined with scoreFunction', () => {
      const plaintext = 'hello';
      const shift = 3;
      const ciphertext = encrypt(plaintext, shift);

      const scoreFunction = (text: string): number => {
        return text.toLowerCase().includes('hello') ? 100 : 0;
      };

      const results = bruteforce(ciphertext, {
        scoreFunction,
        maxResults: 3,
      });

      expect(results).toHaveLength(3);
      // First result should be the one with highest score
      expect(results[0]?.score).toBe(100);
      expect(results[0]?.text).toBe(plaintext);
    });

    it('should handle maxResults larger than alphabet length', () => {
      const ciphertext = 'abc';
      const results = bruteforce(ciphertext, { maxResults: 100 });

      // Should return all 26 results (alphabet length)
      expect(results).toHaveLength(26);
    });

    it('should handle maxResults of 0', () => {
      const ciphertext = 'abc';
      const results = bruteforce(ciphertext, { maxResults: 0 });

      // maxResults of 0 should return empty array
      expect(results).toHaveLength(0);
    });
  });

  describe('custom alphabets', () => {
    it('should work with custom alphabet', () => {
      const alphabet = 'abcdef';
      const plaintext = 'abc';
      const shift = 2;
      const ciphertext = encrypt(plaintext, shift, { alphabet });

      const results = bruteforce(ciphertext, { alphabet });

      // Should have 6 results (length of custom alphabet)
      expect(results).toHaveLength(6);

      // Should find correct decryption
      const correctResult = results.find((r) => r.shift === shift);
      expect(correctResult?.text).toBe(plaintext);
    });

    it('should work with alphanumeric alphabet', () => {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const plaintext = 'test123';
      const shift = 5;
      const ciphertext = encrypt(plaintext, shift, { alphabet });

      const results = bruteforce(ciphertext, { alphabet });

      // Should have 36 results (26 letters + 10 digits)
      expect(results).toHaveLength(36);

      const correctResult = results.find((r) => r.shift === shift);
      expect(correctResult?.text).toBe(plaintext);
    });
  });

  describe('validation', () => {
    it('should throw error for empty alphabet', () => {
      expect(() => bruteforce('test', { alphabet: '' })).toThrow('Alphabet cannot be empty');
    });

    it('should throw error for alphabet with duplicate characters', () => {
      expect(() => bruteforce('test', { alphabet: 'abca' })).toThrow(
        'Alphabet cannot contain duplicate characters',
      );
    });
  });

  describe('real-world scenarios', () => {
    it('should successfully bruteforce a ROT13 encrypted message', () => {
      const plaintext = 'secret message';
      const ciphertext = encrypt(plaintext, 13);
      const results = bruteforce(ciphertext);

      const correctResult = results.find((r) => r.shift === 13);
      expect(correctResult?.text).toBe(plaintext);
    });

    it('should find most likely decryption with scoring', () => {
      const plaintext = 'attack at dawn';
      const shift = 7;
      const ciphertext = encrypt(plaintext, shift);

      const scoreFunction = (text: string): number => {
        // Simple word-based scoring
        const commonWords = ['the', 'attack', 'at', 'dawn', 'is', 'a', 'be'];
        let score = 0;
        const lowerText = text.toLowerCase();

        for (const word of commonWords) {
          if (lowerText.includes(word)) {
            score += 10;
          }
        }
        return score;
      };

      const results = bruteforce(ciphertext, {
        scoreFunction,
        maxResults: 5,
      });

      // The correct decryption should be in top results
      const hasCorrectDecryption = results.some((r) => r.text === plaintext);
      expect(hasCorrectDecryption).toBe(true);
    });

    it('should handle mixed case and punctuation', () => {
      const plaintext = 'The Quick Brown Fox Jumps Over The Lazy Dog!';
      const shift = 17;
      const ciphertext = encrypt(plaintext, shift);

      const results = bruteforce(ciphertext);
      const correctResult = results.find((r) => r.shift === shift);

      expect(correctResult?.text).toBe(plaintext);
    });
  });

  describe('performance', () => {
    it('should handle reasonably long text efficiently', () => {
      const plaintext = 'Lorem ipsum dolor sit amet '.repeat(10);
      const shift = 11;
      const ciphertext = encrypt(plaintext, shift);

      const startTime = Date.now();
      const results = bruteforce(ciphertext);
      const endTime = Date.now();

      // Should complete in reasonable time (< 100ms for this text length)
      expect(endTime - startTime).toBeLessThan(100);

      // Should still find correct result
      const correctResult = results.find((r) => r.shift === shift);
      expect(correctResult?.text).toBe(plaintext);
    });
  });
});
