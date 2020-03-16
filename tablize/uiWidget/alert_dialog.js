var AlertDialog = (function ($, Dialog) {
  let Pane = {
    init(opts) {
      var dialog = this.initDialog(opts);
      dialog.create();
    },
    initDialog({message, zIndex=2000}) {
      var dialogId = 'dialog_' + new Date().getTime();
      var dom = `<div class="alert _dialog" id='${dialogId}'>
        <div class="_dialog_title">
          <div class="_dialog_title_label">${i18n('PRODUCTOFFERING_DIALOG_ALERT_TITLE')}</div>
          <div class="_dialog_span"></div>
          <div class="_dialog_close popup_dialog_clear"></div>
        </div>
        <div class="_dialog_body">${message}</div>
        <div class="_dialog_foot">
          <div class="btn cancel">${i18n('AUTH_MNG_DIALOG_CANCEL')}</div>
          <div class="btn confirm">${i18n('AUTH_MNG_DIALOG_DETAIL_CONFIRM')}</div>
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
    bindEvents(dialog) {

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
  let Model = {};
  return function (opts) {
    var api = $.extend(true, API, {confirmFn: opts.confirmFn});
    var model = $.extend(true, Model, {});
    var pane = $.extend(true, Pane, {api: api, model: model});
    pane.init(opts);
  }
})(jQuery, OverlayDialog);
