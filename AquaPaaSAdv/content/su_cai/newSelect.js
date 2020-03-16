function newSelect(cantainID, obj, style, listenLiClick, isOther){
    /*
     style{
     width,
     height,
     background,
     selectbackground,
     disablebackground,
     ScrollBarHeight
     }
     isOther:如果为真，则将会在选中Other的时候触发input事件
     */
    this.selectCantain = jQuery(cantainID);
    this.selectItem = obj;
    this.selectstyle = style;
    this.listenLiClick = listenLiClick?listenLiClick:function(){};
    this.booleanAvailable = true;
    this.isOther = isOther?true:false;
    this.init();
}

newSelect.prototype.init = function(){
    this.createSelect();
    this.listenClick();
}

newSelect.prototype.createSelect = function(){
    var that = this;
    this.box = jQuery("<div></div>");
    this.box.addClass("select-status");
    this.box.addClass("select-box");

    this.header = jQuery("<div></div>");
    this.header.addClass("select-header");
    this.header.appendTo(this.box);

    this.content = jQuery("<ul></ul>");
    this.content.addClass("select-content");
    this.content.appendTo(this.box);

    if(this.isOther){
        this.otherInput = jQuery("<input  type='text'  />");
        this.otherInput.addClass("select-input");
        this.otherInput.appendTo(this.selectCantain);
        this.otherInput.hide();
        this.otherInput.blur(function(){
            that.otherInput.hide();
            that.box.show();
            that.setValue(that.otherInput.val());
        });
    }

    if(this.selectstyle.width && this.selectstyle.height){
        var width_  = this.selectstyle.width;
        var height_ = this.selectstyle.height;
        this.box.css({width : width_ , height : height_});
        this.header.css({width : width_ - 27 , height : height_, "line-height":height_ + "px"});
        this.content.css({width : width_ - 1});
        this.content.css({top : height_});
        this.isOther && this.otherInput.css({width : width_ - 7 , height : height_ - 2, "line-height":height_ + "px"});
    }
    if(this.selectstyle.ScrollBarHeight){
        this.content.css({"overflow-y" : "auto"});
        this.content.css({"overflow-x" : "hidden"});
        this.content.css({"height" : "auto"});
        this.content.css({"max-height" : this.selectstyle.ScrollBarHeight});
    }
    if(this.selectstyle.background){
        this.box.css({"background-color": this.selectstyle.background });
        this.header.css({"background-color": this.selectstyle.background });
        this.content.css({"background-color": this.selectstyle.background });
        this.isOther && this.otherInput.css({"background-color": this.selectstyle.background });
    }
    var i = 0;
    var item;
    var values = this.selectItem;
    if(values instanceof Array){
        this.isOther && values.push({
            key:"other",
            value:"other"
        });
        for(i = 0;i<values.length; i++){
            var content_li = jQuery("<li data-key = '" + values[i].key + "'>" + values[i].value + "</li>");
            content_li.appendTo(this.content);
            if(this.selectstyle.width && this.selectstyle.height){
                content_li.width(this.selectstyle.width - 1);
                content_li.height(this.selectstyle.height);
                content_li.css({
                    "line-height":this.selectstyle.height +"px"
                });
            }
            if(this.selectstyle.background){
                content_li.css({"background-color": this.selectstyle.background });
            }
            if(i == 0){
                this.header[0].setAttribute('data-key',values[i].key);
                this.header.text(values[i].value);
            }
        }
    }else{
        this.isOther && (values.other = "other");
        for(item in values){
            var content_li = jQuery("<li data-key = '" + item + "'>" + values[item] + "</li>");
            content_li.appendTo(this.content);
            if(this.selectstyle.width && this.selectstyle.height){
                content_li.width(this.selectstyle.width - 1);
                content_li.height(this.selectstyle.height);
            }
            if(this.selectstyle.background){
                content_li.css({"background-color": this.selectstyle.background });
            }
            if(i == 0){
                this.header[0].setAttribute('data-key',item);
                this.header.text(values[item]);
            }
            i ++;
        }
    }
    this.box.appendTo(this.selectCantain);
}

