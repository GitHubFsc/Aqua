(function(global, factory) {
  global.SUCAIFABU = factory(jQuery, StyledList, UserInfo, AuditHis)
  var app = new SUCAIFABU();
}(this, (function($, Table, UserInfo, AuditHis) {
  var Pane = {
    init() {
      var table = this.initTable();
      table.create();
      this.bindEvents(table);
    },
    initTable() {
      var table = new Table({
        rows: 11,
        columns: 5,
        containerId: 'sucaifabu_list',
        titles: [{
          label: i18n('SUCAIFABU_TABLE_NAME')
        }, {
          label: i18n('SUCAIFABU_TABLE_CREATOR')
        }, {
          label: i18n('SUCAIFABU_TABLE_SIZE')
        }, {
          label: i18n('SUCAIFABU_TABLE_WEIGHT')
        }, {
          label: i18n('SUCAIFABU_TABLE_OPR')
        }],
        listType: 1,
        async: true,
        styles: {
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 40,
          titleBg: '#5DA1C0',
          titleColor: '#FFFFFF',
          cellBg: '#FFFFFF',
          evenBg: '#F5F5F5',
          cellColor: '#949494',
          cellHeight: 40,
          footBg: '#FFFFFF',
          footColor: '#797979',
          iconColor: '#5DA1C0',
          inputBorder: '1px #CBCBCB solid',
          inputBg: '#FFFFFF',
          columnsWidth: [0.44, 0.15, 0.11, 0.08, 0.22]
        }
      })
      table.getPageData = (pageNumber, callback) => {
        var self = this,
            size = table.rowsLmt,
            start = (pageNumber - 1) * size,
            end = pageNumber * size - 1,
            name = $('#search_input input[name=search]').val()
        if (SUCAI_ENHANCE) {
        self.api.getList({name, start, end, callback: ({data, size}) => {
          table.onTotalCount(size)
          self.model.data = data
          callback && callback(self.model.list(data));
        }})
        } else {
          callback && callback([]);
        }
      }
      return table;
    },
    bindEvents(table) {
      var tableid = table.containerId
      // 素材发布
      $('#' + tableid)
      .on('click', '.opr [name=publish]', ({target, currentTarget}) => {
        //发布素材
        if (target == currentTarget) {
          var index = $(currentTarget).data('index'),
              data = this.model.data[index],
              {ad_id} = data
          var dialog = new SuCaiPublish({id: ad_id, done: () => {
            table.refreshList();
          }})
        }
      })
      .on('click', '[name=user]', ({target, currentTarget}) => {
        // 查看创建者
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
          data = this.model.data[index],
          {user_id, user_name} = data
          var dialog = new UserInfo({
            id: user_id,
            type: user_id == my.paas.user_id ? 'self': 'others',
            name: user_name,
            // isfloat: hoverstate ? hoverstate : false,
            isfloat: false,
            scope: currentTarget
          })
        }
      })
      .on('click', '.opr [name=audit_his]', ({currentTarget, target}) => {
        //查看审核历史
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
              data = this.model.data[index],
              {ad_id} = data
          var dialog = new AuditHis({
            type: 'ad_item',
            id: ad_id
          });
        }
      })
      .on('click', '.opr [name=view]', ({currentTarget, target}) => {
        // 查看素材
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
              data = this.model.data[index],
              {ad_id} = data;
          var app = new PreviewModel();
          app.previewSuCai(ad_id);
        }
      })
      $('#SuCaiFaBu')
      .on('keyup', '._frame_header #search_input input[name=search]', ({currentTarget, target, keyCode, which}) => {
        var key = keyCode || which
        if (currentTarget == target && key == 13) {
          table.refreshList();
          table.changePage('1')
        }
      })
      .on('click', '._frame_header #search_input div[name=btn]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          table.refreshList();
          table.changePage('1')
        }
      })
    }
  }
  var API = {
    getList({name, start, end, callback}) {
      var url = paasHost + paasAdvDomain + '/ads/aditem/aditems',
          urlParam = [],
          {platform_current_id, user_id, user_type, access_token, platform_current_id = ''} = my.paas
      urlParam.push('state=' + 'third_audit:prepare_audit')
      // urlParam.push('state=' + 'enabled')
      if (name) {
        urlParam.push('name=' + name)
      }
      urlParam.push('start=' + start)
      urlParam.push('end=' + end)
      if (platform_current_id) {
        urlParam.push('platform_id_list=' + platform_current_id)
      }
      urlParam.push('user_id=' + user_id)
      urlParam.push('user_type=' + user_type)
      urlParam.push('access_token=' + access_token)
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      url += '?' + urlParam.join('&')
      $.ajax({
        type: "GET",
        url: url,
        async: true,
        timeout: 1000,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
        }
      }).always((rsp, status, xhr) => {
        if (status == 'success') {
          var answer = rsp;
          var totalCount = xhr.getResponseHeader('x-aqua-total-count')
          callback && callback({data: answer, size: totalCount})
        } else {
          callback && callback({data: [], size: 0})
        }
      });
    }
  }
  var Model = {
    data:[],
    list(resp) {
      var ds = [];
      for (var i = 0, len = resp.length; i < len; i++) {
        var item = resp[i]
        var row = [];
        var {name, user_name, width, height, size, level, type} = item
        var creator = `<a name='user' style='text-decoration: underline;cursor: pointer;color: #3c94bb;' data-index='${i}'>${user_name}</a>`
        var op_view = `<a name='view' data-index='${i}'>${i18n('SUCAI_CHAKAN')}</a>`
        var op_audithis = `<a name='audit_his' data-index='${i}'>${i18n('ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS')}</a>`
        var op_publish = `<a name='publish' data-index='${i}'>${i18n('SUCAIFABU_TABLE_OPR_PUBLISH')}</a>`
        row.push({
          label: name
        }, {
          label: creator
        }, {
          label: type == 'img' ? [width, height].join('*') : size
        }, {
          label: level
        }, {
          label: ['<div class="opr">', op_view, op_audithis, op_publish, '</div>'].join('')
        })
        ds.push(row)
      }
      return ds;
    }
  }

  var frame = function() {
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    var pane = $.extend(true, {api, model}, Pane)
    pane.init();
  }
  return frame;
})))
