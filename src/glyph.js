import Promise from 'bluebird';
import { openXML } from './loader';

function transformAdvance (n) {
  return Number(n[0]["$"]["width"])
}

function Glyph(options) {
  this.name = options.name
  this.font = options.font
  this.url  = this.font.glyphFileFromName(this.name)
  this.loaded = false
  Object.defineProperty(this, "advanceWidth", {
    get: function () { return this.lazyLoad("advanceWidth", "advance").then(transformAdvance) }
  })
}

Glyph.prototype.lazyLoad = function (p,s) {
  if (this.loaded) {
    delete this[p]
    this[p] = this.fromSource[s]
    return Promise.resolve(this[p])
  }
  return openXML(this.url, this.font.loadOptions).then( (data) => {
      this.loaded = true
      this.fromSource = data.glyph
      return Promise.resolve(data.glyph[s])
    }
  )
}

export default Glyph