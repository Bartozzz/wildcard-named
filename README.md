# wildcard-named

Simple wildcard matching with named wildcards.

## Usage

### Basic example

```javascript
const wildcard = require( "wildcard-named" );

wildcard( "//blog.com/page/14", "//blog.com/page/[digit:page]" );
// => { page : '14' }

wildcard( "abc-123:d2f", "[digit:a]-[alpah:b]:[alnum:c]" );
// => { a : 'abc', b : '123', c : 'd2f' }
```

### Wildcards

You can add your own filters using the `.addFilter( filter, regex )` function, like this:

```javascript
const wildcard = require( "wildcard-named" );

wildcard.addFilter( "testA", "(.*?)" );
wildcard.addFilter( "testB", "([0-9])" );

wildcard( "thisWillBeMatches-2", "[testA:a]-[testB:b]" );
// => { a : 'thisWillBeMatches', b : '2' }
```

#### Predefined wildcards

| Filter | Regex            |
|--------|------------------|
| digit  | `([0-9]+)`       |
| alnum  | `([0-9A-Za-z]+)` |
| alpah  | `([A-Za-z]+)`    |
| xdigit | `([0-9A-Fa-f]+)` |
| punct  | `([\p{P}\d]+)`   |
| print  | `([\x20-\x7e]*)` |
| upper  | `([A-Z]+)`       |
| lower  | `([a-z]+)`       |
| all    | `(.*?)`          |

## Tests

```bash
$ npm test
```
