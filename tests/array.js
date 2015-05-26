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

    it('Array.replace', function () {
        a.replace(3,8);
        expect(a.length).to.be.eql(5);
        expect(a.toString()).to.be.eql('1,2,8,4,5');
    });

    it('Array.replace appended', function () {
        a.replace(7,8);
        expect(a.length).to.be.eql(6);
        expect(a.toString()).to.be.eql('1,2,3,4,5,8');
    });

    it('Array.insertAt', function () {
        var newItem = {value: 99};
        b.insertAt(newItem, 1);
        expect(b.length).to.be.eql(6);
        expect(b).to.be.eql([item1, newItem, item2, item3, item4, item5]);
    });

    it('Array.insertAt - already available', function () {
        b.insertAt(item4, 1);
        expect(b.length).to.be.eql(5);
        expect(b).to.be.eql([item1, item4, item2, item3, item5]);
    });

    it('Array.insertAt - already available same position', function () {
        b.insertAt(item4, 3);
        expect(b.length).to.be.eql(5);
        expect(b).to.be.eql([item1, item2, item3, item4, item5]);
    });

    it('Array.insertAt - duplicate already available', function () {
        b.insertAt(item4, 1, true);
        expect(b.length).to.be.eql(6);
        expect(b).to.be.eql([item1, item4, item2, item3, item4, item5]);
    });

    it('Array.insertAt - duplicate already available same position', function () {
        b.insertAt(item4, 3, true);
        expect(b.length).to.be.eql(6);
        expect(b).to.be.eql([item1, item2, item3, item4, item4, item5]);
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

    it('Array.deepClone', function () {
        var cloned = b.deepClone();
        expect(b).be.eql(cloned);
        expect(b===cloned).to.be.false;
    });

    it('sameValue', function () {
        var c = [item1, item2, item3, item4, item5];
        expect(c.sameValue(b)).to.be.true;
        expect(c.sameValue(a)).to.be.false;
    });

    it('empty', function () {
        var c = [1, 2, 3];
        c.empty();
        expect(c).be.eql([]);
    });

    describe('defineData', function () {
        it('new data', function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.defineData(newArray);
            newArray[1][0] = 6;
            expect(array).be.eql(newArray);
            expect(array===newArray).to.be.false;
        });
        it('new data cloned', function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.defineData(newArray, true);
            newArray[1][0] = 6;
            expect(array).not.be.eql(newArray);
            expect(array===newArray).to.be.false;
        });
    });

});
