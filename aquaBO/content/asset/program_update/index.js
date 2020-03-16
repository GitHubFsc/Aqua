(function(global, factory) {
  global.AssetUpdateManage = factory(jQuery, StyledList, DatePicker)
})(this, (function($, Table, Time){
  var frame = function() {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.api = api
    pane.model = model
    pane.init()
  }
  var Pane = {
    search: {},
    needQuery: false,
    init(){
      var table = this.initTable();
      var widget = this.initWidget();
      this.bindEvents({table, widget});
      table.create();
      this.initStatus();
    },
    initStatus() {
      $('.program_update .tab:eq(0)').click();
    },
    initTable() {
      let title = [
        {label: i18n('PUM_TABLE_OPR')},
        {label: i18n('PUM_TABLE_TIMES')},
        {label: i18n('PUM_TABLE_COUNTS')}
      ];
      let style = {
        borderColor: '#E2E2E2',
        borderWidth: 1,
        titleBg: '#45d1f4',
        titleColor: '#FFFFFF',
        titleHeight: 31,
        cellBg: 'white',
        evenBg: '#F5FDFF',
        cellColor: '#797979',
        cellHeight: 34,
        footBg: '#FFFFFF',
        footColor: '#797979',
        inputBg: '#FFFFFF',
        inputBorder: '1px solid #CBCBCB',
        iconColor: '#0099CB',
        columnsWidth: [0.33, 0.32, 0.35]
      }
      var table = new Table({
        containerId: 'program_update_list_table',
        rows: 15,
        columns: title.length,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      table.getPageData = (pageNum, callback) => {
        if (this.needQuery) {
          this.api.getList({page: pageNum, size: table.rowsLmt, search: this.search}, (ret) => {
            var {data} = ret
            var result = this.model.list(this.model.summaryByType(data))
            table.onTotalCount(result.length)
            this.model.data = result;
            console.log('search:', this.search,'&result:', result)
            callback && callback(result)
          })
        } else {
          callback && callback([])
        }
      };
      return table
    },
    bindEvents({table, widget}) {
      var {time_s, time_e} = widget
      $('.program_update._frame')
      .on('click', '.header_item.tab', ({currentTarget, target, keyCode, which}) => {
        if (currentTarget == target) {
          this.needQuery = false;
          //刷新控件时间
          var name = $(currentTarget).attr('name')
          switch (name) {
            case 'today':
              var date = new Date()
              time_s.setCurrDate({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate()
              })
              time_e.setCurrDate({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate()
              })
              break;
            case 'yesterday':
              var date = new Date()
              time_s.setCurrDate({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate() - 1
              })
              time_e.setCurrDate({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate() - 1
              })
              break;
            case 'curweek':
              var date = new Date()
              time_s.setCurrDate({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate() - 7
              })
              time_e.setCurrDate({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate()
              })
              break;
            default:

          }
          $(currentTarget).addClass('active').siblings().removeClass('active')
          this.setSearch('start', time_s.getDateStr())
          this.setSearch('end', time_e.getDateStr())
          this.needQuery = true;
          table.refreshList();
        }
      })
      time_s.onChange = () => {
        $('.program_update .tab').removeClass('active')
        this.setSearch('start', time_s.getDateStr())
        table.refreshList();
      }
      time_e.onChange = () => {
        $('.program_update .tab').removeClass('active')
        this.setSearch('end', time_e.getDateStr())
        table.refreshList();
      }
    },
    initWidget() {
      var calendarStyles = {
    		width: 200,
    		navTitleHeight: 20,
    		navTitleBgColor: '#2ea1d7',
    		datesViewHeight: 150,
    		datesViewGridColor: '#e2e2e2',
    		datesViewCellColor: '#ffffff',
    		weekdaysHeight: 20,
    		weekdaysColor: '#000000',
    		currMonthColor: '#737373',
    		nonCurrMonthColor: '#e2e2e2'
    	};
      var dateInputStyle = {
    			borderColor: '#d3d3d3'
      }
      var time_s = new Time({
        containerId: 'time_s',
        calendarStyles: calendarStyles,
        initDate: '',
        dateInputStyles: dateInputStyle,
        editable: true,
        iconImage: '',
        iconStyle: ''
      })
      var time_e = new Time({
        containerId: 'time_e',
        calendarStyles: calendarStyles,
        initDate: '',
        dateInputStyles: dateInputStyle,
        editable: true,
        iconImage: '',
        iconStyle: ''
      })
      return {time_s, time_e}
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
    getList({page, size, search={}}, callback) {
      let method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/asset/rabbitmq/report',
          // url = 'http://172.16.20.201:8031' + '/aquapaas/rest/asset/rabbitmq/report',
          urlParam = [];
      urlParam.push('starttime=' + search['start']);
      urlParam.push('endtime=' + search['end']);
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push("start=" + (page - 1) * size)
      urlParam.push("end=" + (page * size - 1))

      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        timeout: 1000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        var data
        if (status == 'success') {
          data = resp
        } else {
          data = {}
        }
        callback && callback({data: data})
      })
    }
  }
  var Model = {
    list(data) {
      let dataset = [];
      try {
        dataset.push([{
          label: i18n('PUM_TABLE_OPR_UPDATE')
        }, {
          label: data['update'] && data['update'].message_count || 0
        }, {
          label: data['update'] && data['update'].message_count || 0
        }])
        dataset.push([{
          label: i18n('PUM_TABLE_OPR_DELETE')
        }, {
          label: data['delete']&&data['delete'].message_count || 0
        }, {
          label: data['delete']&&data['delete'].message_count || 0
        }])
        dataset.push([{
          label: i18n('PUM_TABLE_OPR_TOTAL')
        }, {
          label: data['total']&&data['total'].message_count || 0
        }, {
          label: data['total']&&data['total'].message_count || 0
        }])
      } catch(e) {
        console.error("http://www.baidu.com/s?wd=" + e.message);
      } finally {
        return dataset
      }
    },
    summaryByType(data) {
      var ds = {};
      for(key in data){
        var index = key.indexOf('_')
        var type = key.slice(0, index)
        if(typeof ds[type] == 'undefined'){
          ds[type] = {}
        }
        ds[type][key.slice(index + 1)] = data[key]
      }
      return ds;
    }
  }
  return frame
}))
