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

var createHashMap = require('js-ext/extra/hashmap.js').createMap,
    TYPES = createHashMap({
       'undefined' : true,
       'number' : true,
       'boolean' : true,
       'string' : true,
       '[object Function]' : true,
       '[object RegExp]' : true,
       '[object Array]' : true,
       '[object Date]' : true,
       '[object Error]' : true,
       '[object Promise]' : true
    }),
    isObject, objSameValue, deepCloneObj, cloneObj, valuesAreTheSame;

isObject = function (item) {
    return !!(!TYPES[typeof item] && !TYPES[({}.toString).call(item)] && item);
};

objSameValue = function(obj1, obj2) {
    var keys = Object.getOwnPropertyNames(obj1),
        keysObj2 = Object.getOwnPropertyNames(obj2),
        l = keys.length,
        i = -1,
        same, key;
    same = (l===keysObj2.length);
    // loop through the members:
    while (same && (++i < l)) {
        key = keys[i];
        same = obj2.hasOwnProperty(key) ? valuesAreTheSame(obj1[key], obj2[key]) : false;
    }
    return same;
};

deepCloneObj = function (obj, descriptors) {
    var m = Object.create(Object.getPrototypeOf(obj)),
        keys = Object.getOwnPropertyNames(obj),
        l = keys.length,
        i = -1,
        key, value, propDescriptor;
    // loop through the members:
    while (++i < l) {
        key = keys[i];
        value = obj[key];
        if (descriptors) {
            propDescriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (propDescriptor.writable) {
                Object.defineProperty(m, key, propDescriptor);
            }
            if ((Object.isObject(value) || Array.isArray(value)) && ((typeof propDescriptor.get)!=='function') && ((typeof propDescriptor.set)!=='function') ) {
                m[key] = cloneObj(value, descriptors);
            }
            else {
                m[key] = value;
            }
        }
        else {
            m[key] = (Object.isObject(value) || Array.isArray(value)) ? cloneObj(value, descriptors) : value;
        }
    }
    return m;
};

