//调用实例参数如下
/*
var searchSelect = new newSelect("#exer-list-page-search-select", [{
  name: "联系人1",
  value: "id1"
}, {
  name: "联系人2",
  value: "id2"
}], {
  width: 110,
  height: 34,
  background: "#ffffff",
  selectbackground: "#ffffff",
  selectedLiColor: "red",
  headerBorderColor: "rgb(234,234,234)",(选择框的Border相关样式)
  headerBorderStyle: "solid",
  headerBorderWidth: 1,
  headerBorderRadius: 4,
  fontSize:14,(字体大小)
  headerColor:"rgb(234,234,234)",(字体颜色)
  openIconUrl: "./content/uiWidget/images/open1.png",(必须参数，下拉框Icon，点击默认垂直翻转)
  closeIconUrl: "./content/uiWidget/images/close1.png"
  iconRight:0,(下拉框Icon离Select右边的距离)
  liBorderColor:"rgb(234,234,234)",
  LiScrollMaxNumber: 5,(如果需要设置滚动条，该配置项能设置最多可以看见的li数量)
  liFontSize:14,
  liColor:"rgb(234,234,234)",
  disableBackground:"rgb(240, 240, 240)"（当被设置为disable状态时，Select的背景颜色）
}, function (value) {
  //点击事件
  console.log(value)
})
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(['js/lib/popper','jquery'],factory) :
      (global.newSelect = factory(Popper,jQuery));
}(this, (function (Popper,$) { 'use strict';
  var header_style = {
  };
  var headerContent_style = {
  };
  var headerIcon_style = {
  };
  var content_style = {
  }
  var li_style = {
  };

  function newSelect(cantainID, obj, style, listenLiClick) {
    this.selectCantain = $(cantainID);
    this.selectItem = obj;
    this.selectstyle = style;
    this.listenLiClick = listenLiClick ? listenLiClick : function () {
      };
    this.booleanAvailable = true;
    this.closeIconUrl_isExist =false;
    this.init();
  }

  newSelect.prototype.init = function () {
    this.createSelect();
    this.setStyle();
    this.box.appendTo(this.selectCantain);
    /*
    var popper = new Popper(this.header[0], this.content[0], {
      placement: 'bottom-start',
    });
    */
    this.listenClick();
  }
  newSelect.prototype.createSelect = function () {
    this.box = $("<div></div>");
    this.box.addClass("select-box");

    this.header = $("<div></div>");
    this.header.addClass("select-header");
    this.header.appendTo(this.box);

    this.headerContent = $("<div></div>");
    this.headerContent.addClass("select-header-content");
    this.headerContent.appendTo(this.header);
    this.headerIcon = $("<div></div>");
    this.headerIcon.addClass("select-header-icon");
    this.headerIcon.appendTo(this.header);
    this.headerOpenIcon = $("<img style='display:block;height:100%;'/>");
    this.headerOpenIcon.addClass("select-header-open-icon");
    this.headerOpenIcon.appendTo(this.headerIcon);
    this.headerCloseIcon = $("<img style='display:block;height:100%;'/>");
    this.headerCloseIcon.addClass("select-header-close-icon");
    this.headerCloseIcon.appendTo(this.headerIcon);
    this.headerOpenIcon.css({"display": "block"});
    this.headerCloseIcon.hide();
    this.content = $("<ul></ul>");
    this.content.addClass("select-content");
    this.content.appendTo(this.box);
    var values = this.selectItem;
    for (var i = 0; i < values.length; i++) {
      var content_li = $("<li data-value = '" + values[i].value + "' title='" + values[i].name + "'>" + values[i].name + "</li>");
      content_li.appendTo(this.content);
    }
    if(values.length > 0){
      this.header.attr('data-value', values[0].value);
      this.headerContent.text(values[0].name);
    }
  }
  newSelect.prototype.setStyle = function () {
    var that = this;
    //this.header.css(header_style)
    var headerBorderColor = that.selectstyle.headerBorderColor || "rgb(234,234,234)";
    var headerBorderStyle = that.selectstyle.headerBorderStyle || "solid";
    var headerBorderWidth = (typeof that.selectstyle.headerBorderWidth == "undefined") ? 1 : that.selectstyle.headerBorderWidth;
    var fontSize = (typeof that.selectstyle.fontSize == "undefined") ? 14 : that.selectstyle.fontSize;
    var headerColor = that.selectstyle.headerColor || "rgb(234,234,234)";
    var headerBorderRadius = that.selectstyle.headerBorderRadius || 0;
    var width_ = this.selectstyle.width || "100%";
    var height_ = this.selectstyle.height || 30;
    var background = this.selectstyle.background || "white"
    this.header.css({
      "border-color": headerBorderColor,
      "border-style": headerBorderStyle,
      "border-width": headerBorderWidth + "px",
      "border-radius": headerBorderRadius + "px",
      "font-size": fontSize + "px",
      "color": headerColor
    });
    //this.headerContent.css(headerContent_style)
    //this.headerIcon.css(headerIcon_style);
    this.headerOpenIcon.attr("src", this.selectstyle.openIconUrl);
    if (this.selectstyle.closeIconUrl) {
      this.closeIconUrl_isExist = true;
      this.headerCloseIcon.attr("src", this.selectstyle.closeIconUrl);
    }
    //this.content.css(content_style);
    this.content.css({"border-width": headerBorderWidth + "px"});
    //this.content.find('li').css(li_style)

    this.box.css({width: width_, height: height_});
    this.header.css({width: width_, height: height_});
    this.headerContent.css({height: height_ - 2 * headerBorderWidth, "line-height": (height_ - 2 * headerBorderWidth) + "px"});
    this.headerIcon.css({width: height_ - 2 * headerBorderWidth, height: height_ - 2 * headerBorderWidth, "line-height": (height_ - 2 * headerBorderWidth) + "px"});
    this.content.css({width: width_});

    if(this.selectstyle.iconRight ){
      this.headerIcon.css({width: height_ - 2 * headerBorderWidth + this.selectstyle.iconRight});
    }
    this.content.css({"top": height_ - headerBorderWidth});
    if (this.selectstyle.LiScrollMaxNumber) {
      this.content.css({"overflow-y": "auto"});
      this.content.css({"overflow-x": "hidden"});
      this.content.css({"height": "auto"});
      this.content.css({"max-height": this.selectstyle.LiScrollMaxNumber * (this.selectstyle.height - headerBorderWidth) + headerBorderWidth});
    }
    this.box.css({"background-color": background});
    this.header.css({"background-color": background});
    this.content.css({"background-color": background});

    this.content.css({"border-left-color": this.selectstyle.liBorderColor || headerBorderColor});
    this.content.css({"border-right-color": this.selectstyle.liBorderColor || headerBorderColor});
    this.content.css({"border-top-color": this.selectstyle.liBorderColor || headerBorderColor});
    this.content.find('li').css({
      'height': height_ - headerBorderWidth,
      "line-height": (height_ - headerBorderWidth ) + "px",
      "font-size": this.selectstyle.liFontSize ? that.selectstyle.liFontSize + "px" : fontSize,
      "color": that.selectstyle.liColor || headerColor,
      "background-color": background,
      "border-color": this.selectstyle.liBorderColor || headerBorderColor,
      "border-width": headerBorderWidth + "px"
    });
    this.content.find('li:last').css({
      "border-bottom-left-radius": headerBorderRadius + "px",
      "border-bottom-right-radius": headerBorderRadius + "px",
    });
  }
  newSelect.prototype.listenClick = function () {
    var that = this;
    this.header.click(function (evt) {
      if (that.booleanAvailable) {
        if (that.content.is(":hidden")) {
          that.showOptions();
          evt.stopPropagation();
          $(document).one("click", function destory(e){
            if (that.header[0].contains(e.target) || that.content[0].contains(e.target)) {
            }else{
              that.hideOptions();
            }
          });
        } else {
          that.hideOptions();
          evt.stopPropagation();
        }
      }
    });
    that.content.find("li").on("click", function () {
      that.hideOptions();
      that.headerContent.text($(this).text()).end().hide();
      that.header.attr('data-value', $(this).attr('data-value'));
      that.listenLiClick($(this).attr('data-value'));
    });
    that.content.find("li").hover(function () {
      if (that.selectstyle.background && that.selectstyle.selectedBackground) {
        $(this).css("background-color", that.selectstyle.selectedBackground);
      }
      else {
        $(this).css("background-color", "#d3d3d3");
      }
      if (that.selectstyle.selectedLiColor) {
        $(this).css("color", that.selectstyle.selectedLiColor);
      }
      else {
        $(this).css("color", that.selectstyle.liColor || that.selectstyle.headerColor || "rgb(234,234,234)");
      }

    }, function () {
      if (that.selectstyle.background && that.selectstyle.selectedBackground) {
        $(this).css("background-color", that.selectstyle.background);
      }
      else {
        $(this).css("background-color", "#f9f9f9");
      }
      if (that.selectstyle.selectedLiColor) {
        $(this).css("color", that.selectstyle.liColor || that.selectstyle.headerColor || "rgb(234,234,234)");
      }
    });

    var _timer = {};
    var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    var target = document.documentElement;
    var observer = new MutationObserver(function(){
      delay_till_last("select", _handleMutation, 1000)
    });
    var config = { attributes: false, childList: true, subtree : true };
    observer.observe(target, config);
    that.observer = observer;
    function delay_till_last(id, fn, wait) {
      if (_timer[id]) {
        window.clearTimeout(_timer[id]);
        delete _timer[id];
      }

      return _timer[id] = window.setTimeout(function () {
        fn();
        delete _timer[id];
      }, wait);
    }
    function _handleMutation(){
      var doc = document.documentElement
      if (! doc.contains(that.box[0])){
        that.destory();
      }
    }
  }
  newSelect.prototype.getValue = function () {
    return this.header.attr('data-value');
  }
  newSelect.prototype.getName = function () {
    return this.headerContent[0].innerHTML;
  }
  newSelect.prototype.setValue = function (value) {
    var that = this;
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    for (i = 0; i < data.length; i++) {
      if (value == data[i].value) {
        this.headerContent.text(data[i].name);
        this.header.attr('data-value', data[i].value);
        boolean_found = true;
      }
    }
    if (!boolean_found) {
      this.headerContent.text(value)
      this.header.attr('data-value', data[i].value);
    }
  }
  newSelect.prototype.setName = function (name) {
    var that = this;
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    for (i = 0; i < data.length; i++) {
      if (name == data[i].name) {
        this.headerContent.text(data[i].name);
        this.header.attr('data-value', data[i].value);
        boolean_found = true;
      }
    }
    if (!boolean_found) {
      this.headerContent.text(name)
    }
  }
  newSelect.prototype.setDisable = function () {
    this.booleanAvailable = false;
    this.header.css({"background-color": this.selectstyle.disableBackground || "rgb(240, 240, 240)"});
  }
  newSelect.prototype.setAvailable = function () {
    this.booleanAvailable = true;
    this.header.css({"background-color": this.selectstyle.background});
  }
  newSelect.prototype.updateSelectOptions = function (obj) {
    this.destory();
    this.selectItem = obj;
    this.init();
  }
  newSelect.prototype.hideOptions = function () {
    this.header.removeClass("open");
    if(this.closeIconUrl_isExist){
      this.headerOpenIcon.css({"display": "block"});
      this.headerCloseIcon.hide();
    }else{
      this.headerOpenIcon.css({
        "-moz-transform": "",
        "-webkit-transform": "",
        "-o-transform": "",
        "transform": "",
        "filter": ""
      });
    }
    this.content.hide();
  }
  newSelect.prototype.showOptions = function () {
    this.header.addClass("open");
    if(this.closeIconUrl_isExist){
      this.headerOpenIcon.hide();
      this.headerCloseIcon.css({"display": "block"});
    }else{
      this.headerOpenIcon.css({
        "-moz-transform": "scaleY(-1)",
        "-webkit-transform": "scaleY(-1)",
        "-o-transform": "scaleY(-1)",
        "transform": "scaleY(-1)",
        "filter": "FlipV"
      });
    }
    this.content.show();
  }
  newSelect.prototype.destory = function (obj) {
    [this.box,this.header,this.headerContent,this.headerIcon,this.headerOpenIcon,this.headerCloseIcon,this.content].forEach(function(item){
      item.remove();
      item = null;
    })
    this.observer.disconnect();
    this.observer = null;
  }

  return newSelect;
})));
