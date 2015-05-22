/*global describe, it, beforeEach */
/*jshint unused:false */

"use strict";
var expect = require('chai').expect;

require("../js-ext");

describe('Testing JSON', function () {

    it('JSON.parseWithDate', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: 'hello world',
                d: 10.5
            },
            objStringified = JSON.stringify(obj);
        expect(JSON.parseWithDate(objStringified)).to.be.eql(obj);
    });

    it('JSON.stringifyEscaped', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello 'world'",
                d: "hello \'world\'",
                e: 10.5
            };
        expect(JSON.stringifyEscaped(obj)).to.be.eql('{"a":true,"b":"1995-12-17T02:24:00.000Z","c":"hello \'world\'","d":"hello \'world\'","e":10.5}');
    });

    it('JSON.parseEscaped with date', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello 'world'",
                d: "hello \'world\'",
                e: 10.5
            },
            objStringified = JSON.stringifyEscaped(obj);
        expect(JSON.parseEscaped(objStringified, true)).to.be.eql(obj);
    });

});
