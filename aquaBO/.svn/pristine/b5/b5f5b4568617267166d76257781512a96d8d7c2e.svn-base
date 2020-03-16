(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    exports.module = factory(jQuery, StyledList) :
    typeof define === 'function' && define.amd ?
    define(['jQuery', 'StyledList'], factory) : (global.node_audit = factory(jQuery, StyledList))
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
    },
    initFrame(el) {
      var dom = `<div class='bundle-pane'>
        <div id="audit_list" class="list_table"></div>
      </div>`;
      $(el).empty().append($(dom))
    },
    initTable({name}) {
      let {type} = Pane;
      let title = [
        {label: '' },
        {label: i18n('NAVIGATIONAUDIT_TABLE_VERSION')},
        {label: i18n('NAVIGATIONAUDIT_TABLE_VERSIONNAME')},
        {label: i18n('NAVIGATIONAUDIT_TABLE_VERSION_STATUS')}
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
        columnsWidth: [0.05, 0.26, 0.36, 0.33]
      }
        var table = new Table({
          containerId: "audit_list",
          rows: 11,
          columns: 4,
          titles: title,
          styles: style,
          async: true,
          listType: 1
        });
        table.getPageData = (pageNumber, callback) => {
          this.api.getList({page: pageNumber, name, model: this.model.list, size: table.rowsLmt}, (resp) => {
            var {data, totalCount, tableset} = resp
            table.onTotalCount(totalCount)
            this.model.data = data;
            callback && callback(tableset)
          })
        };
        return table;
        // this.api.list((data) => {
        //   table.update(this.model.list(data))
        // })
        // API.getNode();
    }
  }
  var API = {
    getList({page, name, model, size}, callback) {
      var method = 'Get',
          // url = aquapaas_host + '/aquapaas/rest/auditflow/instance/instances/nav_tree',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees',
          urlParam = [], {user_id, access_token} = my.paas, ret = {};
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('user_id=' + user_id)//用户级授权
      urlParam.push('access_token=' + access_token)//用户级授权
      urlParam.push('is_primary=false')//非主树
      urlParam.push('tree_name=' + name)
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
    }
  }
  var Model = {
    list(set) {
      var ret = [];
      for (var i = 0; i < set.length; i++) {
        var item = set[i]
        var row = [];
        var {metadata_public: {version,version_desc, audit_status, release_status, is_active_release}} = item
        row.push({
          label: i + 1
        }, {
          label: version
        }, {
          label: version_desc
        })
        var status = ''
        if (audit_status == 'deprecated') {
          status = i18n('NAVIGATIONAUDIT_DEPRECATED')
        } else if (audit_status == 'first_audit:prepare_audit') {
          status = i18n('NAVIGATIONAUDIT_PREPAREAUDIT')
        } else if (release_status == 'released') {
          if (is_active_release) {
            status = i18n('NAVIGATIONAUDIT_ISACTIVE')
          } else {
            status = i18n('NAVIGATIONAUDIT_RELEASED')
          }
        } else {
          status = i18n('NAVIGATIONAUDIT_PASSED')
        }
        row.push({
          label: status
        })
        ret.push(row)
      }
      return ret;
    }
  }
  return dialog
}))
