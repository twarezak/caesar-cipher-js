import { describe, it, expect } from 'vitest';
import {
  encrypt,
  decrypt,
  bruteforce,
  CaesarCipher,
  scoreEnglishText,
  ALPHABET_POLISH_LOWER,
  ALPHABET_ALPHANUMERIC_LOWER,
} from '../src/index';

describe('Integration Tests', () => {
  describe('functional API', () => {
    it('should export all main functions', () => {
      expect(typeof encrypt).toBe('function');
      expect(typeof decrypt).toBe('function');
      expect(typeof bruteforce).toBe('function');
    });

    it('should work with basic encrypt-decrypt flow', () => {
      const plaintext = 'The quick brown fox';
      const shift = 7;

      const encrypted = encrypt(plaintext, shift);
      expect(encrypted).not.toBe(plaintext);

      const decrypted = decrypt(encrypted, shift);
      expect(decrypted).toBe(plaintext);
    });

    it('should work with bruteforce to crack unknown shift', () => {
      const plaintext = 'hello world';
      const shift = 13;
      const encrypted = encrypt(plaintext, shift);

      const results = bruteforce(encrypted, {
        scoreFunction: scoreEnglishText,
        maxResults: 5,
      });

      // Should find correct decryption in results
      const found = results.some((r) => r.text === plaintext);
      expect(found).toBe(true);
    });
  });

  describe('CaesarCipher class', () => {
    it('should work with default settings', () => {
      const cipher = new CaesarCipher();
      const plaintext = 'Hello World';
      const shift = 5;

      const encrypted = cipher.encrypt(plaintext, shift);
      const decrypted = cipher.decrypt(encrypted, shift);

      expect(decrypted).toBe(plaintext);
    });

    it('should work with custom alphabet', () => {
      const cipher = new CaesarCipher({
        alphabet: ALPHABET_ALPHANUMERIC_LOWER,
      });

      const plaintext = 'test123';
      const shift = 7;

      const encrypted = cipher.encrypt(plaintext, shift);
      const decrypted = cipher.decrypt(encrypted, shift);

      expect(decrypted).toBe(plaintext);
    });

    it('should allow changing alphabet dynamically', () => {
      const cipher = new CaesarCipher();

      // Start with default alphabet
      const encrypted1 = cipher.encrypt('abc', 1);
      expect(encrypted1).toBe('bcd');

      // Change to custom alphabet
      cipher.setAlphabet('abcdef');
      const encrypted2 = cipher.encrypt('abc', 1);
      expect(encrypted2).toBe('bcd');

      // Verify alphabet changed
      expect(cipher.getAlphabet()).toBe('abcdef');
    });

    it('should work with preserveCase settings', () => {
      const cipher = new CaesarCipher({ preserveCase: false });

      const encrypted = cipher.encrypt('HeLLo', 3);
      expect(encrypted).toBe('khoor');

      // Change setting
      cipher.setPreserveCase(true);
      const encrypted2 = cipher.encrypt('HeLLo', 3);
      expect(encrypted2).toBe('KhOOr');
    });

    it('should work with preserveNonAlpha settings', () => {
      const cipher = new CaesarCipher({ preserveNonAlpha: false });

      const encrypted = cipher.encrypt('a-b-c', 1);
      expect(encrypted).toBe('bcd');

      // Change setting
      cipher.setPreserveNonAlpha(true);
      const encrypted2 = cipher.encrypt('a-b-c', 1);
      expect(encrypted2).toBe('b-c-d');
    });

    it('should support bruteforce', () => {
      const cipher = new CaesarCipher();
      const plaintext = 'secret';
      const shift = 11;

      const encrypted = cipher.encrypt(plaintext, shift);
      const results = cipher.bruteforce(encrypted);

      // Should include correct decryption
      const correct = results.find((r) => r.shift === shift);
      expect(correct?.text).toBe(plaintext);
    });

    it('should support reset method', () => {
      const cipher = new CaesarCipher();

      // Change settings
      cipher.setAlphabet('abc');
      cipher.setPreserveCase(false);
      cipher.setPreserveNonAlpha(false);

      // Reset to defaults
      cipher.reset();

      // Verify defaults restored
      expect(cipher.getAlphabet()).toBe('abcdefghijklmnopqrstuvwxyz');
      expect(cipher.getPreserveCase()).toBe(true);
      expect(cipher.getPreserveNonAlpha()).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle multi-language text with Polish alphabet', () => {
      const plaintext = 'zażółć gęślą jaźń';
      const shift = 5;

      const encrypted = encrypt(plaintext, shift, {
        alphabet: ALPHABET_POLISH_LOWER,
      });

      const decrypted = decrypt(encrypted, shift, {
        alphabet: ALPHABET_POLISH_LOWER,
      });

      expect(decrypted).toBe(plaintext);
    });

    it('should handle ROT13 encryption (classic use case)', () => {
      const plaintext = 'The quick brown fox jumps over the lazy dog';
      const shift = 13;

      const encrypted = encrypt(plaintext, shift);
      // ROT13 is its own inverse
      const decrypted = encrypt(encrypted, shift);

      expect(decrypted).toBe(plaintext);
    });

    it('should crack encrypted message without knowing shift', () => {
      // Simulate encrypted message from unknown source
      const unknownCiphertext = 'Wkh txlfn eurzq ira';

      const results = bruteforce(unknownCiphertext, {
        scoreFunction: (text) => {
          // Simple scoring based on common English words
          const words = ['the', 'quick', 'brown', 'fox'];
          let score = 0;
          const lowerText = text.toLowerCase();

          for (const word of words) {
            if (lowerText.includes(word)) {
              score += 10;
            }
          }
          return score;
        },
        maxResults: 3,
      });

      // Top result should be the correct decryption
      expect(results[0]?.text.toLowerCase()).toContain('the quick brown fox');
    });

    it('should handle very long text efficiently', () => {
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(
        100,
      );
      const shift = 7;

      const startTime = Date.now();
      const encrypted = encrypt(longText, shift);
      const decrypted = decrypt(encrypted, shift);
      const endTime = Date.now();

      expect(decrypted).toBe(longText);
      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should work with mixed functional and OOP API', () => {
      const cipher = new CaesarCipher();
      const plaintext = 'mixed api test';
      const shift = 9;

      // Encrypt with class
      const encrypted = cipher.encrypt(plaintext, shift);

      // Decrypt with function
      const decrypted = decrypt(encrypted, shift);

      expect(decrypted).toBe(plaintext);
    });

    it('should maintain consistency across all APIs', () => {
      const plaintext = 'consistency test';
      const shift = 12;

      // Functional API
      const encrypted1 = encrypt(plaintext, shift);

      // Class API
      const cipher = new CaesarCipher();
      const encrypted2 = cipher.encrypt(plaintext, shift);

      // Both should produce same result
      expect(encrypted1).toBe(encrypted2);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty strings gracefully', () => {
      const cipher = new CaesarCipher();

      expect(encrypt('', 5)).toBe('');
      expect(decrypt('', 5)).toBe('');
      expect(cipher.encrypt('', 5)).toBe('');
      expect(cipher.decrypt('', 5)).toBe('');
    });

    it('should handle special characters and emojis', () => {
      const text = 'Hello 😀 World! 123';
      const shift = 5;

      const encrypted = encrypt(text, shift);
      const decrypted = decrypt(encrypted, shift);

      expect(decrypted).toBe(text);
    });

    it('should throw appropriate errors for invalid input', () => {
      const cipher = new CaesarCipher();

      // Invalid alphabet
      expect(() => cipher.setAlphabet('')).toThrow('Alphabet cannot be empty');
      expect(() => cipher.setAlphabet('aaa')).toThrow(
        'Alphabet cannot contain duplicate characters',
      );

      // Invalid shift
      expect(() => encrypt('test', NaN)).toThrow('Shift must be a finite number');
      expect(() => decrypt('test', Infinity)).toThrow('Shift must be a finite number');
      expect(() => cipher.encrypt('test', 1.5)).toThrow('Shift must be an integer');
    });
  });

  describe('exported utilities', () => {
    it('should export all alphabet constants', () => {
      expect(ALPHABET_POLISH_LOWER).toBeDefined();
      expect(ALPHABET_ALPHANUMERIC_LOWER).toBeDefined();
      expect(typeof ALPHABET_POLISH_LOWER).toBe('string');
    });

    it('should export scoreEnglishText function', () => {
      expect(typeof scoreEnglishText).toBe('function');

      const score1 = scoreEnglishText('the quick brown fox');
      const score2 = scoreEnglishText('xyz qwp zyx');

      // English text should score higher
      expect(score1).toBeGreaterThan(score2);
    });
  });
});
