//调用实例参数如下
/*
 this.searchSelect = new newSelect("#exer-list-page-search-select", [{
 key: "exercise_id",
 value: i18n("EXER_LIST_LABEL_ID")
 }, {
 key: "knowledge_point",
 value: i18n("EXER_LIST_LABEL_KNOWLG")
 }], {
 width: 110,
 height: 34,
 background: "#ffffff",
 selectbackground: "#ffffff",
 headerBorder: "1px solid rgb(234,234,234)",
 liBorderColor:"rgb(234,234,234)",
 openIconUrl: "./content/uiWidget/images/open1.png",
 closeIconUrl: "./content/uiWidget/images/close1.png"
 }, function () {
 })
 */

(function () {
  var header_style = {
    "border": "1px solid rgb(198, 198, 198)",
    "text-indent": "10px",
    "font-size": "inherit",
    "color": "#a9a9a9",
    "cursor": "pointer",
    "overflow": "hidden",
    "box-sizing": "border-box",
    "display": "flex",
    "text-align": "left"
  };
  var headerContent_style = {
    "box-sizing": "border-box",
    "flex": "1",
    "overflow": "hidden",
    "text-overflow": "ellipsis"
  };
  var headerIcon_style = {
    "box-sizing": "border-box",
    "position": "relative"
  };
  var content_style = {
    "border-left": "1px solid #eaeaea",
    "border-right": "1px solid #eaeaea",
    "margin": "0",
    "padding": "0",
    "z-index": "9999",
    "display": "none",
    "background-color": "#f9f9f9",
    "position": "absolute",
    "box-sizing": "border-box"
  }
  var li_style = {
    "list-style": "none",
    "margin": "0",
    "border-bottom": "1px solid #eaeaea",
    "text-indent": "10px",
    "background-color": "#f9f9f9",
    "font-size": "inherit",
    "color": "#a9a9a9",
    "cursor": "pointer",
    "box-sizing": "border-box",
    "text-align": "left",
    "overflow": "hidden",
    "text-overflow": "ellipsis"
  };

  function newSelect(cantainID, obj, style, listenLiClick, isOther) {
    /*
     style{
     width,
     height,
     background,
     selectbackground,
     disablebackground,
     ScrollBarHeight,
     headerColor,
     headerBorder
     }
     isOther:如果为真，则将会在选中Other的时候触发input事件
     */
    this.selectCantain = jQuery(cantainID);
    this.selectItem = obj;
    this.selectstyle = style;
    this.listenLiClick = listenLiClick ? listenLiClick : function () {
      };
    this.booleanAvailable = true;
    this.init();
  }

  newSelect.prototype.init = function () {
    this.createSelect();
    this.setStyle();
    this.listenClick();
    if(window.dropdownHelper){
      window.dropdownHelper.addDropdownHandler(this);
    }
  }
  newSelect.prototype.handleDropdowns = function(target, delegate){
    var readyCloseStatus = true;
    [this.box,this.header,this.headerContent,this.headerIcon,this.headerOpenIcon,this.headerCloseIcon,this.content].forEach(function(item){
      if (jQuery.contains(item[0], target)) {
        readyCloseStatus = false;
      }else{
      }
    });
    if(readyCloseStatus){
      if (this.content.is(":hidden")) {
      }else{
        this.switchToOpenIcon()
      }
    }
  };
  newSelect.prototype.createSelect = function () {
    this.box = jQuery("<div></div>");
    this.box.addClass("select-box");

    this.header = jQuery("<div></div>");
    this.header.addClass("select-header");
    this.header.appendTo(this.box);

    this.headerContent = jQuery("<div></div>");
    this.headerContent.appendTo(this.header);
    this.headerIcon = jQuery("<div></div>");
    this.headerIcon.appendTo(this.header);
    this.headerOpenIcon = jQuery("<img style='display:block;width:100%;'/>");
    this.headerOpenIcon.appendTo(this.headerIcon);
    this.headerCloseIcon = jQuery("<img style='display:block;width:100%;'/>");
    this.headerCloseIcon.appendTo(this.headerIcon);
    this.headerOpenIcon.css({"display": "block"});
    this.headerCloseIcon.hide();
    this.content = jQuery("<ul></ul>");
    this.content.addClass("select-content");
    this.content.appendTo(jQuery(document.body));
  }
  newSelect.prototype.setStyle = function () {
    var that = this;
    this.box.css({
      "position": "relative",
      "box-sizing": "border-box"
    });
    this.header.css(header_style)
    if (this.selectstyle.headerColor) {
      this.header.css({
        "color": that.selectstyle.headerColor
      })
    }
    if (this.selectstyle.headerBorder) {
      this.header.css({
        "border": that.selectstyle.headerBorder
      })
    }
    if (this.selectstyle.fontSize) {
      this.header.css({
        "font-size": that.selectstyle.fontSize + "px"
      })
    }
    if (this.selectstyle.color) {
      this.header.css({
        "color": that.selectstyle.color
      })
    }
    this.headerContent.css(headerContent_style)
    this.headerIcon.css(headerIcon_style);
    this.headerOpenIcon.attr("src", this.selectstyle.openIconUrl);
    this.headerCloseIcon.attr("src", this.selectstyle.closeIconUrl);
    this.content.css(content_style);
    if (this.selectstyle.width && this.selectstyle.height) {
      var width_ = this.selectstyle.width;
      var height_ = this.selectstyle.height;
      this.box.css({width: width_, height: height_});
      this.header.css({width: width_, height: height_, "line-height": height_ + "px"});
      this.headerContent.css({height: height_ - 2, "line-height": (height_ - 2) + "px"});
      this.headerIcon.css({width: height_, height: height_ - 2, "line-height": (height_ - 2) + "px"});
      this.content.css({width: width_});
      //this.content.css({top: height_});
    }
    if (this.selectstyle.ScrollBarHeight) {
      this.content.css({"overflow-y": "auto"});
      this.content.css({"overflow-x": "hidden"});
      this.content.css({"height": "auto"});
      this.content.css({"max-height": this.selectstyle.ScrollBarHeight});
    }
    if (this.selectstyle.background) {
      this.box.css({"background-color": this.selectstyle.background});
      this.header.css({"background-color": this.selectstyle.background});
      this.content.css({"background-color": this.selectstyle.background});
    }
    if (this.selectstyle.liBorderColor) {
      this.content.css({"border-left-color": this.selectstyle.liBorderColor});
      this.content.css({"border-right-color": this.selectstyle.liBorderColor});
    }
    var i = 0;
    var item;
    var values = this.selectItem;
    if (values instanceof Array) {
      for (i = 0; i < values.length; i++) {
        var content_li = jQuery("<li data-key = '" + values[i].key + "' title='" + values[i].value + "'>" + values[i].value + "</li>");
        content_li.appendTo(this.content);
        content_li.css(li_style);
        if (this.selectstyle.width && this.selectstyle.height) {
          content_li.width(this.selectstyle.width - 2);
          content_li.height(this.selectstyle.height);
          content_li.css({
            "line-height": this.selectstyle.height + "px"
          });
        }
        if (this.selectstyle.liFontSize) {
          content_li.css({
            "font-size": that.selectstyle.liFontSize + "px"
          });
        }
        if (this.selectstyle.liColor) {
          content_li.css({
            "color": that.selectstyle.liColor
          });
        }
        if (this.selectstyle.background) {
          content_li.css({"background-color": this.selectstyle.background});
        }
        if (this.selectstyle.liBorderColor) {
          content_li.css({"border-color": this.selectstyle.liBorderColor});
        }
        if (i == 0) {
          this.header[0].setAttribute('data-key', values[i].key);
          this.headerContent.text(values[i].value);
        }
      }
    } else {
      for (item in values) {
        var content_li = jQuery("<li data-key = '" + item + "'>" + values[item] + "</li>");
        content_li.css(li_style);
        content_li.appendTo(this.content);
        if (this.selectstyle.width && this.selectstyle.height) {
          content_li.width(this.selectstyle.width - 2);
          content_li.height(this.selectstyle.height);
          content_li.css({
            "line-height": this.selectstyle.height + "px"
          });
        }
        if (this.selectstyle.liFontSize) {
          content_li.css({
            "font-size": that.selectstyle.liFontSize + "px"
          });
        }
        if (this.selectstyle.liColor) {
          content_li.css({
            "color": that.selectstyle.liColor
          });
        }
        if (this.selectstyle.background) {
          content_li.css({"background-color": this.selectstyle.background});
        }
        if (this.selectstyle.liBorderColor) {
          content_li.css({"border-bottom-color": this.selectstyle.liBorderColor});
        }
        if (i == 0) {
          this.header[0].setAttribute('data-key', item);
          this.headerContent.text(values[item]);
        }
        i++;
      }
    }
    this.box.appendTo(this.selectCantain);

    var popper = new Popper(this.header[0], this.content[0], {
      placement: 'bottom-start',
    });
    that.popper = popper;
  }
  newSelect.prototype.listenClick = function () {
    var that = this;
    this.header.click(function (evt) {
      if (that.booleanAvailable) {
        if (that.content.is(":hidden")) {
          that.popper.update();
          that.headerOpenIcon.hide();
          that.headerCloseIcon.css({"display": "block"});
          that.content.show();
          /*
          evt.stopPropagation();
          jQuery(document).one("click", function destory(e){
            if (that.header[0].contains(e.target) || that.content[0].contains(e.target)) {
            }else{
              that.headerOpenIcon.css({"display": "block"});
              that.headerCloseIcon.hide();
              that.content.hide();
            }
          });
          */
        } else {
          that.headerOpenIcon.css({"display": "block"});
          that.headerCloseIcon.hide();
          that.content.hide();
          //evt.stopPropagation();
        }
      }
    });
    that.content.find("li").on("click", function () {
      that.headerOpenIcon.css({"display": "block"});
      that.headerCloseIcon.hide();
      that.headerContent.text(jQuery(this).text()).end().hide();
      that.header[0].setAttribute('data-key', jQuery(this).attr('data-key'));
      that.content.hide();
      that.listenLiClick(jQuery(this).attr('data-key'));
    });
    that.content.find("li").hover(function () {
      if (that.selectstyle.background && that.selectstyle.selectbackground) {
        jQuery(this).css("background-color", that.selectstyle.selectbackground);
      }
      else {
        jQuery(this).css("background-color", "#d3d3d3");
      }
    }, function () {
      if (that.selectstyle.background && that.selectstyle.selectbackground) {
        jQuery(this).css("background-color", that.selectstyle.background);
      }
      else {
        jQuery(this).css("background-color", "#f9f9f9");
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
    return this.header.attr('data-key');
  }
  newSelect.prototype.getKey = function () {
    return this.headerContent[0].innerHTML;
  }
  newSelect.prototype.setValue = function (value) {
    var that = this;
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    if (data instanceof Array) {
      for (i = 0; i < data.length; i++) {
        if (value == data[i].value) {
          this.headerContent.text(value);
          this.header[0].setAttribute('data-key', data[i].key);
          boolean_found = true;
        }
      }
    } else {
      for (i in data) {
        if (value == data[i]) {
          this.headerContent.text(value);
          this.header[0].setAttribute('data-key', i);
          boolean_found = true;
        }
      }
    }
    if (!boolean_found) {
      this.headerContent.text(value)
    }
  }
  newSelect.prototype.setKey = function (key) {
    var that = this;
    var data = this.selectItem;
    var i;
    var boolean_found = false;
    if (data instanceof Array) {
      for (i = 0; i < data.length; i++) {
        if (key == data[i].key) {
          this.headerContent.text(data[i].value);
          this.header[0].setAttribute('data-key', data[i].key);
          boolean_found = true;
        }
      }
    } else {
      for (i in data) {
        if (key == i) {
          this.headerContent.text(data[i]);
          this.header[0].setAttribute('data-key', i);
          boolean_found = true;
        }
      }
    }
    if (!boolean_found) {
      this.headerContent.text(key)
    }
  }
  newSelect.prototype.setDisable = function () {
    this.booleanAvailable = false;
    if (this.selectstyle.disablebackground) {
      this.header.css({"background-color": this.selectstyle.disablebackground});
    } else {
      this.header.css({"background-color": "RGB(240, 240, 240)"});
    }
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
  newSelect.prototype.switchToOpenIcon = function () {
    this.headerOpenIcon.css({"display": "block"});
    this.headerCloseIcon.hide();
    this.content.hide();
  }
  newSelect.prototype.switchToCloseIcon = function () {
    this.headerOpenIcon.hide();
    this.headerCloseIcon.css({"display": "block"});
    this.content.show();
  }
  newSelect.prototype.destory = function (obj) {
    window.dropdownHelper.removeDropdownHandler(this);
    [this.box,this.header,this.headerContent,this.headerIcon,this.headerOpenIcon,this.headerCloseIcon,this.content].forEach(function(item){
      item.remove();
      item = null;
    })
    this.observer.disconnect();
    this.observer = null;
  }

  window.newSelect = newSelect;
})();

