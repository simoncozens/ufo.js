import assert  from 'assert';
import Glyph from '../src/glyph.js';
import * as ufo from '../src/ufo.js';

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('Glyph reading', function() {
  it('can lazy-load a property', function() {
    var font = ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      var glyph = new Glyph({
        font: font,
        name: "zero"
      })
      expect(glyph["advanceWidth"]).to.eventually.equal(1187)
      expect(glyph["advanceWidth"]).to.eventually.equal(1187)
      expect(glyph["advanceWidth"]).to.eventually.equal(1187)
    })
  })

  it('can load a glyph from a string', function() {
    var font = ufo.load("./fonts/Roboto-Black.ufo", function (err, font) {
      if (err) { throw err }
      var glyphs = font.stringToGlyphs("A/zero /five/b b")
      expect(glyphs[0]["advanceWidth"]).to.eventually.equal(1395)
      expect(glyphs[1]["advanceWidth"]).to.eventually.equal(1187)
      expect(glyphs[2]["advanceWidth"]).to.eventually.equal(1187)
      expect(glyphs[3]["advanceWidth"]).to.eventually.equal(1153)
      expect(glyphs[4]["advanceWidth"]).to.eventually.equal(1153)
    })
  })

})