import assert  from 'assert';
import * as ufo from '../src/ufo.js';

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var robotoUrl = "https://raw.githubusercontent.com/TypeNetwork/Roboto/master/master_ufo/Roboto-Black.ufo/fontinfo.plist"
global.XMLHttpRequest = require('xhr2'); // Polyfill

describe('Font reading', function() {
  it('can read a font from fs', function() {
    ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      expect(font).to.have.property("metainfo")
      expect(font.metainfo).to.have.property("creator", "org.robofab.ufoLib")
      expect(font).to.have.property("groups")
      expect(font).to.have.property("kerning")
    })
  })
})

describe('Kerning', function() {
  it('can read a simple kern pair', function() {
    ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      expect(font.getKerningValue("Cacute", "braceright")).to.equal(-17)
    })
  })
    it('can read a kern pair with groups', function() {
    ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      expect(font.getKerningValue("Gamma", "Upsilon")).to.equal(7)
    })
  })

})