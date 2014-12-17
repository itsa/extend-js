/*global describe, it */
/*jshint unused:false */

"use strict";
var expect = require('chai').expect;
require("../js-ext");

describe('Testing isObject', function () {

	it('object', function () {
		expect(Object.isObject({})).to.be.true;
	});

	it('function', function () {
		expect(Object.isObject(function(){})).to.be.false;
	});

	it('array', function () {
		expect(Object.isObject([])).to.be.false;
	});

	it('regexp', function () {
		expect(Object.isObject(/^a/)).to.be.false;
	});

	it('Error', function () {
		expect(Object.isObject(new Error())).to.be.false;
	});

	it('Date', function () {
		expect(Object.isObject(new Date)).to.be.false;
	});

	it('boolean', function () {
		expect(Object.isObject(true)).to.be.false;
	});

	it('number', function () {
		expect(Object.isObject(1)).to.be.false;
	});

	it('String', function () {
		expect(Object.isObject('ITSA')).to.be.false;
	});

	it('null', function () {
		expect(Object.isObject(null)).to.be.false;
	});

	it('undefined', function () {
		expect(Object.isObject(undefined)).to.be.false;
	});

});

describe('Testing object instance methods', function () {
	var obj = {a:1, b:2, c:3},
	    deepObj = {
	    	a: 1,
	    	b: [10, true, 'Modules', {b1: true}, ['first item'], new Date(2015, 1, 1, 12, 30, 0, 0)],
	    	c: new Date(2015, 2, 1, 12, 30, 0, 0),
	    	d: {
	    		d1: 1,
	    		d2: true,
	    		d3: 'ITSA modules',
	    		d4: new Date(2015, 3, 1, 12, 30, 0, 0),
	    		d5: {
	    			d51: true
	    		},
	    		d6: [
	    			'more modules'
	    		]
	    	},
	    	e: true,
	    	f: 'ITSA'
	    };
	it('each', function () {
		var a = '';
		obj.each(function (value, key) {
			a+=value + key;
		});
		expect(a).be.equal('1a2b3c');
	});
	it('each w/ context', function () {
		var A = Object.createClass(function() {
			this.count = 0;
		},{
			go: function () {
				obj.each(function (item, key) {
					this.count++;
				}, this);
			}
		});
		var a = new A();
		a.go();
		expect(a.count).eql(3);
   });
	it('some', function () {
		var count = 0;
		expect(obj.some(function (item, key) {
			count++;
			return item === key;
		})).to.be.false;
		expect(count).eql(3);
		count = 0;
		expect({a:1,b:'b',c:3}.some(function (item, key) {
			count++;
			return item === key;
		})).to.be.true;
		expect(count).eql(2);
	});
	it('keys', function () {
		expect(obj.keys()).be.eql(Object.keys(obj));
	});
	it('values', function () {
		expect(obj.values()).eql([1,2,3]);
	});
	it('isEmpty', function () {
		expect(obj.isEmpty()).be.false;
		expect({}.isEmpty()).be.true;
	});
	it('sameValue', function () {
	    var deepObj2 = {
	    	a: 1,
	    	b: [10, true, 'Modules', {b1: true}, ['first item'], new Date(2015, 1, 1, 12, 30, 0, 0)],
	    	c: new Date(2015, 2, 1, 12, 30, 0, 0),
	    	d: {
	    		d1: 1,
	    		d2: true,
	    		d3: 'ITSA modules',
	    		d4: new Date(2015, 3, 1, 12, 30, 0, 0),
	    		d5: {
	    			d51: true
	    		},
	    		d6: [
	    			'more modules'
	    		]
	    	},
	    	e: true,
	    	f: 'ITSA'
	    };
		expect(deepObj.sameValue(deepObj2)).to.be.true;
		deepObj2.d.d1 = 2;
		expect(deepObj.sameValue(deepObj2)).to.be.false;
	});
	it('map', function () {
		expect(obj.map(function (value, key) {
			return key + value;
		})).be.eql({a:'a1',b:'b2',c:'c3'});
		expect(obj.map(function (value, key) {
			return (key == 'b'?undefined:key + value);
		})).be.eql({a:'a1', c:'c3'});
	});
	it('shallowClone', function () {
		var a = obj.shallowClone();
		expect(a).be.eql(obj);
		expect(a===obj).to.be.false;
		a.a = 42;
		expect(a).not.be.eql(obj);
		expect(a.a).be.equal(42);
		expect(obj.a).be.equal(1);
	});
	it('deepClone', function () {
		var a = deepObj.deepClone();
		expect(a).be.eql(deepObj);
		expect(a===deepObj).to.be.false;

		a.a = 42;
		expect(a.a).be.equal(42);
		expect(deepObj.a).be.equal(1);

		a.b[0] = 2;
		a.b[1] = 5;
		a.b[2] = 20;
		a.b[3].b1 = false;
		a.b[4][0] = 'second item';
		a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
		expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ['second item'], new Date(2016, 1, 1, 12, 30, 0, 0)]);
		expect(deepObj.b).to.be.eql([10, true, 'Modules', {b1: true}, ['first item'], new Date(2015, 1, 1, 12, 30, 0, 0)]);

		a.c = 'ITSA';
		expect(a.c).be.equal('ITSA');
		expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

		a.e = 'Mod';
		expect(a.e).be.equal('Mod');
		expect(deepObj.e).be.equal(true);

		a.d.d1 = 2;
		a.d.d2 = 3;
		a.d.d3 = 4;
		a.d.d4 = 5;
		a.d.d5.d51 = 6;
		a.d.d6[0] = 7;
		expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
		expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:'ITSA modules', d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ['more modules']});

		a.f = 4;
		expect(a.f).be.equal(4);
		expect(deepObj.f).be.equal('ITSA');
	});
	describe('merge', function () {
		it('simple', function () {
			var a = {};
			expect(a.merge(obj)).be.eql(obj);
			expect(a).be.eql(obj);
		});
		it('existing, not forced',  function () {
			var a = {b:42};
			a.merge(obj);
			expect(a).be.eql({a:1,b:42,c:3});
		});
		it('existing, forced',  function () {
			var a = {b:42};
			a.merge(obj, true);
			expect(a).be.eql(obj);
		});
		it('undefined source', function () {
			var a = {b:42};
			a.merge(undefined);
			expect(a).eql({b:42});
		});

	});
	describe('Object.merge', function () {
		it('should mix them up, b should not be overwritten', function () {
			expect(Object.merge(
				{a:1,b:2,c:3},
				{b:5,d:4}
			)).be.eql({a:1,b:2,c:3,d:4});
		});
		it('nulls should be skipped', function () {
			expect(Object.merge(undefined,{a:1,b:2})).be.eql({a:1,b:2});
		});
	});
});
