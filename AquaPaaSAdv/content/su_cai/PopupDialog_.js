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
