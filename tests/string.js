/*global describe, it */
/*jshint unused:false */

"use strict";
var expect = require('chai').expect;

require("../js-ext");

describe('Testing String', function () {

    it('String.contains', function () {
        expect('Itsa small string'.contains('small')).to.be.true;
        expect('Itsa smallstring'.contains('small')).to.be.true;
        expect('Itsasmall string'.contains('small')).to.be.true;
        expect('Itsasmallstring'.contains('small')).to.be.true;
        expect('small string'.contains('small')).to.be.true;
        expect('smallstring'.contains('small')).to.be.true;
        expect('string small'.contains('small')).to.be.true;
        expect('stringsmall'.contains('small')).to.be.true;
        expect('Itsa small string'.contains('smalle')).to.be.false;
    });

    it('String.endsWith', function () {
        expect('Itsa small string'.endsWith('string')).to.be.true;
        expect('Itsa small string'.endsWith(' string')).to.be.true;
        expect('Itsa small string'.endsWith('string ')).to.be.false;
        expect('Itsa small string'.endsWith('STRING')).to.be.false;
        expect('Itsa small string'.endsWith('strin')).to.be.false;
        expect('Itsa small string'.endsWith('STRING', true)).to.be.true;
    });

    it('String.startsWith', function () {
        expect('Itsa small string'.startsWith('Itsa')).to.be.true;
        expect('Itsa small string'.startsWith('Itsa ')).to.be.true;
        expect('Itsa small string'.startsWith(' Itsa')).to.be.false;
        expect('Itsa small string'.startsWith('ITSA')).to.be.false;
        expect('Itsa small string'.startsWith('tsa')).to.be.false;
        expect('Itsa small string'.startsWith('ITSA', true)).to.be.true;
    });

    it('String.substitute', function () {
        var greeting = '{message} {who}!';
        expect(greeting.substitute({message: 'Hello'})).to.be.eql('Hello !');
    });

    it('String.toDate', function () {
        var birthday = '2010-02-10T14:45:30.000Z';
        var checkDay = new Date(Date.UTC(2010,1,10,14,45,30,0));
        expect(birthday.toDate().getTime()).to.be.eql(checkDay.getTime());
    });

    it('String.trim', function () {
        expect(' Hello World '.trim()).to.be.eql('Hello World');
    });

    it('String.trimLeft', function () {
        expect(' Hello World '.trimLeft()).to.be.eql('Hello World ');
    });

    it('String.trimRight', function () {
        expect(' Hello World '.trimRight()).to.be.eql(' Hello World');
    });

    it('String.replace', function () {
        expect('abcABCabcABC'.replace('B', 'z')).to.be.equal('abcAzCabcABC');
    });

    it('String.replace case-insensitive', function () {
        expect('abcABCabcABC'.replace('B', 'z', true)).to.be.equal('azcABCabcABC');
    });

    it('String.replaceAll', function () {
        expect('abcABCabcABC'.replaceAll('B', 'z')).to.be.equal('abcAzCabcAzC');
    });

    it('String.replaceAll case-insensitive', function () {
        expect('abcABCabcABC'.replaceAll('B', 'z', true)).to.be.equal('azcAzCazcAzC');
    });

    it('String.validateEmail', function () {
        expect('a@aa.nl'.validateEmail()).to.be.true;
        expect('a@aa.n'.validateEmail()).to.be.false;
        expect('a.aa.nl'.validateEmail()).to.be.false;
        expect('@aa.nl'.validateEmail()).to.be.false;
        expect('a@nl'.validateEmail()).to.be.false;
        expect('a@.nl'.validateEmail()).to.be.false;
        expect('a@a.nl'.validateEmail()).to.be.false;
        expect('a.a@aa.nl'.validateEmail()).to.be.true;
        expect('.a@aa.nl'.validateEmail()).to.be.false;
        expect('a@aa.nl.'.validateEmail()).to.be.false;
        expect('a.@aa.nl'.validateEmail()).to.be.false;
        expect('a_@aa.nl'.validateEmail()).to.be.true;
        expect('_a@aa.nl'.validateEmail()).to.be.true;
        expect('_@aa.nl'.validateEmail()).to.be.true;
        expect('a@_a.nl'.validateEmail()).to.be.false;
        expect('a@a_.nl'.validateEmail()).to.be.false;
    });

    it('String.validateFloat', function () {
        expect('2,20'.validateFloat()).to.be.false;
        expect('2'.validateFloat()).to.be.true;
        expect('.20'.validateFloat()).to.be.true;
        expect('0.20'.validateFloat()).to.be.true;
        expect('00.20'.validateFloat()).to.be.false;
        expect('2.0'.validateFloat()).to.be.true;
        expect('2.00'.validateFloat()).to.be.true;
        expect('2.'.validateFloat()).to.be.false;
        expect('2,'.validateFloat()).to.be.false;
    });

    it('String.validateHexaColor', function () {
        expect('333'.validateHexaColor()).to.be.true;
        expect('3A3'.validateHexaColor()).to.be.true;
        expect('3F3'.validateHexaColor()).to.be.true;
        expect('3G3'.validateHexaColor()).to.be.false;
        expect(''.validateHexaColor()).to.be.false;
        expect('3'.validateHexaColor()).to.be.false;
        expect('33'.validateHexaColor()).to.be.false;
        expect('3333'.validateHexaColor()).to.be.false;
        expect('33333'.validateHexaColor()).to.be.false;
        expect('777333'.validateHexaColor()).to.be.true;
        expect('7773A3'.validateHexaColor()).to.be.true;
        expect('7773F3'.validateHexaColor()).to.be.true;
        expect('7773G3'.validateHexaColor()).to.be.false;
        expect('7773337'.validateHexaColor()).to.be.false;

        expect('#333'.validateHexaColor()).to.be.true;
        expect('#3A3'.validateHexaColor()).to.be.true;
        expect('#3F3'.validateHexaColor()).to.be.true;
        expect('#3G3'.validateHexaColor()).to.be.false;
        expect(''.validateHexaColor()).to.be.false;
        expect('#'.validateHexaColor()).to.be.false;
        expect('#3'.validateHexaColor()).to.be.false;
        expect('#33'.validateHexaColor()).to.be.false;
        expect('#3333'.validateHexaColor()).to.be.false;
        expect('#33333'.validateHexaColor()).to.be.false;
        expect('#777333'.validateHexaColor()).to.be.true;
        expect('#7773A3'.validateHexaColor()).to.be.true;
        expect('#7773F3'.validateHexaColor()).to.be.true;
        expect('#7773G3'.validateHexaColor()).to.be.false;
        expect('#7773337'.validateHexaColor()).to.be.false;
    });

    it('String.validateHexaColor with alpha', function () {
        expect('3333'.validateHexaColor(true)).to.be.true;
        expect('3A33'.validateHexaColor(true)).to.be.true;
        expect('3F33'.validateHexaColor(true)).to.be.true;
        expect('3G33'.validateHexaColor(true)).to.be.false;
        expect(''.validateHexaColor(true)).to.be.false;
        expect('3'.validateHexaColor(true)).to.be.false;
        expect('33'.validateHexaColor(true)).to.be.false;
        expect('333'.validateHexaColor(true)).to.be.false;
        expect('33333'.validateHexaColor(true)).to.be.false;
        expect('333333'.validateHexaColor(true)).to.be.false;
        expect('77733377'.validateHexaColor(true)).to.be.true;
        expect('7773A377'.validateHexaColor(true)).to.be.true;
        expect('7773F377'.validateHexaColor(true)).to.be.true;
        expect('7773G377'.validateHexaColor(true)).to.be.false;
        expect('777333777'.validateHexaColor(true)).to.be.false;
        expect('#3333'.validateHexaColor(true)).to.be.true;
        expect('#3A33'.validateHexaColor(true)).to.be.true;
        expect('#3F33'.validateHexaColor(true)).to.be.true;
        expect('#3G33'.validateHexaColor(true)).to.be.false;
        expect(''.validateHexaColor(true)).to.be.false;
        expect('#'.validateHexaColor(true)).to.be.false;
        expect('#3'.validateHexaColor(true)).to.be.false;
        expect('#33'.validateHexaColor(true)).to.be.false;
        expect('#333'.validateHexaColor(true)).to.be.false;
        expect('#33333'.validateHexaColor(true)).to.be.false;
        expect('#333333'.validateHexaColor(true)).to.be.false;
        expect('#3333337'.validateHexaColor(true)).to.be.false;
        expect('#77733377'.validateHexaColor(true)).to.be.true;
        expect('#7773A377'.validateHexaColor(true)).to.be.true;
        expect('#7773F377'.validateHexaColor(true)).to.be.true;
        expect('#7773G377'.validateHexaColor(true)).to.be.false;
        expect('#777333777'.validateHexaColor(true)).to.be.false;
    });

    it('String.validateNumber', function () {
        expect('2,20'.validateNumber()).to.be.false;
        expect('2.20'.validateNumber()).to.be.false;
        expect('2,2'.validateNumber()).to.be.false;
        expect('2.2'.validateNumber()).to.be.false;
        expect('2'.validateNumber()).to.be.true;
        expect('.2'.validateNumber()).to.be.false;
        expect(',2'.validateNumber()).to.be.false;
        expect('.0'.validateNumber()).to.be.false;
        expect(',2'.validateNumber()).to.be.false;
        expect('02'.validateNumber()).to.be.false;
        expect('0'.validateNumber()).to.be.true;
        expect('00'.validateNumber()).to.be.false;
        expect(''.validateNumber()).to.be.false;
        expect('20'.validateNumber()).to.be.true;
    });

    it('String.validateURL', function () {
        expect('htt://a.aa.nl'.validateURL()).to.be.false;
        expect('http://a.aa.nl'.validateURL()).to.be.true;
        expect('https://a.aa.nl'.validateURL()).to.be.true;
        expect('http:/a.aa.nl'.validateURL()).to.be.false;
        expect('https:/a.aa.nl'.validateURL()).to.be.false;
        expect('a.aa.nl'.validateURL()).to.be.true;
        expect('a.aa.n'.validateURL()).to.be.false;
        expect('a@aa.nl'.validateURL()).to.be.false;
        expect('.aa.nl'.validateURL()).to.be.false;
        expect('a.nl'.validateURL()).to.be.false;
        expect('aa.nl'.validateURL()).to.be.true;
        expect('a..nl'.validateURL()).to.be.false;
        expect('a.a.nl'.validateURL()).to.be.false;
        expect('a.a.aa.nl'.validateURL()).to.be.true;
        expect('.a.aa.nl'.validateURL()).to.be.false;
        expect('a.aa.nl.'.validateURL()).to.be.false;
        expect('a..aa.nl'.validateURL()).to.be.false;

        expect('http://a.aa.nl'.validateURL()).to.be.true;
        expect('http://a.aa.n'.validateURL()).to.be.false;
        expect('http://a@aa.nl'.validateURL()).to.be.false;
        expect('http://.aa.nl'.validateURL()).to.be.false;
        expect('http://a.nl'.validateURL()).to.be.false;
        expect('http://aa.nl'.validateURL()).to.be.true;
        expect('http://a..nl'.validateURL()).to.be.false;
        expect('http://a.a.nl'.validateURL()).to.be.false;
        expect('http://a.a.aa.nl'.validateURL()).to.be.true;
        expect('http://.a.aa.nl'.validateURL()).to.be.false;
        expect('http://a.aa.nl.'.validateURL()).to.be.false;
        expect('http://a..aa.nl'.validateURL()).to.be.false;

        expect('https://a.aa.nl'.validateURL()).to.be.true;
        expect('https://a.aa.n'.validateURL()).to.be.false;
        expect('https://a@aa.nl'.validateURL()).to.be.false;
        expect('https://.aa.nl'.validateURL()).to.be.false;
        expect('https://a.nl'.validateURL()).to.be.false;
        expect('https://aa.nl'.validateURL()).to.be.true;
        expect('https://a..nl'.validateURL()).to.be.false;
        expect('https://a.a.nl'.validateURL()).to.be.false;
        expect('https://a.a.aa.nl'.validateURL()).to.be.true;
        expect('https://.a.aa.nl'.validateURL()).to.be.false;
        expect('https://a.aa.nl.'.validateURL()).to.be.false;
        expect('https://a..aa.nl'.validateURL()).to.be.false;
    });

    it('String.validateURL force http', function () {
        expect('htt://a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('http://a.aa.nl'.validateURL({http: true})).to.be.true;
        expect('https://a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('http:/a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('https:/a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('a.aa.n'.validateURL({http: true})).to.be.false;
        expect('a@aa.nl'.validateURL({http: true})).to.be.false;
        expect('.aa.nl'.validateURL({http: true})).to.be.false;
        expect('a.nl'.validateURL({http: true})).to.be.false;
        expect('aa.nl'.validateURL({http: true})).to.be.false;
        expect('a..nl'.validateURL({http: true})).to.be.false;
        expect('a.a.nl'.validateURL({http: true})).to.be.false;
        expect('a.a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('.a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('a.aa.nl.'.validateURL({http: true})).to.be.false;
        expect('a..aa.nl'.validateURL({http: true})).to.be.false;

        expect('http://a.aa.nl'.validateURL({http: true})).to.be.true;
        expect('http://a.aa.n'.validateURL({http: true})).to.be.false;
        expect('http://a@aa.nl'.validateURL({http: true})).to.be.false;
        expect('http://.aa.nl'.validateURL({http: true})).to.be.false;
        expect('http://a.nl'.validateURL({http: true})).to.be.false;
        expect('http://aa.nl'.validateURL({http: true})).to.be.true;
        expect('http://a..nl'.validateURL({http: true})).to.be.false;
        expect('http://a.a.nl'.validateURL({http: true})).to.be.false;
        expect('http://a.a.aa.nl'.validateURL({http: true})).to.be.true;
        expect('http://.a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('http://a.aa.nl.'.validateURL({http: true})).to.be.false;
        expect('http://a..aa.nl'.validateURL({http: true})).to.be.false;

        expect('https://a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('https://a.aa.n'.validateURL({http: true})).to.be.false;
        expect('https://a@aa.nl'.validateURL({http: true})).to.be.false;
        expect('https://.aa.nl'.validateURL({http: true})).to.be.false;
        expect('https://a.nl'.validateURL({http: true})).to.be.false;
        expect('https://aa.nl'.validateURL({http: true})).to.be.false;
        expect('https://a..nl'.validateURL({http: true})).to.be.false;
        expect('https://a.a.nl'.validateURL({http: true})).to.be.false;
        expect('https://a.a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('https://.a.aa.nl'.validateURL({http: true})).to.be.false;
        expect('https://a.aa.nl.'.validateURL({http: true})).to.be.false;
        expect('https://a..aa.nl'.validateURL({http: true})).to.be.false;
    });

    it('String.validateURL force https', function () {
        expect('htt://a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('https://a.aa.nl'.validateURL({https: true})).to.be.true;
        expect('http:/a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('https:/a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('a.aa.n'.validateURL({https: true})).to.be.false;
        expect('a@aa.nl'.validateURL({https: true})).to.be.false;
        expect('.aa.nl'.validateURL({https: true})).to.be.false;
        expect('a.nl'.validateURL({https: true})).to.be.false;
        expect('aa.nl'.validateURL({https: true})).to.be.false;
        expect('a..nl'.validateURL({https: true})).to.be.false;
        expect('a.a.nl'.validateURL({https: true})).to.be.false;
        expect('a.a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('.a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('a.aa.nl.'.validateURL({https: true})).to.be.false;
        expect('a..aa.nl'.validateURL({https: true})).to.be.false;

        expect('http://a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://a.aa.n'.validateURL({https: true})).to.be.false;
        expect('http://a@aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://.aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://a.nl'.validateURL({https: true})).to.be.false;
        expect('http://aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://a..nl'.validateURL({https: true})).to.be.false;
        expect('http://a.a.nl'.validateURL({https: true})).to.be.false;
        expect('http://a.a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://.a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('http://a.aa.nl.'.validateURL({https: true})).to.be.false;
        expect('http://a..aa.nl'.validateURL({https: true})).to.be.false;

        expect('https://a.aa.nl'.validateURL({https: true})).to.be.true;
        expect('https://a.aa.n'.validateURL({https: true})).to.be.false;
        expect('https://a@aa.nl'.validateURL({https: true})).to.be.false;
        expect('https://.aa.nl'.validateURL({https: true})).to.be.false;
        expect('https://a.nl'.validateURL({https: true})).to.be.false;
        expect('https://aa.nl'.validateURL({https: true})).to.be.true;
        expect('https://a..nl'.validateURL({https: true})).to.be.false;
        expect('https://a.a.nl'.validateURL({https: true})).to.be.false;
        expect('https://a.a.aa.nl'.validateURL({https: true})).to.be.true;
        expect('https://.a.aa.nl'.validateURL({https: true})).to.be.false;
        expect('https://a.aa.nl.'.validateURL({https: true})).to.be.false;
        expect('https://a..aa.nl'.validateURL({https: true})).to.be.false;
    });
});