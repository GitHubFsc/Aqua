function newInputSelect(cantainID, obj, style, listenLiClick, options, inputAttr){
    /*
     style{
     width,
     height,
     background,
     selectbackground,
     disablebackground,
     ScrollBarHeight
     }
     */
    this.selectCantain = jQuery(cantainID);
    this.selectItem = obj;
    this.selectstyle = style;
    this.listenLiClick = listenLiClick?listenLiClick:function(){};
    this.booleanAvailable = true;
    this.options = {
        key:"key",
        value:"value"
    };
	this.inputAttr=inputAttr?inputAttr:{}
    this.init(options);
}

newInputSelect.prototype.init = function(options){
    this.initParm(options);
    this.createSelect();
}

newInputSelect.prototype.initParm = function(options){
    if(options && options.key && options.value)
    this.options = {
        key:options.key,
        value:options.value
    }
    if(options && options.getselectItem){
        this.options.getselectItem = options.getselectItem;
    }
}

newInputSelect.prototype.createSelect = function(){
    var that = this;
    this.box = jQuery("<div></div>");
    this.box.addClass("select-status");
    this.box.addClass("select-box");
    var inputAttr=this.inputAttr;
	var html="";
	console.log(inputAttr);
	for(var i in inputAttr){
		html+=(i+"="+inputAttr[i])
	};
	console.log(html);
    this.header = jQuery("<div><input "+html+"></div>");
    if(this.selectstyle.backgroundIMGStyle && this.selectstyle.backgroundIMGStyle == 1){
        this.header.addClass("select-header1");
    }else{
        this.header.addClass("select-header");
    }
    //this.header.addClass("select-header");

    this.header.appendTo(this.box);

    this.content = jQuery("<ul></ul>");
    this.content.addClass("select-content");
    this.content.appendTo(this.box);
    if(this.selectstyle.width && this.selectstyle.height){
        var width_  = this.selectstyle.width;
        var height_ = this.selectstyle.height;
        this.box.css({width : width_ , height : height_});
        this.header.css({width : width_ - 27 , height : height_, "line-height":height_ + "px"});
        this.content.css({width : width_ - 1});
        this.content.css({top : height_});
    }
    if(this.selectstyle.ScrollBarHeight){
        this.content.css({"overflow-y" : "auto"});
        this.content.css({"overflow-x" : "hidden"});
        this.content.css({'max-height' : this.selectstyle.ScrollBarHeight});
    }
    if(this.selectstyle.background){
        this.box.css({"background-color": this.selectstyle.background });
        this.header.css({"background-color": this.selectstyle.background });
        this.content.css({"background-color": this.selectstyle.background });
    }
    if(this.selectstyle.color){
        this.box.css({"color": this.selectstyle.color });
        this.header.css({"color": this.selectstyle.color });
        this.content.css({"color": this.selectstyle.color });
    } else {
        this.box.css({"color": '#a9a9a9' });
        this.header.css({"color": '#a9a9a9' });
        this.content.css({"color": '#a9a9a9' });
    }
    var values = this.selectItem;
    that.freshselectItem(values, "init");
    this.box.appendTo(this.selectCantain);
}

newInputSelect.prototype.freshselectItem = function(values, status){
    var that = this;
    var i = 0;
    var item;
    this.content.empty();
    if(values instanceof Array){
        for(i = 0;i<values.length; i++){
            var content_li = jQuery("<li data-key = '" + values[i][that.options.value] + "' title = '" + values[i][that.options.key] + "'>" + values[i][that.options.key] + "</li>");
            content_li.appendTo(this.content);
            if(this.selectstyle.width && this.selectstyle.height){
                content_li.width(this.selectstyle.width - 1);
                content_li.height(this.selectstyle.height).css('line-height', this.selectstyle.height);
                content_li.css({"line-height": this.selectstyle.height+"px" });
                if(this.selectstyle.width<70){
                    content_li.css({"text-align": "left" });
                    content_li.css({"text-indent": 7 +"px" });
                }
            }
            if(this.selectstyle.background){
                content_li.css({"background-color": this.selectstyle.background });
            }

            if((status == "init") && (i == 0)){
                this.header[0].setAttribute('data-key',values[i][that.options.value]);
                this.header.find("input").val(values[i][that.options.key]);
            }
        }
    }else{
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
            if((status == "init") && (i == 0)){
                this.header[0].setAttribute('data-key',item);
                this.header.find("input").val(values[item]);
            }
            i ++;
        }
    }
    this.listenClick();
};

