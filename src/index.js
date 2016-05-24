"use strict";

const escape  = require( "escape-regexp" );
const arr2obj = require( "array-to-object" );

const filters = {
    "digit"  : "([0-9]+)",
    "alnum"  : "([0-9A-Za-z]+)",
    "alpah"  : "([A-Za-z]+)",
    "xdigit" : "([0-9A-Fa-f]+)",
    "punct"  : "([\p{P}\d]+)",
    "print"  : "([\x20-\x7e]*)",
    "upper"  : "([A-Z]+)",
    "lower"  : "([a-z]+)",
    "all"    : "(.*?)"
};

function addFilter( name, regex ) {
    filters[ name ] = regex;
};

function getValidRegex( pattern ) {
    let escaped = escape( pattern );
    let match;

    for ( let name in filters ) {
        let regex = new RegExp( `\\\\\\[${name}\\\\:([A-Za-z]+)\\\\]`, "g" );

        if ( match = regex.exec( escaped ) ) {
            escaped = escaped.replace( regex, filters[ name ] );
        }
    }

    return new RegExp( `^${escaped}$`, "g" );
};

function getNamedProps( pattern ) {
    const regex = /\[(\w+):(\w+)]/g;
    const props = [];

    // We use the replace function to get the prop name easily:
    pattern.replace( regex, ( ...matches ) => props.push( matches[ 2 ] ) );

    return props;
};

/**
 * @param   {RegExp}    regex
 * @param   {string}    string
 */
function getRegexMatches( regex, string ) {
    let matches = regex.exec( string );

    if ( matches ) {
        // We don't need those proprietes:
        delete matches.index;
        delete matches.input;

        // Deletes the first element (input):
        matches.shift();
    }

    return matches;
};

/**
 * Creates a regex based on wildcards and return the named parameters for a test
 * string.
 *
 * @param   {string}    string      - string to test
 * @param   {string}    pattern     - pattern to match
 * @return  {object}
 */
function test( string, pattern ) {
    let regex   = getValidRegex( pattern );
    let props   = getNamedProps( pattern );
    let matches = getRegexMatches( regex, string );

    return arr2obj( props, matches );
};

module.exports = test;
module.exports.filters   = filters;
module.exports.addFilter = addFilter;
