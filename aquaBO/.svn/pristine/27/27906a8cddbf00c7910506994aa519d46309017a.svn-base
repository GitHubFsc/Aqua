function DatePicker(obj){
	var confObj = obj;
	if(confObj){
		this.containerId = confObj.containerId;
		this.calendarStyles = confObj.calendarStyles;
		this.initDate = confObj.initDate;
		this.dateInputStyles = confObj.dateInputStyles;
		this.hmsInputStyles = confObj.hmsInputStyles;
		this.editable = confObj.editable;
		this.iconImage = confObj.iconImage;
		this.iconStyle = confObj.iconStyle;
		this.showHMS = confObj.showHMS;
	}

	if(!this.containerId)
		return null;
	else
		this.init();
};

DatePicker.prototype.init = function(){
	this.dateInputId = this.containerId + '-datepicker-input';
	this.HourMinuteSecondInput = this.containerId + '-hms-input';
	this.hourSelectId = this.containerId + '-hour-select';
	this.minuteSelectId = this.containerId + '-minute-select';
	this.calendarId = this.containerId + '-datepicker-calendar';

	this.onChangeEnabled = true;

	this.createPickerComponents();

	this._dhCont = document.getElementById(this.containerId);
    if(this._dhCont && window.dropdownHelper){
        window.dropdownHelper.addDropdownHandler(this);
    }
};

