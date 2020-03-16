var navMng = (function($, Table){
  let NO_RIGHT = false;
  var Pane = {
    search: {},
    init(){
      let _this = Pane;
      _this.initSearch();
      _this.initTable();
      _this.bindEvents();
    },
    initTable(){
      let title = [
        {label: i18n('NAVIGATE_TREEID')},
        { label: i18n('NAVIGATE_TREE_NAME') },
        { label: i18n('NAVIGATE_ISPUBLIC') },
        { label: i18n('NAVIGATE_TREE_APP') },
        { label: i18n('NAVIGATE_CREATETIME') },
        { label: i18n('NAVIGATE_LASTMODIFYTIME') },
        { label: i18n('NAVIGATE_EDITOR_OPR') }
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
        columnsWidth: [0.14, 0.26, 0.06, 0.10, 0.14, 0.14, 0.16]
      }
      Pane.table = new Table({
        containerId: "navigation_list_table",
        rows: 15,
        columns: 7,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      Pane.table.getPageData = (pageNum, callback) => {
        API.getList(pageNum, Pane.table.rowsLmt, Pane.search, (ret) => {
          var {totalSize, tableset, data} = ret;
          Pane.table.onTotalCount(totalSize)
          API.data = data;
          callback && callback(tableset)
        });
      };
      Pane.table.create();
    },
    bindEvents() {
      // 列表-管理
      $('#navigation_list_table').on('click','.opr[name=mng]',(e) => {
        var index = $(e.currentTarget).data('index');
        var data = API.data[index];
        var dialog = new treeEditor({
          data: data
        })
      });
      // 列表-删除
      $('#navigation_list_table').on('click','.opr[name=del]',(e) => {
        var index = $(e.currentTarget).data('index');
        var data = API.data[index];
        var message = i18n('NAVIGATE_DEL').replace(/{{content}}/g, data.name);
        var dialog = new AlertDialog({
          message: message,
          confirmFn: (callback) => {
            API.delete(data, () => {
              callback && callback();
              Pane.table.refreshList();
            })
          }
        })
      })
      // 创建Tree
      $('.header_item#navigation_create_tree').on('click',() => {
        console.log('create tree');
        new createTree({
          el: '#navigation_nav_mng',
          confirmFn:() => {
            Pane.table.refreshList();
          }
        })
      })
      $('.header_item.search_bar')
        .on('keypress', '.search_input', ({currentTarget, target, which, keyCode}) => {
          var key = which || keyCode;
          if (key == 13 && currentTarget == target) {
            this.setSearch('tree_name', $(currentTarget).val())
            Pane.table.refreshList();
            Pane.table.changePage('1')
          }
        })
        .on('click', '.search_btn', ({currentTarget, target}) => {
          this.setSearch('tree_name', $(currentTarget).prev().val())
          Pane.table.refreshList();
          Pane.table.changePage('1')
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
  };
  var API = {
    data: [],
    getList(pageNum, size, search, callback) {
      if (NO_RIGHT) {
        callback && callback({data:[], totalSize: 0, tableset: Model.list([])})
        return;
      }
      var method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees',
          urlParam = []
      urlParam.push('is_primary=true')//只返回主树(主树就是正在编辑的树)
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('start=' + (pageNum - 1) * size)//分页
      urlParam.push('end=' + (pageNum * size - 1))//分页
      for (var key in search) {
        if (search.hasOwnProperty(key)) {
          urlParam.push(key + '=' + search[key])
        }
      }
      url += '?' + urlParam.join('&');
      $.ajax({
        type: method,
        url: url,
        async: true,
        dataType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          var ret = {};
          //根据权限过滤
            ret.data = resp
          ret.totalSize = parseInt(xhr.getResponseHeader('x-aqua-total-count'))
          ret.tableset = Model.list(ret.data)
          callback && callback(ret);
        }
      });
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
          API.delFolder(name, callback)
          // callback && callback ();
        } else {
          console.error(resp.getResponseHeader('x-aqua-error-code'), ':' + decodeURI(resp.getResponseHeader('x-aqua-error-message')||''))
        }
      })
    },
    delFolder(name, callback) {
      var {accessKeyId, secretAccessKey} = my.aqua;
      if (accessKeyId && secretAccessKey) {
      var aqua = new TicketAquaUtil({
          host: aqua_host,
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        domainURI: LOGIN_AQUA_DOMAIN_URI
      })
      aqua.getContainer({
        path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT + name
      }).delObj();
      }
      callback && callback();
    }
  };
  var Model = {
    list(dataset){
      let ret = [];
      for (var i = 0; i < dataset.length; i++) {
        var row = []
        var item = dataset[i];
        let {id, name, is_public, creator_app_key, create_time, last_modified_time} = item;
        row.push({
          label: "<input style='height: 100%;color: inherit;font-size: inherit;border: none;background: transparent;width: 100%;text-align: center;outline: none;' value='" + id + "' />"
        });
        row.push({
          label: name
        });
        row.push({
          label: i18n('NAVIGATION_' + String(is_public).toUpperCase())
        });
        row.push({
          label: creator_app_key
        });
        row.push({
          label: convertTimeString(create_time)
        });
        row.push({
          label: convertTimeString(last_modified_time)
        });
        var op_mng = '<a class="opr" name="mng" data-index="' + i + '">' + i18n('NAVIGATE_MANAGE') + '</a>';
        var op_del = '<a class="opr" name="del" data-index="' + i + '">' + i18n('OPS_DEL') + '</a>';
        row.push({
          label: ['<span>',op_mng,op_del,'</span>'].join('')
        });
        ret.push(row)
      }
      return ret;
    }
  };
  return {
    init: Pane.init
  }
})(jQuery, StyledList);
