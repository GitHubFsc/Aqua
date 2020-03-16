var userAction_Lib = (function ($) {
  var lib = {
    init: function () {
    },
    openQuotaDialog: function (quotaArray, callback) {
      quota.openDialog(quotaArray, callback);
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
  var message = {
    initParm: function () {
      var that = this;
    },
    openDialog: function (text) {
      var that = this;
      var dialog = new PopupDialog({
        url: 'content/userAction/messageDialog.html',
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
      $("#messageDialog").text(text);
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
      var url = aquadaas_host + "/aquadaas/rest/jsonfile/content/user_event_info_field_mapping";
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