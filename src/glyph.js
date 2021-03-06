import Promise from 'bluebird';
import { openXML } from './loader';
import Path from './path'

function Glyph(options) {
  this.name = options.name
  this.font = options.font
  this.url  = this.font.glyphFileFromName(this.name)
  this.loaded = false
  Object.defineProperty(this, "advanceWidth", {
    get: function () { return this.load().then( (s) => s["_advanceWidth"] ) }
  })
  Object.defineProperty(this, "unicodes", {
    get: function () { return this.load().then( (s) => s["_unicodes"] ) }
  })

  Object.defineProperty(this, "outline", {
    get: function () { return this.load().then( (s) => s["_outline"] ) }
  })

}

Glyph.prototype.load = function() {
  if (this.loaded) { return Promise.resolve(this) }
  return openXML(this.url, this.font.loadOptions).then( (data) => {
    this.loaded = true
    this.fromSource = data.glyph
    if (data.glyph.advance) {
      this._advanceWidth = Number(data.glyph.advance[0]["$"]["width"])
    }
    this._unicodes = (data.glyph.unicode||[]).map( (x) => parseInt(x["$"]["hex"],16) )
    if (this._unicodes[0]) {
      // This is naughty and should be documented
      this.font._glyphCache[String.fromCodePoint(this._unicodes[0])] = this
    }
    this._outline = data.glyph.outline[0]
    this._components = this._outline.component || []
    this._components = this._components.map( (c) => c["$"])
    this._contours = (this._outline && this._outline.contour) || []
    for (var cIdx in this._contours) {
      this._contours[cIdx] = this._contours[cIdx].point.map( (p) => p["$"] )
    }
    return this
  })
}

Glyph.prototype.getPath = function (x, y, fontSize, options) {
  var path = new Path()
  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize !== undefined ? fontSize : 72;
  if (!options) options = { };
  var scale = 1 / this.font.unitsPerEm * fontSize;

  return this.load()
    .then( () => {
      return Promise.all(this._components.map( (g) => this.font.getGlyph(g.base).load() ))
    })
    .then( () => {
      // Place base components on path
      return Promise.all(
        this._components.map( (c) => {
          let matrix1 = [
            Number(c.xScale||1),
            Number(c.xyScale||0),
            Number(c.yxScale||0),
            -Number(c.yScale||1),
            Number(c.xOffset||0),
            Number(c.yOffset||0)
          ]
          let matrix2 = [ scale, 0, 0, -scale, x, y]
          return this.font.getGlyph(c.base).getPath(0,0, this.font.unitsPerEm).then( p => {
            path.extend(p.transform(matrix1).transform(matrix2))
          }
          )
        })
      )
    })
    .then( () => {
      for (var c of this._contours) {
        // For a closed path (as most should be) start with the first oncurve
        // if (c[0].type == "move") { throw "Open paths not supported yet"}
        var firstOncurve = c.findIndex( (p) => p.type != "offcurve" )
        path.moveTo(x + c[firstOncurve].x * scale, y - c[firstOncurve].y * scale)
        let prev = function(i) {
          if (i-1 < 0) { i += c.length }
          return c[i-1]
        }
        let prevPrev = function(i) {
          if (i-2 < 0) { i += c.length }
          return c[i-2]
        }

        let handleNode = function (i) {
          var node = c[i]
          if (!node) { return }
          if (node.type == "offcurve") { off.push(node) }
          if (node.type == "line") {
            path.lineTo(x + node.x * scale, y - node.y * scale)
          } else if (node.type == "curve") {
            path.curveTo(
              x + prevPrev(i).x * scale, y - prevPrev(i).y * scale,
              x + prev(i).x * scale, y - prev(i).y * scale,
              x + node.x * scale, y - node.y * scale
            )
          }
        }
        for (var i = firstOncurve+1; i < c.length; i++) {
          handleNode(i)
        }
        for (var i = 0; i <= firstOncurve; i++) {
          handleNode(i)
        }
      }
      path.close()
      return path
    })
}

Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
    this.getPath(x, y, fontSize, options).then((path) => path.draw(ctx));
};

export default Glyph