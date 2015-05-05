/*global describe, it, beforeEach */
/*jshint unused:false */

"use strict";
var expect = require('chai').expect;

require("../js-ext");

describe('Testing Math', function () {

    it('Math.inbetween when lower', function () {
        expect(Math.inbetween(0, -1, 10)).to.be.eql(0);
    });

    it('Math.inbetween when higher', function () {
        expect(Math.inbetween(0, 11, 10)).to.be.eql(10);
    });

    it('Math.inbetween when inbetween', function () {
        expect(Math.inbetween(0, 1, 10)).to.be.eql(1);
    });

    it('Math.inbetween when equals lower-value', function () {
        expect(Math.inbetween(0, 0, 10)).to.be.eql(0);
    });

    it('Math.inbetween when equals higher-value', function () {
        expect(Math.inbetween(0, 10, 10)).to.be.eql(10);
    });

    it('Math.inbetween when swapped values', function () {
        expect(Math.inbetween(10, 1, 0)===undefined).to.be.true;
    });

    it('Math.inbetween when lower with equal values', function () {
        expect(Math.inbetween(0, -1, 0)).to.be.eql(0);
    });

    it('Math.inbetween when higher with equal values', function () {
        expect(Math.inbetween(0, 11, 0)).to.be.eql(0);
    });

    it('Math.inbetween when inbetween with equal values', function () {
        expect(Math.inbetween(0, 1, 0)).to.be.eql(0);
    });

    it('Math.ceilFromZero when positive', function () {
        expect(Math.ceilFromZero(2.3)).to.be.eql(3);
    });

    it('Math.ceilFromZero when negative', function () {
        expect(Math.ceilFromZero(-2.3)).to.be.eql(-3);
    });

    it('Math.ceilFromZero when zero', function () {
        expect(Math.ceilFromZero(0)).to.be.eql(0);
    });

    it('Math.floorToZero when positive', function () {
        expect(Math.floorToZero(2.3)).to.be.eql(2);
    });

    it('Math.floorToZero when negative', function () {
        expect(Math.floorToZero(-2.3)).to.be.eql(-2);
    });

    it('Math.floorToZero when zero', function () {
        expect(Math.floorToZero(0)).to.be.eql(0);
    });

});
