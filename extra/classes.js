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
        BASE_MEMBERS, createBaseClass, Classes, coreMethods;

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
        _destroy: true,
        $super: true,
        $superProp: true,
        $orig: true
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
         *
         * **Note1 ** to be used on instances --> ONLY on Classes
         * **Note2 ** properties with getters and/or unwritable will NOT be merged
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
            var instance, proto, names, l, i, replaceMap, protectedMap, name, nameInProto, finalName, propDescriptor;
            if (!map) {
                return;
            }
            instance = this; // the Class
            proto = instance.prototype;
            names = Object.getOwnPropertyNames(map);
            l = names.length;
            i = -1;
            replaceMap = arguments[2] || REPLACE_CLASS_METHODS; // hidden feature, used by itags
            protectedMap = arguments[3] || PROTECTED_CLASS_METHODS; // hidden feature, used by itags
            while (++i < l) {
                name = names[i];
                finalName = replaceMap[name] || name;
                nameInProto = (finalName in proto);
                if (!PROTO_RESERVERD_NAMES[name] && !protectedMap[name] && (!nameInProto || force)) {
                    // if nameInProto: set the property, but also backup for chaining using $$orig



                    propDescriptor = Object.getOwnPropertyDescriptor(map, name);
                    if (!propDescriptor.writable) {
                        console.warn(NAME+'mergePrototypes will set property of '+NAME+'without its property-descriptor: for it is an unwritable property.');
                        proto[finalName] = map[name];
                    }
                    else {

                        // adding map[name] into $$orig:

                        instance.$$orig[finalName] || (instance.$$orig[finalName]=[]);
                        instance.$$orig[finalName][instance.$$orig[finalName].length] = map[name];



                        if (typeof map[name] === 'function') {
        /*jshint -W083 */
                            propDescriptor.value = (function (originalMethodName, finalMethodName) {
                                return function () {
        /*jshint +W083 */
                                    // this.$own = prot;
                                    // this.$origMethods = instance.$$orig[finalMethodName];
                                    var context = this,
                                        classCarierBkp = context.__classCarier__,
                                        methodClassCarierBkp = context.__methodClassCarier__,
                                        origPropBkp = context.__origProp__,
                                        returnValue;

                                    context.__methodClassCarier__ = instance;

                                    context.__classCarier__ = null;

                                    context.__origProp__ = finalMethodName;
                                    returnValue = map[originalMethodName].apply(context, arguments);
                                    context.__origProp__ = origPropBkp;

                                    context.__classCarier__ = classCarierBkp;

                                    context.__methodClassCarier__ = methodClassCarierBkp;

                                    return returnValue;

                                };
                            })(name, finalName);
                        }


                        Object.defineProperty(proto, finalName, propDescriptor);
                    }




                    // if (typeof map[name] === 'function') {
    /*jshint -W083 */
                        // proto[finalName] = (function (original, methodName, methodFinalName) {
                            // return function () {
    /*jshint +W083 */
                                // instance.$$orig[methodFinalName] = original;
                                // return map[methodName].apply(this, arguments);
                            // };
                        // })(proto[name] || NOOP, name, finalName);
                    // }
                    // else {
                        // proto[name] = map[name];
                    // }




                }
                else {
                    console.warn(NAME+'mergePrototypes is not allowed to set the property: '+name);
                }
            }
            return instance;
        },

        /**
         * Merges the given map of properties into the `prototype` of the Class.
         *
         * **Note1 ** to be used on instances --> ONLY on Classes
         * **Note2 ** properties with getters and/or unwritable will NOT be merged
         *
         * The members in the hash map will become members with
         * instances of the merged class.
         *
         * By default, this method will not override existing prototype members,
         * unless the second argument `force` is true.
         *
         * @method removePrototypes
         * @param map {Object} Hash map of properties to add to the prototype of this object
         * @param force {Boolean}  If true, existing members will be overwritten
         * @chainable
         */
        removePrototypes: function (properties) {
            var instance = this,
                proto = instance.isItag ? instance.$proto : instance.prototype;
            Array.isArray(properties) || (properties=[properties]);
            properties.forEach(function(prop) {
                delete proto[prop];
            });
        },

        /**
         * Returns a newly created class inheriting from this class
         * using the given `constructor` with the
         * prototypes listed in `prototypes` merged in.
         *
         *
         * The newly created class has the `$$super` static property
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
                baseProt, proto;
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

            if (!constructor) {
                if (chainConstruct) {
                    constructor = NOOP;
                }
                else {
                    constructor = (function(originalConstructor) {
                        return function() {
                            var context = this;

                            context.__classCarier__ = constructorClosure.constructor;
                            context.__origProp__ = 'constructor';
                            originalConstructor.apply(context, arguments);

                        };
                    })(instance);
                }
            }
            if (chainConstruct) {
                constructor = (function(originalConstructor) {
                    return function() {
                        var context = this;

                        context.__classCarier__ = constructorClosure.constructor.$$super.constructor;

                        context.__origProp__ = 'constructor';
                        context.__classCarier__.apply(context, arguments);

                        context.$origMethods = constructorClosure.constructor.$$orig.constructor;

                        context.__classCarier__ = constructorClosure.constructor;

                        context.__origProp__ = 'constructor';
                        originalConstructor.apply(context, arguments);

                    };
                })(constructor);
            }

            baseProt = instance.prototype;
            proto = Object.create(baseProt);
            constructor.prototype = proto;

            proto.constructor = constructor;
            constructor.$$chainConstructed = chainConstruct ? true : false;
            constructor.$$super = baseProt;
            constructor.$$orig = {
                constructor: constructor
            };
            constructorClosure.constructor = constructor;
            prototypes && constructor.mergePrototypes(prototypes, true);
            return constructor;
        }

    });

    global._ITSAmodules.Classes = Classes = {};

    BASE_MEMBERS = {
        _destroy: NOOP,
        destroy: function(notChained) {
            var instance = this,
                superDestroy;
            if (!instance._destroyed) {
                superDestroy = function(constructor) {
                    // don't call `hasOwnProperty` directly on obj --> it might have been overruled
                    Object.prototype.hasOwnProperty.call(constructor.prototype, '_destroy') && constructor.prototype._destroy.call(instance);
                    if (!notChained && constructor.$$super) {
                        instance.__classCarier__ = constructor.$$super.constructor;
                        superDestroy(constructor.$$super.constructor);
                    }
                };
                // instance.detachAll();  <-- is what Event will add
                superDestroy(instance.constructor);
                Object.protectedProp(instance, '_destroyed', true);
            }
        }
    };

    coreMethods = Classes.coreMethods = {
        $super: {
            get: function() {
                var instance = this;
                instance.__classCarier__ || (instance.__classCarier__= instance.__methodClassCarier__);
                instance.__$superCarierStart__ || (instance.__$superCarierStart__=instance.__classCarier__);
                instance.__classCarier__ = instance.__classCarier__.$$super.constructor;
                return instance;
            }
        },
        $superProp: {
            value: function(/* func, *args */) {
                var instance = this,
                    classCarierReturn = instance.__$superCarierStart__ || instance.__classCarier__ || instance.__methodClassCarier__,
                    currentClassCarier = instance.__classCarier__ || instance.__methodClassCarier__,
                    args = arguments,
                    superClass, superPrototype, firstArg, returnValue;

                instance.__$superCarierStart__ = null;
                if (args.length === 0) {
                    instance.__classCarier__ = classCarierReturn;
                    return;
                }

                superClass = currentClassCarier.$$super.constructor,
                superPrototype = superClass.prototype,
                firstArg = Array.prototype.shift.apply(args); // will decrease the length of args with one
                if ((firstArg==='constructor') && currentClassCarier.$$chainConstructed) {
                    console.warn('the constructor of this Class cannot be invoked manually, because it is chainConstructed');
                    return currentClassCarier;
                }
                if (typeof superPrototype[firstArg] === 'function') {
                    instance.__classCarier__ = superClass;
                    returnValue = superPrototype[firstArg].apply(instance, args);
                }
                instance.__classCarier__ = classCarierReturn;
                return returnValue || superPrototype[firstArg];
            }
        },
        $orig: {
            value: function() {
                var instance = this,
                    classCarierReturn = instance.__$superCarierStart__,
                    currentClassCarier = instance.__classCarier__ || instance.__methodClassCarier__,
                    args = arguments,
                    propertyName = instance.__origProp__,
                    returnValue, origArray, orig, item;

                instance.__$superCarierStart__ = null;

                origArray = currentClassCarier.$$orig[propertyName];

                instance.__origPos__ || (instance.__origPos__ = []);

                // every class can have its own overruled $orig for even the same method
                // first: seek for the item that matches propertyName/classRef:
                instance.__origPos__.some(function(element) {
                    if ((element.propertyName===propertyName) && (element.classRef===currentClassCarier)) {
                        item = element;
                    }
                    return item;
                });

                if (!item) {
                    item = {
                        propertyName: propertyName,
                        classRef: currentClassCarier,
                        position: origArray.length-1
                    };
                    instance.__origPos__.push(item);
                }
                if (item.position===0) {
                    return undefined;
                }
                item.position--;
                orig = origArray[item.position];
                if (typeof orig === 'function') {
                    instance.__classCarier__ = currentClassCarier;
                    returnValue = orig.apply(instance, args);
                }
                instance.__classCarier__ = classCarierReturn;

                item.position++;

                return returnValue || orig;
            }
        }
    };

    createBaseClass = function () {
        var InitClass = function() {};
        return Function.prototype.subClass.apply(InitClass, arguments);
    };

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

    // because `mergePrototypes` cannot merge object-getters, we will add the getter `$super` manually:
    Object.defineProperties(Classes.BaseClass.prototype, coreMethods);

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
