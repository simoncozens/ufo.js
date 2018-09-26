import Promise from 'bluebird';
import plist from 'plist';
var parseString = require('xml2js').parseString;

// Scaffolding for reading some files in a cross-platform way

function _readFiletoPromise(path) {
  var promise = Promise.promisify(require("fs").readFile)
  return promise(path).then( (d) => d.toString() )
}

function _XHRtoPromise(url){
  const xhr = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    xhr.onload = () => {
      if(xhr.readyState !== 4) return;
      if(xhr.status === 200) resolve(xhr.responseText);
      else reject(xhr.statusText);
    }
    xhr.onerror = () => {
      reject(xhr.statusText);
    };
  });

  xhr.open('GET', url)
  xhr.send()
  return promise;
}

function openUrl (url, options) {
  const isNode = typeof window === 'undefined';
  options = options || {}
  var loadFn = options.loadFn || (
    isNode ? _readFiletoPromise : _XHRtoPromise
  )
  return loadFn(url)
}

function openPlist (url, options) {
  return openUrl(url,options).then( (d) => plist.parse(d) )
}

function openXML (url, options) {
  return openUrl(url,options).then(Promise.promisify(parseString))
}

export { _readFiletoPromise, _XHRtoPromise, openPlist, openXML }
