(function(global, factory) {
  global.SucaiContractHint = factory(jQuery, OverlayDialog)
})(this, (function($, Dialog){
  let Pane = {
    init({type}) {
      var dialog = this.initDialog({type});
      dialog.create();
    },
    initDialog({type}) {
      var dialogId = 'SucaiContractHint_' + new Date().getTime();
      var dom = `<div class='_dialog' id='${dialogId}'>
        <style>
          #${dialogId} {font-family: Microsoft YaHei;}
          #${dialogId} ._dialog_title {height: 34px;line-height: 34px;background-color: #7CB7D2;}
          #${dialogId} ._dialog_title_label {font-size: 16px;}
          #${dialogId} table {width: 757px;border-collapse: collapse;margin-left: 10px;}
          #${dialogId} table td {height: 36px;border: 1px solid #E2E2E2;font-size: 14px;}
          #${dialogId} .hint {font-size: 16px;margin: 23px 0 17px 23px;color: #727272;}
          #${dialogId} .table_title {text-align: center;background-color: #7CB7D2;color: #fff;}
          #${dialogId} .table_body {color: #797979;}
          #${dialogId} .table_body td {height: 42px;}
          #${dialogId} ._dialog_foot .btn {height: 30px;line-height: 30px;font-size: 14px;width: 90px;}
          #${dialogId} ._dialog_foot .cancel {background-color: #88C5E0;}
          #${dialogId} ._dialog_foot .confirm {background-color: #5DA1C0;}
        </style>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${i18n('UTILS_DIALOG_INFO')}</div>
          <div class='_dialog_span'></div>
          <div class='_dialog_close'></div>
        </div>
        <div class='_dialog_body'>
          <div class='hint'>${
            type == 'sucai' ?
            '您好，您当前策略选择使用合同计费，选择绑定素材的合同编号如下，请检查后继续。':
            '您好，您当前策略选择使用合同计费，选择绑定素材组的合同编号如下，请检查后继续。'
          }</div>
          <table class='table_title'>
            <td width='35'></td>
            <td width='451'>素材名称</td>
            <td>合同编号</td>
          </table>
          <div class='table_body' style='max-height: 318px;'>

          </div>
        </div>
        <div class='_dialog_foot'>
          <div class='cancel btn'>${i18n('DIALOG_CANCEL')}</div>
          <div class='confirm btn'>${i18n('DIALOG_CONTINUE')}</div>
        </div>
      </div>`
      var dialog = new Dialog({
        id: dialogId,
        content: dom,
        local: true,
        zIndex: 3000,
        width: 796,
        height: type == 'sucai' ? 257 : 521,
        context: this,
        callback: () => {
          this.bindDialogEvents(dialog)
          this.loadData(dialog, this.model.data)
        }
      })
      return dialog;
    },
    bindDialogEvents(dialog) {
      $('#' + dialog.dialogId)
      .on('click', '._dialog_close', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close();
        }
      })
      .on('click', '._dialog_foot .cancel', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close();
        }
      })
      .on('click', '._dialog_foot .confirm', ({currentTarget, target}) => {
        if (currentTarget == target) {
          this.api.confirm(this.model.contract_ids)
          dialog.close();
        }
      })
    },
    loadData(dialog, data) {
      $('#' + dialog.dialogId).find('.table_body').empty().append($(this.model.table(this.model.data)))
      $('#' + dialog.dialogId).find('.table_body').mCustomScrollbar();
    }
  };
  let API = {};
  let Model = {
    contract_ids: [],
    table(data) {
      var content='';
      for (var i = 0; i < data.length; i++) {
        this.contract_ids.push(data[i].contract_id);
        var item = data[i];
        var row = `<tr>`
        row += `<td width='35' style='text-align: center;'>${i+1}</td>`
        row += `<td width='441' style='padding-left: 10px;'>${item.name}</td>`
        row += `<td style='padding-left: 10px;'>${item.contract_id}</td>`
        row += `</tr>`
        content += row
      }
      var dom = `<table>${content}</table>`
      return dom
    }
  }

  let frame = function({data, confirm, type}) {
    var model = $.extend(true, {data}, Model)
    var api = $.extend(true, {confirm}, API)
    var pane = $.extend(true, {api, model}, Pane)
    pane.init({type});
  }
  return frame
}))
