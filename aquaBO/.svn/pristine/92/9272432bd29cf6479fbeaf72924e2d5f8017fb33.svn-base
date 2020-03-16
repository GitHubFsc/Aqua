(function(global, factory) {
  global.AssetDel = factory(jQuery, StyledList, AlertDialog, newSelect)
})(this, (function($, Table, Alert, Combo){
  var frame = function() {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.api = api
    pane.model = model
    pane.init()
  }
  var Pane = {
    search: {
      'type': 'vod'
    },
    init(){
      var table = this.initTable();
      this.bindEvents({table});
      table.create();
    },
    initTable() {
      let title = [
        {label: `<div class="i-check"><input name="check" type="checkbox" ><label></label></div>`},
        {label: i18n("ASSET_SHELF_TABLE_PID")},
        {label: i18n("ASSET_SHELF_TABLE_PAID")},
        {label: i18n("ASSET_SHELF_TABLE_TITLE")},
        {label: i18n("ASSET_SHELF_TABLE_AFFECTIVE_TIME")},
        {label: i18n("ASSET_SHELF_TABLE_PATH")},
        {label: i18n("ASSET_SHELF_TABLE_STATUS")},
        {label: i18n("ASSET_SHELF_TABLE_OPR")}
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
        columnsWidth: [0.04, 0.08, 0.20, 0.17, 0.17, 0.22, 0.06, 0.06]
      }
      var table = new Table({
        containerId: "asset_del_list_table",
        rows: 15,
        columns: 8,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      table.getPageData = (pageNum, callback) => {
        this.api.getList({page: pageNum, size: table.rowsLmt, model: this.model.list, search: this.search}, (ret) => {
          var {count, tableset, data} = ret
          table.onTotalCount(count)
          this.model.data = data;
          callback && callback(tableset)
        })
      };
      return table
    },
    bindEvents({table}) {
      $('.asset_del._frame')
      .on('keypress', '.search_bar input', ({currentTarget, target, keyCode, which}) => {
        var key = keyCode || which
        if (currentTarget == target && key == 13) {
          var val = $(currentTarget).val()
          this.setSearch('title', val)
          table.refreshList();
          $(".list_table thead .i-check input").prop('checked', false);
        }
      })
      .on('click', '.search_bar .search_btn', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var val = $(currentTarget).prev().val()
          this.setSearch('title', val)
          table.refreshList();
          $(".list_table thead .i-check input").prop('checked', false);
        }
      })
      .on('click', '.header_item.btn[name=del]' , ({currentTarget, target}) => {
        if (currentTarget == target) {
          var selectedEl = $('.list_table tbody .i-check input:checked');
          var selects = [];
          for (var i = 0; i < selectedEl.length; i++) {
            selects.push(selectedEl[i])
          }
          var Del = (selects, callback) => {
            if (selects.length > 0) {
              var select = selects.pop();
              var index = $(select).data('index');
              var data = this.model.data[index];
              this.api.delete(data, () => {
                Del(selects, callback);
              })
            } else {
              callback && callback();
            }
          }
          Del(selects, () => {
            table.refreshList();
            $(".list_table thead .i-check input").prop('checked', false);
          })
        }
      })
      .on('click', '.list_table a[name=del]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index')
          var data = this.model.data[index], {title,name} = data;
          var maskId = 'mask_' + new Date().getTime();
          var mask = $("<div id='" + maskId + "'>");
          mask.css({
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'z-index': '4000',
            'background-color': 'rgba(0, 0, 0, 0.7)',
            'background-image': 'url(./images/asset/loading.gif)',
            'background-repeat': 'no-repeat',
            'background-position': 'center'
          })
          var dialog = new Alert({
            message: i18n('ASSET_ALERT_MSG').replace(/{{}}/, title||name),
            confirmFn: (callback) => {
              $(document.body).append(mask)
              this.api.delete(data, () => {
                mask.remove();
                callback && callback()
                table.refreshList();
                $(".list_table thead .i-check input").prop('checked', false);
              })
            }
          })
        }
      })
      //表头添加全选按钮
      .on('click', '.list_table thead .i-check input', ({ currentTarget, target }) => {
        if (currentTarget == target) {
            if ($(target).is(":checked")) {
                $(".list_table tbody .i-check input").prop('checked', true);
            } else {
                $(".list_table tbody .i-check input").prop('checked', false);
            }
        }
      })
      .on('click', '.list_table tbody .i-check input', ({currentTarget, target}) => {
        if (currentTarget == target) {
          // $(currentTarget).prop('checked', 'checked');
          if ($(target).is(":checked")) {
              if ($(".list_table tbody input[type='checkbox']:checked").length == $(".list_table tbody input[type='checkbox']").length){
                $(".list_table thead .i-check input").prop('checked', true);
              }
          } else {
              $(".list_table thead .i-check input").prop('checked', false);
          }
        }
      })
      // 类型过滤
      var combo = new Combo("#type_filter", [
        {key: i18n('ASSET_FILTER_SELECT_ALLKIND'), value: '0'},
        {key: i18n("ASSET_FILTER_SELECT_ASSET"), value: "1"},
        {key: i18n("ASSET_FILTER_SELECT_BUNDLE"), value: "2"},
        {key: i18n("ASSET_FILTER_SELECT_ALL"), value: "3"}
      ], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "34px",
        background: "#2EA2D7",
        selectbackground: "rgb(79, 184, 241)",
        color: '#fff',
        borderColor: ''
      }, (value) => {
        switch (value) {
          case '0':
          this.setSearch('type', 'vod')
          this.setSearch('missing_field', 'bundle_id')
            break;
          case '1':
          this.setSearch('type', 'asset')
          this.setSearch('missing_field', 'bundle_id')
            break;
          case '2':
          this.setSearch('type', 'bundle')
          this.setSearch('missing_field', '')
            break;
          default:
          this.setSearch('type', 'vod')
          this.setSearch('missing_field', '')
        }
        table.refreshList();
        $(".list_table thead .i-check input").prop('checked', false);
        table.changePage('1')
      });
    },
    setSearch(key, value) {
      if (value) {
        this.search[key] = value
      } else {
        delete this.search[key]
      }
    }
  }
  var API = {
    getList({page, size, model, search={}}, callback) {
      let method = 'Post';
      let url = aquapaas_host + '/aquapaas/rest/search/contents/' + search['type'];
      let opts = [],// search engine body中的不带查询的条件约束
          body = [],
          urlParam = [];
      urlParam.push("visible=false");
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push("start=" + (page - 1) * size)
      urlParam.push("end=" + (page * size - 1))
      for (var key in search) {
        if (key !== 'key') {
          urlParam.push([key, search[key]].join('='))
        }
      }
      // 系统用户权限
      if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {
        opts.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
      }
      var titles = (search['title']||'').split(',')
      for (var i = 0; i < titles.length; i++) {
        var title = titles[i]
        if (title) {
          body.push('title=' + title + '&title_op=lk&' + opts.join('&'))
        }
      }
      if (body.length == 0) {
        body.push(opts.join('&'))
      }
      body = body.filter(item => item)
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(body)
      }).always((resp, status, xhr) => {
        var count=0, data
        if (status == 'success') {
          count = parseInt(xhr.getResponseHeader('x-aqua-total-count'))
          data = resp
        } else {
          data= []
        }
        callback && callback({count: count, tableset: model(data), data: data})
      })
    },
    delete(data, callback) {
      var method = 'Delete',
          {doc_id, ispackage} = data,
          url = aquapaas_host + "/aquapaas/rest/asset/" + doc_id,
          isBundle = ispackage == 'Y' ? true: false,
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      if (isBundle) {
        urlParam.push('delete_sub_asset=true')//删除bundle时，添加入参以删除bundle下的asset
      }
      urlParam.push('delete_content=true')//物理删除需要添加的入参
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
        } else {
          console.log('Date',new Date().toISOString(),' log: delete content fail. reason is ', xhr);
          callback && callback();
        }
      })
    }
  }
  var Model = {
    list(data) {
      $(".list_table thead .i-check input").prop('checked', false);
      let dataset = [];
      try {
        for(var i = 0; i < data.length; i++) {
          let item = data[i];
          let row = [];
          let type = item.doc_type == 'asset' ? 'Asset' : 'Bundle';
          let pid = item.provider_id;
          let paid = item.provider_asset_id;
          let title = item.title || "";
          let affactive_time = convertTimeString(item.licensing_window_start);
          let path = item.category || "";
          let fullpath = Array.isArray(path) ? path.join() : path;
          let status = item.visible;
          let check_box = '<div class="i-check"><input name="check" type="checkbox" data-index="' + i + '"><label></label></div>';
          row.push({
            label: check_box
          })
          row.push({
            label: pid
          })
          row.push({
            label: paid
          })
          row.push({
            label: title
          })
          row.push({
            label: affactive_time
          })
          row.push({
            label: fullpath
          })
          row.push({
            label: i18n("ASSET_SHELF_TABLE_STATUS_" + String(status).toUpperCase())
          });
          let op_view = "<a name='view' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_VIEW") + "</a>";
          let op_assetTag = "<a name='assetTag' data-type='" + type + "' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_TAG") + "</a>";
          let op_edit = "<a name='edit' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_EDIT") + "</a>";
          let op_del = "<a name='del' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_EDL") + "</a>";
          let op_asset = "<a name='asset' style='" + (type == "Bundle" ? '' : 'display: none') + "'data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_ASSET") + "</a>";
          row.push({
            label: "<span>" + [op_del].join("") + "</span>"
          });
          dataset.push(row)
        }
      } catch(e) {
        console.error("http://www.baidu.com/s?wd=" + e.message);
      } finally {
        return dataset
      }
    }
  }
  return frame
}))
