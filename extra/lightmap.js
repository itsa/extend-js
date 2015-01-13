/**
 *
 * Pollyfils for often used functionality for Strings
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/string.js
 * @class String
 *
 */
(function (global) {

    "use strict";

    var LightMap;

    require('../lib/function.js');
    require('../lib/array.js');
    require('../lib/object.js');
    require('polyfill/lib/weakmap.js');

    if (!global.LightMap) {
        global.LightMap = LightMap = Object.createClass(
            function() {
                Object.protectedProp(this, '_array', []);
                Object.protectedProp(this, '_map', new global.WeakMap());
            },
            {
                each: function(fn, context) {
                    var instance = this,
                        array = instance._array,
                        l = array.length,
                        i = -1,
                        obj, value;
                    while (++i < l) {
                        obj = array[i];
                        value = instance.get(obj); // read from WeakMap
                        fn.call(context, value, obj, instance);
                    }
                    return instance;
                },
                some: function(fn, context) {
                    var instance = this,
                        array = instance._array,
                        l = array.length,
                        i = -1,
                        obj, value;
                    while (++i < l) {
                        obj = array[i];
                        value = instance.get(obj); // read from WeakMap
                        if (fn.call(context, value, obj, instance)) {
                            return true;
                        }
                    }
                    return false;
                },
                clear: function() {
                    var instance = this,
                        array = instance._array;
                    array.forEach(function(key) {
                        instance.delete(key, true);
                    });
                    array.length = 0;
                },
                has: function(object) {
                    return this._map.has(object);
                },
                get: function(key, fallback) {
                    return this._map.get(key, fallback);
                },
                set: function (key, value) {
                    var instance = this,
                        array = instance._array,
                        map = instance._map;
                    map.set(key, value);
                    array.contains(key) || array.push(key);
                    return instance;
                },
                'delete': function (key) {
                    var instance = this,
                        array = instance._array,
                        map = instance._map,
                        silent = arguments[1], // hidden feature used by `clear()`
                        returnValue = map.delete(key);
                    silent || array.remove(key);
                    return returnValue;
                }
            }
        );
    }

}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));