newSelect.prototype.listenClick = function(){
    var that = this;
    this.header.click(function(evt){
        if(that.booleanAvailable){
            jQuery(this).parent().siblings(".select-box").find(".select-content").hide();
            if(jQuery(this).siblings(".select-content").is(":hidden")){
                jQuery(this).addClass("select-arrow");
                jQuery(this).siblings(".select-content").show();
                evt.stopPropagation();
            }else{
                jQuery(this).removeClass("select-arrow");
                jQuery(this).siblings(".select-content").hide();
                evt.stopPropagation();
            }
            that.selectCantain.hover(function(evt){
                evt.stopPropagation();
            },function(evt){
                that.header.removeClass("select-arrow");
                that.content.hide();
                evt.stopPropagation();
            });
        }
    });

    jQuery(document).click(function(){
        that.header.removeClass("select-arrow");
        that.content.hide();
    });

    that.content.find("li").on("click",function(){
        jQuery(this).parent().siblings(".select-header").removeClass("select-arrow");
        jQuery(this).parent().siblings(".select-header").text(jQuery(this).text()).end().hide();
        that.header[0].setAttribute('data-key', jQuery(this).attr('data-key'));
        that.listenLiClick(jQuery(this).attr('data-key'));
        that.isOther && (jQuery(this).attr('data-key') == "other") && (function(){
            that.otherInput.val("");
            that.otherInput.show();
            that.otherInput.focus();
            that.box.hide();
        })();
    });
    that.content.find("li").hover(function(){
        if(that.selectstyle.background && that.selectstyle.selectbackground){
            jQuery(this).css("background-color",that.selectstyle.selectbackground);
        }
        else{
            jQuery(this).css("background-color","#d3d3d3");
        }
    },function(){
        if(that.selectstyle.background && that.selectstyle.selectbackground){
            jQuery(this).css("background-color",that.selectstyle.background);
        }
        else{
            jQuery(this).css("background-color","#f9f9f9");
        }
    });
}

newSelect.prototype.getValue = function(){
    return this.header.attr('data-key');
}

newSelect.prototype.getKey = function(){
    return this.header[0].innerHTML;
}

newSelect.prototype.setValue = function(value){
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    if(data instanceof Array){
        for(i = 0 ;i<data.length; i++ ){
            if(value == data[i].value){
                this.header.text(value);
                this.header[0].setAttribute('data-key',data[i].key);
                boolean_found = true;
            }
        }
    }else{
        for(i in data){
            if(value == data[i]){
                this.header.text(value);
                this.header[0].setAttribute('data-key',i);
                boolean_found = true;
            }
        }
    }
    if(!boolean_found){
        this.header.text(value)
    }
}

newSelect.prototype.setKey = function(key){
  var data = this.selectItem;
  var i;
  var boolean_found = false;
  if(data instanceof Array){
    for(i = 0 ;i<data.length; i++ ){
      if(key == data[i].key){
        this.header.text(data[i].value);
        this.header[0].setAttribute('data-key',key);
        boolean_found = true;
      }
    }
  }else{
    for(i in data){
      if(key == i){
        this.header.text(data[i]);
        this.header[0].setAttribute('data-key',key);
        boolean_found = true;
      }
    }
  }
  if(!boolean_found){
    this.header.text(key);
    this.header[0].setAttribute('data-key',key);
  }
}

newSelect.prototype.setDisable = function(){
    this.booleanAvailable = false;
    if(this.selectstyle.disablebackground){
        this.header.css({"background-color": this.selectstyle.disablebackground});
    }else{
        this.header.css({"background-color": "RGB(240, 240, 240)"  });
    }
}

newSelect.prototype.setAvailable = function(){
    this.booleanAvailable = true;
    this.header.css({"background-color": this.selectstyle.background  });
}

newSelect.prototype.updateSelectOptions = function(obj){
    this.box.remove();
    this.selectItem = obj;
    this.init();
}
