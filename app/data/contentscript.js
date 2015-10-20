'use strict';

$(function(){

  addEventListener('mouseup', onMouseUp);
  let bubble = createBubble();

  function onMouseUp(evt){
    console.log('mouseup');
    if (/^(about|chrome):/.test(location.protocol)) {
      return;
    }

    //console.log('AppcenterModules.Util:',AppcenterModules.Util);

    let selection = AppcenterModules.Util.getSelection();
    if (!selection) return;

    self.port.emit('textSelect', {
      selection: selection,
    });
  }

  // handle translation done.
  self.port.on('tranlated', function(data){
    console.log('data:',data);
    handleTranslated(data);
  });

  function handleTranslated(data){
    alert('handleTranslated');
    let text = data.tranlated.text;
    let pos_direc = AppcenterModules.Util.calcPositionAndDirectionOfSelection();

    bubble.setPosition({
      x: pos_direc.X,
      y: pos_direc.Y
    });
    bubble.show({
      position: pos_direc.direction,
      contents: text
    });

  }

  function createBubble(){
    let bubbleElement = document.createElement('div');
    bubbleElement.setAttribute('id','appcenter_bubble');
    document.body.appendChild(bubbleElement);

    let bubble = new AppcenterModules.Widget.Bubble({
      target: bubbleElement
    });
    bubble.show();
    return bubble;
  }
});
