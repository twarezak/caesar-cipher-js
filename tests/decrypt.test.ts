import { describe, it, expect } from 'vitest';
import { encrypt } from '../src/encrypt';
import { decrypt } from '../src/decrypt';
import {
  ALPHABET_POLISH_LOWER,
  ALPHABET_ALPHANUMERIC_LOWER,
} from '../src/utils/alphabets';

describe('decrypt', () => {
  describe('basic decryption', () => {
    it('should decrypt ciphertext with positive shift', () => {
      expect(decrypt('bcd', 1)).toBe('abc');
      expect(decrypt('abc', 3)).toBe('xyz');
      expect(decrypt('khoor', 3)).toBe('hello');
    });

    it('should decrypt ROT13 encrypted text', () => {
      expect(decrypt('uryyb', 13)).toBe('hello');
      expect(decrypt('hello', 13)).toBe('uryyb');
    });

    it('should handle empty string', () => {
      expect(decrypt('', 5)).toBe('');
    });

    it('should handle zero shift', () => {
      expect(decrypt('hello', 0)).toBe('hello');
      expect(decrypt('Hello World!', 0)).toBe('Hello World!');
    });
  });

  describe('encrypt-decrypt symmetry', () => {
    it('should reverse encryption with same shift', () => {
      const plaintext = 'hello world';
      const shift = 7;
      const encrypted = encrypt(plaintext, shift);
      const decrypted = decrypt(encrypted, shift);
      expect(decrypted).toBe(plaintext);
    });

    it('should work with various shift values', () => {
      const plaintext = 'The Quick Brown Fox';
      const shifts = [1, 5, 13, 25, 100];

      for (const shift of shifts) {
        const encrypted = encrypt(plaintext, shift);
        const decrypted = decrypt(encrypted, shift);
        expect(decrypted).toBe(plaintext);
      }
    });

    it('should work with negative shifts', () => {
      const plaintext = 'test message';
      const encrypted = encrypt(plaintext, -5);
      const decrypted = decrypt(encrypted, -5);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('case preservation', () => {
    it('should preserve uppercase letters by default', () => {
      expect(decrypt('BCD', 1)).toBe('ABC');
      expect(decrypt('Khoor', 3)).toBe('Hello');
      expect(decrypt('MJQQT BTWQI', 5)).toBe('HELLO WORLD');
    });

    it('should convert to lowercase when preserveCase is false', () => {
      const encrypted = encrypt('HELLO', 3);
      const decrypted = decrypt(encrypted, 3, { preserveCase: false });
      expect(decrypted).toBe('hello');
    });

    it('should maintain symmetry with preserveCase option', () => {
      const plaintext = 'HeLLo WoRLd';
      const encrypted = encrypt(plaintext, 7, { preserveCase: true });
      const decrypted = decrypt(encrypted, 7, { preserveCase: true });
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('non-alphabetic characters', () => {
    it('should preserve spaces and punctuation by default', () => {
      expect(decrypt('khoor zruog', 3)).toBe('hello world');
      expect(decrypt('Mjqqt, Btwqi!', 5)).toBe('Hello, World!');
      expect(decrypt('alza-123', 7)).toBe('test-123');
    });

    it('should handle text with only non-alphabetic characters', () => {
      expect(decrypt('123!@#', 5)).toBe('123!@#');
    });
  });

  describe('custom alphabets', () => {
    it('should work with custom alphabet', () => {
      const alphabet = 'abcdef';
      const plaintext = 'abc';
      const encrypted = encrypt(plaintext, 1, { alphabet });
      const decrypted = decrypt(encrypted, 1, { alphabet });
      expect(decrypted).toBe(plaintext);
    });

    it('should work with Polish alphabet', () => {
      const alphabet = ALPHABET_POLISH_LOWER;
      const plaintext = 'zażółć gęślą jaźń';
      const encrypted = encrypt(plaintext, 5, { alphabet });
      const decrypted = decrypt(encrypted, 5, { alphabet });
      expect(decrypted).toBe(plaintext);
    });

    it('should work with alphanumeric alphabet', () => {
      const alphabet = ALPHABET_ALPHANUMERIC_LOWER;
      const plaintext = 'test123abc';
      const encrypted = encrypt(plaintext, 7, { alphabet });
      const decrypted = decrypt(encrypted, 7, { alphabet });
      expect(decrypted).toBe(plaintext);
    });

    it('should fail if different alphabet is used for decryption', () => {
      const encrypted = encrypt('abc', 1, { alphabet: 'abc' });
      const decrypted = decrypt(encrypted, 1, { alphabet: 'abcdef' });
      // Result will be incorrect if alphabet doesn't match
      expect(decrypted).not.toBe('abc');
    });
  });

  describe('edge cases', () => {
    it('should handle single character', () => {
      expect(decrypt('b', 1)).toBe('a');
      expect(decrypt('a', 1)).toBe('z');
    });

    it('should handle very long text', () => {
      const plaintext = 'a'.repeat(10000);
      const encrypted = encrypt(plaintext, 5);
      const decrypted = decrypt(encrypted, 5);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('validation', () => {
    it('should throw error for empty alphabet', () => {
      expect(() => decrypt('test', 1, { alphabet: '' })).toThrow('Alphabet cannot be empty');
    });

    it('should throw error for alphabet with duplicate characters', () => {
      expect(() => decrypt('test', 1, { alphabet: 'abca' })).toThrow(
        'Alphabet cannot contain duplicate characters',
      );
    });

    it('should throw error for non-integer shift', () => {
      expect(() => decrypt('test', 1.5)).toThrow('Shift must be an integer');
      expect(() => decrypt('test', NaN)).toThrow('Shift must be a finite number');
      expect(() => decrypt('test', Infinity)).toThrow('Shift must be a finite number');
    });
  });

  describe('real-world scenarios', () => {
    it('should decrypt messages encrypted with various shifts', () => {
      const testCases = [
        { plaintext: 'attack at dawn', shift: 3 },
        { plaintext: 'The secret code is 1234', shift: 13 },
        { plaintext: 'CONFIDENTIAL', shift: 25 },
      ];

      for (const { plaintext, shift } of testCases) {
        const encrypted = encrypt(plaintext, shift);
        const decrypted = decrypt(encrypted, shift);
        expect(decrypted).toBe(plaintext);
      }
    });

    it('should handle complex options combination', () => {
      const plaintext = 'Hello World 123!';
      const options = {
        preserveCase: true,
        preserveNonAlpha: true,
      };
      const encrypted = encrypt(plaintext, 7, options);
      const decrypted = decrypt(encrypted, 7, options);
      expect(decrypted).toBe(plaintext);
    });
  });
});
