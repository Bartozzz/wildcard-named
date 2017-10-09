// @flow

import escape from "escape-regexp";

const filters: Object = {
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
 * Add a filter to the stack.
 *
 * @param   {string}    name    Filter name
 * @param   {string}    regex   Filter regular expression
 * @return  {void}
 */
function addFilter(name: string, regex: string): void {
    filters[name] = regex;
}

/**
 * Return a valid, escaped regular expression from a `pattern`. A pattern should
 * respect the following structure: `[filter:name]`.
 *
 * @param   {string}    pattern Pattern to convert
 * @return  {RegExp}
 */
function getValidRegex(pattern: string): RegExp {
    let escaped: string = escape(pattern);

    for (const name in filters) {
        if (!filters.hasOwnProperty(name)) {
            continue;
        }

        const regex = new RegExp(`\\\\\\[${name}\\\\:[A-Za-z]{0,}?\\\\]`, "g");

        if (regex.exec(escaped)) {
            escaped = escaped.replace(regex, filters[name]);
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
 * @return  {array}
 * @access  private
 */
function getRegexMatches(regex: RegExp, string: string): Array<string> {
    const matches: Array<string> = regex.exec(string);

    matches.shift();

    // Remove properites set by `regex.exec()` (`index`, `input`)
    return Array.from(matches);
}

/**
 * Create a regular expression based on wildcards and return the named
 * parameters for a test string.
 *
 * @param   {string}    string  String to test
 * @param   {string}    pattern Pattern to match
 * @return  {Object}
 */
function test(string: string, pattern: string): Object {
    const regex: RegExp = getValidRegex(pattern);
    const props: Array<string|number> = getNamedProps(pattern);
    const matches: Array<string> = getRegexMatches(regex, string);

    // Creates an object from two arrays:
    return props.reduce((output, value, index) => {
        output[value] = matches[index];

        return output;
    }, {});
}

module.exports = test;
module.exports.filters = filters;
module.exports.addFilter = addFilter;
