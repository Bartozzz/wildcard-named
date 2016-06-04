"use strict";

let wildcard = require( "../dist" );
let assert   = require( "assert" );

function equal( arr1, arr2 ) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

describe( "wildcard-param", () => {
    it( "should match named parameters", () => {
        assert.equal( true, equal(
            { a : "1", b : "2", c : "3" },
            wildcard( "1-2-3", "[digit:a]-[digit:b]-[digit:c]" )
        ) );

        assert.equal( true, equal(
            { al : "a", be : "b", },
            wildcard( "a:b", "[alpah:al]:[alpah:be]" )
        ) );
    } );

    it( "should match unnamed parameters", () => {
        assert.equal( true, equal(
            { 0 : "1", 1 : "2", 2 : "3" },
            wildcard( "1-2-3", "[digit:]-[digit:]-[digit:]" )
        ) );

        assert.equal( true, equal(
            { 0 : "a", 1 : "b", },
            wildcard( "a:b", "[alpah:]:[alpah:]" )
        ) );
    } );

    it( "should add new filters", () => {
        wildcard.addFilter( "testA", "regex" );
        wildcard.addFilter( "testB", "regex" );

        assert.equal( true, "testA" in wildcard.filters );
        assert.equal( true, "testB" in wildcard.filters );
    } );

    it( "should match new filters", () => {
        wildcard.addFilter( "testing1", "(.*?)" );
        wildcard.addFilter( "testing2", "([0-9])" );

        assert.equal( true, equal(
            { a : "thisWillBeMatched", b : "2", },
            wildcard( "thisWillBeMatched-2", "[testing1:a]-[testing2:b]" )
        ) );
    } );
} );
