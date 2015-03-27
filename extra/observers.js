/**
 *
 * Pollyfils for often used functionality for Objects
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/object.js
 * @class Object
 *
*/

(function (global) {

    "use strict";

    require('polyfill/polyfill-base.js');
    require('polyfill/lib/weakmap.js');
    require('../lib/object.js');
    require('../lib/array.js');

    var NATIVE_OBJECT_OBSERVE = !!Object.observe,
        NATIVE_ARRAY_OBSERVE = !!Array.observe,
        later = require('utils').later,
        _watchers = [],
        _registeredCallbacks = new global.WeakMap(),
        POLL_OBSERVE = 100,
        // Define configurable, writable and non-enumerable props
        // if they don't exist.
        defineProperty = function (object, name, method, force) {
            if (!force && (name in object)) {
                return;
            }
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: method
            });
        },
        defineProperties = function (object, map, force) {
            var names = Object.keys(map),
                l = names.length,
                i = -1,
                name;
            while (++i < l) {
                name = names[i];
                defineProperty(object, name, map[name], force);
            }
        },
        watchObject = function(obj, callback) {
            var watcher;
            watcher = {
                obj: obj,
                cb: callback,
                cloneObj: obj.deepClone(true),
                timer: later(function() {
                    if (!obj.sameValue(watcher.cloneObj)) {
                        watcher.cloneObj = obj.deepClone(true);
                        callback(obj);
                    }
                }, POLL_OBSERVE, true)
            };
            _watchers[_watchers.length] = watcher;
        },

        unWatchObject = function(obj, callback) {
            var currentWatcher;
            _watchers.some(function(watcher) {
                if ((watcher.obj===obj) && (watcher.callback===callback)) {
                    currentWatcher = watcher;
                }
                return currentWatcher;
            });
            if (currentWatcher) {
                currentWatcher.timer.cancel();
                _watchers.remove(currentWatcher);
            }
        },

        callbackFn = function(item, callback) {
            return callback.bind(null, item);
        },

        structureChanged = function(callback) {
            var watcher;
            watcher = function(changes) {
                // changes is an array with objects having the following properties:
                // {
                //    name: The name of the property which was changed.
                //    object: The changed object after the change was made.
                //    type: A string indicating the type of change taking place. One of "add", "update", or "delete".
                //    oldValue: Only for "update" and "delete" types. The value before the change.
                // }
                var len = changes.length,
                    i, changedProp, property;
                for (i=0; i<len; i++) {
                    changedProp = changes[i];
                    property = changedProp.object[changedProp.name];
                    if (changedProp.type==='delete') {
                        // clear previous observer
                        if (Object.isObject(property) || Array.isArray(property)) {
                            property.unobserve(callback);
                        }
                    }
                    if (changedProp.type==='add') {
                        // set new observer
                        if (Object.isObject(property) || Array.isArray(property)) {
                            property.observe(callback);
                        }
                    }
                }
            };
            return watcher;
        };

    defineProperties(Object.prototype, {
        /**
         * Observes changes of the instance. On any changes, the callback will be invoked.
         * Uses a polyfill on environments that don't support native Object.observe.
         *
         * The callback comes without arguments (native Object.observe does, but non-native doesn't)
         * so, they cannot be used.
         *
         * Will observer the complete object nested (deep).
         *
         * @for Object
         * @method observe
         * @chainable
         */
        observe: function (callback) {
            var obj = this,
                property, structureChangedCallback, objCallbackHash, cbFn;
            if (typeof callback==='function') {
                if (NATIVE_OBJECT_OBSERVE) {
                    _registeredCallbacks.has(obj) || _registeredCallbacks.set(obj, []);
                    objCallbackHash = _registeredCallbacks.get(obj);

                    cbFn = callbackFn(obj, callback);
                    Object.observe(obj, cbFn);

                    objCallbackHash[objCallbackHash.length] = {
                        cb: callback,
                        cbFn: cbFn
                    };

                    // check all properties if they are an Array or Object:
                    // in those cases, we need extra observers
                    for (property in obj) {
                        if (Object.isObject(obj[property]) || Array.isArray(obj[property])) {
                            obj[property].observe(callback);
                        }
                    }
                    // we also need to watch the object for new/replaced/removed properties ot the type Object/Array:
                    // they also need to be watched/unwatched
                    // to register this, we add an extra observer that looks for the type of the change

                    structureChangedCallback = structureChanged(callback);
                    Object.observe(obj, structureChangedCallback, ['add', 'delete']);

                    objCallbackHash[objCallbackHash.length] = {
                        cb: callback,
                        cbFn: structureChangedCallback
                    };

                }
                else {
                    watchObject(obj, callback);
                }
            }
            return obj;
        },

        /**
         * Un-observes changes that are registered with `observe`.
         * Uses a polyfill on environments that don't support native Object.observe.
         *
         * @method unobserve
         * @chainable
         */
        unobserve: function (callback) {
            var obj = this,
                property, objCallbackHash, len, i, item, structureChangedCallback;
            if (typeof callback==='function') {
                if (NATIVE_OBJECT_OBSERVE) {
                    objCallbackHash = _registeredCallbacks.get(obj);
                    if (objCallbackHash) {
                        len = objCallbackHash.length -1;
                        for (i=len; i>=0; i--) {
                            item = objCallbackHash[i];
                            if (item.cb===callback) {
                                structureChangedCallback = item.cbFn;
                                Object.unobserve(obj, structureChangedCallback);
                            }
                            objCallbackHash.splice(i, 1);
                        }
                        (objCallbackHash.length>0) || _registeredCallbacks.delete(obj);

                        for (property in obj) {
                            if (Object.isObject(obj[property]) || Array.isArray(obj[property])) {
                                obj[property].unobserve(callback);
                            }
                        }
                    }
                }
                else {
                    unWatchObject(obj, callback);
                }
            }
            return obj;
        }
    });

    defineProperties(Array.prototype, {
        /**
         * Observes changes of the instance. On any changes, the callback will be invoked.
         * Uses a polyfill on environments that don't support native Array.observe.
         *
         * The callback comes without arguments (native Array.observe does, but non-native doesn't)
         * so, they cannot be used.
         *
         * Will observer the complete array nested (deep).
         *
         * @for Array
         * @method observe
         * @chainable
         */
        observe: function (callback) {
            var array = this,
                item, i, len, structureChangedCallback, arrayCallbackHash, cbFn;
            if (typeof callback==='function') {
                if (NATIVE_ARRAY_OBSERVE) {
                    _registeredCallbacks.has(array) || _registeredCallbacks.set(array, []);
                    arrayCallbackHash = _registeredCallbacks.get(array);

                    cbFn = callbackFn(array, callback);
                    Array.observe(array, cbFn);

                    arrayCallbackHash[arrayCallbackHash.length] = {
                        cb: callback,
                        cbFn: cbFn
                    };

                    // check all properties if they are an Array or Object:
                    // in those cases, we need extra observers
                    len = array.length;
                    for (i=0; i<len; i++) {
                        item = array[i];
                        if (Object.isObject(item) || Array.isArray(item)) {
                            item.observe(callback);
                        }
                    }
                    // we also need to watch the object for new/replaced/removed properties ot the type Object/Array:
                    // they also need to be watched/unwatched
                    // to register this, we add an extra observer that looks for the type of the change

                    structureChangedCallback = structureChanged(callback);
                    Array.observe(array, structureChangedCallback);

                    arrayCallbackHash[arrayCallbackHash.length] = {
                        cb: callback,
                        cbFn: structureChangedCallback
                    };
                }
                else {
                    watchObject(array, callback);
                }
            }
            return array;
        },

        /**
         * Un-observes changes that are registered with `observe`.
         * Uses a polyfill on environments that don't support native Array.observe.
         *
         * @method unobserve
         * @chainable
         */
        unobserve: function (callback) {
            var array = this,
                item, i, len, arrayCallbackHash, structureChangedCallback;
            if (typeof callback==='function') {
                if (NATIVE_ARRAY_OBSERVE) {
                    arrayCallbackHash = _registeredCallbacks.get(array);
                    if (arrayCallbackHash) {
                        len = arrayCallbackHash.length -1;
                        for (i=len; i>=0; i--) {
                            item = arrayCallbackHash[i];
                            if (item.cb===callback) {
                                structureChangedCallback = item.cbFn;
                                Array.unobserve(array, structureChangedCallback);
                            }
                            arrayCallbackHash.splice(i, 1);
                        }
                        (arrayCallbackHash.length>0) || _registeredCallbacks.delete(array);

                        len = array.length;
                        for (i=0; i<len; i++) {
                            item = array[i];
                            if (Object.isObject(item) || Array.isArray(item)) {
                                item.unobserve(callback);
                            }
                        }
                    }
                }
                else {
                    unWatchObject(array, callback);
                }
            }
            return array;
        }
    });

}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));