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

require('polyfill/lib/array.indexof.js');
require('polyfill/lib/array.foreach.js');

(function(ArrayPrototype) {

    /**
     * Checks whether an item is inside the Array.
     * Alias for (array.indexOf(item) > -1)
     *
     * @method inArray
     * @return {Boolean} whether the item is part of the Array
     */
    Array.inArray || (ArrayPrototype.inArray=function(item) {
        return (this.indexOf(item) > -1);
    });

    /**
     * Removes an item from the array
     *
     * @method remove
     * @param item {any|Array} the item (or an hash of items) to be removed
     * @param [arrayItem=false] {Boolean} whether `item` is an arrayItem that should be treated as a single item to be removed
     *        You need to set `arrayItem=true` in those cases. Otherwise, all single items from `item` are removed separately.
     * @chainable
     */
    Array.remove || (ArrayPrototype.remove=function(item, arrayItem) {
        var instance = this,
            removeItem = function(oneItem) {
                var index = instance.indexOf(item);
                (index > -1) && instance.splice(index, 1);
            };
        if (!arrayItem && Array.isArray(item)) {
            item.forEach(removeItem);
        }
        else {
            removeItem(item);
        }
        return instance;
    });

    /**
     * Shuffles the items in the Array randomly
     *
     * @method shuffle
     * @chainable
     */
    Array.shuffle || (ArrayPrototype.shuffle=function() {
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