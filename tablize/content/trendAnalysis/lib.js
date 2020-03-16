var trendAnalysis_Lib = (function ($) {
  var lib = {
    init: function () {
    },
    openQuotaDialog: function (quotaArray, callback) {
      quota.openDialog(quotaArray, callback);
    },
    openFilterDialog: function (groupingArray, callback) {
      filter.openDialog(groupingArray, callback);
    },
    openMessageDialog: function (text) {
      message.openDialog(text);
    },
  };
  var quota = {
    initParm: function () {
      var that = this;
      that.QuotaArray = [];
      that.QuotaJSON = {};
      that.SelectQuotaArray = [];
    },
    openDialog: function (quotaArray, callback) {
      var that = this;
      that.callback = callback;
      that.initParm();
      api.getQuota(function (data) {
        var tmp = data;
        if(Object.prototype.toString.call(tmp) === '[object Array]'){
          for (var group of tmp) {
            var groupObj = {
              label: group["analytics_group"]
            };
            var analytics_field = group["analytics_field"];
            for (var key in analytics_field) {
              that.QuotaArray.push({
                checked: false || ((quotaArray.filter(function(item){
                  return (item.id == key) && (item.name == analytics_field[key]["desc"])
                })).length > 0),
                key: key,
                label: analytics_field[key]["desc"],
                group: groupObj
              });
              that.QuotaJSON[key] = analytics_field[key];
            }
          }
        }else{
          that.QuotaJSON = data;
          for (var key in tmp) {
            that.QuotaArray.push({
              checked: false || ((quotaArray.filter(function(item){
                return (item.id == key) && (item.name == tmp[key]["desc"])
              })).length > 0),
              key: key,
              label: tmp[key]["desc"]
            });
          }
        }
        var indexes = that.QuotaArray
        var checker = new IndexChecker({
          indexes: indexes,
          title: i18n("TRENDANALYSIS_QUOTASELECT"),
        });
        checker.onSelect = function() {
          var result = that._actionChecker.getSelected()
          result = result.map(function(item){
            return {
              id: item.key,
              name: item.label,
              group: item.group
            }
          });
          that.callback && that.callback({
            selected: result,
            json: that.QuotaJSON
          });
        };
        that._actionChecker = checker;
        that._actionChecker.open();
      })
    },
    findArray: function(array, find_item){
      var i = 0;
      var item = 0;
      var result = false;
      for(i= 0;i < array.length; i++){
        item = array[i]
        if(item == find_item){
          result = true;
          break;
        }
      }
      return result;
    }
  };
  var filter = {
    /*
     groupingArray主要传入选中的分组，还有用户选中的过滤条件
     groupingArray:[
     {id:"grade",name:"年级",selected:["一年级","二年级","三年级","四年级"]},
     {id:"book",name:"课本",selected:["语文","数学"]},
     ]
     * */
    initParm: function (groupingArray) {
      var that = this;
      that.groupingArray = JSON.parse(JSON.stringify(groupingArray));
      that.searchSelect = null;//下拉菜单组件
      that.ResultForSinpleGrouping = null;//通过api.getList请求单个分组下的所有数据
      that.searchText = "";
    },
    openDialog: function (groupingArray, callback) {
      var that = this;
      that.callback = callback;
      var dialog = new PopupDialog({
        url: 'content/trendAnalysis/FilterDialog.html',
        width: 578,
        height: 655,
        context: that,
        callback: function () {
          that.initParm(groupingArray);
          that.initContent();
          that.bindEvent();
        }
      });
      dialog.open();
      that.dialog = dialog;
    },
    initContent: function () {
      var that = this;
      var searchSelectOptions = that.groupingArray.map(function (item) {
        return {
          key: item.id,
          value: item.name
        }
      });
      var searchSelect = new TicketnewSelect("#trendAnalysis_option_search_select", searchSelectOptions, {
        width: 120,
        height: 30,
        background: "#ffffff",
        selectbackground: "#ffffff",
        headerBorder: "1px solid #E2E2E2",
        openIconUrl: "./uiWidget/images/select_open.png",
        closeIconUrl: "./uiWidget/images/select_close.png"
      }, function (selected) {
        $("#trendAnalysis_option_search_inputModel input").val("");
        that.searchText = "";
        that.searchResultList.titles[2] = {label: that.searchSelect.getKey()};
        that.searchResultList.titles[5] = {label: that.searchSelect.getKey()};
        that.searchResultList.update();
        that.updateFilterInput();
      });
      that.searchSelect = searchSelect;

      that.updateFilterInput();
      var widths = [0.05, 0.05, 0.3, 0.05, 0.05, 0.3];
      //var table_data = that.formListDataForDiffResult(data);
      var title = that.groupingArray[0].name || "";
      var titles = [{
        label: ""
      }, {
        label: ""
      }, {
        label: title
      }, {
        label: ""
      }, {
        label: ""
      }, {
        label: title
      }];
      var searchResultList = new StyledList({
        async: true,
        rows: 8,
        columns: 6,
        containerId: 'trendAnalysis_ResultList',
        listType: 1,
        data: [],
        titles: titles,
        styles: {
          borderColor: 'rgb(225, 225, 225)',
          borderWidth: 1,
          titleHeight: 38,
          titleBg: '#45D1F4',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: '#FBFBFB',
          cellColor: '#828282',
          cellHeight: 41,
          footBg: 'white',
          theadbold: true,
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          iconColor: "#0099CB",
          columnsWidth: widths,
        }
      });
      searchResultList.create();
      that.searchResultList = searchResultList;


      searchResultList.getPageData = function (pageNumber, gotData) {
        var start = (pageNumber - 1) * 16;
        var end = pageNumber * 16 - 1;

        var options = {
          start: start,
          end: end,
          field_name: that.searchSelect.getValue(),
          search_text: that.searchText
        };
        api.getList(options, function (data, allCount) {
          that.ResultForSinpleGrouping = data;
          var allCount = allCount
          that.searchResultList.onTotalCount(Math.ceil(allCount/2));
          gotData(that.formListDataForSearchResultList(data, pageNumber));
          that.updateSearchResultListCheckbox();
        });
      };
      searchResultList.create();
      that.searchResultList = searchResultList;
    },
    bindEvent: function () {
      var that = this;
      $("#trendAnalysis_option_search_inputModel .option_search_inputModel_button").unbind("click").click(function () {
        var result;
        var search_name = $("#trendAnalysis_option_search_inputModel input").val();
        that.searchText = search_name;
        that.searchResultList.update()
      });
      $('#trendAnalysis_ResultList').unbind("click").on('click', "input[name='searchResult']", function (ev) {
        //选择逻辑，与过滤框内容同步

        var SelectArray = that.getGroupingArray();
        if($(ev.target).is(":checked")){
          SelectArray.push($(ev.target).data("key") + "");
        }else{
          SelectArray = SelectArray.filter(function(item){
            return item !== ($(ev.target).data("key") + "")
          });
        }
        that.updateGroupingArray(SelectArray);
        that.updateFilterInput();
      });
      //过滤条件间隔输入
      var _timer = {};
      function delay_till_last(id, fn, wait) {
        if (_timer[id]) {
          window.clearTimeout(_timer[id]);
          delete _timer[id];
        }

        return _timer[id] = window.setTimeout(function () {
          fn();
          delete _timer[id];
        }, wait);
      }
      $("#trendAnalysis_FilterInput").keyup(function () {
        delay_till_last('trendAnalysis_FilterInput_writting', function () {
          var result = $("#trendAnalysis_FilterInput").val();
          that.updateGroupingArray(result.split(","));
          that.updateSearchResultListCheckbox();
        }, 500);
      });
      $("#trendAnalysis_dialog_confirm").unbind("click").click(function () {
        that.dialog.close();
        that.callback && that.callback(that.groupingArray);
      });
    },
    formListDataForSearchResultList: function (data, pageNumber) {
      var list_data = [];
      for (var i = 0; i < data.length; i = i + 2) {
        var record = this.formListRowDataForSearchResultList(data, i, pageNumber);
        list_data.push(record);
      }
      return list_data;
    },
    formListRowDataForSearchResultList: function (Data, i, pageNumber) {
      var that = this;
      var label1, label2, label3, label4, label5, label6;
      if (Data[i] || (Data[i] == "")) {
        label1 = (pageNumber - 1) * 16 + i + 1;
        label2 = '<input name="searchResult" type="checkbox" ' +
          'data-key="' + Data[i] + '" ' +
          'data-leftright="left" ' + '>';
        label3 = '<div class="scrollBarList_span" title="' + Data[i] + '">' +
          '<input type="text" readonly value="' + Data[i] + '"/>' +
          '</div>';
      } else {
        label1 = "";
        label2 = "";
        label3 = "";
      }
      if (Data[i + 1] || (Data[i + 1] == "")) {
        label4 = (pageNumber - 1) * 16 + i + 2;
        label5 = '<input name="searchResult" type="checkbox" ' +
          'data-key="' + Data[i + 1] + '" ' +
          'data-leftright="right" ' + '>';
        label6 = '<div class="scrollBarList_span" title="' + Data[i + 1] + '">' +
          '<input type="text" readonly value="' + Data[i + 1] + '"/>' +
          '</div>';
      } else {
        label4 = "";
        label5 = "";
        label6 = "";
      }
      var arr = [{label: label1}, {label: label2}, {label: label3}, {label: label4}, {label: label5}, {label: label6}];
      return arr;
    },
    getGroupingArray: function(){
      var that = this;
      var result;
      var grouping;
      for (var i = 0; i < that.groupingArray.length; i++) {
        grouping = that.groupingArray[i];
        if (grouping.name == that.searchSelect.getKey()) {
          result = grouping.selected ;
          break;
        }
      }
      return result;
    },
    updateGroupingArray: function (result) {
      var that = this;
      var grouping;
      for (var i = 0; i < that.groupingArray.length; i++) {
        grouping = that.groupingArray[i];
        if (grouping.name == that.searchSelect.getKey()) {
          grouping.selected = result;
          break;
        }
      }
    },
    updateFilterInput: function () {
      var that = this;
      var result = [];
      var grouping;
      for (var i = 0; i < that.groupingArray.length; i++) {
        grouping = that.groupingArray[i];
        if (grouping.name == that.searchSelect.getKey()) {
          result = grouping.selected || [];
          break;
        }
      }
      var text = result.join(",");
      $("#trendAnalysis_FilterInput").val(text);
    },
    updateSearchResultListCheckbox: function () {
      var that = this;
      var result = [];
      var grouping;
      result = that.getGroupingArray();
      $("#trendAnalysis_ResultList input[name='searchResult']").removeAttr("checked").prop("checked", false);
      $("#trendAnalysis_ResultList input[name='searchResult']").each(function(index,el){
        var key = $(el).data("key") + "";
        if(result.some(function(item){
          return item === key
          })){
          $("#trendAnalysis_ResultList input[name='searchResult'][data-key='" + key + "']").removeAttr("checked").prop("checked", true);
        }
      });
    },
  };
  var message = {
    initParm: function () {
      var that = this;
    },
    openDialog: function (text) {
      var that = this;
      var dialog = new PopupDialog({
        url: 'content/trendAnalysis/messageDialog.html',
        width: 400,
        height: 180,
        context: that,
        callback: function () {
          that.initParm();
          that.initContent(text);
          that.bindEvent();
        }
      });
      dialog.open();
      that.dialog = dialog;
    },
    initContent: function (text) {
      var that = this;
      $("#trendAnalysis_messageDialog").text(text);
    },
    bindEvent: function () {
      var that = this;
      $("#trendAnalysis_dialog_confirm").unbind("click").click(function () {
        that.dialog.close();
      });
    },
  };
  var api = {
    getQuota: function (callback) {
      var that = this;
      var url = aquadaas_host + "/aquadaas/rest/jsonfile/content/analytics_index_info_field_mapping";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType: "application/json",
        dataType: "json",
      }).done(function (data, status, xhr) {
        if (!data) {
          data = {};
        }
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        callback && callback();
      });
      return result;
    },
    getList: function (options, callback) {
      var that = this;
      var url = aquadaas_host + "/aquadaas/rest/analytics/fieldvalue";
      url = url + "?field_name=" + options.field_name;
      url = url + "&start=" + options.start;
      url = url + "&end=" + options.end;
      if(options.search_text){
        url = url + "&filter_value=" + options.search_text;
      }
      url = url + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
      var result = null;
      var ajax_options = {
        type: "GET",
        async: true,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType: "application/json",
        dataType: "json",
      };
      $.ajax(ajax_options).done(function (data, status, xhr) {
        if (!data) {
          data = [];
        }
        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
        callback && callback(data,totalCount);
      }).fail(function (jqXHR, textStatus) {
        callback && callback([]);
      });
      return result;
    },
  }
  return lib
})(jQuery)