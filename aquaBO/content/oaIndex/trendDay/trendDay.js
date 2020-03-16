var OATrendDay = (function($){
  var calendarStyles = {
    width: 250,
    navTitleHeight: 25,
    navTitleBgColor: 'rgb(84,190,245)',
    datesViewHeight: 160,
    datesViewGridColor: 'rgb(226,226,226)',
    datesViewCellColor: 'rgb(254,254,254)',
    weekdaysHeight: 22,
    weekdaysColor: 'rgb(74,174,237)',
    currMonthColor: 'rgb(121,121,121)',
    nonCurrMonthColor: 'rgb(200,200,200)',
    align: 'right'
  };

  var dateInputStyles = {
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: '0',
  };

  var colorMap = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00',
    '#000000', '#70DB93', '#5C3317', '#9F5F9F', '#B5A642', '#D9D919',
    '#A67D3D', '#8C7853', '#5F9F9F', '#D98719', '#B87333', '#FF7F00',
    '#42426F', '#5C4033', '#2F4F2F', '#4A766E', '#4F4F2F', '#9932CD',
    '#871F78', '#6B238E', '#2F4F4F', '#97694F', '#7093DB', '#855E42'];

  var actKey = ['sbas_3'];

  var PKeys = [
    'sbas_23', 'sbas_24', 'sbas_25', 'sbas_26', 'sbas_27', 'sbas_28', 'sbas_29', 'sbas_30', 'sbas_31',
    'sbas_32', 'sbas_33', 'sbas_1', 'sbas_2', 'sbas_4', 'sbas_5', 'sbas_6', 'sbas_12', 'sbas_7',
    'sbas_8', 'sbas_9', 'sbas_10', 'sbas_11'
  ];

  var CKeys = [
    'sbas_34', 'sbas_35', 'sbas_36', 'sbas_37', 'sbas_38', 'sbas_39', 'sbas_40', 'sbas_41', 'sbas_22', 'sbas_42', 'sbas_13',
    'sbas_14', 'sbas_15', 'sbas_16', 'sbas_17', 'sbas_18', 'sbas_19', 'sbas_20', 'sbas_21'
  ];

  var FieldNames = {};
  var FieldUnits = {};
  var CheckerIndexes = [];

  function getFieldMapping(callback){
    // var url = AquaDaaSHost + '/aquadaas/rest/userinfo/fieldmapping?mapping_name=analytics_index_info_field_mapping';
    var url = AquaDaaSHost + '/aquadaas/rest/jsonfile/content/analytics_index_info_field_mapping';
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      dataType: 'json',
    }).done(function(data){
      PKeys = [];
      CKeys = [];
      // FieldNames = data;
      // for(var i in data){
        // if(data.hasOwnProperty(i)){
          // var item = data[i];
          // var name = item.desc;
          // FieldNames[i] = name;
          // if(name.indexOf('次数') > -1){
            // CKeys.push(i);
          // } else if(name != '活跃度'){
            // PKeys.push(i);
          // }
        // }
      CheckerIndexes = [];
      for(var i = 0, len = data.length; i < len; i+=1){
        var group = data[i];
        var indexGroup = {};
        indexGroup.label = group.analytics_group;
        var groupFields = group.analytics_field;
        for(var key in groupFields){
          if(groupFields.hasOwnProperty(key)){
            var index = groupFields[key];
            FieldNames[key] = index.desc;
            if(index.unit != null){
              FieldUnits[key] = i18n('OPERATIONAL_ANALYSIS_UNIT_CONVERSION_' + index.unit);
            }
            var checkerIndex = {
              label: index.desc,
              key: key,
              group: indexGroup
            };
            CheckerIndexes.push(checkerIndex);
            PKeys.push(key);
          };
        }
      }
      if(typeof callback == 'function'){
        callback();
      }
    });
  }

  function getFieldUnit(key){
    var unit = '';
    if(FieldUnits[key] != null){
      unit = FieldUnits[key];
    }
    return unit;
  }

  function preTimeZero(str){
    if(str.length < 2){
      str = '0' + str;
    }
    return str;
  }

  function getSelector(containerId, options) {
    var selector = new StyledSelector({
        containerId: containerId,
        styles: {
            optionHeight: 25
        },
        options: options
    });
    selector.getCloseIcon = function() {
        return '<div class="styled-selector-up-arrow"></div>';
    };
    selector.getOpenIcon = function() {
        return '<div class="styled-selector-down-arrow"></div>';
    };
    return selector;
  }


  var iTrend = {
    init: function(){
      var self = this;
      this.userChart = echarts.init(document.getElementById('day-sum-pcount-chart'));
      // this.actionChart = echarts.init(document.getElementById('day-sum-tcount-chart'));
      this.scaleSelect = getSelector('day-sum-scale-select',[{
        label: i18n('OA_INDEX_SCALE_LINEAR'),
        value: 'linear'
      }, {
        label: i18n('OA_INDEX_SCALE_LOG'),
        value: 'log'
      }]);
      this.scaleSelect.create();
      this.scaleSelect.onChange = function(){
        // self.setChartScale();
        self.drawUserTrend();
      };
      this.startPicker = new DatePicker({
        containerId: 'oa-trend-start-datepicker',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        editable: false
      });
      this.startPicker.onChange = function(){
        self.onChooseDate();
      };
      this.endPicker = new DatePicker({
        containerId: 'oa-trend-end-datepicker',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        editable: false
      });
      this.endPicker.onChange = function(){
        self.onChooseDate();
      };
      var date = new Date();
      var datey = date.getFullYear();
      var datem = date.getMonth();
      var dated = date.getDate();
      getFieldMapping(function(){
        self.setUserChecker();
        // self.setActionChecker();
        self.startPicker.setCurrDate({
          year: datey,
          month: datem,
          date: 1
        });
        self.endPicker.setCurrDate({
          year: datey,
          month: datem,
          date: dated
        });
      });
    },

    setChartScale: function(){
      var option = {
        yAxis: {
          type: '',
          axisLabel: {
            color: '#8696a9'
          },
          axisLine: {
            lineStyle: {
              color: '#d6d6d6'
            }
          },
        }
      };
      var scale = this.scaleSelect.getValue();
      switch(scale){
        case 'log':
          option.yAxis.type = 'log';
          break;
        default:
          option.yAxis.type = 'value';
          break;
      }
      try{
        this.userChart.setOption(option);
      }catch(e){
        console.log(e.message);
      }
    },

    onChooseDate: function(){
      var start = this.startPicker.getDateStr();
      var end = this.endPicker.getDateStr();
      if(start <= end){
        this.drawUserTrend();
        // this.drawActionTrend();
      }
    },

    getQueryTimeStr: function(){
      var startStr = this.startPicker.getDateStr();
      var begin_time = startStr + 'T00:00:00+0800';
      var endStr = this.endPicker.getDateStr();
      var end_time = endStr + 'T23:59:59+0800';
      return '&begin_time=' + encodeURIComponent(begin_time) + '&end_time=' + encodeURIComponent(end_time);
    },

    setUserChecker: function(){
      var self = this;
      // var indexes = PKeys.map(function(key) {
        // var ret = {
          // checked: false
        // };
        // ret.key = key;
        // ret.label = FieldNames[key];
        // return ret;
      // });
      var indexes = CheckerIndexes;
      indexes[0] != null ? indexes[0].checked = true : null;
      var checker = new IndexChecker({
        indexes: indexes,
        title: i18n('DAY_SUM_INDEX_CHECKER'),
      });
      checker.onSelect = function() {
        self.drawUserTrend();
      };
      self._userChecker = checker;
      $('#day-sum-pcount-indexes').on('click', function() {
        self._userChecker.open();
      });
    },

    drawUserTrend: function(){
      var self = this;
      // this.getUserTrendData(function(data){
        // self.drawUserChart(data);
        // self.drawUserList(data);
      // });
      var selected = self._userChecker.getSelected();
      var keys = selected.map(function(index){
        return index.key;
      });
      if(keys.length > 0){
        self.getUserTrendData(keys, function(_keys, data){
          self.drawUserChart(_keys, data);
          self.drawUserList(_keys, data);
        });
      }
    },

    drawUserChart: function(keys, data){
      var option = {};
      option.color = colorMap;
      option.tooltip = {trigger: 'axis'};
      option.legend = {
        type: 'scroll',
        orient: 'vertical',
        // left: 1040,
        left: 1000,
        textStyle: {
          color: '#5b5b5b',
          padding: 2,
        },
        data: []
      };
      option.grid = {
        left: 20,
        width: 960,
        containLabel: true,
      };
      option.yAxis = {
        type: 'value',
        axisLabel: {
          color: '#8696a9'
        },
        axisLine: {
          lineStyle: {
            color: '#d6d6d6'
          }
        },
      };
      var scale = this.scaleSelect.getValue();
      switch(scale){
        case 'log':
          option.yAxis.type = 'log';
          break;
        default:
          break;
      }
      option.xAxis = {
        type: 'category',
        boundaryGroup: false,
        axisLabel: {
          color: '#8696a9'
        },
        axisLine: {
          lineStyle: {
            color: '#d6d6d6'
          }
        },
        data: []
      };
      option.series = [];
      var sample = data[0];
      var sampleTimes = sample.map(function(item){
        var mstr = item.timeSlot.substr(5,2);
        var dstr = item.timeSlot.substr(8,2);
        var label = Number(mstr) + '月' + Number(dstr) + '日';
        return label;
      });
      option.xAxis.data = sampleTimes;

      var pNum = keys.length;
      for(var i = 0; i < pNum; i+=1){
        var label = FieldNames[keys[i]];
        option.legend.data.push(label);
        option.series.push({
          name: label,
          type: 'line',
          data: data[i].map(function(item){
            if(option.yAxis.type == 'log'){
              return item.data > 0 ? item.data : '';
            } else {
              return item.data;
            }
          })
        });
      }
      this.userChart.setOption(option, true);
    },

    drawUserList: function(keys, data){
      var $list = $('<table>').attr('cellspacing', '0').attr('cellpadding', '0').addClass('day-sum-data-list');
      var sample = data[0];
      var $header = $('<tr>').append(
        $('<td>').append('<div class="day-sum-list-column-wide">')
      ).appendTo($list);
      for(var i = 0, len = sample.length; i < len; i += 1){
        var timem = sample[i].timeSlot.substr(5, 2);
        var timed = sample[i].timeSlot.substr(8, 2);
        var timeLabel = Number(timem) + '月' + Number(timed) + '日';
        $('<td>').append(
          $('<div>').addClass('day-sum-list-column-norm').append(timeLabel)
        ).appendTo($header);
      }
      for(var j = 0, jlen = data.length; j < jlen; j+=1){
        var label = FieldNames[keys[j]];
        var unit = getFieldUnit(keys[j]);
        var $row = $('<tr>').append(
          $('<td>').append(label)
        ).appendTo($list);
        var dataItem = data[j];
        for(var k = 0, klen = dataItem.length; k < klen; k+=1){
          var curr = dataItem[k].data;
          var numClass = '';
          if(k == 0){
            numClass = 'trend-num-equal';
          } else {
            var prev = dataItem[k - 1].data;
            if(curr > prev){
              numClass = 'trend-num-up';
            } else if(curr < prev) {
              numClass = 'trend-num-down';
            } else {
              numClass = 'trend-num-equal';
            }
          }
          $row.append(
            $('<td>').append($('<span>').addClass(numClass).append(curr + unit))
              .append($('<div>').addClass('trend-num-indicator'))
          );
        }
      }
      $('#day-sum-pcount-list').mCustomScrollbar('destroy').empty().append($list).mCustomScrollbar({
        axis: 'yx'
      });
    },

    getUserTrendData: function(keys, callback){
      var data = [];
      // for(var i = 0; i < 22; i+=1){
        // var item = [];
        // for(var j = 0; j < 24; j+=1){
          // item.push({
            // timeSlot: j,
            // data: Math.round(Math.random() * 30)
          // });
        // }
        // data.push(item);
      // }
      var url = AquaDaaSHost + '/aquadaas/rest/analytics/day';
      url += '?measure=' + keys.join(',');
      // url += '&dimension=';
      url += this.getQueryTimeStr();
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(raw){
        var pRef = 1;
        var rlen = raw.length;
        var pNum = keys.length;
        for(var i = 0; i < pNum; i+=1){
          var item = [];
          var key = keys[i];
          for(var j = 0; j < rlen; j+=1){
            item.push({
              timeSlot: raw[j].eventtime,//raw[j][0],
              data: raw[j][key]//raw[j][pRef + i]
            });
          }
          data.push(item);
        }

        if(typeof callback == 'function'){
          callback(keys, data);
        }
      });
    },

    setActionChecker: function(){
      var self = this;
      var indexes = CKeys.map(function(key) {
        var ret = {
          checked: false
        };
        ret.key = key;
        ret.label = FieldNames[key];
        return ret;
      });
      indexes[0] != null ? indexes[0].checked = true : null;
      var checker = new IndexChecker({
        indexes: indexes,
        title: i18n('DAY_SUM_INDEX_CHECKER'),
      });
      checker.onSelect = function() {
        self.drawActionTrend();
      };
      self._actionChecker = checker;
      $('#day-sum-tcount-indexes').on('click', function(){
        self._actionChecker.open();
      });
    },

    drawActionTrend: function(){
      var self = this;
      // this.getActionTrendData(function(data){
        // self.drawActionChart(data);
        // self.drawActionList(data);
      // });
      var selected = self._actionChecker.getSelected();
      var keys = selected.map(function(index){
        return index.key;
      });
      if(keys.length > 0){
        self.getActionTrendData(keys, function(_keys, data){
          self.drawActionChart(_keys, data);
          self.drawActionList(_keys, data);
        });
      }
    },

    drawActionChart: function(keys, data){
      var option = {};
      option.color = colorMap;
      option.tooltip = {trigger: 'axis'};
      option.legend = {
        type: 'scroll',
        orient: 'vertical',
        // left: 1040,
        left: 1000,
        textStyle: {
          color: '#5b5b5b',
          padding: 2,
        },
        data: []
      };
      option.grid = {
        left: 20,
        width: 960,
        containLabel: true,
      };
      option.yAxis = {
        type: 'value',
        axisLabel: {
          color: '#8696a9'
        },
        axisLine: {
          lineStyle: {
            color: '#d6d6d6'
          }
        },
      };
      option.xAxis = {
        type: 'category',
        boundaryGroup: false,
        axisLabel: {
          color: '#8696a9'
        },
        axisLine: {
          lineStyle: {
            color: '#d6d6d6'
          }
        },
        data: []
      };
      option.series = [];
      var sample = data[0];
      var sampleTimes = sample.map(function(item){
        var mstr = item.timeSlot.substr(5,2);
        var dstr = item.timeSlot.substr(8,2);
        var label = Number(mstr) + '月' + Number(dstr) + '日';
        return label;
      });
      option.xAxis.data = sampleTimes;

      var cNum = keys.length;
      for(var i = 0; i < cNum; i+=1){
        var label = FieldNames[keys[i]];
        option.legend.data.push(label);
        option.series.push({
          name: label,
          type: 'line',
          data: data[i].map(function(item){
            return item.data;
          })
        });
      }
      this.actionChart.setOption(option, true);
    },

    drawActionList: function(keys, data){
      var $list = $('<table>').attr('cellspacing', '0').attr('cellpadding', '0').addClass('day-sum-data-list');
      var sample = data[0];
      var $header = $('<tr>').append(
        $('<td>').append('<div class="day-sum-list-column-wide">')
      ).appendTo($list);
      for(var i = 0, len = sample.length; i < len; i += 1){
        var timem = sample[i].timeSlot.substr(5, 2);
        var timed = sample[i].timeSlot.substr(8, 2);
        var timeLabel = Number(timem) + '月' + Number(timed) + '日';
        $('<td>').append(
          $('<div>').addClass('day-sum-list-column-norm').append(timeLabel)
        ).appendTo($header);
      }
      for(var j = 0, jlen = data.length; j < jlen; j+=1){
        var label = FieldNames[keys[j]];
        var $row = $('<tr>').append(
          $('<td>').append(label)
        ).appendTo($list);
        var dataItem = data[j];
        for(var k = 0, klen = dataItem.length; k < klen; k+=1){
          var curr = dataItem[k].data;
          var numClass = '';
          if(k == 0){
            numClass = 'trend-num-equal';
          } else {
            var prev = dataItem[k - 1].data;
            if(curr > prev){
              numClass = 'trend-num-up';
            } else if(curr < prev) {
              numClass = 'trend-num-down';
            } else {
              numClass = 'trend-num-equal';
            }
          }
          $row.append(
            $('<td>').append($('<span>').addClass(numClass).append(curr))
              .append($('<div>').addClass('trend-num-indicator'))
          );
        }
      }
      $('#day-sum-tcount-list').mCustomScrollbar('destroy').empty().append($list).mCustomScrollbar({
        axis: 'yx'
      });
    },

    getActionTrendData: function(keys, callback){
      var data = [];
      // for(var i = 0; i < 19; i+=1){
        // var item = [];
        // for(var j = 0; j < 24; j+=1){
          // item.push({
            // timeSlot: j,
            // data: Math.round(Math.random() * 30)
          // });
        // }
        // data.push(item);
      // }
      var url = AquaDaaSHost + '/aquadaas/rest/analytics/day';
      url += '?measure=' + keys.join(',');
      // url += '&dimension=';
      url += this.getQueryTimeStr();
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(raw){
        var cRef = 1;
        var rlen = raw.length;
        var cNum = keys.length;
        for(var i = 0; i < cNum; i+=1){
          var item = [];
          var key = keys[i];
          for(var j = 0; j < rlen; j+=1){
            item.push({
              timeSlot: raw[j].eventtime,//raw[j][0],
              data: raw[j][key]//raw[j][cRef + i]
            });
          }
          data.push(item);
        }

        if(typeof callback == 'function'){
          callback(keys, data);
        }
      });
    },

  };
  return iTrend;
})(jQuery);
OATrendDay.init();
