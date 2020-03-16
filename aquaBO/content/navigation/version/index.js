((function(global, factory) {
  global.NavVersion = factory(jQuery, StyledList, Vers);
})(this, (function($, Table, Vers) {
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
        containerId: 'nav_version_list_table',
        rows: 14,
        columns: 4,
        listType: 1,
        async: true,
        titles: [
          {label: i18n('NAVIGATIONVERSION_TABLE_TREENAME')},
          {label: i18n('NAVIGATIONVERSION_TABLE_CURVER')},
          {label: i18n('NAVIGATIONVERSION_TABLE_VERTIME')},
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
        	columnsWidth: [0.32, 0.23, 0.25, 0.2]
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
      $('#nav_version')
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
      .on('click', '.list_table span a[name=view-vers]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
              data = this.model.data[index]
          var dialog = new Vers({
            id: 'vers-' + new Date().getTime(),
            name: data.name,
            callback: (change) => {
              if (change) {
                table.refreshList();
              }
            }
          })
          // console.log('view:', data.name);
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
      urlParam.push('release_status=released')//审核通过的已发布树
      urlParam.push('is_active_release=true')//审核通过的待发布树
      urlParam.push('start=' + (page - 1) * size)//分页
      urlParam.push('end=' + (page * size - 1))//分页
      urlParam.push('tree_class=' + TYPE)//树类型
      // 其他查询条件
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
    }
  }
  var Model = {
    list(dataset) {
      var set = [];
      for (var i = 0; i < dataset.length; i++) {
        var {name, metadata_public: {release_tree_version, release_time, version}} = dataset[i];
        var row = [];
        row.push({label: name})
        row.push({label: release_tree_version || version})
        row.push({label: convertTimeString(release_time)})
        var op_view = '<a name="view-vers" data-index="' + i + '">' + i18n('NAVIGATIONVERSION_TABLE_OP_CHANGEVER') + '</a>'
        row.push({
          label: ['<span>', op_view, '</span>'].join('')
        })
        set.push(row)
      }
      return set;
    }
  }
  return frame
})))
