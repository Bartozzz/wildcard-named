// @flow
import escape from "escape-regexp";

export const filters: Map<string, string> = new Map();
export const addFilter = filters.set.bind(filters);

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
 * Return a valid, escaped regular expression from a `pattern`. A pattern should
 * respect the following structure: `[filter:name?]`.
 *
 * @param   {string}    pattern   Pattern to convert
 * @return  {RegExp}              Escaped regular expression
 */
export function getValidRegex(pattern: string): * {
  let escaped: string = escape(pattern);

  for (const data of filters) {
    const rxp = new RegExp(`\\\\\\[${data[0]}\\\\:[A-Za-z]{0,}?\\\\]`, "g");

    if (rxp.exec(escaped)) {
      escaped = escaped.replace(rxp, data[1]);
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
