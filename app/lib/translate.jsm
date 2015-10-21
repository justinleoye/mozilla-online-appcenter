/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['Translate'];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

let jsm = {};

XPCOMUtils.defineLazyModuleGetter(jsm, 'LanguageDetector',
  'resource:///modules/translation/LanguageDetector.jsm');

var Translate = {
  tWord: function(selStr, callback){// TODO: promise will be better
    let url = 'http://api.iciba.com/dict/search.php';
    let authkey = hex_md5(selStr + 'AIzaSyd9WS2YtfUGzWYf8Djc4O7OQW8c6hM');
    url = url + '?authkey=' + authkey + '&ent=firefox&word=' + selStr;
    let req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
    req.open('GET', url, true);
    req.send();
    req.onload = function() {
      callback(req.responseText);
    };
  },
  tSentence: function(selStr, callback){
    let url = 'http://translateport.yeekit.com/translate?srcl=en&tgtl=zh&text=' + selStr;
    let req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
    req.open('GET', url, true);
    req.send();
    req.onload = function() {
      callback(req.responseText);
    };
  },
  tEnglish: function(selStr, tWordCallback, tSentenceCallback){
    let promise = jsm.LanguageDetector.detectLanguage(selStr);
    promise.then((lang) => {
      // TODO: There is a bug in LanguageDetector module, single Chinese
      // charactor would be recognized as English word.
      // If there is only one charactor selected, ignore it.
      if (lang.language == 'en' && selStr.length > 1) {
        if(selStr.indexOf(' ') == -1){
          this.tWord(selStr, tWordCallback);
        }else{
          this.tSentence(selStr, tSentenceCallback);
        }
      }
    }, function(e) {
      console.log('error:' + e + '\n');
    });
  }
};


function hex_md5(str) {
  var converter =
    Cc["@mozilla.org/intl/scriptableunicodeconverter"].
      createInstance(Ci.nsIScriptableUnicodeConverter);

    converter.charset = "UTF-8";
    var result = {};
    var data = converter.convertToByteArray(str, result);
    var ch = Cc["@mozilla.org/security/hash;1"]
                 .createInstance(Ci.nsICryptoHash);
    ch.init(ch.MD5);
    ch.update(data, data.length);
    var hash = ch.finish(false);
    // convert the binary hash data to a hex string.
    var s = [_toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
    return s;
}

// return the two-digit hexadecimal code for a byte
function _toHexString(charCode) {
  return ("0" + charCode.toString(16)).slice(-2);
}

