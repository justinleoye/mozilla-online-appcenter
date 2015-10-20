/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['utils'];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');

XPCOMUtils.defineLazyModuleGetter(this, 'Services',
  'resource://gre/modules/Services.jsm');

XPCOMUtils.defineLazyModuleGetter(this, "Log4Moz",
  'resource://livemargins/3rd/log4moz.js');

// file should be an array, e.g.: [dir1, dir2, dir3, filename].
function _getFile(file_att) {
  if (typeof file_att.shift != 'function' || file_att.length == 0)
    return null;

  var file = Cc['@mozilla.org/file/directory_service;1']
    .getService(Ci.nsIProperties).get('ProfD', Ci.nsIFile);

  // create directory
  var dir_name = file_att.shift();
  while (file_att.length > 0) {
    file.append(dir_name);
    if (!file.exists() || !file.isDirectory()) {
      return null;
    }

    dir_name = file_att.shift();
  }

  file.append(dir_name);
  if (!file.exists()) {
    return null;
  }

  return file;
}

function _getCreateFile(file_att) {
  if (typeof file_att.shift != 'function' || file_att.length == 0)
      return null;

  var file = Cc['@mozilla.org/file/directory_service;1']
    .getService(Ci.nsIProperties).get('ProfD', Ci.nsIFile);

  // create directory
  var dir_name = file_att.shift();
  while (file_att.length > 0) {
    file.append(dir_name);
    if (!file.exists() || !file.isDirectory()) {
      file.create(Ci.nsIFile.DIRECTORY_TYPE, 0o777);
    }

    dir_name = file_att.shift();
  }

  // create file
  file.append(dir_name);
  if (!file.exists()) {
    file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, 0o666);
  }

  return file;
}

// return the two-digit hexadecimal code for a byte
function _toHexString(charCode) {
  return ("0" + charCode.toString(16)).slice(-2);
}

var utils = {
  getContentFromURL: function(url) {
    var ioService = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
    var scriptableStream = Cc['@mozilla.org/scriptableinputstream;1'].getService(Ci.nsIScriptableInputStream);

    var channel = ioService.newChannel(url, null, null);
    var input = channel.open();
    scriptableStream.init(input);
    var str = scriptableStream.read(input.available());
    scriptableStream.close()
    input.close();

    var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].
    getService(Components.interfaces.nsIUTF8ConverterService);
    return utf8Converter.convertURISpecToUTF8 (str, "UTF-8");
  },

  getProFile: function(file_att) {
    return _getFile(file_att);
  },

  getCreateProFile: function(file_att) {
    return _getCreateFile(file_att);
  },

  readStrFromFile: function(file) {
    if (!file) {
      return '';
    }

    var data = '';
    var fstream = Cc['@mozilla.org/network/file-input-stream;1']
      .createInstance(Ci.nsIFileInputStream);
    var cstream = Cc['@mozilla.org/intl/converter-input-stream;1']
      .createInstance(Ci.nsIConverterInputStream);

    try {
      fstream.init(file, -1, 0, 0);
      cstream.init(fstream, 'UTF-8', 0, 0);

      var str = {};
      var read = 0;
      do {
        read = cstream.readString(0xffffffff, str);  // read as much as we can and  put it in str.value
        data += str.value;
      } while (read != 0);
    } catch(err) {
      dump('Error occured when reading file: ' + err);
    } finally {
      if (cstream) {
        try {
          cstream.close();
        } catch (err) {
          dump('Error occured when closing file : ' + err);
        }
      }
    }

    return data;
  },

  readStrFromProFile: function(file_att) {
    var file = _getFile(file_att)
    if (!file)
      return '';

    return this.readStrFromFile(file);
  },

  setStrToProFile: function(file_att, json) {
    var file = _getCreateFile(file_att);
    if (!file)
      return;

    var foStream = Cc['@mozilla.org/network/file-output-stream;1']
      .createInstance(Ci.nsIFileOutputStream);

    foStream.init(file, 0x02 | 0x08 | 0x20, 0o666, 0);

    var converter = Cc['@mozilla.org/intl/converter-output-stream;1']
      .createInstance(Ci.nsIConverterOutputStream);

    try {
      converter.init(foStream, 'UTF-8', 0, 0);
      converter.writeString(json);
    } catch(err) {
      MOA.log('Error occured when writing addon-notification/rules.json : ' + err);
    } finally {
      if (converter) {
        try {
          converter.close();
        } catch (err) {
          MOA.log('Error occured when closing writing addon-notification/rules.json : ' + err);
        }
      }
    }
  },

  // save uri to profile file asynchronously, so 'callback' is necessary.
  saveURIToProFile: function(file_att, uri, callback) {
    if (!uri)
      return;

    var file = _getCreateFile(file_att);
    if (!file)
      return;

    var persist = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1']
            .createInstance(Ci.nsIWebBrowserPersist);
    persist.persistFlags =   Ci.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES |
                Ci.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;

    if (typeof callback == 'function') {
      persist.progressListener = {
        onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
        },

        onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
          if (aFlag & Ci.nsIWebProgressListener.STATE_STOP) {
            callback();
          }
        }
      };
    }

    persist.saveURI(uri, null, null, null, null, file, null);
  },

  fileExists: function(file_att) {
    return !!_getFile(file_att);
  },

  getProFile: function(file_att) {
    return _getFile(file_att);
  },

  removeFile: function(file_att) {
    var file = _getFile(file_att);
    if (!file)
      return;

    try {
      file.remove(false);
    } catch (e) {
      dump('Error occurs when removing file "' + file_att.join('/') + '"' + e);
    }
  },

  md5: function(string) {
    if (!string)
      return;

    // Build array of character codes to MD5
    var array = [];
    for (var i = 0; i < string.length; i++) {
      array.push(string.charCodeAt(i));
    }

    var hash = Cc['@mozilla.org/security/hash;1'].createInstance(Ci.nsICryptoHash);
    hash.init(hash.MD5);
    hash.update(array, array.length);
    var binary = hash.finish(false);

    // Unpach the binary data bin2hex style
    var result = [];
    for (var i = 0; i < binary.length; i++) {
      var c = binary.charCodeAt(i);
      var ones = c % 16;
      var tens = c >> 4;
      result.push(String.fromCharCode(tens + (tens > 9 ? 87 : 48)) +
            String.fromCharCode(ones + (ones > 9 ? 87 : 48)));
    }

    return result.join('');
  },

  isLocal: function(url) {
    return /^(chrome:|file:)/.test(url);
  },

  getNsiURL: function(url) {
    var nsiUrl = Cc['@mozilla.org/network/standard-url;1'].createInstance(Ci.nsIURL);
    nsiUrl.spec = url;
    return nsiUrl;
  },

  readURL: function(url) {
    var ioService = Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService);
    var channel = ioService.newChannel(url, null, null);
    var stream = channel.open();

    var binary = Components.classes["@mozilla.org/binaryinputstream;1"]
           .createInstance(Components.interfaces.nsIBinaryInputStream);
    binary.setInputStream(stream);

    var size, data = "";
    while(size = binary.available()) {
      data += binary.readBytes(size);
    }
    binary.close();
    stream.close();
    return data;
  },

  setFavicon: function(url, favicon) {
    try {
      var uri = this.getNsiURL(url);
      var faviconURI = this.getNsiURL(favicon);
      var faviconService = Cc['@mozilla.org/browser/favicon-service;1'].getService(Ci.nsIFaviconService);

      if (!faviconService.setFaviconDataFromDataURL) {
        faviconService.setAndLoadFaviconForPage(uri, faviconURI, false);
      } else {
        var data = this.readURL(favicon);
        var dataURL = "data:image/png;base64," + btoa(data);
        faviconService.setFaviconDataFromDataURL(faviconURI, dataURL, 0);
        faviconService.setFaviconUrlForPage(uri, faviconURI);
      }
    } catch (e) {
      dump(e);
    }
  },

  emptyFunction: function() { },

  hex_md5: function(str) {
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
};

