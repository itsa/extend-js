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
 * @return {Number|undefined} the value, forced to be inbetween the edges. Returns `undefined` if `max` is lower than `min`.
 */
Math.inbetween = function(min, value, max) {
    return (max>=min) ? this.min(max, this.max(min, value)) : undefined;
};