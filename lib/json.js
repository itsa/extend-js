/**
 *
 * Pollyfils for often used functionality for Arrays
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/array.js
 * @class Array
 *
 */

"use strict";

require('polyfill/polyfill-base.js');

JSON.stringifyAttr = function(obj, quotes) {
    var regexp, replacement;
    if (quotes) {
        regexp = /"/g;
        replacement = '&quot;';
    }
    else {
        regexp = /'/g;
        replacement = '&apos;';
    }
    return this.stringify(obj).replace(regexp, replacement);
};