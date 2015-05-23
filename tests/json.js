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

    it('JSON.stringToDates non-cloned', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello 'world'",
                d: "hello \'world\'",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.stringToDates(objReversed);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.true;
    });

    it('JSON.stringToDates cloned', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello 'world'",
                d: "hello \'world\'",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.stringToDates(objReversed, true);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.false;
    });


    it('JSON.stringToDates deep object non-cloned', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: {
                    a: {
                        b: date
                    },
                    b: [
                        date,
                        {
                            a: date
                        },
                        [
                            date
                        ]
                    ]
                },
                c: "hello 'world'",
                d: "hello \'world\'",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.stringToDates(objReversed);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.true;
    });

    it('JSON.stringToDates deep object cloned', function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: {
                    a: {
                        b: date
                    },
                    b: [
                        date,
                        {
                            a: date
                        },
                        [
                            date
                        ]
                    ]
                },
                c: "hello 'world'",
                d: "hello \'world\'",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.stringToDates(objReversed, true);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.false;
    });

});
