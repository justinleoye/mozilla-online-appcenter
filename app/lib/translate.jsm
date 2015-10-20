/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['Translate'];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

//FIXME: utils.jsm comes from the old appcenter code
let jsm = {};
XPCOMUtils.defineLazyModuleGetter(jsm, 'utils',
  'resource://lib/utils.jsm');

var Translate = {
  zhToEn: function(selStr, callback){// TODO: promise will be better
    let url = 'http://api.iciba.com/dict/search.php';
    let authkey = jsm.utils.hex_md5(selStr + 'AIzaSyd9WS2YtfUGzWYf8Djc4O7OQW8c6hM');
    url = url + '?authkey=' + authkey + '&ent=firefox&word=' + selStr;
    let req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
    req.open('GET', url, true);
    req.send();
    req.onload = function() {
      callback(req.responseText);
    };
  },
  enToZh: function(selStr, callback){
    url = 'http://translateport.yeekit.com/translate?srcl=en&tgtl=zh&text=' + selStr;
    req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
    req.open('GET', url, true);
    req.send();
    req.onload = function() {
      callback(req.responseText);
    };
  }
};

