/**
 *
 * Pollyfils for often used functionality for Arrays
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/json.js
 * @class JSON
 *
 */

"use strict";

require('polyfill/polyfill-base.js');


var REGEXP_REPLACE_ADD = /([\\\\]*)'/g,
    REGEXP_REPLACE_REMOVE = /([\\\\]*)[\\\\]'/g,
    REVIVER = function(key, value) {
     return ((typeof value==='string') && value.toDate()) || value;
    };

/**
 * Parses a stringified object and creates true `Date` properties.
 *
 * @method parseWithDate
 * @param stringifiedObj {Number} lower-edgde
 * @return {Number|undefined} the value, forced to be inbetween the edges. Returns `undefined` if `max` is lower than `min`.
 */
JSON.parseWithDate = function(stringifiedObj) {
    return this.parse(stringifiedObj, REVIVER);
};

/**
 * Stringifies an object while escaping the ' character. This is needed for storage into a string-object and encapsulate inside a document
 * to be parsed at the client by using `parseEscaped`
 *
 * @method stringifyEscaped
 * @param obj {Number} lower-edgde
 * @return {Number|undefined} the value, forced to be inbetween the edges. Returns `undefined` if `max` is lower than `min`.
 */
JSON.stringifyEscaped = function(obj) {
    return this.stringify(obj).replace(REGEXP_REPLACE_ADD, "$1\\'");
};

/**
 * Parses anything that was stringified using 'stringifyEscaped'.
 *
 * @method parseEscaped
 * @param stringifiedObj {String} The string that needs to be parsed into an object
 * @param [withDate=false] {Boolean} whether parsing should generate true Date-objects
 * @return {Object} the created object. Will throw an error when parsing fails.
 */
JSON.parseEscaped = function(stringifiedObj, withDate) {
    return this.parse(stringifiedObj.replace(REGEXP_REPLACE_REMOVE, "$1'"), withDate ? REVIVER : null);
};