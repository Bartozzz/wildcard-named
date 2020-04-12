<div align="center">
  <h1>wildcard-named</h1>

[![Greenkeeper badge](https://badges.greenkeeper.io/Bartozzz/wildcard-named.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/Bartozzz/wildcard-named.svg)](https://travis-ci.org/Bartozzz/wildcard-named/)
[![License](https://img.shields.io/github/license/Bartozzz/wildcard-named.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/wildcard-named.svg)](https://www.npmjs.com/package/wildcard-named)
[![npm downloads](https://img.shields.io/npm/dt/wildcard-named.svg)](https://www.npmjs.com/package/wildcard-named)
<br>

A small and easy-to-use utility module for matching strings using named and/or unnamed wildcards for JavaScript.

</div>

## Installation

```bash
$ npm install wildcard-named
```

## Usage

```javascript
import wildcard from "wildcard-named";
```

### Basic example

```javascript
import wildcard from "wildcard-named";

wildcard("//blog.com/page/14", "//blog.com/page/[digit:page]");
// { page: '14' }

wildcard("abc-123:d2f", "[digit:a]-[alpah:b]:[alnum:c]");
// { a: 'abc', b: '123', c: 'd2f' }
```

### Unnamed wildcards

```javascript
import wildcard from "wildcard-named";

wildcard("a-b-c", "[alpah:]-[alpah:]-[alpah:]");
// { 0: 'a', 1: 'b', 2: 'c' }
```

### Unmatched wildcards

When the pattern cannot be resolved, it will return `null`.

```javascript
import wildcard from "wildcard-named";

wildcard("a-b-c", "[alpah:]");
// null
```

### Wildcards

You can add your own filters using the `.addFilter(filter, regex)` function, like this:

```javascript
import wildcard, { addFilter } from "wildcard-named";

addFilter("testA", "(.*?)");
addFilter("testB", "([0-9])");

wildcard("match-1", "[testA:a]-[testB:b]");
// { a: 'match', b: '1' }
```

All registered filters are stored in a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) at `wildcard.filters`.

#### Predefined wildcards

| Filter   | Regex                                                                       | Description                                                         |
| -------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `digit`  | `([0-9]+)`                                                                  | Digits.                                                             |
| `alnum`  | `([0-9A-Za-z]+)`                                                            | Alphanumeric characters.                                            |
| `alpah`  | `([A-Za-z]+)`                                                               | Alphabetic characters.                                              |
| `xdigit` | `([0-9A-Fa-f]+)`                                                            | Hexadecimal digits.                                                 |
| `punct`  | `([\\u2000-\\u206F\\u2E00-\\u2E7F\\'!\"#$%&()*+,\\-./:;<=>?@\\[\\]^_{}~]+)` | Punctuation (with symbols).                                         |
| `print`  | `([\x20-\x7e]*)`                                                            | Visible characters and spaces (anything except control characters). |
| `upper`  | `([A-Z]+)`                                                                  | Uppercase letters.                                                  |
| `lower`  | `([a-z]+)`                                                                  | Lowercase letters.                                                  |
| `all`    | `(.*?)`                                                                     | Everything.                                                         |

## Tests

```bash
$ npm test
```
