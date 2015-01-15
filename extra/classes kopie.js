/**
 *
 * Pollyfils for often used functionality for Functions
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/function.js
 * @class Function
 *
*/

require('polyfill/polyfill-base.js');
require('../lib/object.js');

(function (global) {

    "use strict";

    var NAME = '[Classes]: ',
        createHashMap = require('js-ext/extra/hashmap.js').createMap,
        DEFAULT_CHAIN_CONSTRUCT, defineProperty, defineProperties,
        NOOP, REPLACE_CLASS_METHODS, PROTECTED_CLASS_METHODS, PROTO_RESERVERD_NAMES,
        BASE_MEMBERS, createBaseClass, Classes;

    global._ITSAmodules || Object.protectedProp(global, '_ITSAmodules', createHashMap());

    if (global._ITSAmodules.Classes) {
        return global._ITSAmodules.Classes; // Classes was already created
    }

    // Define configurable, writable and non-enumerable props
    // if they don't exist.

    DEFAULT_CHAIN_CONSTRUCT = true;
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
    };
    defineProperties = function (object, map, force) {
        var names = Object.keys(map),
            l = names.length,
            i = -1,
            name;
        while (++i < l) {
            name = names[i];
            defineProperty(object, name, map[name], force);
        }
    };
    NOOP = function () {};
    REPLACE_CLASS_METHODS = createHashMap({
        destroy: '_destroy'
    });
    PROTECTED_CLASS_METHODS = createHashMap({
        _destroy: true
    });
/*jshint proto:true */
/* jshint -W001 */
    PROTO_RESERVERD_NAMES = createHashMap({
        constructor: true,
        prototype: true,
        toSource: true,
        toString: true,
        toLocaleString: true,
        valueOf: true,
        watch: true,
        unwatch: true,
        hasOwnProperty: true,
        isPrototypeOf: true,
        propertyIsEnumerable: true,
        __defineGetter__: true,
        __defineSetter__: true,
        __lookupGetter__: true,
        __lookupSetter__: true,
        __proto__: true
    });
/* jshint +W001 */
/*jshint proto:false */

    /**
     * Pollyfils for often used functionality for Function
     * @class Function
    */

    defineProperties(Function.prototype, {

        /**
         * Merges the given map of properties into the `prototype` of the Class.
         * **Not** to be used on instances.
         *
         * The members in the hash map will become members with
         * instances of the merged class.
         *
         * By default, this method will not override existing prototype members,
         * unless the second argument `force` is true.
         *
         * @method mergePrototypes
         * @param map {Object} Hash map of properties to add to the prototype of this object
         * @param force {Boolean}  If true, existing members will be overwritten
         * @chainable
         */
        mergePrototypes: function (map, force) {
            var instance = this,
                proto = instance.isItag ? instance.$proto : instance.prototype,
                names = Object.keys(map || {}),
                l = names.length,
                i = -1,
                replaceMap = arguments[2] || REPLACE_CLASS_METHODS, // hidden feature, used by itags
                protectedMap = arguments[3] || PROTECTED_CLASS_METHODS, // hidden feature, used by itags
                name, nameInProto, finalName;
            while (++i < l) {
                name = names[i];
                finalName = replaceMap[name] || name;
                nameInProto = (finalName in proto);
                if (!PROTO_RESERVERD_NAMES[name] && !protectedMap[name] && (!nameInProto || force)) {
                    // if nameInProto: set the property, but also backup for chaining using $orig
                    if (typeof map[name] === 'function') {
    /*jshint -W083 */
                        proto[finalName] = (function (original, methodName, methodFinalName) {
                            return function () {
    /*jshint +W083 */
                                instance.$orig[methodFinalName] = original;
                                return map[methodName].apply(this, arguments);
                            };
                        })(proto[name] || NOOP, name, finalName);
                    }
                    else {
                        proto[name] = map[name];
                    }
                }
                else {
                    console.warn(NAME+'mergePrototypes is not allowed to set the property: '+name);
                }
            }
            return instance;
        },

        /**
         * Returns a newly created class inheriting from this class
         * using the given `constructor` with the
         * prototypes listed in `prototypes` merged in.
         *
         *
         * The newly created class has the `$super` static property
         * available to access all of is ancestor's instance methods.
         *
         * Further methods can be added via the [mergePrototypes](#method_mergePrototypes).
         *
         * @example
         *
         *  var Circle = Shape.subClass(
         *      function (x, y, r) {
         *          // arguments will automaticly be passed through to Shape's constructor
         *          this.r = r;
         *      },
         *      {
         *          area: function () {
         *              return this.r * this.r * Math.PI;
         *          }
         *      }
         *  );
         *
         * @method subClass
         * @param [constructor] {Function} The function that will serve as constructor for the new class.
         *        If `undefined` defaults to `Object.constructor`
         * @param [prototypes] {Object} Hash map of properties to be added to the prototype of the new class.
         * @param [chainConstruct=true] {Boolean} Whether -during instance creation- to automaticly construct in the complete hierarchy with the given constructor arguments.
         * @return the new class.
         */
        subClass: function (constructor, prototypes, chainConstruct) {
            var instance = this,
                constructorClosure = {},
                baseProt, rp;
            if (typeof constructor === 'boolean') {
                constructor = null;
                prototypes = null;
                chainConstruct = constructor;
            }

            else {
                if (Object.isObject(constructor)) {
                    chainConstruct = prototypes;
                    prototypes = constructor;
                    constructor = null;
                }

                if (typeof prototypes === 'boolean') {
                    chainConstruct = prototypes;
                    prototypes = null;
                }
            }

            (typeof chainConstruct === 'boolean') || (chainConstruct=DEFAULT_CHAIN_CONSTRUCT);

            if (chainConstruct) {
                constructor = (function(originalConstructor) {
                    return function() {
                        constructorClosure.constructor.$super.constructor.apply(this, arguments);
                        originalConstructor.apply(this, arguments);
                    };
                })(constructor || instance);
            }
            else if (!constructor) {
                constructor = function (ancestor) {
                    return function () {
                        ancestor.apply(this, arguments);
                    };
                }(instance);
            }

            baseProt = instance.prototype;
            rp = Object.create(baseProt);
            constructor.prototype = rp;

            rp.constructor = constructor;
            constructor.$super = baseProt;
            constructor.$orig = {};
            constructorClosure.constructor = constructor;
            prototypes && constructor.mergePrototypes(prototypes, true);
            return constructor;
        }

    });

    BASE_MEMBERS = {
        _destroy: NOOP,
        destroy: function(notChained) {
            var instance = this,
                superDestroy;
            if (!instance._destroyed) {
                superDestroy = function(constructor) {
                    // don't call `hasOwnProperty` directly on obj --> it might have been overruled
                    Object.prototype.hasOwnProperty.call(constructor.prototype, '_destroy') && constructor.prototype._destroy.call(instance);
                    if (!notChained && constructor.$super) {
                        superDestroy(constructor.$super.constructor);
                    }
                };
                // instance.detachAll();  <-- is what Event will add
                superDestroy(instance.constructor);
                Object.protectedProp(instance, '_destroyed', true);
            }
        }
    };

    createBaseClass = function () {
        var InitClass = function() {};
        return Function.prototype.subClass.apply(InitClass, arguments);
    };

    global._ITSAmodules.Classes = Classes = {};

    /**
     * Returns a base class with the given constructor and prototype methods
     *
     * @for Object
     * @method createClass
     * @param [constructor] {Function} constructor for the class
     * @param [prototype] {Object} Hash map of prototype members of the new class
     * @static
     * @return {Function} the new class
    */
    Object.protectedProp(Classes, 'BaseClass', createBaseClass().mergePrototypes(BASE_MEMBERS, true, {}, {}));

    /**
     * Returns a base class with the given constructor and prototype methods
     *
     * @for Object
     * @method createClass
     * @param [constructor] {Function} constructor for the class
     * @param [prototype] {Object} Hash map of prototype members of the new class
     * @static
     * @return {Function} the new class
    */
    Object.protectedProp(Classes, 'createClass', Classes.BaseClass.subClass.bind(Classes.BaseClass));

    module.exports = Classes;

}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));
