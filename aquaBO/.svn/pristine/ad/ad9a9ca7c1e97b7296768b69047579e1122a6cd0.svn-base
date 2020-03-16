/**
 * change log
 * @log 2019-11-05 junwei.wo提出snaptree需要异步创建，因此需要更改为递交审核后，拿返回的版本号去主树上的metadata_public.last_snapshot_version去对比，如果一样了，则snaptree更新成功。此时才能把snaptree进审核。
 */
(function(global, factory) {
  global.NavTreeAudit = factory(jQuery, OverlayDialog)
})(this, (function($, Dialog) {
  let dialog = function(opts) {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {callback: opts.callback}, API)
    var model = $.extend(true, {}, Model, {data:{name: opts.name}})
    pane.api = api;
    pane.model = model;
    pane.init(opts);
  }
  let Pane = {
    init({id}) {
      var dialog = this.initDialog({id})
      dialog.create();
    },
    initDialog({id}) {
      let _this = this;
      var dom = `<div class='_dialog' id='${id}'>
        <style>
          label {margin-left: 0;}
          textarea, input {outline: none}
          .loading_mask {position: absolute;top: 0;left: 0;height: 100%;width: 100%}
        </style>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${i18n('NAVIGATE_AUDIT')}</div>
          <div class='_dialog_span'></div>
          <div class='_dialog_close'></div>
        </div>
        <div class='_dialog_body _dialog_span' style='margin: 19px 34px;flex-flow: column;display: flex;justify-content: space-evenly;'>
          <div class='_dialog_col'>
          <label>${i18n('NAVIGATIONAUDIT_TABLE_VERSIONNAME')}</label>
          <textarea id='${id}_desc' style='width: 410px;height: 60px;border: 1px solid #e2e2e2;color: #797979;resize: none;'></textarea>
          </div>
        </div>
        <div class='_dialog_foot'>
          <div class='btn cancel'>${i18n('DIALOG_CANCEL')}</div>
          <div class='btn confirm'>${i18n('DIALOG_CONFIRM')}</div>
        </div>
      </div>
      <img class='loading_mask' src='./images/asset/loading.gif' style='display: none;'/>`
      var dialog = new Dialog({
        id: id,
        content: dom,
        width: 470,
        height: 258,
        context: this,
        local: true,
        callback: () => {
          _this.bindEvents({dialog})
        }
      })
      return dialog;
    },
    bindEvents({dialog}) {
      var id = dialog.specId;
      $('#' + id)
      .on('click', '._dialog_title ._dialog_close', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close()
        }
      })
      .on('keyup', '._dialog_body input[id$=_ver_no]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          this.model.data.ver = $(currentTarget).val()
        }
      })
      .on('keyup', '._dialog_body textarea[id$=_desc]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          this.model.data.desc = $(currentTarget).val()
        }
      })
      .on('click', '._dialog_foot .btn.cancel', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close()
        }
      })
      .on('click', '._dialog_foot .btn.confirm', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var ret = this.checkData(this.model.data)
          if (ret) {
            $(`#${id}`).siblings('.loading_mask').show();
            this.api.submit(this.model.data, () => {
              $(`#${id}`).siblings('.loading_mask').hide();
              dialog.close();
              this.api.callback && this.api.callback()
            })
          }
        }
      })
    },
    checkData(data) {
      var ret = true;
      try {
        var {ver, desc} = data
        if (typeof desc !== 'string' || desc.length == 0) {
          console.error('please input description!');
          ret = false;
        }
      } catch (e) {
        console.log(e.meesage);
      } finally {
        return ret;
      }
    }
  }
  let API = {
    interval: null,
    submit(data, callback) {
      var after = ({resp}) => {
            var putData = $.extend(true, {desc: data.desc}, resp)
        this.interval = setInterval(() => {
          this.checkSnapTreeCreated({name: data.name, version: resp.version}, (success) => {
            if (success) {
            this.pushToAudit({data: putData, callback})
              clearInterval(this.interval);
            }
          })
        }, 30 * 1000);
            }
      this.getTreeSnapshot({data, callback: after})
    },
    checkSnapTreeCreated(data, callback) {
      let {name, version} = data,
          method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/',
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('tree_version=00')
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        var ret = false;
        if (status == 'success') {
          if (resp.metadata_public.last_snapshot_version == version) {
            ret = true
          }
          callback && callback(ret);
        }
      })
    },
    getTreeSnapshot({data, callback}) {
      var method = 'Post',
          {name, desc} = data,
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/snapshot/' + name,
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          version_desc: desc
        })
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback({resp})
        }
      })
    },
    pushToAudit({data, callback}) {
      var method = 'Post',
          {id, name, version, desc} = data,
          {user_id, access_token} = my.paas,
          url = aquapaas_host + '/aquapaas/rest/auditflow/instance/metadata/nav_tree/' + id,
          urlParam = []
      urlParam.push('user_id=' + user_id)//用户级授权
      urlParam.push('access_token=' + access_token)//用户级授权
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify({
          filter: name,
          version: version,
          description: desc
        })
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    }
  }
  let Model = {
    data: {}
  }
  return dialog;
}))
