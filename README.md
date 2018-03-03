<div align="center">
  <h1>wildcard-named</h1>

[![Greenkeeper badge](https://badges.greenkeeper.io/Bartozzz/wildcard-named.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/Bartozzz/wildcard-named.svg)](https://travis-ci.org/Bartozzz/wildcard-named/)
[![License](https://img.shields.io/github/license/Bartozzz/wildcard-named.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/wildcard-named.svg)](https://www.npmjs.com/package/wildcard-named)
[![npm downloads](https://img.shields.io/npm/dt/wildcard-named.svg)](https://www.npmjs.com/package/wildcard-named)
  <br>

Simple wildcard matching with (un)named wildcards.
</div>

## Installation

```bash
$ npm install wildcard-named
```

## Usage

```javascript
import wildcard from "wildcard-named";
// or window.wildcardNamed if used outside Node.js environment
```

### Basic example

```javascript
import wildcard from "wildcard-named";

wildcard("//blog.com/page/14", "//blog.com/page/[digit:page]");
// => { page: '14' }

wildcard("abc-123:d2f", "[digit:a]-[alpah:b]:[alnum:c]");
// => { a: 'abc', b: '123', c: 'd2f' }
```

### Unnamed wildcards

```javascript
import wildcard from "wildcard-named";

wildcard("a-b-c", "[alpah:]-[alpah:]-[alpah:]");
// => { 0: 'a', 1: 'b', 2: 'c' }
```

### Unmatched wildcards

When the pattern cannot be resolved, it will return `null`.

```javascript
import wildcard from "wildcard-named";

wildcard("a-b-c", "[alpah:]");
// => null
```

### Wildcards

You can add your own filters using the `.addFilter( filter, regex )` function, like this:

```javascript
import wildcard from "wildcard-named";

wildcard.addFilter("testA", "(.*?)");
wildcard.addFilter("testB", "([0-9])");

wildcard("thisWillBeMatched-2", "[testA:a]-[testB:b]");
// => { a: 'thisWillBeMatched', b: '2' }
```

All registered filters are stored in a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) accessible at `wildcard.filters`.

#### Predefined wildcards

| Filter   | Regex            |
|----------|------------------|
| `digit`  | `([0-9]+)`       |
| `alnum`  | `([0-9A-Za-z]+)` |
| `alpah`  | `([A-Za-z]+)`    |
| `xdigit` | `([0-9A-Fa-f]+)` |
| `punct`  | `([\p{P}\d]+)`   |
| `print`  | `([\x20-\x7e]*)` |
| `upper`  | `([A-Z]+)`       |
| `lower`  | `([a-z]+)`       |
| `all`    | `(.*?)`          |

## Tests

```bash
$ npm test
```
