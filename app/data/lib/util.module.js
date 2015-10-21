var AppcenterModules = AppcenterModules || {};
AppcenterModules.Util = AppcenterModules.Util || {};

$(function(){
  AppcenterModules.Util.calcPositionAndDirectionOfSelection = function calcPositionAndDirectionOfSelection(){
    let scrollX =  window.scrollX;
    let scrollY = window.scrollY;
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    let centerX = scrollX + innerWidth / 2;
    let centerY = scrollY + innerHeight / 2;
    let X,Y,showTop;

    let sel = document.getSelection();
    let range = sel.getRangeAt(0);
    let rects = range.getClientRects();
    let firstRect = rects[0];
    let lastRect = rects[rects.length-1];

    if(firstRect === lastRect){
      X = firstRect.left + firstRect.width*0.5;
      Y = firstRect.top + firstRect.height*0.5 + scrollY;
      showTop = centerY < Y;
      Y = showTop ? Y - firstRect.height*0.5 : Y + firstRect.height*0.5;
    }else{
      let firstX = firstRect.left + firstRect.width*0.5;
      let firstY = firstRect.top + firstRect.height*0.5 + scrollY;
      let lastX = lastRect.left + lastRect.width*0.5;
      let lastY = lastRect.top + lastRect.height*0.5 + scrollY;

      if(centerY <= (firstY + lastY)*0.5){
        X = firstX;
        Y = firstRect.top + scrollY;
        showTop = true;
      }else{
        X = lastX;
        Y = lastRect.top + lastRect.height + scrollY;
        showTop = false;
      }
    }

    let direction = showTop ? 'top' : 'bottom';

    return {
      X: X,
      Y: Y,
      direction: direction
    };
  };

  AppcenterModules.Util.getSelection = function getSelection(){
    let selection = document.getSelection();

    for (let i = 0; i < selection.rangeCount; i ++) {
      let range = selection.getRangeAt(i);
      let node = range.startContainer.parentNode;
      if (node instanceof content.window.HTMLInputElement ||
          node instanceof content.window.HTMLTextAreaElement) return '';

      if (node.contentEditable == 'true') return;
      while (node.contentEditable == 'inherit') {
        node = node.parentNode;
        if (node.contentEditable == 'true') return '';
      }
    }
    let selectionStr = selection.toString();
    return selectionStr.trim();
  }
});
