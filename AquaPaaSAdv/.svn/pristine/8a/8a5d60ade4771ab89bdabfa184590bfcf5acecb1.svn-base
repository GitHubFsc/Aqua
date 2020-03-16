function newSelect(cantainID, obj, style, listenLiClick){
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
    if(this.selectstyle.width && this.selectstyle.height){
        var width_  = this.selectstyle.width;
        var height_ = this.selectstyle.height;
        this.box.css({width : width_ , height : height_ });
        this.header.css({width : width_ - 27 , height : height_, "line-height":height_ + "px"});
        this.content.css({width : width_ - 1});
        this.content.css({top : height_});
    }
    if(this.selectstyle.ScrollBarHeight){
        this.content.css({"overflow-y" : "scroll"});
        this.content.css({"overflow-x" : "hidden"});
        this.content.css({"height" : "auto"});
        this.content.css({"max-height" : this.selectstyle.ScrollBarHeight});
    }
    if(this.selectstyle.background){
        this.box.css({"background-color": this.selectstyle.background });
        this.header.css({"background-color": this.selectstyle.background });
        this.content.css({"background-color": this.selectstyle.background });
    }
    var i = 0;
    var item;
    var values = this.selectItem;
    if(values instanceof Array){
        for(i = 0;i<values.length; i++){
            var content_li = jQuery("<li data-key = '" + values[i].key + "'></li>");
            var content_li_span1 = jQuery("<span>" + values[i].value + "</span>");
            var content_li_span2 = jQuery("<span class='glyphicon-ok'></span>");
            content_li_span2.hide();
            content_li[0].checked = false;
            content_li_span1.appendTo(content_li);
            content_li_span2.appendTo(content_li);
            content_li.appendTo(this.content);
            if(this.selectstyle.width && this.selectstyle.height){
                content_li.width(this.selectstyle.width - 1);
                content_li.height(this.selectstyle.height);
            }
            if(this.selectstyle.background){
                content_li.css({"background-color": this.selectstyle.background });
            }
            if(i == 0){
                if(that.selectstyle.multipleChoice){
                    this.header.text("");
                }else{
                    this.header.text(values[i].value);
                    this.header[0].setAttribute('data-key', values[i].key);
                }
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
            if(i == 0){
                this.header.text(values[item]);
                this.header[0].setAttribute('data-key', item);
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
            if(that.selectstyle.multipleChoice){
            }else{
                that.selectCantain.hover(function(evt){
                    evt.stopPropagation();
                },function(evt){
                    that.header.removeClass("select-arrow");
                    that.content.hide();
                    evt.stopPropagation();
                });
            }
        }
    });

    jQuery(document).click(function(evt){
        that.header.removeClass("select-arrow");
        that.content.hide();
    });

    that.content.find("li").on("click",function(evt){
        if(that.selectstyle.multipleChoice){
            console.log(this.children[0]);
            if(!this.checked){
                this.checked = true;
                jQuery(this).find(".glyphicon-ok").css("display","");
            }else{
                this.checked = false;
                jQuery(this).find(".glyphicon-ok").hide();
            }
            var result = "";
            var result_array = [];
            that.content.find("li").each(function(item){
                if(this.checked){
                    result_array.push(jQuery(this).text());
                }
            });
            result = result_array.join("，");
            jQuery(this).parent().siblings(".select-header").text(result);
        }else{
            jQuery(this).parent().siblings(".select-header").removeClass("select-arrow");
            jQuery(this).parent().siblings(".select-header").text(jQuery(this).text()).end().hide();
            that.header[0].setAttribute('data-key', jQuery(this).attr('data-key'));
            that.listenLiClick(jQuery(this).attr('data-key'));
        }
        evt.stopPropagation();
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
    var that = this;
    if(that.selectstyle.multipleChoice){
        var result = [];
        that.content.find("li").each(function(){
            if(this.checked){
                result.push(jQuery(this).attr('data-key'));
            }
        })
        return result;
    }else{
        return this.header.attr('data-key');
    }
}

newSelect.prototype.setValue = function(value){
    var that = this;
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    if(that.selectstyle.multipleChoice){
        value.forEach(function(item){
            that.content.find("li").each(function(){
                if(jQuery(this).attr('data-key') == item){
                    this.checked = true;
                    jQuery(this).find(".glyphicon-ok").css("display","");
                }
            })
        });
        var result = "";
        var result_array = [];
        that.content.find("li").each(function(item){
            if(this.checked){
                result_array.push(jQuery(this).text());
            }
        });
        result = result_array.join("，");
        this.header.text(result);
    }else{
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
