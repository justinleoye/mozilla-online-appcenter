/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['MESSAGES', 'INTENTS', 'WEB_APPS'];

const MESSAGES = {
  APPINTENT_GETINTENTS: 'appIntent:getIntents',
  APPINTENT_STARTACTIVITY: 'appIntent:startActivity',
  APPINTENT_STARTTRANSLATE: 'appIntent:startTranslate',
  APPINTENT_L10N_GETSTRING: 'l10n:getString',
  FLASHEXTR_ADDVIDEOPLAYER: 'flashExtr:addVideoPlayer',
  FLASHEXTR_ADDWEBCLIPPING: 'flashExtr:addWebClipping',
  FLASHEXTR_FULLZOOM: 'flashExtr:fullZoom',
  APPINTENT_SHOW_FLOATBAR: 'showFloatbar',
  APPINTENT_HIDE_FLOATBAR: 'hideFloatbar',
  APPINTENT_FLOATBAR_HIDDEN: 'floatbarHidden'
};

const INTENTS = {
  "image/*": [{
    "action": "{dcb0d1b8-7a02-41c3-9fc8-46b2405480b9}",
    "message": "edit",
    "type": "image/*",
    "label": "Edit using XiuXiu",
    "labelStr": "intent.xiuxiu.label",
    "icon": "chrome://livemargins/skin/icons/xiuxiu.ico"
  }, {
    "action": "{72600762-7580-43d7-a991-7d05c3eed5ed}",
    "message": "note",
    "type": "image/*",
    "label": "Save to Maiku",
    "labelStr": "intent.maiku.label",
    "icon": "chrome://livemargins/skin/icons/maiku.png"
  }],
  "text/*": [{
    "action": "$app-copy$",
    "message": "Copy",
    "type": "text/*",
    "label": "Copy",
    "labelStr": "intent.copy.label",
  }, {
    "action": "$app-search-engine$",
    "message": "search",
    "type": "text/*",
    "label": "Search using current engine",
    "labelStr": "intent.searchengine.label",
  }, {
    "action": "{a09cf36d-abbc-48ed-b0cc-77c650eb164e}",
    "message": "dict",
    "type": "text/*",
    "label": "Translate using Youdao",
    "labelStr": "intent.youdao.label",
  }, {
    "action": "{72600762-7580-43d7-a991-7d05c3eed5ed}",
    "message": "note",
    "type": "text/*",
    "label": "Save to Maiku",
    "labelStr": "intent.maiku.label",
  }, {
    "action": "$app-taobao-search$",
    "message": "shopping",
    "type": "text/*",
    "label": "Search Taobao",
    "labelStr": "intent.taobao.label",
  }, {
    "action": "{6e881146-62e9-461d-884a-3e2caf10b0ab}",
    "message": "wiki",
    "type": "text/*",
    "label": "Search using Hudong",
    "labelStr": "intent.hudong.label",
  }],
  "text/html": [{
    "action": "{72600762-7580-43d7-a991-7d05c3eed5ed}",
    "message": "note",
    "type": "text/html",
    "label": "Save to Maiku",
    "labelStr": "intent.maiku.label",
  }],
  "application/link": [{
    "action": "{72600762-7580-43d7-a991-7d05c3eed5ed}",
    "message": "note",
    "type": "application/link",
    "label": "Save to Maiku",
    "labelStr": "intent.maiku.label",
    "icon": "chrome://livemargins/skin/icons/maiku.png"
  }, {
    "action": "$app-share-tool$",
    "message": "share",
    "type": "application/link",
    "label": "Share selection",
    "labelStr": "intent.share.label",
    "icon": "chrome://livemargins/skin/icons/sina.ico"
  }]
};

var WEB_APPS = {
  "{a09cf36d-abbc-48ed-b0cc-77c650eb164e}": {
    // 有道词典
    name: "\u6709\u9053\u8BCD\u5178",
    // 有道词典网页版充分发挥了互联网在线词典的优势，具备中英日韩法五国语言的查词和翻译功能
    description: "\u6709\u9053\u8BCD\u5178\u7F51\u9875\u7248\u5145\u5206\u53D1\u6325\u4E86\u4E92\u8054\u7F51\u5728\u7EBF\u8BCD\u5178\u7684\u4F18\u52BF\uFF0C\u5177\u5907\u4E2D\u82F1\u65E5\u97E9\u6CD5\u4E94\u56FD\u8BED\u8A00\u7684\u67E5\u8BCD\u548C\u7FFB\u8BD1\u529F\u80FD",
    icon_url: "http://api.app.mozilla.com.cn/static/upload/2011/12/06/13231532445302999.jpg",
    app_args: {
      location: "http://api.app.mozilla.com.cn/center/id/14/",
      height: 489,
      width: 555
    },
    small_icon: "http://api.app.mozilla.com.cn/static/upload/2011/11/11/13209857292129241.gif"
  },

  "{72600762-7580-43d7-a991-7d05c3eed5ed}": {
    // 盛大麦库记事本
    name: "\u76DB\u5927\u9EA6\u5E93\u8BB0\u4E8B\u672C",
    // 快速记事，一键保存浏览的网页或文章到麦库记事
    description: "\u5FEB\u901F\u8BB0\u4E8B\uFF0C\u4E00\u952E\u4FDD\u5B58\u6D4F\u89C8\u7684\u7F51\u9875\u6216\u6587\u7AE0\u5230\u9EA6\u5E93\u8BB0\u4E8B",
    icon_url: "http://api.app.mozilla.com.cn/static/upload/2011/12/08/13233118616794171.png",
    app_args: {
      location: "http://api.app.mozilla.com.cn/center/id/670/",
      height: 467,
      width: 595
    },
    small_icon: "http://api.app.mozilla.com.cn/static/upload/2011/12/08/1323311854692939.png"
  },

  "{6e881146-62e9-461d-884a-3e2caf10b0ab}": {
    // 互动百科
    name: "\u4E92\u52A8\u767E\u79D1",
    // 互动百科词条查询工具
    description: "\u4E92\u52A8\u767E\u79D1\u8BCD\u6761\u67E5\u8BE2\u5DE5\u5177",
    icon_url: "http://api.app.mozilla.com.cn/static/upload/2011/12/08/13233112757514037.png",
    app_args: {
      location: "http://api.app.mozilla.com.cn/center/id/671/",
      height: 420,
      width: 420
    },
    small_icon: "http://api.app.mozilla.com.cn/static/upload/2011/12/08/13233112006877388.png"
  },

  "{dcb0d1b8-7a02-41c3-9fc8-46b2405480b9}": {
    // 美图秀秀
    name: "\u7F8E\u56FE\u79C0\u79C0",
    // 用海量的美容、饰品、边框、场景素材以及图片特效等，使您的图片美伦美焕！
    description: "\u7528\u6D77\u91CF\u7684\u7F8E\u5BB9\u3001\u9970\u54C1\u3001\u8FB9\u6846\u3001\u573A\u666F\u7D20\u6750\u4EE5\u53CA\u56FE\u7247\u7279\u6548\u7B49\uFF0C\u4F7F\u60A8\u7684\u56FE\u7247\u7F8E\u4F26\u7F8E\u7115\uFF01",
    icon_url: "http://api.app.mozilla.com.cn/static/images/appcenter/icons/meitu/meitu.png",
    app_args: {
      location: "http://api.app.mozilla.com.cn/center/id/37/",
      height: 500,
      width: 500
    },
    small_icon: "http://api.app.mozilla.com.cn/static/upload/2011/11/09/13208278164893435.ico"
  }
};

