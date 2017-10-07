// @flow

import escape from "escape-regexp";
import arr2obj from "array-to-object";

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
 * @param   {string}    pattern     Pattern to convert
 * @return  {RegExp}
 */
function getValidRegex(pattern: string): RegExp {
    let escaped: string = escape(pattern);

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
 * Return a list of named props, where name refers to `name` in `[filter:name]`.
 *
 * @param   {string}    pattern Pattern to get props from
 * @return  {array}
 */
function getNamedProps(pattern: string): Array<string|number> {
    const regex: RegExp = /\[(\w+):(\w+)?]/g;
    const props: Array<string|number> = [];
    let i: number = 0;

    // We use the replace function to get the prop name easily:
    pattern.replace(regex, (...match: Array<string|number>) => {
        props.push(match[2] || i++);

        return "";
    });

    return props;
}

/**
 * @param   {RegExp}    regex   Generated regular expression based on pattern
 * @param   {string}    string  String to test
 * @return  {Object}
 * @access  private
 */
function getRegexMatches(regex: RegExp, string: string): Object {
    const matches: Object = regex.exec(string);

    if (matches) {
        // We don't need those proprieties:
        delete matches.index;
        delete matches.input;

        // Delete the first element:
        matches.shift();
    }

    return matches;
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
    const regex = getValidRegex(pattern);
    const props = getNamedProps(pattern);
    const matches = getRegexMatches(regex, string);

    return arr2obj(props, matches);
}

module.exports = test;
module.exports.filters = filters;
module.exports.addFilter = addFilter;
