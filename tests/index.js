/*global describe, it */
"use strict";
var expect = require('chai').expect;
require("../extend-js");


describe('Testing object instance methods', function () {
	var obj = {a:1, b:2, c:3};
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
		a.a = 42;
		expect(a).not.be.eql(obj);
		expect(a.a).be.equal(42);
		expect(obj.a).be.equal(1);
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
