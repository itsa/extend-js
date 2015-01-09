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

var REVIVER = function(key, value) {
    return ((typeof value==='string') && value.toDate()) || value;
};

JSON.parseWithDate = function(stringifiedObj) {
    return this.parse(obj, REVIVER);
};