
// import 'string.prototype.codepointat';
// import inflate from 'tiny-inflate';
import Promise from 'bluebird';
import Font from './font';
import { _readFiletoPromise, _XHRtoPromise, openPlist } from './loader'

// Right, let's load a UFO

function load(url, callback, options) {
  var ufo = {}
  const font = new Font({empty: true, root: url });
  font.loadOptions = options
  openPlist(url+"/metainfo.plist", options)
  .then( (o) => { font.metainfo = o })
  .then( () => openPlist(url+"/fontinfo.plist", options) )
  .then( (o) => font.fontinfo = o)
  .then( () => openPlist(url+"/glyphs/contents.plist", options) )
  .then( (o) => font.glyphtable = o)
  .then( () => {
    // Group data is optional.
    return openPlist(url+"/groups.plist", options)
      .then( (o) => font.groups = o)
      .catch( (e) => {} )
  })
  .then( () => {
    // Kerning data is optional.
    return openPlist(url+"/kerning.plist", options)
      .then( (o) => font.kerning = o)
      .catch( (e) => {} )
  })
  .then( () => callback(null, font) )
  .catch( (e) => callback(e, null) )
}

export { load }