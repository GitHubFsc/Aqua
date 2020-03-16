((function(global, factory){
  global.UserInfo = factory(jQuery, OverlayDialog)
})(this, function($, Dialog) {
  var dialog = function(opts) {
    var api = $.extend(true, API, {})
    var model = $.extend(true, Model, {})
    var pane = $.extend(true, Pane, {api: api,model: model})
    pane.init(opts);
  }
  var Pane = {
    init({isfloat = false, type='self', id, name, scope}) {
      if (!isfloat) {
        return this.initDialog({type, id, name});
      } else {
        return this.initFrame({type, id, scope});
      }
    },
    initDialog({type = 'self', id, name}) {
      var dom = `<div class='_dialog' id='audit_userinfo'>
      <style>
        #audit_userinfo {color: #797979;}
        #audit_userinfo label{margin: 0}
        #audit_userinfo input{height: 30px; width: calc(100% - 10px);border: 1px solid #e2e2e2;padding-left: 10px;color: inherit;}
      </style>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${name}</div>
          <div class='_dialog_close'></div>
        </div>
        <div class='_dialog_body' style='padding: 5px;'>
          <div class='_dialog_row'>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL1')}</label>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL2')}</label>
          </div>
          <div class='_dialog_row'>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value1'>
            </div>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value2'>
            </div>
          </div>
          <div class='_dialog_row'>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL3')}</label>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL4')}</label>
          </div>
          <div class='_dialog_row'>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value3'>
            </div>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value4'>
            </div>
          </div>
          <div class='_dialog_row'>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL5')}</label>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL6')}</label>
          </div>
          <div class='_dialog_row'>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value5'>
            </div>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value6'>
            </div>
          </div>
          <div class='_dialog_row'>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL7')}</label>
          </div>
          <div class='_dialog_row'>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value7'>
            </div>
          </div>
          <div class='_dialog_row'>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL8')}</label>
            <label class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'></label>
          </div>
          <div class='_dialog_row'>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
              <input id='audit_userinfo_value8'>
            </div>
            <div class='_dialog_col' style='flex: 1;padding-left: 10px;padding-right: 20px;'>
            </div>
          </div>
        </div>
        <div class='_dialog_foot'>
          <div class='btn confirm'>${i18n('ADPOLICYAUDIT_DIALOG_CANCEL')}</div>
        </div>
      </div>`
      var dialog = new Dialog({
        id: 'user_info_' + new Date().getTime(),
        content: dom,
        local: true,
        width: 760,
        height: 435,
        context: this,
        callback: () => {
          this.bindEvents({dialog});
          this.api.getUserInfo(type, id, (resp) => {
            this.loadPage(this.model.creator(type, resp));
          })
        }
      })
      dialog.create();
      return dialog;
    },
    initFrame({type, id, scope}) {
      var dom =  $(`<div style='position: absolute;z-index: 1;background-color: #fff;' id='audit_userinfo'>
        <style>
          #audit_userinfo {height: 280px;width: 302px;padding: 9px 14px;border: 1px solid #d5d5d5;background: #fff;box-shadow: 0.5px 0.866px 3px 0px #858585;color: #727272;font-family: 'Microsoft YaHei'}
          #audit_userinfo div.row {height: 32px;display: flex;font-size: 14px;align-items: center;}
          #audit_userinfo strong {width: 70px;}
          #audit_userinfo input {border: none;user-select: none;outline: none;font-size: inherit;color: inherit;padding-left: 13px;}
        </style>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL1')}:</strong><input id='audit_userinfo_value1' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL2')}:</strong><input id='audit_userinfo_value2' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL3')}:</strong><input id='audit_userinfo_value3' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL4')}:</strong><input id='audit_userinfo_value4' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL5')}:</strong><input id='audit_userinfo_value5' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL6')}:</strong><input id='audit_userinfo_value6' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL7')}:</strong><input id='audit_userinfo_value7' />
        </div class='row'>
        <div class='row'>
          <strong>${i18n('AUDIT_USERINFO_' + type.toUpperCase() + '_LABEL8')}:</strong><input id='audit_userinfo_value8' />
        </div class='row'>
      </div>`)
      $(document.body).append(dom);
      var scopeRec = scope.getBoundingClientRect()
      dom.css({
        top: scopeRec.top + 'px',
        left: scopeRec.right + 20 + 'px'
      })
      this.api.getUserInfo(type, id, (resp) => {
        this.loadPage(this.model.creator(type, resp));
      })
      $(scope).one('mouseout', function() {
        dom.remove()
      })
    },
    loadPage(data) {
      for (var i = 0; i < data.length; i++) {
        $('#audit_userinfo_value' + (i+1)).val(data[i]);
      }
    },
    bindEvents({dialog}) {
      $('#' + dialog.dialogId)
      .on('click', '._dialog_foot .btn.confirm', ({currentTarget, target}) => {
        if (target == currentTarget) {
          dialog.close();
        }
      })
      .on('click', '._dialog_title ._dialog_close', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close()
        }
      })
    }
  }
  var API = {
    getUserInfo(type, id, callback) {
      if (type == 'self') {
        return this.getAquaUserInfo(id, callback)
      } else {
        return this.getOtherUserInfo(id, callback)
      }
    },
    getAquaUserInfo(id, callback) {
      var method = 'Put',
      url = paasHost + '/aquapaas/rest/users/cdmi_query',
      {user_id, access_token} = my.paas,
      urlParam = [];
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('user_id=' + user_id)
      urlParam.push('access_token=' + access_token)
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
          user_scope_specification: [{user_id: '== ' + id}]
        })
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback(resp.users[0])
        }
      })
    },
    getOtherUserInfo(id, callback) {
      var method = 'Get',
      url = paasHost + '/aquapaas/rest/users/public',
      urlParam = [];
      urlParam.push('user_ids=' + id)
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      urlParam.push('user_id=' + my.paas.user_id)//用户授权
      urlParam.push('access_token=' + my.paas.access_token)//用户授权
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
          this.getOtherUserMetadata(resp[0], callback)
          // callback && callback(resp[0]);
        }
      })
    },
    getOtherUserMetadata(data, callback) {
      var method = 'Get',
      name = data.user_name,
      url = paasHost + '/aquapaas/rest/usertags/selfregadvuser/tags',
      urlParam = [];
      urlParam.push('user_name=' + name)
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      urlParam.push('user_id=' + my.paas.user_id)//用户授权
      urlParam.push('access_token=' + my.paas.access_token)//用户授权
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
          data.status = resp
          callback && callback(data);
        }
      })
    }
  }
  var Model = {
    creator(type, data) {
      switch (type) {
        case 'self':
          return this.self(data);
          break;
        default://自主广告主
          return this.others(data);
      }
    },
    self(data) {
      var ret = []
      var {metadata: {AquaPaaSAdv_CompanyName, AquaPaasAdv_LegalPerson, AquaPaaSAdv_Contact, AquaPaaSAdv_TelephoneNumber, AquaPaaSAdv_FaxNumber, AquaPaaSAdv_Email, AquaPaaSAdv_Address, AquaPaaSAdv_ContractEndDate}} = data
      ret.push(AquaPaaSAdv_CompanyName)
      ret.push(AquaPaasAdv_LegalPerson)
      ret.push(AquaPaaSAdv_Contact)
      ret.push(AquaPaaSAdv_TelephoneNumber)
      ret.push(AquaPaaSAdv_FaxNumber)
      ret.push(AquaPaaSAdv_Email)
      ret.push(AquaPaaSAdv_Address)
      ret.push(AquaPaaSAdv_ContractEndDate)
      return ret
    },
    others(data) {
      var ret = []
      var {metadata: {AquaPaaSAdv_MiniP_StoreName, AquaPaaSAdv_MiniP_Industry, AquaPaaSAdv_MiniP_ContactName, AquaPaaSAdv_MiniP_ContactPhone, AquaPaaSAdv_MiniP_Address, AquaPaaSAdv_MiniP_PromoCode},status} = data
      var isDebt = status.map(item => {
        if (item.name.toUpperCase() == 'DEBT') {
          return item.title
        } else {
          return null
        }
      }).filter(item => item).join('') || status.map(item => {
        if (item.name.toUpperCase() == 'NORMAL') {
          return item.title.slice(0,2)
        } else {
          return null
        }
      }).filter(item => item).join('')
      var isBanned = status.map(item => {
        if (item.name.toUpperCase() == 'BANNED') {
          return item.title
        } else {
          return null
        }
      }).filter(item => item).join('') || status.map(item => {
        if (item.name.toUpperCase() == 'NORMAL') {
          return item.title.slice(2)
        } else {
          return null
        }
      }).filter(item => item).join('')

      ret.push(AquaPaaSAdv_MiniP_StoreName)
      ret.push(AquaPaaSAdv_MiniP_Industry)
      ret.push(isDebt)
      ret.push(isBanned)
      ret.push(AquaPaaSAdv_MiniP_ContactName)
      ret.push(AquaPaaSAdv_MiniP_ContactPhone)
      ret.push(AquaPaaSAdv_MiniP_Address)
      ret.push(AquaPaaSAdv_MiniP_PromoCode)
      return ret
    }
  }
  return dialog;
}))
