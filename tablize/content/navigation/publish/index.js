((function(global, factory) {
  global.NavPublish = factory(jQuery, StyledList, AlertDialog, NavPublishSet);
})(this, (function($, Table, Alert, NavPublishSet) {
  let NO_RIGHT = false;
  let TYPE = 'nav_tree'
  var frame = function(type) {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.api = api;
    pane.model = model
    if (type) {
      TYPE = type
    } else {
      TYPE = 'nav_tree'
    }
    pane.init();
  }
  var Pane = {
    search: {},
    init() {
      this.initSearch();
      var table = this.initTable()
      table.create();
      this.bindEvents(table);
    },
    initTable() {
      var table = new Table({
        containerId: TYPE+'_nav_publish_list_table',
        rows: 14,
        columns: 5,
        listType: 1,
        async: true,
        titles: [
          {label: i18n('NAVIGATIONAUDIT_TABLE_TREENAME')},
          {label: i18n('NAVIGATIONAUDIT_TABLE_VERSIONNAME')},
          {label: i18n('NAVIGATIONPUBLISH_TABLE_PASSTIME')},
          {label: i18n('NAVIGATIONAUDIT_TABLE_VERSION')},
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
        	columnsWidth: [0.26, 0.22, 0.22, 0.1, 0.21]
        }
      })
      table.getPageData = (pageNumber, callback) => {
        this.api.getList({page: pageNumber, search: this.search, model: this.model.list, size: table.rowsLmt}, (resp) => {
          var {data, totalCount, tableset} = resp
          table.onTotalCount(totalCount)
          this.model.data = data;
          callback && callback(tableset)
        })
      };
      return table
    },
    bindEvents(table) {
      //搜索事件
      $('#'+TYPE+'_nav_publish')
      .on('keypress', '.search_bar .search_input', ({keyCode, which, currentTarget, target}) => {
        var key = keyCode || which
        if (currentTarget == target && key == 13) {
          var val = $(currentTarget).val()
          this.setSearch('tree_name', val)
          table.refreshList();
          table.changePage('1')
        }
      })
      .on('click', '.search_bar .search_btn', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var val = $(currentTarget).prev().val()
          this.setSearch('tree_name', val)
          table.refreshList();
          table.changePage('1')
        }
      })
      .on('click', '.list_table span a[name=publish]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
              data = this.model.data[index]
          var dialog = new Alert({
            message: i18n('NAVIGATIONPUBLISH_PUBLISHHINT').replace(/{{}}/g, data.name),
            confirmFn: (callback) => {
              this.api.publish(data, () => {
                callback && callback();
                table.refreshList();
              })
            }
          })
        }
      })
      .on('click', '.list_table span a[name=publish_time]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
              data = this.model.data[index]
          var dialog = new NavPublishSet({
            id: 'Set-' + new Date().getTime(),
            confirmFn: (callback) => {
              callback && callback();
              console.log('pass:', data.name);
              table.refreshList();
            }
          })
        }
      })
    },
    setSearch(key, val) {
      NO_RIGHT = false;
      if (val) {
        if (key == 'tree_name') {
          if (my.paas.user.metadata.AquaBO_naviUserRight!=='') {//有权限设置的时候，只列出权限有的tree
            trees = my.paas.user.metadata.AquaBO_naviUserRight.split(',').filter(item => item)
            var search_val = val.split(',').filter(item => item).filter(item => trees.includes(item))
            if (search_val.length == 0) {
              NO_RIGHT = true
            } else {
              this.search[key] = search_val
            }
          } else {
        this.search[key] = val
          }
        }
      } else {
        if (key == 'tree_name' && my.paas.user.metadata.AquaBO_naviUserRight!=='') {
          this.initSearch();
      } else {
        delete this.search[key]
        }
      }
    },
    initSearch() {
      if (my.paas.user.metadata.AquaBO_naviUserRight!=='') {//有权限设置的时候，只列出权限有的tree
        trees = my.paas.user.metadata.AquaBO_naviUserRight.split(',').filter(item => item)
        this.setSearch('tree_name', trees.join(','))
      }
    }
  }
  var API = {
    getList({page, search, model, size}, callback) {
      if (NO_RIGHT) {
        callback && callback({data:[], totalSize: 0, tableset: Model.list([])})
        return;
      }
      var method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees',
          urlParam = [], {user_id, access_token} = my.paas, ret = {};
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('user_id=' + user_id)//用户级授权
      urlParam.push('access_token=' + access_token)//用户级授权
      // urlParam.push('audit_status=audit_passed')//审核通过的待发布树
      urlParam.push('release_status=allow-release')//审核通过的待发布树
      urlParam.push('start=' + (page - 1) * size)//分页
      urlParam.push('end=' + (page * size - 1))//分页
      urlParam.push('tree_class=' + TYPE)//树类型
      // 其他的查询条件
      for (var key in search) {
        if (search.hasOwnProperty(key)) {
          urlParam.push(key + '=' + search[key])
        }
      }
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
    publish(data, callback) {
      var method = 'Put',
          {id, metadata_public: {primary_tree_id}} = data,
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/release',
          urlParam = [];
      urlParam.push('tree_id=' + primary_tree_id)
      urlParam.push('release_tree_id=' + id)
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
        var {name, metadata_public: {version, audit_time, version_desc}} = dataset[i];
        var row = [];
        row.push({label: name})
        row.push({label: version_desc})
        row.push({label: convertTimeString(audit_time)})
        row.push({label: version})
        var op_fb = '<a name="publish" data-index="' + i + '">' + i18n('NAVIGATIONPUBLISH_TABLE_OP_PUBLISH') + '</a>'
        var op_dsfb = '<a name="publish_time" data-index="' + i + '">' + i18n('NAVIGATIONPUBLISH_TABLE_OP_PUBLISHTIME') + '</a>'
        row.push({
          label: ['<span>', op_fb, op_dsfb, '</span>'].join('')
        })
        set.push(row)
      }
      return set;
    }
  }
  return frame
})))
