var historyRecordsModel = (function ($) {
  //对话框
  var PopupDialog_ = (function () {
    function PopupDialog_(confObj) {
      if (confObj) {
        this.local = confObj.local;
        this.localContent = confObj.content;

        this.htmlUri = confObj.url;
        this.dialogWidth = confObj.width;
        this.dialogHeight = confObj.height;
        this.perWidth = confObj.perWidth;
        this.perHeight = confObj.perHeight;
        this.ajaxOnEachCreate = confObj.ajaxOnEachCreate;

        this.callbackRef = confObj.context;
        this.drawnCallback = confObj.callback;
        this.calSupport = confObj.calSupport;
      }

      if (!this.perWidth)
        this.dialogWidth = parseInt(this.dialogWidth, 10);

      if (!this.perHeight)
        this.dialogHeight = parseInt(this.dialogHeight, 10);
      this.index = PopupDialog_.index++;
      this.init();
    };
    PopupDialog_.zindex = 2000;
    PopupDialog_.index = 0;
    PopupDialog_.prototype.clear = function () {
      var that = this;
      var mask = document.getElementById(that.maskId);
      var dialog = document.getElementById(that.dialogId);
      jQuery(mask).remove();
      jQuery(dialog).remove();
      if (PopupDialog_.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog_.reLocateDialogFunc);
        PopupDialog_.reLocateDialogFunc = null;
      }
    };
    PopupDialog_.scrollIntoView = function () {
      window.scrollTo(0, 0);
    };
    PopupDialog_.prototype.init = function () {
    };
    PopupDialog_.prototype.locate = function (mask, dialog) {
      var zIndex = PopupDialog_.zindex + this.index;
      jQuery(mask).css({
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex,
        backgroundColor: 'rgba(0,0,0,0.3)'
      });

      var jqDialog = jQuery(dialog);
      var normalDialogLeft, normalDialogTop;

      if (this.perWidth) {
        var widthPer = parseInt(this.dialogWidth, 10);
        normalDialogLeft = '' + Math.floor(50 - widthPer / 2) + '%';
      } else {
        if (this.calSupport) {
          normalDialogLeft = Math.floor((window.innerWidth - this.dialogWidth) / 2);
        } else {
          var dialogOffsetHorizontal = Math.floor(this.dialogWidth / 2);
          normalDialogLeft = 'calc( 50% - ' + dialogOffsetHorizontal + 'px )';
        }
      }

      if (this.perHeight) {
        var heightPer = parseInt(this.dialogHeight, 10);
        normalDialogHeight = '' + Math.floor(50 - heightPer / 2) + '%';
      } else {
        if (this.calSupport) {
          normalDialogTop = Math.floor((window.innerHeight - this.dialogHeight) / 2);
        } else {
          var dialogOffsetVertical = Math.floor(this.dialogHeight / 2);
          normalDialogTop = 'calc( 50% - ' + dialogOffsetVertical + 'px )';
        }
      }

      jqDialog.css({
        position: 'absolute',
        left: normalDialogLeft,
        top: normalDialogTop,
        width: this.dialogWidth,
        height: this.dialogHeight,
        zIndex: zIndex + 1
      });

      function reLocateDialog() {
        var dialogLeft = dialog.offsetLeft;
        var dialogTop = dialog.offsetTop;

        if (dialogLeft < 0) {
          dialogLeft = 0;
        } else {
          dialogLeft = normalDialogLeft;
        }

        if (dialogTop < 0) {
          dialogTop = 0;
        } else {
          dialogTop = normalDialogTop;
        }

        jqDialog.css({
          left: dialogLeft,
          top: dialogTop
        });

        dialogLeft = dialog.offsetLeft;
        dialogTop = dialog.offsetTop;

        if (dialogLeft <= 0) {
          dialogLeft = 0;
        } else {
          dialogLeft = normalDialogLeft;
        }

        if (dialogTop <= 0) {
          dialogTop = 0;
        } else {
          dialogTop = normalDialogTop;
        }

        jqDialog.css({
          left: dialogLeft,
          top: dialogTop
        });
      }

      reLocateDialog();

      if (PopupDialog_.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog_.reLocateDialogFunc);
      }
      PopupDialog_.reLocateDialogFunc = reLocateDialog;
      jQuery(window).bind('resize', PopupDialog_.reLocateDialogFunc);
    };
    PopupDialog_.prototype.getLocalContent = function () {
      var that = this;
      var localContent = this.localContent || '';
      var dialog = document.getElementById(that.dialogId);
      if (dialog) {
        dialog.innerHTML = patchHTML(localContent);
        if (this.drawnCallback && this.callbackRef)
          this.drawnCallback.call(this.callbackRef);
      }
    };
    PopupDialog_.prototype.getContentHtml = function () {
      var that = this;
      if (!this.htmlUri)
        return;
      var self = this;
      if (this.ajaxOnEachCreate) {

        jQuery.get(this.htmlUri, function (data) {
          var dialog = document.getElementById(that.dialogId);
          if (dialog) {
            dialog.innerHTML = patchHTML(data);
            if (self.drawnCallback && self.callbackRef)
              self.drawnCallback.call(self.callbackRef);
          }
        });

      } else {

        if ((this.htmlUri == this.prevHtml) && this.htmlData) {
          var dialog = document.getElementById(that.dialogId);
          if (dialog) {
            dialog.innerHTML = patchHTML(this.htmlData);
            if (self.drawnCallback && self.callbackRef)
              self.drawnCallback.call(self.callbackRef);
          }
        } else {
          jQuery.get(this.htmlUri, function (data) {
            var dialog = document.getElementById(that.dialogId);
            if (dialog) {
              dialog.innerHTML = patchHTML(data);
              self.htmlData = data;
              if (self.drawnCallback && self.callbackRef)
                self.drawnCallback.call(self.callbackRef);
            }
          });
          this.prevHtml = this.htmlUri;
        }

      }
    };
    PopupDialog_.prototype.create = function () {
      var that = this;
      this.maskId = 'popup-dialog-mask' + this.index;
      this.dialogId = 'popup-dialog-dialog' + this.index;

      var mask = document.getElementById(that.maskId);
      var dialog = document.getElementById(that.dialogId);
      if (mask || dialog) {
        that.clear();
      }

      mask = document.createElement('div');
      mask.id = that.maskId;
      document.body.appendChild(mask);
      dialog = document.createElement('div');
      dialog.id = that.dialogId;
      document.body.appendChild(dialog);

      this.locate(mask, dialog);
      if (this.local)
        this.getLocalContent();
      else
        this.getContentHtml();
      PopupDialog_.scrollIntoView();

      jQuery(function () {
        jQuery(document.body).off('click', "#" + that.dialogId + ' .popup_dialog_clear_').on('click', "#" + that.dialogId + ' .popup_dialog_clear_', function () {
          that.clear();
        });
      });

    };
    PopupDialog_.prototype.destroy = function () {
      this.clear();
    };
    PopupDialog_.prototype.open = function () {
      this.create();
    };
    PopupDialog_.prototype.close = function () {
      this.clear();
    };
    PopupDialog_.prototype.show = function () {
      var that = this;
      var mask = document.getElementById(that.maskId);
      var dialog = document.getElementById(that.dialogId);
      if (mask && dialog) {
        mask.style.display = 'block';
        dialog.style.display = 'block';
        PopupDialog_.scrollIntoView();
      } else {
        this.create();
      }
    };
    PopupDialog_.prototype.hide = function () {
      var that = this;
      var mask = document.getElementById(that.maskId);
      if (mask) {
        mask.style.display = 'none';
      }
      var dialog = document.getElementById(that.dialogId);
      if (dialog) {
        dialog.style.display = 'none';
      }
    };
    PopupDialog_.prototype.resize = function (obj, live) {
      var that = this;
      if (obj && obj.width)
        this.dialogWidth = obj.width;
      if (obj && obj.height)
        this.dialogHeight = obj.height;

      if (live) {
        this.locate(document.getElementById(that.maskId), document.getElementById(that.dialogId));
      }
    };
    return PopupDialog_;
  })()

  //滚动条列表
  var list = (function () {
    var list = function (obj) {
      var conf = obj;
      if (conf) {
        this.containerId = conf.containerId;
        this.rowsLmt = conf.rows || 1;
        this.columnsLmt = conf.columns || 1;
        this.data = conf.data;
        this.titles = conf.titles;
        this.styles = conf.styles;
        this.listType = conf.listType || 0;
        this.totalCount = conf.totalCount || 0;
        this.updateTitle = conf.updateTitle || false;
      }
      if (!this.containerId)
        return null;
      else {
        this.TitleTable = null;
        this.BodyTable = null;
        this.init();
      }
    };
    list.prototype.init = function () {
      this.totalCount = this.data && this.data.length || 0;
    }
    list.prototype.create = function () {
      var that = this;
      this.rowsLmt = this.data.length;
      jQuery("#" + that.containerId).mCustomScrollbar("destroy");
      this.createList();
      this.fillContent();
      this.fillList();
      setTimeout(function(){
        jQuery("#" + that.containerId).mCustomScrollbar({
          axis: "x" // vertical and horizontal scrollbar
        });
      }, 0)
    };
    list.prototype.update = function (param) {
      this.data = param;
      this.rowsLmt = this.data.length;
      this.create();
    };
    list.prototype.createList = function () {
      var that = this;
      var container = document.getElementById(this.containerId);
      if (!container)
        return;
      container.innerHTML = "";
      var jqContainer = jQuery(container);
      jqContainer.empty();
      var TitleTable = document.createElement('table');
      jqContainer.append(TitleTable);

      var jqTitleTable = jQuery(TitleTable);
      that.TitleTable = jqTitleTable;
      (that.titles.length > 10) && that.TitleTable.css({"width": "100%"});
      that.setTitleTable(jqTitleTable);
      var BodyTableDiv = document.createElement('div');
      (that.titles.length > 10) && jQuery(BodyTableDiv).css({"width": "100%"})
      that.BodyTableDiv = jQuery(BodyTableDiv);
      jqContainer.append(BodyTableDiv);
      var JqBodyTableDiv = jQuery(BodyTableDiv);
      var BodyTable = document.createElement('table');
      JqBodyTableDiv.append(BodyTable);

      var jqBodyTable = jQuery(BodyTable);
      that.setBodyTable(jqBodyTable);
      that.BodyTable = jqBodyTable;
      (that.titles.length > 10) && that.BodyTable.css({"width": "100%"});
      this.setStyles();

      //this.setStyles(jqTable);
      //this.jqTable = jqTable;
    };
    list.prototype.setTitleTable = function (jqTable) {
      var tbody = document.createElement('thead');
      jqTable.append(tbody);
      var tr = document.createElement('tr');
      jQuery(tbody).append(tr);

      var jqTr = jQuery(tr);
      for (var i = 0; i < this.columnsLmt; i++) {
        var td = document.createElement('td');
        jqTr.append(td);
      }
    };
    list.prototype.setBodyTable = function (jqTable) {
      var tbody = document.createElement('tbody');
      jqTable.append(tbody);
      var jqTbody = jQuery(tbody);
      for (var i = 0; i < this.rowsLmt; i++) {
        var row = document.createElement('tr');
        jqTbody.append(row);
        var jqRow = jQuery(row);
        for (var j = 0; j < this.columnsLmt; j++) {
          var td = document.createElement('td');
          jqRow.append(td);
        }
      }
    };
    list.prototype.fillContent = function () {
      this.content = [];
      for (var i = 0; i < this.rowsLmt; i++) {
        var dataItem = this.data[0 + i];
        if (dataItem !== undefined && dataItem !== null)
          this.content.push(dataItem);
      }
    };
    list.prototype.fillList = function () {
      this.fillListTitle();
      this.fillListBody();
    };
    list.prototype.setStyles = function () {
      var that = this;
      var cellspacing = this.styles && this.styles.borderWidth || 1;
      var bgColor = this.styles && this.styles.borderColor || 'black';
      that.TitleTable.attr('cellspacing', cellspacing);
      that.TitleTable.css({
        backgroundColor: bgColor,
        tableLayout: 'fixed'
      });
      that.BodyTable.attr('cellspacing', cellspacing);
      that.BodyTable.css({
        backgroundColor: bgColor,
        tableLayout: 'fixed',
      });
      this.styles && this.styles.BodyTableDiv_height && that.BodyTableDiv.css({
        height: BodyTableDiv_height
      });


      var titleBg = this.styles && this.styles.titleBg || 'white';
      var titleColor = this.styles && this.styles.titleColor || 'black';
      var titleFontSize = this.styles && this.styles.titleFontSize || 'inherit';
      var cellBg = this.styles && this.styles.cellBg || 'white';
      var cellColor = this.styles && this.styles.cellColor || 'black';

      var evenBg = this.styles && this.styles.evenBg;
      var oddBg = this.styles && this.styles.oddBg;

      var titleHeight = this.styles && this.styles.titleHeight || 40;
      var cellHeight = this.styles && this.styles.cellHeight;
      var columnsWidth = this.styles && this.styles.columnsWidth;
      that.TitleTable.find('thead td').css({
        color: titleColor,
        fontSize: titleFontSize,
        backgroundColor: titleBg,
        textAlign: 'center',
        overflow: '',
        fontFamily: '微软雅黑',
        fontWeight: this.styles.theadbold ? 'bold' : 'normal',
        'word-break': 'keep-all',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      }).height(titleHeight);
      var self = this;
      if (columnsWidth && columnsWidth.length) {
        that.TitleTable.find('thead td').each(function (index, item) {
          if (index < self.columnsLmt && columnsWidth[index]) {
            jQuery(item).css({width: columnsWidth[index]});
          }
        });
        that.BodyTable.find('tbody td').each(function (index, item) {
          if ((index % self.columnsLmt) < self.columnsLmt && columnsWidth[index]) {
            jQuery(item).css({width: columnsWidth[index]});
          }
        });
      }

      that.BodyTable.find('td').css({
        color: cellColor,
        textAlign: 'center',
        overflow: '',
        'word-break': 'keep-all',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'position': 'relative'
      }).height(cellHeight);
      that.BodyTable.find('tr:nth-child(2n-1) td').css({
        backgroundColor: (oddBg ? oddBg : cellBg)
      });
      that.BodyTable.find('tr:nth-child(2n) td').css({
        backgroundColor: (evenBg ? evenBg : cellBg)
      });
    };
    list.prototype.fillListTitle = function () {
      var self = this;
      this.TitleTable.find('thead td').each(function (index, item) {
        var titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
        if (titleCellContent !== undefined && titleCellContent !== null)
          item.innerHTML = titleCellContent;
      });
    };
    list.prototype.fillListBody = function () {
      var self = this;
      this.BodyTable.find('tr').each(function (index, item) {
        jQuery(item).children('td').each(function (tdIndex, tdItem) {
          var bodyCellContent = self.content && self.content[index]
            && self.content[index][tdIndex] && self.content[index][tdIndex].label;
          if (bodyCellContent !== undefined && bodyCellContent !== null) {
            tdItem.innerHTML = bodyCellContent;
            //$(tdItem).attr("title", bodyCellContent);
          }
          else {
            tdItem.innerHTML = '';
          }
        });
      });
    };
    return list;
  })()

  var historyRecordsModel = function () {
    this.startTime = "";
    this.endTime = "";
    this.timeType = "1hour";
    this.groupType = 1;
    this.docker_instance_name = null;
  };
  historyRecordsModel.prototype.init = function (hostname, docker_instance_name) {
    var that = this;
    this.hostname = hostname;
    this.docker_instance_name = docker_instance_name;
    that.openDialog(function () {
      that.initTime();
      that.bindEvent();
      that.initLineChart();
      that.initTable();
      that.initHistoryData();
    });
  };
  historyRecordsModel.prototype.initHistoryData = function () {
    var that = this;
    jQuery("[name=lineChartTimeType]").each(function (index, el) {
      jQuery(el).removeClass("focus");
      if (jQuery(el).data("value") == that.timeType) {
        jQuery(el).addClass("focus");
      }
    });
    that.getHistoryData(function (data) {
      that.historyData = data;
      that.updateLineChartAndTable();
    });
  };
  historyRecordsModel.prototype.openDialog = function (callback) {
    var that = this;
    var width = 1071;
    var height = 830;
    this.seeDialog = new PopupDialog_({
      url: 'content/history_records/index.html',
      width: width,
      height: height,
      context: that,
      callback: function () {
        callback && callback();
      }
    });
    this.seeDialog.open();
  };
  historyRecordsModel.prototype.initTime = function () {
    var that = this;
    var result = that.getNowTime();
    that.startTime = result.startTime;
    that.endTime = result.endTime;
    jQuery("#history_records_calendar_start_input input").val(result.time);
    jQuery("#history_records_calendar_end_input input").val(result.time);
  };
  historyRecordsModel.prototype.bindEvent = function () {
    var that = this;
    jQuery("#history_records_calendar_start_input").unbind("click").click(function () {
      that.showSelectCalendar("history_records_calendar_start", "history_records_calendar_start_select", function () {
        that.startTime = jQuery("#history_records_calendar_start_input input").val() + "T00:00:00" + encodeURIComponent("+") + "0800";
      });
      jQuery("[name=searchTime]").each(function (index, el) {
        jQuery(el).removeClass("focus");
      });
      that.timeType = "";
      return false;
    });
    jQuery("#history_records_calendar_end_input").unbind("click").click(function () {
      that.showSelectCalendar("history_records_calendar_end", "history_records_calendar_end_select", function () {
        that.endTime = jQuery("#history_records_calendar_end_input input").val() + "T23:59:59" + encodeURIComponent("+") + "0800";
      });
      jQuery("[name=searchTime]").each(function (index, el) {
        jQuery(el).removeClass("focus");
      });
      that.timeType = "";
      return false;
    });
    //搜索选项的时间
    jQuery("[name=searchTime]").click(function () {
      var self = this;
      if (jQuery(self).hasClass("focus")) {
        jQuery(self).removeClass("focus");
        that.timeType = "";
        that.startTime = jQuery("#history_records_calendar_start_input input").val() + "T00:00:00" + encodeURIComponent("+") + "0800";
        that.endTime = jQuery("#history_records_calendar_end_input input").val() + "T23:59:59" + encodeURIComponent("+") + "0800";
      } else {
        jQuery(self).addClass("focus");
        that.timeType = jQuery(self).data("value");
        var result = that.getNowTime();
        that.startTime = result.startTime;
        that.endTime = result.endTime;
        jQuery("#history_records_calendar_start_input input").val(result.time);
        jQuery("#history_records_calendar_end_input input").val(result.time);
      }
      jQuery("[name=searchTime]").each(function (index, el) {
        if (el !== self) {
          jQuery(el).removeClass("focus");
        }
      });
    });
    //搜索按钮
    jQuery("#history_records_search_button").click(function () {
      that.groupType = Number(jQuery("[name=history_records_groupType_radio]:checked").data("type"));
      that.initHistoryData();
    });
    //折线表格的tab
    jQuery("[name=lineChartTimeType]").click(function () {
      jQuery("[name=lineChartTimeType]").each(function (index, el) {
        jQuery(el).removeClass("focus");
      });
      jQuery(this).addClass("focus");
      that.timeType = jQuery(this).data("value");
      that.getHistoryData(function (data) {
        that.historyData = data;
        that.updateLineChartAndTable();
      });
    });
  };
  historyRecordsModel.prototype.showSelectCalendar = function (calId, inputID, callback) {
    var that = this;
    that.destroyCalendar(calId);
    var sel_cal = new HistoryRecordsCalendar(inputID);
    sel_cal.extendOnClick = function (object) {
      var curr_date_index = -1;
      var length = sel_cal.curr_month_date_elements.length;
      for (var i = 0; i < length; i++) {
        if (sel_cal.curr_month_date_elements[i] === object) {
          curr_date_index = i;
          break;
        }
      }
      if (curr_date_index == -1) {

      } else {
        var year = sel_cal.helper.curr_month[0];
        var month = sel_cal.helper.curr_month[1];
        that.setDateRange(curr_date_index + 1, month, year, calId, callback);
      }
    };
    document.addEventListener('mousedown', function removeBind(e) {
      if (!jQuery("#" + calId)[0].contains(e.target)) {
        that.destroyCalendar(calId);
        document.removeEventListener('mousedown', removeBind)
      }
    })
  };
  historyRecordsModel.prototype.destroyCalendar = function (calId) {
    if (jQuery("#" + calId + " .date-selector").length > 0) {
      jQuery("#" + calId + " .date-selector")[0].innerHTML = "";
    }
  };
  historyRecordsModel.prototype.setDateRange = function (day, month, year, calId, callback) {
    var that = this;
    var from_input = jQuery("#" + calId + " input")[0];
    var _month = month < 9 ? (month + 1) : (month + 1);
    var _day = day < 10 ? (day) : (day);
    var label = String(year) + "-" + String(that.lessTenPluwZero(_month)) + "-" + String(that.lessTenPluwZero(_day));
    from_input.value = label;
    that.from_set = true;
    that.destroyCalendar(calId);
    callback && callback(label);
  };
  historyRecordsModel.prototype.initLineChart = function () {
    var that = this;
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 30,
        bottom: 20,
        data: ['请求数量', '平均响应时间', '平均响应大小']
      },
      grid: {
        left: '3%',
        right: '150px',
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
          color: '#8696A9'
        },
        axisLine: {
          lineStyle: {
            color: '#D8D8D8',
            width: 2,
          }
        }
      },
      series: [
        {
          name: '请求数量',
          type: 'line',
          stack: '总量',
          data: []
        },
        {
          name: '平均响应时间',
          type: 'line',
          stack: '总量',
          data: []
        },
        {
          name: '平均响应大小',
          type: 'line',
          stack: '总量',
          data: []
        }
      ]
    };
    var myChart = echarts.init(document.getElementById('history_records_lineChart'));
    myChart.setOption(option);
    that.LineChart = myChart;
  };
  historyRecordsModel.prototype.updateLineChartAndTable = function () {
    var that = this;
    var option = {
      xAxis: {
        data: [],
      },
      series: [
        {
          name: '请求数量',
          type: 'line',
          stack: '总量',
          data: []
        },
        {
          name: '平均响应时间',
          type: 'line',
          stack: '总量',
          data: []
        },
        {
          name: '平均响应大小',
          type: 'line',
          stack: '总量',
          data: []
        }
      ]
    };
    var Table_Titles_Widths = ["111px"];
    var Table_Titles_Content = [" "];
    var Table_Titles_Data = that.formTableData();
    var sbas100_sbas101_sbas102IndexArray = [];
    switch (that.groupType){
      case 1:
        sbas100_sbas101_sbas102IndexArray = [3,4,5];
        break;
      case 2:
        sbas100_sbas101_sbas102IndexArray = [5,6,7];
        break;
      case 3:
        sbas100_sbas101_sbas102IndexArray = [4,5,6];
        break;
      case 4:
        sbas100_sbas101_sbas102IndexArray = [4,5,6];
        break;
    }
    var sbas100_tmp = 0;
    var sbas101_tmp = 0;
    var sbas102_tmp = 0;
    that.historyData.forEach(function (item,index) {
      var date = item[0];
      var time = that.formatTimeOfxAxis(date);
      option.xAxis.data.push(time);
      var sbas100 = item[sbas100_sbas101_sbas102IndexArray[0]];
      var sbas101 = item[sbas100_sbas101_sbas102IndexArray[1]];
      var sbas102 = item[sbas100_sbas101_sbas102IndexArray[2]];
      option.series[0].data.push(sbas100);
      option.series[1].data.push(sbas101);
      option.series[2].data.push(sbas102);

      Table_Titles_Widths.push("90px");
      Table_Titles_Content.push(time);

      var sbas100_class = "";
      var sbas100_arrow = "";
      if(sbas100 > sbas100_tmp){
        sbas100_class = "up";
        sbas100_arrow = "次 ↑";
      }else if(sbas100 == sbas100_tmp){
        sbas100_class = "";
        sbas100_arrow = "次 →";
      }else{
        sbas100_class = "down";
        sbas100_arrow = "次 ↓";
      }
      Table_Titles_Data[0].push({
        label: '<div class="td ' + sbas100_class + '" title="' + sbas100 + '">' +
        '<input type="text" readonly value="' + sbas100 + sbas100_arrow + '"/>' +
        '</div>'
      });
      var sbas101_class = "";
      var sbas101_arrow = "";
      if(sbas101 > sbas101_tmp){
        sbas101_class = "up";
        sbas101_arrow = "秒 ↑";
      }else if(sbas101 == sbas101_tmp){
        sbas101_class = "";
        sbas101_arrow = "秒 →";
      }else{
        sbas101_class = "down";
        sbas101_arrow = "秒 ↓";
      }
      Table_Titles_Data[1].push({
        label: '<div class="td ' + sbas101_class + '" title="' + sbas101 + '">' +
        '<input type="text" readonly value="' + sbas101 + sbas101_arrow + '"/>' +
        '</div>'
      });
      var sbas102_class = "";
      var sbas102_arrow = "";
      if(sbas102 > sbas102_tmp){
        sbas102_class = "up";
        sbas102_arrow = " ↑";
      }else if(sbas102 == sbas102_tmp){
        sbas102_class = "";
        sbas102_arrow = " →";
      }else{
        sbas102_class = "down";
        sbas102_arrow = " ↓";
      }
      Table_Titles_Data[2].push({
        label: '<div class="td ' + sbas102_class + '" title="' + sbas102 + '">' +
        '<input type="text" readonly value="' + sbas102 + sbas102_arrow + '"/>' +
        '</div>'
      });

      sbas100_tmp = sbas100;
      sbas101_tmp = sbas101;
      sbas102_tmp = sbas102;
    });
    that.LineChart.setOption(option);

    var tableOption = {
      rows: 4,
      columns: Table_Titles_Widths.length,
      containerId: 'history_records_table',
      titles: Table_Titles_Content.map(function (item) {
        return {label: item}
      }),
      listType: 0,
      data: Table_Titles_Data,
      styles: {
        borderColor: '#F9F9F9',
        borderWidth: 1,
        titleHeight: 49,
        titleBg: '#F9F9F9',
        titleColor: '#8E9DAE',
        titleFontSize: '15px',
        cellBg: 'white',
        evenBg: '#F9F9F9',
        cellColor: 'rgb(114,114,114)',
        cellHeight: 49,
        footBg: 'white',
        theadbold: false,
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: Table_Titles_Widths
      }
    };
    var Table = new list(tableOption);
    Table.create();
  };
  historyRecordsModel.prototype.initTable = function () {
    var that = this;
    var widths = ["111px"];
    var table_data = that.formTableData();
    var Table = new list({
      rows: 4,
      columns: widths.length,
      containerId: 'history_records_table',
      titles: [{
        label: " "
      }],
      listType: 0,
      data: table_data,
      styles: {
        borderColor: '#F9F9F9',
        borderWidth: 1,
        titleHeight: 49,
        titleBg: '#F9F9F9',
        titleColor: '#8E9DAE',
        titleFontSize: '15px',
        cellBg: 'white',
        evenBg: '#F9F9F9',
        cellColor: 'rgb(114,114,114)',
        cellHeight: 49,
        footBg: 'white',
        theadbold: false,
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: widths
      }
    });
    Table.create();
    that.Table = Table;
  };
  historyRecordsModel.prototype.getHistoryData = function (callback) {
    var that = this;
    var time_unit;
    switch (that.timeType) {
      case "1hour":
        time_unit = "minute";
        break;
      case "1day":
        time_unit = "hour";
        break;
      default:
        time_unit = "day";
        break;
    }
    var dimension = "";
    switch (that.groupType){
      case 1:
        dimension = "hostname,docker_instance_name";
        break;
      case 2:
        dimension = "hostname,docker_instance_name,dockerimage,module";
        break;
      case 3:
        dimension = "hostname,docker_instance_name,responsetime";
        break;
      case 4:
        dimension = "hostname,docker_instance_name,status";
        break;
    }
    var url = aquadaas_host + "/aquadaas/rest/analytics/" + time_unit + "?measure=sbas_100,sbas_101,sbas_102&dimension=" + dimension;
    url = url + "&begin_time=" + that.startTime;
    url = url + "&end_time=" + that.endTime;
    url = url + "&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + "";
    var result = null;
    var data = {
      "dimensionConditions": [
        [
          "hostname='" + that.hostname + "'",
          "docker_instance_name='" + that.docker_instance_name + "'"
        ],
      ]
    }
    $.ajax({
      type: "POST",
      async: true,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
      },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
    }).done(function (data, status, xhr) {
      if (!data) {
        data = [];
      }
      callback && callback(data);
    });
    return result;
  };


  historyRecordsModel.prototype.getNowTime = function () {
    var that = this;
    var result = {};
    var time = new Date();
    switch (that.timeType) {
      case "1hour":
        var oneHourAgo = new Date(time.getTime() - 1 * 60 * 60 * 1000);
        result = {
          startTime: that.format_date(oneHourAgo, true),
          endTime: that.format_date(time, true),
          time: that.format_date(time)
        };
        break;
      case "1day":
        var yesterdsay = new Date(time.getTime() - 24 * 60 * 60 * 1000);
        result = {
          startTime: that.format_date(yesterdsay, true),
          endTime: that.format_date(time, true),
          time: that.format_date(time)
        };
        break;
      default:
        break;
    }
    return result;
  };
  historyRecordsModel.prototype.formTableData = function () {
    var list_data = [];
    list_data.push([{label: "请求数量"}]);
    list_data.push([{label: "平均响应时间"}]);
    list_data.push([{label: "平均响应大小"}]);
    return list_data;
  };
  historyRecordsModel.prototype.format_date = function (date_, hms) {
    var that = this;
    var y = this.lessTenPluwZero(date_.getFullYear());
    var m = this.lessTenPluwZero(date_.getMonth() + 1);//获取当前月份的日期
    var d = this.lessTenPluwZero(date_.getDate());
    var hour = this.lessTenPluwZero(date_.getHours());
    var minutes = this.lessTenPluwZero(date_.getMinutes());
    var seconds = this.lessTenPluwZero(date_.getSeconds());
    var timezoneOffset = encodeURIComponent("+") + "0800";
    /*
     if(date_.getTimezoneOffset()/60 <= 0){
     timezoneOffset = "+" + that.lessTenPluwZero(Math.abs(date_.getTimezoneOffset()/60)) + "00";
     }else{
     timezoneOffset = "-" + that.lessTenPluwZero(Math.abs(date_.getTimezoneOffset()/60)) + "00";
     }
     */
    if (hms) {
      return y + "-" + m + "-" + d + "T" + hour + ":" + minutes + ":" + seconds + timezoneOffset;
    } else {
      return y + "-" + m + "-" + d;
    }
  };
  historyRecordsModel.prototype.formatTimeOfxAxis = function (date) {
    var that = this;
    var time = date.split(/[^0-9]/);
    var m = time[1];
    var d = time[2];
    var hour = time[3];
    var minute = time[4];
    var result = "";
    switch (that.timeType) {
      case "1hour":
        result = minute + "m";
        break;
      case "1day":
        result = hour + "h";
        break;
      default:
        result = m + "-" + d;
        break;
    }
    return result;
  };
  historyRecordsModel.prototype.lessTenPluwZero = function (object) {
    if (object < 10) {
      object = "0" + object;
    }
    return object;
  }


  return historyRecordsModel;
})(jQuery);