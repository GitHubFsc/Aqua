define(['./config','Alert','PopupDialog', 'DatePicker', 'StyledList', 'jquery','DatePickerVersionTwo','uiWidget/newSelect','js/lib/echarts.min','ScrollBarList','mCustomScrollbar','NanoScroller'],
  function(config, Alert, PopupDialog, DatePicker, StyledList, $, DatePickerVersionTwo, newSelect, echarts, scrollBarList){
  var CONFIG = config;
  var deviceHistory = function(){};
  deviceHistory.prototype = {
    init:function(containerId){
      var that = this;
      $.get('content/running/deviceHistory/index.html', function(html){
        html = patchHTML(html);
        $('#' + containerId).empty().append(html);
        that.initParm();
        that.initOptions();
        that.bindEvent();
      });
    },
    initParm: function () {
      var that = this;
      that.resultType = null;
      that.thingdefid = null;
      that.tabs = [];
      that.searchResultList = null;
      that.myChart = null;
    },
    initOptions: function () {
      var that = this;
      var deviceType_Select = new newSelect("#deviceHistory_option_deviceType", [], {
        width: "100%",
        height: 30,
        background: "#ffffff",
        selectedBackground: "#F2FDFF",
        selectedLiColor: "#92DEF5",
        fontSize: 12,
        liFontSize: 12,
        headerColor: "#828282",
        liColor: "#828282",
        iconRight: 8,
        headerBorderColor: "#D0D0D0",
        headerBorderStyle: "solid",
        headerBorderWidth: 1,
        headerBorderRadius: 4,
        liBorderColor: "#D0D0D0",
        openIconUrl: "./uiWidget/images/select_open2.png",
      });
      that.deviceType_Select = deviceType_Select;


      var dateInputStyles = {
        borderColor: "#d9d9d9",
        borderRadius: "6px"
      };
      var calendarStyles = {
        width: 250,
        navTitleHeight: 40,
        navTitleBgColor: '#ffffff',
        datesViewHeight: 160,
        datesViewGridColor: '#ffffff',
        datesViewCellColor: '#ffffff',
        weekdaysHeight: 22,
        weekdaysColor: '#a1a1a1',
        currMonthColor: 'rgb(121,121,121)',
        nonCurrMonthColor: 'rgb(200,200,200)',
        align: 'right'
      };
      that.datePicker_start = new DatePickerVersionTwo({
        containerId: "deviceHistory_option_DataRange_start",
        editable: false,
        iconImage: 'uiWidget/images/datepicker_calendaricon_1.png',
        iconStyle: {
          left: 120
        },
        dateInputStyles: dateInputStyles,
        calendarStyles: calendarStyles
      });
      that.datePicker_end = new DatePickerVersionTwo({
        containerId: 'deviceHistory_option_DataRange_end',
        editable: false,
        iconImage: 'uiWidget/images/datepicker_calendaricon_1.png',
        iconStyle: {
          left: 120
        },
        dateInputStyles: dateInputStyles,
        calendarStyles: calendarStyles
      });
      var time = new Date();
      that.datePicker_start.setCurrDate({
        year: time.getFullYear(),
        month: time.getMonth(),
        date: 1
      });
      that.datePicker_end.setCurrDate({
        year: time.getFullYear(),
        month: time.getMonth(),
        date: time.getDate()
      });


      API.getDeviceType({
        namespace: "mgd.gehua",
        enumDefID: "enum_device",
      }, function (data) {
        var deviceType_Select_Options = data.map(function (item) {
          return {
            name: item["value"],
            value: item["value"]
          }
        });
        that.deviceType_Select.updateSelectOptions(deviceType_Select_Options);
        that.deviceType_Select.setValue(DTUThingDefID);
        that.thingdefid = DTUThingDefID;
        that.initSearchOptions();
      });
    },
    bindEvent: function () {
      var that = this;
      //设备类型选DTU或者ReBeng的onChange事件
      that.deviceType_Select.listenLiClick = function(value){
        that.thingdefid = value;
        that.initSearchOptions(value);
      }
      //搜索按钮
      $("#deviceHistory_searchButton").click(function () {
        var options = that.getSearchOptions();
        if(!options){
          that.alertDialog();
          return;
        }
        that.thingdefid = options.thingdefid;
        that.tab = [];
        that.deviceHistoryData = null;
        that.initTitleHead(options);
        $("[name=deviceHistory_result] .content").empty();
        $("[name=deviceHistory_result]").hide();
        $("[name=deviceHistory_result][data-type=" + that.resultType + "]").show();
        that.searchResultList = null;
        that.myChart && that.myChart.dispose();
        API.getList(options, function(data){
          that.deviceHistoryData = data;
          that.updateSearchResult();//拿到数据后，根据选择的tab来绘制（表格 or 折线表）
        })
      });
      //折线表格的tab
      $('#deviceHistory_result_title_head').on('click', '[name=deviceHistory_result_type]', function () {
        $("[name=deviceHistory_result_type]").each(function (index, el) {
          $(el).removeClass("focus");
        });
        $(this).addClass("focus");
        that.resultType = $(this).data("value");
        $("[name=deviceHistory_result]").hide();
        $("[name=deviceHistory_result][data-type=" + that.resultType + "]").show();
        that.updateSearchResult();
      });
    },
    initSearchOptions: function(){
      var that = this;
      CONFIG.query[that.thingdefid]["parms"].forEach(function(item){
        if(item.enable){
          $("[name=deviceHistory_option_input][data-type=" + item.value + "]").removeAttr("readonly");
        }else{
          $("[name=deviceHistory_option_input][data-type=" + item.value + "]").val("");
          $("[name=deviceHistory_option_input][data-type=" + item.value + "]").attr("readonly","");
        }
      });
    },
    getSearchOptions: function(){
      var that = this;
      var result = {};
      var DTUID = "";
      var devEUI = "";
      var devID = "";
      var namespace ;
      var thingdefid = that.deviceType_Select.getValue();
      var timezoneOffset = encodeURIComponent("+") + "0800";
      var start_time = that.datePicker_start.getDateStr() ? (that.datePicker_start.getDateStr() + "T00:00:00" + timezoneOffset) : "";
      var end_time = that.datePicker_end.getDateStr() ? (that.datePicker_end.getDateStr() + "T23:59:59" + timezoneOffset) : "";
      result.thingdefid = thingdefid;
      if(start_time){
        result.start_time = start_time
      };
      if(end_time){
        result.end_time = end_time;
      };
      switch (thingdefid) {
        case DTUThingDefID:
          DTUID = $("#deviceHistory_option_DTUID").val();
          devEUI = $("#deviceHistory_option_DevEUI").val();
          result.search = [];
          namespace = DTUNamespace;
          if(DTUID){
            result.search.push({key: "DTUID",value:DTUID,op:"eq"})
          }
          if(devEUI){
            result.search.push({key: "devEUI",value:devEUI,op:"eq"})
            result.ext_id = devEUI;
          }
          if(!DTUID && !devEUI){
            return false;
          }
          break;
        case rebengThingDefID:
          DTUID = $("#deviceHistory_option_DTUID").val();
          devID = $("#deviceHistory_option_DevID").val();
          devEUI = $("#deviceHistory_option_DevEUI").val();
          result.search = [];
          namespace = rebengNamespace;
          if(DTUID){
            result.search.push({key: "DTUID",value:DTUID,op:"eq"})
          }
          if(devEUI){
            result.search.push({key: "devEui",value:devEUI,op:"eq"})
          }
          if(devID){
            result.search.push({key: "devID",value:devID,op:"eq"})
          }
          if(devID && devEUI){
            result.ext_id = devID + "." + devEUI;
          }
          if(!devID || (!DTUID && !devEUI)){
            return false;
          }
          break;
      }
      result.namespace = namespace;
      return result;
    },
    updateSearchResult: function(){
      var that = this;
      if(!that.deviceHistoryData){
        //接口此时还没返回数据，什么也不做
        return;
      }
      var tag = findTag(that.tabs, that.resultType);
      if(tag.loadDataComplete){
        //接口已返回数据，而且对应tab（表格或者折线表）已经加载好数据，什么也不做
        return;
      }
      //接口已返回数据，而且对应tab（表格或者折线表）还没加载好数据，开始绘制
      switch (that.resultType){
        case "table":
          that.initTable();
          that.searchResultList.update(that.formListDataForSearchResultList(that.deviceHistoryData));
          break;
        case "temperature":
          that.initLineChart();
          break;
        case "battery":
          that.initLineChart();
          break;
      }
      if(that.deviceHistoryData){
        tag.loadDataComplete = true;
      }
      function findTag(tabs,tab){
        for(var i = 0; i < tabs.length; i++){
          var item = tabs[i];
          if(item.value == tab){
            return item;
          }
        };
      }
    },
    initTitleHead: function(options){
      var that = this;
      var DTUID = findDTUID(options);
      var title;
      if(DTUID){
        title = i18n("DEVICEDISTORY_DTUID-") + DTUID + i18n("DEVICEDISTORY_DATAHISTORY");
      }else{
        title = i18n("DEVICEDISTORY_DATAHISTORY");
      }
      $("#deviceHistory_result_title_head .left .title_").text(title);
      $("#deviceHistory_result_title_head .right").empty();
      var TABS;
      TABS = CONFIG.content[that.thingdefid]["tab"].map(function(item){
        return {
          name: item.name,
          value: item.value,
        }
      });
      that.tabs = TABS.map(function(tab){
        return {
          value: tab.value,
          init_Boolean: false,
        }
      })
      TABS.forEach(function(item, i){
        var tab = $('<div class="time_button" data-value="' + item.value + '" name="deviceHistory_result_type">' + item.name +'</div>');
        $("#deviceHistory_result_title_head .right").append(tab);
        if(i == 0){
          tab.addClass("focus");
          that.resultType = item.value;
        }else{
          tab.css({
            "margin-left": "12px"
          });
        }
      });
      function findDTUID(options){
        var i = 0;
        if(options.search){
          for(i = 0; i < options.search.length; i++){
            var item = options.search[i];
            if(item.key == "DTUID"){
              return item.value;
            }
          };
          return false;
        }else{
          return false;
        }
      }
    },
    initTable: function(){
      $("#deviceHistory_result_table_content").html("");
      var that = this;
      var deviceType = that.thingdefid;
      var widths = [];
      var titles = [];
      var tableConfig = CONFIG.content[deviceType]["tab"].filter(function(item){
        return item.value == that.resultType
      })[0]["data"];
      widths = tableConfig.map(function(item){
        return item.width;
      });
      titles = tableConfig.map(function(item){
        return {
          label: item.label
        };
      });
      var searchResultList = new scrollBarList({
        rows: 11,
        columns: titles.length,
        containerId: 'deviceHistory_result_table_content',
        titles: titles,
        listType: 0,
        data: [],
        styles: {
          borderColor: 'rgb(225, 225, 225)',
          borderWidth: 1,
          titleHeight: 47,
          titleBg: '#F8F8F8',
          titleColor: '#666666',
          cellBg: 'white',
          evenBg: '#F8F8F8',
          cellColor: '#777777',
          cellHeight: 36,
          footBg: 'white',
          theadbold: true,
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          columnsWidth: widths,
        }
      });
      searchResultList.create();
      that.searchResultList = searchResultList;
      that.searchResultList.update(that.formListDataForSearchResultList(new Array(11)));
      $("[name=deviceHistory_result][data-type=table]").mCustomScrollbar({
        theme:"light"
      });
      $("[name=deviceHistory_result][data-type=table] .mCSB_inside > .mCSB_container").css({
        "margin-right": "0px"
      })
    },
    formListDataForSearchResultList: function (data) {
      var list_data = [];
      for (var i = 0; i < data.length; i = i + 1) {
        var item = data[i];
        var record = this.formListRowDataForSearchResultList(item, i);
        list_data.push(record);
      }
      return list_data;
    },
    formListRowDataForSearchResultList: function (data, i) {
      var that = this;
      var arr = [];
      var deviceType = that.thingdefid;
      var tableConfig = CONFIG.content[deviceType]["tab"].filter(function(item){
        return item.value == "table"
      })[0]["data"];
      arr = tableConfig.map(function(item){
        return {
          label: item.value(data)
        }
      });
      return arr;
    },
    initLineChart : function(){
      var that = this;
      var chartConfig = CONFIG.content[that.thingdefid]["tab"].filter(function(item){
        return item.value == that.resultType
      })[0];

      var deviceHistoryData = chartConfig.convertData(that.deviceHistoryData);

      //获取xAxisArray
      var xAxisArray = chartConfig.getxAxisArray(deviceHistoryData);

      //获取折线的对应name和data
      var legend = [];
      chartConfig["data"].forEach(function (item) {//指标循环
        legend.push({
          name: item.label,
          data: deviceHistoryData.map(function(itemA){
            return item.value(itemA);
          })
        });
      });

      var LineChartOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          formatter: function (name) {
            return name;
          },
          type: 'scroll',
          orient: 'vertical',
          right: 30,
          top: 30,
          bottom: 20,
          data: []
        },
        grid: {
          left: '3%',
          right: '190px',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: '#8696A9'
          },
          axisLine: {
            lineStyle: {
              color: '#D8D8D8',
              width: 2,
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#8696A9',
            formatter:function(name){
              return name + chartConfig.unit
            }
          },
          axisLine: {
            lineStyle: {
              color: '#D8D8D8',
              width: 2,
            }
          }
        },
        series: []
      };
      LineChartOption.xAxis.data = xAxisArray;
      legend.forEach(function (itemA) {
        LineChartOption.legend.data.push(itemA.name);
        LineChartOption.series.push({
          name: itemA.name,
          type: 'line',
          stack: itemA.name + "总量",
          data: itemA.data
        });
      });
      var myChart = echarts.init(document.getElementById('deviceHistory_result_' + that.resultType + '_content'));
      myChart.setOption(LineChartOption, true);
      that.myChart = myChart;
    },
    alertDialog: function(){
      var dialog = new Alert({
        id: 'deviceHistory_AlertDialog',
        message: i18n("DEVICEDISTORY_QUERYALERTCONTENT1"),
        callback: function(cb){
          cb && cb()
        }
      });
    }
  };

  var API = {
    getList: function(options, callback){
      var url = paasHost + "/aquapaas/rest/thinghistory/status";
      url = url + "?user_id=" + my.paas.user_id;
      url = url + "&access_token=" + my.paas.access_token;
      url = url + "&app_key=" + paasAppKey;
      url = url + "&timestamp=" + new Date().toISOString();
      if (typeof options.ext_id !== 'undefined') {
        url = url + "&ext_id=" + options.ext_id;
      }
      if (typeof options.namespace !== 'undefined') {
        url = url + "&namespace=" + options.namespace;
      }
      if (typeof options.thingdefid !== 'undefined') {
        url = url + "&thingdefid=" + options.thingdefid;
      }
      if (typeof options.start_time !== 'undefined') {
        url = url + "&start_time=" + options.start_time;
      }
      if (typeof options.end_time !== 'undefined') {
        url = url + "&end_time=" + options.end_time;
      }
      if (typeof options["order-mode"] !== 'undefined') {
        url = url + "&order-mode=" + options["order-mode"];
      }
      if (typeof options.search !== 'undefined') {
        for (var item of options.search){
          url = url + "&" + item.key + "=" + item.value;
          url = url + "&" + item.key + "_op" + "=" + item.op;
        }
      }
      if (typeof options.start !== 'undefined') {
        url = url + "&start=" + options.start;
      }
      if (typeof options.end !== 'undefined') {
        url = url + "&end=" + options.end;
      }
      $.ajax({
        type: 'GET',
        async: true,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        var data = [];
        callback && callback(data);
      });
    },
    getDeviceType: function(options, callback){
      var url = paasHost + "/aquapaas/rest/thingenumdef/item/list";
      url = url + "/" + options.namespace;
      url = url + "/" + options.enumDefID;
      url = url + "?user_id=" + my.paas.user_id;
      url = url + "&access_token=" + my.paas.access_token;
      url = url + "&app_key=" + paasAppKey;
      url = url + "&timestamp=" + new Date().toISOString();
      var data = {"enum_device":[""],"enum_manufacture":["1","2","3"]}
      $.ajax({
        type: 'POST',
        async: true,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: JSON.stringify({})
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        var data = [];
        callback && callback(data);
      });
    },
  };

  return deviceHistory;
});