DatePicker.prototype.createPickerComponents = function(){
	var container = document.getElementById(this.containerId);
	if(!container)
		return;
	var self = this;

	var jqContainer = jQuery(container);
	if(jqContainer.css('position') == 'static'){
		jqContainer.css({
			position: 'relative'
		});
	};

	var dateInputWidth = (this.dateInputStyles && this.dateInputStyles.width) || jqContainer.width();
	var dateInputHeight = (this.dateInputStyles && this.dateInputStyles.height) || jqContainer.height();
	var hmsInputWidth = (this.hmsInputStyles && this.hmsInputStyles.width) || jqContainer.height();
	var hmsInputHeight = (this.hmsInputStyles && this.hmsInputStyles.height) || jqContainer.height();
	var dateInputBorderColor = this.dateInputStyles && this.dateInputStyles.borderColor;
	var dateInputBorderRadius = this.dateInputStyles && this.dateInputStyles.borderRadius;
  var hmsInputBorderColor = this.hmsInputStyles && this.hmsInputStyles.borderColor;
  var hmsInputBorderRadius = this.hmsInputStyles && this.hmsInputStyles.borderRadius;



  add_dateInput.call(self);
  add_datePickerIcon.call(self);
  this.showHMS && add_HourMinuteSecondInput.call(self);
  add_dialog_BG.call(self);

  function add_dateInput(){
    var dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.id = this.dateInputId;
    dateInput.className = 'datepicker-input';
    container.appendChild(dateInput);

    var jqDateInput = jQuery(dateInput);
    jqDateInput.attr('data-type', 'date');
    jqDateInput.css({
      color: 'inherit',
      borderWidth: this.dateInputStyles && this.dateInputStyles.borderWidth || '1px',
      borderStyle: 'solid'
    }).outerWidth(dateInputWidth).outerHeight(dateInputHeight);
    jqDateInput.attr("autocomplete", "off");
    if(dateInputBorderColor){
      jqDateInput.css({
        borderColor: dateInputBorderColor
      });
    }
    if(dateInputBorderRadius){
      jqDateInput.css({
        borderRadius: dateInputBorderRadius
      });
    }

    if(!this.editable){
      jqDateInput.attr('readonly', true);
      jqDateInput.click(function(){
        self.toggleDialog();
      });
    }else{
      jqDateInput.focus(function(){
        //self.focusStatus = true;
        self.openDialog();
      });
      jqDateInput.keydown(function(event){
        var keyCode = event.which;
        self.onEnterKeyDownEvent();
        if(keyCode == 13){
          this.blur();
          //self.focusStatus = false;
          self.setCalendarDate();
          self.closeDialog();
        }
      });
    }

    this.jqDateInput = jqDateInput;
  }
  function add_datePickerIcon(){
    var jqDateInput = this.jqDateInput;
    var datePickerIcon = document.createElement('img');
    datePickerIcon.src = this.iconImage || 'uiWidget/images/datepicker_calendaricon.png';
    container.appendChild(datePickerIcon);
    var imageTop = Math.floor((jqDateInput.outerHeight() - 20)/2);
    var imageLeft = this.iconStyle && this.iconStyle.left || Math.floor(jqDateInput.outerWidth() - 30);
    var $datePickerIcon = jQuery(datePickerIcon).css({
      position: 'absolute',
      top: imageTop,
      left: imageLeft,
      width: 20,
      height: 20,
      cursor: 'pointer'
    }).click(function(){
      self.toggleDialog();
    });

    this.$datePickerIcon = $datePickerIcon;
  }
  function add_HourMinuteSecondInput(){
    var HourMinuteSecondInput = document.createElement('input');
    HourMinuteSecondInput.type = 'text';
    HourMinuteSecondInput.id = this.HourMinuteSecondInput;
    HourMinuteSecondInput.className = 'HMS-input';
    container.appendChild(HourMinuteSecondInput);

    var jqHourMinuteSecondInput = jQuery(HourMinuteSecondInput);
    jqHourMinuteSecondInput.attr('data-type', 'hms');
    jqHourMinuteSecondInput.css({
      color: 'inherit',
      borderWidth: this.dateInputStyles && this.dateInputStyles.borderWidth || '1px',
      borderStyle: 'solid'
    }).outerWidth(hmsInputWidth).outerHeight(hmsInputHeight);
    jqHourMinuteSecondInput.attr("autocomplete", "off");
    if(hmsInputBorderColor){
      jqHourMinuteSecondInput.css({
        borderColor: dateInputBorderColor
      });
    }
    if(hmsInputBorderRadius){
      jqHourMinuteSecondInput.css({
        borderRadius: dateInputBorderRadius
      });
    }

    if(!this.editable){
      jqHourMinuteSecondInput.attr('readonly', true);
      jqHourMinuteSecondInput.click(function(){
        self.toggleDialog();
      });
    }else{
      jqHourMinuteSecondInput.focus(function(){
        //self.focusStatus = true;
        self.openDialog();
      });
      jqHourMinuteSecondInput.keydown(function(event){
        var keyCode = event.which;
        self.onEnterKeyDownEvent();
        if(keyCode == 13){
          this.blur();
          //self.focusStatus = false;
          self.setCalendarDate();
          self.closeDialog();
        }
      });
    }
    this.jqHourMinuteSecondInput = jqHourMinuteSecondInput;
  }
  function add_dialog_BG(){
    var html = '<div class="panel_calendar_time_container">' +
      '<div class="panel_time_picker_calender" id="' + this.calendarId +'"></div>' +
      '<div class="panel_time_picker_times" style="' + (this.showHMS ? '' : 'display:none') + '">' +
        '<div class="panel_time_picker_selector" id="' + this.hourSelectId +'"></div>' +
        '<div class="panel_time_picker_tlabel" style="margin-right: 10px;">'+ i18n('NAVMNGSLIDER_HOUR') + ': ' + '</div>' +
        '<div class="panel_time_picker_selector" id="' + this.minuteSelectId +'"></div>' +
        '<div class="panel_time_picker_tlabel">'+ i18n('NAVMNGSLIDER_MINUTE') + '</div>' +
        //'<div class="panel_time_picker_selector" id="stat_timesel_sec"></div>' +
        //'<div class="panel_time_picker_tlabel">{{STATS_TMLABEL_SECS}}</div>' +
      '</div>' +
      '<div class="panel_content_line_split"></div>' +
      '<div class="panel_normal_btn">'+ i18n('NAVMNGSLIDER_OK') + '</div>' +
      '</div>' +
    '</div>'

    var $dialogBg = jQuery(html);
    jqContainer.append($dialogBg);
    this.$dialogBg = $dialogBg;

    this.calendar = new Calendar(this.calendarId, this.initDate);
    this.calendar.setStyles(this.calendarStyles);
    this.calendar.onCalendarClick = function(el){
      var els = this.getCurrMonthDateElements();
      for (var i = 0, len = els.length; i < len; i += 1) {
        els[i].style.backgroundColor = '#fefefe';
        els[i].style.color = '#797979';
      }
      el.style.backgroundColor = '#5da1c0';
      el.style.color = '#fffefe';
      //self.setInputDate();
      //self.closeDialog();
    };
    this.calendar.onCalendarRefresh = function (els) {
      for (var i = 0, len = els.length; i < len; i += 1) {
        if (i == this.helper.curr_date - 1) {
          els[i].style.backgroundColor = '#5da1c0';
          els[i].style.color = '#fffefe';
        }
      }
    };
    this.calendar.open();



    var hourSelect_options = Array.apply(null, Array(24)).map(function(item, index){
      var result = ""
      if(index < 10){
        result = "0" + index;
      }else{
        result = "" + index;
      }
      return {
        key: result,
        value: result
      }
    });
    var hourSelect = new newSelect('#' + this.hourSelectId, [], {
      width: 110,
      height: 30,
      background: "white",
      fontSize: 14,
      liFontSize: 14,
      color: "#797979",
      liColor: "#797979",
      selectbackground: "white",
      headerBorder: "1px solid #CECDCB",
      liBorderColor: "#CECDCB",
      openIconUrl: "./uiWidget/images/open5.png",
      closeIconUrl: "./uiWidget/images/close5.png",
      ScrollBarHeight: "124px"
    });
    hourSelect.updateSelectOptions(hourSelect_options);
    this.hourSelect = hourSelect;

    var minuteSelect_options = Array.apply(null, Array(60)).map(function(item, index){
      var result = ""
      if(index < 10){
        result = "0" + index;
      }else{
        result = "" + index;
      }
      return {
        key: result,
        value: result
      }
    });
    var minuteSelect = new newSelect('#' + this.minuteSelectId, [], {
      width: 110,
      height: 30,
      background: "white",
      fontSize: 14,
      liFontSize: 14,
      color: "#797979",
      liColor: "#797979",
      selectbackground: "white",
      headerBorder: "1px solid #CECDCB",
      liBorderColor: "#CECDCB",
      openIconUrl: "./uiWidget/images/open5.png",
      closeIconUrl: "./uiWidget/images/close5.png",
      ScrollBarHeight: "124px"
    });
    minuteSelect.updateSelectOptions(minuteSelect_options);
    this.minuteSelect = minuteSelect;

    jQuery('#' + this.containerId + ' .panel_normal_btn').click(function(){
      self.onEnterKeyDownEvent();
      self.setInputDate();
      self.closeDialog();
    });
  }
};

