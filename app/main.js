'use strict';

/**
 * Enable dubug mode
 * This allow to console.log in a firefox default configuration
 */
require('sdk/preferences/service').set('extensions.sdk.console.logLevel', 'debug');

var data = require('sdk/self').data;
var { ToggleButton } = require('sdk/ui/button/toggle');
var { PageMod } = require('sdk/page-mod');
var { Panel } = require('sdk/panel');

//var { Cu } = require('chrome');
//
//Cu.import("resource://lib/translate.jsm");

var { Translate } = require('./lib/translate.jsm');

console.log('Translate:',Translate);

var popup = Panel({
  contentURL: data.url('popup.html'),
  onHide: function () {
      button.state('window', {checked: false});
  }
});

// Show the popup when the user clicks the button.
function handleClick(state) {
  if (state.checked) {
    popup.show({
      position: button,
      width: 600,
      height: 400
    });
  }
}

// Create a button
var button = ToggleButton({
  id: 'show-popup',
  label: 'RSS Lector',
  icon: {
    '16': './images/icon-16.png',
    '32': './images/icon-32.png',
    '64': './images/icon-64.png'
  },
  onClick: handleClick
    
});

function handleTextSelect(selectionInfo){
  console.log('selectionInfo:', selectionInfo);
  Translate.enToZh(selectionInfo.selection, function(result){
    console.log('translate result:', result);
  });
}


// Create a content script
var pageMod = PageMod({
  include: ['*'], // all urls
  contentScriptFile: [
    data.url('./bower_components/jquery/dist/jquery.js'),
    data.url('./bower_components/jquery.balloon.js/jquery.balloon.js'),
    data.url('./lib/bubble.widget.module.js'),
    data.url('./lib/util.module.js'),
    data.url('contentscript.js')
  ],
  contentStyleFile: [data.url('contentstyle.css')],
  onAttach: function(worker){
    worker.port.on('textSelect', handleTextSelect);
  }
});
