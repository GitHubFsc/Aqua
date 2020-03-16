((function(global, factory) {
  global.Vers = factory(jQuery, StyledList, OverlayDialog, AlertDialog)
})(this, (function($, Table, Dialog, Alert) {
  var dialog = function(opts) {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.api = api;
    pane.api.callback = opts.callback;
    pane.model = model;
    pane.init(opts);
  }
  var Pane = {
    change: false,
    init({id, name}) {
      var dialog = this.initDialog({id, name})
      dialog.create();
    },
    initDialog({id, name}) {
      var _this = this;
      var dom = `<div class='_dialog' id='${id}'>
        <style>
          label.hint {margin: 0 5px 0 0;}
        </style>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${i18n('NAVIGATIONVERSION_DIALOG_TITLE').replace('{{}}', name)}</div>
          <div class='_dialog_span'></div>
          <div class='_dialog_close'></div>
        </div>
        <div class='_dialog_body _dialog_span' style='margin: 5px;'>
          <div class='list_table' id='${id}_list_table'></div>
        </div>
        <div class='_dialog_foot'>
          <div class='btn cancel'>${i18n('DIALOG_CLOSE')}</div>
        </div>
      </div>`;
      var dialog = new Dialog({
        id: id,
        content: dom,
        width: 610,
        height: 632,
        local: true,
        context: this,
        callback: () => {
          var table = _this.initTable({id, name});
          table.create();
          _this.bindEvents({dialog, table})
        }
      })
      return dialog
    },
    initTable({id, name}) {
      var table = new Table({
        containerId: id + '_list_table',
        rows: 12,
        columns: 3,
        listType: 1,
        async: true,
        titles: [
          {label: i18n('NAVIGATIONVERSION_VERS_TABLE_VER')},
          {label: i18n('NAVIGATIONVERSION_VERS_TABLE_TIME')},
          {label: i18n('TABLE_OP')}
        ],
        styles:{
        	borderColor: '#e2e2e2',
        	borderWidth: '1px',
        	titleBg: '#45d1f4',
        	titleColor: '#ffffff',
        	evenBg: '#f5fdff',
        	oddBg: '#ffffff',
        	cellColor: '#797979',
        	footBg: '#ffffff',
        	footColor: '#797979',
        	titleHeight: '31px',
        	cellHeight: '36px',
        	iconColor: '#0099cb',
        	inputBg: 'transparent',
        	inputBorder: '#cbcbcb',
        	columnsWidth: [0.39, 0.33, 0.28]
        }
      })
      table.getPageData = (pageNumber, callback) => {
        this.api.getList({name, page: pageNumber, model: this.model.list, size: table.rowsLmt}, (resp) => {
          var {data, totalCount, tableset} = resp
          table.onTotalCount(totalCount)
          this.model.data = data;
          callback && callback(tableset)
        })
      };
      return table
    },
    bindEvents({dialog, table}) {
      var _this = this;
      $('#' + dialog.dialogId)
      .on('click', '._dialog_foot .btn.cancel', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close()
          _this.api.callback(_this.change)
        }
      })
      .on('click', '._dialog_close', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close();
          _this.api.callback(_this.change)
        }
      })
      .on('click', '._dialog_body .list_table span a[name=change]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index');
          var data = this.model.data[index],
              {metadata_public: {version, primary_tree_id}, name, id} = data;
          var msg = i18n('NAVIGATIONVERSION_DIALOG_CHANGEHINT')
          msg = msg.replace(/{{name}}/, name)
          msg = msg.replace(/{{version}}/, version)
          var dialog = new Alert({
            message: msg,
            zIndex: 3000,
            confirmFn: (callback) => {
              this.api.changeRelease({release_id: id, tree_id: primary_tree_id}, () => {
                _this.change = true;
                callback && callback()
                table.refreshList();
              })
            }
          })
        }
      })
    }
  };
  var API = {
    getList({name, page, model, size}, callback) {
      var method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees',
          urlParam = [], {user_id, access_token} = my.paas, ret = {};
      urlParam.push('tree_name=' + name)
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('user_id=' + user_id)//用户级授权
      urlParam.push('access_token=' + access_token)//用户级授权
      urlParam.push('release_status=released')//审核通过的已发布树
      urlParam.push('is_active_release=false')//审核通过的待发布树
      urlParam.push('start=' + (page - 1) * size)//分页
      urlParam.push('end=' + (page * size - 1))//分页
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          ret = {data: resp, totalCount: xhr.getResponseHeader('x-aqua-total-count'), tableset: model(resp)}
        } else {
          ret = {data: [], totalCount: 0, tableset: model([])}
        }
        callback && callback(ret)
      })
    },
    changeRelease({tree_id, release_id}, callback) {
      var method = 'Put',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/release',
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey);//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('tree_id=' + tree_id)
      urlParam.push('release_tree_id=' + release_id)
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    }
  }
  var Model = {
    list(dataset) {
      var set = [];
      for (var i = 0; i < dataset.length; i++) {
        var {metadata_public: {version, audit_time}} = dataset[i];
        var row = [];
        row.push({label: version})
        row.push({label: convertTimeString(audit_time)})
        var op_change = '<a name="change" data-index="' + i + '">' + i18n('NAVIGATIONVERSION_DIALOG_TABLE_OP_CHANGEVER') + '</a>'
        row.push({
          label: ['<span>', op_change, '</span>'].join('')
        })
        set.push(row)
      }
      return set;
    }
  }
  return dialog;
})))
