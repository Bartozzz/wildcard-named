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
 * Return a list of named props, where name refers to `name` in `[filter:name]`.
 *
 * @param   {string}    pattern   Pattern to get props from
 * @return  {Array}               Array of named props
 */
export function getNamedProps(pattern: string): * {
  const regex = /\[(\w+):(\w+)?]/g;
  const props = [];
  let i = 0;

  pattern.replace(regex, (...match) => {
    props.push(match[2] || i++);
    return "";
  });

  return props;
}

/**
 * @param   {RegExp}    regex   Generated regular expression based on pattern
 * @param   {string}    string  String to test
 * @return  {Array|null}
 * @access  private
 */
export function getRegexMatches(regex: RegExp, string: string): * {
  let matches: ?Array<string> = regex.exec(string);

  if (matches) {
    matches.shift();
    matches = Array.from(matches); // remove properites set by regex.exec()
  }

  return matches;
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
  const regex = getValidRegex(pattern);
  const matches = getRegexMatches(regex, string);

  if (!matches) {
    return null;
  }

  const props = getNamedProps(pattern);

  // Creates an object from two arrays:
  return props.reduce((output, value, index) => {
    output[value] = matches[index];

    return output;
  }, {});
}
