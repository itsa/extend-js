/*global describe, it, beforeEach */
/*jshint unused:false */

"use strict";
var expect = require('chai').expect,
    a, b,
    item0 = {value: 0},
    item1 = {value: 1},
    item2 = {value: 2},
    item3 = {value: 3},
    item4 = {value: 4},
    item5 = {value: 5};

require("../js-ext");

describe('Testing Array', function () {

    // Code to execute before every test.
    beforeEach(function() {
        a = [1,2,3,4,5];
        b = [item1, item2, item3, item4, item5];
    });

    it('Array.contains', function () {
        expect(a.contains(3)).to.be.true;
        expect(a.contains(0)).to.be.false;
        expect(a.contains(-1)).to.be.false;
        expect(b.contains(item3)).to.be.true;
        expect(a.contains(item0)).to.be.false;
        expect(a.contains(null)).to.be.false;
    });

    it('Array.shuffle', function () {
        var aBefore = a.toString(),
            bBefore = b.toString();
        a.shuffle();
        b.shuffle();
        expect(a.length).to.be.eql(5);
        expect(b.length).to.be.eql(5);
        expect(aBefore).not.to.be.eql(a.toString());
        expect(a.contains(1)).to.be.true;
        expect(a.contains(2)).to.be.true;
        expect(a.contains(3)).to.be.true;
        expect(a.contains(4)).to.be.true;
        expect(a.contains(5)).to.be.true;
        expect(b.contains(item1)).to.be.true;
        expect(b.contains(item2)).to.be.true;
        expect(b.contains(item3)).to.be.true;
        expect(b.contains(item4)).to.be.true;
        expect(b.contains(item5)).to.be.true;
    });

    it('Array.remove', function () {
        a.remove(3);
        b.remove(item3);
        expect(a.length).to.be.eql(4);
        expect(b.length).to.be.eql(4);
        expect(a.contains(3)).to.be.false;
        expect(b.contains(item3)).to.be.false;
        expect(a[0]).to.be.eql(1);
        expect(a[1]).to.be.eql(2);
        expect(a[2]).to.be.eql(4);
        expect(a[3]).to.be.eql(5);
        expect(b[0]).to.be.eql(item1);
        expect(b[1]).to.be.eql(item2);
        expect(b[2]).to.be.eql(item4);
        expect(b[3]).to.be.eql(item5);
    });

});
