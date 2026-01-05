import { describe, it, expect } from 'vitest';
import { encrypt } from '../src/encrypt';
import {
  ALPHABET_POLISH_LOWER,
  ALPHABET_ALPHANUMERIC_LOWER,
  ALPHABET_ENGLISH_UPPER,
  ALPHABET_POLISH_UPPER,
  ALPHABET_ALPHANUMERIC_UPPER,
} from '../src/utils/alphabets';

describe('encrypt', () => {
  describe('basic encryption', () => {
    it('should encrypt lowercase text with positive shift', () => {
      expect(encrypt('abc', 1)).toBe('bcd');
      expect(encrypt('xyz', 3)).toBe('abc');
      expect(encrypt('hello', 3)).toBe('khoor');
    });

    it('should encrypt text with ROT13 (shift 13)', () => {
      expect(encrypt('hello', 13)).toBe('uryyb');
      expect(encrypt('uryyb', 13)).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(encrypt('', 5)).toBe('');
    });

    it('should handle zero shift', () => {
      expect(encrypt('hello', 0)).toBe('hello');
      expect(encrypt('Hello World!', 0)).toBe('Hello World!');
    });
  });

  describe('shift normalization', () => {
    it('should handle negative shifts', () => {
      expect(encrypt('abc', -1)).toBe('zab');
      expect(encrypt('hello', -3)).toBe('ebiil');
    });

    it('should handle shifts larger than alphabet length', () => {
      // 26 + 1 = 27, same as shift of 1
      expect(encrypt('abc', 27)).toBe('bcd');
      // 26 + 3 = 29, same as shift of 3
      expect(encrypt('hello', 29)).toBe('khoor');
    });

    it('should handle very large shifts', () => {
      expect(encrypt('abc', 1000)).toBe('mno');
    });
  });

  describe('case preservation', () => {
    it('should preserve uppercase letters by default', () => {
      expect(encrypt('ABC', 1)).toBe('BCD');
      expect(encrypt('Hello', 3)).toBe('Khoor');
      expect(encrypt('HeLLo WoRLd', 5)).toBe('MjQQt BtWQi');
    });

    it('should convert to lowercase when preserveCase is false', () => {
      expect(encrypt('ABC', 1, { preserveCase: false })).toBe('bcd');
      expect(encrypt('Hello', 3, { preserveCase: false })).toBe('khoor');
    });
  });

  describe('non-alphabetic characters', () => {
    it('should preserve spaces and punctuation by default', () => {
      expect(encrypt('hello world', 3)).toBe('khoor zruog');
      expect(encrypt('Hello, World!', 5)).toBe('Mjqqt, Btwqi!');
      expect(encrypt('test-123', 7)).toBe('alza-123');
    });

    it('should remove non-alphabetic characters when preserveNonAlpha is false', () => {
      expect(encrypt('hello world', 3, { preserveNonAlpha: false })).toBe('khoorzruog');
      expect(encrypt('Hello, World!', 5, { preserveNonAlpha: false })).toBe('MjqqtBtwqi');
      expect(encrypt('a-b-c', 1, { preserveNonAlpha: false })).toBe('bcd');
    });
  });

  describe('custom alphabets', () => {
    it('should work with custom alphabet', () => {
      const result = encrypt('abc', 1, { alphabet: 'abcdef' });
      expect(result).toBe('bcd');

      const wrap = encrypt('def', 1, { alphabet: 'abcdef' });
      expect(wrap).toBe('efa');
    });

    it('should work with Polish alphabet', () => {
      const text = 'ąćę';
      const encrypted = encrypt(text, 1, { alphabet: ALPHABET_POLISH_LOWER });
      // ą (pos 1) -> b (pos 2), ć (pos 4) -> d (pos 5), ę (pos 7) -> f (pos 8)
      expect(encrypted).toBe('bdf');
    });

    it('should work with alphanumeric alphabet', () => {
      const text = 'abc123';
      const encrypted = encrypt(text, 3, { alphabet: ALPHABET_ALPHANUMERIC_LOWER });
      expect(encrypted).toBe('def456');
    });

    it('should handle characters not in custom alphabet', () => {
      const result = encrypt('abcXYZ', 1, { alphabet: 'abc' });
      // X, Y, Z are not in the alphabet 'abc', so they are preserved
      expect(result).toBe('bcaXYZ');
    });
  });

  describe('uppercase alphabets (automatic normalization)', () => {
    it('should work with ALPHABET_ENGLISH_UPPER', () => {
      const result = encrypt('Hello World', 3, { alphabet: ALPHABET_ENGLISH_UPPER });
      expect(result).toBe('Khoor Zruog');
    });

    it('should work with ALPHABET_POLISH_UPPER', () => {
      const text = 'ĄĆĘ';
      const encrypted = encrypt(text, 1, { alphabet: ALPHABET_POLISH_UPPER });
      // Ą (pos 1) -> B (pos 2), Ć (pos 4) -> D (pos 5), Ę (pos 7) -> F (pos 8)
      expect(encrypted).toBe('BDF');
    });

    it('should work with ALPHABET_ALPHANUMERIC_UPPER', () => {
      const text = 'ABC123';
      const encrypted = encrypt(text, 3, { alphabet: ALPHABET_ALPHANUMERIC_UPPER });
      expect(encrypted).toBe('DEF456');
    });

    it('should preserve case with uppercase alphabets', () => {
      const result = encrypt('Hello WORLD', 5, {
        alphabet: ALPHABET_ENGLISH_UPPER,
        caseStrategy: 'maintain'
      });
      expect(result).toBe('Mjqqt BTWQI');
    });

    it('should handle mixed case text with uppercase alphabet', () => {
      const result = encrypt('AbC', 1, { alphabet: ALPHABET_ENGLISH_UPPER });
      expect(result).toBe('BcD');
    });
  });

  describe('edge cases', () => {
    it('should handle single character', () => {
      expect(encrypt('a', 1)).toBe('b');
      expect(encrypt('z', 1)).toBe('a');
    });

    it('should handle text with only non-alphabetic characters', () => {
      expect(encrypt('123!@#', 5)).toBe('123!@#');
      expect(encrypt('   ', 10)).toBe('   ');
    });

    it('should handle Unicode characters outside alphabet', () => {
      expect(encrypt('hello 😀 world', 3)).toBe('khoor 😀 zruog');
    });
  });

  describe('validation', () => {
    it('should throw error for empty alphabet', () => {
      expect(() => encrypt('test', 1, { alphabet: '' })).toThrow('Alphabet cannot be empty');
    });

    it('should throw error for alphabet with duplicate characters', () => {
      expect(() => encrypt('test', 1, { alphabet: 'abca' })).toThrow(
        'Alphabet cannot contain duplicate characters',
      );
    });

    it('should throw error for non-integer shift', () => {
      expect(() => encrypt('test', 1.5)).toThrow('Shift must be an integer');
      expect(() => encrypt('test', NaN)).toThrow('Shift must be a finite number');
      expect(() => encrypt('test', Infinity)).toThrow('Shift must be a finite number');
    });
  });

  describe('integration scenarios', () => {
    it('should encrypt complex sentences', () => {
      const plaintext = 'The quick brown fox jumps over the lazy dog';
      const encrypted = encrypt(plaintext, 13);
      expect(encrypted).toBe('Gur dhvpx oebja sbk whzcf bire gur ynml qbt');
    });

    it('should handle mixed options', () => {
      const text = 'Hello World 123!';
      const result = encrypt(text, 5, {
        preserveCase: true,
        preserveNonAlpha: false,
      });
      expect(result).toBe('MjqqtBtwqi');
    });
  });
});
