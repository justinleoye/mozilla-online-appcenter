'use strict';

$(function(){
  addEventListener('mouseup', onMouseUp);
  addEventListener('mousedown', onMouseDown);
  let bubble = createBubble();

  // handle word translation done.
  self.port.on('wordTranslated', function(data){
    let wtDom = AppcenterModules.Widget.Util.createWordTranslationDom(data);
    handleTranslated($(wtDom));
  });

  // handle sentence translation done.
  self.port.on('sentenceTranslated', function(data){
    let stDom = AppcenterModules.Widget.Util.createSentenceTranslationDom(data);
    handleTranslated($(stDom));
  });

  function onMouseUp(evt){
    if (/^(about|chrome):/.test(location.protocol)) {
      return;
    }

    let selection = AppcenterModules.Util.getSelection();
    if (!selection) return;

    self.port.emit('translation', {
      selection: selection,
    });
  }

  function onMouseDown(evt){
    bubble.hide();
  }

  function handleTranslated(contents){
    let pos_direc = AppcenterModules.Util.calcPositionAndDirectionOfSelection();

    bubble.setPosition({
      x: pos_direc.X,
      y: pos_direc.Y
    });
    bubble.show({
      position: pos_direc.direction,
      contents: contents
    });

  }

  function createBubble(){
    let bubbleElement = document.createElement('div');
    bubbleElement.setAttribute('id','appcenter_bubble');
    document.body.appendChild(bubbleElement);

    let bubble = new AppcenterModules.Widget.Bubble({
      target: bubbleElement
    });
    return bubble;
  }
});

