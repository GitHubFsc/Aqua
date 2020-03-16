var PreviewModel = (function ($) {
  //对话框
  var PopupDialog_ = (function () {
    function PopupDialog_(confObj) {
      if (confObj) {
        this.local = confObj.local;
        this.localContent = confObj.content;

        this.htmlUri = confObj.url;
        this.dialogWidth = confObj.width;
        this.dialogHeight = confObj.height;
        this.perWidth = confObj.perWidth;
        this.perHeight = confObj.perHeight;
        this.ajaxOnEachCreate = confObj.ajaxOnEachCreate;

        this.callbackRef = confObj.context;
        this.drawnCallback = confObj.callback;
        this.calSupport = confObj.calSupport;
      }

      if (!this.perWidth)
        this.dialogWidth = parseInt(this.dialogWidth, 10);

      if (!this.perHeight)
        this.dialogHeight = parseInt(this.dialogHeight, 10);
      this.index = PopupDialog_.index++;
      this.init();
    };
    PopupDialog_.zindex = 2000;
    PopupDialog_.index = 0;
    PopupDialog_.prototype.clear = function () {
      var that = this;
      var mask = document.getElementById(that.maskId);
      var dialog = document.getElementById(that.dialogId);
      jQuery(mask).remove();
      jQuery(dialog).remove();
      if (PopupDialog_.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog_.reLocateDialogFunc);
        PopupDialog_.reLocateDialogFunc = null;
      }
    };
    PopupDialog_.scrollIntoView = function () {
      window.scrollTo(0, 0);
    };
    PopupDialog_.prototype.init = function () {
    };
    PopupDialog_.prototype.locate = function (mask, dialog) {
      var zIndex = PopupDialog_.zindex + this.index;
      jQuery(mask).css({
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex,
        backgroundColor: 'rgba(0,0,0,0.3)'
      });

      var jqDialog = jQuery(dialog);
      var normalDialogLeft, normalDialogTop;

      if (this.perWidth) {
        var widthPer = parseInt(this.dialogWidth, 10);
        normalDialogLeft = '' + Math.floor(50 - widthPer / 2) + '%';
      } else {
        if (this.calSupport) {
          normalDialogLeft = Math.floor((window.innerWidth - this.dialogWidth) / 2);
        } else {
          var dialogOffsetHorizontal = Math.floor(this.dialogWidth / 2);
          normalDialogLeft = 'calc( 50% - ' + dialogOffsetHorizontal + 'px )';
        }
      }

      if (this.perHeight) {
        var heightPer = parseInt(this.dialogHeight, 10);
        normalDialogHeight = '' + Math.floor(50 - heightPer / 2) + '%';
      } else {
        if (this.calSupport) {
          normalDialogTop = Math.floor((window.innerHeight - this.dialogHeight) / 2);
        } else {
          var dialogOffsetVertical = Math.floor(this.dialogHeight / 2);
          normalDialogTop = 'calc( 50% - ' + dialogOffsetVertical + 'px )';
        }
      }

      jqDialog.css({
        position: 'absolute',
        left: normalDialogLeft,
        top: normalDialogTop,
        width: this.dialogWidth,
        height: this.dialogHeight,
        zIndex: zIndex + 1
      });

      function reLocateDialog() {
        var dialogLeft = dialog.offsetLeft;
        var dialogTop = dialog.offsetTop;

        if (dialogLeft < 0) {
          dialogLeft = 0;
        } else {
          dialogLeft = normalDialogLeft;
        }

        if (dialogTop < 0) {
          dialogTop = 0;
        } else {
          dialogTop = normalDialogTop;
        }

        jqDialog.css({
          left: dialogLeft,
          top: dialogTop
        });

        dialogLeft = dialog.offsetLeft;
        dialogTop = dialog.offsetTop;

        if (dialogLeft <= 0) {
          dialogLeft = 0;
        } else {
          dialogLeft = normalDialogLeft;
        }

        if (dialogTop <= 0) {
          dialogTop = 0;
        } else {
          dialogTop = normalDialogTop;
        }

        jqDialog.css({
          left: dialogLeft,
          top: dialogTop
        });
      }

      reLocateDialog();

      if (PopupDialog_.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog_.reLocateDialogFunc);
      }
      PopupDialog_.reLocateDialogFunc = reLocateDialog;
      jQuery(window).bind('resize', PopupDialog_.reLocateDialogFunc);
    };
    PopupDialog_.prototype.getLocalContent = function () {
      var that = this;
      var localContent = this.localContent || '';
      var dialog = document.getElementById(that.dialogId);
      if (dialog) {
        dialog.innerHTML = patchHTML(localContent);
        if (this.drawnCallback && this.callbackRef)
          this.drawnCallback.call(this.callbackRef);
      }
    };
    PopupDialog_.prototype.getContentHtml = function () {
      var that = this;
      if (!this.htmlUri)
        return;
      var self = this;
      if (this.ajaxOnEachCreate) {

        jQuery.get(this.htmlUri, function (data) {
          var dialog = document.getElementById(that.dialogId);
          if (dialog) {
            dialog.innerHTML = patchHTML(data);
            if (self.drawnCallback && self.callbackRef)
              self.drawnCallback.call(self.callbackRef);
          }
        });

      } else {

        if ((this.htmlUri == this.prevHtml) && this.htmlData) {
          var dialog = document.getElementById(that.dialogId);
          if (dialog) {
            dialog.innerHTML = patchHTML(this.htmlData);
            if (self.drawnCallback && self.callbackRef)
              self.drawnCallback.call(self.callbackRef);
          }
        } else {
          jQuery.get(this.htmlUri, function (data) {
            var dialog = document.getElementById(that.dialogId);
            if (dialog) {
              dialog.innerHTML = patchHTML(data);
              self.htmlData = data;
              if (self.drawnCallback && self.callbackRef)
                self.drawnCallback.call(self.callbackRef);
            }
          });
          this.prevHtml = this.htmlUri;
        }

      }
    };
    PopupDialog_.prototype.create = function () {
      var that = this;
      this.maskId = 'popup-dialog-mask' + this.index;
      this.dialogId = 'popup-dialog-dialog' + this.index;

      var mask = document.getElementById(that.maskId);
      var dialog = document.getElementById(that.dialogId);
      if (mask || dialog) {
        that.clear();
      }

      mask = document.createElement('div');
      mask.id = that.maskId;
      document.body.appendChild(mask);
      dialog = document.createElement('div');
      dialog.id = that.dialogId;
      document.body.appendChild(dialog);

      this.locate(mask, dialog);
      if (this.local)
        this.getLocalContent();
      else
        this.getContentHtml();
      PopupDialog_.scrollIntoView();

      jQuery(function () {
        console.log($("#" + that.dialogId + ' .popup_dialog_clear_'));
        jQuery(document.body).off('click', "#" + that.dialogId + ' .popup_dialog_clear_').on('click', "#" + that.dialogId + ' .popup_dialog_clear_', function () {
          that.clear();
        });
      });

    };
    PopupDialog_.prototype.destroy = function () {
      this.clear();
    };
    PopupDialog_.prototype.open = function () {
      this.create();
    };
    PopupDialog_.prototype.close = function () {
      this.clear();
    };
    PopupDialog_.prototype.show = function () {
      var that = this;
      var mask = document.getElementById(that.maskId);
      var dialog = document.getElementById(that.dialogId);
      if (mask && dialog) {
        mask.style.display = 'block';
        dialog.style.display = 'block';
        PopupDialog_.scrollIntoView();
      } else {
        this.create();
      }
    };
    PopupDialog_.prototype.hide = function () {
      var that = this;
      var mask = document.getElementById(that.maskId);
      if (mask) {
        mask.style.display = 'none';
      }
      var dialog = document.getElementById(that.dialogId);
      if (dialog) {
        dialog.style.display = 'none';
      }
    };
    PopupDialog_.prototype.resize = function (obj, live) {
      var that = this;
      if (obj && obj.width)
        this.dialogWidth = obj.width;
      if (obj && obj.height)
        this.dialogHeight = obj.height;

      if (live) {
        this.locate(document.getElementById(that.maskId), document.getElementById(that.dialogId));
      }
    };
    return PopupDialog_;
  })()
  //滚动条列表
  var list = (function () {
    var list = function (obj) {
      var conf = obj;
      if (conf) {
        this.containerId = conf.containerId;
        this.rowsLmt = conf.rows || 1;
        this.columnsLmt = conf.columns || 1;
        this.data = conf.data;
        this.titles = conf.titles;
        this.styles = conf.styles;
        this.listType = conf.listType || 0;
        this.totalCount = conf.totalCount || 0;
        this.updateTitle = conf.updateTitle || false;
      }
      if (!this.containerId)
        return null;
      else {
        this.TitleTable = null;
        this.BodyTable = null;
        this.init();
      }
    };
    list.prototype.init = function () {
      this.totalCount = this.data && this.data.length || 0;
    }
    list.prototype.create = function () {
      var that = this;
      if (this.data.length > 10) {
        this.rowsLmt = this.data.length;
      } else {
        this.rowsLmt = 10;
      }
      this.createList();
      this.fillContent();
      this.fillList();
      that.BodyTableDiv.mCustomScrollbar();
    };
    list.prototype.update = function (param) {
      this.data = param;
      if (this.data.length > 10) {
        this.rowsLmt = this.data.length;
      } else {
        this.rowsLmt = 10;
      }
      this.create();
    };
    list.prototype.createList = function () {
      var that = this;
      var container = document.getElementById(this.containerId);
      if (!container)
        return;
      container.innerHTML = "";
      var jqContainer = jQuery(container);
      jqContainer.empty();
      var TitleTable = document.createElement('table');
      jqContainer.append(TitleTable);

      var jqTitleTable = jQuery(TitleTable);
      that.TitleTable = jqTitleTable;
      that.TitleTable.css({width: "100%"});
      that.setTitleTable(jqTitleTable);
      var BodyTableDiv = document.createElement('div');
      jQuery(BodyTableDiv).css({width: "100%"})
      jQuery(BodyTableDiv).mCustomScrollbar("destroy");
      that.BodyTableDiv = jQuery(BodyTableDiv);
      jqContainer.append(BodyTableDiv);
      var JqBodyTableDiv = jQuery(BodyTableDiv);
      var BodyTable = document.createElement('table');
      JqBodyTableDiv.append(BodyTable);

      var jqBodyTable = jQuery(BodyTable);
      that.setBodyTable(jqBodyTable);
      that.BodyTable = jqBodyTable;
      that.BodyTable.css({width: "100%"});
      this.setStyles();

      //this.setStyles(jqTable);
      //this.jqTable = jqTable;
    };
    list.prototype.setTitleTable = function (jqTable) {
      var tbody = document.createElement('thead');
      jqTable.append(tbody);
      var tr = document.createElement('tr');
      jQuery(tbody).append(tr);

      var jqTr = jQuery(tr);
      for (var i = 0; i < this.columnsLmt; i++) {
        var td = document.createElement('td');
        jqTr.append(td);
      }
    };
    list.prototype.setBodyTable = function (jqTable) {
      var tbody = document.createElement('tbody');
      jqTable.append(tbody);
      var jqTbody = jQuery(tbody);
      for (var i = 0; i < this.rowsLmt; i++) {
        var row = document.createElement('tr');
        jqTbody.append(row);
        var jqRow = jQuery(row);
        for (var j = 0; j < this.columnsLmt; j++) {
          var td = document.createElement('td');
          jqRow.append(td);
        }
      }
    };
    list.prototype.fillContent = function () {
      this.content = [];
      for (var i = 0; i < this.rowsLmt; i++) {
        var dataItem = this.data[0 + i];
        if (dataItem !== undefined && dataItem !== null)
          this.content.push(dataItem);
      }
    };
    list.prototype.fillList = function () {
      this.fillListTitle();
      this.fillListBody();
    };
    list.prototype.setStyles = function () {
      var that = this;
      var cellspacing = this.styles && this.styles.borderWidth || 1;
      var bgColor = this.styles && this.styles.borderColor || 'black';
      var BodyTableDiv_height = this.styles && this.styles.BodyTableDiv_height || "290px"
      that.TitleTable.attr('cellspacing', cellspacing);
      that.TitleTable.css({
        backgroundColor: bgColor,
        tableLayout: 'fixed'
      });
      that.BodyTable.attr('cellspacing', cellspacing);
      that.BodyTable.css({
        backgroundColor: bgColor,
        tableLayout: 'fixed',
      });
      that.BodyTableDiv.css({
        height: BodyTableDiv_height
      });


      var titleBg = this.styles && this.styles.titleBg || 'white';
      var titleColor = this.styles && this.styles.titleColor || 'black';
      var cellBg = this.styles && this.styles.cellBg || 'white';
      var cellColor = this.styles && this.styles.cellColor || 'black';

      var evenBg = this.styles && this.styles.evenBg;
      var oddBg = this.styles && this.styles.oddBg;

      var titleHeight = this.styles && this.styles.titleHeight || 40;
      var cellHeight = this.styles && this.styles.cellHeight;
      var columnsWidth = this.styles && this.styles.columnsWidth;
      that.TitleTable.find('thead td').css({
        color: titleColor,
        backgroundColor: titleBg,
        textAlign: 'center',
        overflow: '',
        fontWeight: this.styles.theadbold ? 'bold' : 'normal',
        'word-break': 'keep-all',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      }).height(titleHeight);
      var self = this;
      if (columnsWidth && columnsWidth.length) {
        that.TitleTable.find('thead td').each(function (index, item) {
          if (index < self.columnsLmt && columnsWidth[index]) {
            var itemWidth = Math.round(that.TitleTable.width() * columnsWidth[index]);
            jQuery(item).css({width: columnsWidth[index] * 100 + "%"});
          }
        });
        that.BodyTable.find('tbody td').each(function (index, item) {
          if ((index % self.columnsLmt) < self.columnsLmt && columnsWidth[index]) {
            var itemWidth = Math.round(that.TitleTable.width() * columnsWidth[index]);
            jQuery(item).css({width: columnsWidth[index] * 100 + "%"});
          }
        });
      }

      that.BodyTable.find('td').css({
        color: cellColor,
        textAlign: 'center',
        overflow: '',
        'word-break': 'keep-all',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'position': 'relative'
      }).height(cellHeight);
      that.BodyTable.find('tr:nth-child(2n-1) td').css({
        backgroundColor: (oddBg ? oddBg : cellBg)
      });
      that.BodyTable.find('tr:nth-child(2n) td').css({
        backgroundColor: (evenBg ? evenBg : cellBg)
      });
    };
    list.prototype.fillListTitle = function () {
      var self = this;
      this.TitleTable.find('thead td').each(function (index, item) {
        var titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
        if (titleCellContent !== undefined && titleCellContent !== null)
          item.innerHTML = titleCellContent;
      });
    };
    list.prototype.fillListBody = function () {
      var self = this;
      this.BodyTable.find('tr').each(function (index, item) {
        jQuery(item).children('td').each(function (tdIndex, tdItem) {
          var bodyCellContent = self.content && self.content[index]
            && self.content[index][tdIndex] && self.content[index][tdIndex].label;
          if (bodyCellContent !== undefined && bodyCellContent !== null) {
            tdItem.innerHTML = bodyCellContent;
            $(tdItem).attr("title", bodyCellContent);
          }
          else {
            tdItem.innerHTML = '';
          }
        });
      });
    };
    return list;
  })()

  var PreviewModel = function () {
    this.token = "";
    this.token2 = "";
    this.type = null;
    this.id = null;
    this.user = {
      username: storage_username,
      password: storage_password,
      domain: storage_domain,
    };
    this.init();
  };
  PreviewModel.prototype.init = function () {
    my_aqua.init(this.user.username, this.user.password, this.user.domain);
    this.token = "user_id=" + my.paas.user_id +
      "&user_type=" + my.paas.user_type +
      "&access_token=" + my.paas.access_token +
      "&app_key=" + paasAppKey +
      "&timestamp=";
    this.token2 = "user_type=" + my.paas.user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=";
  };
  PreviewModel.prototype.previewSuCai = function (id, config) {
    if (!id) {
      console.log("id is null");
      return false;
    }
    var that = this;
    that.id = id;
    if (!config) {
      config = {};
    }
    var data = that.getSucai(that.id);
    if (data.type == "img") {
      var file_url = "";
      var str_ ;
      var str__ ;
      var fileName ;
      if(data.url) {
        file_url = data.url
      } else if(data.aqua_url) {
        file_url = data.aqua_url
      }
      str_ = file_url.split("?");
      str__ = str_[0].split("/");
      fileName = str__[str__.length - 1];
      if((Array.prototype.slice.call(fileName, -5).join("") === '.html') || (Array.prototype.slice.call(fileName, -4).join("") === '.htm')){
        that.previewHTML(data, config);
      }else{
        that.previewIMG(data, config);
      }
    }
    if (data.type == "video") {
      that.previewVideo(data, config);
    }
    if (data.type == "subtitle") {
      that.previewSubtitle(data, config);
    }
  };
  PreviewModel.prototype.previewIMG = function (data, config) {
    var width;
    var height;
    var that = this;
    var BooleanBigImg = false;
    if (data.width > data.height) {
      if (data.width >= 800) {
        if (data.width / data.height >= 4) {
          width = 800;
          height = 200;
          BooleanBigImg = true;
        } else {
          width = 800;
          height = Math.floor(800 / data.width * data.height);
          data.width = width;
          data.height = height;
        }
      } else if (data.width <= 760 && data.height <= 400) {
        width = 760;
        height = 400;
      } else {
        width = data.width;
        height = data.height;
      }
    }
    else {
      if (data.height >= 600) {
        if (data.height / data.width >= 4) {
          width = 800;
          height = 200;
          BooleanBigImg = true;
        } else {
          height = 600;
          width = Math.floor(600 / data.height * data.width);
          data.width = width;
          data.height = height;
        }
      } else if (data.height <= 400) {
        width = 760;
        height = 400;
      } else {
        width = data.width;
        height = data.height;
      }
    }
    this.seeDialog = new PopupDialog_({
      url: 'content/su_cai_preview/previewSucaiDialog.html',
      width: width,
      height: height + 34 + (config.viewDennyMsg ? 49 : 0),
      context: that,
      callback: function () {
        var img = $('<img src = "' + my_aqua.getDownloadFileURL(data.url) + '"/>')
        if (that.seeDialog.booleanSmallImg) {
          img.css({
            width: that.seeDialog.img.width - 22,
            height: that.seeDialog.img.height - 22,
            "marginLeft": Math.floor((760 - that.seeDialog.img.width ) / 2) + 11 + "px",
            "marginTop": Math.floor((400 - that.seeDialog.img.height) / 2) + 11 + "px"
          })
        } else if (that.seeDialog.booleanBigImg) {
          var imgW = that.seeDialog.img.width;
          var imgH = that.seeDialog.img.height;
          var H_imgW = Math.floor(200 / imgH * imgW) ? Math.floor(200 / imgH * imgW) : 1;
          var W_imgH = Math.floor(800 / imgW * imgH) ? Math.floor(800 / imgW * imgH) : 1;
          img.css({
            width: (imgW > imgH ? 800 : H_imgW) - 22,
            height: (imgH > imgW ? 200 : W_imgH) - 22,
            "marginLeft": (imgW > imgH ? 0 : Math.floor((800 - H_imgW) / 2)) + 11 + "px",
            "marginTop": (imgW < imgH ? 0 : Math.floor((200 - W_imgH) / 2)) + 11 + "px"
          })
        } else {
          img.css({
            width: that.seeDialog.img.width - 22,
            height: that.seeDialog.img.height - 22,
            "marginLeft": 11 + "px",
            "marginTop": 11 + "px"
          })
        }
        $("#ViewSucaiContent").append(img);
        if (config.viewDennyMsg) {
          jQuery("#ViewSucaiContent").css({
            height: "calc(100% - 36px - 49px)"
          });
          jQuery(".sucai_dialog_create_opition").show();
          that.initDeneyMsgBotton(data);
        }
      }
    });
    this.seeDialog.booleanSmallImg = false;
    this.seeDialog.booleanBigImg = false;
    if ((data.width > data.height) && (data.width <= 760 && data.height <= 400))
      this.seeDialog.booleanSmallImg = true;
    if ((data.width <= data.height) && (data.height <= 400))
      this.seeDialog.booleanSmallImg = true;
    if (BooleanBigImg)
      this.seeDialog.booleanBigImg = true;
    this.seeDialog.img = {};
    this.seeDialog.img.width = data.width;
    this.seeDialog.img.height = data.height;
    this.seeDialog.open();
  };
  PreviewModel.prototype.previewHTML = function (data, config) {
    var width;
    var height;
    var that = this;
    var BooleanBigImg = false;
    that.iframeURI = "";
    this.seeDialog = new PopupDialog_({
      url: 'content/su_cai_preview/previewSucaiDialog.html',
      width: 646,
      height: 410 - 40 + 49,
      context: that,
      callback: function () {
        $(".sucai_dialog_img_content .html").show();
        var downloadURL = data.aqua_url;
        var $iframe = $('<iframe style="width:100%;height:100%;" frameborder="0" marginheight="0" marginwidth="0"></iframe>');
        $(".sucai_dialog_img_content .html").append($iframe);
        $iframe.attr('src', downloadURL);
        that.iframeURI = downloadURL
        var url = downloadURL;
        var file_url = url;
        var str_ = file_url.split("?");
        file_url = str_[0];
        var nameArray = file_url.split("/");
        var path = nameArray.slice(0, -1).join("/") + "/";

        var url = path + 'template.json';
        var index = 0;
        var okHtmlName = "";
        that.getTemplateJson(url, function (data) {
          if(data.jumpToHtmlName){
            okHtmlName = data.jumpToHtmlName;
            $("#ViewSucaiContent").addClass('okhtml');
            $("#ViewSucaiContent").on('click','.leftArrow', function(){
              if(index == 1){
                index = 0;
                $iframe.attr('src', path + "index.html");
                that.iframeURI = path + "index.html"
              }
            });
            $("#ViewSucaiContent").on('click','.rightArrow', function(){
              if(index == 0){
                index = 1;
                $iframe.attr('src', path + okHtmlName);
                that.iframeURI = path + okHtmlName
              }
            });
          }
        });
        jQuery("#ViewSucaiContent").css({
          height: "calc(100% - 36px - 49px)"
        });
        jQuery(".sucai_dialog_create_opition").show();
        that.initViewFullScreenBotton();
        if (config.viewDennyMsg) {
          that.initDeneyMsgBotton(data);
        }
      }
    });
    this.seeDialog.open();
  };
  PreviewModel.prototype.previewVideo = function (data, config) {
    var that = this;
    this.seeDialog = new PopupDialog_({
      url: 'content/su_cai_preview/previewSucaiDialog.html',
      width: 720,
      height: 520 + (config.viewDennyMsg ? 90 : 0),
      context: that,
      callback: function () {
        myPlayer.resetPlayer();
        var videoURL_str = that.seeDialog.data.url ? that.seeDialog.data.url : that.seeDialog.data.aqua_url;
        videoURL_str = my_aqua.getDownloadFileURL(videoURL_str);
        myPlayer.initPage("ViewSucaiContent", videoURL_str, "2");
        jQuery(document.body).on('click', "#" + that.dialogId + ' .popup_dialog_clear_', function () {
          myPlayer.resetPlayer();
        });
        if (config.viewDennyMsg) {
          jQuery("#ViewSucaiContent").css({
            height: "calc(100% - 36px - 49px)"
          });
          jQuery(".sucai_dialog_create_opition").show();
          that.initDeneyMsgBotton(data);
        }
      }
    });
    this.seeDialog.data = data;
    this.seeDialog.open();
  };
  PreviewModel.prototype.previewSubtitle = function (data, config) {
    var that = this;
    this.seeDialog = new PopupDialog_({
      url: 'content/su_cai_preview/previewSucaiDialog.html',
      width: 717,
      height: 343 + (config.viewDennyMsg ? 49 : 0),
      context: that,
      callback: function () {
        if (config.viewDennyMsg) {
          jQuery("#ViewSucaiContent").css({
            height: "calc(100% - 36px - 49px)"
          });
          jQuery(".sucai_dialog_create_opition").show();
          that.initDeneyMsgBotton(data);
        }
        jQuery("#subtitleContent").show();
        jQuery("#subtitleContent").val(data.subtitle_content || "");
      }
    });
    this.seeDialog.data = data;
    this.seeDialog.open();
  };
  PreviewModel.prototype.previewSuCaiZu = function (id) {
    if (!id) {
      console.log("id is null");
      return false;
    }
    var that = this;
    var ad_group_id = id;
    this.SuCaiZuDialog = new PopupDialog_({
      url: 'content/su_cai_preview/previewSucaiZuDialog.html',
      width: 1122,
      height: 562,
      context: that,
      callback: function () {
        var data = that.getSucaiforSucaiZu(that.SuCaiZuDialog.ad_group_id);
        var widths = [0.14, 0.10, 0.12, 0.12, 0.08, 0.34, 0.10];
        var table_data = that.formListData(data);
        var CategoryTable = new list({
          rows: 10,
          columns: 7,
          containerId: 'ViewSucaiZuContent',
          titles: [{
            label: i18n('SUCAI_SUCAIMINGCHEN')
          }, {
            label: i18n('SUCAI_ZHUANGTAI')
          }, {
            label: i18n('SUCAI_CHUANGJIANZHE')
          }, {
            label: i18n('SUCAI_CHICUNPX')
          }, {
            label: i18n('SUCAI_QUANZHONG')
          }, {
            label: i18n('SUCAI_SUCAIURL')
          }, {
            label: i18n('SUCAI_CAOZUO')
          }],
          listType: 0,
          data: table_data,
          styles: {
            borderColor: 'rgb(225, 225, 225)',
            borderWidth: 1,
            titleHeight: 33,
            titleBg: 'rgb(94,160,192)',
            titleColor: 'white',
            cellBg: 'white',
            evenBg: 'rgb(245,245,245)',
            cellColor: 'rgb(114,114,114)',
            cellHeight: 47,
            footBg: 'white',
            theadbold: false,
            inputBorder: '1px solid rgb(203,203,203)',
            inputBg: 'white',
            columnsWidth: widths,
            BodyTableDiv_height: "481px"
          }
        });
        CategoryTable.create();
        $('#ViewSucaiZuContent').on('click', '.preview_sucai', function () {
          var $op = $(this);
          that.previewSuCai($op.data("id"));
        });
      }
    });
    this.SuCaiZuDialog.ad_group_id = ad_group_id;
    this.SuCaiZuDialog.open();
  };

  PreviewModel.prototype.initViewFullScreenBotton = function () {
    var that = this;
    jQuery("#ViewSucaiHTMLFullScreen").show();
    jQuery("#ViewSucaiHTMLFullScreen").click(function () {
      window.open(that.iframeURI, '_blank');
    });
  }
  PreviewModel.prototype.initDeneyMsgBotton = function (data) {
    var that = this;
    jQuery("#ViewSucaiDennyMsg").show();
    if (data && (data.state == "deprecated")) {
      jQuery("#ViewSucaiDennyMsg").text(i18n("SUCAI_VIEWDENNYMSG"));
      jQuery("#ViewSucaiDennyMsg").removeClass("popup_dialog_clear_");
      jQuery("#ViewSucaiDennyMsg").click(function () {
        that.previewDeneyMsg(data.ad_id);
      });
    }
  }
  PreviewModel.prototype.previewDeneyMsg = function (id) {
    var that = this;
    var msg = i18n("SUCAI_NOTFOUNDDENNYMSG");
    this.DeneyMsgDialog = new PopupDialog_({
      url: 'content/su_cai_preview/auditDeneyDialog.html',
      width: 760,
      height: 342,
      context: that,
      callback: function () {
        jQuery("#ViewDeneyMsgContent").css({
          height: "calc(100% - 36px - 49px)"
        });
        var data = that.getSucaiDennyMsg(id, function (data) {
        });
        data && data.step && (Object.prototype.toString.call(data.step) == '[object Array]') && data.step.forEach(function (item) {
          if (item.status == "deprecated") {
            msg = item.reason || i18n("SUCAI_NOTFOUNDDENNYMSG");
          }
        });
        jQuery("#DeneyMsg").val(msg);
      }
    });
    this.DeneyMsgDialog.open();
  };
  PreviewModel.prototype.formListData = function (data) {
    var list_data = [];
    var row_data = [];
    for (var i = 0; i < data.length; i = i + 1) {
      var record = this.formListRowData(data[i]);
      list_data.push(record);
    }
    return list_data;
  };
  PreviewModel.prototype.formListRowData = function (Date) {
    var result = [];
    var i;
    var arr1 = Date.name;
    var state = Date.state;
    var arr2;
    switch (state) {
      case "上传中":
        arr2 = state;
        break;
      case "first_audit:prepare_audit":
        arr2 = i18n('SUCAI_CHUSHEN');
        break;
      case "second_audit:prepare_audit":
        arr2 = i18n('SUCAI_FUSHEN');
        break;
      case "third_audit:prepare_audit":
        arr2 = i18n('SUCAI_ZHONGSHEN');
        break;
      case "deprecated":
        arr2 = i18n('SUCAI_SHENHESHIBAI');
        break;
      case "enabled":
        arr2 = i18n('SUCAI_YIQIYONG');
        break;
      case "disabled":
        arr2 = i18n('SUCAI_JINYONG');
        break;
      case "发布中":
        arr2 = "发布中";
        break;
      case "已发布":
        arr2 = "已发布";
        break;
      default:
        arr2 = i18n('SUCAI_BUMING');
        break;
    }
    var arr3 = Date.username ? Date.username : "";
    var arr4 = Date.width + " × " + Date.height;
    var arr5 = Date.level;
    var arr6 = "<input readonly='onread' style='background:inherit;height: 30px;width: 90%;line-height: 30px;border: 0px white solid;font-size: 14px;padding-left: 7px;vertical-align: middle;outline: none medium;color: #8a8a8a;' value = '"
      + (Date.url ? Date.url : Date.aqua_url) + "' />";
    var arr7 = "<span class=\"sucai_smallWord_in_td preview_sucai\" style=\"margin-left:8px\" data-id='" + Date.ad_id + "'>" + i18n("SUCAI_CHAKAN") + "</span>";
    var arr = [{label: arr1}, {label: arr2}, {label: arr3}, {label: arr4}, {label: arr5}, {label: arr6}, {label: arr7}];
    return arr;
  };

  PreviewModel.prototype.getSucai = function (ad_id, callback) {
    var result = false;
    var that = this;
    var url = paasHost + paasAdvDomain + "/ads/aditem/" + ad_id + "?" + that.token + new Date().toISOString();
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data) {
      if (callback) {
        callback(data);
      }
      result = data;
    });
    return result;
  };
  PreviewModel.prototype.getSucaiforSucaiZu = function (ad_group_id, callback) {
    var that = this;
    var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type + "&" + that.token + new Date().toISOString();
    if (ad_group_id) {
      url = url + "&ad_group_id=" + ad_group_id;
    }
    var result = null;
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data, status, xhr) {
      result = data;
      var totalCount = xhr.getResponseHeader('x-aqua-total-count');
      result.allCount = totalCount;
    });
    return result;
  };
  PreviewModel.prototype.getSucaiDennyMsg = function (ad_id, callback) {
    var result = false;
    var that = this;
    var url = paasHost + paasDomain + "/auditflow/instance/ad_item/" + ad_id + "?" + that.token2 + new Date().toISOString();
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data) {
      if (callback) {
        callback(data);
      }
      result = data;
    });
    return result;
  };
  PreviewModel.prototype.getTemplateJson = function (url, callback, errorCallback) {
    var that = this;
    $.ajax({
      type: 'GET',
      async: true,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      dataType: 'json',
    }).done(function (data, status, xhr) {
      callback && callback(data);
    }).fail(function (jqXHR, textStatus) {
      var data = {};
      errorCallback && errorCallback(data);
    });
  };

  return PreviewModel;
})(jQuery);