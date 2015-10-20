var AppcenterModules = AppcenterModules || {};
AppcenterModules.Widget = AppcenterModules.Widget || {};
AppcenterModules.Widget.Bubble = AppcenterModules.Widget.Bubble || {};

$(function(){
  console.log('redefine Bubble');
  AppcenterModules.Widget.Bubble = (function(){
    function Bubble(options){ // options: {id, Bubble:[]}
      this.options = options;
      this.$obj = $(options.target);
      this._init();
    }

    Bubble.prototype._init = function _init(){
      this.$obj
          .css('position','absolute')
          .css('background','#5AADBB')
          .css('width','1px')
          .css('height','1px')
          .css('left','50%')
          .css('top','50%')
          .css('z-index','1000');

      this.$obj.showBalloon({
        contents: 'hello, appcenter user!'
      });
      this.hide();
    };

    Bubble.prototype.show = function show(options){
      this.$obj.showBalloon(options);
    };

    Bubble.prototype.hide = function hide(){
      this.$obj.hideBalloon();
    };

    Bubble.prototype.loading = function refresh(){
    };

    Bubble.prototype.refresh = function destroy(){
    };

    Bubble.prototype.setPosition = function setPosition(options){
      this.$obj
          .css('left', options.x)
          .css('top', options.y);
    };

    console.log('inner Bubble:', Bubble);
    return Bubble;
  })();
  console.log('redefined Bubble', AppcenterModules.Widget.Bubble);
});
