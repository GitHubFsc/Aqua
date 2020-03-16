var StatTrend = (function ($) {
  //paasHost = "http://172.16.20.201:8061"


  var servRest = paasHost + paasDomain;
  var advRest = paasHost + paasAdvDomain;
  var dmRoot = paasHost + paasDomain + '/dm';

  var adpSites = [];
  var filterSites = [];



  // @formatter:off
  var colorChoices = ['#5da1c0', '#99cccc', '#0099cc', '#cc3399', '#339933', '#333300', '#336666',
    '#996699', '#666699', '#cccc44', '#ffcc00', '#996699', '#cc0033',
    '#99cc66', '#666633', '#336699', '#999999', '#006600', '#990033',
    '#ed9474', '#ff6666', '#ff0033', '#99cc33', '#99ccff', '#3366cc',
    '#ff9900', '#ff6600', '#33cc99', '#663399', '#669999', '#99cc99'];
  // @formatter:on

  function drawTrendBars($parent, options, getData, filtSet, filtIdSet) {
    $parent.empty();
    $('<div>').attr('id', 'stats-fig-bars-filt')
      .addClass('stats-fig-lb-filt').appendTo($parent);

    var axes = $('<div>').attr('id', 'stats-fig-bars-axes').appendTo($parent);
    var axParam = getAxesParam([]);
    axParam.container = axes;
    axParam.width = axes.width();
    var chartAx = new ChartAxes(axParam);
    chartAx.getAxes();

    var filter = new StyledSelector({
      containerId: 'stats-fig-bars-filt',
      options: options,
      styles: {
        optionHeight: 25,
        iconColor: '#ffffff',
        iconInnerColor: '#2ea2d7',
        fitValue: true,
        fitValueMinWidth: 100,
      }
    });
    filter.create();
    filter.onChange = function () {
      var filtid = this.getValue();
      if (typeof filtIdSet == 'function') {
        filtIdSet(filtid);
      }
      var filtData = getData(filtid) || [];
      var axupdate = getAxesParam(filtData);
      chartAx.update(axupdate);
      drawTrendBarBlocks($parent, filtData, chartAx);
    };
    if (typeof filtSet == 'function') {
      filtSet(filter);
    }
  }

  function drawTrendBarBlocks($parent, data, axes) {
    $('#stats-fig-bar-blocks').remove();
    $('#stats-fig-bar-colinds').remove();
    var frag = document.createDocumentFragment();
    var $blocks = $('<div>').attr('id', 'stats-fig-bar-blocks').appendTo(frag);
    var $indis = $('<div>').attr('id', 'stats-fig-bar-colinds').appendTo(frag);
    var colorNum = colorChoices.length;
    for (var i = 0, len = data.length; i < len; i += 1) {
      var dtitem = data[i];
      var itemBlock = $('<div>').addClass('stats-fig-dati-block')
        .appendTo($blocks);
      var barColor = colorChoices[i % colorNum];
      for (var j = 0, jLen = dtitem.slots.length; j < jLen; j += 1) {
        var sljtem = dtitem.slots[j];
        var barHeight = Math.round(Number(sljtem.count) / axes.pointWeight);
        var timeString = convertTimeString(sljtem.value);
        if (StatTrend.intervalType == 'day') {
          timeString = timeString.substr(0, 10);
        } else {
          timeString = timeString.replace(' ', '<br>');
        }
        $('<div>').addClass('stats-fig-bar').css('background-color', barColor)
          .height(barHeight)
          .css('top', axes.origin.y - barHeight)
          .append(
            $('<div>').addClass('stats-fig-bar-tip').append(sljtem.count)
          ).append(
          $('<div>').addClass('stats-fig-bar-pltime').append(timeString)
        ).appendTo(itemBlock);
      }
      $('<div>').addClass('stats-fig-block-name')
        .css('top', axes.origin.y + 40)
        .append(dtitem.name).appendTo(itemBlock);
      $('<div>').addClass('stats-fig-bar-colind')
        .append(
          $('<div>').css('background-color', barColor)
        ).append(
        $('<div>').append(dtitem.name)
      )
        .appendTo($indis);
    }
    $parent.append(frag);
    var $bars = $('.stats-fig-bar');
    var barNum = $bars.length;
    var contWidth = $('#stats-fig-bar-blocks').width();
    var propMargin = Math.floor((contWidth / barNum - 27) / 2);
    if (propMargin > 25) {
      $bars.css({
        'margin-left': propMargin,
        'margin-right': propMargin
      });
    }
  }

  function drawTrendLines($parent, options, getData, filtSet, filtIdSet) {
    $parent.empty();
    $('<div>').attr('id', 'stats-fig-lines-filt')
      .addClass('stats-fig-lb-filt').appendTo($parent);

    var axes = $('<div>').attr('id', 'stats-fig-lines-axes').appendTo($parent);
    var axParam = getAxesParam([]);
    axParam.container = axes;
    axParam.width = axes.width();
    axParam.height = axes.height();
    var chartAx = new ChartAxes(axParam);
    chartAx.getAxes();

    var filter = new StyledSelector({
      containerId: 'stats-fig-lines-filt',
      options: options,
      styles: {
        optionHeight: 25,
        iconColor: '#ffffff',
        iconInnerColor: '#2ea2d7',
        fitValue: true,
        fitValueMinWidth: 100,
      }
    });
    filter.create();
    filter.onChange = function () {
      var filtid = this.getValue();
      if (typeof filtIdSet == 'function') {
        filtIdSet(filtid);
      }
      var filtData = getData(filtid) || [];
      chartAx.update(getAxesParam(filtData));
      drawTrendLineBlocks($parent, filtData, chartAx);
    };
    if (typeof filtSet == 'function') {
      filtSet(filter);
    }
  }

  function drawTrendLineBlocks($parent, data, axes) {
    $('#stats-fig-line-blocks').remove();
    $('#stats-fig-line-blins').remove();
    var frag = document.createDocumentFragment();
    var $blocks = $('<div>').attr('id', 'stats-fig-line-blocks').appendTo(frag);
    var $indis = $('<div>').attr('id', 'stats-fig-line-blins').appendTo(frag);
    var colorNum = colorChoices.length;
    var pointStep = getLinePointStep(data, axes);
    for (var i = 0, len = data.length; i < len; i += 1) {
      var dtitem = data[i];
      var lineColor = colorChoices[i % colorNum];
      var itemBlock = $('<div>').addClass('stats-fig-dati-block').appendTo($blocks);
      drawLineSlots(itemBlock, dtitem, axes, pointStep, lineColor);
      $('<div>').addClass('stats-fig-block-name')
        .css('top', axes.origin.y + 40)
        .append(dtitem.name).appendTo(itemBlock);
      $('<div>').addClass('stats-fig-line-indi')
        .append(
          $('<div>').css('background-color', lineColor)
        ).append(
        $('<div>').append(dtitem.name)
      ).appendTo($indis);
    }

    $parent.append(frag);
  }

  function transX(origin, x) {
    return origin.x + x;
  }

  function transY(origin, y) {
    return origin.y - y;
  }

  function drawLineSlots($block, data, axes, pointStep, lineColor) {
    var origin = {
      x: 0,
      y: axes.origin.y
    };

    var start = Math.floor(pointStep / 2);
    var points = [];
    var slotLabels = $('<div>').addClass('stats-fig-line-slabs');
    for (var i = 0, len = data.slots.length; i < len; i += 1) {
      var slot = data.slots[i];
      var x = start + pointStep * i;
      var y = Math.round(Number(slot.count) / axes.pointWeight);
      points.push({
        x: transX(origin, x),
        y: transY(origin, y)
      });
      var timeString = convertTimeString(slot.value);
      if (StatTrend.intervalType == 'day') {
        timeString = timeString.substr(0, 10);
      } else {
        timeString = timeString.replace(' ', '<br>');
      }
      $('<div>').addClass('stats-fig-line-timls').width(pointStep)
        .append(timeString)
        .appendTo(slotLabels);
    }
    var svgWidth = pointStep * points.length;
    var line = '';
    if (points.length > 1) {
      var pointString = points.map(function (point) {
        return point.x + ',' + point.y;
      }).join(' ');
      line = '<polyline points="' + pointString + '"' + ' style="fill:none;stroke:' + lineColor + ';' + 'stroke-width:2;"/>';
    } else {
      line = '<circle cx="' + points[0].x + '" cy="' + points[0].y + '" r="2" style="fill:' + lineColor + ';"/>';
    }

    var svg = '<svg width="' + svgWidth + '" ' + ' height="' + axes.origin.y + '">' + line + '</svg>';
    $block.append(svg).append(slotLabels);
  }

  function getLinePointStep(data, axes) {
    var num = 0;
    for (var i = 0, len = data.length; i < len; i += 1) {
      num += data[i].slots.length;
    }
    var pointStep = Math.floor((axes.rect.width - axes.marginLeft - axes.offsetLeft) / num);
    pointStep = Math.max(pointStep, 75);
    return pointStep;
  }

  function drawTrendList($parent, options, getData, filtSet, filtIdSet) {
    var $scrollCotainer = $('<div style="position: absolute;left: 0px;top: 0px;right: 0px;bottom: 0px;">');
    $scrollCotainer.appendTo($parent.empty());
    $('<div>').addClass('stats-figure-list-ctrls').append(
      $('<div>').append(
        $('<div>').attr('id', 'stats-fig-list-filt')
      )
    ).append(
      $('<div>').append(i18n('STATCOUNT_BAOGUANGCISHU'))
    ).append(
      $('<div>').append(i18n('STATCOUNT_DIANJICISHU'))
    ).append(
      $('<div>').append(i18n('STATCOUNT_DIANJILV'))
    ).append(
      $('<div>').append(i18n('STATCOUNT_BAOGUANGRENSHU'))
    ).append(
      $('<div>').append(i18n('STATCOUNT_DIANJIRENSHU'))
    ).append(
      $('<div>').append(i18n('STATCOUNT_RENSHUDIANJILV'))
    ).append(
      $('<div>').append(i18n("STATCOUNT_QIANCIBAOGUANG") + '￥')
    ).append(
      $('<div>').append(i18n("STATCOUNT_DANCIDIANJI") + '￥')
    ).append(
      $('<div>').append(i18n("STATCOUNT_QIANRENBAOGUANG") + '￥')
    ).append(
      $('<div>').append(i18n("STATCOUNT_DANRENDIANJI") + '￥')
    ).css('z-index', '66').appendTo($scrollCotainer);


  }

  function drawTrendList(parent, options, getData, filtSet, filtIdSet) {
    var titles = [{
      width: 384,
      label: "<div id='stats-fig-list-filt'></div>"
    },{
      width: 133,
      label: (i18n('STATCOUNT_BAOGUANGCISHU'))
    }, {
      width: 134,
      label: (i18n('STATCOUNT_DIANJICISHU'))
    }, {
      width: 148,
      label: (i18n('STATCOUNT_DIANJILV'))
    }, {
      width: 133,
      label: (i18n('STATCOUNT_BAOGUANGRENSHU'))
    }, {
      width: 133,
      label: (i18n('STATCOUNT_DIANJIRENSHU'))
    }, {
      width: 147,
      label: (i18n('STATCOUNT_RENSHUDIANJILV'))
    }, {
      width: 147,
      label: (i18n("STATCOUNT_QIANCIBAOGUANG") + '￥')
    }, {
      width: 147,
      label: (i18n("STATCOUNT_DANCIDIANJI") + '￥')
    }, {
      width: 147,
      label: (i18n("STATCOUNT_QIANRENBAOGUANG") + '￥')
    }, {
      width: 147,
      label: (i18n("STATCOUNT_DANRENDIANJI") + '￥')
    }];

    var cameraTable = new StatPeopleList({
      rows: 9,
      columns: titles.length,
      containerId: parent,
      titles: titles,
      listBodyData: [],
      listFootData: [],
      styles: {
        height: 506 + 48
      }
    });
    cameraTable.create();


    var filter = new StyledSelector({
      containerId: 'stats-fig-list-filt',
      options: options,
      styles: {
        optionHeight: 30,
        iconColor: '#5da1c0',
      }
    });
    filter.create();
    filter.onChange = function () {
      var filtid = this.getValue();
      if (typeof filtIdSet == 'function') {
        filtIdSet(filtid);
      }
      var filtData = getData(filtid) || [];
      var trendListBodyData = getTrendListBodyData(filtData)
      cameraTable.updateData(trendListBodyData.listBodyData, trendListBodyData.listFootData);
    };
    if (typeof filtSet == 'function') {
      filtSet(filter);
    }
  }

  function getTrendListBodyData(data){
    var allTotal = 0;
    var allChargeType = 0;
    var allPersons = 0;
    var allClickPersons = 0;
    var allDeductions = 0;
    var result = [];
    for (var i = 0, len = data.length; i < len; i += 1) {
      var dtitem = data[i];
      var tr_data = [];

      var dtitemTotal = toNumber(dtitem.sum);
      var dtitemTotalChargeType = toNumber(dtitem.charge_type);
      var dtitemTotalClickRate = toNumber(dtitem.click_rate);
      var dtitemTotalPersons = toNumber(dtitem.persons);
      var dtitemTotalClickPersons = toNumber(dtitem.click_persons);
      var dtitemTotalClickPersonsRate = toNumber(dtitem.click_persons_rate);

      var dtitemTotalDeductions = toNumber(dtitem.deductions);
      var dtitemTotal_deductions_div_count = toNumber(dtitem.deductions_div_count);
      var dtitemTotal_deductions_div_charge_type = toNumber(dtitem.deductions_div_charge_type);
      var dtitemTotal_deductions_div_persons = toNumber(dtitem.deductions_div_persons);
      var dtitemTotal_deductions_div_click_persons = toNumber(dtitem.deductions_div_click_persons);

      tr_data.push({
        label:getSpanInTd(dtitem.name, false, true)
      },{
        label:getSpanInTd(add_comma_toThousands(dtitemTotal))
      },{
        label:getSpanInTd(add_comma_toThousands(dtitemTotalChargeType))
      },{
        label:getSpanInTd(getTwoDecimals(dtitemTotalClickRate))
      },{
        label:getSpanInTd(add_comma_toThousands(dtitemTotalPersons))
      },{
        label:getSpanInTd(add_comma_toThousands(dtitemTotalClickPersons))
      },{
        label:getSpanInTd(getTwoDecimals(dtitemTotalClickPersonsRate ))
      },{
        label:getSpanInTd(addMoneySign_Thousands(dtitemTotal_deductions_div_count))
      },{
        label:getSpanInTd(addMoneySign(dtitemTotal_deductions_div_charge_type))
      },{
        label:getSpanInTd(addMoneySign_Thousands(dtitemTotal_deductions_div_persons))
      },{
        label:getSpanInTd(addMoneySign(dtitemTotal_deductions_div_click_persons))
      });
      result.push(tr_data);
      for (var j = 0, jLen = dtitem.slots.length; j < jLen; j += 1) {
        var slitem = dtitem.slots[j];
        tr_data = [];

        var pltime = slitem.value;
        var pltimestr = convertTimeString(pltime);
        if (StatTrend.intervalType == 'day') {
          pltimestr = pltimestr.substr(0, 10);
        } else {
          pltimestr = pltimestr.substr(0, 19);
        }

        tr_data.push({
          label:getSpanInTd(pltimestr, true, true)
        },{
          label:getSpanInTd(add_comma_toThousands(slitem.count))
        },{
          label:getSpanInTd(add_comma_toThousands(slitem.charge_type))
        },{
          label:getSpanInTd(getTwoDecimals(slitem.click_rate ))
        },{
          label:getSpanInTd(add_comma_toThousands(slitem.persons))
        },{
          label:getSpanInTd(add_comma_toThousands(slitem.click_persons))
        },{
          label:getSpanInTd(getTwoDecimals(slitem.click_persons_rate ))
        },{
          label:getSpanInTd(addMoneySign_Thousands(slitem.deductions_div_count))
        },{
          label:getSpanInTd(addMoneySign(slitem.deductions_div_charge_type))
        },{
          label:getSpanInTd(addMoneySign_Thousands(slitem.deductions_div_persons))
        },{
          label:getSpanInTd(addMoneySign(slitem.deductions_div_click_persons))
        });
        result.push(tr_data);
      }

      allTotal += dtitemTotal;
      allChargeType += dtitemTotalChargeType;
      allPersons += dtitemTotalPersons;
      allClickPersons += dtitemTotalClickPersons;
      allDeductions += dtitemTotalDeductions;
    }
    var allClickRate = handleNaNInfinity(allChargeType * 1.0 / allTotal);
    var allClickPersonsRate = handleNaNInfinity(allClickPersons * 1.0 / allPersons );
    var all_deductions_div_count = handleNaNInfinity(allDeductions * 1.0 / allTotal );
    var all_deductions_div_charge_type = handleNaNInfinity(allDeductions * 1.0 / allChargeType );
    var all_deductions_div_persons = handleNaNInfinity(allDeductions * 1.0 / allPersons );
    var all_deductions_div_click_persons = handleNaNInfinity(allDeductions * 1.0 / allClickPersons );


    var listFootData = [
      {label: i18n('STATS_FIGLIST_COUNT_TOTAL')},
      {label: add_comma_toThousands(allTotal)},
      {label: add_comma_toThousands(allChargeType)},
      {label:getTwoDecimals(allClickRate) },
      {label: ""},//add_comma_toThousands(allPersons)},
      {label: ""},//add_comma_toThousands(allClickPersons)},
      {label: ""},//getTwoDecimals(allClickPersonsRate)},
      {label: addMoneySign_Thousands(all_deductions_div_count)},
      {label: addMoneySign(all_deductions_div_charge_type)},
      {label: ""},//addMoneySign_Thousands(all_deductions_div_persons)},
      {label: ""},//addMoneySign(all_deductions_div_click_persons)},
    ];
    return {
      listBodyData: result,
      listFootData: listFootData,
    }
  }

  function drawTrendListBody(data) {
    var frag = document.createDocumentFragment();
    var tbouter = $('<div>').addClass('stats-figure-list-tabout').appendTo(frag);
    var table = $('<table>').attr('cellspacing', '0')
      .attr('cellpadding', '0')
      .addClass('stats-figure-list-table')
      .appendTo(tbouter);
    var tbody = $('<tbody>').appendTo(table);
    var allTotal = 0;
    var allChargeType = 0;
    var allClickRate = 0;
    var allPersons = 0;
    var allClickPersons = 0;
    var allClickPersonsRate = 0;
    var allDeductions = 0;
    var all_deductions_div_count = 0;
    var all_deductions_div_charge_type = 0;
    var all_deductions_div_persons = 0;
    var all_deductions_div_click_persons = 0;
    for (var i = 0, len = data.length; i < len; i += 1) {
      var dtitem = data[i];
      var tr = $('<tr>').addClass('stat-figure-list-item-head')
        .appendTo(tbody);
      tr.append(
        $('<td>').append(dtitem.name)
      );
      var dtitemTotal = toNumber(dtitem.sum);
      var dtitemTotalChargeType = toNumber(dtitem.charge_type);
      var dtitemTotalClickRate = toNumber(dtitem.click_rate);
      var dtitemTotalPersons = toNumber(dtitem.persons);
      var dtitemTotalClickPersons = toNumber(dtitem.click_persons);
      var dtitemTotalClickPersonsRate = toNumber(dtitem.click_persons_rate);

      var dtitemTotalDeductions = toNumber(dtitem.deductions);
      var dtitemTotal_deductions_div_count = toNumber(dtitem.deductions_div_count);
      var dtitemTotal_deductions_div_charge_type = toNumber(dtitem.deductions_div_charge_type);
      var dtitemTotal_deductions_div_persons = toNumber(dtitem.deductions_div_persons);
      var dtitemTotal_deductions_div_click_persons = toNumber(dtitem.deductions_div_click_persons);

      for (var j = 0, jLen = dtitem.slots.length; j < jLen; j += 1) {
        var slitem = dtitem.slots[j];
        // dtitemTotal += Number(slitem.count);
        var ctr = $('<tr>').addClass('stat-figure-list-item')
          .appendTo(tbody);
        var pltime = slitem.value;
        var pltimestr = convertTimeString(pltime);
        if (StatTrend.intervalType == 'day') {
          pltimestr = pltimestr.substr(0, 10);
        } else {
          pltimestr = pltimestr.substr(0, 19);
        }
        ctr.append(
          $('<td>').append(pltimestr)
        ).append(
          $('<td>').append(add_comma_toThousands(slitem.count))
        ).append(
          $('<td>').append(add_comma_toThousands(slitem.charge_type))
        ).append(
          $('<td>').append(getTwoDecimals(slitem.click_rate ))
        ).append(
          $('<td>').append(add_comma_toThousands(slitem.persons))
        ).append(
          $('<td>').append(add_comma_toThousands(slitem.click_persons))
        ).append(
          $('<td>').append(getTwoDecimals(slitem.click_persons_rate ))
        ).append(
          $('<td>').append(addMoneySign_Thousands(slitem.deductions_div_count))
        ).append(
          $('<td>').append(addMoneySign(slitem.deductions_div_charge_type))
        ).append(
          $('<td>').append(addMoneySign_Thousands(slitem.deductions_div_persons))
        ).append(
          $('<td>').append(addMoneySign(slitem.deductions_div_click_persons))
        );
      }
      tr.append(
        $('<td>').append(add_comma_toThousands(dtitemTotal))
      ).append(
        $('<td>').append(add_comma_toThousands(dtitemTotalChargeType))
      ).append(
        $('<td>').append(getTwoDecimals(dtitemTotalClickRate))
      ).append(
        $('<td>').append(add_comma_toThousands(dtitemTotalPersons))
      ).append(
        $('<td>').append(add_comma_toThousands(dtitemTotalClickPersons))
      ).append(
        $('<td>').append(getTwoDecimals(dtitemTotalClickPersonsRate ))
      ).append(
        $('<td>').append(addMoneySign_Thousands(dtitemTotal_deductions_div_count))
      ).append(
        $('<td>').append(addMoneySign(dtitemTotal_deductions_div_charge_type))
      ).append(
        $('<td>').append(addMoneySign_Thousands(dtitemTotal_deductions_div_persons))
      ).append(
        $('<td>').append(addMoneySign(dtitemTotal_deductions_div_click_persons))
      );
      allTotal += dtitemTotal;
      allChargeType += dtitemTotalChargeType;
      allPersons += dtitemTotalPersons;
      allClickPersons += dtitemTotalClickPersons;
      allDeductions += dtitemTotalDeductions;
    }
    allClickRate = handleNaNInfinity(allChargeType * 1.0 / allTotal);
    allClickPersonsRate = handleNaNInfinity(allClickPersons * 1.0 / allPersons );
    all_deductions_div_count = handleNaNInfinity(allDeductions * 1.0 / allTotal );
    all_deductions_div_charge_type = handleNaNInfinity(allDeductions * 1.0 / allChargeType );
    all_deductions_div_persons = handleNaNInfinity(allDeductions * 1.0 / allPersons );
    all_deductions_div_click_persons = handleNaNInfinity(allDeductions * 1.0 / allClickPersons );


    $('<div>').addClass('stats-figure-list-ctrls').append(
      $('<div>').append(i18n('STATS_FIGLIST_COUNT_TOTAL'))
    ).append(
      $('<div>').append(add_comma_toThousands(allTotal))
    ).append(
      $('<div>').append(add_comma_toThousands(allChargeType))
    ).append(
      $('<div>').append(getTwoDecimals(allClickRate))
    ).append(
      $('<div>').append(add_comma_toThousands(allPersons))
    ).append(
      $('<div>').append(add_comma_toThousands(allClickPersons))
    ).append(
      $('<div>').append(getTwoDecimals(allClickPersonsRate))
    ).append(
      $('<div>').append(addMoneySign_Thousands(all_deductions_div_count))
    ).append(
      $('<div>').append(addMoneySign(all_deductions_div_charge_type))
    ).append(
      $('<div>').append(addMoneySign_Thousands(all_deductions_div_persons))
    ).append(
      $('<div>').append(addMoneySign(all_deductions_div_click_persons))
    ).appendTo(frag);
    return frag;
  }

  function getAxesParam(data) {
    var max = 0;
    for (var i = 0, len = data.length; i < len; i += 1) {
      var dtitem = data[i];
      for (var j = 0, jLen = dtitem.slots.length; j < jLen; j += 1) {
        var tmp = Number(dtitem.slots[j].count);
        if (tmp > max) {
          max = tmp;
        }
      }
    }
    var stepNum = 8;
    var stepSize = 45;
    var step = Math.floor(max / stepNum);
    step = Math.max(1, step);
    while (stepNum * step < max) {
      stepNum += 1;
    }
    while (stepNum * stepSize > 405) {
      stepSize -= 5;
    }
    var pointWeight = step / stepSize;
    var param = {
      steps: stepNum,
      stepSize: stepSize,
      pointWeight: pointWeight,
      precision: 0
    };
    return param;
  }

  function preZero(num, len) {
    var str = num.toString();
    while (str.length < len) {
      str = '0' + str;
    }
    return str;
  }

  var pickerCalendar = null;

  function setDatePicker(target) {
    if (pickerCalendar == null) {
      var calendar = new Calendar('panel_time_picker_calendar');
      calendar.setStyles(calendarStyle);
      calendar.onCalendarClick = function (el) {
        var els = this.getCurrMonthDateElements();
        for (var i = 0, len = els.length; i < len; i += 1) {
          els[i].style.backgroundColor = '#fefefe';
          els[i].style.color = '#797979';
        }
        el.style.backgroundColor = '#5da1c0';
        el.style.color = '#fffefe';
      };
      calendar.onCalendarRefresh = function (els) {
        for (var i = 0, len = els.length; i < len; i += 1) {
          if (i == this.helper.curr_date - 1) {
            els[i].style.backgroundColor = '#5da1c0';
            els[i].style.color = '#fffefe';
          }
        }
      };
      calendar.open();
      pickerCalendar = calendar;
    }
    if (target != null && target != '') {
      var dates = /(\d{4})-(\d{2})-(\d{2})/.exec(target);
      pickerCalendar.setCurrDate({
        year: Number(dates[1]),
        month: Number(dates[2]) - 1,
        date: Number(dates[3])
      });
    }
    return pickerCalendar;
  }

  function formatToDateString(year, month, date) {
    var str = '';
    str += year;
    str += '-';
    str += preZero(month + 1, 2);
    str += '-';
    str += preZero(date, 2);
    return str;
  }

  function getTimezone() {
    var offset = new Date().getTimezoneOffset();
    var sign;
    if (offset == 0) {
      return 'Z';
    } else if (offset < 0) {
      offset = 0 - offset;
      sign = '+';
    } else {
      sign = '-';
    }
    var hours = Math.floor(offset / 60);
    var mins = offset - hours * 60;

    return sign + preZero(hours, 2) + preZero(mins, 2);
  }

  function retainDecimals(number, retainlen) {
    var isInteger = Number.isInteger || function (value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
      };
    if (isInteger(number)) {
      return String(number);
    } else {
      return Number(number).toFixed(retainlen)
    }
  }
  function getTwoDecimals(number) {
    if (isNaN(number) || number === ""|| !isFinite(number)) {
      return "";
    } else {
      return retainDecimals(number * 100, 2) + "%"
    }
  }
  function add_comma_toThousands(num) {
    if (isNaN(num) || num === ""|| !isFinite(num)) {
      return "";
    }
    num = (Math.floor(num) || 0).toString();
    var result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  }
  function addMoneySign(num){
    if (isNaN(num) || num === ""|| !isFinite(num)) {
      return "";
    }else{
      return "￥" + retainDecimals(num, 2);
    }
  }
  function addMoneySign_Thousands(num){
    if (isNaN(num) || num === ""|| !isFinite(num)) {
      return "";
    }else{
      return "￥" + add_comma_toThousands(num * 1000);
    }
  }
  function handleNaNInfinity(num){
    if (isNaN(num) || num === ""|| !isFinite(num)){
      return "";
    }
    return num;
  }
  function toNumber(num){
    if(num === ""){
      return ""
    }else{
     return Number(num)
    }
  }
  function getSpanInTd(text, pdleft_space, ta_left){
    var className = "";
    if(pdleft_space){
      className = className + " pdleft_space";
    }
    if(ta_left){
      className = className + " ta_left";
    }
    var result = "<span class='spanInTd" + (className ? className : "") + "' title='" + text + "'>" + text + "</span>"
    return result;
  }

  var timeSelector = null;

  function setTimeSelector(target) {
    if (timeSelector == null) {
      timeSelector = {
        getSelectors: function () {
          this.hourSel = getSelector('stat_timesel_hour', 0, 24);
          this.minSel = getSelector('stat_timesel_mins', 0, 60);
          this.secSel = getSelector('stat_timesel_sec', 0, 60);
        },
        setHour: function (val) {
          this.hourSel.setValue(val);
        },
        setMins: function (val) {
          this.minSel.setValue(val);
        },
        setSec: function (val) {
          this.secSel.setValue(val);
        },
        getTimeString: function () {
          return this.hourSel.getValue() + ':' + this.minSel.getValue() + ':' + this.secSel.getValue();
        }
      };
      timeSelector.getSelectors();
    }
    if (target != null && target != '') {
      var times = /(\d{2}):(\d{2}):(\d{2})/.exec(target);
      var hour = times[1];
      var mins = times[2];
      var sec = times[3];
    }
    hour = hour != null ? hour : '00';
    mins = mins != null ? mins : '00';
    sec = sec != null ? sec : '00';
    timeSelector.setHour(hour);
    timeSelector.setMins(mins);
    timeSelector.setSec(sec);
    return timeSelector;
  };
  function getSelector(id, start, length) {
    var options = [];
    for (var i = 0; i < length; i += 1) {
      var str = '';
      var num = start + i;
      str = preZero(num, 2);
      options.push({
        label: str,
        value: str
      });
    }
    var selector = new StyledSelector({
      containerId: id,
      options: options,
      styles: selectorStyle
    });
    selector.getCloseIcon = function () {
      return '<div class="styled-selector-up-arrow"></div>';
    };
    selector.getOpenIcon = function () {
      return '<div class="styled-selector-down-arrow"></div>';
    };
    selector.create();
    return selector;
  };

  var selectorStyle = {
    optionHeight: 30,
  };

  var calendarStyle = {
    width: 278,
    navTitleHeight: 25,
    navTitleBgColor: '#64a5c2',
    datesViewHeight: 160,
    datesViewGridColor: '#e2e2e2',
    datesViewCellColor: '#fefefe',
    weekdaysHeight: 22,
    weekdaysColor: '#5da1c0',
    currMonthColor: '#797979',
    nonCurrMonthColor: 'rgb(200,200,200)'
  };

  function fromDateToString(obj, needtime) {
    var year = obj.getFullYear();
    var month = obj.getMonth();
    var date = obj.getDate();

    var str = '';
    str += year;
    str += '-';
    str += preZero(month + 1, 2);
    str += '-';
    str += preZero(date, 2);

    if (needtime) {
      var hours = obj.getHours();
      var mins = obj.getMinutes();
      var secs = obj.getSeconds();
      str += ' ';
      str += preZero(hours, 2);
      str += ':';
      str += preZero(mins, 2);
      str += ':';
      str += preZero(secs, 2);
    }

    return str;
  };

  function fromStringToDate(str) {
    var ret = /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/.exec(str);
    return new Date(Number(ret[1]), Number(ret[2]) - 1, Number(ret[3]), Number(ret[4]), Number(ret[5]), Number(ret[6]));
  }

  var statTrendAdPos = {
    searchBtwnTime: function (fromstr, tostr, interval, callback) {
      var self = this;
      // var url = servRest + '/multiapp/statistics/ad';
      var url = servRest + '/search/general/property_values/';
      if(interval == "day"){
        url += 'statistics_ad_adp_id_day';
      }else{
        url += 'statistics_ad_adp_id';
      }
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      // url += '&begin_time=' + encodeURIComponent(fromstr);
      // url += '&end_time=' + encodeURIComponent(tostr);
      // url += '&properties=adp_id';
      url += '&properties=adp_id,placement_time';
      url += '&interval=' + interval;
      url += '&placement_time=' + encodeURIComponent(fromstr) + ',' + encodeURIComponent(tostr);
      url += '&placement_time_op=bt';
      url += '&sum_fields=count,charge_type,persons,click_persons,deductions';
      // url += '&sum_fields=count,duration';
      if (filterSites.length > 0) {
        url += '&siteid=' + filterSites[0].id;
        url += '&siteid_op=eq';
      }

      $.ajax({
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        }
      }).done(function (data) {
        data = $.makeArray(data);
        data = data[0];
        var figData = self.formatData(data && data.values || []);
        if (typeof callback == 'function') {
          callback(figData);
        }
      });
    },

    formatData: function (data) {
      var list = [];
      // var ids = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var vals = obj.value.split('#');
        var id = vals[0];
        var name = vals[1];
        name = name != null ? name : '';
        list.push({
          id: id,
          name: name,
          slots: obj.children.map(function (item) {
            return {
              count: item.sum.count,
              value: item.value,
              charge_type: item.sum.charge_type,
              click_rate: handleNaNInfinity(item.sum.charge_type * 1.0 / item.sum.count),
              persons: item.sum.persons,
              click_persons: item.sum.click_persons,
              click_persons_rate: handleNaNInfinity(item.sum.click_persons * 1.0 / item.sum.persons),
              deductions: item.sum.deductions,
              deductions_div_count: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.count),
              deductions_div_charge_type: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.charge_type),
              deductions_div_persons: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.persons),
              deductions_div_click_persons: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.click_persons),
            };
          }),
          sum: obj.sum.count,
          charge_type: obj.sum.charge_type,
          click_rate: handleNaNInfinity(obj.sum.charge_type * 1.0 / obj.sum.count ),
          persons: obj.sum.persons,
          click_persons: obj.sum.click_persons,
          click_persons_rate: handleNaNInfinity(obj.sum.click_persons * 1.0 / obj.sum.persons),
          deductions: obj.sum.deductions,
          deductions_div_count: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.count),
          deductions_div_charge_type: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.charge_type),
          deductions_div_persons: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.persons),
          deductions_div_click_persons: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.click_persons),
        });
        // ids.push(obj.value);
      }

      // if(ids.length > 0){
      // var url = advRest + '/ads/imgadp/searchadpositions';
      // url += '?app_key=' + paasAppKey;
      // url += '&timestamp=' + new Date().toISOString();
      // url += '&access_token=' + my.paas.access_token;
      // url += '&user_id=' + my.paas.user_id;
      // url += '&adp_ids=' + ids.join(',');
      // $.ajax({
      // async: false,
      // url: url,
      // headers: {
      // 'Accept': 'application/json',
      // 'Content-Type': 'application/json',
      // 'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      // }
      // }).done(function(objData){
      // objData = $.makeArray(objData);
      // for(var m = 0, mLen = list.length; m < mLen; m+=1){
      // var listItem = list[m];
      // for(var n = 0, nLen = objData.length; n < nLen; n+=1){
      // var objDataItem = objData[n];
      // if(objDataItem){
      // if(objDataItem.ext_id == listItem.id){
      // listItem.name = objDataItem.name;
      // break;
      // }
      // }
      // }
      // }
      // });
      // }
      return list;
    },
    exportReport: function (fromstr, tostr, interval) {
      var url = servRest + '/multiapp/statistics/ad/report';
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      url += '&start_date=' + encodeURIComponent(fromstr);
      url += '&end_date=' + encodeURIComponent(tostr);
      url += '&type=3';
      url += '&interval=' + interval;
      if (filterSites.length > 0) {
        url += '&siteid=' + filterSites[0].id;
      }

      window.open(url);
      // $.ajax({
      // type: 'GET',
      // url: url,
      // headers: {
      // 'Accept': 'text/comma-separated-values',
      // 'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      // }
      // }).done(function(data, textStatus, jqxhr){
      // var filename = jqxhr.getResponseHeader('Content-Disposition');
      // filename = filename.replace(/.+filename=(.+\.csv)/, '$1');
      // var blob = new Blob([data], {type: 'text/comma-separated-values'});
      // if(isBrowser() == 1){
      // navigator.msSaveBlob(blob, filename);
      // } else {
      // var downurl = URL.createObjectURL(blob);
      // var a = document.createElement('a');
      // a.href = downurl;
      // a.setAttribute('download', filename);
      // a.target = '_blank';
      // a.style.display = 'none';
      // a.appendChild(document.createTextNode(filename));
      // document.body.appendChild(a);
      // a.click();
      // }
      // }).fail(function(jqxhr){
      // alert(jqxhr.getResponseHeader('x-aqua-error-message'));
      // });
    }
  };

  var statTrendAdItem = {
    searchBtwnTime: function (fromstr, tostr, interval, callback) {
      var self = this;
      // var url = servRest + '/multiapp/statistics/ad';
      var url = servRest + '/search/general/property_values/';
      if(interval == "day"){
        url += 'statistics_ad_ad_id_day';
      }else{
        url += 'statistics_ad_ad_id';
      }
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      // url += '&begin_time=' + encodeURIComponent(fromstr);
      // url += '&end_time=' + encodeURIComponent(tostr);
      // url += '&properties=ad_id';
      url += '&properties=ad_id,placement_time';
      url += '&interval=' + interval;
      url += '&placement_time=' + encodeURIComponent(fromstr) + ',' + encodeURIComponent(tostr);
      url += '&placement_time_op=bt';
      url += '&sum_fields=count,charge_type,persons,click_persons,deductions';
      // url += '&sum_fields=count,duration';
      if (filterSites.length > 0) {
        url += '&siteid=' + filterSites[0].id;
        url += '&siteid_op=eq';
      }

      $.ajax({
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        }
      }).done(function (data) {
        data = $.makeArray(data);
        data = data[0];
        var figData = self.formatData(data && data.values || []);
        if (typeof callback == 'function') {
          callback(figData);
        }
      });
    },

    formatData: function (data) {
      var list = [];
      // var ids = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var vals = obj.value.split('#');
        var id = vals[0];
        var name = vals[1];
        name = name != null ? name : '';
        list.push({
          id: id,
          name: name,
          slots: obj.children.map(function (item) {
            return {
              count: item.sum.count,
              value: item.value,
              charge_type: item.sum.charge_type,
              click_rate: handleNaNInfinity(item.sum.charge_type * 1.0 / item.sum.count),
              persons: item.sum.persons,
              click_persons: item.sum.click_persons,
              click_persons_rate: handleNaNInfinity(item.sum.click_persons * 1.0 / item.sum.persons),
              deductions: item.sum.deductions,
              deductions_div_count: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.count),
              deductions_div_charge_type: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.charge_type),
              deductions_div_persons: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.persons),
              deductions_div_click_persons: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.click_persons),
            };
          }),
          sum: obj.sum.count,
          charge_type: obj.sum.charge_type,
          click_rate: handleNaNInfinity(obj.sum.charge_type * 1.0 / obj.sum.count ),
          persons: obj.sum.persons,
          click_persons: obj.sum.click_persons,
          click_persons_rate: handleNaNInfinity(obj.sum.click_persons * 1.0 / obj.sum.persons),
          deductions: obj.sum.deductions,
          deductions_div_count: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.count),
          deductions_div_charge_type: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.charge_type),
          deductions_div_persons: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.persons),
          deductions_div_click_persons: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.click_persons),
        });
        // ids.push(obj.value);
      }

      // if(ids.length > 0){
      // var url = advRest + '/ads/aditem/searchaditems';
      // url += '?app_key=' + paasAppKey;
      // url += '&timestamp=' + new Date().toISOString();
      // url += '&access_token=' + my.paas.access_token;
      // url += '&user_id=' + my.paas.user_id;
      // url += '&ad_ids=' + ids.join(',');
      // $.ajax({
      // async: false,
      // url: url,
      // headers: {
      // 'Accept': 'application/json',
      // 'Content-Type': 'application/json',
      // 'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      // }
      // }).done(function(objData){
      // objData = $.makeArray(objData);
      // for(var m = 0, mLen = list.length; m < mLen; m+=1){
      // var listItem = list[m];
      // for(var n = 0, nLen = objData.length; n < nLen; n+=1){
      // var objDataItem = objData[n];
      // if(objDataItem){
      // if(objDataItem.ad_id == listItem.id){
      // listItem.name = objDataItem.name;
      // break;
      // }
      // }
      // }
      // }
      // });
      // }
      return list;
    },
    exportReport: function (fromstr, tostr, interval) {
      var url = servRest + '/multiapp/statistics/ad/report';
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      url += '&start_date=' + encodeURIComponent(fromstr);
      url += '&end_date=' + encodeURIComponent(tostr);
      url += '&type=4';
      url += '&interval=' + interval;
      if (filterSites.length > 0) {
        url += '&siteid=' + filterSites[0].id;
      }

      window.open(url);
      // $.ajax({
      // type: 'GET',
      // url: url,
      // headers: {
      // 'Accept': 'text/comma-separated-values',
      // 'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      // }
      // }).done(function(data, textStatus, jqxhr){
      // var filename = jqxhr.getResponseHeader('Content-Disposition');
      // filename = filename.replace(/.+filename=(.+\.csv)/, '$1');
      // var blob = new Blob([data], {type: 'text/comma-separated-values'});
      // if(isBrowser() == 1){
      // navigator.msSaveBlob(blob, filename);
      // } else {
      // var downurl = URL.createObjectURL(blob);
      // var a = document.createElement('a');
      // a.href = downurl;
      // a.setAttribute('download', filename);
      // a.target = '_blank';
      // a.style.display = 'none';
      // a.appendChild(document.createTextNode(filename));
      // document.body.appendChild(a);
      // a.click();
      // }
      // }).fail(function(jqxhr){
      // alert(jqxhr.getResponseHeader('x-aqua-error-message'));
      // });
    }
  };

  var statTrendContract = {
    searchBtwnTime: function (fromstr, tostr, interval, callback) {
      var self = this;
      // var url = servRest + '/multiapp/statistics/ad';
      var url = servRest + '/search/general/property_values/';
      if(interval == "day"){
        url += 'statistics_ad_contract_id_day';
      }else{
        url += 'statistics_ad_contract_id';
      }
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      // url += '&begin_time=' + encodeURIComponent(fromstr);
      // url += '&end_time=' + encodeURIComponent(tostr);
      // url += '&properties=ad_id';
      url += '&properties=contract_id,placement_time';
      url += '&interval=' + interval;
      url += '&placement_time=' + encodeURIComponent(fromstr) + ',' + encodeURIComponent(tostr);
      url += '&placement_time_op=bt';
      url += '&sum_fields=count,charge_type,persons,click_persons,deductions';
      // url += '&sum_fields=count,duration';
      if (filterSites.length > 0) {
        url += '&siteid=' + filterSites[0].id;
        url += '&siteid_op=eq';
      }

      $.ajax({
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        }
      }).done(function (data) {
        data = $.makeArray(data);
        data = data[0];
        var figData = self.formatData(data && data.values || []);
        if (typeof callback == 'function') {
          callback(figData);
        }
      });
    },

    formatData: function (data) {
      var list = [];
      // var ids = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var vals = obj.value.split('#');
        var id = vals[0];
        var name = vals[1];
        name = name != null ? name : '';
        list.push({
          id: id,
          name: id,
          slots: obj.children.map(function (item) {
            return {
              count: item.sum.count,
              value: item.value,
              charge_type: item.sum.charge_type,
              click_rate: handleNaNInfinity(item.sum.charge_type * 1.0 / item.sum.count),
              persons: item.sum.persons,
              click_persons: item.sum.click_persons,
              click_persons_rate: handleNaNInfinity(item.sum.click_persons * 1.0 / item.sum.persons),
              deductions: item.sum.deductions,
              deductions_div_count: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.count),
              deductions_div_charge_type: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.charge_type),
              deductions_div_persons: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.persons),
              deductions_div_click_persons: handleNaNInfinity(item.sum.deductions * 1.0 / item.sum.click_persons),
            };
          }),
          sum: obj.sum.count,
          charge_type: obj.sum.charge_type,
          click_rate: handleNaNInfinity(obj.sum.charge_type * 1.0 / obj.sum.count ),
          persons: obj.sum.persons,
          click_persons: obj.sum.click_persons,
          click_persons_rate: handleNaNInfinity(obj.sum.click_persons * 1.0 / obj.sum.persons),
          deductions: obj.sum.deductions,
          deductions_div_count: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.count),
          deductions_div_charge_type: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.charge_type),
          deductions_div_persons: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.persons),
          deductions_div_click_persons: handleNaNInfinity(obj.sum.deductions * 1.0 / obj.sum.click_persons),
        });
        // ids.push(obj.value);
      }

      // if(ids.length > 0){
      // var url = advRest + '/ads/aditem/searchaditems';
      // url += '?app_key=' + paasAppKey;
      // url += '&timestamp=' + new Date().toISOString();
      // url += '&access_token=' + my.paas.access_token;
      // url += '&user_id=' + my.paas.user_id;
      // url += '&ad_ids=' + ids.join(',');
      // $.ajax({
      // async: false,
      // url: url,
      // headers: {
      // 'Accept': 'application/json',
      // 'Content-Type': 'application/json',
      // 'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      // }
      // }).done(function(objData){
      // objData = $.makeArray(objData);
      // for(var m = 0, mLen = list.length; m < mLen; m+=1){
      // var listItem = list[m];
      // for(var n = 0, nLen = objData.length; n < nLen; n+=1){
      // var objDataItem = objData[n];
      // if(objDataItem){
      // if(objDataItem.ad_id == listItem.id){
      // listItem.name = objDataItem.name;
      // break;
      // }
      // }
      // }
      // }
      // });
      // }
      return list;
    },
    exportReport: function (fromstr, tostr, interval) {
      var dialog = new AlertDialog({
        title: i18n('SUCAITEMPLATE_TISHI'),
        message: i18n("STATCOUNT_ALERTMSG1"),
        confirmFn: (callback) => {
          callback && callback()
        }
      })
      return;

      var url = servRest + '/multiapp/statistics/ad/report';
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      url += '&start_date=' + encodeURIComponent(fromstr);
      url += '&end_date=' + encodeURIComponent(tostr);
      url += '&type=4';
      url += '&interval=' + interval;
      if (filterSites.length > 0) {
        url += '&siteid=' + filterSites[0].id;
      }

      window.open(url);
      // $.ajax({
      // type: 'GET',
      // url: url,
      // headers: {
      // 'Accept': 'text/comma-separated-values',
      // 'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      // }
      // }).done(function(data, textStatus, jqxhr){
      // var filename = jqxhr.getResponseHeader('Content-Disposition');
      // filename = filename.replace(/.+filename=(.+\.csv)/, '$1');
      // var blob = new Blob([data], {type: 'text/comma-separated-values'});
      // if(isBrowser() == 1){
      // navigator.msSaveBlob(blob, filename);
      // } else {
      // var downurl = URL.createObjectURL(blob);
      // var a = document.createElement('a');
      // a.href = downurl;
      // a.setAttribute('download', filename);
      // a.target = '_blank';
      // a.style.display = 'none';
      // a.appendChild(document.createTextNode(filename));
      // document.body.appendChild(a);
      // a.click();
      // }
      // }).fail(function(jqxhr){
      // alert(jqxhr.getResponseHeader('x-aqua-error-message'));
      // });
    }
  };

  var pickerDropAnchor;

  var statTrend = {
    init: function () {
      var self = this;
      self.setFigureType();
      self.setTimePicker();
      self.setTimeShortcut();
      self.setIntervalSelector();
      self.setPageType();
      self.setExportBtn();
      pickerDropAnchor = $('.panel_calendar_time_container')[0];
      if (pickerDropAnchor && window.dropdownHelper) {
        window.dropdownHelper.addDropdownHandler(this);
      }
      self.getSiteList();
      if (window.AdvSystemType == 'central') {
        $('#stats_site_filter').show();
      }
      self.setSiteFilter();
      $('.stats_fig_type[name=list]').addClass('stats_fig_type_focus');
      $('.panel_page_option[name=adpos]').addClass('panel_page_option_focus');
      self.pageType = 'adpos';
      self.deleg = statTrendAdPos;
      self.intervalSelector.create();
    },

    setIntervalSelector: function () {
      var self = this;
      var selector = new StyledSelector({
        containerId: 'stats_interval_filter',
        options: [{
          label: i18n('STATS_INTERVAL_SEL_DAY'),
          value: 'day'
        }, {
          label: i18n('STATS_INTERVAL_SEL_HOUR'),
          value: 'hour'
        }],
        styles: {
          optionHeight: 36
        }
      });
      selector.getCloseIcon = function () {
        return '<div class="styled-selector-up-arrow"></div>';
      };
      selector.getOpenIcon = function () {
        return '<div class="styled-selector-down-arrow"></div>';
      };
      selector.onChange = function () {
        $('.panel_set_shortcuts').hide();
        var val = this.getValue();
        self.intervalType = val;
        switch (val) {
          case 'day':
            $('.panel_timesel_container').hide();
            $('.panel_time_picker_times').hide();
            $('#stats_interval_day_shortcuts').show().find('.panel_set_shortcut').eq(0).click();
            break;
          case 'hour':
            $('.panel_timesel_container').show();
            $('.panel_time_picker_times').show();
            $('#stats_interval_hour_shortcuts').show().find('.panel_set_shortcut').eq(0).click();
            ;
            break;
          default:
            break;
        }
      };
      self.intervalSelector = selector;
    },

    setTimeShortcut: function () {
      var self = this;
      $('.panel_set_shortcut').on('click', function () {
        $('.panel_set_shortcut_focus').removeClass('panel_set_shortcut_focus');
        var $self = $(this);
        $self.addClass('panel_set_shortcut_focus');
        var spec = $self.attr('data-filter');
        var fromdate = '', todate = '', fromtime = '00:00:00', totime = '23:59:59';
        switch (spec) {
          case 'td':
            var tdate = new Date();
            var tdatestr = fromDateToString(tdate);
            fromdate = tdatestr;
            todate = tdatestr;
            break;
          case 'yd':
            var ydate = new Date();
            ydate.setDate(ydate.getDate() - 1);
            var ydatestr = fromDateToString(ydate);
            fromdate = ydatestr;
            todate = ydatestr;
            break;
          case 'tw':
            var twfirst = new Date();
            twfirst.setDate(twfirst.getDate() + 1 - twfirst.getDay());
            var twlast = new Date();
            twlast.setDate(twlast.getDate() + 7 - twlast.getDay());
            fromdate = fromDateToString(twfirst);
            todate = fromDateToString(twlast);
            break;
          case 'tm':
            var tmdate = new Date();
            var tmyear = tmdate.getFullYear();
            var tmmonth = tmdate.getMonth();
            var tmdays = CalendarHelper.prototype.getMonthDays([tmyear, tmmonth]);
            var tmfirst = new Date(tmyear, tmmonth, 1);
            var tmlast = new Date(tmyear, tmmonth, tmdays);
            fromdate = fromDateToString(tmfirst);
            todate = fromDateToString(tmlast);
            break;
          case 'ld30':
            var ldfirst = new Date();
            ldfirst.setDate(ldfirst.getDate() - 30);
            fromdate = fromDateToString(ldfirst);
            todate = fromDateToString(new Date());
            break;
          default:
            return;
        }
        $('input[name=date-from]').val(fromdate);
        $('input[name=date-to]').val(todate);
        $('input[name=time-from]').val(fromtime);
        $('input[name=time-to]').val(totime);
        $self.attr('data-date-from', fromdate).attr('data-date-to', todate);
        self.checkTimeAndSearch();
      });
    },

    setPageType: function () {
      var self = this;
      $('.panel_page_option').on('click', function () {
        var $self = $(this);
        $('.panel_page_option_focus').removeClass('panel_page_option_focus');
        $self.addClass('panel_page_option_focus');
        var filter = $self.attr('name');
        self.pageType = filter;
        switch (filter) {
          case 'adpos':
            self.deleg = statTrendAdPos;
            break;
          case 'aditem':
            self.deleg = statTrendAdItem;
            break;
          case 'contract':
            self.deleg = statTrendContract;
            break;
          default:
            return;
        }
        self.checkTimeAndSearch();
      });
    },

    setTimePicker: function () {
      var self = this;
      $('.panel_calendar_selitem').on('click', $('.panel_calendar_time_container')[0], function (ev) {
        ev.originalEvent = ev.originalEvent || {};
        ev.originalEvent.dropdownDelegate = ev.data;
        var $self = $(this);
        var left = $self[0].offsetWidth + $self[0].offsetLeft - 300;
        $('.panel_calendar_time_container').css('left', left).show();

        var dateInput = $self.find('.panel_calendar_input');
        var calendar = setDatePicker(dateInput.val());
        if (self.intervalType == 'hour') {
          var timeInput = $self.find('.panel_timesel_input');
          var timeSel = setTimeSelector(timeInput.val());
        }
        $('#stattrend_timepicker_confirm').off().on('click', function () {
          var year = calendar.getCurrYear();
          var month = calendar.getCurrMonth();
          var date = calendar.getCurrDate();
          dateInput.val(formatToDateString(year, month, date));
          if (self.intervalType == 'hour') {
            timeInput.val(timeSel.getTimeString());
          }
          $('.panel_calendar_time_container').hide();
          self.checkTimeAndSearch();
        });
      });
    },

    setFigureType: function () {
      var self = this;
      $('.stats_fig_type').on('click', function () {
        $('.stats_fig_type_focus').removeClass('stats_fig_type_focus');
        var $self = $(this);
        $self.addClass('stats_fig_type_focus');
        self.changeFigType();
      });
    },

    setExportBtn: function () {
      var self = this;
      $('#statsTrendExport').on('click', function () {
        var chkRet = self.checkTime();
        if (chkRet == 0) {
          alert(i18n('STATS_ALERT_NEED_TIME'));
          return;
        }
        if (chkRet == 1) {
          alert(i18n('STATS_ALERT_TIME_ERRP'));
          return;
        }
        var fromstr = chkRet.fromdate + 'T' + chkRet.fromtime;
        var tostr = chkRet.todate + 'T' + chkRet.totime;
        self.deleg.exportReport(fromstr, tostr, self.intervalType);
      });
    },

    checkTime: function () {
      var ret = null;
      var fromdate = $('input[name=date-from]').val();
      var fromtime = $('input[name=time-from]').val();
      var todate = $('input[name=date-to]').val();
      var totime = $('input[name=time-to]').val();

      if (fromdate == '' || todate == '') {
        ret = 0;
        return ret;
      }
      var timezone = getTimezone();
      var fromfullstr = fromdate + 'T' + fromtime + timezone;
      var tofullstr = todate + 'T' + totime + timezone;
      if (fromfullstr > tofullstr) {
        ret = 1;
        return ret;
      }
      ret = {
        fromdate: fromdate,
        todate: todate,
        fromtime: fromtime,
        totime: totime,
        fromfullstr: fromfullstr,
        tofullstr: tofullstr
      };
      return ret;
    },

    checkTimeAndSearch: function () {
      var self = this;
      var chkRet = self.checkTime();
      if (chkRet == 0) {
        alert(i18n('STATS_ALERT_NEED_TIME'));
        return;
      }
      if (chkRet == 1) {
        alert(i18n('STATS_ALERT_TIME_ERRP'));
        return;
      }

      var focusShortcut = $('.panel_set_shortcut_focus');
      if (focusShortcut.attr('data-date-from') != chkRet.fromdate ||
        focusShortcut.attr('data-date-to') != chkRet.todate) {
        focusShortcut.removeClass('panel_set_shortcut_focus');
      }

      self.deleg.searchBtwnTime(chkRet.fromfullstr, chkRet.tofullstr, self.intervalType, function (data) {
        self.figData = data;
        self.setFigData();
      });
    },

    handleDropdowns: function (target, delegate) {
      var container = $('.panel_calendar_time_container')[0];
      if (!container || (container !== pickerDropAnchor)) {
        window.dropdownHelper.removeDropdownHandler(this);
        return;
      }
      var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);
      if (!isChild) {
        $('.panel_calendar_time_container').hide();
      }
    },

    setFigData: function () {
      var self = this;
      self.filtOptions = [];
      var titleLabel = '';
      if (self.pageType == 'adpos') {
        titleLabel = i18n('STATS_FIGLIST_ADPOS_LABL');
      } else if (self.pageType == 'aditem') {
        titleLabel = i18n('STATS_FIGLIST_ADITEM_LABL');
      } else if (self.pageType == 'contract') {
        titleLabel = i18n('STATS_FIGLIST_CONTRACTID_LABL');
      }
      self.filtOptions.push({
        label: titleLabel,
        value: 'all'
      });
      for (var i = 0, len = self.figData.length; i < len; i += 1) {
        var figItem = self.figData[i];
        self.filtOptions.push({
          label: figItem.name,
          value: figItem.id
        });
      }
      self.filtDataId = null;
      self.changeFigType();
    },

    changeFigType: function () {
      var self = this;
      var figType = $('.stats_fig_type_focus').attr('name');
      self.figType = figType;
      switch (figType) {
        case 'bar':
          drawTrendBars($('#stats_figure_container'), self.filtOptions, self.getFiltData, function (filter) {
            if (self.filtDataId != null) {
              filter.setValue(self.filtDataId);
            } else {
              filter.setValue('all');
            }
            var filtLabel = filter.getLabel();
            filtLabel = filtLabel != null ? filtLabel : '';
            var timeLabel = $('.panel_set_shortcut_focus').text().replace(/\s/, '');
            $('#stats_list_info_msg').text(filtLabel + timeLabel + i18n('STATS_TREND_FIGTYPE_BARS'));
          }, self.setFiltDataId);
          break;
        case 'lines':
          drawTrendLines($('#stats_figure_container'), self.filtOptions, self.getFiltData, function (filter) {
            if (self.filtDataId != null) {
              filter.setValue(self.filtDataId);
            } else {
              filter.setValue('all');
            }
            var filtLabel = filter.getLabel();
            filtLabel = filtLabel != null ? filtLabel : '';
            var timeLabel = $('.panel_set_shortcut_focus').text().replace(/\s/, '');
            $('#stats_list_info_msg').text(filtLabel + timeLabel + i18n('STATS_TREND_FIGTYPE_LINE'));
          }, self.setFiltDataId);
          break;
        case 'list':
          $('#stats_list_info_msg').text(i18n('STATS_FIG_LIST_TITLE'));
          drawTrendList('stats_figure_container', self.filtOptions, self.getFiltData, function (filter) {
            if (self.filtDataId != null) {
              filter.setValue(self.filtDataId);
            } else {
              filter.setValue('all');
            }
          }, self.setFiltDataId);
          break;
        default:
          break;
      }
    },

    setFiltDataId: function (id) {
      var self = statTrend;
      self.filtDataId = id;
    },

    getFiltData: function (filtid) {
      var self = statTrend;
      if (filtid == 'all') {
        return self.figData;
      } else {
        for (var i = 0, len = self.figData.length; i < len; i += 1) {
          if (self.figData[i].id == filtid) {
            return [self.figData[i]];
          }
        }
      }
    },

    getSiteList: function () {
      $.ajax({
        async: false,
        url: dmRoot + '/site',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function (data) {
        data = $.makeArray(data);
        adpSites = data;
      });
    },

    setSiteFilter: function () {
      var self = this;
      var filter = getCombiSelector({
        label: i18n('ADPOS_SITE_SELECTOR'),
        container: '#stats_site_filter',
        channels: adpSites.map(function (site) {
          return {
            label: site.name,
            site: site,
          };
        }),
        singleCheck: true,
        onChange: function (channels) {
          filterSites = channels.map(function (channel) {
            return channel.site;
          });
          self.checkTimeAndSearch();
        }
      });
      filter.create();
    },
  };

  statTrend.init();

  return statTrend;
})(jQuery);
