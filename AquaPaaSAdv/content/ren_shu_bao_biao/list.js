var StatPeopleList = function (obj) {
  var conf = obj;
  if (conf) {
    this.containerId = conf.containerId;
    this.rowsLmt = conf.rows || 1;
    this.columnsLmt = conf.columns || 1;
    this.listBodyData = conf.listBodyData;
    this.listFootData = conf.listFootData;
    this.titles = conf.titles;
    this.styles = conf.styles;
    this.listType = conf.listType || 0;
    this.totalCount = conf.totalCount || 0;
  }
  if (!this.containerId)
    return null;
  else {
    this.startId = StatPeopleList.id;
    StatPeopleList.id = this.startId + this.titles.length;
  }
};
StatPeopleList.id = 0;
StatPeopleList.scrollBarWidth = undefined;
StatPeopleList.prototype.initParm = function () {
  var that = this;
  that.allWidth = 1;
  that.scrollBarWidth = that.getScrollWidth()
  that.titles.forEach(function(item){
    that.allWidth = that.allWidth + item.width + 1;
  });
  that.allWidth_gutter = that.allWidth + that.scrollBarWidth + 1;
};
StatPeopleList.prototype.getScrollWidth = function() {
  if (StatPeopleList.scrollBarWidth !== undefined) return StatPeopleList.scrollBarWidth;

  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  StatPeopleList.scrollBarWidth = widthNoScroll - widthWithScroll;

  return StatPeopleList.scrollBarWidth;
};
StatPeopleList.prototype.create = function () {
  var that = this;
  that.initParm();
  that.addTemplate();
  that.initHeaderWrapper();
  that.initBodyWrapper();
  that.initFootWrapper();
  that.initFixed();
  that.bindEvent();
};
StatPeopleList.prototype.addTemplate = function () {
  var that = this;
  var container = document.getElementById(this.containerId);
  if (!container)
    return;
  container.innerHTML = "";

  var jqContainer = jQuery(container);
  var $ET = jQuery('' +
    '<div class="et et-scrollable-x et-scrollable-y">' +
    '<div class="et_header-wrapper"></div>' +
    '<div class="et_body-wrapper is-scrolling-left"></div>' +
    '<div class="et_foot-wrapper"></div>' +
    '<div class="et_fixed">' +
    '<div class="et_fixed-header-wrapper"></div>' +
    '<div class="et_fixed-body-wrapper"></div>' +
    '<div class="et_fixed-foot-wrapper"></div>' +
    '</div>' +
    '</div>');
  that.$ET_header_wrapper = $ET.find(".et_header-wrapper");
  that.$ET_body_wrapper = $ET.find(".et_body-wrapper");
  that.$ET_foot_wrapper = $ET.find(".et_foot-wrapper");
  that.$ET_fixed = $ET.find(".et_fixed");
  that.$ET_fixed_header_wrapper = $ET.find(".et_fixed-header-wrapper");
  that.$ET_fixed_body_wrapper = $ET.find(".et_fixed-body-wrapper");
  that.$ET_fixed_foot_wrapper = $ET.find(".et_fixed-foot-wrapper");
  jqContainer.append($ET);

  $ET.css({
    height: that.styles.height
  });
};
StatPeopleList.prototype.initHeaderWrapper = function () {
  var that = this;
  var $table = jQuery('' +
    '<table class="has-gutter" cellspacing="1" cellpadding="0" border="0" class="et__header" style="width:' + that.allWidth_gutter + 'px">' +
    '<colgroup></colgroup>' +
    '<thead ><tr></tr></thead>' +
    '</table>');
  var $colgroup = $table.find('colgroup');
  var $tr = $table.find('tr');
  that.titles.forEach(function(item, index){
    var id = that.startId + index;
    var $col = jQuery('<col name="column_' + id + '" width="' + item.width + '">');
    $colgroup.append($col);
    var $th = jQuery('<th colspan="1" rowspan="1" class=""column_' + id + '"></th>');
    if(index && (typeof item.label !== "undefined")){
      $th.html(item.label)
    }
    $tr.append($th);
  });
  var $col = jQuery('<col name="gutter" width="' + that.scrollBarWidth + '">');
  $colgroup.append($col);
  var $th = jQuery('<th class="gutter" ></th>');
  $tr.append($th);
  $tr.css({width: that.scrollBarWidth});
  that.$ET_header_wrapper.append($table);
};
StatPeopleList.prototype.initBodyWrapper = function () {
  var that = this;
  var $table = jQuery('' +
    '<table cellspacing="1" cellpadding="0" border="0" class="et__body" style="width:' + that.allWidth + 'px">' +
    '<colgroup></colgroup>' +
    '<tbody></tbody>' +
    '</table>');
  var $colgroup = $table.find('colgroup');
  var $tbody = $table.find('tbody');
  that.titles.forEach(function(item, index){
    var id = that.startId + index;
    var $col = jQuery('<col name="column_' + id + '" width="' + item.width + '">');
    $colgroup.append($col);
  });
  that.$ET_body_wrapper.append($table);
  that.$ET_body_wrapper_tbody = $tbody;

  that.$ET_body_wrapper.css({
    height: that.styles.height - 48 - 48 - that.scrollBarWidth
  });

  that.initBodyWrapperRows(that.$ET_body_wrapper_tbody);
  that.updataBodyWrapperData(that.$ET_body_wrapper_tbody);
};
StatPeopleList.prototype.initBodyWrapperRows = function ($tbody) {
  var that = this;
  $tbody.empty();
  var rows = 0;
  if (that.listBodyData.length < that.rowsLmt) {
    rows = that.rowsLmt;
  } else {
    rows = that.listBodyData.length;
  }
  var i = 0;
  for(i = 0; i < rows; i++){
    var $tr = jQuery('<tr class="et__row"></tr>');
    that.titles.forEach(function(item, index){
      var id = that.startId + index;
      var $td = jQuery('<td rowspan="1" colspan="1" class="column_' + id + '"></td>');
      $tr.append($td);
    });
    $tbody.append($tr);
  }
};
StatPeopleList.prototype.updataBodyWrapperData = function ($tbody) {
  var that = this;
  $tbody.find("tr.et__row").each(function (i, item){
    var tr_data = that.listBodyData[i] || [];
    var $tr = jQuery(item);
    $tr.find("td").each(function (i, item){
      var td_data = tr_data[i] || {};
      var $td = jQuery(item);
      $td.html((typeof td_data.label !== 'undefined') ? td_data.label : "");
    })
  });

  that.adjustGutterY();
};
StatPeopleList.prototype.initFootWrapper = function () {
  var that = this;
  var $table = jQuery('' +
    '<table class="has-gutter" cellspacing="1" cellpadding="0" border="0" class="et__header" style="width:' + that.allWidth_gutter + 'px">' +
    '<colgroup></colgroup>' +
    '<thead ><tr></tr></thead>' +
    '</table>');
  var $colgroup = $table.find('colgroup');
  var $tr = $table.find('tr');
  that.titles.forEach(function(item, index){
    var id = that.startId + index;
    var $col = jQuery('<col name="column_' + id + '" width="' + item.width + '">');
    $colgroup.append($col);
    var label = "";
    var $th = jQuery('<th colspan="1" rowspan="1" class=""column_' + id + '">' + label + '</th>');
    $tr.append($th);
  });
  var $col = jQuery('<col name="gutter" width="' + that.scrollBarWidth + '">');
  $colgroup.append($col);
  var $th = jQuery('<th class="gutter" ></th>');
  $tr.append($th);
  $tr.css({width: that.scrollBarWidth});
  that.$ET_foot_wrapper.append($table);
  that.$ET_foot_wrapper_tr = $tr;
  that.updataFootWrapperData(that.$ET_foot_wrapper_tr);
};
StatPeopleList.prototype.initFixed = function () {
  var that = this;
  var firstWidth = that.titles[0].width;
  that.$ET_fixed.css({
    width: firstWidth,
    height: that.styles.height - that.scrollBarWidth
  });
  that.$ET_fixed_body_wrapper.css({
    height: that.styles.height - 48 - 48 - that.scrollBarWidth
  });
  that.initFixedHeaderWrapper();
  that.initFixedBodyWrapper();
  that.initFixedFootWrapper();
};
StatPeopleList.prototype.initFixedHeaderWrapper = function () {
  var that = this;
  var $table = jQuery('' +
    '<table cellspacing="1" cellpadding="0" border="0" class="et__header" style="width:' + that.allWidth + 'px">' +
    '<colgroup></colgroup>' +
    '<thead><tr></tr></thead>' +
    '</table>');
  var $colgroup = $table.find('colgroup');
  var $tr = $table.find('tr');
  that.titles.forEach(function(item, index){
    var id = that.startId + index;
    var $col = jQuery('<col name="column_' + id + '" width="' + item.width + '">');
    $colgroup.append($col);
    var $th = jQuery('<th colspan="1" rowspan="1" class=""column_' + id + '">' + item.label + '</th>');
    $tr.append($th);
  });
  that.$ET_fixed_header_wrapper.append($table);
};
StatPeopleList.prototype.initFixedBodyWrapper = function () {
  var that = this;
  var $table = jQuery('' +
    '<table cellspacing="1" cellpadding="0" border="0" class="et__body" style="width:' + that.allWidth + 'px">' +
    '<colgroup></colgroup>' +
    '<tbody></tbody>' +
    '</table>');
  var $colgroup = $table.find('colgroup');
  var $tbody = $table.find('tbody');
  that.titles.forEach(function(item, index){
    var id = that.startId + index;
    var $col = jQuery('<col name="column_' + id + '" width="' + item.width + '">');
    $colgroup.append($col);
  });
  that.$ET_fixed_body_wrapper.append($table);
  that.$ET_fixed_body_wrapper_tbody = $tbody;
  that.initBodyWrapperRows(that.$ET_fixed_body_wrapper_tbody);
  that.updataBodyWrapperData(that.$ET_fixed_body_wrapper_tbody);
};
StatPeopleList.prototype.initFixedFootWrapper = function () {
  var that = this;
  var $table = jQuery('' +
    '<table cellspacing="1" cellpadding="0" border="0" class="et__header" style="width:' + that.allWidth + 'px">' +
    '<colgroup></colgroup>' +
    '<thead><tr></tr></thead>' +
    '</table>');
  var $colgroup = $table.find('colgroup');
  var $tr = $table.find('tr');
  that.titles.forEach(function(item, index){
    var id = that.startId + index;
    var $col = jQuery('<col name="column_' + id + '" width="' + item.width + '">');
    $colgroup.append($col);
    var label = "";
    var $th = jQuery('<th colspan="1" rowspan="1" class=""column_' + id + '">' + label + '</th>');
    $tr.append($th);
  });
  that.$ET_fixed_foot_wrapper.append($table);
  that.$ET_fixed_foot_wrapper_tr = $tr;
  that.updataFootWrapperData(that.$ET_fixed_foot_wrapper_tr);
};
StatPeopleList.prototype.updataFootWrapperData = function ($tr) {
  var that = this;
  var tr_data = this.listFootData;
  $tr.find("th").each(function (i, item){
    var td_data = tr_data[i] || {};
    var $td = jQuery(item);
    $td.html((typeof td_data.label !== 'undefined') ? td_data.label : "");
  })
};
StatPeopleList.prototype.bindEvent = function () {
  var bodyWrapper = this.$ET_body_wrapper[0];
  bodyWrapper.addEventListener('scroll', throttle(20, this.syncPostionY.bind(this)), { passive: true });
  var footWrapper = this.$ET_foot_wrapper[0];
  footWrapper.addEventListener('scroll', throttle(20, this.syncPostionX.bind(this)), { passive: true });
  function throttle( delay, noTrailing, callback, debounceMode ) {

    // After wrapper has stopped being called, this timeout ensures that
    // `callback` is executed at the proper times in `throttle` and `end`
    // debounce modes.
    var timeoutID;

    // Keep track of the last time `callback` was executed.
    var lastExec = 0;

    // `noTrailing` defaults to falsy.
    if ( typeof noTrailing !== 'boolean' ) {
      debounceMode = callback;
      callback = noTrailing;
      noTrailing = undefined;
    }

    // The `wrapper` function encapsulates all of the throttling / debouncing
    // functionality and when executed will limit the rate at which `callback`
    // is executed.
    function wrapper () {

      var self = this;
      var elapsed = Number(new Date()) - lastExec;
      var args = arguments;

      // Execute `callback` and update the `lastExec` timestamp.
      function exec () {
        lastExec = Number(new Date());
        callback.apply(self, args);
      }

      // If `debounceMode` is true (at begin) this is used to clear the flag
      // to allow future `callback` executions.
      function clear () {
        timeoutID = undefined;
      }

      if ( debounceMode && !timeoutID ) {
        // Since `wrapper` is being called for the first time and
        // `debounceMode` is true (at begin), execute `callback`.
        exec();
      }

      // Clear any existing timeout.
      if ( timeoutID ) {
        clearTimeout(timeoutID);
      }

      if ( debounceMode === undefined && elapsed > delay ) {
        // In throttle mode, if `delay` time has been exceeded, execute
        // `callback`.
        exec();

      } else if ( noTrailing !== true ) {
        // In trailing throttle mode, since `delay` time has not been
        // exceeded, schedule `callback` to execute `delay` ms after most
        // recent execution.
        //
        // If `debounceMode` is true (at begin), schedule `clear` to execute
        // after `delay` ms.
        //
        // If `debounceMode` is false (at end), schedule `callback` to
        // execute after `delay` ms.
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
      }

    }

    // Return the wrapper function.
    return wrapper;

  };
};
StatPeopleList.prototype.syncPostionY = function () {
  var bodyWrapper = this.$ET_body_wrapper[0];
  var scrollTop = bodyWrapper.scrollTop;
  var fixedBodyWrapper = this.$ET_fixed_body_wrapper[0];

  if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = scrollTop;
};
StatPeopleList.prototype.syncPostionX = function () {
  var footWrapper = this.$ET_foot_wrapper[0];
  var scrollLeft = footWrapper.scrollLeft;
  var offsetWidth = footWrapper.offsetWidth;
  var scrollWidth = footWrapper.scrollWidth;

  var headerWrapper = this.$ET_header_wrapper[0];
  var bodyWrapper = this.$ET_body_wrapper[0];

  if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
  if (bodyWrapper) bodyWrapper.scrollLeft = scrollLeft;

  var maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
  this.$ET_body_wrapper.removeClass("is-scrolling-left");
  this.$ET_body_wrapper.removeClass("is-scrolling-middle");
  this.$ET_body_wrapper.removeClass("is-scrolling-right");
  if (scrollLeft >= maxScrollLeftPosition) {
    this.$ET_body_wrapper.addClass("is-scrolling-right");
  } else if (scrollLeft === 0) {
    this.$ET_body_wrapper.addClass("is-scrolling-left");
  } else {
    this.$ET_body_wrapper.addClass("is-scrolling-middle");
  }
};
StatPeopleList.prototype.adjustGutterY = function () {
  var that = this;
  var bodyWrapper = that.$ET_body_wrapper[0];
  var scrollHeight = bodyWrapper.scrollHeight;
  var offsetHeight = bodyWrapper.offsetHeight;
  var clientHeight = bodyWrapper.clientHeight;

  if(scrollHeight > clientHeight){
    that.$ET_header_wrapper.find('table').addClass('has-gutter');
    that.$ET_foot_wrapper.find('table').addClass('has-gutter');
    that.$ET_header_wrapper.find('table').css({width: that.allWidth_gutter});
    that.$ET_foot_wrapper.find('table').css({width: that.allWidth_gutter});
  } else {
    that.$ET_header_wrapper.find('table').removeClass('has-gutter');
    that.$ET_foot_wrapper.find('table').removeClass('has-gutter');
    that.$ET_header_wrapper.find('table').css({width: that.allWidth});
    that.$ET_foot_wrapper.find('table').css({width: that.allWidth});
  }
};

StatPeopleList.prototype.updateData = function (listBodyData, listFootData) {
  var that = this;
  that.listBodyData = listBodyData;
  that.listFootData = listFootData;
  that.initBodyWrapperRows(that.$ET_body_wrapper_tbody);
  that.updataBodyWrapperData(that.$ET_body_wrapper_tbody);

  that.initBodyWrapperRows(that.$ET_fixed_body_wrapper_tbody);
  that.updataBodyWrapperData(that.$ET_fixed_body_wrapper_tbody);

  that.updataFootWrapperData(that.$ET_foot_wrapper_tr);
  that.updataFootWrapperData(that.$ET_fixed_foot_wrapper_tr);
};