function DateSchedulePicker(obj){
	var confObj = obj;
	if(confObj){
		this.containerId = confObj.containerId;
		this.calendarStyles = confObj.calendarStyles;
		this.initDate = confObj.initDate;
		this.dateInputStyles = confObj.dateInputStyles;
		this.editable = confObj.editable;
		this.iconImage = confObj.iconImage;
	}
	
	if(!this.containerId)
		return null;
	else
		this.init();	
};

DateSchedulePicker.prototype.init = function(){
	this.dateInputId = this.containerId + '-datepicker-input';
	this.calendarId = this.containerId + '-datepicker-calendar';
	this.createPickerComponents();
	
	this._dhCont = document.getElementById(this.containerId);
    if(this._dhCont && window.dropdownHelper){
        window.dropdownHelper.addDropdownHandler(this);
    }
};

DateSchedulePicker.prototype.createPickerComponents = function(){
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
	var dateInputBorderColor = this.dateInputStyles && this.dateInputStyles.borderColor;
	var dateInput = document.createElement('input');
	dateInput.type = 'text';
	dateInput.id = this.dateInputId;
	dateInput.className = 'datepicker-input';
	container.appendChild(dateInput);
	
	var jqDateInput = jQuery(dateInput);
	jqDateInput.css({
		color: 'inherit',
		borderWidth: '1px',
		borderStyle: 'solid'
	}).outerWidth(dateInputWidth).outerHeight(dateInputHeight);
	if(dateInputBorderColor){
		jqDateInput.css({
			borderColor: dateInputBorderColor
		});
	}
	
	if(!this.editable){
		jqDateInput.attr('readonly', true);
		jqDateInput.click(function(){
			self.toggleCalendar();
		});
	}else{
		jqDateInput.focus(function(){
			self.openCalendar();
		});
		jqDateInput.keydown(function(event){
			var keyCode = event.which;
			if(keyCode == 13){
				this.blur();
				self.setCalendarDate();
				self.closeCalendar();
			}
		});
	}
	
	this.jqDateInput = jqDateInput;
	

	var datePickerIcon = document.createElement('img');
	datePickerIcon.src = this.iconImage || 'content/uiWidget/images/datepicker_calendaricon.png';
	container.appendChild(datePickerIcon);
	var imageTop = Math.floor((jqDateInput.outerHeight() - 20)/2);
	var imageLeft = Math.floor(jqDateInput.outerWidth() - 30);
	var $datePickerIcon = jQuery(datePickerIcon).css({
		position: 'absolute',
		top: imageTop,
		left: imageLeft,
		width: 20,
		height: 20,
		cursor: 'pointer'
	}).click(function(){
		self.toggleCalendar();
	});
	
	this.$datePickerIcon = $datePickerIcon;
	
	var calendarContainer = document.createElement('div');
	calendarContainer.id = this.calendarId;
	container.appendChild(calendarContainer);
	
	this.calendar = new Calendar(this.calendarId, this.initDate);
	this.calendar.setStyles(this.calendarStyles);
	this.calendar.onCalendarClick = function(dateElement){
		self.setInputDate();
		self.closeCalendar();
	};
};

DateSchedulePicker.prototype.openCalendar = function(){
	this.calendar.open();
};

DateSchedulePicker.prototype.closeCalendar = function(){
	this.calendar.close();
};

DateSchedulePicker.prototype.toggleCalendar = function(){
	this.calendar.toggle();
};

DateSchedulePicker.prototype.setCalendarDate = function(){
	var dateStr = this.jqDateInput.val();
	this.calendar.setCurrDate(this.parseDateStr(dateStr));
	this.setInputDate();
};

DateSchedulePicker.prototype.onChange = function(){
	
};

DateSchedulePicker.prototype.setInputDate = function(){
	var year = this.calendar.getCurrYear();
	var month = this.calendar.getCurrMonth();
	var date = this.calendar.getCurrDate();
	
	var dateStr = this.formDateStr(year, month, date);
	
	this.inputYear = year;
	this.inputMonth = month;
	this.inputDate = date;
	this.inputDateStr = dateStr;
	var today=new Date();
	var todayYear = today.getFullYear();
	var todayMonth = today.getMonth();
	var todayDay = today.getDate();
  var choosedStr=new Date(year,month,date).getTime();
	var todayStr=new Date(todayYear,todayMonth,todayDay).getTime();
	if(this.calendar.containerId=="sche__start-datepicker-calendar"){
	  if(choosedStr<todayStr){
			alert(i18n("SCHEDULE_CALENDAR_CONFIRM"));
		}
		else{
			this.jqDateInput.val(dateStr);
			this.onChange();
		}
	}
	else{
		this.jqDateInput.val(dateStr);
		this.onChange();
	}
};

DateSchedulePicker.prototype.formDateStr = function(year, month, date){
	return year
		+ '-'
		+ (month < 9 ? '0' + (month + 1) : (month + 1))
		+ '-'
		+ (date < 10 ? '0' + date : date);
};

DateSchedulePicker.prototype.parseDateStr = function(dateStr){
	var dateparts = dateStr.split('-');
	return {
		year: parseInt(dateparts[0]),
		month: parseInt(dateparts[1]) - 1,
		date: parseInt(dateparts[2])
	};
};

DateSchedulePicker.prototype.getDate = function(){
	return this.inputDate;
};

DateSchedulePicker.prototype.getMonth = function(){
	return this.inputMonth;
};

DateSchedulePicker.prototype.getYear = function(){
	return this.inputYear;
};

DateSchedulePicker.prototype.getDateStr = function(){
	return this.inputDateStr;
};

DateSchedulePicker.prototype.setCurrDate = function(dest){
	if(dest){
		this.calendar.setCurrDate(dest, true);
		this.setInputDate();
	}
};

DateSchedulePicker.prototype.disable = function(){
    this.jqDateInput.attr('disabled', true);
    this.$datePickerIcon.unbind();
};

DateSchedulePicker.prototype.enable = function(){
    var self = this;
    this.jqDateInput.attr('disabled', false);
    this.$datePickerIcon.unbind().click(function(){
        self.toggleCalendar();
    });
};

DateSchedulePicker.prototype.handleDropdowns = function(target, delegate){
    var container = document.getElementById(this.containerId);
    
    if(!container || (container !== this._dhCont)){
        window.dropdownHelper.removeDropdownHandler(this);
        return;
    }
    
    var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);
    
    if(!isChild && this.calendar.opened){
        this.closeCalendar();
    }    
};

DateSchedulePicker.prototype.clear = function(){
    this.inputYear = undefined;
    this.inputMonth = undefined;
    this.inputDate = undefined;
    this.inputDateStr = undefined;
    this.jqDateInput.val('');
    if(this.calendar.opened){
        this.closeCalendar();
    }
};
