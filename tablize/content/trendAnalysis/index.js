var trendAnalysis = (function ($) {
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
      $("#" + that.containerId).mCustomScrollbar("destroy");
      this.createList();
      this.fillContent();

      this.fillList();

      if(this.Table.width() >= $("#" + that.containerId)){
        this.Table.css({"width": "100%"});
      }
      $("#" + that.containerId).mCustomScrollbar({
        theme:"light",
        axis: "xy" // vertical and horizontal scrollbar
      });
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
      var jqContainer = $(container);
      jqContainer.empty();
      var TitleTable = document.createElement('table');
      jqContainer.append(TitleTable);

      var jqTable = $(TitleTable);
      this.Table = jqTable;

      that.setTitleTable(jqTable);
      that.setBodyTable(jqTable);
      this.setStyles();

      //this.setStyles(jqTable);
      //this.jqTable = jqTable;
    };
    list.prototype.setTitleTable = function (jqTable) {
      var tbody = document.createElement('thead');
      jqTable.append(tbody);
      var tr = document.createElement('tr');
      $(tbody).append(tr);

      var jqTr = $(tr);
      for (var i = 0; i < this.columnsLmt; i++) {
        var td = document.createElement('td');
        jqTr.append(td);
      }
    };
    list.prototype.setBodyTable = function (jqTable) {
      var tbody = document.createElement('tbody');
      jqTable.append(tbody);
      var jqTbody = $(tbody);
      for (var i = 0; i < this.rowsLmt; i++) {
        var row = document.createElement('tr');
        jqTbody.append(row);
        var jqRow = $(row);
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
      that.Table.attr('cellspacing', cellspacing);
      that.Table.css({
        backgroundColor: bgColor,
        tableLayout: 'fixed'
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
      that.Table.find('thead td').css({
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
        that.Table.find('thead td').each(function (index, item) {
          if (index < self.columnsLmt && columnsWidth[index]) {
            $(item).css({width: columnsWidth[index]});
          }
        });
        that.Table.find('tbody td').each(function (index, item) {
          if ((index % self.columnsLmt) < self.columnsLmt && columnsWidth[index]) {
            $(item).css({width: columnsWidth[index]});
          }
        });
      }

      that.Table.find('tbody td').css({
        color: cellColor,
        textAlign: 'center',
        overflow: '',
        'word-break': 'keep-all',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'position': 'relative'
      }).height(cellHeight);
      that.Table.find('tbody tr:nth-child(2n-1) td').css({
        backgroundColor: (oddBg ? oddBg : cellBg)
      });
      that.Table.find('tbody tr:nth-child(2n) td').css({
        backgroundColor: (evenBg ? evenBg : cellBg)
      });
    };
    list.prototype.fillListTitle = function () {
      var self = this;
      this.Table.find('thead td').each(function (index, item) {
        var titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
        if (titleCellContent !== undefined && titleCellContent !== null)
          item.innerHTML = titleCellContent;
      });
    };
    list.prototype.fillListBody = function () {
      var self = this;
      this.Table.find('tbody tr').each(function (index, item) {
        $(item).children('td').each(function (tdIndex, tdItem) {
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

  var trendAnalysis = {};
  trendAnalysis.init = function () {
    var that = this;
    that.initParm();
    that.initTime();
    that.updateOptionsForGrouping("trendAnalysis_display_container_fenzu", "grouping", that.options.groupingInput_Type, []);
    that.bindEvent();
    that.initLineChart();
    that.initTable();
  };
  trendAnalysis.initParm = function () {
    var that = this;
    that.timeType = "day";
    that.yType = "10";
    that.topN = "10";
    that.LineChartOption = {};
    that.LineChartOption_series = [];
    that.options = {
      QuotaData: [],//获取指标的所有数据
      GroupData: [],//根据用户选中的指标提取出来的共同分组
      SelectedQuotaArray: [],//用户选中的指标
      groupingSelect: null,//分组一栏里的下拉菜单组件
      groupingSelect_Value: 0,//分组一栏里的下拉菜单的状态
      groupingInput_Type: 'radio',//分组一栏里的下拉菜单的input的type值
      FilterData: [],//过滤一栏里的值(也就是用户在过滤对话框里所设置)
    }
  };
  trendAnalysis.initTime = function () {
    var that = this;
    that.datePicker_start = new DatePicker({
      containerId: 'trendAnalysis_calendar_start',
      calendarStyles: calendarStyles,
      dateInputStyles: dateInputStyles,
      iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
      iconStyle: {
        left: 115
      },
      editable: false
    });
    that.datePicker_end = new DatePicker({
      containerId: 'trendAnalysis_calendar_end',
      calendarStyles: calendarStyles,
      dateInputStyles: dateInputStyles,
      iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
      iconStyle: {
        left: 115
      },
      editable: false
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

    var select_options = [{
        key: "10",
        value:"Top10"
      },
      {
        key: "20",
        value:"Top20"
      },{
        key: "30",
        value:"Top30"
      },
    ];
    var topNSelect = new TicketnewSelect("#trendAnalysis_topN", select_options, {
      width: 115,
      height: 32,
      background: "#ffffff",
      fontSize: 12,
      liFontSize: 12,
      color: "#828282",
      liColor: "#828282",
      selectbackground: "#ffffff",
      headerBorder: "1px solid #E2E2E2",
      openIconUrl: "./uiWidget/images/open2.png",
      closeIconUrl: "./uiWidget/images/close2.png",
    });
    that.topNSelect = topNSelect;

    var select_options = [{
      key: "Logscale",
      value:"log scale"
    },
      {
        key: "Linearscale",
        value: "linear scale"
      }];
    var yTypeSelect = new TicketnewSelect("#trendAnalysis_yType", select_options, {
      width: 115,
      height: 32,
      background: "#ffffff",
      fontSize: 12,
      liFontSize: 12,
      color: "#828282",
      liColor: "#828282",
      selectbackground: "#ffffff",
      headerBorder: "1px solid #E2E2E2",
      openIconUrl: "./uiWidget/images/open2.png",
      closeIconUrl: "./uiWidget/images/close2.png",
    });
    that.yTypeSelect = yTypeSelect;
  };
  trendAnalysis.bindEvent = function () {
    var that = this;
    //指标
    $("#trendAnalysis_quota_button").unbind("click").click(function () {
      trendAnalysis_Lib.openQuotaDialog(that.options.SelectedQuotaArray, function(result){
        that.options.QuotaData = result.json
        that.options.SelectedQuotaArray = result.selected;
        that.updateOptionsCheckbox({
          containerID: "trendAnalysis_display_container_zhibiao",
          tag: "quota",
          checkboxType: "checkbox",
          data: that.options.SelectedQuotaArray
        });
        that.options.GroupData = that.getGroup(that.options.SelectedQuotaArray, that.options.QuotaData)
        that.options.groupingSelect_Value = 0;
        that.updateOptionsForGrouping("trendAnalysis_display_container_fenzu", "grouping", that.options.groupingInput_Type, that.options.GroupData);
        that.emitFilterChange();
        that.topNchange();
      });
    });
    //选择不同指标导致分组的各种不同
    $('#trendAnalysis_display_container_zhibiao').unbind("click").on('click', '.trendAnalysis_checkbox.quota', function (ev) {
      that.options.SelectedQuotaArray = that.getSelectedQuotaArray();
      that.options.GroupData = that.getGroup(that.options.SelectedQuotaArray, that.options.QuotaData)
      that.updateOptionsForGrouping("trendAnalysis_display_container_fenzu", "grouping", that.options.groupingInput_Type, that.options.GroupData);
      that.emitFilterChange();
      that.topNchange();
    });
    //分组在单选情况下的逻辑
    $('#trendAnalysis_display_container_fenzu').unbind("click").on('click', '.trendAnalysis_checkbox .checkbox input[type=radio]', function (ev) {
      var $radio = $(this);
      if ($radio.data('radiochecked')) {
        $('#trendAnalysis_display_container_fenzu .trendAnalysis_checkbox .checkbox input[type=radio]').data('radiochecked', false);
        $radio.prop('checked', false);
        $radio.data('radiochecked', false);
      }
      else {
        $('#trendAnalysis_display_container_fenzu .trendAnalysis_checkbox .checkbox input[type=radio]').data('radiochecked', false);
        $radio.prop('checked', true);
        $radio.data('radiochecked', true);
      }
    });
    //单选 or 多选
    $("#trendAnalysis_grouping_checkboxtype_button").unbind("click").click(function () {
      var id = that.options.groupingSelect.getValue();
      var tag = that.options.groupingInput_Type;
      if (that.options.groupingInput_Type == "radio") {
        $("#trendAnalysis_grouping_checkboxtype_button .img1").hide();
        $("#trendAnalysis_grouping_checkboxtype_button .img2").show();
        $("#trendAnalysis_grouping_checkboxtype_button .text").text(i18n("TRENDANALYSIS_RADIO_SPACE"));
        that.options.groupingInput_Type = "checkbox"
      } else {
        $("#trendAnalysis_grouping_checkboxtype_button .img1").show();
        $("#trendAnalysis_grouping_checkboxtype_button .img2").hide();
        $("#trendAnalysis_grouping_checkboxtype_button .text").text(i18n("TRENDANALYSIS_CHECKBOX_SPACE"));
        that.options.groupingInput_Type = "radio"
      }
      that.updateOptionsCheckbox({
        containerID: "trendAnalysis_GroupingCheckbox",
        tag: "grouping",
        checkboxType: that.options.groupingInput_Type,
        data: that.options.GroupData[parseInt(id) - 1] || []
      });
    });
    //过滤
    $("#trendAnalysis_filtration_button").unbind("click").click(function () {
      var SelectedQuotaArray = that.getSelectedQuotaArray();
      if(SelectedQuotaArray.length == 0){
        return;
      }
      var AllGroupingArray = that.getAllGroupingArray();
      if(AllGroupingArray.length == 0){
        return;
      }
      trendAnalysis_Lib.openFilterDialog(AllGroupingArray, function (result) {
        that.updateOptionsForFilter("trendAnalysis_filter_display_container", "filter", "checkbox", result);
        that.options.FilterData = that.getAllGroupingArray();
        that.topNchange();
      });
    });
    //过滤内的checkbox勾选事件触发是否显示TopN对话框
    $('#trendAnalysis_filter_display_container').unbind("click").on('click', '.trendAnalysis_checkbox.filter', function (ev) {
      that.topNchange();
    });
    //重置条件
    $("#trendAnalysis_clearButton").unbind("click").click(function () {
      that.options.FilterData.forEach(function(item){
        item.selected = []
      });
      $("#trendAnalysis_filter_display_container").html("");
      $("#trendAnalysis  .day-sum-block .options .left").nanoScroller();
    });
    //搜索按钮
    $("#trendAnalysis_searchButton").click(function () {
      var SelectedQuotaArray = that.getSelectedQuotaArray();
      if(SelectedQuotaArray.length == 0){
        trendAnalysis_Lib.openMessageDialog(i18n("TRENDANALYSIS_DIALOG_CONTENT2"));
        return;
      }
      var options = that.searchData();
      that.updateGranularity(options.measure_hash);
      that.initHistoryData(options);
    });
    //折线表格的tab
    $("[name=lineChartTimeType]").click(function () {
      $("[name=lineChartTimeType]").each(function (index, el) {
        $(el).removeClass("focus");
      });
      $(this).addClass("focus");
      that.timeType = $(this).data("value");
      var options = that.searchData();
      that.initHistoryData(options);
    });
    that.scrollEventBind = that.scrollEvent.bind(that);
    window.addEventListener("scroll", that.scrollEventBind);
    $("#trendAnalysis  .day-sum-block .options .left").on("update", function(event, values){
      that.scrollEvent()
    });

    that.yTypeSelect.listenLiClick = function (yType) {
      if(yType == "Logscale"){
        that.yType = "10";
      }else{
        that.yType = "line";
      }
      that.updateLineChart();
    }

    that.topNSelect.listenLiClick = function (topN) {
      that.topN = topN;
      var options = that.searchData();
      that.initHistoryData(options);
    }
  };
  trendAnalysis.scrollEvent = function(){
    var that = this;
    if($("#trendAnalysis")[0]){
      that.options.groupingSelect && that.options.groupingSelect.switchToOpenIcon()
    }else{
      window.removeEventListener("scroll", that.scrollEventBind);
    }
  };
  trendAnalysis.emitFilterChange = function(){
    var that = this;
    that.options.FilterData = that.getAllGroupingArray();
    if(that.options.FilterData.length == 0){
      $("#trendAnalysis_filtration_button").addClass("disabled");
    }else{
      $("#trendAnalysis_filtration_button").removeClass("disabled");
    }
    that.updateOptionsForFilter("trendAnalysis_filter_display_container", "filter", "checkbox", that.options.FilterData);
  }
  trendAnalysis.topNchange = function(){
    var that = this;
    var filterCheckedNumber = 0;
    var fenzuCheckedNumber = 0;
    $("#trendAnalysis_filter_display_container .trendAnalysis_checkbox>.checkbox>input:checked").each(function (index, el) {
      filterCheckedNumber = filterCheckedNumber + 1;
    });
    $("#trendAnalysis_display_container_fenzu .trendAnalysis_checkbox>.checkbox>input:checked").each(function (index, el) {
      fenzuCheckedNumber = fenzuCheckedNumber + 1;
    });
    //如果过滤框里有勾选，或者分组没勾选,不显示topN下拉框
    if((filterCheckedNumber != 0) || (fenzuCheckedNumber == 0)){
      that.topN = null;
      $("#trendAnalysis_topN").hide();
    }else{
      that.topN = that.topNSelect.getValue()
      $("#trendAnalysis_topN").show();
    }
  }
  trendAnalysis.updateOptionsCheckbox = function (options) {
    var that = this;
    var containerID = options.containerID;//容器节点或者ID名
    var tag = options.tag || "";//指标，分组，过滤之一
    var sub_tag = options.sub_tag || "";//过滤情况下额外设置的参数，方便抓取
    var checkboxType = options.checkboxType || "checkbox";//input的type
    var data = options.data || [];//数据
    var container;
    if (typeof containerID == "string") {
      container = $("#" + containerID)
    } else {
      container = $(containerID)
    }
    container.html("");
    data.forEach(function (item) {
      var checkbox = $(
        '<div class="trendAnalysis_checkbox ' + tag + '">' +
        '<div class="checkbox">' +
        '<input type="' + checkboxType + '" ' +
        (((checkboxType == 'checkbox') && (tag !== "grouping")) ? 'checked' : '') + ' ' +
        'name="' + tag + '" ' +
        'data-id="' + item.id + '" ' +
        'data-name="' + item.name + '"  ' +
        (sub_tag ? ('data-subtag="' + sub_tag + '"  ') : "") +
        'id="' + tag + '_' + (sub_tag ? sub_tag : "") + item.id + '"' +
        '>' +
        '<label for="' + tag + '_' + (sub_tag ? sub_tag : "") + item.id + '"> </label>' +
        '</div>' +
        '<div class="checkboxLabel" title="' + item.name + '">' + item.name + '</div>' +
        '</div>');
      container.append(checkbox);
    });
    $("#trendAnalysis  .day-sum-block .options .left").nanoScroller();
  };
  trendAnalysis.updateOptionsForGrouping = function (containerID, tag, checkboxType, data) {
    var that = this;
    that.options.groupingSelect_Value = 0;
    $("#" + containerID).html("");
    var length = data && data.length || 0;
    var subContainer = $("<div  class='sub_option_content'></div>");
    $("#" + containerID).append(subContainer);
    var select_options = []
    select_options.push({
      key: 0,
      value: i18n("TRENDANALYSIS_NOTGROUPING")
    });
    for (var i = 0; i < length; i++) {
      var select_option = data[i].map(function(x){return x.id && x.id.toUpperCase()}).join("+")
      select_options.push({
        key: i + 1,
        value: select_option
      });
    }
    var selectContainer = $("<div class='option_content_left' id='trendAnalysis_GroupingSelect'></div>");
    subContainer.append(selectContainer);
    var groupingSelect = new TicketnewSelect("#trendAnalysis_GroupingSelect", [], {
      width: 90,
      height: 30,
      background: "#ffffff",
      fontSize: 12,
      liFontSize: 12,
      color: "#828282",
      liColor: "#828282",
      selectbackground: "#ffffff",
      headerBorder: "1px solid #E2E2E2",
      openIconUrl: "./uiWidget/images/open2.png",
      closeIconUrl: "./uiWidget/images/close2.png",
    }, function (groupingSelect_Value) {
      var groupingSelect_Value = parseInt(groupingSelect_Value)
      if(that.options.groupingSelect_Value == groupingSelect_Value){
        return
      }
      that.options.groupingSelect_Value = parseInt(groupingSelect_Value);
      that.updateOptionsCheckbox({
        containerID: "trendAnalysis_GroupingCheckbox",
        tag: tag,
        checkboxType: that.options.groupingInput_Type,
        data: data[that.options.groupingSelect_Value - 1] || []
      });
      $("#trendAnalysis_display_container_fenzu .trendAnalysis_checkbox>.checkbox>input:first").prop('checked', true);
      that.emitFilterChange();
      that.topNchange();
    });
    groupingSelect.updateSelectOptions(select_options);
    groupingSelect.setKey(that.options.groupingSelect_Value);
    that.options.groupingSelect = groupingSelect;
    var GroupingCheckbox = $("<div class='option_content_right' id='trendAnalysis_GroupingCheckbox'></div>");
    subContainer.append(GroupingCheckbox);
    that.updateOptionsCheckbox({
      containerID: "trendAnalysis_GroupingCheckbox",
      tag: tag,
      checkboxType: checkboxType,
      data: data[that.options.groupingSelect_Value - 1] || []
    });
    $("#trendAnalysis_display_container_fenzu .trendAnalysis_checkbox>.checkbox>input:first").prop('checked', true);
  };
  trendAnalysis.updateOptionsForFilter = function (containerID, tag, checkboxType, data) {
    var that = this;
    $("#" + containerID).html("");
    data.forEach(function (option) {
      if(option.selected.length > 0 ){
        var subContainer = $("<div class='sub_option_content'></div>");
        $("#" + containerID).append(subContainer);
        var FilterName = $("<div class='option_content_left option_subTitle'></div>");
        FilterName.text(option.name + "过滤:");
        subContainer.append(FilterName);
        var FilterCheckbox = $("<div class='option_content_right'></div>");
        subContainer.append(FilterCheckbox);
        that.updateOptionsCheckbox({
          containerID: FilterCheckbox,
          tag: tag,
          sub_tag: option.id,
          checkboxType: checkboxType,
          data: option["selected"].map(function (item, index) {
            return {
              id: index,
              name: item,
            }
          })
        });
      }
    })
  };
  trendAnalysis.getGroup = function(arrays,json){
    var that= this;
    var group = {};
    var result = [];
    var tmp = [];
    if (arrays.length == 0) {
      return result;
    }
    arrays.forEach(function(itemA){
      tmp.push(json[itemA.id]["group"])
    });
    var min = Math.min.apply(null, tmp.map(function (item) {
      return item.length;
    }));
    for (var i = 0; i < min; i++) {
      result.push((intersect(tmp.map(function (item) {
        return item[i];
      }))).map(function (item) {
        var array = item.split(":")
        return {
          id: array[0],
          name: array[1],
        }
      }));
    }
    return result;

    function intersect(args) {
      var ret = [],
        argsLen = args.length,
        item,
        i,
        j,
        len;
      var arr = args[0];

      for (i = 0, len = arr.length; i < len; i++) {
        item = arr[i];
        if (contain(ret, item)) continue;

        for (j = 1; j < argsLen; j++) {
          if (!contain(args[j], item)) break;
        }

        if (j === argsLen) ret.push(item);
      }

      return ret;
    }
    function contain(array, target) {
      var result = -1;
      var item;
      for (var i = 0; i < array.length; i++) {
        item = array[i];
        if (target == item) {
          result = i;
          break;
        }
      }
      if (result >= 0) {
        return true
      } else {
        return false
      }
    }
  };

  trendAnalysis.getSelectedQuotaArray = function () {
    var SelectedQuotaArray = [];
    $("#trendAnalysis_display_container_zhibiao .trendAnalysis_checkbox>.checkbox>input:checked").each(function (index, el) {
      SelectedQuotaArray.push({
        id: $(el).data("id"),
        name: $(el).data("name"),
      });
    });
    return SelectedQuotaArray;
  };
  trendAnalysis.getAllGroupingArray = function () {
    var result = [];
    $("#trendAnalysis_display_container_fenzu .trendAnalysis_checkbox>.checkbox>input").each(function (index, el) {
      var id = $(el).data("id") + '';
      var name = $(el).data("name") + '';
      var checked = $(el).is(":checked")
      result.push({
        id: id,
        name: name,
        checked: checked,
        selected: (function () {
          var result = [];
          $("#trendAnalysis_filter_display_container .trendAnalysis_checkbox>.checkbox>input[data-subtag='" + id + "']:checked").each(function (index, el) {
            result.push($(el).data("name") + '');
          });
          return result;
        })()
      });
    });
    return result;
  };
  trendAnalysis.searchData = function () {
    var that = this;

    var timezoneOffset = encodeURIComponent("+") + "0800";
    var start_time = that.datePicker_start.getDateStr() + "T00:00:00" + timezoneOffset;
    var end_time = that.datePicker_end.getDateStr() + "T23:59:59" + timezoneOffset;

    var measure = "";
    var measure_Array = that.options.SelectedQuotaArray.map(function (item) {
      return item.id
    });
    measure = measure_Array.join(",");

    var dimension = "";
    var dimension_Array = (that.getAllGroupingArray()).filter(function(item){
      return item.checked
    }).map(function (item) {
      return item.id;
    });
    dimension = dimension_Array.join(",");

    var dimensionConditions = that.getDimensionConditions(that.getAllGroupingArray());

    var combineBodyData;
    if (dimensionConditions.length == 0) {
      combineBodyData = {}
    } else {
      combineBodyData = {
        "dimensionConditions": dimensionConditions
      };
    }

    var result = {
      begin_time: start_time,
      end_time: end_time,
      measure: measure, //指标
      measure_hash: that.options.SelectedQuotaArray,//指标
      dimension: dimension,//分组
      postData: combineBodyData//post
    };
    if(that.topN){
      if(result.measure_hash.length == 1){
        result.num = that.topN;
        result.details = 'true';
        delete result.postData;
      }
    }
    return result;
  };
  trendAnalysis.getDimensionConditions = function(SelectGroupingArray){
    var dimensionConditions = [];
    function getResult(tmp,index){
      if(index == SelectGroupingArray.length){
        dimensionConditions.push(tmp);
        return;
      }
      var a = SelectGroupingArray[index];
      var tmp1 = [];
      var item;
      if(a.selected.length == 0){
        getResult(tmp,index + 1)
      }else{
        for(var i = 0; i < a.selected.length; i++){
          item = a.selected[i];
          tmp1 = JSON.parse(JSON.stringify(tmp))
          tmp1.push(a.id + "='" + item + "'");
          getResult(tmp1,index + 1)
        }
      }
    }
    getResult([],0)
    return dimensionConditions;
  };
  trendAnalysis.updateGranularity = function(selectQuotas){
    var that = this;
    $("[name=lineChartTimeType]").removeClass("focus");
    $("[name=lineChartTimeType]").hide();
    var TimeType = {};
    selectQuotas.forEach(function(Quota){
      var granularitys = that.options.QuotaData[Quota.id]["granularity"] || [];
      granularitys.forEach(function(granularity){
        TimeType[granularity] = true
      })
    })
    var flag = false;
    $("[name=lineChartTimeType]").each(function (index, el) {
      var value = $(el).data("value");
      if(TimeType[value]){
        $(el).show();
        !flag && (function(){flag = true;$(el).addClass("focus")})();
      }
    });
    if(TimeType['day']){
      $("[name=lineChartTimeType]").each(function (index, el) {
        $(el).removeClass("focus");
      });
      $("[name=lineChartTimeType][data-value=day]").addClass("focus");
    }
    that.timeType = $('[name=lineChartTimeType].focus').data("value");
  };
  trendAnalysis.initHistoryData = function (options) {
    var that = this;
    that.getHistoryData(options, function (data) {
      that.historyData = data;
      if (data) {
        that.updateLineChartAndTable(options);
      }
    });
  };
  trendAnalysis.getHistoryData = function (options, callback) {
    var that = this;
    var time_unit = that.timeType;
    var dimension = options.dimension;
    var measure = options.measure;
    var url,method;
    if(options.num){
      url = aquadaas_host + "/aquadaas/rest/analytics/topn/" + time_unit + "?measure=" + measure + "&dimension=" + dimension;
      url = url + "&num=" + options.num;
      url = url + "&details=" + options.details;
      method = "GET"
    }else{
      url = aquadaas_host + "/aquadaas/rest/analytics/" + time_unit + "?measure=" + measure + "&dimension=" + dimension;
      method = "POST"
    }
    url = url + "&begin_time=" + options.begin_time;
    url = url + "&end_time=" + options.end_time;
    url = url + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
    var result = null;
    var data = options.postData;
    var ajax_options = {
      type: method,
      async: true,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
      },
      contentType: "application/json",
      dataType: "json"
    };
    if(data){
      ajax_options.data = JSON.stringify(data)
    }
    $.ajax(ajax_options).done(function (data, status, xhr) {
      if (!data) {
        data = [];
      }
      callback && callback(data);
    }).fail(function (jqXHR, textStatus) {
      callback && callback([]);
    });
    return result;
  };
  trendAnalysis.initLineChart = function () {
    var that = this;
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        formatter: function (name) {
          return name;
        },
        type: 'scroll',
        orient: 'vertical',
        right: 10,
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
          color: '#8696A9'
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
    var myChart = echarts.init(document.getElementById('trendAnalysis_lineChart'));
    myChart.setOption(option);
    that.LineChart = myChart;
  };
  trendAnalysis.initTable = function () {
    var that = this;
    var widths = ["100px"];
    var table_data = that.formTableData();
    var Table = new list({
      rows: 4,
      columns: widths.length,
      containerId: 'trendAnalysis_table',
      titles: [{
        label: " "
      }],
      listType: 0,
      data: table_data,
      styles: {
        borderColor: '#F9F9F9',
        borderWidth: 1,
        titleHeight: 46,
        titleBg: '#F9F9F9',
        titleColor: '#8696a9',
        titleFontSize: '15px',
        cellBg: 'white',
        evenBg: '#F9F9F9',
        cellColor: '#707070',
        cellHeight: 40,
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
  trendAnalysis.updateLineChartAndTable = function (options) {
    var that = this;
    var Table_Titles_Widths = ["100px"];
    var Table_Titles_Content = [" "];
    var new_api_historyData = [];
    //先合并掉分组条件
    var dimensionLength;
    var dimension = options.dimension
    var dimension_Array = []
    if (dimension) {
      dimension_Array = dimension.split(",")
      dimensionLength = dimension_Array.length
    } else {
      dimensionLength = 0;
    }

    var measure = options.measure
    var measure_Array = []
    if (measure) {
      measure_Array = measure.split(",")
    }

    var dimensionData = getDimensionData(that.historyData);

    //获取xAxisArray
    var xAxisArray = [];
    var xAxisObj = {};
    that.historyData.forEach(function (item, index, array) {
      if (!xAxisObj[item["eventtime"]]) {
        xAxisArray.push(item["eventtime"]);
        xAxisObj[item["eventtime"]] = true;
      }
    });
    //获取折线的对应name和data
    var legend = [];
    options.measure_hash.forEach(function (itemA) {//指标循环
      var measure_id = itemA.id;
      var measure_name = itemA.name;
      var unit = that.options.QuotaData[measure_id]["unit"] || "";
      dimensionData.forEach(function (itemB) {//折线循环
        var key = itemB.key;
        var value = itemB.value;
        legend.push({
          name: measure_name + (dimensionLength ? (key) : ""),
          unit: unit,
          measure_id: measure_id,
          key: key,
          data: xAxisArray.map(function (itemD) {
            var arr = value.filter(function (itemC) {
              return (itemC["eventtime"] == itemD)
            })
            if (arr.length == 0) {
              return "";
            } else {
              return arr[0][measure_id]
            }
          }),
        })
      })
    });


    if(that.topN && (typeof options.num == 'undefined')){
      var getTopNoptions = JSON.parse(JSON.stringify(options));
      getTopNoptions.measure = options.measure_hash[0]["id"];
      getTopNoptions.num = that.topN;
      getTopNoptions.details = 'false';
      delete getTopNoptions.postData;
      that.getHistoryData(getTopNoptions, function(DataOfTopN){
        var dimensionData__ = getDimensionData(DataOfTopN);

        var legend_ = [];
        dimensionData__.forEach(function(x){
          var index = legend.findIndex(function(y){
            return y.key == x.key
          });
          legend_.push(legend[index]);
          legend.splice(index,1);
        });
        legend = legend_.concat(legend);
        legend = legend.slice(0, parseInt(that.topN, 10));
        draw();
      });
      return;
    }
    draw();
    //获取应该分为那几条折线
    function getDimensionData(data){
      data.forEach(function (item) {
        var replaceItem = "";
        for (var i = 0; i < dimensionLength; i++) {
          replaceItem = replaceItem + "(" + (item[dimension_Array[i]] ? item[dimension_Array[i]] : "") + ")";
        }
        item._get_dimension = replaceItem;
      });
      var dimensionData = [];
      data.forEach(function (item, index, array) {
        var result = dimensionData.filter(function(itemA){
          return itemA.key == item["_get_dimension"]
        });
        if(result.length > 0){
          result[0].value.push(item);
        }else{
          dimensionData.push({
            key:item["_get_dimension"],
            value: [item]
          });
        }
      });
      return dimensionData;
    }

    function draw(){
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
          right: 10,
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
            color: '#8696A9'
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
      LineChartOption.xAxis.data = xAxisArray.map(function (item) {
        return that.formatTimeOfxAxis(item)
      });
      var Table_Titles_Data = that.formTableData(legend);
      legend.forEach(function (itemA, indexA) {
        LineChartOption.legend.data.push(itemA.name);
        LineChartOption.series.push({
          name: itemA.name,
          type: 'line',
          stack: itemA.name + i18n("TRENDANALYSIS_ALLCOUNT"),
          data: itemA.data
        });
        var tmp = 0;
        var unit = itemA.unit ? i18n("OPERATIONAL_ANALYSIS_UNIT_CONVERSION_" + itemA.unit) : "";
        itemA.data.forEach(function (itemB, indexB) {
          var _class = "up";
          var _arrow = " ↑";
          if (itemB > tmp) {
            _class = "up";
            _arrow = " ↑";
          } else if (itemB == tmp) {
            _class = "equal";
            _arrow = " →";
          } else {
            _class = "down";
            _arrow = " ↓";
          }
          var value = itemB + unit + _arrow;
          Table_Titles_Data[indexA].push({
            label: '<div class="td ' + _class + '" title="' + itemB + '">' +
            '<input type="text" readonly value="' + value + '"/>' +
            '</div>'
          });
          tmp = itemB
        });
      });
      that.LineChartOption_series = JSON.parse(JSON.stringify(LineChartOption.series))
      switch (that.yType + ""){
        case "line":
          break;
        case "10":
          LineChartOption.yAxis = {
            type: 'log',
            logBase: 10,
            axisLabel: {
              color: '#8696A9',
              formatter:function(name){
                return Math.round(name)
              }
            },
            axisLine: {
              lineStyle: {
                color: '#D8D8D8',
                width: 2,
              }
            }
          };
          LineChartOption.series = LineChartOption.series.map(function(itemA){
            itemA.data = itemA.data.map(function(itemB){
              if(itemB>0){
                return itemB
              }else{
                return ""
              }
            });
            return itemA
          });
          break;
      }
      that.LineChartOption = LineChartOption;
      that.LineChart.setOption(LineChartOption, true);

      xAxisArray.forEach(function (item) {
        Table_Titles_Widths.push("90px");
        Table_Titles_Content.push(that.formatTimeOfxAxis(item));
      });
      var tableOption = {
        rows: Table_Titles_Data.length,
        columns: Table_Titles_Widths.length,
        containerId: 'trendAnalysis_table',
        titles: Table_Titles_Content.map(function (item, index) {
          if(index == 0){
            return {
              label: ''
            }
          }else{
            return {
              label: '<div class="td" title="' + item + '">' +
              '<input type="text" readonly value="' + item + '"/>' +
              '</div>'
            }
          }
        }),
        listType: 0,
        data: Table_Titles_Data,
        styles: {
          borderColor: '#F9F9F9',
          borderWidth: 1,
          titleHeight: 46,
          titleBg: '#F9F9F9',
          titleColor: '#8696a9',
          titleFontSize: '15px',
          cellBg: 'white',
          evenBg: '#F9F9F9',
          cellColor: '#707070',
          cellHeight: 40,
          footBg: 'white',
          theadbold: false,
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          columnsWidth: Table_Titles_Widths
        }
      };
      var Table = new list(tableOption);
      Table.create();
    }
  };
  trendAnalysis.updateLineChart = function () {
    var that = this;
    var LineChartOption = that.LineChartOption;
    LineChartOption.series = JSON.parse(JSON.stringify(that.LineChartOption_series))
    switch (that.yType + ""){
      case "line":
        LineChartOption.yAxis = {
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
        };
        break;
      case "10":
        LineChartOption.yAxis = {
          type: 'log',
          logBase: 10,
          axisLabel: {
            color: '#8696A9',
            formatter:function(name){
              return Math.round(name)
            }
          },
          axisLine: {
            lineStyle: {
              color: '#D8D8D8',
              width: 2,
            }
          }
        };
        LineChartOption.series = LineChartOption.series.map(function(itemA){
          itemA.data = itemA.data.map(function(itemB){
            if(itemB>0){
              return itemB
            }else{
              return ""
            }
          });
          return itemA
        });
        break;
    }
    that.LineChartOption = LineChartOption;
    that.LineChart.setOption(LineChartOption, true);
  };

  trendAnalysis.formTableData = function (legend) {
    var list_data = [];
    legend && legend.forEach(function (item) {
      list_data.push([{
        label: item.name
      }]);
    })
    return list_data;
  };
  trendAnalysis.formatTimeOfxAxis = function (date) {
    var that = this;
    var time = date.split(/[^0-9]/);
    var m = time[1];
    var d = time[2];
    var hour = time[3];
    var minute = time[4];
    var result = "";
    switch (that.timeType) {
      case "hour":
        result = m + "-" + d + ' ' + hour + "h";
        break;
      case "day":
        result = m + "-" + d;
        break;
      case "week":
        result = m + "-" + d;
        break;
      case "month":
        result = m;
        break;
    }
    return result;
  };
  trendAnalysis.lessTenPluwZero = function (object) {
    if (object < 10) {
      object = "0" + object;
    }
    return object;
  }

  return trendAnalysis;
})(jQuery);

trendAnalysis.init();