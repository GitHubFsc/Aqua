/*
 * id ID（必须项）
 * width 宽度
 * height 高度
 * message 显示的内容
 * callback 确认按钮调用的回掉函数
 * callback = function(cb){
 *
 * }
 */
define(['jquery', 'OverlayDialog'], function($, Dialog) {
  var dialog = function(opts){
    this.dialog = Pane.init(opts);
  }
  var Pane = {
    init(opts) {
      let {id, width, height, message = ''} = opts;
      var dom = `<div class='dialog alert' id='${id}'>
        <div class='title'>
          <div class='close popup_dialog_clear'></div>
        </div>
        <div class='body'>
          ${message}
        </div>
        <div class='foot'>
          <div class='btn icon cancel'>${i18n('Common_Cancel')}</div>
          <div class='btn icon confirm'>${i18n('Common_Confirm')}</div>
        </div>
      </div>`
      let cb = () => {
        Pane.bindEvents(dialog, opts);
      }
      var dialog = new Dialog({
        content: dom,
        width: 583,
        height: 330,
        local: true,
        context: this,
        callback: cb
      })
      dialog.create();
      return dialog;
    },
    bindEvents(dialog, opts) {
      let {id, callback} = opts;
      $('.dialog.alert#' + id)
      .on('click', '.foot .btn.confirm', ({currentTarget, target}) => {
        if (target == currentTarget) {
          if (callback) {
            callback(() => {
              dialog.close();
            })
          } else {
            dialog.close()
          }
        }
      })
      .on('click', '.foot .btn.cancel', ({currentTarget, target}) => {
        if (target == currentTarget) {
          dialog.close()
        }
      })
      .on('click', '.title .close', ({currentTarget, target}) => {
        if (target == currentTarget) {
          dialog.close()
        }
      })
    }
  }
  return dialog;
})
