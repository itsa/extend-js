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

(function(ArrayPrototype) {
    /**
     * Shuffles the items in the Array randomly
     *
     * @method shuffle
     * @chainable
     */
    Array.shuffle || (ArrayPrototype.shuffle=function () {
        var instance = this,
            counter = instance.length,
            temp, index;
        // While there are elements in the instance
        while (counter>0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            temp = instance[counter];
            instance[counter] = instance[index];
            instance[index] = temp;
        }
        return instance;
    });
}(Array.prototype));