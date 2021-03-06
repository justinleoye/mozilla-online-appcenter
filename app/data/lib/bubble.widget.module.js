var AppcenterModules = AppcenterModules || {};
AppcenterModules.Widget = AppcenterModules.Widget || {};
AppcenterModules.Widget.Bubble = AppcenterModules.Widget.Bubble || {};

$(function(){
  AppcenterModules.Widget.Bubble = (function(){
    function Bubble(options){ // options: {id, Bubble:[]}
      this.options = options;
      this.css = {
        fontSize: '100%',
      };
      $.extend(this.css, options.css || {});
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
      options = options || {};
      options.css = options.css || {};
      let css = $.extend({}, this.css, options.css);
      options.css = css;
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

    return Bubble;
  })();
});
