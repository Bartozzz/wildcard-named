// @flow
import escapeRegex from "lodash.escaperegexp";

export const filters: Map<string, string> = new Map();
export const addFilter: (
  name: string,
  regexp: string
) => Map<string, string> = filters.set.bind(filters);

// NOTE: we might want to limit the length to prevent ReDoS attacks:
addFilter("digit", "([0-9]+)");
addFilter("alnum", "([0-9A-Za-z]+)");
addFilter("alpha", "([A-Za-z]+)");
addFilter("xdigit", "([0-9A-Fa-f]+)");
addFilter("print", "([\\x20-\\x7e]*)");
addFilter("upper", "([A-Z]+)");
addFilter("lower", "([a-z]+)");
addFilter("word", "([A-Za-z0-9_]+)");
addFilter("space", "([ \\t\\r\\n\\v\\f]+)");
addFilter("graph", "([\\x21-\\x7E]+)");
addFilter("blank", "([ \\t]+)");
addFilter("ascii", "([\\x00-\\x7F]+)");
addFilter("cntrl", "([\\x00-\\x1F\\x7F]+)");
addFilter("all", "(.*?)");
addFilter(
  "punct",
  "([\\u2000-\\u206F\\u2E00-\\u2E7F\\'!\"#$%&()*+,\\-./:;<=>?@\\[\\]^_`{|}~]+)"
);

/**
 * Replace all [filter:name?] with the proper filter's regexp and return it. A
 * pattern should respect the following structure: `[filter:name?]`.
 *
 * @param   {string}    pattern   Pattern to convert
 * @return  {RegExp}              Escaped regular expression
 */
export function getValidRegex(pattern: string): RegExp {
  let escaped: string = escapeRegex(pattern);

  for (const [name, regexp] of filters) {
    const wildcard = new RegExp(`\\\\\\[${name}:[A-Za-z]{0,64}?\\\\]`, "g");

    if (wildcard.test(escaped)) {
      escaped = escaped.replace(wildcard, regexp);
    }
  }

  try {
    return new RegExp(`^${escaped}$`, "g");
  } catch (err) {
    // If we created an invalid regular expression, then we should not match
    // anything. The following regular expressions looks for a character after
    // the end of the string, which is impossible in single-line mode.
    return new RegExp("$.", "g");
  }
}

/**
 * @example
 * getNamedProps("[x:a]-[y:b]-[z:c]");  // ["a", "b", "c"]
 * getNamedProps("[x:]-[y:]-[z:]");     // ["0", "1", "2"]
 * getNamedProps("[x:a]-[y:]-[z:c]");   // ["a", "0", "c"]
 *
 * @param   {string}    pattern   Pattern to get props from
 * @return  {Array}               Array of named props
 */
export function getNamedProps(pattern: string): Array<string> {
  const regex = /\[(\w*):(\w{0,64})?]/g; // [filter:name?]
  let i = 0;

  return [...pattern.matchAll(regex)].map(([match, filter, name]) => {
    return name || String(i++);
  });
}

/**
 * Create a regular expression based on wildcards and return the named
 * parameters for a test string.
 *
 * @param   {string}    string  String to test
 * @param   {string}    pattern Pattern to match
 * @return  {Object|null}
 */
export default function test(string: string, pattern: string): Object | null {
  if (!string || string.length > 1024 * 64) {
    return;
  }

  const matches = getValidRegex(pattern).exec(string);

  if (matches) {
    const values = [...matches].slice(1);
    const keys = getNamedProps(pattern);

    // Creates an object from two arrays:
    return keys.reduce((output, value, index) => {
      output[value] = values[index];
      return output;
    }, {});
  }
}