cloneObj = function(obj, descriptors, target) {
    var copy, i, len, value;

    // Handle Array
    if (obj instanceof Array) {
        copy = target || [];
        len = obj.length;
        for (i=0; i<len; i++) {
            value = obj[i];
            copy[i] = (Object.isObject(value) || Array.isArray(value)) ? cloneObj(value, descriptors) : value;
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
    if (Object.isObject(obj)) {
        return obj.deepClone(descriptors);
    }

    return obj;
};

valuesAreTheSame = function(value1, value2) {
    var same;
    // complex values need to be inspected differently:
    if (isObject(value1)) {
        same = isObject(value2) ? objSameValue(value1, value2) : false;
    }
    else if (Array.isArray(value1)) {
        same = Array.isArray(value2) ? value1.sameValue(value2) : false;
    }
    else if (value1 instanceof Date) {
        same = (value2 instanceof Date) ? (value1.getTime()===value2.getTime()) : false;
    }
    else {
        same = (value1===value2);
    }
    return same;
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
    ArrayPrototype.contains = function(item) {
        return (this.indexOf(item) > -1);
    };

    /**
     * Removes an item from the array
     *
     * @method remove
     * @param item {any|Array} the item (or an hash of items) to be removed
     * @param [arrayItem=false] {Boolean} whether `item` is an arrayItem that should be treated as a single item to be removed
     *        You need to set `arrayItem=true` in those cases. Otherwise, all single items from `item` are removed separately.
     * @chainable
     */
    ArrayPrototype.remove = function(item, arrayItem) {
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
    };

    /**
     * Replaces an item in the array. If the previous item is not part of the array, the new item is appended.
     *
     * @method replace
     * @param prevItem {any} the item to be replaced
     * @param newItem {any} the item to be added
     * @chainable
     */
    ArrayPrototype.replace = function(prevItem, newItem) {
        var instance = this,
            index = instance.indexOf(prevItem);
        (index!==-1) ? instance.splice(index, 1, newItem) : instance.push(newItem);
        return instance;
    };

    /**
     * Inserts an item in the array at the specified position. If index is larger than array.length, the new item(s) will be appended.
     * If the item already exists, it will be moved to its new position, unless `duplicate` is set true
     *
     * @method insertAt
     * @param item {any|Array} the item to be replaced, may be an Array of items
     * @param index {Number} the position where to add the item(s). When larger than Array.length, the item(s) will be appended.
     * @param [duplicate=false] {boolean} if an item should be duplicated when already in the array
     * @chainable
     */
    ArrayPrototype.insertAt = function(item, index, duplicate) {
        var instance = this,
            prevIndex;
        if (!duplicate) {
            prevIndex = instance.indexOf(item);
            if (prevIndex===index) {
                return instance;
            }
            (prevIndex > -1) && instance.splice(prevIndex, 1);
        }
        instance.splice(index, 0, item);
        return instance;
    };

    /**
     * Shuffles the items in the Array randomly
     *
     * @method shuffle
     * @chainable
     */
    ArrayPrototype.shuffle = function() {
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
    };

    /**
     * Returns a deep copy of the Array.
     * Only handles members of primary types, Dates, Arrays and Objects.
     *
     * @method deepClone
     * @param [descriptors=false] {Boolean} whether to use the descriptors when cloning
     * @return {Array} deep-copy of the original
     */
     ArrayPrototype.deepClone = function (descriptors) {
        return cloneObj(this, descriptors);
     };

    /**
     * Compares this object with the reference-object whether they have the same value.
     * Not by reference, but their content as simple types.
     *
     * Compares both JSON.stringify objects
     *
     * @method sameValue
     * @param refObj {Object} the object to compare with
     * @return {Boolean} whether both objects have the same value
     */
    ArrayPrototype.sameValue = function(refArray) {
        var instance = this,
            len = instance.length,
            i = -1,
            same;
        same = (len===refArray.length);
        // loop through the members:
        while (same && (++i < len)) {
            same = valuesAreTheSame(instance[i], refArray[i]);
        }
        return same;
    };

    /**
     * Sets the items of `array` to the instance. This will refill the array, while remaining the instance.
     * This way, external references to the array-instance remain valid.
     *
     * @method defineData
     * @param array {Array} the Array that holds the new items.
     * @param [clone=false] {Boolean} whether the items should be cloned
     * @chainable
     */
    ArrayPrototype.defineData = function(array, clone) {
        var thisArray = this,
            len, i;
        thisArray.empty();
        if (clone) {
            cloneObj(array, true, thisArray);
        }
        else {
            len = array.length;
            for (i=0; i<len; i++) {
                thisArray[i] = array[i];
            }
        }
        return thisArray;
    },

    /**
     * Merges `array` into this array (appended by default).
     *
     * @method concatMerge
     * @param array {Array} the Array to be merged
     * @param [prepend=false] {Boolean} whether the items prepended
     * @param [clone=false] {Boolean} whether the items should be cloned
     * @param [descriptors=false] {Boolean} whether to use the descriptors when cloning
     * @chainable
     */
    ArrayPrototype.concatMerge = function(array, prepend, clone, descriptors) {
        var instance = this,
            mergeArray = clone ? array.deepClone(descriptors) : array;
        if (prepend) {
            mergeArray.reduceRight(function(coll, item) {
                coll.unshift(item);
                return coll;
            }, instance);
        }
        else {
            mergeArray.reduce(function(coll, item) {
                coll[coll.length] = item;
                return coll;
            }, instance);
        }
        return instance;
    };

    /**
     * Empties the Array by setting its length to zero.
     *
     * @method empty
     * @chainable
     */
    ArrayPrototype.empty = function() {
        this.length = 0;
        return this;
    };

}(Array.prototype));