DatePicker.prototype.openCalendar = function(){
	this.calendar.open();
};

DatePicker.prototype.closeCalendar = function(){
	this.calendar.close();
};

DatePicker.prototype.toggleCalendar = function(){
	this.calendar.toggle();
};

DatePicker.prototype.openDialog = function(){
  this.$dialogBg.show();
};

DatePicker.prototype.closeDialog = function(){
  this.$dialogBg.hide();
};

DatePicker.prototype.toggleDialog = function(){
  this.$dialogBg.toggle();
};

DatePicker.prototype.setCalendarDate = function(){
	var dateStr = this.jqDateInput.val();
	this.calendar.setCurrDate(this.parseDateStr(dateStr));

  if(this.showHMS){
    var hmsStr = this.jqHourMinuteSecondInput.val();
    var hmsArray = hmsStr.split(':');
    var hour = hmsArray[0];
    var minute = hmsArray[1];
    if((!isNaN(hour) && (parseInt(hour)<24)) && (!isNaN(minute) && (parseInt(minute)<60))){
      this.hourSelect.setKey(hour);
      this.minuteSelect.setKey(minute);
    }else{
      hour = "00";
      minute = "00";
      this.hourSelect.setKey(hour);
      this.minuteSelect.setKey(minute);
    }
  }

	this.setInputDate();
};

DatePicker.prototype.onEnterKeyDownEvent = function(){
};

DatePicker.prototype.onChange = function(){

};

