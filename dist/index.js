"use strict";

var _escapeRegexp = require("escape-regexp");

var _escapeRegexp2 = _interopRequireDefault(_escapeRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filters = new Map();


filters.set("digit", "([0-9]+)");
filters.set("alnum", "([0-9A-Za-z]+)");
filters.set("alpah", "([A-Za-z]+)");
filters.set("xdigit", "([0-9A-Fa-f]+)");
filters.set("punct", "([p{P}d]+)");
filters.set("print", "([\x20-\x7e]*)");
filters.set("upper", "([A-Z]+)");
filters.set("lower", "([a-z]+)");
filters.set("all", "(.*?)");

/**
 * Return a valid, escaped regular expression from a `pattern`. A pattern should
 * respect the following structure: `[filter:name?]`.
 *
 * @param   {string}    pattern   Pattern to convert
 * @return  {RegExp}              Escaped regular expression
 */
function getValidRegex(pattern) {
  var escaped = (0, _escapeRegexp2.default)(pattern);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var data = _step.value;

      var rxp = new RegExp("\\\\\\[" + data[0] + "\\\\:[A-Za-z]{0,}?\\\\]", "g");

      if (rxp.exec(escaped)) {
        escaped = escaped.replace(rxp, data[1]);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return new RegExp("^" + escaped + "$", "g");
}

/**
 * Return a list of named props, where name refers to `name` in `[filter:name]`.
 *
 * @param   {string}    pattern   Pattern to get props from
 * @return  {Array}               Array of named props
 */
function getNamedProps(pattern) {
  var regex = /\[(\w+):(\w+)?]/g;
  var props = [];
  var i = 0;

  pattern.replace(regex, function () {
    props.push((arguments.length <= 2 ? undefined : arguments[2]) || i++);
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
function getRegexMatches(regex, string) {
  var matches = regex.exec(string);

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
function test(string, pattern) {
  var regex = getValidRegex(pattern);
  var matches = getRegexMatches(regex, string);

  if (!matches) {
    return null;
  }

  var props = getNamedProps(pattern);

  // Creates an object from two arrays:
  return props.reduce(function (output, value, index) {
    output[value] = matches[index];

    return output;
  }, {});
}

module.exports = test;
module.exports.filters = filters;
module.exports.addFilter = filters.set.bind(filters);