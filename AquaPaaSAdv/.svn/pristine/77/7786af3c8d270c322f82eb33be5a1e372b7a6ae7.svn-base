(function(global, factory) {
  global.SuCaiQiTing = factory(jQuery, StyledList, UserInfo)
  var app = new SuCaiQiTing();
}(this, (function($, Table, UserInfo) {
 var Pane = {
   table: null,
   search: {
     type: 'img',
     state: 'enabled'
   },
   init() {
     this.renderFrame();
     var table = this.initTable();
     table.create();
     this.bindEvents(table)
     this.table = table;
   },
   refreshTable() {
     var table = this.table
     var type = this.search['type']
     var config = this.getTableConfig(type);
     $.extend(table, config)
     table.resize();
     table.refreshList();
   },
   renderFrame() {
     for (var key in this.search) {
       if (this.search.hasOwnProperty(key)) {
         var value = this.search[key]
         if (value) {
           $(`#su_cai_qi_ting ._frame_header [name=${key}][data-${key}=${value}]`).addClass('focus').siblings().removeClass('focus')
         }

       }
     }
   },
   initTable() {
     var search = this.search,
         type = search.type
     var config = $.extend(true, {}, this.getTableConfig(type), {
       containerId: 'Sucai_EnableTable',
       rows: 11,
       listType: 1,
       async: true,
       updateTitle: true
     })
     var table = new Table(config)
     table.getPageData = (pageNum, callback) => {
       this.api.getList({
         search: this.search,
         start: (pageNum - 1) * table.rowsLmt,
         end: pageNum * table.rowsLmt - 1
       }, ({data, count}) => {
         var type = this.search.type
         this.model.data = data;
         table.onTotalCount(count)
         callback && callback(this.model.list(type, data))
       });
     }
     return table;
   },
   bindEvents(table) {
     $('#su_cai_qi_ting')
     .on('click', '._frame_header [name=type]', ({currentTarget, target}) => {
       if (currentTarget == target) {
         $(currentTarget).addClass('focus').siblings().removeClass('focus');
         this.search.type = $(currentTarget).data('type').toLowerCase();
         this.refreshTable()
       }
     })
     .on('click', '._frame_header [name=state]', ({currentTarget, target}) => {
       if (currentTarget == target) {
         $(currentTarget).addClass('focus').siblings().removeClass('focus');
         this.search.state = $(currentTarget).data('state').toLowerCase();
         table.refreshList();
         table.changePage('1')
       }
     })
     .on('keyup', '._frame_header .search [name=search]', ({currentTarget, target, which, keyCode}) => {
       var key = which || keyCode
       if (currentTarget == target && key == 13) {
         this.search.name = $(currentTarget).val();
         table.refreshList();
         table.changePage('1')
       }
     })
     .on('click', '._frame_header .search [name=btn]', ({currentTarget, target}) => {
       if (currentTarget == target) {
         this.search.name = $(currentTarget).prev().val();
         table.refreshList();
         table.changePage('1')
       }
     })
     //列表操作
     var tableid = table.containerId
     $('#' + tableid)
     .on('click', '[name=user]', ({currentTarget, target}) => {
       if (currentTarget == target) {
         var index = $(currentTarget).data('index'),
             data = this.model.data[index],
             {user_id, user_name} = data;
         var dialog = new UserInfo({
           id: user_id,
           type: user_id == my.paas.user_id ? 'self': 'others',
           name: user_name,
           isfloat: false,
           scope: $(currentTarget)
         })
       }
     })
     .on('click', '[name=view]', ({currentTarget, target}) => {  //显示策略内容
      if (currentTarget == target) {
        var index = $(currentTarget).data('index');
        var app = new PreviewModel();
        app.previewSuCai(this.model.data[index].ad_id);
      }
    })
    .on('click', '[name=audithis]', ({currentTarget, target}) => {
      if (currentTarget == target) {
        var index = $(currentTarget).data('index');
        var data = this.model.data[index];
        var dialog = new AuditHis({
          type: 'ad_item',
          id: data.ad_id
        });
      }
    })
     .on('click', '[name=enable]', ({currentTarget, target}) => {
       if (currentTarget == target) {
         var index = $(currentTarget).data('index'),
             adItem = this.model.data[index]
         this.api.toggleState(adItem, () => {
           table.refreshList();
         })
       }
     })
     .on('click', '[name=disable]', ({currentTarget, target}) => {
       if (currentTarget == target) {
         var index = $(currentTarget).data('index'),
             adItem = this.model.data[index]
         this.api.toggleState(adItem, () => {
           table.refreshList();
         })
       }
     })
   },
   getTableConfig(type) {
     var config = {
           titles: [
             {
               label: i18n("PSDAUDIT_TABLE_PSDNAME")
             }, {
               label: i18n("PSDAUDIT_TABLE_STATE")
             }, {
               label: i18n("PSDAUDIT_TABLE_CREATOR")
             }, {
               label: i18n("PSDAUDIT_TABLE_OPERATION")
             }
           ],
           styles: {
             borderColor: 'rgb(226,226,226)',
             borderWidth: 1,
             titleHeight: 40,
             titleBg: '#5DA1C0',
             titleColor: '#FFFFFF',
             cellBg: '#FFFFFF',
             evenBg: '#F5F5F5',
             cellColor: '#949494',
             footBg: '#FFFFFF',
             footColor: '#797979',
             iconColor: '#5DA1C0',
             inputBorder: '1px #CBCBCB solid',
             inputBg: '#FFFFFF',
             columnsWidth: [0.4, 0.1, 0.1, 0.15]
           }
         },
         title_insert = [],width_insert = []
     switch (type) {
       case 'img':
        title_insert.push({
          label: i18n("PSDAUDIT_TABLE_SIZE")
        }, {
          label: i18n("PSDAUDIT_TABLE_WEIGHT")
        })
        break;
       case 'video':
        title_insert.push({
          label: i18n("PSDAUDIT_TABLE_LENGTH")
        }, {
          label: i18n("PSDAUDIT_TABLE_WEIGHT")
        })
        // width_insert.push(0.15, 0.1)
        break;
       case 'subtitle':
        title_insert.push({
          label: i18n("SUCAI_ZIMUNEIRONG")
        })
        // width_insert.push(0.25)
        break;
       default:

     }
     config.titles = config.titles.slice(0, 3).concat(title_insert).concat(config.titles.slice(-1));
    //  config.styles.columnsWidth = config.styles.columnsWidth.slice(0, 3).concat(width_insert).concat(config.styles.columnsWidth.slice(-1));
     if(type == 'img' || type == 'video'){
      config.styles.columnsWidth = [0.4, 0.1, 0.1, 0.15, 0.1, 0.15];
     } else if(type == 'subtitle'){
      config.styles.columnsWidth = [0.15, 0.1, 0.1, 0.5, 0.15];
     }
     
     config.columns = config.titles.length;
     return config
   },
   getSearch(key) {
     var search = this.search,
         ret = ''
     return search[key]
   }
 }
 var API = {
   getList({search: {type='img', state='enabled', name=''}, start, end}, callback) {
     var  method = 'Get',
          url = paasHost + paasAdvDomain + '/ads/aditem/aditems',
          {user_id, user_type, access_token, platform_current_id} = my.paas,
          urlParam = [];
      urlParam.push('start=' + start)
      urlParam.push('end=' + end)
      urlParam.push('type=' + type)
      urlParam.push('state=' + state)
      urlParam.push('name=' + name)
      urlParam.push('user_id=' + user_id)
      urlParam.push('user_type=' + user_type)
      urlParam.push('access_token=' + access_token)
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      if (platform_current_id) {
        urlParam.push('platform_id_list=' + platform_current_id)
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
     }).always((rsp, status, xhr) => {
       var count = 0, data = [];
       if (status == 'success') {
         data = rsp
         count = xhr.getResponseHeader('x-aqua-total-count')
       }
       callback && callback({data, count})
     });
   },
   toggleState(adItem, callback) {
     var url = `${paasHost + paasAdvDomain}/ads/aditem/state`,
         method = 'Put',
         urlParam = [],
         state = adItem.enable ? 'disabled' : 'enabled',
         {user_id, user_type, access_token} = my.paas;
     urlParam.push('state=' + state)
     urlParam.push('user_id=' + user_id)
     urlParam.push('user_type=' + user_type)
     urlParam.push('access_token=' + access_token)
     urlParam.push('app_key=' + paasAppKey)
     urlParam.push('timestamp=' + new Date().toISOString())
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
       data: JSON.stringify([adItem.ad_id]),
       success: function () {
       },
       error: function () {
         return;
       }
     }).always((resp, status, xhr) => {
       callback && callback();
     })
   }
 }
 var Model = {
   list(type, dataset) {
     var ds = []
     for (var i = 0, len = dataset.length; i < len; i++) {
        var item = dataset[i],
           {name, enable, user_name, subtitle_content, width, height, size, level} = item;
           row = []
        var op_view = `<a data-index='${i}' name='view'>${i18n("ADPOLICYAUDIT_TABLE_OPERATION_VIEW")}</a>`;
        var op_audithis = `<a data-index='${i}' name='audithis'>${i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS")}</a>`;
        var op_disable = `<a data-index='${i}' name='disable'>${i18n('ADPOLICYAUDIT_TABLE_OPERATION_DISABLE')}</a>`
        var op_enable = `<a data-index='${i}' name='enable'>${i18n('ADPOLICYAUDIT_TABLE_OPERATION_ENABLE')}</a>`
        row.push({
          label: name
        }, {
          label: i18n(`ADPOLICYAUDIT_TABLE_STATE_${enable ? 'ENABLE' : 'DISABLE'}`)
        }, {
          label: `<div name='user' data-index='${i}'>${user_name || ''}</div>`
        })
        switch (type) {
          case 'img':
            row.push({
              label: [width, height].join('*')
            })
            row.push({
              label: level
            })
            break;
          case 'video':
            row.push({
              label: size
            })
            row.push({
              label: level
            })
            break;
          case 'subtitle':
            row.push({
              label: `<div title='${subtitle_content}'>${subtitle_content}</div>`
            })
            break;
          default:

        }
        row.push({
          label: `<div class='opr'>${op_view}${op_audithis}${[enable ? op_disable : op_enable]}</div>`
        })
        ds.push(row)
     }
     return ds;
   }
 }
 var frame = function() {
   var api = $.extend(true, {}, API);
   var model = $.extend(true, {}, Model);
   var pane = $.extend(true, {api, model}, Pane);
   pane.init();
 }
 return frame
})))
