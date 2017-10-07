import escape from "escape-regexp";
import arr2obj from "array-to-object";

const filters = {
    "digit": "([0-9]+)",
    "alnum": "([0-9A-Za-z]+)",
    "alpah": "([A-Za-z]+)",
    "xdigit": "([0-9A-Fa-f]+)",
    "punct": "([\p{P}\d]+)",
    "print": "([\x20-\x7e]*)",
    "upper": "([A-Z]+)",
    "lower": "([a-z]+)",
    "all": "(.*?)",
};

/**
 * Adds a filter to the stack.
 *
 * @param   {string}    name    Filter name
 * @param   {string}    regex   Filter regular expression
 * @access  public
 */
function addFilter(name, regex) {
    filters[name] = regex;
}

/**
 * Returns a valid, escaped regular expression from a `pattern`. A pattern has
 * the following form: `[filter:name]`.
 *
 * @param   {string}    pattern     Pattern to convert
 * @return  {RegExp}
 * @access  private
 */
function getValidRegex(pattern) {
    let escaped = escape(pattern);

    for (const name in filters) {
        if (!filters.hasOwnProperty(name)) {
            continue;
        }

        const regex = new RegExp(`\\\\\\[${name}\\\\:([A-Za-z]+)?\\\\]`, "g");

        if (regex.exec(escaped)) {
            escaped = escaped.replace(regex, filters[name]);
        }
    }

    return new RegExp(`^${escaped}$`, "g");
}

/**
 * Returns a list of named props, where name refers to `[filter:name]`.
 *
 * @param   {string}    pattern     Pattern to get props from
 * @return  {array}
 * @access  private
 */
function getNamedProps(pattern) {
    const regex = /\[(\w+):(\w+)?]/g;
    const props = [];
    let i = 0;

    // We use the replace function to get the prop name easily:
    pattern.replace(regex, (...m) => props.push(m[2] || i++));

    return props;
}

/**
 * @param   {RegExp}    regex   Generated regular expression based on pattern
 * @param   {string}    string  String to test
 * @return  {array}
 * @access  private
 */
function getRegexMatches(regex, string) {
    const matches = regex.exec(string);

    if (matches) {
        // We don't need those proprietes:
        delete matches.index;
        delete matches.input;

        // Deletes the first element (input):
        matches.shift();
    }

    return matches;
}

/**
 * Creates a regex based on wildcards and return the named parameters for a test
 * string.
 *
 * @param   {string}    string      String to test
 * @param   {string}    pattern     Pattern to match
 * @return  {object}
 * @access  public
 */
function test(string, pattern) {
    const regex = getValidRegex(pattern);
    const props = getNamedProps(pattern);
    const matches = getRegexMatches(regex, string);

    return arr2obj(props, matches);
}

module.exports = test;
module.exports.filters = filters;
module.exports.addFilter = addFilter;
