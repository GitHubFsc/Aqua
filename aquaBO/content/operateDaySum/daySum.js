var operateDaySum = (function($){

  var colorMap = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00',
    '#000000', '#70DB93', '#5C3317', '#9F5F9F', '#B5A642', '#D9D919',
    '#A67D3D', '#8C7853', '#5F9F9F', '#D98719', '#B87333', '#FF7F00',
    '#42426F', '#5C4033', '#2F4F2F', '#4A766E', '#4F4F2F', '#9932CD',
    '#871F78', '#6B238E', '#2F4F4F', '#97694F', '#7093DB', '#855E42'];

  var MeasureKey = {
    sbas_1: '新用户数',        sbas_2: '活跃用户数',     sbas_3: '活跃度',           sbas_4: '核心课观看人数',
    sbas_5: '练习课观看人数',  sbas_6: '练习课互动人数',  sbas_7: '知识课观看人数',   sbas_8: '核心课报名人数',
    sbas_9: '练习课报名人数',  sbas_10: '知识课报名人数', sbas_11: '练习课预约人数',  sbas_12: '产品包购买人数',
    sbas_13: '活跃用户次数',   sbas_14: '核心课观看次数', sbas_15: '练习课观看次数',  sbas_16: '练习课互动次数',
    sbas_17: '知识课观看次数', sbas_18: '核心课报名次数', sbas_19: '练习课报名次数',  sbas_20: '知识课报名次数',
    sbas_21: '练习课预约次数', sbas_22: '产品包购买次数', sbas_23: '观看人数',        sbas_24: '互动人数',
    sbas_25: '课程报名人数',   sbas_26: '课程预约人数',   sbas_27: '完成作业人数',    sbas_28: '完成测试题人数',
    sbas_29: '讨论区发言人数', sbas_30: '论坛发言人数',   sbas_31: '手工签到人数',    sbas_32: '绑定手机人数',
    sbas_33: '用户登录人数',   sbas_34: '观看次数',       sbas_35: '互动次数',       sbas_36: '课程报名次数',
    sbas_37: '课程预约次数',   sbas_38: '完成作业次数',   sbas_39: '完成测试题次数',  sbas_40: '讨论区发言次数',
    sbas_41: '论坛发言次数',   sbas_42: '用户登录次数',   sbas_43: '手工签到次数',    sbas_44: '绑定手机次数',
    sbas_45: '慕课观看人数',   sbas_46: '慕课观看次数',   sbas_47: '普通课程观看人数', sbas_48: '普通课程观看次数',
    sbas_49: '微课观看人数',   sbas_50: '微课观看次数'
  };

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
  var FieldKeyGroups = [];
  var CheckerIndexes = [];

  function preTimeZero(str){
    if(str.length < 2){
      str = '0' + str;
    }
    return str;
  }

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
      actKey = [];
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
        var keyGroup = [];
        for(var key in groupFields){
          if(groupFields.hasOwnProperty(key)){
            var index = groupFields[key];
            FieldNames[key] = index.desc;
            if(index.unit != null){
              FieldUnits[key] = i18n('OPERATIONAL_ANALYSIS_UNIT_CONVERSION_' + index.unit);
            }
            keyGroup.push(key);
            var checkerIndex = {
              label: index.desc,
              key: key,
              group: indexGroup
            };
            CheckerIndexes.push(checkerIndex);
            PKeys.push(key);
          }
        }
        FieldKeyGroups.push(keyGroup);
      }
      FieldKeyGroups = FieldKeyGroups.filter(function(group){
        return group.length > 0;
      });
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

  var daySum = {
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
      getFieldMapping(function(){
        self.drawSummary();
        self.setUserChecker();
        // self.setActionChecker();
        self.drawUserTrend();
        // self.drawActionTrend()
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

    drawSummary: function(){
      this.getSummaryData(function(data){
        // $('.day-sum-act-deg-label').text(FieldNames[actKey[0]]);
        // $('.day-sum-act-deg-num').text(data.activity + '%');
        // $('.day-sum-total-pcount').each(function(i, item){
          // $(item).children('.day-sum-total-num').text(data.userMap[i]);
        // });
        // $('.day-sum-total-tcount').each(function(i, item){
          // $(item).children('.day-sum-total-num').text(data.actionMap[i]);
        // });
        var colNum = 11;
        var frag = document.createDocumentFragment();
        FieldKeyGroups.forEach(function(keys, i){
          var dataGroup = data[i];
          if(dataGroup != null){
            var $tbody = $('<table><tbody></tbody></table>')
              .attr('cellspacing', '12 10').attr('cellpadding', '0').appendTo(frag).children('tbody');
            var kLen = keys.length;
            var kRows = Math.ceil(kLen/colNum);
            for(var k = 0; k < kRows; k+=1){
              var $row = $('<tr>').appendTo($tbody);
              for(var j = 0; j < colNum; j+=1){
                var $td = $('<td>').appendTo($row);
                var key = keys[k * colNum + j];
                if(key != null){
                  $td.append(
                   $('<div>').addClass('day-sum-total-pcount')
                     .append(
                       $('<div>').addClass('day-sum-total-label').append(FieldNames[key])
                     ).append(
                       $('<div>').addClass('day-sum-total-num').append(dataGroup[key] + getFieldUnit(key))
                     )
                   );
                }
              }
            }
          }
        });
        $('#day-sum-totals').empty().append(frag);
        // var pLen = PKeys.length;
        // var pRows = Math.ceil((pLen + 4)/colNum);
        // var cLen = CKeys.length;
        // var cRows = Math.ceil(cLen/colNum);
        // var $tbody = $('.day-sum-total-table').eq(0).children('tbody');
        // var pi = 0;
        // var $row = $tbody.children('tr').eq(0);
        // for(var i = 0; i < colNum - 2; i += 1){
          // var $td = $row.children('td').eq(i+1);
          // $td.find('.day-sum-total-label').text(FieldNames[PKeys[pi]]);
          // $td.find('.day-sum-total-num').text(data.userMap[pi]);
          // pi += 1;
        // }
        // $row = $tbody.children('tr').eq(1);
        // for(var i = 0; i < colNum - 2; i += 1){
          // var $td = $row.children('td').eq(i);
          // $td.find('.day-sum-total-label').text(FieldNames[PKeys[pi]]);
          // $td.find('.day-sum-total-num').text(data.userMap[pi]);
          // pi += 1;
        // }
        // for(var i = 0; i < pRows - 2; i += 1){
          // $row = $('<tr>').appendTo($tbody);
          // for(var j = 0; j < colNum; j += 1){
            // var $td = $('<td>').appendTo($row);
            // if(pi < pLen){
               // $td.append(
                 // $('<div>').addClass('day-sum-total-pcount')
                   // .append(
                     // $('<div>').addClass('day-sum-total-label').append(FieldNames[PKeys[pi]])
                   // ).append(
                     // $('<div>').addClass('day-sum-total-num').append(data.userMap[pi])
                   // )
               // );
            // }
            // pi += 1;
          // }
        // }
        // var ci = 0;
        // for(var i = 0; i < cRows; i += 1){
          // $row = $('<tr>').appendTo($tbody);
          // for(var j = 0; j < colNum; j += 1){
            // var $td = $('<td>').appendTo($row);
            // if(ci < cLen){
               // $td.append(
                 // $('<div>').addClass('day-sum-total-tcount')
                   // .append(
                     // $('<div>').addClass('day-sum-total-label').append(FieldNames[CKeys[ci]])
                   // ).append(
                     // $('<div>').addClass('day-sum-total-num').append(data.actionMap[ci])
                   // )
               // );
            // }
            // ci += 1;
          // }
        // }
      });
    },

    getQueryTimeStr: function(){
      var date = new Date();
      var dateStr = date.getFullYear()
        + '-' + preTimeZero((date.getMonth() + 1).toString())
        + '-' + preTimeZero(date.getDate().toString());
      var begin_time = dateStr + 'T00:00:00+0800';
      var end_time = dateStr + 'T23:59:59+0800';
      return '&begin_time=' + encodeURIComponent(begin_time) + '&end_time=' + encodeURIComponent(end_time);
    },

    getSummaryData: function(callback){
      // var data = {};
      // data.activity = 0;
      // data.userMap = [];
      // data.actionMap = [];
      // for(var i = 0; i < 22; i += 1){
        // data.userMap.push(Math.round(Math.random() * 300));
      // }
      // for(var i = 0; i < 19; i += 1){
        // data.actionMap.push(Math.round(Math.random() * 300));
      // }
      var url = AquaDaaSHost + '/aquadaas/rest/analytics/day';
      // url += '?measure=' + actKey.join(',') + ',' + PKeys.join(',') + ',' + CKeys.join(',');
      url += '?measure=' + FieldKeyGroups.toString();
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
      }).done(function(newRaw){
        newRaw = $.makeArray(newRaw);
        // var raw = newRaw.map(function(json){
          // var arr = [];
          // arr.push(json.eventtime);
          // var keyArr = [].concat(actKey).concat(PKeys).concat(CKeys);
          // for(var i = 0, len = keyArr.length; i < len; i+=1){
            // arr.push(json[keyArr[i]]);
          // }
          // return arr;
        // });
//
        // var actRef = 1;
        // var pRef = actRef + actKey.length;
        // var cRef = pRef + PKeys.length;
//
        // var dateSum = raw[0];
        // data.activity = Math.round(dateSum[actRef] * 100);
        // for(var i = 0, len = PKeys.length; i < len; i+=1){
          // data.userMap.push(dateSum[pRef + i]);
        // }
        // for(var j = 0, jlen = CKeys.length; j < jlen; j+=1){
          // data.actionMap.push(dateSum[cRef + j]);
        // }
        var dateSum = newRaw[0];
        var data = [];
        if(dateSum != null){
          for(var i = 0, len = FieldKeyGroups.length; i < len; i+=1){
            var keys = FieldKeyGroups[i];
            var dataGroup = {};
            keys.forEach(function(key){
              dataGroup[key] = dateSum[key];
            });
            data[i] = dataGroup;
          }
        }
        if(typeof callback == 'function'){
          callback(data);
        }
      });
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
        return item.timeSlot;
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
        $('<td>').append(
          $('<div>').addClass('day-sum-list-column-norm').append(sample[i].timeSlot + '点')
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
      $('#day-sum-pcount-list').empty().append($list).mCustomScrollbar({
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
      var url = AquaDaaSHost + '/aquadaas/rest/analytics/hour';
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
              timeSlot: j,
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
        return item.timeSlot;
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
        $('<td>').append(
          $('<div>').addClass('day-sum-list-column-norm').append(sample[i].timeSlot + '点')
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
      $('#day-sum-tcount-list').empty().append($list).mCustomScrollbar({
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
      var url = AquaDaaSHost + '/aquadaas/rest/analytics/hour';
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
              timeSlot: j,
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
  return daySum;
})(jQuery);
operateDaySum.init();
