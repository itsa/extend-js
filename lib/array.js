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

var cloneObj = function(obj) {
    var copy, i, len, value;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        len = obj.length;
        for (i=0; i<len; i++) {
            value = obj[i];
            copy[i] = ((value===null) || (typeof value!=='object')) ? value : cloneObj(value);
        }
        return copy;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Object
    else if (obj instanceof Object) {
        copy = obj.deepClone();
    }

    return copy;
};

(function(ArrayPrototype) {

    /**
     * Checks whether an item is inside the Array.
     * Alias for (array.indexOf(item) > -1)
     *
     * @method contains
     * @param item {Any} the item to seek
     * @return {Boolean} whether the item is part of the Array
     */
    Array.contains || (ArrayPrototype.contains=function(item) {
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
                var index = instance.indexOf(oneItem);
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
     * Replaces an item in the array. If the previous item is not part of the array, the new item is appended.
     *
     * @method replace
     * @param prevItem {any} the item to be replaced
     * @param newItem {any} the item to be added
     * @chainable
     */
    Array.replace || (ArrayPrototype.replace=function(prevItem, newItem) {
        var instance = this,
            index = instance.indexOf(prevItem);
        (index!==-1) ? instance.splice(index, 1, newItem) : instance.push(newItem);
        return instance;
    });

    /**
     * Inserts an item in the array at the specified position. If index is larger than array.length, the new item(s) will be appended.
     *
     * @method insertAt
     * @param item {any|Array} the item to be replaced, may be an Array of items
     * @param index {Number} the position where to add the item(s). When larger than Array.length, the item(s) will be appended.
     * @chainable
     */
    Array.insertAt || (ArrayPrototype.insertAt=function(item, index) {
        this.splice(index, 0, item);
        return this;
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

    /**
     * Returns a deep copy of the Array.
     * Only handles members of primary types, Dates, Arrays and Objects.
     *
     * @method deepClone
     * @return {Array} deep-copy of the original
     */
     ArrayPrototype.deepClone = function () {
        return cloneObj(this);
     };

}(Array.prototype));