var ManualMatch = (function($, Table){
    let Pane = {
        _frame: null,
        bundle_info: null,
        table: null,
        callback: null,
        search: [{
          key: 'sort_by',
          value: 'd'
        }],
        init(opts) {
            this.bundle_info = opts.data;
            this.callback = opts.back;
            this.loadFrame(this.bundle_info.name);
            this.initTable();
            this.bindEvents();
        },
        loadFrame(name){
            let html = `<div class='_frame _flex' id='manual_asset'>
                <div class='header _flex'>
                    <div class='header_item btn back icon' name='back'>${i18n('MNG_BACK')}</div>
                    <div class='header_item split'></div>
                    <div class='header_item'>${name}${i18n('MANUAL_ASSET_TITLE')}</div>
                    <div class='header_item span'></div>
                    <div class='header_item btn icon' name='add'>${i18n('ASSET_ASSET_DIALOG_TITLE')}</div>
                </div> 
                <div class='body'>
                    <div id='list_table_manual'></div>
                </div>
            </div>`;
            this._frame = $(html);
            this._frame.appendTo($('#asset_asset'));
        },
        initTable() {
          let title = [{
            label: i18n("ASSET_TABLE_PID")
                  }, {
            label: i18n("ASSET_TABLE_PAID")
              }, {
            label: i18n("ASSET_TABLE_TITLE")
              }, {
            label: '<div name="sort" class="' + (Pane.search.filter(item=>item.key == 'sort_by')[0].value == 'd' ? 'desc': '') + '">' + i18n("ASSET_TABLE_AFFECTIVE") + '</div>'
              }, {
            label: i18n("ASSET_TABLE_PATH")
              }, {
            label: i18n("ASSET_TABLE_STATUS")
              }, {
            label: i18n("ASSET_TABLE_OPR")
              }];
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
              columnsWidth: [0.1, 0.13, 0.19, 0.14, 0.27, 0.06, 0.10]
            },
            config = {
              containerId: "list_table_manual",
              columns: 7,
              rows: 15,
              listType: 1,
              async: true
            }
          config.titles = title;
          config.styles = style;
          this.table = new Table(config);
          this.table.getPageData = API.getList;
          this.table.create();
        },
        bindEvents(){
            $('#manual_asset .header_item.back').bind('click', ()=>{
               this.close(); 
            });
          $('#manual_asset [name=add]').bind('click', () => {
            let dialog = new add_asset({
              id: Pane.bundle_info.id,
              confirmFn: () => {
                // setTimeout(() => {
                Pane.table.refreshList();
                // }, 1000)
              }
            });
          });
          $('#manual_asset #list_table_manual')
          .on('click', '[name=del]', (e) => {
            let index = $(e.target).data('index');
            let data = API.data[index];
            let message = i18n('ASSET_ASSET_DEL_INFO').replace('{{}}', Pane.bundle_info.name).replace('{{}}', data.name);
            let dialog = new AlertDialog({
              message: message,
              confirmFn: (callback) => {
                API.delete(data.doc_id, data.bundle_id, () => {
                  callback && callback();
                  // setTimeout(() => {
                  Pane.table.refreshList();
                  // }, 1000)
                })
              }
            })
          })
          .on('click', 'thead [name=sort]', ({currentTarget, target}) => {
            if (currentTarget == target) {
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
          });
        },
        close(){
            this._frame.remove();
            this.callback && this.callback();
        },
        setSearch(key, val){
          if (val !== "") {
            if (Pane.search.find(key, 2, 'key') !== null) {
              for (var i = 0; i < Pane.search.length; i++) {
                if (Pane.search[i].key == key) {
                  Pane.search[i].value = encodeURIComponent(val);
                }
              }
            } else {
              Pane.search.push({
                key: key,
                value: encodeURIComponent(val)
              });
            }
          } else {
            for (var i = 0; i < Pane.search.length; i++) {
              if (Pane.search[i].key == key) {
                Pane.search[i].value = '';
              }
            }
          }
        }
    };
    let API = {
        getList(pageNum, callback) {
          let opts = [];
          opts.push("start=" + (pageNum - 1) * this.rowsLmt)
          opts.push("end=" + (pageNum * this.rowsLmt - 1))
          opts.push("visible=all");
          opts.push("bundle_id=" + Pane.bundle_info.id + '&bundle_id_op=eq');
          opts.push('sort_by=licensing_window_start&sort_mode=' + Pane.search.filter(item => item.key == 'sort_by')[0].value);
          let url = aquapaas_host + "/aquapaas/rest/search/contents/asset?" + opts.join('&');
          $.ajax({
            method: 'GET',
            url: url,
            async: false,
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          }).always((resp, status, xhr) => {
            if(status == 'success') {
              Pane.table.onTotalCount(parseInt(xhr.getResponseHeader("x-aqua-total-count")));
              API.data = resp;
              callback && callback(Model.table(resp));
            } else {
              callback && callback(Model.table([]))
            }
          });
        },
        delete(id, bundle_id, callback) {
          var url = aquapaas_host + '/aquapaas/rest/asset/bundle_info?ids=' + id + '&bundle_id=' + bundle_id + '&app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString() + '&mode=1';
          let method = 'Put',
            req = new XMLHttpRequest();
          req.open(method, url, true);
          req.setRequestHeader('Accept', 'application/json');
          req.setRequestHeader('Content-Type', 'application/json');
          req.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('PUT', url));
          req.onreadystatechange = function () {
            if(this.status == 200 && this.readyState == 4) {
              callback && callback();
            }
          }
          req.send();
        }
    };
    let Model = {
        table(data) {
          var list = [];
          for(var i = 0; i < data.length; i++) {
            let row = [];
            let item = data[i];
            let pid = item.provider_id;
            let paid = item.provider_asset_id;
            let title = item.title || "";
            let affactive_time = convertTimeString(item.licensing_window_start);
            let path = item.category || "";
            let fullpath = Array.isArray(path) ? path.join() : path;
            let status = item.visible ? true : false;
            row.push({
              label: pid
            });
            row.push({
              label: paid
            });
            row.push({
              label: title
            });
            row.push({
              label: affactive_time
            });
            row.push({
              label: fullpath
            });
            row.push({
              label: i18n("ASSET_SHELF_TABLE_STATUS_" + String(status).toUpperCase())
            });
            let op_del = "<a name='del' data-index='" + i + "'>" + i18n("ASSET_TABLE_OPR_EDL") + "</a>";
            row.push({
              label: "<span>" + [op_del].join("") + "</span>"
            });
            list.push(row);
          }
          return list;
        }
    };
    var self = function (opts){
        Pane.init(opts);
    }
    return self;
})(jQuery, StyledList);
