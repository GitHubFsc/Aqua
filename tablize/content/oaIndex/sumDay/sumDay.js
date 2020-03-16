var OASumDay = (function($){
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
      for(var i = 0, len = data.length; i < len; i+=1){
        var group = data[i];
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
          };
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

  function findKeyValue(data, key){
    var val = null;
    var dataGroup = null;
    for(var i = 0, len = FieldKeyGroups.length; i < len; i+=1){
      var keyGroup = FieldKeyGroups[i];
      if(keyGroup.indexOf(key) > -1){
        dataGroup = data[i];
        break;
      }
    }
    if(dataGroup != null){
      val = dataGroup[key];
    }
    return val;
  }

  var sumDay = {
    init: function(){
      var self = this;
      this.datePicker = new DatePicker({
        containerId: 'oa-sum-day-datepicker',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        editable: false
      });
      this.datePicker.onChange = function(){
        self.onChooseDate();
      };
      var date = new Date();
      getFieldMapping(function(){
        self.datePicker.setCurrDate({
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate()
        });
      });
    },

    onChooseDate: function(){
      var date = this.datePicker.getDateStr();
      this.drawSummaryList(date);
    },

    drawSummaryList: function(date){
      var self = this;
      var param = {
        date: date
      };
      this.getSummaryData(param, function(data){
        $('#oa-sum-day-main-activity').find('.oa-sum-day-main-num')
          .text(
            findKeyValue(data, 'sbas_1150') + findKeyValue(data, 'sbas_1175')
           );
        $('#oa-sum-day-main-newp').find('.oa-sum-day-main-num').text(findKeyValue(data, 'sbas_1000') + getFieldUnit('sbas_1000'));
        $('#oa-sum-day-main-tcactive').find('.oa-sum-day-main-num')
          .text(
            Math.round(findKeyValue(data, 'sbas_1000')/findKeyValue(data, 'sbas_1150'))
           );
        $('#oa-sum-day-main-pcactive').find('.oa-sum-day-main-num').text(findKeyValue(data, 'sbas_1225') + getFieldUnit('sbas_1225'));
        // $('#oa-sum-day-main-newp').find('.oa-sum-day-main-num').text(data.userMap[PKeys.indexOf('sbas_1')]);
        // $('#oa-sum-day-main-tcactive').find('.oa-sum-day-main-num').text(data.actionMap[CKeys.indexOf('sbas_13')]);
        // $('#oa-sum-day-main-pcactive').find('.oa-sum-day-main-num').text(data.userMap[PKeys.indexOf('sbas_2')]);
        // $('#oa-sum-day-main-activity').find('.oa-sum-day-main-num').text(data.activity + '%');
        // self.drawActdegRing(data.activity);
        // $('.day-sum-total-pcount').each(function(i, item){
          // $(item).children('.day-sum-total-num').text(data.userMap[i]);
        // });
        // $('.day-sum-total-tcount').each(function(i, item){
          // $(item).children('.day-sum-total-num').text(data.actionMap[i]);
        // });
        var colNum = 6;
        var frag = document.createDocumentFragment();
        FieldKeyGroups.forEach(function(keys, i){
          var dataGroup = data[i];
          var $tbody = $('<table><tbody></tbody></table>')
            .attr('cellspacing', '14 10').attr('cellpadding', '0').appendTo(frag).children('tbody');
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
                     $('<div>').addClass('day-sum-total-num').append(dataGroup[key] != null ? dataGroup[key] + getFieldUnit(key) : '')
                   )
                 );
              }
            }
          }
        });
        $('#oaSumDay .oa-sumday-layout-right').empty().append(frag);
        var heightMax = 0;
        $('#oaSumDay .oa-sumday-layout-right .day-sum-total-pcount').each(function(){
            var height = $(this).height();
            if(height > heightMax){
                heightMax = height;
            }
        }).css('height', heightMax);
        // var pLen = PKeys.length;
        // var pRows = Math.ceil(pLen/colNum);
        // var cLen = CKeys.length;
        // var cRows = Math.ceil(cLen/colNum);
        // var $tbody = $('#oa-sum-day-details').children('tbody').empty();
        // var pi = 0;
        // for(var i = 0; i < pRows; i += 1){
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

    getSummaryData: function(param, callback){
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
      url += '&begin_time=' + encodeURIComponent(param.date + 'T00:00:00+0800');
      url += '&end_time=' + encodeURIComponent(param.date + 'T23:59:59+0800');
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(newRaw){
        try{
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

          // var actRef = 1;
          // var pRef = actRef + actKey.length;
          // var cRef = pRef + PKeys.length;

          // var dateSum = raw[0];
          // data.activity = Math.round(dateSum[actRef] * 100);
          // for (var i = 0, len = PKeys.length; i < len; i += 1) {
            // data.userMap.push(dateSum[pRef + i]);
          // }
          // for (var j = 0, jlen = CKeys.length; j < jlen; j += 1) {
            // data.actionMap.push(dateSum[cRef + j]);
          // }
          var dateSum = newRaw[0];
          var data = [];
          for(var i = 0, len = FieldKeyGroups.length; i < len; i+=1){
            var keys = FieldKeyGroups[i];
            var dataGroup = {};
            keys.forEach(function(key){
              dataGroup[key] = dateSum[key];
            });
            data[i] = dataGroup;
          }
          if ( typeof callback == 'function') {
            callback(data);
          }

        }catch(e){
          console.log(e.message);
        }
      });
    },

    drawActdegRing: function(num){
      var cs = document.createElement('canvas');
      cs.width = 86;
      cs.height = 86;
      $('#oa-sum-day-actdeg-pie').empty().append(cs);
      var ct = cs.getContext('2d');
      ct.lineWidth = 7;
      ct.beginPath();
      ct.arc(43, 43, 36, -0.5 * Math.PI, 1.5 * Math.PI);
      ct.strokeStyle = '#ffda90';
      ct.stroke();
      ct.beginPath();
      var rdeg = num/100 * 2 * Math.PI;
      ct.arc(43, 43, 36, -0.5 * Math.PI, rdeg - 0.5 * Math.PI);
      ct.strokeStyle = '#fea236';
      ct.lineCap = 'round';
      ct.stroke();
      ct.font = '20px bold';
      ct.fillStyle = '#ff992c';
      ct.textBaseline = 'middle';
      ct.textAlign = 'center';
      ct.fillText(num + '%', 43, 43);
    },
  };
  return sumDay;
})(jQuery);

OASumDay.init();
