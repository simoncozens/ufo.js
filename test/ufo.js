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

describe('Advance Widths', function() {
  it('can read advance widths with no kerning', function() {
    ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      expect(font.getAdvanceWidth("HO",72)).to.eventually.equal(100.30078125)
      expect(font.getAdvanceWidth("AV",72, {kerning:false})).to.eventually.equal(96.64453125)
    })
  })
  it('can read advance widths with kerning', function() {
    ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      expect(font.getAdvanceWidth("AV",72, {kerning:true})).to.eventually.equal(93.9375)
      expect(font.getAdvanceWidth("AV",72, {kerning:true})).to.eventually.equal(93.9375)
      expect(font.getAdvanceWidth("AV",72, {kerning:true})).to.eventually.equal(93.9375)
      expect(font.getAdvanceWidth("AV",72, {kerning:true})).to.eventually.equal(93.9375)
    })
  })

})

describe('Load all glyphs', function() {
  it('can load all glyphs', function() {
    ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      font.loadAllGlyphs().then( () => {
        expect(Object.keys(font._glyphCache).length).to.equal(3387)
      })
    })
  })
})
