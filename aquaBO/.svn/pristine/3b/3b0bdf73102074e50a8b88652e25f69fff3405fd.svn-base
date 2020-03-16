var AssetShelf = (function ($, Table, Dialog, Combo) {
  let Pane = {
    table: null,
    search: {'type': 'vod', 'name': ''},
    init() {
      this.initTable();
      this.bindEvents();
    },
    initTable() {
      let title = [
        {label:  `<div class="i-check"><input name="check" type="checkbox" ><label></label></div>`},
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
        columnsWidth: [0.03, 0.12, 0.12, 0.24, 0.14, 0.19, 0.07, 0.09]
      }
      Pane.table = new Table({
        containerId: "list_table",
        rows: 15,
        columns: 8,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      Pane.table.getPageData = API.getList;
      Pane.table.create();
    },
    bindEvents() {
      //输入框查询
      $(".asset_shelf .search_bar input.search_input").bind("keyup", (e)=>{
        let key = e.keyCode||e.which;
        if (key == 13) {
          let value = $(e.target).val();
          // Pane.search = value;
          Pane.setSearch('name', value)
          Pane.table.refreshList();
        }
      });
      //输入框查询按钮
      $(".asset_shelf .search_bar .search_btn").bind("click", (e)=>{
        let value = $(".asset_shelf .search_bar input.search_input").val();
        // Pane.search = value;
        Pane.setSearch('name', value)
        Pane.table.refreshList();
      });
      $('.asset_shelf')
      .on('click', '.header_item.btn[name=on_off]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var els = $('.asset_shelf #list_table tbody .i-check input:checked')
          var finish = [];
          for (var i = 0; i < els.length; i++) {
            var index = $(els[i]).data('index');
            let data = API.data[index];
            API.toggle(data, ()=>{
              finish.push(true)
              if (finish.length == els.length) {
                Pane.table.refreshList();
                $("#list_table thead .i-check input").prop('checked', false);
              }
            })
          }
        }
      })
      //列表操作栏
      $("#list_table")
      //表头添加全选按钮
      .on('click', 'thead .i-check input', ({ currentTarget, target }) => {
        if (currentTarget == target) {
            if ($(target).is(":checked")) {
                $("#list_table tbody .i-check input").prop('checked', true);
            } else {
                $("#list_table tbody .i-check input").prop('checked', false);
            }
        }
      })
      .on("click", "a[name=on]", (e) => {
        let el = $(e.target);
        let index = el.data("index");
        let data = API.data[index];
        let message = i18n("ASSET_SHELF_TABLE_OPR_SHELF_ON").replace(/{{}}/,data.name);
        let dialog  = new AlertDialog({
          message: message,
          confirmFn: (callback) =>{
            API.toggle(data, ()=>{
              Pane.table.refreshList();
              $("#list_table thead .i-check input").prop('checked', false);
              callback&&callback();
            })
          }
        });
      })
      .on("click", "a[name=off]", (e) => {
        let el = $(e.target);
        let index = el.data("index");
        let data = API.data[index];
        let message = i18n("ASSET_SHELF_TABLE_OPR_SHELF_OFF").replace(/{{}}/,data.name);
        let dialog  = new AlertDialog({
          message: message,
          confirmFn: (callback) => {
            API.toggle(data, ()=>{
              Pane.table.refreshList();
              $("#list_table thead .i-check input").prop('checked', false);
              callback&&callback();
            })
          }
        });
      })
      .on('click', 'tbody .i-check input', ({currentTarget, target}) => {
        if (currentTarget == target) {
          // $(currentTarget).prop('checked', 'checked');
          if ($(target).is(":checked")) {
              if ($("#list_table tbody input[type='checkbox']:checked").length == $("#list_table tbody input[type='checkbox']").length){
                $("#list_table thead .i-check input").prop('checked', true);
              }
          } else {
              $("#list_table thead .i-check input").prop('checked', false);
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
          Pane.setSearch('type', 'vod')
          Pane.setSearch('missing_field', 'bundle_id')
            break;
          case '1':
          Pane.setSearch('type', 'asset')
          Pane.setSearch('missing_field', 'bundle_id')
            break;
          case '2':
          Pane.setSearch('type', 'bundle')
          Pane.setSearch('missing_field', '')
            break;
          default:
          Pane.setSearch('type', 'vod')
          Pane.setSearch('missing_field', '')
        }
        Pane.table.refreshList();
        Pane.table.changePage('1')
      });
    },
    setSearch(key, value) {
      if (value) {
        this.search[key] = value
      } else {
        delete this.search[key]
      }
    }
  };
  let API = {
    data: [],
    getList(pageNum, callback) {
      let cb = (resp, status, xhr)=>{
        if(status == "success") {
          if (out_of_range) {
            API.data = [];
            Pane.table.onTotalCount(0);
            callback&&callback([]);
          } else {
          API.data = resp;
          Pane.table.onTotalCount(parseInt(xhr.getResponseHeader("x-aqua-total-count")));
          callback&&callback(Model.table(resp));
          }
        } else {
          callback&&callback([])
        }
      }
      // let url = aquapaas_host + "/aquapaas/rest/asset/assets";
      let url = aquapaas_host + "/aquapaas/rest/search/contents/" + Pane.search['type'];
      let method = 'Post';
      let opts = [], urlParam = [];
      urlParam.push("start=" + (pageNum - 1) * this.rowsLmt)
      urlParam.push("end=" + (pageNum* this.rowsLmt - 1));
      // opts.push("enabled=all");
      urlParam.push("visible=all");
      // opts.push("visible=all");
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('sort_by=licensing_window_start')//排序
      urlParam.push('sort_mode=d')
      if (Pane.search['missing_field']) {
        urlParam.push('missing_field=' + Pane.search['missing_field']);
      }
      // 申明两个变量，用来控制权限情况下的pid以及pid搜索标志符
      var pids=[], pid_op='in', out_of_range = false;
      if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//设置了权限时，根据权限显示需要显示的pid的内容
        pids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',')
        opts.push('provider_id=' + pids.join(',') + '&provider_id_op=' + pid_op)
      }
      var body = [],titles = Pane.search['name'].split(',')
      for (var i = 0; i < titles.length; i++) {
        var title = titles[i];
        if (title) {
          body.push('title=' + titles[i] + '&title_op=lk&' + opts.join('&'));
      }
      }
      if (body.length == 0) {
        body.push(opts.join('&'))
      }
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(body.filter(item => item))
      }).always(cb);
    },
    toggle(data, callback){
      var method = 'Put',
          {visible, doc_id, ispackage} = data,
          enabled = typeof visible == 'boolean' ? visible : (visible == 'true' ? true : false),
          asset_type = ispackage == 'Y' ? 'bundle' : 'asset'
          // url = aquapaas_host + "/aquapaas/rest/asset/" + data.id + "/"  + (data.enabled?"invisible":"visible"),
          url = aquapaas_host + '/aquapaas/rest/asset/' + doc_id + '/'  + (enabled ? 'invisible' : 'visible'),
          opts = []
      opts.push('app_key=' + paasAppKey)//应用级授权
      opts.push('timestamp=' + new Date().toISOString())//应用级授权
      url += '?' + opts.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr)=>{
        if (status == "success") {
          callback&&callback();
        } else {
          alert(decodeURIComponent(resp.getResponseHeader("x-aqua-error-message")));
        }
      })
    }
  };
  let Model = {
    table(data) {
      $("#list_table thead .i-check input").prop('checked', false);
      let dataset = [];
      try {
        for(var i = 0; i < data.length; i++) {
          let item = data[i];
          let row = [];
          let pid = item.provider_id||'';
          let paid = item.provider_asset_id||'';
          // let title = item.metadata&&item.metadata.Title||"";
          // let affective_time = convertTimeString(item.activatetime);
          // let path = item.metadata&&item.metadata.Category&&item.metadata.Category;
          // let fullpath = Array.isArray(path)?path.join(""):path;
          // let state = item.enabled;
          //更改接口后的数据获取
          let title = item.title;
          let affective_time = convertTimeString(item.licensing_window_start)
          let path = item.category;
          let fullpath = Array.isArray(path)?path.join(','):path
          let state = typeof item.visible == 'boolean' ? item.visible : (item.visible == 'true' ? true : false)
          let check_box = '<div class="i-check"><input name="check" type="checkbox" data-index="' + i + '"><label></label></div>';
          row.push({
            label: check_box
          })
          row.push({
            label: pid
          })
          row.push({
            label: "<div title='"+paid+"'>"+paid+"</div>"
          })
          row.push({
            label: title
          })
          row.push({
            label: affective_time
          })
          row.push({
            label: fullpath
          })
          row.push({
            label: i18n("ASSET_SHELF_TABLE_STATUS_" + String(state).toUpperCase())
          })

          let op_on = "<a name='on' data-index='" + i + "'>"+i18n("ASSET_SHELF_TABLE_STATUS_TRUE")+"</a>";
          let op_off = "<a name='off' data-index='" + i + "'>"+i18n("ASSET_SHELF_TABLE_STATUS_FALSE")+"</a>";
          if (state == false) {
          row.push({
            label: "<span>" + [op_on].join("") + "</span>"
          });
          } else {
            row.push({
              label: "<span>" + [op_off].join("") + "</span>"
            });
          }
          dataset.push(row)
        }
      } catch(e) {
        console.error("http://www.baidu.com/s?wd=" + e.message);
      } finally {
        return dataset
      }
    }
  };
  return {
    init() {
      Pane.init();
    }
  }
})(jQuery, StyledList, PopupDialog, newSelect)
