(function ($) {
  //tab组件
  function adv_tabs_switch_(obj) {
    var obj_ = obj;
    if (obj_) {
      this.container = obj_.container;
      this.width = obj_.width;
      this.id = obj_.id;
      this.tab_words = obj_.tab_words;
      this.callback = obj_.callback;
      this.border_radius_in_outer_container = obj.border_radius_in_outer_container ? obj.border_radius_in_outer_container : ""
    }
    this.draw_tabs_switch();
  }

  adv_tabs_switch_.prototype.draw_tabs_switch = function () {
    jQuery(this.container).css("height", "36px");
    if (this.border_radius_in_outer_container == "") {
      if (this.width == "default") {
        var half_tab_width = "112px";
        for (var a = 0; a < this.tab_words.length; a++) {
          jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>");
          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({
              "background-image": "url('image/tab_white_shadow.png')",
              "color": "#494b58",
              "border": "1px #d1d1d1 solid"
            });
            jQuery(this.container).children("div").eq(a).attr("name", "unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({
              "background-color": "#75b8d6",
              "color": "#ffffff",
              "border": "1px #4488a7 solid"
            })
            jQuery(this.container).children("div").eq(a).attr("name", "focused_div")
          }
        }
      }
      else {
        for (var a = 0; a < this.tab_words.length; a++) {
          jQuery(this.container).append("<div class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>");
          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({
              "background-image": "url('image/tab_white_shadow.png')",
              "color": "#494b58",
              "border": "1px #d1d1d1 solid"
            });
            jQuery(this.container).children("div").eq(a).attr("name", "unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({
              "background-color": "#75b8d6",
              "color": "#ffffff",
              "border": "1px #4488a7 solid"
            });
            jQuery(this.container).children("div").eq(a).attr("name", "focused_div")
          }
        }
      }
    }
    else {
      if (this.width == "default") {
        var half_tab_width = "112px";
        for (var a = 0; a < this.tab_words.length; a++) {
          if (a == 0) {
            jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"border-top-left-radius:" + this.border_radius_in_outer_container + ";border-bottom-left-radius:" + this.border_radius_in_outer_container + ";line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>")
          }
          else if (a == this.tab_words.length - 1) {
            jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"border-top-right-radius:" + this.border_radius_in_outer_container + ";border-bottom-right-radius:" + this.border_radius_in_outer_container + ";line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>")
          }
          else {
            jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>")
          }


          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({
              "background-image": "url('image/tab_white_shadow.png')",
              "color": "#494b58",
              "border": "1px #d1d1d1 solid"
            });
            jQuery(this.container).children("div").eq(a).attr("name", "unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({
              "background-color": "#75b8d6",
              "color": "#ffffff",
              "border": "1px #4488a7 solid"
            })
            jQuery(this.container).children("div").eq(a).attr("name", "focused_div")
          }
        }
      }
      else {
        for (var a = 0; a < this.tab_words.length; a++) {
          if (a == 0) {
            jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"border-top-left-radius:" + this.border_radius_in_outer_container + ";border-bottom-left-radius:" + this.border_radius_in_outer_container + ";line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>")
          }
          else if (a == this.tab_words.length - 1) {
            jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"border-top-right-radius:" + this.border_radius_in_outer_container + ";border-bottom-right-radius:" + this.border_radius_in_outer_container + ";line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>")
          }
          else {
            jQuery(this.container).append("<div id=\"switch_tab" + a + "\" class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>")
          }


          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({
              "background-image": "url('image/tab_white_shadow.png')",
              "color": "#494b58",
              "border": "1px #d1d1d1 solid"
            });
            jQuery(this.container).children("div").eq(a).attr("name", "unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({
              "background-color": "#75b8d6",
              "color": "#ffffff",
              "border": "1px #4488a7 solid"
            });
            jQuery(this.container).children("div").eq(a).attr("name", "focused_div")
          }
        }
      }
    }

    var that = this;
    this.container.find(".adv_tab_unit").each(function () {
      jQuery(this).click(function () {
        that.clickTab(this);
      });
    });


  }
  adv_tabs_switch_.prototype.clickTab = function (this_tab_unit) {
    var original_color = this_tab_unit.style.color;
    if ((original_color !== "75b8d6") || (original_color.indexOf("rgb(255, 255, 255)") == -1)) {
      jQuery(this_tab_unit).css("background-image", "");
      jQuery(this_tab_unit).css({"background-color": "#75b8d6", "color": "#ffffff", "border": "1px #4488a7 solid"});
      jQuery(this_tab_unit).attr("name", "focused_div");
      jQuery(this_tab_unit).siblings().css({
        "background-image": "url('image/tab_white_shadow.png')",
        "color": "#494b58",
        "border": "1px #d1d1d1 solid"
      });
      jQuery(this_tab_unit).siblings().attr("name", "unfocused_div");
    }
    if (this.callback) {
      this.callback.call()
    }
  }
  //表格组件
  var dmRoot = paasHost + paasDomain + '/dm';

  function downloadFile(url) {
    function isIE() { //ie?
      if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
      else
        return false;
    }

    try {
      //window.open(url,"_blank");
      //针对IE进行兼容处理
      if (isIE()) {
        window.open(url, "_blank");
      } else {
        var anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', "csv.csv");
        //$(anchor)[0].click();
        var clickEvent = document.createEvent("MouseEvent");
        clickEvent.initEvent("click", true, true);
        anchor.dispatchEvent(clickEvent);
      }

      /*
       if (!window.elemIF) {
       window.elemIF = document.createElement("iframe");
       elemIF.src = url;
       elemIF.style.display = "none";
       document.body.appendChild(elemIF);
       } else {
       elemIF.src = url;
       }
       */
    } catch (e) {
    }
  }

  var StatCount = {};
  var adpSiteNames = {};
  var adpSites = [];
  var filterSites = [];

  StatCount.list = function (obj) {
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
  StatCount.list.prototype.init = function () {
    this.totalCount = this.data && this.data.length || 0;
  }
  StatCount.list.prototype.create = function () {
    var that = this;
    if (this.data.length > this.rowsLmt) {
      this.rowsLmt = this.data.length;
    } else {
      this.rowsLmt = this.rowsLmt;
    }
    this.createList();
    this.fillContent();
    this.fillList();
    that.BodyTableDiv.mCustomScrollbar();
  };
  StatCount.list.prototype.update = function (param) {
    this.data = param;
    if (this.data.length > 6) {
      this.rowsLmt = this.data.length;
    } else {
      this.rowsLmt = 6;
    }
    this.create();
  };
  StatCount.list.prototype.createList = function () {
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
    that.TitleTable.css({width: "100%"});
    that.setTitleTable(jqTitleTable);
    var BodyTableDiv = document.createElement('div');
    jQuery(BodyTableDiv).css({
      width: "100%",
      position: "relative",
      top: -1
    });
    jQuery(BodyTableDiv).mCustomScrollbar("destroy");
    that.BodyTableDiv = jQuery(BodyTableDiv);
    jqContainer.append(BodyTableDiv);
    var JqBodyTableDiv = jQuery(BodyTableDiv);
    var BodyTable = document.createElement('table');
    JqBodyTableDiv.append(BodyTable);

    var jqBodyTable = jQuery(BodyTable);
    that.setBodyTable(jqBodyTable);
    that.BodyTable = jqBodyTable;
    that.BodyTable.css({width: "100%"});
    this.setStyles();

    //this.setStyles(jqTable);
    //this.jqTable = jqTable;
  };
  StatCount.list.prototype.setTitleTable = function (jqTable) {
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
  StatCount.list.prototype.setBodyTable = function (jqTable) {
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
  StatCount.list.prototype.fillContent = function () {
    this.content = [];
    for (var i = 0; i < this.rowsLmt; i++) {
      var dataItem = this.data[0 + i];
      if (dataItem !== undefined && dataItem !== null)
        this.content.push(dataItem);
    }
  };
  StatCount.list.prototype.fillList = function () {
    this.fillListTitle();
    this.fillListBody();
  };
  StatCount.list.prototype.setStyles = function () {
    var that = this;
    var cellspacing = this.styles && this.styles.borderWidth || 1;
    var bgColor = this.styles && this.styles.borderColor || 'black';
    var BodyTableDiv_height = this.styles && this.styles.BodyTableDiv_height || "290px"
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
    that.BodyTableDiv.css({
      height: BodyTableDiv_height
    });


    var titleBg = this.styles && this.styles.titleBg || 'white';
    var titleColor = this.styles && this.styles.titleColor || 'black';
    var cellBg = this.styles && this.styles.cellBg || 'white';
    var cellColor = this.styles && this.styles.cellColor || 'black';

    var evenBg = this.styles && this.styles.evenBg;
    var oddBg = this.styles && this.styles.oddBg;

    var titleHeight = this.styles && this.styles.titleHeight || 40;
    var cellHeight = this.styles && this.styles.cellHeight;
    var columnsWidth = this.styles && this.styles.columnsWidth;
    that.TitleTable.find('thead td').css({
      color: titleColor,
      backgroundColor: titleBg,
      textAlign: 'center',
      overflow: '',
      fontWeight: this.styles.theadbold ? 'bold' : 'normal',
      'word-break': 'keep-all',
      'white-space': 'nowrap',
      'text-overflow': 'ellipsis'
    }).height(titleHeight);
    var self = this;
    if (columnsWidth && columnsWidth.length) {
      that.TitleTable.find('thead td').each(function (index, item) {
        if (index < self.columnsLmt && columnsWidth[index]) {
          var itemWidth = Math.round(that.TitleTable.width() * columnsWidth[index]);
          jQuery(item).css({width: columnsWidth[index] * 100 + "%"});
        }
      });
      that.BodyTable.find('tbody td').each(function (index, item) {
        var td_index = index % self.columnsLmt;
        if (columnsWidth[td_index]) {
          jQuery(item).css({width: columnsWidth[td_index] * 100 + "%"});
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
  StatCount.list.prototype.fillListTitle = function () {
    var self = this;
    this.TitleTable.find('thead td').each(function (index, item) {
      var titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
      if (titleCellContent !== undefined && titleCellContent !== null)
        item.innerHTML = titleCellContent;
    });
  };
  StatCount.list.prototype.fillListBody = function () {
    var self = this;
    this.BodyTable.find('tr').each(function (index, item) {
      jQuery(item).children('td').each(function (tdIndex, tdItem) {
        var bodyCellContent = self.content && self.content[index]
          && self.content[index][tdIndex] && self.content[index][tdIndex].label;
        if (bodyCellContent !== undefined && bodyCellContent !== null)
          tdItem.innerHTML = bodyCellContent;
        else
          tdItem.innerHTML = '';
      });
    });
  };

  //paasHost = "http://172.16.20.201:8061"

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

  StatCount.init = function () {
    this.time_period = {};
    this.day_after_solved = {};
    this.type = "GuangGaoWei";
    this.chartType = "Table";
    this.statCount_site = "";
    this.systemType = 0;
    if (window.AdvSystemType) {
      if (window.AdvSystemType == 'solo') {
        this.systemType = 0;
      } else if (window.AdvSystemType == 'central') {
        this.systemType = 1;
      } else if (window.AdvSystemType == 'local') {
        this.systemType = 2;
      } else {
        this.systemType = 0;
      }
    } else {
      this.systemType = 0;
    }

    this.platform_id = my.paas.platform_id;
    this.platform_current_id = my.paas.platform_current_id;

    this.initPage();
    this.bindEvent();
    this.getSiteList();
    if (this.systemType == 1) {
      this.setSiteFilter();
    }
    this.drawChart();

  };
  StatCount.getSiteList = function () {
    $.ajax({
      async: false,
      url: dmRoot + '/site',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).done(function (data) {
      adpSites = data;
      data = $.makeArray(data);
      data.forEach(function (site) {
        adpSiteNames[site.id] = site.name;
      });
    });
  }
  StatCount.setSiteFilter = function () {
    var that = this;
    $("#stateCount_container").addClass("showSite")
    var filter = getCombiSelector({
      label: i18n('ADPOS_SITE_SELECTOR'),
      container: '#statCountSite',
      channels: adpSites.map(function (site) {
        return {
          label: site.name,
          site: site,
        };
      }),
      onChange: function (channels) {
        filterSites = channels.map(function (channel) {
          return channel.site && channel.site.id;
        });
        that.statCount_site = filterSites.join(",");
        that.drawChart();
      }
    });
    filter.create();
  }
  StatCount.initPage = function () {
    var that = this;
    var tab_switch1_container = jQuery("#toufang_baogao_topContainer_tabSwitch");
    var tab_switch1 = new adv_tabs_switch_({
      container: tab_switch1_container,
      width: ["86px", "86px", "86px"],
      tab_words: [i18n('TOUFANGBAOGAO_ANGUANGGAOWEI'), i18n('TOUFANGBAOGAO_ANSUCAI'), i18n('TOUFANGBAOGAO_ANHETONG')],
      callback: that.clickTypeTab()
    })
    var calendarStyles = {
      width: 198,
      navTitleHeight: 20,
      navTitleBgColor: '#5da1c0',
      datesViewHeight: 150,
      datesViewGridColor: '#e2e2e2',
      datesViewCellColor: '#ffffff',
      weekdaysHeight: 20,
      weekdaysColor: '#000000',
      currMonthColor: '#737373',
      nonCurrMonthColor: '#e2e2e2'
    };
    this.adv_datePicker_startDate = new DatePicker({
      containerId: 'adv_toufang_baogao_top_start_time',
      calendarStyles: calendarStyles,
      dateInputStyles: {
        borderColor: '#e2e2e2'
      },
      iconImage: 'image/adv_calendar_icon.png'
    });
    this.adv_datePicker_endDate = new DatePicker({
      containerId: 'adv_toufang_baogao_top_end_time',
      calendarStyles: calendarStyles,
      dateInputStyles: {
        borderColor: '#eaeaea'
      },
      iconImage: 'image/adv_calendar_icon.png'
    });
    this.adv_datePicker_startDate.onChange = function () {
      var datestr = this.getDateStr();
      jQuery("form[method=POST] input[name=start_date]").val(datestr);
      that.time_period.begin_time = jQuery("#adv_toufang_baogao_top_start_time-datepicker-input").val() + "T00:00:00+0800";
      that.time_period.end_time = jQuery("#adv_toufang_baogao_top_end_time-datepicker-input").val() + "T23:59:59+0800";
      that.drawChart();
    };
    this.adv_datePicker_endDate.onChange = function () {
      var datestr = this.getDateStr();
      jQuery("form[method=POST] input[name=end_date]").val(datestr);
      that.time_period.begin_time = jQuery("#adv_toufang_baogao_top_start_time-datepicker-input").val() + "T00:00:00+0800";
      that.time_period.end_time = jQuery("#adv_toufang_baogao_top_end_time-datepicker-input").val() + "T23:59:59+0800";
      that.drawChart();
    };
    var tab_switch2_container = jQuery("#adv_toufang_time_tabswitch");
    var tab_switch2 = new adv_tabs_switch_({
      container: tab_switch2_container,
      width: ["76px", "74px", "74px", "74px", "74px"],
      tab_words: [i18n('TOUFANGBAOGAO_JINTIAN'), i18n('TOUFANGBAOGAO_ZUOTIAN'), i18n('TOUFANGBAOGAO_BENZHOU'), i18n('TOUFANGBAOGAO_ZUIJINSANSHITIAN'), i18n('TOUFANGBAOGAO_BENYUE')],
      border_radius_in_outer_container: "17px",
      callback: that.clickTimeTab()
    })
    that.arrange_time();
    that.fill_date_to_input();
  };
  StatCount.bindEvent = function () {
    var self = this;
    jQuery("#adv_toufang_preDay").unbind("click").bind('click', {this_day_after_solved: this.day_after_solved}, function (events) {
      self.pre_day(events.this_day_after_solved)
    });
    jQuery("#adv_toufang_nextDay").unbind("click").bind('click', {this_day_after_solved: this.day_after_solved}, function (events) {
      self.next_day(events.this_day_after_solved)
    });
    jQuery(".StatCountContent_Header_Button").click(function (el) {
      var focusItem = jQuery(this).attr("name");
      jQuery(".StatCountContent_Header_Button").removeClass("focus");
      jQuery(this).addClass("focus");
      var str;
      var type;
      if (self.type == "GuangGaoWei") {
        type = i18n("STATCOUNT_GUANGGAOWEI");
      } else if (self.type == "SuCai") {
        type = i18n("STATCOUNT_SUCAI");
      } else {
        type = i18n("STATCOUNT_HETONG");
      }
      switch (focusItem) {
        case "Bar":
          self.chartType = "Bar";
          str = type + i18n("STATCOUNT_BAOGUANGCISHUHUIZONG");
          break;
        case "PieChart":
          self.chartType = "PieChart";
          str = type + i18n("STATCOUNT_BAOGUANGLVTONGJI");
          break;
        case "Table":
          self.chartType = "Table";
          str = i18n("STATCOUNT_CHAXUJIEGUOSHUJULIEBIAO");
          break;
      }
      jQuery(".StatCountContent_Header_Title").text(str);
      self.drawChart();
    });
    jQuery("#adv_toufang_addPosition").click(function () {
      if (self.type == "HeTong") {
        var dialog = new AlertDialog({
          title: i18n('SUCAITEMPLATE_TISHI'),
          message: i18n("STATCOUNT_ALERTMSG1"),
          confirmFn: (callback) => {
            callback && callback()
          }
        })
      } else {
        self.exportReport();
      }
    })
  };
  StatCount.clickTypeTab = function () {
    var that = this;
    return function () {
      var type;
      if (jQuery("#toufang_baogao_topContainer_tabSwitch").find(".adv_tab_unit").eq(0).attr("name") == "focused_div") {
        that.type = "GuangGaoWei";
        type = i18n("STATCOUNT_GUANGGAOWEI");
      } else if (jQuery("#toufang_baogao_topContainer_tabSwitch").find(".adv_tab_unit").eq(1).attr("name") == "focused_div") {
        that.type = "SuCai";
        type = i18n("STATCOUNT_SUCAI");
      } else {
        that.type = "HeTong";
        type = i18n("STATCOUNT_HETONG");
      }

      var str = "";
      switch (that.chartType) {
        case "Bar":
          str = type + i18n("STATCOUNT_BAOGUANGCISHUHUIZONG");
          break;
        case "PieChart":
          str = type + i18n("STATCOUNT_BAOGUANGLVTONGJI");
          break;
        case "Table":
          str = i18n("STATCOUNT_CHAXUJIEGUOSHUJULIEBIAO");
          break;
      }
      jQuery(".StatCountContent_Header_Title").text(str);
      that.drawChart();
    }
  };
  StatCount.clickTimeTab = function () {
    var that = this;
    return function () {
      if (jQuery("#adv_toufang_baogao_top_start_time-datepicker-input")) {
        jQuery("#adv_toufang_baogao_top_start_time-datepicker-input").val("")
      }
      if (jQuery("#adv_toufang_baogao_top_end_time-datepicker-input")) {
        jQuery("#adv_toufang_baogao_top_end_time-datepicker-input").val("")
      }
      that.arrange_time();
      that.fill_date_to_input();
      that.drawChart();
    }
  };
  StatCount.drawChart = function (status) {
    var that = this;

    that.getData(function (data) {
      switch (that.chartType) {
        case "Bar":
          var BarChartData = that.getBarChartData(data);
          that.drawBarChart(BarChartData);
          break;
        case "PieChart":
          var PieChartData = that.getPieChartData(data);
          that.drawPieChart(PieChartData);
          break;
        case "Table":
          var TableChartData = that.getTableChartData(data);
          that.drawTableChart(TableChartData);
          break;
      }
    });
  };
  StatCount.getBarChartData = function (data) {
    var that = this;
    var countArray = [];
    var nameArray = [];
    data[0].values.forEach(function (item) {
      countArray.push(item.count);
      if (that.type == "HeTong") {
        nameArray.push(item.value || "");
      } else {
        nameArray.push(item.name || "");
      }
    });
    return {
      value: countArray,
      name: nameArray
    }
  };
  StatCount.drawBarChart = function (BarChartData) {
    var that = this;
    jQuery(".StatCountContent_Content").html("");
    var container = jQuery(".StatCountContent_Content");

    var chartHead = jQuery("<div class='chart_head'></div>");
    container.append(chartHead);

    var chartHeadLeft = jQuery("<div class='chart_head_left'></div>");
    chartHead.append(chartHeadLeft);
    var chartHeadRight = jQuery("<div class='chart_head_right'></div>");
    chartHead.append(chartHeadRight);
    var chartHeadIcon = jQuery("<div class='chart_head_right_icon'></div>");
    chartHeadRight.append(chartHeadIcon);
    var chartHeadtext = jQuery("<div class='chart_head_right_text'></div>");
    chartHeadRight.append(chartHeadtext);
    chartHeadtext.text(i18n("STATCOUNT_ALL"));


    var axes = jQuery('<div>').attr('id', 'stats-fig-bars-axes').appendTo(container);
    var axParam = getAxesParam(BarChartData);
    axParam.container = axes;
    axParam.width = axes.width();
    var chartAx = new ChartAxes(axParam);
    chartAx.getAxes();
    drawTrendBarBlocks(container, BarChartData, chartAx);

    var chartFoot = jQuery("<div class='chart_foot'></div>");
    chartFoot.css({top: axParam.steps * axParam.stepSize + 51 + "px"});
    container.append(chartFoot);
    if (that.type == "GuangGaoWei") {
      chartFoot.text(i18n("STATS_FIGLIST_ADPOS_LABL"));
    } else if (that.type == "SuCai") {
      chartFoot.text(i18n("STATS_FIGLIST_ADITEM_LABL"));
    } else {
      chartFoot.text(i18n("STATS_FIGLIST_CONTRACT_LABL"));
    }
    function getAxesParam(data) {
      var max = 0;
      for (var i = 0, len = data.value.length; i < len; i += 1) {
        var dtitem = data.value[i];
        var tmp = Number(dtitem);
        if (tmp > max) {
          max = tmp;
        }
      }
      var stepNum = 8;
      var stepSize = 45;
      var step = Math.floor(max / stepNum);
      step = Math.max(1, step);
      if (step > 10) {
        var step_tmp1;
        var step_tmp2;
        if (getNumberDigit(step) > 2) {
          step_tmp1 = parseInt(step / ((getNumberDigit(step) - 2) * 10));
          step_tmp2 = parseInt(step_tmp1 % 10);
          if (step_tmp2 > 5) {
            step = ((step_tmp1 - step_tmp2) + 10) * ((getNumberDigit(step) - 2) * 10);
          } else if (step_tmp2 == 0) {
            step = step_tmp1 * ((getNumberDigit(step) - 2) * 10);
          } else {
            step = (step_tmp1 - step_tmp2) * ((getNumberDigit(step) - 2) * 10);
          }
        } else {
          step_tmp1 = step;
          step_tmp2 = parseInt(step_tmp1 % 10);
          if (step_tmp2 > 5) {
            step = ((step_tmp1 - step_tmp2) + 10);
          } else if (step_tmp2 == 0) {
            step = step_tmp1;
          } else {
            step = step_tmp1 - step_tmp2;
          }
        }
      }
      while (stepNum * step < max) {
        stepNum += 1;
      }
      while (stepNum * stepSize > 450) {
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
      function getNumberDigit(num) {
        return (num.toString().length);
      }
    }

    function drawTrendBarBlocks($parent, data, axes) {
      jQuery('#stats-fig-bar-blocks').remove();
      jQuery('#stats-fig-bar-colinds').remove();
      var frag = document.createDocumentFragment();
      var $blocks = jQuery('<div>').attr('id', 'stats-fig-bar-blocks').appendTo(frag);
      var $indis = jQuery('<div>').attr('id', 'stats-fig-bar-colinds').appendTo(frag);
      for (var i = 0, len = data.value.length; i < len; i += 1) {
        var itemBlock = jQuery('<div>').addClass('stats-fig-dati-block')
          .hover(function () {
            jQuery(this).find('.stats-fig-block-name').show();
          }, function () {
            jQuery(this).find('.stats-fig-block-name').hide();
          })
          .appendTo($blocks);
        var barColor = "rgb(94, 160, 192)";
        var value = data.value[i];
        var name = data.name[i];
        var barHeight = Math.round(Number(value) / axes.pointWeight);
        jQuery('<div>').addClass('stats-fig-bar').css('background-color', barColor)
          .height(barHeight)
          .css('top', axes.origin.y - barHeight)
          .append(
            jQuery('<div>').addClass('stats-fig-bar-tip').append(value)
          ).appendTo(itemBlock);
        jQuery('<div>').addClass('stats-fig-block-name')
          .css('top', axes.origin.y + 10)
          .append(name).appendTo(itemBlock);
      }
      $parent.append(frag);
      var $bars = jQuery('.stats-fig-bar');
      var barNum = $bars.length;
      var contWidth = jQuery('#stats-fig-bar-blocks').width();
      var propMargin = Math.floor((contWidth / barNum - 27) / 2);
      if (propMargin > 25) {
        $bars.css({
          'margin-left': propMargin,
          'margin-right': propMargin
        });
      }
    }
  };
  StatCount.getTableChartData = function (data) {
    var that = this;
    data = JSON.parse(JSON.stringify(data))
    data[0].values = data[0].values.sort(function (a, b) {
      return b.percent.count - a.percent.count
    });

    var allCount = 0;
    var allCount1 = 0;
    var all_deductions_div_count = 0;
    var all_deductions_div_charge_type = 0;

    var list_data = [];
    var dataArray = data[0].values;
    for (var i = 0; i < dataArray.length; i++) {
      var item = dataArray[i];
      var record = (function (item) {
        var name,count,click,clickAvg,percent;
        if (that.type == "HeTong") {
          name = item.value || "";
        } else {
          name = item.name || "";
        }
        allCount = allCount + parseInt(item.count);
        count = item.count;
        click = item.sum.charge_type;
        allCount1 = allCount1 + parseInt(item.sum.charge_type);
        clickAvg = item.avg.charge_type;
        percent = item.percent.count ? item.percent.count + "%" : "";
        var deductions_div_count = item.deductions_div_count;
        all_deductions_div_count = all_deductions_div_count + parseFloat(item.sum.deductions);
        var deductions_div_charge_type = item.deductions_div_charge_type;
        var arr = [
          {label: getSpanInTd(name)},
          {label: getSpanInTd(add_comma_toThousands(count))},
          {label: getSpanInTd(add_comma_toThousands(click))},
          {label: getSpanInTd(getTwoDecimals(clickAvg))},
          {label: getSpanInTd(percent)},
          {label: getSpanInTd(addMoneySign_Thousands(deductions_div_count))},
          {label: getSpanInTd(addMoneySign(deductions_div_charge_type))},
        ];
        return arr;

        function getSpanInTd(text){
          var result = "<span class='spanInTd' title='" + text + "'>" + text + "</span>"
          return result;
        }
      })(item);
      list_data.push(record);
    }
    return {
      list_data: list_data,
      allCount: allCount,
      allCount1: allCount1,
      allCount2: handleNaNInfinity(allCount1 * 1.0 / allCount ),
      all_deductions_div_count: handleNaNInfinity(all_deductions_div_count * 1.0 / allCount ),
      all_deductions_div_charge_type: handleNaNInfinity(all_deductions_div_count * 1.0 / allCount1 ),
      //allCount3: allCount3,
      //allCount4: allCount4,
      //allCount5: (isNaN(allCount4) || isNaN(allCount3)) ? "" : (allCount4 * 1.0 / allCount3 || 0),
    };
  };
  StatCount.drawTableChart = function (TableChartData) {
    var that = this;
    jQuery(".StatCountContent_Content").html("");
    var container = jQuery(".StatCountContent_Content");

    var table_data = TableChartData.list_data || [];
    var label1 = "";
    if (that.type == "GuangGaoWei") {
      label1 = i18n("STATCOUNT_GUANGGAOWEI");
    } else if (that.type == "SuCai") {
      label1 = i18n("STATCOUNT_SUCAI");
    } else {
      label1 = i18n("STATCOUNT_HETONGID");
    }
    var titles = [{
      width: 0.206,
      label: label1
    }, {
      width: 0.127,
      label: i18n("STATCOUNT_BAOGUANGCISHU")
    }, {
      width: 0.127,
      label: i18n("STATCOUNT_DIANJICISHU")
    }, {
      width: 0.138,
      label: i18n("STATCOUNT_DIANJILV")
    }, {
      width: 0.127,
      label: i18n("STATCOUNT_BAOGUANGZHANBI")
    }, {
      width: 0.138,
      label: i18n("STATCOUNT_QIANCIBAOGUANG") + '￥'
    }, {
      width: 0.138,
      label: i18n("STATCOUNT_DANCIDIANJI") + '￥'
    }];
    var cameraTable = new that.list({
      rows: 9,
      columns: titles.length,
      containerId: 'StatCountContent_Content',
      titles: titles.map(function(item){return {label: item.label}}),
      listType: 0,
      data: table_data,
      styles: {
        borderColor: 'rgb(225, 225, 225)',
        borderWidth: 1,
        titleHeight: 46,
        titleBg: 'rgb(94, 160, 192)',
        titleColor: 'white',
        cellBg: 'white',
        evenBg: 'rgb(245,245,245)',
        cellColor: 'rgb(114,114,114)',
        cellHeight: 46,
        footBg: 'white',
        theadbold: false,
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: titles.map(function(item){return item.width}),
        BodyTableDiv_height: "calc(100% - 160px)"
      }
    });
    cameraTable.create();

    var chartFoot = jQuery("<div class='chart_head'></div>");
    container.append(chartFoot);
    var style = "color: white; background-color: rgb(94, 160, 192); text-align: center; font-weight: normal; word-break: keep-all; white-space: nowrap; text-overflow: ellipsis; height: 46px; ";
    var str = '<table cellspacing="1" style="width: 100%; background-color: rgb(225, 225, 225); table-layout: fixed;">' +
      '<thead>' +
      '<tr>' +
      (titles.map(function(item, index){
        var id = "";
        var value = "";
        var width = item.width;
        switch (index){
          case 0:
            value = i18n("STATCOUNT_SUM");
            break;
          case 1:
            id = 'allStatCount';
            break;
          case 2:
            id = 'allStatCount1';
            break;
          case 3:
            id = 'allStatCount2';
            break;
          case 4:
            value = '100%';
            break;
          case 5:
            id = 'allStatCount3';
            break;
          case 6:
            id = 'allStatCount4';
            break;
          default:
            break;
        }
        var html = '<td ' + (id ? ( 'id="' + id + '"'):'') + ' style="' + style + 'width: ' + width * 100 + '%;">' + value + '</td>';
        return html;
      }).join('')) +
      '</tr>' +
      '</thead>' +
      '</table>';
    var jqFootTable = jQuery(str);
    chartFoot.append(jqFootTable);
    jQuery("#allStatCount").text(add_comma_toThousands(TableChartData.allCount));
    jQuery("#allStatCount1").text(add_comma_toThousands(TableChartData.allCount1));
    jQuery("#allStatCount2").text(getTwoDecimals(TableChartData.allCount2));
    jQuery("#allStatCount3").text(addMoneySign_Thousands(TableChartData.all_deductions_div_count));
    jQuery("#allStatCount4").text(addMoneySign(TableChartData.all_deductions_div_charge_type));
    //jQuery("#allStatCount3").text((TableChartData.allCount3 == TableChartData.allCount3) ? add_comma_toThousands(TableChartData.allCount3): "");
    //jQuery("#allStatCount4").text((TableChartData.allCount4 == TableChartData.allCount4) ? add_comma_toThousands(TableChartData.allCount4): "");
    //jQuery("#allStatCount5").text((TableChartData.allCount5 == TableChartData.allCount5) ? getTwoDecimals(TableChartData.allCount5 )  : "");
  };
  StatCount.getPieChartData = function (data) {
    var that = this;
    var countArray = [];
    var nameArray = [];
    var percentArray = [];
    var allCount = 0;
    data[0].values.forEach(function (item) {
      allCount = allCount + parseInt(item.count);
      countArray.push(item.count);
      if (that.type == "HeTong") {
        nameArray.push(item.value || "");
      } else {
        nameArray.push(item.name || "");
      }
      percentArray.push((item.percent && item.percent.count) ? item.percent.count + "%" : "");
    });
    var colorArray = that.getColorArray(countArray.length);
    var list_data = [];
    for (var i = 0; i < nameArray.length; i++) {
      var record = (function (i) {
        var arr1 = "<div style='display: flex'><div style='margin-left:8px;margin-top:8px;width:24px;height:24px;border-radius: 3px;background: " + colorArray[i] + "'></div><div title='" + nameArray[i] + "' style='width: calc(100% - 30pc);line-height: 41px;text-align: left;padding-left: 5px;'>" + nameArray[i] + "</div></div>";
        var arr2 = countArray[i];
        var arr3 = percentArray[i];
        var arr = [{label: arr1}, {label: arr2}, {label: arr3}];
        return arr;
      })(i);
      list_data.push(record);
    }
    return {
      value: countArray,
      name: nameArray,
      color: colorArray,
      percent: percentArray,
      list_data: list_data,
      allCount: allCount,
    };
  };
  StatCount.drawPieChart = function (PieChartData) {
    var that = this;
    jQuery(".StatCountContent_Content").html("");
    var container = jQuery(".StatCountContent_Content");
    var pieChartContainer = jQuery("<div class='pieChartContainer'></div>");
    container.append(pieChartContainer);
    var pieChartContainer_Left = jQuery("<div class='pieChartContainer_Left'></div>");
    var pieChartContainer_Right = jQuery("<div class='pieChartContainer_Right' ></div>");
    pieChartContainer.append(pieChartContainer_Right);
    pieChartContainer.append(pieChartContainer_Left);
    var chartHead = jQuery("<div class='pieChartContainer_Right_head'></div>");
    pieChartContainer_Right.append(chartHead);
    var chartContent = jQuery("<div class='pieChartContainer_Right_content' id='chartContent'></div>");
    pieChartContainer_Right.append(chartContent);

    var chartAreaWrapper = jQuery("<div class='chartAreaWrapper' style='width:500px;height:500px;margin-left:20px;'></div>");
    pieChartContainer_Left.append(chartAreaWrapper);
    var myChart = jQuery('<canvas id="myChart" width="400" height="400" ></canvas>');
    chartAreaWrapper.append(myChart);
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: PieChartData.name,
        datasets: [
          {
            data: PieChartData.value,
            backgroundColor: PieChartData.color
          }
        ]
      },
      options: {
        legend: {display: false},
        animation: false,
        layout: {
          padding: {
            left: 40,
            right: 40,
            top: 40,
            bottom: 40
          }
        },
        pieceLabel: {
          mode: 'percentage',
          precision: 2,
          fontSize: 12,
          fontColor: 'rgb(153, 153, 153)',
          position: 'outside'
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var allData = data.datasets[tooltipItem.datasetIndex].data;
              var tooltipLabel = data.labels[tooltipItem.index];
              var tooltipData = allData[tooltipItem.index];
              var total = 0;
              for (var i in allData) {
                total += allData[i];
              }
              var tooltipPercentage = PieChartData.percent[tooltipItem.index];
              return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
            }
          }
        }
      }
    });

    var widths = [0.46, 0.36, 0.18];
    var table_data = PieChartData.list_data || [];
    var label1 = "";
    if (that.type == "GuangGaoWei") {
      label1 = i18n("STATCOUNT_GUANGGAOWEI");
    } else if (that.type == "SuCai") {
      label1 = i18n("STATCOUNT_SUCAI");
    } else {
      label1 = i18n("STATCOUNT_HETONGID");
    }
    var cameraTable = new that.list({
      rows: 9,
      columns: 3,
      containerId: 'chartContent',
      titles: [{
        label: label1
      }, {
        label: i18n("STATCOUNT_SUMBAOGUANGCISHU")
      }, {
        label: i18n("STATCOUNT_FANGWENCISHUZHANBI")
      }],
      listType: 0,
      data: table_data,
      styles: {
        borderColor: '#E0E0E0',
        borderWidth: 1,
        titleHeight: 44,
        titleBg: '#F6F6F6',
        titleColor: 'rgb(153, 153, 153)',
        cellBg: '#FDFDFD',
        evenBg: '#F6F6F6',
        cellColor: 'rgb(153, 153, 153)',
        cellHeight: 41,
        footBg: 'white',
        theadbold: false,
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: widths,
        BodyTableDiv_height: "379px"
      }
    });
    cameraTable.create();

    var str = '<div style="background:#5DA1C0;width:100%;height:43px;width:calc(100% - 2px);border:1px solid #5DA1C0;border-bottom-width:0px;color:white;line-height: 43px;text-align: center;font-size: 20px;font-weight: bolder">' + i18n("STATCOUNT_DATA") + '</div>';
    var jqTable = jQuery(str);
    chartHead.append(jqTable);
    jQuery("#allStatCount").text(PieChartData.allCount);
  };
  StatCount.getColorArray = function (length) {
    var arr = [
      "rgb(229,115,115)",
      "#9675CE",
      "#039BE6",
      "#4DB7AE",
      "#81C683",
      "#F9B552",
      "#FAD53E",
      "#FFE0B2"
    ];
    var result = [];
    if (length < arr.length) {
      result = arr.slice(0, length);
    } else {
      result = arr.slice(0, arr.length);
      var add_length = length - arr.length;
      for (var i = 0; i < add_length; i++) {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        result.push("rgb(" + r + ',' + g + ',' + b + ")");
      }
    }
    return result;
  };
  StatCount.pre_day = function (this_day_after_solved) {
    var beginDay = {};
    var endDay = {};
    if (this.day_after_solved.begin_time_UTC) {
      var currentday_UTC = this.day_after_solved.begin_time_UTC;
      beginDay = (currentday_UTC.getDate() - 1);
    }
    if (this.day_after_solved.end_time_UTC) {
      var currentday_UTC = this.day_after_solved.end_time_UTC;
      endDay = (currentday_UTC.getDate() - 1);
    }
    var month__ = this.day_after_solved.end_time_UTC.getMonth();
    var year_ = this.day_after_solved.end_time_UTC.getFullYear();
    var formateDate_begin = this.format_date(new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay));
    var formateDate_end = this.format_date(new Date(year_, month__, endDay));
    this.time_period = {
      "begin_time": "" + formateDate_begin + "T00:00:00+0800",
      "end_time": "" + formateDate_end + "T23:59:59+0800"
    };
    this.day_after_solved = {
      "begin_time_UTC": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay),
      "end_time_UTC": new Date(year_, month__, endDay),
      "year": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay).getFullYear(),
      "month": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay).getMonth() + 1,
      "day": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay).getDate()
    };
    this.fill_date_to_input();
    this.drawChart();
  }
  StatCount.next_day = function (this_day_after_solved) {
    var beginDay = {};
    var endDay = {};
    if (this.day_after_solved.begin_time_UTC) {
      var currentday_UTC = this.day_after_solved.begin_time_UTC;
      beginDay = (currentday_UTC.getDate() + 1);
    }
    if (this.day_after_solved.end_time_UTC) {
      var currentday_UTC = this.day_after_solved.end_time_UTC;
      endDay = (currentday_UTC.getDate() + 1);
    }
    var month__ = this.day_after_solved.end_time_UTC.getMonth();
    var year_ = this.day_after_solved.end_time_UTC.getFullYear();
    var formateDate_begin = this.format_date(new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay));
    var formateDate_end = this.format_date(new Date(year_, month__, endDay));
    this.time_period = {
      "begin_time": "" + formateDate_begin + "T00:00:00+0800",
      "end_time": "" + formateDate_end + "T23:59:59+0800"
    };
    this.day_after_solved = {
      "begin_time_UTC": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay),
      "end_time_UTC": new Date(year_, month__, endDay),
      "year": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay).getFullYear(),
      "month": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay).getMonth() + 1,
      "day": new Date(this.day_after_solved.year, this.day_after_solved.month - 1, beginDay).getDate()
    };
    this.fill_date_to_input();
    this.drawChart();
  }
  StatCount.arrange_time = function () {
    var that = this;
    var time_unit = jQuery("#adv_toufang_time_tabswitch").find(".adv_tab_unit");
    var formateDate = "";
    var today_ = new Date();
    if (jQuery(time_unit[0]).attr("name") == "focused_div") {
      this.day_after_solved = {
        "begin_time_UTC": today_,
        "end_time_UTC": today_,
        "year": today_.getFullYear(),
        "month": today_.getMonth() + 1,
        "day": today_.getDate()
      };
      formateDate = that.format_date(today_);
      this.time_period = {
        "begin_time": "" + formateDate + "T00:00:00+0800",
        "end_time": "" + formateDate + "T23:59:59+0800"
      };
    }
    else if (jQuery(time_unit[1]).attr("name") == "focused_div") {
      today_.setDate(today_.getDate() - 1);
      this.day_after_solved = {
        "begin_time_UTC": today_,
        "end_time_UTC": today_,
        "year": today_.getFullYear(),
        "month": today_.getMonth() + 1,
        "day": today_.getDate()
      };
      formateDate = StatCount.format_date(today_);
      this.time_period = {
        "begin_time": "" + formateDate + "T00:00:00+0800",
        "end_time": "" + formateDate + "T23:59:59+0800"
      };
    } else if (jQuery(time_unit[2]).attr("name") == "focused_div") {
      var dateYear = today_.getFullYear();
      var dateMonth = today_.getMonth();
      var weekday_1 = today_.getDate() - today_.getDay() + 0 + 1;
      var weekday_7 = today_.getDate() - today_.getDay() + 0 + 7;
      this.day_after_solved = {
        "begin_time_UTC": new Date(dateYear, dateMonth, weekday_1),
        "end_time_UTC": new Date(dateYear, dateMonth, weekday_7),
        "year": new Date(dateYear, dateMonth, weekday_1).getFullYear(),
        "month": new Date(dateYear, dateMonth, weekday_1).getMonth() + 1,
        "day": new Date(dateYear, dateMonth, weekday_1).getDate()
      };

      var month__ = this.day_after_solved.end_time_UTC.getMonth();
      var year_ = this.day_after_solved.end_time_UTC.getFullYear();
      var weekday_1_format = this.format_date(new Date(dateYear, dateMonth, weekday_1));
      var weekday_7_format = this.format_date(new Date(year_, month__, weekday_7));
      this.time_period = {
        "begin_time": "" + weekday_1_format + "T00:00:00+0800",
        "end_time": "" + weekday_7_format + "T23:59:59+0800"
      };
    } else if (jQuery(time_unit[3]).attr("name") == "focused_div") {
      today_.setDate(today_.getDate() - 30);
      var today_current_ = new Date();
      var formateDateB = StatCount.format_date(today_current_);
      formateDate = StatCount.format_date(today_);
      this.day_after_solved = {
        "begin_time_UTC": today_,
        "end_time_UTC": today_current_,
        "year": today_.getFullYear(),
        "month": today_.getMonth() + 1,
        "day": today_.getDate()
      };
      this.time_period = {
        "begin_time": "" + formateDate + "T00:00:00+0800",
        "end_time": "" + formateDateB + "T23:59:59+0800"
      };
    } else if (jQuery(time_unit[4]).attr("name") == "focused_div") {
      var year = today_.getFullYear();
      var month = today_.getMonth() + 1;
      var this_month_first_day = this.lessTenPluwZero(year) + "-" + this.lessTenPluwZero(month) + "-" + '01';//当月的第一天。
      var this_month_last_day = new Date(year, month, 0);//当月的最后一天。
      var this_month_first_day_UTC = new Date(year, month - 1, 1);//当月的最后一天。
      var lastDate = this.format_date(this_month_last_day);
      this.day_after_solved = {
        "begin_time_UTC": this_month_first_day_UTC,
        "end_time_UTC": this_month_last_day,
        "year": this_month_first_day_UTC.getFullYear(),
        "month": this_month_first_day_UTC.getMonth() + 1,
        "day": this_month_first_day_UTC.getDate()
      };
      this.time_period = {
        "begin_time": "" + this_month_first_day + "T00:00:00+0800",
        "end_time": "" + lastDate + "T23:59:59+0800"
      };
    } else {
      return
    }
  }
  StatCount.fill_date_to_input = function () {
    if (this.time_period.begin_time) {
      var this_time = this.time_period.begin_time;
      var position_ = this_time.indexOf("T");
      jQuery("#adv_toufang_baogao_top_start_time-datepicker-input").val(this_time.substring(0, position_))
    }
    if (this.time_period.end_time) {
      var this_time = this.time_period.end_time;
      var position_ = this_time.indexOf("T");
      jQuery("#adv_toufang_baogao_top_end_time-datepicker-input").val(this_time.substring(0, position_))
    }
  };
  StatCount.lessTenPluwZero = function (object) {
    if (object < 10) {
      object = "0" + object;
    }
    return object;
  }
  StatCount.format_date = function (date_) {
    var y = this.lessTenPluwZero(date_.getFullYear());
    var m = this.lessTenPluwZero(date_.getMonth() + 1);//获取当前月份的日期
    var d = this.lessTenPluwZero(date_.getDate());
    return y + "-" + m + "-" + d;
  }
  StatCount.isBegionEndAllToday = function (begin_time, end_time) {
    var now = new Date();
    return isToday(begin_time) && isToday(end_time)
    function isToday(time) {
      var array = time.split('T');
      var time = new Date(array[0]);
      return (time.getFullYear() == now.getFullYear()) && (time.getMonth() == now.getMonth()) && (time.getDate() == now.getDate())
    }
  };
  StatCount.getData = function (callback) {
    var self = this;
    var url = paasHost + paasDomain + '/multiapp/statistics/ad';
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    url += '&begin_time=' + encodeURIComponent(this.time_period.begin_time);
    url += '&end_time=' + encodeURIComponent(this.time_period.end_time);
    if (this.type == "GuangGaoWei") {
      url += '&properties=' + "adp_id";
    } else if (this.type == "SuCai") {
      url += '&properties=' + "ad_id";
    } else {
      url += '&properties=' + 'contract_id';
    }
    url += '&interval=day';
    url += '&percent=true';
    url += '&avg=true';
    url += '&sum_fields=count,duration,charge_type,deductions';
    if (self.statCount_site) {
      url = url + "&siteid=" + encodeURIComponent(self.statCount_site);
    }
    url += '&platform_id=' + this.platform_current_id;
    jQuery.ajax({
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      }
    }).done(function (data) {
      if (typeof callback == 'function') {
        /*
         var data = [{
         "values": [{
         "avg": {
         "duration": "10.00",
         "persons": "6.50",
         "charge_type": "1.00",
         "click_persons": "3.00"
         },
         "count": "223434123123",
         "name": "图片广告位assid",
         "sum": {"duration": "20", "persons": "1233", "charge_type": "12341", "click_persons": "54364"},
         "value": "TP_00001",
         "percent": {
         "duration": "40.00",
         "persons": "162.50",
         "charge_type": "25.00",
         "count": "25.00",
         "click_persons": "120.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "11.50", "charge_type": "1.00", "click_persons": "5.00"},
         "count": "2",
         "name": "图片广告位assid",
         "sum": {"duration": "20", "persons": "23", "charge_type": "2", "click_persons": "10"},
         "value": "TP_00002",
         "percent": {
         "duration": "40.00",
         "persons": "287.50",
         "charge_type": "25.00",
         "count": "25.00",
         "click_persons": "200.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "0.67", "click_persons": "0.67"},
         "count": "3",
         "name": "图片广告位assid",
         "sum": {"duration": "30", "persons": "3", "charge_type": "2", "click_persons": "2"},
         "value": "TP_00003",
         "percent": {
         "duration": "60.00",
         "persons": "37.50",
         "charge_type": "25.00",
         "count": "37.50",
         "click_persons": "40.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "1.00", "click_persons": "1.00"},
         "count": "1",
         "name": "图片广告位assid",
         "sum": {"duration": "10", "persons": "1", "charge_type": "1", "click_persons": "1"},
         "value": "TP_005",
         "percent": {
         "duration": "20.00",
         "persons": "12.50",
         "charge_type": "12.50",
         "count": "12.50",
         "click_persons": "20.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "4.00", "charge_type": "1.00", "click_persons": "2.50"},
         "count": "2",
         "name": "图片广告位assid",
         "sum": {"duration": "20", "persons": "8", "charge_type": "2", "click_persons": "5"},
         "value": "TP_23233",
         "percent": {
         "duration": "40.00",
         "persons": "100.00",
         "charge_type": "25.00",
         "count": "25.00",
         "click_persons": "100.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "3450.00", "persons": "1.92", "charge_type": "1.00", "click_persons": "0.83"},
         "count": "12",
         "name": "图片广告位006",
         "sum": {"duration": "41400", "persons": "23", "charge_type": "12", "click_persons": "10"},
         "value": "TP_58068",
         "percent": {
         "duration": "82800.00",
         "persons": "287.50",
         "charge_type": "150.00",
         "count": "150.00",
         "click_persons": "200.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "0.25", "charge_type": "1.00", "click_persons": "0.25"},
         "count": "8",
         "name": "图片广告位asssssid",
         "sum": {"duration": "80", "persons": "2", "charge_type": "8", "click_persons": "2"},
         "value": "TP_58585",
         "percent": {
         "duration": "160.00",
         "persons": "25.00",
         "charge_type": "100.00",
         "count": "100.00",
         "click_persons": "40.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "1.00", "click_persons": "1.00"},
         "count": "1",
         "name": "图片广告位assid",
         "sum": {"duration": "10", "persons": "1", "charge_type": "1", "click_persons": "1"},
         "value": "TP_aabbcc",
         "percent": {
         "duration": "20.00",
         "persons": "12.50",
         "charge_type": "12.50",
         "count": "12.50",
         "click_persons": "20.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "1.00", "click_persons": "1.00"},
         "count": "1",
         "name": "图片广告位assid",
         "sum": {"duration": "10", "persons": "1", "charge_type": "1", "click_persons": "1"},
         "value": "TP_bbb",
         "percent": {
         "duration": "20.00",
         "persons": "12.50",
         "charge_type": "12.50",
         "count": "12.50",
         "click_persons": "20.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "1.00", "click_persons": "1.00"},
         "count": "1",
         "name": "图片广告位assid",
         "sum": {"duration": "10", "persons": "1", "charge_type": "1", "click_persons": "1"},
         "value": "TP_dasf33",
         "percent": {
         "duration": "20.00",
         "persons": "12.50",
         "charge_type": "12.50",
         "count": "12.50",
         "click_persons": "20.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "1.00", "click_persons": "1.00"},
         "count": "1",
         "name": "图片广告位assid",
         "sum": {"duration": "10", "persons": "1", "charge_type": "1", "click_persons": "1"},
         "value": "TP_y3",
         "percent": {
         "duration": "20.00",
         "persons": "12.50",
         "charge_type": "12.50",
         "count": "12.50",
         "click_persons": "20.00"
         },
         "success_rate": "0"
         }, {
         "avg": {"duration": "10.00", "persons": "1.00", "charge_type": "0", "click_persons": "0"},
         "count": "1",
         "name": "图片广告位assid",
         "sum": {"duration": "10", "persons": "1", "charge_type": "0", "click_persons": "0"},
         "value": "TP_yan",
         "percent": {
         "duration": "20.00",
         "persons": "12.50",
         "charge_type": "0",
         "count": "12.50",
         "click_persons": "0"
         },
         "success_rate": "0"
         }], "name": "adp_id", "count": "12"
         }]
         */
        /*
        var data = [{
          "values": [{
            "deductions_div_charge_type": "5.83",
            "deductions_div_click_persons": "5.83",
            "avg": {
              "duration": "10.0000",
              "persons": "1.0000",
              "charge_type": "1.0000",
              "click_persons": "1.0000",
              "deductions": "5.8333"
            },
            "deductions_div_persons": "5.83",
            "deductions_div_count": "5.83",
            "count": "3",
            "sum": {"duration": "30", "persons": "3", "charge_type": "3", "click_persons": "3", "deductions": "17.5"},
            "value": "contract_id，contract_id，查询结果数据列表，查询结果数据列表，查询结果数据列表，查询结果数据列表，查询结果数据列表",
            "percent": {
              "duration": "100.00",
              "persons": "100.00",
              "charge_type": "100.00",
              "count": "100.00",
              "click_persons": "100.00",
              "deductions": "100.00"
            },
            "success_rate": "0"
          },{
            "deductions_div_charge_type": "5.83",
            "deductions_div_click_persons": "5.83",
            "avg": {
              "duration": "10.0000",
              "persons": "1.0000",
              "charge_type": "1.0000",
              "click_persons": "1.0000",
              "deductions": "5.8333"
            },
            "deductions_div_persons": "5.83",
            "deductions_div_count": "5.83",
            "count": "3",
            "sum": {"duration": "30", "persons": "3", "charge_type": "3", "click_persons": "3", "deductions": "17.5"},
            "value": "contract_id，contract_id，查询结果数据列表，查询结果数据列表，查询结果数据列表，查询结果数据列表，查询结果数据列表",
            "percent": {
              "duration": "100.00",
              "persons": "100.00",
              "charge_type": "100.00",
              "count": "100.00",
              "click_persons": "100.00",
              "deductions": "100.00"
            },
            "success_rate": "0"
          }], "name": "contract_id，查询结果数据列表，查询结果数据列表，查询结果数据列表，查询结果数据列表，查询结果数据列表", "count": "1"
        }]
        */
        callback(data);
      }
    }).fail(function (jqXHR, textStatus) {
      if (typeof callback == 'function') {
        callback([{
          "values": [], "name": "adp_id", "count": "0"
        }]);
      }
    });
  };
  StatCount.getAdpData = function (array) {
    var self = this;
    var url = paasHost + paasAdvDomain + "/ads/imgadp/searchadpositions";
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    url += '&adp_ids=' + array.join(',');
    var result = null;
    jQuery.ajax({
      async: false,
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      }
    }).done(function (data) {
      result = [];
      array.forEach(function (itemA) {
        var name = "";
        data.forEach(function (itemB) {
          if (itemA == (itemB ? itemB.ext_id : "")) {
            name = (itemB && itemB.name) ? itemB.name : ""
          }
        })
        result.push(name);
      })
    });
    return result;
  };
  StatCount.getAdData = function (array) {
    var self = this;
    var url = paasHost + paasAdvDomain + "/ads/aditem/searchaditems";
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    url += '&ad_ids=' + array.join(',');
    var result = null;
    jQuery.ajax({
      async: false,
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      }
    }).done(function (data) {
      result = [];
      array.forEach(function (itemA) {
        var name = "";
        data.forEach(function (itemB) {
          if (itemA == (itemB ? itemB.ad_id : "")) {
            name = (itemB && itemB.name) ? itemB.name : ""
          }
        })
        result.push(name);
      })
    });
    return result;
  };
  StatCount.exportReport = function () {
    var self = this;
    var url = paasHost + paasDomain + "/multiapp/statistics/ad/report";
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    url += '&start_date=' + encodeURIComponent(jQuery("#adv_toufang_baogao_top_start_time-datepicker-input").val() + "T00:00:00");
    url += '&end_date=' + encodeURIComponent(jQuery("#adv_toufang_baogao_top_end_time-datepicker-input").val() + "T23:59:59");
    if (self.statCount_site) {
      url = url + "&siteid=" + encodeURIComponent(self.statCount_site);
    }
    if (self.type == "GuangGaoWei") {
      url += '&type=' + "1";
    } else if (self.type == "SuCai") {
      url += '&type=' + "2";
    } else {
    }
    window.open(url, "_blank");
    //downloadFile(url);
  };
  StatCount.init();
})(jQuery);