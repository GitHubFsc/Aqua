/**
 * 节目列表-搜索
 */
((function(global, factory){
  global.node_search = factory(jQuery, StyledList, newSelect);
})(this, function($, Table, Combo) {
  var Pane = {
    init({el}) {
      var dom = `<div id='asset_search'>
      <style type='text/css'>
      #asset_search .btn-bar {display: flex;height: 38px;background-color: #1DB4DA;align-items: center;padding: 0 10px;color: #FFF;}
      #asset_search .btn-bar label {flex: 1;}
      #asset_search .btn-bar .btn {width: 93px;margin-right: 5px;}
      #asset_search .btn .select-status .select-header {background-image: url(./images/asset/arrow_down.png);line-height: 26px;font-size: 14px;background-position: 95% 12px;border: 1px solid #0074B0;border-radius: 3px;}
      #asset_search .btn .select-status .select-arrow {background-image: url(./images/asset/arrow_up.png);background-position: 95% 12px;}
      #asset_search .btn .select-status .select-content {border-color: #0074B0;}
      #asset_search .btn .select-status .select-content li {border-color: #0074B0;font-size: inherit;}
      #asset_search .btn-bar input {height: 30px;width: 196px;border: 1px solid #e2e2e2;padding-left: 10px;outline: none;}
      #asset_search .btn-bar .search.bar{height: 28px;border: 1px solid #e2e2e2;padding: 0 13px;line-height: 28px;color: #fff;font-size: 14px;margin: 0 10px;cursor: pointer;background-color:#2ea2d7;}
      </style>
                  <div class='btn-bar'>
                    <label>${i18n('ASSET_ASSET_LIST')}</label>
                    <input id='search_input' />
                    <div class='search bar'>${i18n('ASSET_ASSET_DIALOG_QUERY')}</div>
                    <div class='btn' id='genre'></div>
                    <div class='btn' id='year'></div>
                    <div class='btn' id='country_of_origin'></div>
                  </div>
                <div id='asset_search_table' class='list_table' style='margin: 0;'></div>
              </div>`
      $(el).empty().append($(dom))
      var table = this.initTable();
      this.initWidgets({table});
      this.bindEvents();
      table.create();
    },
    initTable() {
      let {type} = this;
      let title = [
        {label: ''},
        {label: i18n('NAVIGATE_EDITOR_ASSETTYPE')},
        {label: i18n('NAVIGATE_EDITOR_ASSETNAME')},
        {label: i18n('NAVIGATE_STATE')}
        ];
      let style = {
        borderColor: "#E2E2E2",
        borderWidth: 1,
        titleBg: "#45d1f4",
        titleColor: "#FFFFFF",
        titleHeight: 31,
        cellBg: "white",
        evenBg: "#F5FDFF",
        cellColor: "#797979",
        cellHeight: 34,
        footBg: "#FFFFFF",
        footColor: "#797979",
        inputBg: "#FFFFFF",
        inputBorder: "1px solid #CBCBCB",
        iconColor: "#0099CB",
        columnsWidth: [0.11, 0.28, 0.41, 0.2]
      }
      table = new Table({
        containerId: "asset_search_table",
        rows: 10,
        columns: 4,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      table.getPageData = (pageNum, callback) => {
        this.api.getList({
          page: pageNum,
          size: table.rowsLmt,
          model: this.model.table,
          search: this.search,
          callback: (resp) => {
            var {count, data, tableset} = resp
            table.onTotalCount(count);
            this.model.data = data;
            callback && callback(tableset);
          }
        })
      };
      return table;

    },
    initWidgets({table}) {
      var style = {
        backgroundIMGStyle: 2,
        width: '100%',
        height: "26px",
        background: "rgb(79, 184, 241)",
        selectbackground: "rgb(79, 184, 241)",
        color: '#fff',
        borderColor: '',
        ScrollBarHeight: 90
      }
      var genre = new Combo('#genre', this.model.properCombo('genre', this.api.getGenre()), style, (value) => {
        this.setSearch('genre', value);
        this.setSearch('genre_op', value ? 'eq' : '');
        table.refreshList();
        table.changePage('1');
      })
      var year = new Combo('#year', this.model.properCombo('year', this.api.getYear()), style, (value) => {
        this.setSearch('year', value);
        this.setSearch('year_op', value ? 'eq': '');
        table.refreshList();
        table.changePage('1');
      })
      var country_of_origin = new Combo('#country_of_origin', this.model.properCombo('area', this.api.getArea()), style, (value) => {
        this.setSearch('country_of_origin', value);
        this.setSearch('country_of_origin_op', value ? 'eq': '');
        table.refreshList();
        table.changePage('1');
      })
    },
    setSearch(key, val) {
      if(val !== "") {
        this.search[key] = val
      } else {
        delete this.search[key]
      }
    },
    bindEvents(){
      //模糊查询按键事件和点击事件
      $('#asset_search')
      .on('keyup', '#search_input', ({currentTarget, target, keyCode, which}) => {
        if (target ==currentTarget) {
          var key = keyCode || which
          if (key ==13) {
          this.setSearch('title', $(currentTarget).val());
          this.setSearch('title_op', $(currentTarget).val() ? 'lk': '');
          table.refreshList();
          table.changePage('1');
          }
        }
      })
      .on('click', '.search', ({currentTarget, target}) => {
        if (target ==currentTarget) {
          this.setSearch('title', $(currentTarget).siblings('input').val());
          this.setSearch('title_op', $(currentTarget).siblings('input').val() ? 'lk': '');
          table.refreshList();
          table.changePage('1');
        }
      }) 
    }
  };
  var API = {
    getList({page, size,model, search, callback}) {
      if (this.is_manual == false) {
        this.getAutoList({page, size,model: model.auto, search, callback})
      } else {
        this.getManualList({page, size,model: model.manual, search, callback})
      }
    },
    getManualList({page, size,model, search, callback}) {
      let method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/search/contents/vod',
          urlParam = [];
      urlParam.push('start=' + (page - 1) * size)
      urlParam.push('end=' + (page * size - 1))
      urlParam.push('visible=all')
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      for (var key in search) {
        urlParam.push([key, search[key]].join('='))
      }
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
        if (status == 'success') {
          var count = 0;
          count = xhr.getResponseHeader('x-aqua-total-count')
          callback && callback({count, data: resp, tableset: model(resp)})
        }
      })
    },
    getAutoList({page, size,inputval,model, search, callback}) {
      let method = 'Post',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + this.path + '/enhance',
          urlParam = []
          opts = [],
          body = [];
      // urlParam.push('start=' + (page - 1) * size)
      // urlParam.push('end=' + (page * size - 1))
      urlParam.push('visible=all')
      urlParam.push('children=1')
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('tree_version=00')
      for (var key in search) {
        opts.push([key, search[key]].join('='))
      }
      body.push(opts.join('&'))
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(body.filter(item => item))
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          var data = resp.children.filter(item => item.node_class !== 'folder').slice((page - 1) * size, page * size)
          var count = 0;
          count = resp.children_count
          callback && callback({count, data: data, tableset: model(data)})
        }
      })

    },
    getGenre() {
      return this.getProperty('genre')
    },
    getYear() {
      return this.getProperty('year')
    },
    getArea() {
      return this.getProperty('country_of_origin')
    },
    getProperty(type) {
      var method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/search/general/property_values/vod',
          urlParam = [],
          ret = {};
      urlParam.push('properties=' + type)
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          ret = resp
        }
      })
      return ret;
    }
  };
  var Model = {
    table: {
      auto(data) {
      var ds = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var row = [];
        row.push({
            label: item.index
          })
          row.push({
            label: i18n('ASSET_FILTER_SELECT_' + (item.metadata_public.entryType == '5' ? 'bundle': 'asset').toUpperCase())
          })
          row.push({
            label: item.name||item.title
          })
          row.push({
            label: i18n('ASSET_SHELF_TABLE_STATUS_' + String(item.enable).toUpperCase())
          })
          ds.push(row)
        }
        return ds;
      },
      manual(data) {
        var ds = [];
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var row = [];
          row.push({
          label: (i + 1)
        })
        row.push({
          label: i18n('ASSET_FILTER_SELECT_' + (item.ispackage == 'Y' ? 'bundle': 'asset').toUpperCase())
        })
        row.push({
          label: item.name
        })
        row.push({
          label: i18n('ASSET_SHELF_TABLE_STATUS_' + String(item.visible).toUpperCase())
        })
        ds.push(row)
      }
      return ds;
      }
    },
    properCombo(type, data) {
      var ret = [{key: i18n('NAVIGATION_' + type.toUpperCase()), value: ''}], values = data[0].values||[]
      for (var i = 0; i < values.length; i++) {
        var item = values[i]
        ret.push({
          key: item.value,
          value: item.value
        })
      }
      return ret
    }
  };
  function frame({el, type, parentNode, confirmFn, tree, node}) {
    var {is_manual, path} = parentNode;
    var search = {}, api_ops = {is_manual};
    if (is_manual == false) {
      api_ops['path'] = path;
    } else {
      search['tags'] = 'navpath:' + path + '/&tags_op=eq'
    }
    var api = $.extend(true, api_ops, API);
    var model = $.extend(true, {}, Model);
    var pane = $.extend(true, {api: api, model: model, search}, Pane)
    pane.init({el});
  }
  return frame;
}));