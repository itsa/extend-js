/*global describe, it */
/*jshint unused:false */

"use strict";

var expect = require('chai').expect,
    Classes = require("js-ext/extra/classes.js");

require("../js-ext");



describe('test 1', function () {
    it('Properties should be accessable', function () {
        var C1 = Classes.createClass(function() {
console.info('inside Class C0:');
            console.warn('this.$super.m inside C0: '+this.$super.m+' (should be undefined)');
            expect(this.m).to.be.equal(40);
            expect(this.$own.m).to.be.equal(10);
            expect(this.$super.m===undefined).to.be.true;

            expect(this.f()).to.be.equal('F4');
            expect(this.$own.f()).to.be.equal('F1');
            expect(this.$super.f===undefined).to.be.true;

            expect(this.g()).to.be.equal('G3');
            expect(this.$own.g()).to.be.equal('G1');
            expect(this.$super.g===undefined).to.be.true;
        }, {
            m: 10,
            f: function() {
                return 'F1';
            },
            g: function() {
                return 'G1';
            }
        });
        var C2 = C1.subClass(function() {
console.info('inside Class C1:');
            console.warn('this.$super.m inside C1: '+this.$super.m+' (should be 10)');
            expect(this.m).to.be.equal(40);
            expect(this.$own.m).to.be.equal(20);
            expect(this.$super.m).to.be.equal(10);
            expect(this.$super.$super.m===undefined).to.be.true;

            expect(this.f()).to.be.equal('F4');
            expect(this.$own.f()).to.be.equal('F2');
            expect(this.$super.f()).to.be.equal('F1');
            expect(this.$super.$super.f===undefined).to.be.true;

            expect(this.g()).to.be.equal('G3');
            expect(this.$own.g()).to.be.equal('G1');
            expect(this.$super.g()).to.be.equal('G1');
            expect(this.$super.$super.g===undefined).to.be.true;
        }, {
            m: 20,
            f: function() {
                return 'F2';
            }
        });
        var C3 = C2.subClass(function() {
console.info('inside Class C2:');
            console.warn('this.$super.m inside C2: '+this.$super.m+' (should be 20)');
            expect(this.m).to.be.equal(40);
            expect(this.$own.m).to.be.equal(30);
            expect(this.$super.m).to.be.equal(20);
            expect(this.$super.$super.m).to.be.equal(10);
            expect(this.$super.$super.$super.m===undefined).to.be.true;

            expect(this.f()).to.be.equal('F4');
            expect(this.$own.f()).to.be.equal('F3');
            expect(this.$super.f()).to.be.equal('F2');
            expect(this.$super.$super.f()).to.be.equal('F1');
            expect(this.$super.$super.$super.f===undefined).to.be.true;

            expect(this.g()).to.be.equal('G3');
            expect(this.$own.g()).to.be.equal('G3');
            expect(this.$super.g()).to.be.equal('G1');
            expect(this.$super.$super.g()).to.be.equal('G1');
            expect(this.$super.$super.$super.g===undefined).to.be.true;
            // console.warn(this.f());
            // console.warn(this.dummy);
        }, {
            m: 30,
            f: function() {
                return 'F3';
            },
            g: function() {
                return 'G3';
            }
        });
        var C4 = C3.subClass(function() {
console.info('inside Class C2:');
            console.warn('this.$super.m inside C2: '+this.$super.m+' (should be 20)');
            expect(this.m).to.be.equal(40);
            expect(this.$own.m).to.be.equal(40);
            expect(this.$super.m).to.be.equal(30);
            expect(this.$super.$super.m).to.be.equal(20);
            expect(this.$super.$super.$super.m).to.be.equal(10);
            expect(this.$super.$super.$super.$super.m===undefined).to.be.true;

            expect(this.f()).to.be.equal('F4');
            expect(this.$own.f()).to.be.equal('F4');
            expect(this.$super.f()).to.be.equal('F3');
            expect(this.$super.$super.f()).to.be.equal('F2');
            expect(this.$super.$super.$super.f()).to.be.equal('F1');
            expect(this.$super.$super.$super.$super.f===undefined).to.be.true;

            expect(this.g()).to.be.equal('G3');
            expect(this.$own.g()).to.be.equal('G3');
            expect(this.$super.g()).to.be.equal('G3');
            expect(this.$super.$super.g()).to.be.equal('G1');
            expect(this.$super.$super.$super.g()).to.be.equal('G1');
            expect(this.$super.$super.$super.$super.g===undefined).to.be.true;
            // console.warn(this.f());
            // console.warn(this.dummy);
        }, {
            m: 40,
            f: function() {
                return 'F4';
            }
        });
        var c4 = new C4();
    });
});

