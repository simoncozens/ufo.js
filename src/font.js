import Promise from 'bluebird';
import Glyph from './glyph.js';

function Font(options) {
    options = options || {};

    if (!options.empty) {
        console.log("Grumble")
    }
    this.root = options.root
    // XXX
}


Font.prototype.defaultRenderOptions = {
    kerning: true,
    // features: {
    //     liga: true,
    //     rlig: true
    // }
};

Font.prototype.glyphFileFromName = function (name) {
  var filename = this.glyphtable[name]
  if (!filename) { throw "Glyph '"+name+"' not found in glyph table" }
  return this.root + "/glyphs/"+filename
}

Font.prototype.stringToGlyphs = function(s, options) {
  options = options || this.defaultRenderOptions;
  var array = s.split(/\/([\w\.]+)\s?|/).filter(Boolean)
  if (options.features) { throw "Sorry, features not implemented yet" }
  return array.map( (s) => new Glyph({font: this, name: s }))
}

Font.prototype._findGroups = function (glyphname) {
  var groups = this.groups
  var found = []
  if (!groups) { return null }
  for (var group in groups) {
    var index = groups[group].indexOf(glyphname)
    if (index > -1) found.push(group)
  }
  return found
}

Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
  if (leftGlyph.name) { leftGlyph = leftGlyph.name }
  if (rightGlyph.name) { rightGlyph = rightGlyph.name}
  if (!this.kerning) { return null }
  // First, check for the existence of a kern pair directly
  if (leftGlyph in this.kerning && rightGlyph in this.kerning[leftGlyph]) {
    return this.kerning[leftGlyph][rightGlyph]
  }

  if (!this.groups) { return null }

  var lglyphGroups = this._findGroups(leftGlyph)
  var rglyphGroups = this._findGroups(rightGlyph)

  // XXX Unsure of correct lookup order here
  for (var lgroup of lglyphGroups) {
    var tryLeft = this.getKerningValue(lgroup, rightGlyph)
    if (tryLeft !== null) { return tryLeft }
  }
  for (var rgroup of rglyphGroups) {
    var tryRight = this.getKerningValue(leftGlyph, rgroup)
    if (tryRight !== null) { return tryRight }
  }

  for (var lgroup of lglyphGroups) {
    for (var rgroup of rglyphGroups) {
      var tryBoth = this.getKerningValue(lgroup,rgroup)
      if (tryBoth !== null) { return tryBoth }
    }
  }
  return null
}
export default Font;