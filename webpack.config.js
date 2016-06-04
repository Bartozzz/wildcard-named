var path    = require( "path" );
var webpack = require( "webpack" );

var SOURCE_FOLDER = __dirname + "/src/";
var DIST_FOLDER   = __dirname + "/dist/";

module.exports = {
    entry   : path.resolve( SOURCE_FOLDER, "index.js" ),

    resolve : {
        extensions : [ "", ".js" ]
    },

    output : {
        path            : DIST_FOLDER,
        filename        : "index.js",
        library         : "wildcardNamed",
        libraryTarget   : "umd"
    },

    module : {
        loaders : [
            { test : /\.(js)$/, loader : "babel" }
        ],
    },

    plugins : [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin( {
            compress : {
                warnings : false
            },

            output : {
                comments   : false,
                semicolons : true
            }
        } )
    ]
};
