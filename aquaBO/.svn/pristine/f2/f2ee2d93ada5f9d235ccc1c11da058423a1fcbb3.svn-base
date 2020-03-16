(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    exports.module = factory(jQuery, StyledList) :
    typeof define === 'function' && define.amd ?
    define(['jQuery', 'StyledList'], factory) : (global.node_his = factory(jQuery, StyledList))
})(this, (function($, Table) {
  var dialog = function({el, parentNode, tree, path}) {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.api = api
    pane.model = model
    pane.init({el, name: tree.name})
  }
  var Pane = {
    init({el, name}) {
      this.initFrame(el);
      var table = this.initTable({name});
      table.create();
      this.bindEvents(table);
    },
    initFrame(el) {
      var dom = `<div class='bundle-pane'>
        <div id="his_list" class="list_table"></div>
      </div>`;
      $(el).empty().append($(dom))
    },
    initTable({name}) {
      let title = [
        {label: '' },
        {label: i18n('NAVIGATIONAUDIT_TABLE_VERSION')},
        {label: i18n('NAVIGATIONAUDIT_TABLE_VERSIONNAME')},
        {label: i18n('NAVIGATIONAUDIT_TABLE_RELEASETIME')},
        {label: i18n('TABLE_OP')}
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
        columnsWidth: [0.05, 0.26, 0.24, 0.29, 0.16]
      }
      var table = new Table({
        containerId: "his_list",
        rows: 11,
        columns: 5,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      table.getPageData = (pageNumber, callback) => {
        this.api.getList(pageNumber, name, this.model.list, (resp) => {
          var {data, totalCount, tableset} = resp
          table.onTotalCount(totalCount)
          this.model.data = data;
          callback && callback(tableset)
        })
      };
      return table;
    },
    bindEvents(table) {
      $('#his_list')
      .on('click', '[name=del]', ({target, currentTarget}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index')
          var data = this.model.data[index]
          var {name, metadata_public: {is_active_release}} = data;
          if (!is_active_release) {
            var dialog = new AlertDialog({
              message: i18n('NAVIGATE_DEL').replace(/{{content}}/, data.name),
              confirmFn: (callback) => {
                this.api.delete(data, () => {
                  callback && callback();
                table.refreshList();
                })
              }
            })
          }
        }
      })
    },
    refreshTable(table) {
      this.api.list((data) => {
        table.update(this.model.list(data))
      })
    }
  }
  var API = {
    getList(pageNumber, name, model, callback) {
      var method = 'Get',
          // url = aquapaas_host + '/aquapaas/rest/auditflow/instance/instances/nav_tree',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees',
          urlParam = [], {user_id, access_token} = my.paas, ret = {};
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('user_id=' + user_id)//用户级授权
      urlParam.push('access_token=' + access_token)//用户级授权
      urlParam.push('release_status=released')//审核通过的待发布树
      urlParam.push('tree_name=' + name)
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
    delete(data, callback) {
      var {name, metadata_public: {version}} = data,
      url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name,
      urlParam = [],
      method = 'Delete';
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      if (version) {
        urlParam.push('tree_version=' + version)
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
      }).always((resp, state, xhr) => {
        if (state == 'success') {
          callback && callback ();
        } else {
          console.error(resp.getResponseHeader('x-aqua-error-code'), ':' + decodeURI(resp.getResponseHeader('x-aqua-error-message')||''))
        }
      })
    }
  }
  var Model = {
    list(set) {
      this.data = set;
      var ret = [];
      for (var i = 0; i < set.length; i++) {
        var item = set[i]
        var row = [];
        var {metadata_public: {version, version_desc, release_time, is_active_release}} = item
        row.push({
          label: i + 1
        }, {
          label: version
        }, {
          label: version_desc
        }, {
          label: convertTimeString(release_time)
        })
        var op_del = '<a name="del" data-index="' + i + '" style="' + (is_active_release ? 'color: #797979;cursor: default' : '') + '">' + i18n('NAVIGATE_EDITOR_DEL') + '</a>'
        row.push({
          label: ['<span>', op_del, '</span>'].join('')
        })
        ret.push(row)
      }
      return ret;
    }
  }
  return dialog
}))