DatePicker.prototype.setInputDate = function(){
	var year = this.calendar.getCurrYear();
	var month = this.calendar.getCurrMonth();
	var date = this.calendar.getCurrDate();

	var dateStr = this.formDateStr(year, month, date);

	this.inputYear = year;
	this.inputMonth = month;
	this.inputDate = date;
	this.inputDateStr = dateStr;
	this.jqDateInput.val(dateStr);

  if(this.showHMS){
    var hour = this.hourSelect.getKey();
    var minute = this.minuteSelect.getKey();
    this.inputHour = hour;
    this.inputMinute = minute;
    this.jqHourMinuteSecondInput.val(this.inputHour + ":" + this.inputMinute);
  }

	this.onChangeEnabled && this.onChange();
};

DatePicker.prototype.formDateStr = function(year, month, date){
	return year
		+ '-'
		+ (month < 9 ? '0' + (month + 1) : (month + 1))
		+ '-'
		+ (date < 10 ? '0' + date : date);
};

DatePicker.prototype.parseDateStr = function(dateStr){
	var dateparts = dateStr.split('-');
	return {
		year: parseInt(dateparts[0]),
		month: parseInt(dateparts[1]) - 1,
		date: parseInt(dateparts[2])
	};
};

DatePicker.prototype.getDate = function(){
	return this.inputDate;
};

DatePicker.prototype.getMonth = function(){
	return this.inputMonth;
};

DatePicker.prototype.getYear = function(){
	return this.inputYear;
};

DatePicker.prototype.getHour = function(){
  return this.inputHour;
};

DatePicker.prototype.getMinute = function(){
  return this.inputMinute;
};

DatePicker.prototype.getISOString = function(){
  //返回2019-08-03T05:04:00Z这种格式，时区也转化
  var str;
  var result = new Date();
  result.setFullYear(this.getYear());
  result.setMonth(this.getMonth());
  result.setDate(this.getDate());
  if(this.showHMS){
    result.setHours(this.getHour());
    result.setMinutes(this.getMinute());
    result.setSeconds("00");
  }

  var  _dif = new Date().getTimezoneOffset()
  result = result.getTime() + _dif * 60 * 1000;

  result = new Date(result);
  var year = result.getFullYear();
  var month = result.getMonth() + 1;
  var date = result.getDate();
  var hour = result.getHours();
  var minute = result.getMinutes();
  var second = result.getSeconds();

  str ="" + year + "-" + addZero(month) + "-" + addZero(date);

  if(this.showHMS){
    str += "T" + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second) + "Z";
  }
  return str;

  function addZero(number){
    if(number < 10){
      return "0" + number;
    }else{
      return String(number)
    }
  }
};

DatePicker.prototype.getDateStr = function(){
	return this.inputDateStr;
};

DatePicker.prototype.setCurrDate = function(dest){
	if(dest){
		this.calendar.setCurrDate(dest, true);
		this.setInputDate();
	}
};

DatePicker.prototype.disable = function(){
    this.jqDateInput.attr('disabled', true);
    this.$datePickerIcon.unbind();
};

DatePicker.prototype.enable = function(){
    var self = this;
    this.jqDateInput.attr('disabled', false);
    this.$datePickerIcon.unbind().click(function(){
        self.toggleDialog();
    });
};

DatePicker.prototype.handleDropdowns = function(target, delegate){
    var container = document.getElementById(this.containerId);

    /*
    if(!jQuery(target).parents('.select-content')[0]){
      window.dropdownHelper.removeDropdownHandler(this);
      return;
    }
    */
    if(!container || (container !== this._dhCont)){
        window.dropdownHelper.removeDropdownHandler(this);
        return;
    }

    var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);

    if(!isChild){
      if (jQuery(target).parents('.select-content')[0]) {

      }else{
        /*
        if(this.focusStatus){
          this.focusStatus = false;
          this.setCalendarDate();
        }*/
        this.closeDialog();
      }
    }
};

DatePicker.prototype.clear = function(){
    this.inputYear = undefined;
    this.inputMonth = undefined;
    this.inputDate = undefined;
    this.inputDateStr = undefined;
    this.inputHour = undefined;
    this.inputMinute = undefined;
    this.jqDateInput.val('');
    this.jqHourMinuteSecondInput.val('');
    this.closeDialog();
};