newInputSelect.prototype.listenClick = function(){
    var that = this;
    this.header.unbind("click").click(function(evt){
        if(that.booleanAvailable){
            jQuery(this).parent().siblings(".select-box").find(".select-content").hide();
            if(jQuery(this).siblings(".select-content").is(":hidden")){
                if(that.options.getselectItem){
                    that.selectItem = that.options.getselectItem();
                    that.freshselectItem(that.selectItem);
                }
                if(that.selectstyle.backgroundIMGStyle  && that.selectstyle.backgroundIMGStyle == 1){
                    jQuery(this).addClass("select-arrow1");
                }else{
                    jQuery(this).addClass("select-arrow");
                }
                jQuery(this).siblings(".select-content").show();
                evt.stopPropagation();
            }else{
                if(that.selectstyle.backgroundIMGStyle  && that.selectstyle.backgroundIMGStyle == 1){
                    jQuery(this).removeClass("select-arrow1");
                }else{
                    jQuery(this).removeClass("select-arrow");
                }
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

    that.content.find("li").unbind("click").on("click",function(){
        if(that.selectstyle.backgroundIMGStyle  && that.selectstyle.backgroundIMGStyle == 1){
            jQuery(this).parent().siblings(".select-header1").removeClass("select-arrow1");
            jQuery(this).parent().siblings(".select-header1").text(jQuery(this).text()).end().hide();
        }else{
            jQuery(this).parent().siblings(".select-header").removeClass("select-arrow");
            jQuery(this).parent().siblings(".select-header").find("input").val(jQuery(this).text());
			jQuery(this).parent().siblings(".select-header").end().hide();
        }
        that.header[0].setAttribute('data-key', jQuery(this).attr('data-key'));
        that.listenLiClick(jQuery(this).attr('data-key'));
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

newInputSelect.prototype.getValue = function(){
    return this.header.attr('data-key');
}

newInputSelect.prototype.getKey = function(){
    return this.header.find("input").val();
}

newInputSelect.prototype.setValue = function(value, showValue){
	console.log(1);
    var that = this;
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    if(data instanceof Array){
        for(i = 0 ;i<data.length; i++ ){
            if(value == data[i][that.options.value]){
                this.header.find("input").val(data[i][that.options.key]);
                this.header[0].setAttribute('data-key',data[i][that.options.value]);
                boolean_found = true;
            }
        }
    }else{
        for(i in data){
            if(value == data[i]){
                this.header.find("input").val(value);
                this.header[0].setAttribute('data-key',i);
                boolean_found = true;
            }
        }
    }
    if(!boolean_found){
        this.header[0].setAttribute('data-key', value);
		console.log(1);
        this.header.find("input").val((showValue ? showValue : value))
    }
}

newInputSelect.prototype.setDisable = function(){
    this.booleanAvailable = false;
    if(this.selectstyle.disablebackground){
        this.header.css({"background-color": this.selectstyle.disablebackground});
    }else{
        this.header.css({"background-color": "RGB(240, 240, 240)"  });
    }
    if(this.selectstyle.disableborder){
        this.header.css({"border-color": this.selectstyle.disableborder});
    }else{
        this.header.css({"border-color": "RGB(198, 198, 198)"});
    }
}

newInputSelect.prototype.setAvailable = function(){
    this.booleanAvailable = true;
    this.header.css({"background-color": this.selectstyle.background});
    this.header.css({"border-color": ""});
}
