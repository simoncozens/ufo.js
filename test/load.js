import assert  from 'assert';
import { _readFiletoPromise, _XHRtoPromise, openPlist, openXML } from '../src/loader.js'

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var robotoUrl = "https://raw.githubusercontent.com/TypeNetwork/Roboto/master/master_ufo/Roboto-Black.ufo/fontinfo.plist"
global.XMLHttpRequest = require('xhr2'); // Polyfill

describe('File reading', function() {
  it('can read a file from fs', function() {
    return expect(
      _readFiletoPromise("./fonts/Roboto-Black.ufo/fontinfo.plist")
    ).to.eventually.include("<?xml vers")
  });

  it('can read a file to a plist', function() {
    return expect(
      openPlist("./fonts/Roboto-Black.ufo/fontinfo.plist")
    ).to.eventually.have.property("ascender",2146)
  });

  it('can read a file from web', function() {
    return expect(
          _XHRtoPromise(robotoUrl)
        ).to.eventually.include("<?xml vers")
  });
  it('can read a plist from web (with custom loadFn)', function() {
    return expect(
      openPlist(robotoUrl, { loadFn: _XHRtoPromise })
    ).to.eventually.have.property("ascender",2146)
  });

  it('can read XML', function() {
    return expect(
      openXML("./fonts/Roboto-Black.ufo/glyphs/zero.glif")
    ).to.eventually.have.property("glyph")
  })
})
