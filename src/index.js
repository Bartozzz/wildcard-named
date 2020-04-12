// @flow
import escapeRegex from "lodash.escaperegexp";

export const filters: Map<string, string> = new Map();
export const addFilter = filters.set.bind(filters);

// NOTE: we might want to limit the length to prevent ReDoS attacks:
addFilter("digit", "([0-9]+)");
addFilter("alnum", "([0-9A-Za-z]+)");
addFilter("alpah", "([A-Za-z]+)");
addFilter("xdigit", "([0-9A-Fa-f]+)");
addFilter("print", "([\\x20-\\x7e]*)");
addFilter("upper", "([A-Z]+)");
addFilter("lower", "([a-z]+)");
addFilter("all", "(.*?)");
addFilter(
  "punct",
  "([\\u2000-\\u206F\\u2E00-\\u2E7F\\'!\"#$%&()*+,\\-./:;<=>?@\\[\\]^_`{|}~]+)"
);

/**
 * Return a valid, escaped regular builded from a `pattern`. A pattern should
 * respect the following structure: `[filter:name?]`.
 *
 * @param   {string}    pattern   Pattern to convert
 * @return  {RegExp}              Escaped regular expression
 */
export function getValidRegex(pattern: string): RegExp {
  let escaped: string = escapeRegex(pattern);

  // Replace all [filter:name?] with the proper filter's regexp:
  for (const [name, regexp] of filters) {
    // NOTE: we might want to limit the name length to prevent ReDoS attacks:
    const wildcard = new RegExp(`\\\\\\[${name}:[A-Za-z]*?\\\\]`, "g");

    if (wildcard.test(escaped)) {
      escaped = escaped.replace(wildcard, regexp);
    }
  }

  return new RegExp(`^${escaped}$`, "g");
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
  const regex = /\[(\w+):(\w+)?]/g; // [filter:name?]
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
