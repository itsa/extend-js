/**
 *
 * Extension of Math
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/math.js
 * @class Math
 *
 */

"use strict";

require('polyfill/polyfill-base.js');

/**
 * Returns the value, while forcing it to be inbetween the specified edges.
 *
 * @method inbetween
 * @param min {Number} lower-edgde
 * @param value {Number} the original value that should be inbetween the edges
 * @param max {Number} upper-edgde
 * @param [absoluteValue] {boolean} whether `value` should be treaded as an absolute value
 * @return {Number|undefined} the value, forced to be inbetween the edges. Returns `undefined` if `max` is lower than `min`.
 */
Math.inbetween = function(min, value, max, absoluteValue) {
    var val = absoluteValue ? Math.abs(value) : value;
    return (max>=min) ? this.min(max, this.max(min, val)) : undefined;
};

/**
 * Floors a value in the direction to zero. Native Math.floor does this for positive values,
 * but negative values are floored more into the negative (Math.floor(-2.3) === -3).
 * This method floores into the direction of zero: (Math.floorToZero(-2.3) === -2)
 *
 * @method floorToZero
 * @param value {Number} the original value that should be inbetween the edges
 * @return {Number} the floored value
 */
Math.floorToZero = function(value) {
    return (value>=0) Math.floor(value) : Math.ceil(value);
};

/**
 * Ceils a value from zero up. Native Math.ceil does this for positive values,
 * but negative values are ceiled more into the less negative (Math.ceil(-2.3) === -2).
 * This method ceiles up from zero: (Math.ceilFromZero(-2.3) === -3)
 *
 * @method ceilFromZero
 * @param value {Number} the original value that should be inbetween the edges
 * @return {Number} the floored value
 */
Math.ceilFromZero = function(value) {
    return (value>=0) Math.ceil(value) : Math.floor(value);
};