// @flow

import escape from "escape-regexp";

const filters: Map<string, string> = new Map();

// Add default filters:
filters.set("digit", "([0-9]+)");
filters.set("alnum", "([0-9A-Za-z]+)");
filters.set("alpah", "([A-Za-z]+)");
filters.set("xdigit", "([0-9A-Fa-f]+)");
filters.set("punct", "([\p{P}\d]+)");
filters.set("print", "([\x20-\x7e]*)");
filters.set("upper", "([A-Z]+)");
filters.set("lower", "([a-z]+)");
filters.set("all", "(.*?)");

/**
 * Return a valid, escaped regular expression from a `pattern`. A pattern should
 * respect the following structure: `[filter:name]`.
 *
 * @param   {string}    pattern Pattern to convert
 * @return  {RegExp}
 */
function getValidRegex(pattern: string): RegExp {
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
 * @param   {string}    pattern Pattern to get props from
 * @return  {array}
 */
function getNamedProps(pattern: string): Array<string|number> {
    const regex: RegExp = /\[(\w+):(\w+)?]/g;
    const props: Array<string|number> = [];
    let i: number = 0;

    pattern.replace(regex, (...match: Array<string|number>) => {
        props.push(match[2] || i++);

        return "";
    });

    return props;
}

/**
 * @param   {RegExp}    regex   Generated regular expression based on pattern
 * @param   {string}    string  String to test
 * @return  {array|null}
 * @access  private
 */
function getRegexMatches(regex: RegExp, string: string): Array<string>|null {
    let matches: Array<string> = regex.exec(string);

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
function test(string: string, pattern: string): Object|null {
    const regex: RegExp = getValidRegex(pattern);
    const matches: Array<string>|null = getRegexMatches(regex, string);

    if (!matches) {
        return null;
    }

    const props: Array<string|number> = getNamedProps(pattern);

    // Creates an object from two arrays:
    return props.reduce((output, value, index) => {
        output[value] = matches[index];

        return output;
    }, {});
}

module.exports = test;
module.exports.filters = filters;
module.exports.addFilter = filters.set.bind(filters);
