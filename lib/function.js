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

"use strict";

require('polyfill/polyfill-base.js');

// Define configurable, writable and non-enumerable props
// if they don't exist.
var defineProperty = function (object, name, method, force) {
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
var defineProperties = function (object, map, force) {
	var names = Object.keys(map),
		l = names.length,
		i = -1,
		name;
	while (++i < l) {
		name = names[i];
		defineProperty(object, name, map[name], force);
	}
};
var NOOP = function () {};

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
		    proto = instance.prototype,
		    names = Object.keys(map || {}),
			l = names.length,
			i = -1,
			name, nameInProto;
		while (++i < l) {
			name = names[i];
			nameInProto = (name in proto);
			if (!nameInProto || force) {
				// if nameInProto: set the property, but also backup for chaining using $orig
				if (typeof map[name] === 'function') {
/*jshint -W083 */
					proto[name] = (function (original, methodName) {
						return function () {
/*jshint +W083 */
							instance.$orig[methodName] = original;
							return map[methodName].apply(this, arguments);
						};
					})(proto[name] || NOOP, name);
				}
				else {
					proto[name] = map[name];
				}
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
	 * 	var Circle = Shape.subClass(
	 * 		function (x, y, r) {
	 * 			this.r = r;
	 * 			Circle.$super.constructor.call(this, x, y);
	 * 		},
	 * 		{
	 * 			area: function () {
	 * 				return this.r * this.r * Math.PI;
	 * 			}
	 * 		}
	 * 	);
	 *
	 * @method subClass
	 * @param [constructor] {Function} The function that will serve as constructor for the new class.
	 *        If `undefined` defaults to `Object.constructor`
	 * @param [prototypes] {Object} Hash map of properties to be added to the prototype of the new class.
	 * @return the new class.
	 */
	subClass: function (constructor, prototypes) {

		if ((arguments.length === 1) && (typeof constructor !== 'function')) {
			prototypes = constructor;
			constructor = null;
		}


		constructor = constructor || function (ancestor) {
			return function () {
				ancestor.apply(this, arguments);
			};
		}(this);


		var baseProt = this.prototype,
			rp = Object.create(baseProt);
		constructor.prototype = rp;

		rp.constructor = constructor;
		constructor.$super = baseProt;
		constructor.$orig = {};

		constructor.mergePrototypes(prototypes, true);
		return constructor;
	},

	/**
	 * Sets the context of which the function will be execute. in the
	 * supplied object's context, optionally adding any additional
	 * supplied parameters to the end of the arguments the function
	 * is executed with.
	 *
	 * @method rbind
	 * @param [context] {Object} the execution context.
	 *        The value is ignored if the bound function is constructed using the new operator.
	 * @param [args*] {any} args* 0..n arguments to append to the end of
	 *        arguments collection supplied to the function.
	 * @return {function} the wrapped function.
	 */
	rbind: function (context /*, args* */ ) {
		var thisFunction = this,
			arrayArgs,
			slice = Array.prototype.slice;
		context || (context = this);
		if (arguments.length > 1) {
			// removing `context` (first item) by slicing it out:
			arrayArgs = slice.call(arguments, 1);
		}

		return (arrayArgs ?
			function () {
				// over here, `arguments` will be the "new" arguments when the final function is called!
				return thisFunction.apply(context, slice.call(arguments, 0).concat(arrayArgs));
			} :
			function () {
				// over here, `arguments` will be the "new" arguments when the final function is called!
				return thisFunction.apply(context, arguments);
			}
		);
	}
});

/**
 * Returns a base class with the given constructor and prototype methods
 *
 * @for Object
 * @method createClass
 * @param [constructor] {Function} constructor for the class
 * @param [prototype] {Object} Hash map of prototype members of the new class
 * @return {Function} the new class
*/
defineProperty(Object.prototype, 'createClass', function () {
	return Function.prototype.subClass.apply(this, arguments);
});