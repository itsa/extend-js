/*global describe, it */
"use strict";
require('chai').should();
var ITSA = require("../extend-js");

describe('Testing function instance methods', function () {
    var func = function() {
        return arguments;
    };
    var contextfunc = function() {
        return this;
    };
    describe('rbind', function () {
        it('added arguments after arguments - same context', function () {
            var rbindfunc = func.rbind(null, 'append');
            rbindfunc('original')[0].should.be.eql('original');
            rbindfunc('original')[1].should.be.eql('append');
        });
        it('added arguments on empty - same context', function () {
            var rbindfunc = func.rbind(null, 'append');
            rbindfunc()[0].should.be.eql('append');
        });
        it('added no arguments - same context', function () {
            var rbindfunc = func.rbind(null);
            rbindfunc('original')[0].should.be.eql('original');
        });
        it('check nr arguments - same context', function () {
            var rbindfuncEmpty = func.rbind(null),
                rbindfunc = func.rbind(null, 'append1', 'append2');
            /*
            // CAUTIOUS: IE9 thinks "rbindfuncEmpty().length" is an object ??
            // that's why we changed the next 4 evaluations
            rbindfuncEmpty().length.should.be.eql(0);
            rbindfuncEmpty('first', 'second', 'third').length.should.be.eql(3);
            rbindfunc().length.should.be.eql(2);
            rbindfunc('first', 'second', 'third').length.should.be.eql(5);
            */
            (rbindfuncEmpty().length===0).should.be.true;
            (rbindfuncEmpty('first', 'second', 'third').length===3).should.be.true;
            (rbindfunc().length===2).should.be.true;
            (rbindfunc('first', 'second', 'third').length===5).should.be.true;
        });

        it('added arguments after arguments - changed context', function () {
            var newthis = {},
                rbindfunc = func.rbind(newthis, 'append');
            rbindfunc('original')[0].should.be.eql('original');
            rbindfunc('original')[1].should.be.eql('append');
        });
        it('added arguments on empty - changed context', function () {
            var newthis = {},
                rbindfunc = func.rbind(newthis, 'append');
            rbindfunc()[0].should.be.eql('append');
        });
        it('added no arguments - changed context', function () {
            var newthis = {},
                rbindfunc = func.rbind(newthis);
            rbindfunc('original')[0].should.be.eql('original');
        });
        it('check nr arguments - changed context', function () {
            var newthis = {},
                rbindfuncEmpty = func.rbind(newthis),
                rbindfunc = func.rbind(newthis, 'append1', 'append2');
            /*
            // CAUTIOUS: IE9 thinks "rbindfuncEmpty().length" is an object ??
            // that's why we changed the next 4 evaluations
            rbindfuncEmpty().length.should.be.eql(0);
            rbindfuncEmpty('first', 'second', 'third').length.should.be.eql(3);
            rbindfunc().length.should.be.eql(2);
            rbindfunc('first', 'second', 'third').length.should.be.eql(5);
            */
            (rbindfuncEmpty().length===0).should.be.true;
            (rbindfuncEmpty('first', 'second', 'third').length===3).should.be.true;
            (rbindfunc().length===2).should.be.true;
            (rbindfunc('first', 'second', 'third').length===5).should.be.true;
        });


        it('check changed context', function () {
            var newthis = {},
                rbindfuncEmpty = contextfunc.rbind(newthis),
                rbindfunc = contextfunc.rbind(newthis, 'append1', 'append2');
            rbindfuncEmpty().should.be.eql(newthis);
            rbindfunc().should.be.eql(newthis);
            rbindfuncEmpty('original').should.be.eql(newthis);
            rbindfunc('original').should.be.eql(newthis);
        });
        it('check retained context', function () {
            var rbindfuncEmpty = contextfunc.rbind(null),
                rbindfunc = contextfunc.rbind(null, 'append1', 'append2'),
                executedFn;
            executedFn = rbindfuncEmpty();
            executedFn.should.be.eql(executedFn);
            executedFn = rbindfunc();
            executedFn.should.be.eql(executedFn);
            executedFn = rbindfuncEmpty('original');
            executedFn.should.be.eql(executedFn);
            executedFn = rbindfunc('original');
            executedFn.should.be.eql(executedFn);
        });
    });
});
