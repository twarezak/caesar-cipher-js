# Caesar Cipher JS

[![npm version](https://img.shields.io/npm/v/caesar-cipher-js.svg)](https://www.npmjs.com/package/caesar-cipher-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight JavaScript/TypeScript library for Caesar cipher encryption, decryption, and bruteforce attacks. Zero dependencies, works in Node.js and browsers.

## Features

- ✅ **Encrypt and decrypt** text using Caesar cipher
- ✅ **Bruteforce decryption** when shift key is unknown
- ✅ **Custom alphabets** support (Polish, alphanumeric, or your own)
- ✅ **TypeScript support** with full type definitions
- ✅ **Dual API** - functional and object-oriented
- ✅ **Zero dependencies** - lightweight and fast
- ✅ **Multiple formats** - ESM, CommonJS, UMD
- ✅ **100% test coverage** - thoroughly tested

## Installation

```bash
npm install caesar-cipher-js
```

Or with yarn:

```bash
yarn add caesar-cipher-js
```

## Quick Start

```typescript
import { encrypt, decrypt, bruteforce } from 'caesar-cipher-js';

// Encrypt text
const encrypted = encrypt('Hello World', 3);
console.log(encrypted); // 'Khoor Zruog'

// Decrypt text
const decrypted = decrypt('Khoor Zruog', 3);
console.log(decrypted); // 'Hello World'

// Bruteforce when shift is unknown
const results = bruteforce('Khoor Zruog');
console.log(results[3]); // { shift: 3, text: 'Hello World' }
```

## API Documentation

### Functional API

#### `encrypt(text, shift, options?)`

Encrypts text using the Caesar cipher algorithm.

**Parameters:**
- `text` (string) - The plaintext to encrypt
- `shift` (number) - The number of positions to shift (can be negative)
- `options` (object, optional)
  - `alphabet` (string) - Custom alphabet (default: 'a-z')
  - `preserveCase` (boolean) - Preserve letter case (default: true)
  - `preserveNonAlpha` (boolean) - Keep non-alphabetic characters (default: true)

**Returns:** Encrypted string

**Example:**

```typescript
import { encrypt } from 'caesar-cipher-js';

// Basic encryption
encrypt('abc', 1); // 'bcd'

// With options
encrypt('Hello World!', 5, {
  preserveCase: true,
  preserveNonAlpha: true
}); // 'Mjqqt Btwqi!'

// Custom alphabet
encrypt('test123', 3, {
  alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789'
}); // 'whvw456'
```

#### `decrypt(text, shift, options?)`

Decrypts text encrypted with Caesar cipher.

**Parameters:**
- `text` (string) - The ciphertext to decrypt
- `shift` (number) - The shift value used during encryption
- `options` (object, optional) - Same as encrypt

**Returns:** Decrypted string

**Example:**

```typescript
import { decrypt } from 'caesar-cipher-js';

decrypt('Khoor', 3); // 'Hello'
decrypt('MJQQT', 5); // 'HELLO'
```

#### `bruteforce(text, options?)`

Attempts to decrypt text by trying all possible shift values.

**Parameters:**
- `text` (string) - The ciphertext to decrypt
- `options` (object, optional)
  - `alphabet` (string) - Custom alphabet
  - `maxResults` (number) - Limit number of results
  - `scoreFunction` (function) - Custom scoring function for ranking results

**Returns:** Array of `{ shift, text, score? }` objects

**Example:**

```typescript
import { bruteforce, scoreEnglishText } from 'caesar-cipher-js';

// Basic bruteforce
const results = bruteforce('Khoor');
// Returns all 26 possible decryptions

// With scoring to find most likely result
const scored = bruteforce('Khoor Zruog', {
  scoreFunction: scoreEnglishText,
  maxResults: 5
});
// Returns top 5 results sorted by likelihood
```

### Object-Oriented API

#### `CaesarCipher` class

Provides a stateful alternative to the functional API.

**Constructor:**

```typescript
import { CaesarCipher } from 'caesar-cipher-js';

const cipher = new CaesarCipher({
  alphabet: 'abcdefghijklmnopqrstuvwxyz',
  preserveCase: true,
  preserveNonAlpha: true
});
```

**Methods:**
- `encrypt(text, shift)` - Encrypt text
- `decrypt(text, shift)` - Decrypt text
- `bruteforce(text, maxResults?)` - Bruteforce decrypt
- `setAlphabet(alphabet)` - Change alphabet
- `getAlphabet()` - Get current alphabet
- `setPreserveCase(preserve)` - Set case preservation
- `getPreserveCase()` - Get case preservation setting
- `setPreserveNonAlpha(preserve)` - Set non-alpha preservation
- `getPreserveNonAlpha()` - Get non-alpha preservation setting
- `reset()` - Reset to default settings

**Example:**

```typescript
import { CaesarCipher } from 'caesar-cipher-js';

const cipher = new CaesarCipher();

const encrypted = cipher.encrypt('Hello', 3);
// 'Khoor'

const decrypted = cipher.decrypt(encrypted, 3);
// 'Hello'

// Change alphabet
cipher.setAlphabet('abcdefghijklmnopqrstuvwxyz0123456789');
cipher.encrypt('test123', 5);
// 'yjxy678'
```

## Advanced Usage

### Custom Alphabets

The library supports custom alphabets, including:

```typescript
import {
  encrypt,
  ALPHABET_POLISH_LOWER,
  ALPHABET_ALPHANUMERIC_LOWER
} from 'caesar-cipher-js';

// Polish alphabet
const polishText = 'zażółć gęślą jaźń';
const encrypted = encrypt(polishText, 5, {
  alphabet: ALPHABET_POLISH_LOWER
});

// Alphanumeric
const mixed = 'abc123';
encrypt(mixed, 3, {
  alphabet: ALPHABET_ALPHANUMERIC_LOWER
}); // 'def456'

// Custom alphabet
encrypt('hello', 2, {
  alphabet: 'abcdefghijklmnopqrstuvwxyz!@#$%'
});
```

**Available predefined alphabets:**
- `ALPHABET_ENGLISH_LOWER` - a-z
- `ALPHABET_ENGLISH_UPPER` - A-Z
- `ALPHABET_POLISH_LOWER` - Polish lowercase with special characters
- `ALPHABET_POLISH_UPPER` - Polish uppercase with special characters
- `ALPHABET_ALPHANUMERIC_LOWER` - a-z + 0-9
- `ALPHABET_ALPHANUMERIC_UPPER` - A-Z + 0-9

### Bruteforce with Custom Scoring

Create a custom scoring function to improve bruteforce accuracy:

```typescript
import { bruteforce } from 'caesar-cipher-js';

const customScore = (text) => {
  const commonWords = ['the', 'and', 'is', 'to', 'a'];
  let score = 0;
  const lower = text.toLowerCase();

  for (const word of commonWords) {
    if (lower.includes(word)) {
      score += 10;
    }
  }

  return score;
};

const results = bruteforce('encrypted text', {
  scoreFunction: customScore,
  maxResults: 3
});

// Results sorted by score (highest first)
console.log(results[0].text); // Most likely decryption
```

### ROT13 Encoding

ROT13 is a special case of Caesar cipher with shift 13:

```typescript
import { encrypt } from 'caesar-cipher-js';

const rot13 = (text) => encrypt(text, 13);

const encoded = rot13('Hello World');
// 'Uryyb Jbeyq'

// ROT13 is its own inverse
const decoded = rot13(encoded);
// 'Hello World'
```

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import type {
  EncryptOptions,
  DecryptOptions,
  BruteforceOptions,
  BruteforceResult,
  CipherOptions,
  ScoreFunction
} from 'caesar-cipher-js';

const options: EncryptOptions = {
  alphabet: 'abc',
  preserveCase: true,
  preserveNonAlpha: false
};

const scoreFunc: ScoreFunction = (text: string): number => {
  return text.length;
};
```

## Browser Usage

The library works in browsers via CDN:

```html
<script src="https://unpkg.com/caesar-cipher-js"></script>
<script>
  const { encrypt, decrypt } = CaesarCipherJS;

  const encrypted = encrypt('Hello', 3);
  console.log(encrypted); // 'Khoor'
</script>
```

Or with ES modules:

```html
<script type="module">
  import { encrypt } from 'https://unpkg.com/caesar-cipher-js/dist/index.mjs';

  console.log(encrypt('Hello', 3));
</script>
```

## Performance

The library is optimized for performance:

- Encrypting 1MB of text: ~50ms
- Bruteforce attack (26 attempts): ~10ms
- Zero dependencies for minimal bundle size
- Minified size: < 5KB

## Examples

### Example 1: Secure Message

```typescript
import { encrypt, decrypt } from 'caesar-cipher-js';

const secret = 'Attack at dawn';
const key = 17;

const encrypted = encrypt(secret, key);
// Send encrypted message...

// Receiver decrypts:
const message = decrypt(encrypted, key);
console.log(message); // 'Attack at dawn'
```

### Example 2: Crack Encrypted Message

```typescript
import { bruteforce, scoreEnglishText } from 'caesar-cipher-js';

const intercepted = 'Wkh txlfn eurzq ira';

const results = bruteforce(intercepted, {
  scoreFunction: scoreEnglishText,
  maxResults: 1
});

console.log(results[0].text);
// 'The quick brown fox'
console.log(results[0].shift);
// 3
```

### Example 3: Multi-Language Support

```typescript
import { CaesarCipher, ALPHABET_POLISH_LOWER } from 'caesar-cipher-js';

const cipher = new CaesarCipher({
  alphabet: ALPHABET_POLISH_LOWER
});

const encrypted = cipher.encrypt('Łódź', 7);
const decrypted = cipher.decrypt(encrypted, 7);
console.log(decrypted); // 'Łódź'
```

## API Reference

For complete API documentation, see the [TypeScript definitions](./dist/index.d.ts) or visit our [documentation site](https://github.com/twarezak/caesar-cipher-js#readme).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run dev
```

## License

MIT © [Tomasz Warezak](https://github.com/twarezak)

## Security Note

**Important:** Caesar cipher is **not secure** for real-world encryption. It's trivially broken with frequency analysis or bruteforce attacks. This library is for:
- Educational purposes
- Simple obfuscation
- Historical cryptography study
- Fun projects

For real security, use modern encryption like AES-256, RSA, or libsodium.

## Links

- [GitHub Repository](https://github.com/twarezak/caesar-cipher-js)
- [NPM Package](https://www.npmjs.com/package/caesar-cipher-js)
- [Issue Tracker](https://github.com/twarezak/caesar-cipher-js/issues)
- [Changelog](https://github.com/twarezak/caesar-cipher-js/releases)

---

Made with ❤️ by [Tomasz Warezak](https://github.com/twarezak)
