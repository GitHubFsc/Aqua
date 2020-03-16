/**
 * AlertDialog
 * @author yubin.fu
 * @params {string} message []
 */
(function(global, factory) {
  global.AlertDialog = factory(jQuery, OverlayDialog);
})(this, (function ($, Dialog) {
  let Pane = {
    init(opts) {
      var dialog = this.initDialog(opts);
      dialog.create();
    },
    initDialog({message, zIndex=2000, title = i18n('EXER_DIALOG_MSG_TITLE')}) {
      var dialogId = 'dialog_' + new Date().getTime();
      var dom = `<div class="alert _dialog" id='${dialogId}'>
        <div class="_dialog_title">
          <div class="_dialog_title_label">${title}</div>
          <div class="_dialog_span"></div>
          <div class="_dialog_close popup_dialog_clear"></div>
        </div>
        <div class="_dialog_body">${message}</div>
        <div class="_dialog_foot">
          <div class="btn cancel">${i18n('ADPOLICYMANAGE_DIALOG_CANCEL')}</div>
          <div class="btn confirm">${i18n('ADPOLICYMANAGE_DIALOG_CONFIRM')}</div>
        </div>
      </div>`
      var cb = () => {
        this.bindEvents(dialog);
      }
      let dialog = new Dialog({
        id: 'alert' + new Date().getTime(),
        zIndex: zIndex || 3000,
        local: true,
        content: dom,
        context: this,
        width: 484,
        height: 266,
        callback: cb
      });
      return dialog
    },
    bindEvents(dialog, callback) {
      //bind btn events
      $('#' + dialog.dialogId)
      .on('click', '._dialog_title ._dialog_close', ({target, currentTarget}) => {
        if (currentTarget == target) {
          dialog.close();
        }
      })
      .on('click', '._dialog_foot .cancel.btn', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close();
        }
      })
      .on('click', '._dialog_foot .confirm.btn', ({currentTarget, target}) => {
        if (currentTarget == target) {
          if(this.api.confirmFn) {
            this.api.confirmFn(() => {
              dialog.close();
            });
          } else {
            dialog.close();
          }
        }
      });
    }
  };
  let API = {};
  return function (opts) {
    var api = $.extend(true, API, {confirmFn: opts.confirmFn});
    var pane = $.extend(true, Pane, {api: api});
    pane.init(opts);
  }
}))
