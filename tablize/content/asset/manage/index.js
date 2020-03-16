/**
 * change log
 * @log 2019-09-10 中广电 需求更改
 * 1. 节目管理更改查询方式，四个输入框查询更改为弹出详情框查询。
 * 2. 增加checkbox column title
 * 3. 增加过滤条件
 * @log 2019-09-26 添加自定义列表
 */
var AssetManagement = (function ($, Table, Dialog, Combo, Switcher, Tree) {
  let Pane = {
    table: null,
    search: {type: 'vod', sort_by: 'd', visible: 'all'},
    init() {
      API.checked.length = 0;
      this.initTable();
      var widgets = this.initWidgets();
      this.bindEvents(widgets);
    },
    defaultFlexibleColumn: [
      {label: i18n("ASSET_TABLE_PID"), fixed: false, name: 'Provider_ID', type: 'string'},
      {label: i18n("ASSET_TABLE_PAID"), fixed: false, name: 'Provider_Asset_ID', type: 'string'},
      {label: i18n("ASSET_TABLE_TITLE"), fixed: false, name: 'Title', type: 'string'},
      {label: '<div name="sort" class="desc">' + i18n("ASSET_TABLE_AFFECTIVE") + '</div>', fixed: false, name: 'Licensing_Window_Start', type: 'date'}
    ],
    initTable(columns, curPage) {
      var isInited = false;
      let title = [
        {label: '<img src="./images/asset/check-icon.png">', fixed: true},
        {label: i18n("ASSET_TABLE_TYPE"), fixed: true},
        {label: i18n("ASSET_TABLE_PATH"), fixed: true},
        {label: i18n("ASSET_TABLE_STATUS"), fixed: true},
        {label: i18n("ASSET_TABLE_OPR"), fixed: true}
      ];
      title = title.slice(0, 2).concat(columns||this.defaultFlexibleColumn).concat(title.slice(2))
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
        iconColor: "#0099CB"
      }
      style.columnsWidth = [0.03, 0.07].concat(Array.apply(null, {length: title.length - 5}).map(item => 0.5 / (title.length - 5))).concat([0.17, 0.06, 0.17]);
      this.table = new Table({
        containerId: "asset_list_table",
        rows: 15,
        columns: title.length,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      this.table.getPageData = (pageNum, callback) => {
        API.getList({
          start: (pageNum - 1) * this.table.rowsLmt,
          end: (pageNum * this.table.rowsLmt - 1),
          search: Pane.search,
          callback: (resp) => {
            if (curPage && !isInited) {
              this.table.changePage(curPage)
            }
            isInited = true;
            callback && callback(resp);
          },
          model: (resp) => {
            return Model.table(columns || this.defaultFlexibleColumn, resp)
          }
        })
      };
      this.table.create();
      PanelMenu.onResize = () => {
        if ($('.asset_manage').length > 0) {
          this.table.resize();
        }
      }
    },
    initWidgets() {
      if (this.widgets) { } else {
        this.widgets = {};
        let filterData = [{
          key: i18n('ASSET_FILTER_SELECT_ALLKIND'),
          value: '0'
        }, {
          key: i18n("ASSET_FILTER_SELECT_ASSET"),
          value: "1"
        }, {
          key: i18n("ASSET_FILTER_SELECT_BUNDLE"),
          value: "2"
        }, {
          key: i18n("ASSET_FILTER_SELECT_ALL"),
          value: "3"
        }]
        let ComboStyle = {
          backgroundIMGStyle: 2,
          width: "100%",
          height: "26px",
          background: "rgb(79, 184, 241)",
          selectbackground: "rgb(79, 184, 241)",
          color: '#fff',
          borderColor: '',
          ScrollBarHeight: 136
        }
        this.widgets.filter = new Combo("#asset_type_filter", filterData, ComboStyle, (value) => {
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
          // Pane.setSearch('type',value)
          this.initTable();
        });
        this.widgets.filter.content.find("li:eq(0)").click();
        this.refreshCategoryFilter();
        //上下架过滤器
        this.widgets.visible = new Combo('#asset_visible_filter', Model.visible(), ComboStyle, (value) => {
          Pane.setSearch('visible', value)
          this.initTable();
        })
        //区域过滤器
        var area = API.getArea()
        this.widgets.area = new Combo('#asset_area_filter', Model.area(area), ComboStyle, (value) => {
          Pane.setSearch('country_of_origin', value)
          this.initTable();
        })
        //年份过滤器
        var year = API.getYear()
        this.widgets.year = new Combo('#asset_year_filter', Model.year(year), ComboStyle, (value) => {
          Pane.setSearch('year', value)
          this.initTable();
        })
        //CP过滤器
        var CP = API.getCP()
        this.widgets.CP = new Combo('#asset_cp_filter', Model.cp(CP), ComboStyle, (value) => {
          Pane.setSearch('provider', value)
          this.initTable();
        })
        //价格过滤器
        var price = API.getPrice()
        this.widgets.price = new Combo('#asset_price_filter', Model.price(price), ComboStyle, (value) => {
          Pane.setSearch('suggested_price', value)
          this.initTable();
        })
      }
    },
    refreshCategoryFilter(category) {
      $('#asset_category_filter').empty();
      this.widgets.category_filter = new Switcher({
        container: '#asset_category_filter',
        elements: [{
          label: category ? category : i18n('ASSET_CATEGORY_ALL'),
          dropdown: {
            align: 'right',
            content: function () {
              return Pane.initCategoryFilter();
            },
            getChangeListener: function (listener) {
              listener(jQuery("#asset_manage .category_filter")[0]);
            }
          },
          value() {
            var category = Tree.getZTreeObj("c_filter").getSelectedNodes()[0].getPath().map(item => item.name).join('\\')
            // return Tree.getZTreeObj("c_filter").getSelectedNodes()[0].name
            return category;
          }
        }],
        styles: {
          borderRadius: '3px'
        }
      });
      this.widgets.category_filter.create();
      this.widgets.category_filter.onChange = function (channels) {
        return Tree.getZTreeObj("c_filter").getSelectedNodes()[0].name
      };
    },
    bindEvents(widgets) {
      //输入框查询
      $('.asset_manage')
      // .on('keyup', '.search_bar .condition[name=title]', ({target, currentTarget, which, keyCode}) => {
      //   var key = which || keyCode
      //   if (target == currentTarget && key == 13) {
      //     var val = $(currentTarget).val();
      //     Pane.setSearch('title', val)
      //       Pane.initTable();
      //           }
      // })
      // .on('keyup', '.search_bar .condition[name=name]', ({target, currentTarget, which, keyCode}) => {
      //   var key = which || keyCode
      //   if (target == currentTarget && key == 13) {
      //     var val = $(currentTarget).val();
      //     Pane.setSearch('name', val)
      //       Pane.initTable();
      //         }
      // })
      // .on('keyup', '.search_bar .condition[name=pid]', ({target, currentTarget, which, keyCode}) => {
      //   var key = which || keyCode
      //   if (target == currentTarget && key == 13) {
      //     var val = $(currentTarget).val();
      //     Pane.setSearch('provider_id', val)
      //       Pane.initTable();
      //       }
      // })
      // .on('keyup', '.search_bar .condition[name=paid]', ({target, currentTarget, which, keyCode}) => {
      //   var key = which || keyCode
      //   if (target == currentTarget && key == 13) {
      //     var val = $(currentTarget).val();
      //     Pane.setSearch('provider_asset_id', val)
      //       Pane.initTable();
      //         }
      // })
      // .on('click', '.search_bar .btn', ({currentTarget, target}) => {
      //   if (target == currentTarget) {
      //     Pane.setSearch('title', $(currentTarget).siblings('[name=title]').val())
      //     Pane.setSearch('name', $(currentTarget).siblings('[name=name]').val())
      //     Pane.setSearch('provider_id', $(currentTarget).siblings('[name=pid]').val())
      //     Pane.setSearch('provider_asset_id', $(currentTarget).siblings('[name=paid]').val())
      //     Pane.initTable();
      //   }
      // })
      .on('click', '.search_bar', (e) => {
        if ($(e.currentTarget).find($(e.target)).length > 0 || $(e.currentTarget).is($(e.target))) {
          e.stopPropagation();
          SearchPane.init(e.currentTarget, (ret) => {
            var msg = SearchPane.message(ret)
            $('.asset_manage .search_bar .search_input').val(msg)
            $(e.currentTarget).data('data', JSON.stringify(ret))
            // 设置查询
            for (var key in ret) {
              if (ret.hasOwnProperty(key)) {
                Pane.setSearch(key, ret[key])
          }
          }
            Pane.initTable();
          });
          }
        })
      //批量设置节目标签
      $(".asset_manage._frame .header #batch_tag").bind("click", (e) => {
        let data = API.asset(API.checked);
        //to do 批量设置节目标签
        createCommonDialog_setTagForProduct("assetAndBundle", [], {}, {}, i18n("ASSET_TAG_LIB_PILIANGSHEZHI"), 638, "batchSet", API.checked);
      });
      //节目导出
      $('.asset_manage._frame .header #output').bind('click', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var url = API.output();
            if (url) {
            API.scan();
            var loading = new Loading({
              msg: i18n('ASSET_OUTPUT_LOADINGINFO'),
              timeout: 5 * 1000,
              callback: () => {
              window.open(url, "_blank", "toolbar=no, location=no,resizable=no, directories=no, width=400, height=400")
              }
            });
              } else {
                alert("you have no right to output assets of this provider_id");
              }
        }
      })
      //创建asset按钮
      $(".asset_manage._frame .header #create_asset").bind("click", (e) => {
        //todo
        let dialog = new AssetBundle({
          containerId: ".asset_manage",
          state: "create",
          type: "asset",
          closeFn: () => {
            Pane.table.refreshList();
          }
        });
      });
      //创建bundle按钮
      $(".asset_manage._frame .header #create_bundle").bind("click", (e) => {
        //todo
        let dialog = new AssetBundle({
          containerId: ".asset_manage",
          state: "create",
          type: "bundle",
          closeFn: () => {
            Pane.table.refreshList();
          }
        });
      });
      //列表操作
      $("#asset_list_table")
        .on("click", "input[name=check]", (e) => {//check_box
          let el = $(e.target);
          let index = el.data("index");
          let data = API.data[index];
          let checked = el.prop('checked');
          if (typeof index !== 'undefined') {
            API.checkData(checked, [data])
          } else {
            $("#asset_list_table input[type=checkbox]").prop('checked', checked)
            API.checkData(checked, API.data)
          }
        })
        .on("click", "a[name=view]", (e) => {//查看
          let el = $(e.target);
          let index = el.data("index");
          let data = API.asset([API.data[index]])[0];
          let dialog = new AssetBundle({
            containerId: ".asset_manage",
            state: "view",
            data: data
          });
        })
        .on("click", "a[name=assetTag]", (e) => {
          let el = $(e.target);
          let index = el.data("index");
          let data = API.data[index];
          let asset = API.asset([data])[0];
          asset_tags_dialog(asset, data.doc_type, data)
        })
        .on("click", "a[name=edit]", (e) => {
          let el = $(e.target);
          let index = el.data("index");
          let data = API.asset([API.data[index]])[0];
          let dialog = new AssetBundle({
            containerId: ".asset_manage",
            state: "edit",
            data: data,
            closeFn: () => {
              Pane.table.refreshList();
            }
          });
        })
        .on("click", "a[name=asset]", (e) => {
          let el = $(e.target);
          let index = el.data("index");
          let data = API.asset([API.data[index]])[0];
          let dialog = new assetList({
            el: '#tabs_content .asset_manage',
            data: data
          })
        })
        .on("click", "a[name=del]", (e) => {
          let el = $(e.target);
          let index = el.data("index");
          let data = API.asset([API.data[index]])[0];
          let msg = i18n("ASSET_ALERT_MSG").replace(/{{}}/, data.id);
          var dialog = new AlertDialog({
            message: msg,
            confirmFn: (callback) => {
              API.delete(data, () => {
                Pane.table.refreshList();
                callback && callback();
              })
            }
          })
        })
      .on('click', 'a[name=content]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var index = $(currentTarget).data('index'),
              data = API.data[index],
              {provider_id, provider_asset_id, title} = data
          var dialog = new AssetContent({
            container: '#page_container .asset_manage',
            provider_id,
            provider_asset_id,
            title
          })
        }
      })
        .on('click', 'thead [name=sort]', ({ currentTarget, target }) => {
          if (target == currentTarget) {
            var sort = $(currentTarget).hasClass('desc');
            if (sort) {
              $(currentTarget).removeClass('desc')
              Pane.setSearch('sort_by', 'a')
            } else {
              $(currentTarget).addClass('desc')
              Pane.setSearch('sort_by', 'd')
            }
            Pane.table.refreshList();
          }
        })
      .on('click', 'img[src$="check-icon.png"]', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var titles = Pane.table.titles
          var tableDefiner = new TableDefiner(titles, (columns) => {
            this.defaultFlexibleColumn = columns;
            Pane.initTable(columns, Pane.table.currPage)
          })
        }
      })
    },
    initCategoryFilter() {
      let _this = this;
      let ctn = document.createElement('ul');
      ctn.className = 'category_filter zTree';
      ctn.id = 'c_filter'
      let category = API.category();
      Tree.init($(ctn), {
        callback: {
          beforeClick(treeId, treeNode, clickFlag) {
            return (treeNode.click != false);
          },
          onClick: (event, treeId, treeNode) => {
            // if(treeNode && !treeNode.isParent) {
            //2019-03-14更改category的请求条件带上他的路径。例如：category=apple --> category=fruit\apple
            var nodePath = treeNode.getPath().map(item => item.name == i18n('ASSET_CATEGORY_ALL') ? '' : item.name).join('\\')
            _this.setSearch('category', nodePath)
            _this.initTable();
            _this.refreshCategoryFilter(nodePath)
            // } else {
            //   var zTree = Tree.getZTreeObj("c_filter");
            //   zTree.expandNode(treeNode);
            // }
          }
        }
      }, category);
      return ctn;
    },
    setSearch(key, val) {
      if (val !== "") {
        // if(Pane.search.find(key, 2, 'key') !== null) {
        //   for(var i = 0; i < Pane.search.length; i++) {
        //     if(Pane.search[i].key == key) {
        //       Pane.search[i].value = encodeURIComponent(val);
        //     }
        //   }
        // } else {
        //   Pane.search.push({
        //     key: key,
        //     value: encodeURIComponent(val)
        //   });
        // }
        Pane.search[key] = val
      } else {
        // for(var i = 0; i < Pane.search.length; i++) {
        //   if(Pane.search[i].key == key) {
        //     Pane.search[i].value = '';
        //   }
        // }
        delete Pane.search[key]
      }
    }
  };
  let API = {
    data: [],
    category: [],
    checked: [],
    getList({start, end, search, model, callback}) {
      let type = search['type'];
      let visible = search['visible'];
      let method = 'Post';
      let url = aquapaas_host + "/aquapaas/rest/search/contents/" + type;
      let opts = [], body = [], urlParam = [];
      urlParam.push("start=" + start)
      urlParam.push("end=" + end)
      urlParam.push("visible=" + visible);
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      if(search['missing_field']) {
        urlParam.push('missing_field=' + search['missing_field'])
      }
      // 申明两个变量，用来控制权限情况下的pid以及pid搜索标志
      var pids = [], pid_op = 'in', out_of_range = false;
      if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//设置了权限时，根据权限显示需要显示的pid的内容
        pids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',')
        // opts.push('provider_id=' + pids.join(',') + '&provider_id_op=in')
      }
      for(var key in search) {
        let value = search[key];
        switch (key) {
          case 'sort_by':
            urlParam.push('sort_by=licensing_window_start&sort_mode=' + value)
            break;
          case 'content_available':
            opts.push(key + '=' + value + '&' + key + '_op=eq')
            break;
          case 'type':
            break;
          case 'provider_id':
            if ((pids.length > 0 && pids.includes(value)) || pids.length == 0) {
              pids = [value]
            } else {
              out_of_range = true
            }
            break;
          case 'provider_asset_id':
            opts.push(key + '=' + value + '&' + key + '_op=in')
            break;
          case 'create_time':
            opts.push(key + '=' + value + '&' + key + '_op=bt');
            break;
          case 'title':
          case 'missing_field':
          case 'visible':
            break;
          case 'country_of_origin':
          case 'year':
          case 'provider':
          case 'suggested_price':
            opts.push(key + '=' + value + '&' + key + '_op=eq')
            break;
          default:
            opts.push(key + '=' + value + '&' + key + '_op=lk')
        }
      }
      if (pids.length > 0) {
        opts.push('provider_id=' + pids.join(',') + '&provider_id_op=' + pid_op)
      }
      var titles = search['title'] && search['title'].split(',') || []
      for (var i = 0; i < titles.length; i++) {
        var title = titles[i]
        body.push('title=' + title + '&title_op=lk&' + opts.join('&'))
      }
      if (body.length == 0) {
        body.push(opts.join('&'))
      }
      url += '?' + urlParam.join('&');

      $.ajax({
        method: method,
        url: url,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(body.filter(item => item))
      }).always((resp, status, xhr) => {
        if (status == "success") {
          if (out_of_range) {
            callback && callback(Model.table([]))
          } else {
            API.data = resp;
            Pane.table.onTotalCount(parseInt(xhr.getResponseHeader("x-aqua-total-count")));
          callback && callback(model(resp));
          }
        } else {
          callback && callback([])
        }
      });
    },
    delete(data, callback) {
      var url = aquapaas_host + "/aquapaas/rest/asset/" + data.id + "?" + API.getToken('app')
      $.ajax({
        type: "delete",
        url: url,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('delete', url)
        }
      }).always((resp, status, xhr) => {
        if (status == "success") {
          callback && callback();
        }
      })
    },
    asset(dataset) {
      let ret = [];
      for (var i = 0; i < dataset.length; i++) {
        let data = dataset[i];
        if (typeof data.provider_id !== 'undefined' && typeof data.provider_asset_id !== 'undefined') {
          $.ajax({
            type: 'Get',
            url: aquapaas_host + '/aquapaas/rest/asset/' + data.provider_id + '_' + data.provider_asset_id,
            async: false,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).always((resp, status, xhr) => {
            if (status == 'success') {
              ret.push(resp)
            }
          })
        }
      }
      return ret;
    },
    checkData(add, datasets) {
      for (var i = 0; i < datasets.length; i++) {
        let item = datasets[i];
        let exist = this.checked.find(item.doc_id, 2, 'doc_id') !== null ? true : false;
        if (exist ^ add) {
          this.checked[add ? 'push' : 'remove'](this.checked.find(item.doc_id, 2, 'doc_id') || item)
        }
      }
    },
    category() {
      var ret = [];
      jQuery.ajax({
        type: 'Get',
        async: false,
        url: aquapaas_host + '/aquapaas/rest/search/general/property_values/vod?properties=category',
        dataType: 'json'
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          ret = Model.category(resp[0].values)
        }
      });
      return ret;
    },
    getToken(type) {
      var ret;
      switch (type) {
        case 'app':
          ret = 'app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
          break;
        case 'user':
          ret += 'user_id=' + my.paas.user_id + '&access_token=' + my.paas.access_token;
          break;
        default:

      }
      return ret;
    },
    isChecked(data) {
      return API.checked.find(data.doc_id, 2, 'doc_id') !== null ? true : false;
    },
    /**
     * 导出数据前同步job_aquapaas_host
     */
    scan(callback){
        var url = aquapaas_host + '/aquapaas/rest/asset/job/state/scan',
            method = 'Post',
            urlParam = [],
            obj=[];
        var providerid = Pane.search['provider_id'] || '';
        var authoPids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',').filter(item => item != '');
        if (authoPids.length > 0) {//有限权限
          if (providerid) {
            if (authoPids.includes(providerid)) {
              urlParam.push('provider_id=' + providerid);
            }
          } else {
            urlParam.push('provider_id=' + authoPids.join(','))
          }
        } else {
          if (providerid) {
            urlParam.push('provider_id=' + providerid)
          }
        };
        urlParam.push("mode=all");
        urlParam.push("app_key=" + paasAppKey),//应用级授权
        urlParam.push("timestamp=" + new Date().toISOString());//应用级授权
        url += '?' + urlParam.join("&");
        $.ajax({
          type: method,
          url: url,
          async: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(obj)
        }).always((resp, status, xhr) => {

        })
    },
    output() {
      var ret = aquapaas_host + '/aquapaas/rest/asset/report';
      var providerid = Pane.search['provider_id'] || '';
      var authoPids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',').filter(item => item != '');
      if (authoPids.length > 0) {//有限权限
        if (providerid) {
          if (authoPids.includes(providerid)) {
            ret += '?provider_id=' + providerid;
          } else {
            ret = '';
          }
        } else {
          ret += '?provider_id=' + authoPids.join(',');
        }
      } else {
        if (providerid) {
          ret += '?provider_id=' + providerid;
        }
      }
      return ret;
    },
    getArea() {
      return this.getProperty('country_of_origin')
    },
    getYear() {
      return this.getProperty('year')
    },
    getCP() {
      return this.getProperty('provider')
    },
    getPrice() {
      return this.getProperty('suggested_price')
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
    },
    getAssetDef(callback) {
      var method = 'Get'
        $.ajax({
          type: method,
          url: aquapaas_host + '/aquapaas/rest/assetdef/metadata/asset',
          async: false,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }).always((resp, status) => {
          if(status == "success") {
            callback && callback(resp)
          }
        });
    }
  };
  let Model = {
    table(column, data) {
      let dataset = [];
      try {
        for (var i = 0; i < data.length; i++) {
          let item = data[i];
          let row = [];
          let type = item.doc_type == 'asset' ? 'Asset' : 'Bundle';
          let typeLabel = i18n('ASSET_FILTER_SELECT_' + type.toUpperCase());
            //
            // let pid = item.provider_id;
            // let paid = item.provider_asset_id;
            // let title = item.title || "";
            // let affactive_time = convertTimeString(item.licensing_window_start);
            //
          let path = item.category || "";
          let fullpath = Array.isArray(path) ? path.join() : path;
          let status = item.visible;
          let check_box = '<div class="i-check"><input name="check" type="checkbox" data-index="' + i + '" ' + (API.isChecked(item) ? 'checked' : '') + '><label></label></div>';
          row.push({
            label: check_box
          })
          row.push({
            label: typeLabel
          })
            //自动加载
            for (var j = 0; j < column.length; j++) {
              var jtem = column[j]
              var key = jtem.name.toLowerCase()
              var key_type = jtem.type
              var value = (key_type == 'date' ? convertTimeString(item[key]) : item[key])||''
          row.push({
                label: '<div title=' + value + '>' + value + '</div>'
          })
            }
          row.push({
            label: fullpath
          })
          row.push({
            label: i18n("ASSET_SHELF_TABLE_STATUS_" + String(status).toUpperCase())
          });
          let op_view = "<a name='view' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_VIEW") + "</a>";
            let op_content = "<a name='content' style='" + (type == "Bundle" ? 'display: none' : '') + "' data-index='" + i + "'>" + i18n('ASSET_TABLE_OPR_CONTENT') + "</a>"
          let op_assetTag = "<a name='assetTag' data-type='" + type + "' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_TAG") + "</a>";
          let op_edit = "<a name='edit' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_EDIT") + "</a>";
          let op_del = "<a name='del' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_EDL") + "</a>";
          let op_asset = "<a name='asset' style='" + (type == "Bundle" ? '' : 'display: none') + "'data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_ASSET") + "</a>";
          row.push({
              label: "<span>" + [op_view, op_content, op_asset, op_assetTag, op_edit].join("") + "</span>"
          });
          dataset.push(row)
        }
      } catch (e) {
        console.error("http://www.baidu.com/s?wd=" + e.message);
      } finally {
        return dataset
      }
    },
    category(data) {
      let dataset = [{
        name: 'category',
        isParent: true,
        children: [{
          name: i18n('ASSET_CATEGORY_ALL'),
          children: [],
          isParent: false
        }]
      }];
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (/^(\\[^\\]+)+$/g.test(item.value)) {
          let nodes = item.value.split('\\').slice(1);
          addNode(dataset[0], nodes);
        }
      }

      function addNode(node, list) {
        if (list.length > 0) {
          let child = list[0];
          if (node.children.find(child, 2, 'name') == null) {
            node.children.push({
              name: child,
              children: [],
              isParent: true
            })
          }
          if (node.isParent == false && node.children.length > 0) {
            node.isParent = true
          }
          addNode(node.children.find(child, 2, 'name'), list.slice(1))
        } else {
          if (node.children.length == 0) {
            node.isParent = false;
          }
        }
      }
      return dataset[0].children;
      },
      visible() {
        var visible = [{
          key: i18n('ASSET_FILTER_SELECT_ALL'),
          value: 'all'
        }, {
          key: i18n('NAVIGATE_EDITOR_SHELFON'),
          value: 'true'
        }, {
          key: i18n('NAVIGATE_EDITOR_SHELFOFF'),
          value: 'false'
        }]
        return this.defaultCombo(visible);
      },
      area(resp) {
        var area = [{
          key: i18n('ASSET_FILTER_AREA_SELECT_ALL'),
          value: ''
        }], dataset = resp[0].values
        for (var i = 0; i < dataset.length; i++) {
          var item = dataset[i];
          area.push({
            key: item.value,
            value: item.value
          })
        }
        return this.defaultCombo(area);
      },
      year(resp) {
        var year = [{
          key: i18n('ASSET_FILTER_YEAR_SELECT_ALL'),
          value: ''
        }], dataset = resp[0].values
        for (var i = 0; i < dataset.length; i++) {
          var item = dataset[i];
          year.push({
            key: item.value,
            value: item.value
          })
        }
        return this.defaultCombo(year);
      },
      cp(resp) {
        var cp = [{
          key: i18n('ASSET_FILTER_CP_SELECT_ALL'),
          value: ''
        }], dataset = resp[0].values
        for (var i = 0; i < dataset.length; i++) {
          var item = dataset[i];
          cp.push({
            key: item.value,
            value: item.value
          })
        }
        return this.defaultCombo(cp);
      },
      price(resp){
        var price = [{
          key: i18n('ASSET_FILTER_PRICE_SELECT_ALL'),
          value: ''
        }], dataset = resp[0].values
        for (var i = 0; i < dataset.length; i++) {
          var item = dataset[i];
          price.push({
            key: item.value,
            value: item.value
          })
        }
        return this.defaultCombo(price);
      },
      defaultCombo(dataset) {
        var ret = [];
        for (var i = 0; i < dataset.length; i++) {
          var item = dataset[i]
          ret.push({
            key: item.key,
            value: item.value
          })
        }
        return ret;
    }
  };
  var SearchPane = {
    init(target, callback) {
      var isExist = $('[id^=search-pane]').length > 0 ? true : false
      if (isExist) {
        $('[id^=search-pane]').remove();
      } else {
      var pane = this.initFrame(target);
      var widgets = this.initWidgets();
      this.loadData(target, pane, widgets);
      this.bindEvents(pane, widgets, callback);
      }
    },
    initFrame(target) {
      var dom = `<div id='search-pane' style='position: absolute;z-index: 1000;border: 1px solid #177BA9;background-color: #FFFFFF;width: 646px;height: 349px;padding-top: 20px;' class='_dialog'>
        <style>
          ._dialog_row {justify-content: space-between;padding: 0 23px 0 16px;margin-bottom: 10px;}
          ._dialog_col {width: 274px;color: #797979;}
          ._dialog_col label {margin-left: 0;font-size: 14px;color: inherit;}
          ._dialog_col input {width: 100%;height: 30px;padding-left: 10px;}
          ._dialog_row .time_picker {width: 177px;height: 30px;}
          ._dialog_foot {height: 50px;margin-bottom: 0px;font-size: 14px;align-items: center;}
          ._dialog_foot .btn {width: auto;height: 30px;line-height: 30px;padding: 0 10px;}
          ._dialog_foot .reset {color: #177BA9;}
        </style>
        <div class='_dialog_row'>
          <div class='_dialog_col'>
            <label>${i18n('ASSET_INPUT_PLACEHOLDER_TITLE')}</label>
            <input name='title'/>
          </div>
          <div class='_dialog_col'>
            <label>${i18n('ASSET_INPUT_PLACEHOLDER_NAME')}</label>
            <input name='name'/>
          </div>
        </div>
        <div class='_dialog_row'>
          <div class='_dialog_col'>
            <label>${i18n('ASSET_INPUT_PLACEHOLDER_PID')}</label>
            <input class='_dialog_col' name='provider_id'/>
          </div>
          <div class='_dialog_col'>
            <label>${i18n('ASSET_INPUT_PLACEHOLDER_PAID')}</label>
            <input class='_dialog_col' name='provider_asset_id'/>
          </div>
        </div>
        <div class='_dialog_row'>
          <div class='_dialog_col'>
            <label>${i18n('ASSET_FILTER_CONTENT_AVAILABLE')}</label>
            <div class='combo' id='content_available_filter'></div>
          </div>
        </div>
        <div class='_dialog_row'>
          <div class='_dialog_col'>
            <label>${i18n('ASSET_INPUT_PLACEHOLDER_CREATETIME')}</label>
          </div>
        </div>
        <div class='_dialog_row' style='justify-content: normal;'>
          <div class='time_picker' id='time_picker_start'></div>
          <label style='flex: none;padding: 0 9px;'>-</label>
          <div class='time_picker' id='time_picker_end'></div>
        </div>
        <div style='width: calc(100% - 18px);margin: 0 9px;height: 1px;border-top: 1px solid #DEDEDE;margin-top: 10px;'></div>
        <div class='_dialog_foot'>
          <a class='reset'>${i18n('JOBMANAGE_RESET')}</a>
          <div class='btn confirm'>${i18n('ASSET_SEARCH')}</div>
        </div>
      </div>`
      var pane = $(dom)
      var targetRect = target.getBoundingClientRect()
      pane.css({
        'top': targetRect.bottom + 4,
        'left': targetRect.left
      })
      $(document.body).append(pane)
      return pane;
    },
    initWidgets() {
      var calendarStyles = {
        width: 200,
        navTitleHeight: 20,
        navTitleBgColor: '#0f84a1',
        datesViewHeight: 150,
        datesViewGridColor: '#e2e2e2',
        datesViewCellColor: '#ffffff',
        weekdaysHeight: 20,
        weekdaysColor: '#000000',
        currMonthColor: '#737373',
        nonCurrMonthColor: '#e2e2e2'
      }
      var ts = new DatePicker({
        containerId: 'time_picker_start',
        calendarStyles: calendarStyles,
        initDate: '',
        dateInputStyles: {},
        editable: true
      })
      var te = new DatePicker({
        containerId: 'time_picker_end',
        calendarStyles: calendarStyles,
        initDate: '',
        dateInputStyles: {},
        editable: true
      })
      var content_available_array = [{
        key: i18n('ASSET_FILTER_CONTENT_AVAILABLE_SELECT_ALL'),
        value: ''
      }, {
        key: i18n('ASSETCONTENT_TABLE_AVAILABLE_TRUE'),
        value: true
      }, {
        key: i18n('ASSETCONTENT_TABLE_AVAILABLE_FALSE'),
        value: false
      }];
      var content_available = new Combo('#content_available_filter', content_available_array, {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "26px",
        background: "#FFF",
        selectbackground: "#FFF",
        color: '#797979',
        borderColor: '',
        ScrollBarHeight: 136
      }, (value) => {
      })
      return {ts, te, content_available}
    },
    bindEvents(pane, widgets, callback) {
      pane
      .on('click', '*', (e) => {
        e.stopPropagation();
      })
      .on('click', '._dialog_foot .btn.confirm', () => {
        var data = this.getData(pane, widgets);
        callback (data)
        pane.remove()
      })
      .on('click', '._dialog_foot .reset', () => {
        callback({
          title: '',
          name: '',
          provider_id: '',
          provider_asset_id: '',
          create_time: '',
          content_available: ''
        })
        pane.remove();
      })
      var remove = (e) => {
        if (!($(e.target).attr('id') && $(e.target).attr('id').indexOf('time_picker') == 0)) {
          pane.remove()
          $(document.body).unbind('click', remove)
        }
      }
      $(document.body).bind('click', remove)
    },
    getData(pane, widgets) {
      var title = pane.find('[name=title]').val();
      var name = pane.find('[name=name]').val();
      var provider_id = pane.find('[name=provider_id]').val();
      var provider_asset_id = pane.find('[name=provider_asset_id]').val();
      var d_s = widgets.ts.getDateStr(), d_e = widgets.te.getDateStr();
      var ret = {}
      // if (title) {
        ret.title = title
      // }
      // if (name) {
        ret.name = name
      // }
      // if (provider_id) {
        ret.provider_id = provider_id
      // }
      // if (provider_asset_id) {
        ret.provider_asset_id = provider_asset_id;
      // }
      // if (d_s && d_e) {
        ret.create_time = d_s && d_e ?[d_s,d_e].join(','): ''
      // }
        ret.content_available = widgets.content_available.getValue();
      return ret;
    },
    loadData(target, pane, widgets) {
      var data_str = $(target).data('data'), data
      if (data_str) {
        data = JSON.parse(data_str)
      }
      if (data) {
        var {title, name, provider_id, provider_asset_id, create_time, content_available} = data
        pane.find('[name=title]').val(title)
        pane.find('[name=name]').val(name)
        pane.find('[name=provider_id]').val(provider_id)
        pane.find('[name=provider_asset_id]').val(provider_asset_id)
        if (create_time) {
          var d_s = new Date(create_time.split(',')[0])
          widgets.ts.setCurrDate({
            year: d_s.getFullYear(),
            month: d_s.getMonth(),
            date: d_s.getDate()
          })
          var d_e = new Date(create_time.split(',')[1])
          widgets.te.setCurrDate({
            year: d_e.getFullYear(),
            month: d_e.getMonth(),
            date: d_e.getDate()
          })
        }
        if (content_available) {
          widgets.content_available.setValue(content_available, i18n('ASSETCONTENT_TABLE_AVAILABLE_' + String(content_available).toUpperCase()))
        }

      }
    },
    message(resp) {
      var ret = ''
      var {title, name, provider_id, provider_asset_id, create_time, content_available} = resp
      if (title) {
        ret += i18n('ASSET_PANE_TITLE') + ':' + title + ';'
      }
      if (name) {
        ret += i18n('ASSET_PANE_NAME') + ':' + name + ';'
      }
      if(provider_id) {
        ret += i18n('ASSET_PANE_PID') + ':' + provider_id + ';'
      }
      if (provider_asset_id) {
        ret += i18n('ASSET_PANE_PAID') + ':' + provider_asset_id + ';'
      }
      if (create_time) {
        ret += i18n('ASSET_PANE_CREATETIME') + ':' + create_time.replace(',', '—') + ';'
      }
      if (content_available) {
        ret += i18n('ASSET_FILTER_CONTENT_AVAILABLE') + ':' + i18n('ASSETCONTENT_TABLE_AVAILABLE_' + String(content_available).toUpperCase())
      }
      return ret;
    }
  }
  var TableDefiner = (function() {
    var Pane = {
      init(columns) {
        var dialog = this.initDialog((resp) => {
          this.loadData(resp, () => {
            this.setChecked(columns.filter(item => item.fixed == false))
          });
        })
        dialog.create();
      },
      initDialog(cb) {
        var id = 'Definer_' + new Date().getTime()
        var dom = `<div id='${id}' class='_dialog'>
          <style>
            ._dialog {border-radius: 8px;overflow: hidden;}
            ._dialog ._dialog_title {background-color: #2CBDEA;font-size: 18px;height: 46px;}
            .content {display: flex;flex-wrap: wrap;background-color: #f3f3f3;margin: 0 23px;}
            .content .i-check {margin: 11px;}
            .content > div {display: flex;height: 37px;font-size: 12px;align-items: center;}
            ._dialog label {margin: 0px;}
            ._dialog label.group_name {font-size: 14px;margin: 13px 0 13px 23px;}
            ._dialog_body {height: 385px;}
            ._dialog_foot a {font-size: 12px;color: #32beea;cursor: pointer;}
            ._dialog_foot .btn {width: 87px;height: 33px;line-height: 33px;font-size: 14px;word-spacing: 11px;border-radius: 3px;}
            ._dialog_foot .btn.confirm {background-color: #2cbdea;border-color: #13acdc;}
            ._dialog_foot .btn.cancel {background-color: #f6f6f6;border-color: #e2dfdf;color: #b1b1b1;}
          </style>
          <div class='_dialog_title'>
            <div class='_dialog_title_label'>自定义列表</div>
            <div class='_dialog_span'></div>
            <div class='_dialog_close'></div>
          </div>
          <div class='_dialog_body'>
          </div>
          <div class='_dialog_foot'>
            <a class='reset'>清除所选</a>
            <div class='btn cancel'>取 消</div>
            <div class='btn confirm'>确 定</div>
          </div>
        </div>`
        var dialog = new Dialog({
          id: id,
          local: true,
          content: dom,
          context: this,
          width: 662,
          height: 500,
          callback: function() {
            this.bindEvents(dialog);
            cb(dialog)
          }
        })
        return dialog;
      },
      bindEvents(dialog) {
        $('#' + dialog.dialogId)
        .on('click', '._dialog_title ._dialog_close', ({currentTarget, target}) => {
          if (currentTarget == target) {
            dialog.close()
          }
        })
        .on('click', '._dialog_foot .btn.cancel', ({currentTarget, target}) => {
          if (currentTarget == target) {
            dialog.close();
          }
        })
        .on('click', '._dialog_foot .btn.confirm', ({currentTarget, target}) => {
          if (currentTarget == target) {
            var checked = $('#' + dialog.dialogId + ' .i-check input:checked')
            var columns = this.getFormatedColumns(checked)
            if (columns.length > 0) {
              this.api.confirm(columns)
            } else {
              this.api.confirm([])
            }
            dialog.close();
          }
        })
        .on('click', '._dialog_foot .reset', ({currentTarget, target}) => {
          if (currentTarget == target) {
            console.log($('#' + dialog.dialogId + ' .i-check input:checked'))
            $('#' + dialog.dialogId + ' .i-check input:checked').removeAttr('checked')
          }
        })
      },
      getFormatedColumns(checked) {
        var formatedData = []
        for (var i = 0; i < checked.length; i++) {
          var el = checked[i]
          var name = $(el).parents('.i-check').data('name')
          var type = $(el).parents('.i-check').data('type')
          var label = $(el).parents('.i-check').siblings('label').html();
          formatedData.push({
            label: label,
            fixed: false,
            name: name,
            type: type
          })
        }
        return formatedData
      },
      loadData(dialog, callback) {
        this.api.getContent((resp) => {
          this.model.format(resp, (fragment) => {
            $('#' + dialog.dialogId).find('._dialog_body').append(fragment)
            $('#' + dialog.dialogId + ' ._dialog_body').mCustomScrollbar({
              theme: 'groundgreen'
            });
            callback && callback();
          })
        })
      },
      setChecked(checked) {
        for (var i = 0; i < checked.length; i++) {
          var item = checked[i]
          var {name} = item;
          $('.i-check[data-name=' + name + '] input').click();
        }
      }
    };
    var API = {
      getContent(callback) {
        $.ajax({
          type: 'get',
          url: aquapaas_host + '/aquapaas/rest/assetdef/metadata/asset',
          async: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).always((resp, status, xhr) => {
          if (status == 'success') {
            callback && callback(resp)
          }
        })
      }
    }
    var Model = {
      format(resp, callback) {
        var ds = []
        for (var i = 0; i < resp.length; i++) {
          var item = resp[i]
          var {title, type, name, representation: {group_title, sequence}} = item;
          if (ds.filter(item => item.group == group_title).length == 0) {
            ds.push({
              group: group_title,
              content: []
            })
          }
          ds.filter(item => item.group == group_title)[0].content.push({title, name, sequence, type})
        }
        ds.sort(function(a, b) {
          a.content.sort(function(c, d) {
            return c.sequence - d.sequence
          })
          return a.group.localeCompare(b.group)
        })
        this.set(ds, callback)
      },
      set(resp, callback) {
        var fragment = $('<div>').addClass('')
        for (var i = 0; i < resp.length; i++) {
          var item = resp[i];
          var {group, content} = item;
          var dom = `<div>
            <label class='group_name'>${group}</label>
            <div class='content'></div>
          </div>`
          var ctn = $(dom)
          for (var j = 0; j < content.length; j++) {
            ctn.find('.content').append(this.item(content[j]))
          }
          fragment.append(ctn)
        }
        callback(fragment)
      },
      item(item) {
        var {name, title, type} = item
        var dom = `<div style='width: 33%'>
          <div class='i-check' data-name='${name}' data-type='${type}'>
            <input type='checkbox'>
            <label></label>
          </div>
          <label>${title}</label>
        </div>`
        var el = $(dom)
        el.data('data', item);
        return el
      }
    }
    return function(columns, callback) {
      var model = $.extend(true, {}, Model)
      var api = $.extend(true, {confirm: callback}, API)
      var pane = $.extend(true, {model: model, api: api}, Pane)
      pane.init(columns);
    }
  })()
  return {
    init() {
      Pane.init();
    }
  }
})(jQuery, StyledList, OverlayDialog, newSelect, StyledSwitcher, jQuery.fn.zTree)
