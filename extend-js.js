/**
Pollyfils for often used functionality for objects and Functions
@module Object
*/

(function () {
	"use strict";
	// This from es5-shim
	// https://github.com/es-shims/es5-shim
	var ObjectPrototype = Object.prototype;

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
	// -------------------
	var _each = function (obj, fn, context) {
		var keys = Object.keys(obj),
			l = keys.length,
			i = -1,
			key;
		while (++i < l) {
			key = keys[i];
			fn.call(context, obj[key], key, obj);
		}
		return obj;
	};
/**
Pollyfils for often used functionality for objects
@class Object
*/
	defineProperties(ObjectPrototype, {
		/**
		 * Loops through all properties in the object.  Equivalent to Array.forEach.
		 * The callback is provided with the value of the property, the name of the property
		 * and a reference to the whole object itself.
		 * The context to run the callback in can be overriden, otherwise it is undefined.
		 *
		 * @method each
		 * @param fn {Function} Function to be executed on each item in the object.  It will receive
		 *                      value {any} value of the property
		 *                      key {string} name of the property
		 *                      obj {Object} the whole of the object
		 * @chainable
		 */

		each: function (fn, context) {
			if (context) return _each(this, fn, context);
			var keys = Object.keys(this),
				l = keys.length,
				i = -1,
				key;
			while (++i < l) {
				key = keys[i];
				fn(this[key], key, this);
			}
			return this;
		},

		/**
		 * Loops through the properties in an object until the callback function returns *truish*.
		 * The callback is provided with the value of the property, the name of the property
		 * and a reference to the whole object itself.
		 * The order in which the elements are visited is not predictable.
		 * The context to run the callback in can be overriden, otherwise it is undefined.
		 *
		 * @method some
		 * @param fn {Function} Function to be executed on each item in the object.  It will receive
		 *                      value {any} value of the property
		 *                      key {string} name of the property
		 *                      obj {Object} the whole of the object
		 * @return {Boolean} true if the loop was interrupted by the callback function returning *truish*.
		 */
		some: function (fn, context) {
			var keys = Object.keys(this),
				l = keys.length,
				i = -1,
				key;
			while (++i < l) {
				key = keys[i];
				if (fn.call(context, this[key], key, this)) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Loops through the properties in an object until the callback assembling a new object
		 * with its properties set to the values returned by the callback function.
		 * If the callback function returns `undefined` the property will not be copied to the new object.
		 * The resulting object will have the same keys as the original, except for those where the callback
		 * returned `undefined` which will have dissapeared.
		 * The callback is provided with the value of the property, the name of the property
		 * and a reference to the whole object itself.
		 * The context to run the callback in can be overriden, otherwise it is undefined.
		 *
		 * @method map
		 * @param fn {Function} Function to be executed on each item in the object.  It will receive
		 *                      value {any} value of the property
		 *                      key {string} name of the property
		 *                      obj {Object} the whole of the object
		 * @return {Object} The new object with its properties set to the values returned by the callback function.
		 */
		map: function (fn, context) {
			var keys = Object.keys(this),
				l = keys.length,
				i = -1,
				m = {},
				val, key;
			while (++i < l) {
				key = keys[i];
				val = fn.call(context, this[key], key, this);
				if (val !== undefined) {
					m[key] = val;
				}
			}
			return m;
		},
		/**
		 * Returns the keys of the object.
		 *
		 * @method keys
		 * @return {Array} Keys of the object
		 */
		keys: function () {
			return Object.keys(this);
		},
		/**
		 * Loops through the object collection the values of all its properties.
		 * It is the counterpart of the [`keys`](#method_keys).
		 *
		 * @method values
		 * @return {Array} values of the object
		 */
		values: function () {
			var keys = Object.keys(this),
				i = -1,
				len = keys.length,
				values = [];

			while (++i < len) {
				values.push(this[keys[i]]);
			}

			return values;
		},

		/**
		 * Returns true if the object has no own members
		 *
		 * @method isEmpty
		 * @return {Boolean} true if the object is empty
		 */
		isEmpty: function () {
			for (var key in this) {
				if (this.hasOwnProperty(key)) return false;
			}
			return true;
		},

		/**
		 * Returns a shallow copy of the object.
		 * It does not clone objects within the object, it does a simple, shallow clone.
		 * Fast, mostly useful for plain hash maps.
		 *
		 * @method shallowClone
		 * @return {Object} shallow copy of the original
		 */
		shallowClone: function () {
			var m = {},
				keys = Object.keys(this),
				l = keys.length,
				i = -1,
				key;
			while (++i < l) {
				key = keys[i];
				m[key] = this[key];
			}
			return m;
		},

		/**
		 * Merges into this object the properties of the given object.
		 * If the second argument is true, the properties on the source object will be overwritten
		 * by those of the second object of the same name, otherwise, they are preserved.
		 *
		 * @method merge
		 * @param obj {Object} Object with the properties to be added to the original object
		 * @param force {Boolean} If true, the properties in `obj` will override those of the same name
		 *        in the original object
		 * @chainable
		 */
		merge: function (obj, force) {
			var m = this;
			if (obj && obj.each) obj.each(function (value, key) {
				if (force || !(key in m)) {
					m[key] = obj[key];
				}
			});
			return m;
		}



	});

	/**
	 * Returns a new object resulting of merging the properties of the given objects.
	 * The copying is shallow, complex properties will reference the very same object.
	 * Properties in later objects do **not overwrite** properties of the same name in earlier objects.
	 * If any of the objects is missing, it will be skiped.
	 *
	 * @example
	 *
	 * 	var foo = function (config) {
	 * 		 config = Object.merge(config, defaultConfig);
	 * 	}
	 *
	 * @method merge
	 * @static
	 * @param obj* {Object} Objects whose properties are to be merged
	 * @return {Object} new object with the properties merged in.
	 */
	Object.merge = function () {
		var m = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			if (obj) m.merge(obj);
		});
		return m;
	};
/**
Pollyfils for often used functionality for Function
@class Function
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
			var proto = this.prototype;
			
			var names = Object.keys(map || {}),
				l = names.length,
				i = -1,
				name;
			while (++i < l) {
				name = names[i];
				if (!force && name in proto) continue;
				proto[name] = map[name];
			}
			return this;
			
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
		Overwrites the given prototype functions with the ones given in 
		the hashmap while still providing a means of calling the original
		overridden method.
		
		The patching function will receive a reference to the original method
		prepended to the arguments the original would have received.
		
		@method patch
		@param map {Object} Hash map of method names to their new implementation.
		@chainable
		*/
		patch: function (map) {
			var proto = this.prototype;
			
			var names = Object.keys(map || {}),
				l = names.length,
				i = -1,
				name;
			while (++i < l) {
				name = names[i];
				/*jshint -W083 */
				proto[name] = (function (original) {
					return function () {
						/*jshint +W083 */
						var a = Array.prototype.slice.call(arguments, 0);
						a.unshift(original || NOOP);
						return map[name].apply(this, a);
					};
				})(proto[name]);
			}
			return this;
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
	Returns a base class with the given constructor and prototype methods
	
	@for Object
	@method createClass
	@param [constructor] {Function} constructor for the class
	@param [prototype] {Object} Hash map of prototype members of the new class
	@return {Function} the new class
	*/
	defineProperty(Object, 'createClass', function (constructor, prototype) {
		return Function.prototype.subClass.apply(this, arguments);
	});
})();
