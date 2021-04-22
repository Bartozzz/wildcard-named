"use strict";var _lodash=_interopRequireDefault(require("lodash.escaperegexp"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.getValidRegex=getValidRegex,exports.getNamedProps=getNamedProps,exports.default=test,exports.addFilter=exports.filters=void 0,require("core-js/modules/es.array.iterator.js"),require("core-js/modules/es.string.replace.js"),require("core-js/modules/es.string.match-all.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}const filters=new Map;exports.filters=filters;const addFilter=filters.set.bind(filters);exports.addFilter=addFilter,addFilter("digit","([0-9]+)"),addFilter("alnum","([0-9A-Za-z]+)"),addFilter("alpha","([A-Za-z]+)"),addFilter("xdigit","([0-9A-Fa-f]+)"),addFilter("print","([\\x20-\\x7e]*)"),addFilter("upper","([A-Z]+)"),addFilter("lower","([a-z]+)"),addFilter("word","([A-Za-z0-9_]+)"),addFilter("space","([ \\t\\r\\n\\v\\f]+)"),addFilter("graph","([\\x21-\\x7E]+)"),addFilter("blank","([ \\t]+)"),addFilter("ascii","([\\x00-\\x7F]+)"),addFilter("cntrl","([\\x00-\\x1F\\x7F]+)"),addFilter("all","(.*?)"),addFilter("punct","([\\u2000-\\u206F\\u2E00-\\u2E7F\\'!\"#$%&()*+,\\-./:;<=>?@\\[\\]^_`{|}~]+)");function getValidRegex(a){let b=(0,_lodash.default)(a);for(const[c,d]of filters){const a=new RegExp(`\\\\\\[${c}:[A-Za-z]{0,64}?\\\\]`,"g");a.test(b)&&(b=b.replace(a,d))}try{return new RegExp(`^${b}$`,"g")}catch(a){return /$./g}}function getNamedProps(a){let b=0;return[...a.matchAll(/\[(\w*):(\w{0,64})?]/g)].map(([a,c,d])=>d||b++ +"")}function test(a,b){if(a&&!(65536<a.length)){const c=getValidRegex(b).exec(a);if(c){const a=[...c].slice(1),d=getNamedProps(b);return d.reduce((b,c,d)=>(b[c]=a[d],b),{})}}}