import Promise from 'bluebird';
import { parse } from 'plist/lib/parse';
import { parseString } from 'xml2js/lib/parser';

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
      if(xhr.status === 200) return resolve(xhr.responseText);
      else return reject(new Error(xhr.statusText));
    }
    xhr.onerror = () => {
      return reject(new Error(xhr.statusText));
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
  return openUrl(url,options).then( (d) => parse(d) )
}

function openXML (url, options) {
  return openUrl(url,options).then(Promise.promisify(parseString))
}

export { _readFiletoPromise, _XHRtoPromise, openPlist, openXML }