(function() {
  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  extend(utils, {
    extend: extend
  });
})();

utils.getPref = function(prefName, defValue){
  return utils.getPrefFromRoot('extensions.livemargins@mozillaonline.com.' + prefName, defValue);
};

utils.setPref = function(prefName, value) {
  utils.setRootPref('extensions.livemargins@mozillaonline.com.' + prefName, value);
};

utils.setRootPref = function(prefName, value) {
  if (typeof value == 'boolean') {
    Services.prefs.setBoolPref(prefName, value);
  } else if (!isNaN(value)) {
    Services.prefs.setIntPref(prefName, value);
  } else {
    Services.prefs.setCharPref(prefName, value);
  }
};

utils.getPrefFromRoot = function(prefName, defValue){
  var result = null;
  var type = Services.prefs.getPrefType(prefName);
  switch (type) {
    case Services.prefs.PREF_STRING:
      result = Services.prefs.getCharPref(prefName);
      break;
    case Services.prefs.PREF_INT:
      result = Services.prefs.getIntPref(prefName);
      break;
    case Services.prefs.PREF_BOOL:
      result = Services.prefs.getBoolPref(prefName);
      break;
  }

  return result == null ? defValue : result;
};


function Pos(x, y) {
    this.x = x;
    this.y = y;
};

utils.calculateBoxPos = function (object) {
  var pos = new Pos(0, 0);
  if (!object)
    return pos;
  var x = 0, y = 0, p = object;
  try{
    do {
      y+=p.offsetTop || 0;
      x+=p.offsetLeft || 0;
      p = p.offsetParent||p.parentNode;
    }while(p);
  }catch(e){}
  pos.x = x;
  pos.y = y;
  return pos;
};

