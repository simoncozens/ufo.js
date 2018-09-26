import Promise from 'bluebird';
import { openXML } from './loader';

function Glyph(options) {
  this.name = options.name
  this.font = options.font
  this.url  = this.font.glyphFileFromName(this.name)
  this.loaded = false
  Object.defineProperty(this, "advanceWidth", {
    get: function () { return this.load().then( (s) => s["_advanceWidth"] ) }
  })
}

Glyph.prototype.load = function() {
  if (this.loaded) { return Promise.resolve(this) }
  return openXML(this.url, this.font.loadOptions).then( (data) => {
    this.loaded = true
    this.fromSource = data.glyph
    this._advanceWidth = Number(data.glyph.advance[0]["$"]["width"])
    return this
  })
}

export default Glyph