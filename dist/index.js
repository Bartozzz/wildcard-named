!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.wildcardNamed=t():e.wildcardNamed=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";function n(e){var t=(0,a.default)(e),r=!0,n=!1,o=void 0;try{for(var u,i=c[Symbol.iterator]();!(r=(u=i.next()).done);r=!0){var f=u.value,l=new RegExp("\\\\\\["+f[0]+"\\\\:[A-Za-z]{0,}?\\\\]","g");l.exec(t)&&(t=t.replace(l,f[1]))}}catch(e){n=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(n)throw o}}return new RegExp("^"+t+"$","g")}function o(e){var t=/\[(\w+):(\w+)?]/g,r=[],n=0;return e.replace(t,function(){return r.push((arguments.length<=2?void 0:arguments[2])||n++),""}),r}function u(e,t){var r=e.exec(t);return r&&(r.shift(),r=Array.from(r)),r}function i(e,t){var r=n(t),i=u(r,e);return i?o(t).reduce(function(e,t,r){return e[t]=i[r],e},{}):null}var f=r(2),a=function(e){return e&&e.__esModule?e:{default:e}}(f),c=new Map;c.set("digit","([0-9]+)"),c.set("alnum","([0-9A-Za-z]+)"),c.set("alpah","([A-Za-z]+)"),c.set("xdigit","([0-9A-Fa-f]+)"),c.set("punct","([p{P}d]+)"),c.set("print","([ -~]*)"),c.set("upper","([A-Z]+)"),c.set("lower","([a-z]+)"),c.set("all","(.*?)"),e.exports=i,e.exports.filters=c,e.exports.addFilter=c.set.bind(c)},function(e,t){e.exports=function(e){return String(e).replace(/([.*+?=^!:${}()|[\]\/\\])/g,"\\$1")}}])});