// this function is copied and modified from the awesome firebug
utils.getRectTRBLWH = function(elt,win){
  var i, rect, frameRect,
    coords =
    {
      "top": 0,
      "right": 0,
      "bottom": 0,
      "left": 0,
      "width": 0,
      "height": 0
    };

  frameRect = coords;

  if (elt)
  {

    if(win && win.frames.length > 0)
    {
      for(i=0; i < win.frames.length; i++)
      {
        try
        {
          if(win.frames[i].document == elt.ownerDocument)
          {
            frameRect = win.frames[i].frameElement.getBoundingClientRect();
            break;
          }
        }
        catch(e)
        {}
      }
    }

    rect = elt.getBoundingClientRect();

    coords =
    {
      "top": rect.top + frameRect.top,
      "right": rect.right + frameRect.right,
      "bottom": rect.bottom + frameRect.bottom,
      "left": rect.left + frameRect.left,
      "width": rect.right-rect.left,
      "height": rect.bottom-rect.top
    };
  }

  return coords;
};

utils.isChildDomain = function (child, root) {
  if (!child || !root || child.length < root.length) {
    return false;
  }

  if (child.length == root.length && child != root) {
    return false;
  }

  if (child == root) {
    return true;
  }

  if (child[child.length - root.length - 1] != '.') {
    return false;
  }

  // judge if child ends with root string.
  for (var i = 0; i < root.length; i++) {
    if (root[root.length - 1 - i] == child[child.length - 1 - i]) {
      continue;
    }

    return false;
  }

  return true;
};

var loggers = {};
function CommonLogger (nameSpace) {
  this.nameSpace = nameSpace;
  this.initialize();
};

CommonLogger.prototype = {
  initialize: function() {
    this.logger = Log4Moz.repository.getLogger(this.nameSpace);
  },

  trace: function(msg) {
    this.logger.level = Log4Moz.Level['Trace'];
    this.logger.trace(msg);
  },

  error: function(msg) {
    this.logger.level = Log4Moz.Level['Error'];
    this.logger.error(msg);
  },

  info: function(msg) {
    this.logger.level = Log4Moz.Level['Info'];
    this.logger.info(msg);
  }
};

utils.logger = function(ns) {
  if (!loggers[ns]) {
    loggers[ns] = new CommonLogger(ns);
  } else {
    // dump("Logger already exists: " + ns + "\n");
  }
  return loggers[ns];
};

/******** utility funcitons for content apis  **********/
utils.wrapAsContentAPI = (function() {
  function _wrapAsContentAPI(obj, recurse) {
    var wrapper = { };
    var tmp = null;
    for (var attr in obj) {
      switch (typeof(obj[attr])) {
        case "boolean":
        case "number":
        case "string":
          wrapper[attr] = obj[attr];
          break;
        case "function":
          if (typeof obj[attr].bind == "function") {
            wrapper[attr] = obj[attr].bind(obj);
          }
          break;
        case "object":
          if (recurse > 0) {
            wrapper[attr] = _wrapAsContentAPI(obj[attr], recurse - 1);
          }
          break;
        default:
          break;
      }
    }
    return wrapper;
  }

  return _wrapAsContentAPI;
})();
/******** end ******/

/******** prgress listener for browser to listen onload event **********/
function browserLoadListener(aOnLoadStart, aOnLoadComplete, aOnLoadFail) {
  this._onLoadStart = aOnLoadStart;
  this._onLoadComplete = aOnLoadComplete;
  this._onLoadFail = aOnLoadFail;
}

browserLoadListener.prototype = {
  QueryInterface: function(aIID) {
    if (aIID.equals(Ci.nsIWebProgressListener) ||
      aIID.equals(Ci.nsISupportsWeakReference) ||
      aIID.equals(Ci.nsISupports))
      return this;

    throw Components.results.NS_NOINTERFACE;
  },

  // copy from chrome://mozapps/content/extensions/extensions.js
  onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
    // Only care about the "player_browser" browser
//    if (aWebProgress.DOMWindow != document.getElementById("player_browser").contentWindow) {
//      return;
//    }

    // Only care about the network events
    if (!(aStateFlags & (Ci.nsIWebProgressListener.STATE_IS_NETWORK)))
      return;

    // If this is the start of network activity then show the loading page
    if (aStateFlags & (Ci.nsIWebProgressListener.STATE_START)) {
      if (typeof this._onLoadStart == "function") {
        this._onLoadStart(aWebProgress.DOMWindow);
      }
    }

    // Ignore anything except stop events
    if (!(aStateFlags & (Ci.nsIWebProgressListener.STATE_STOP)))
      return;

    // Consider the successful load of about:blank as still loading
    if (aRequest instanceof Ci.nsIChannel && aRequest.URI.spec == "about:blank")
      return;

    // If there was an error loading the page or the new hostname is not the
    // same as the default hostname or the default scheme is secure and the new
    // scheme is insecure then show the error page
    if (!Components.isSuccessCode(aStatus) ||
        (aRequest && aRequest instanceof Ci.nsIHttpChannel && !aRequest.requestSucceeded)) {
      if (typeof this._onLoadFail == "function") {
        this._onLoadFail(aWebProgress.DOMWindow);
      }
    } else {
      // Got a successful load, make sure the browser is visible
      if (typeof this._onLoadComplete  == "function") {
        this._onLoadComplete(aWebProgress.DOMWindow);
      }
    }
  },

  onProgressChange: function() { },
  onSecurityChange: function() { },
  onStatusChange: function() { },
  onLocationChange: function() { }
};

utils.browserLoadListener = browserLoadListener;
/*********** end **************/
