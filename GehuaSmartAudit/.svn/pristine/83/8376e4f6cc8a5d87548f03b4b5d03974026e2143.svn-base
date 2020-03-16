function DatePickerVersionTwo(obj){
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

DatePickerVersionTwo.prototype.init = function(){
	this.dateInputId = this.containerId + '-datepicker-input';
	this.calendarId = this.containerId + '-datepicker-calendar';
	this.createPickerComponents();

	this._dhCont = document.getElementById(this.containerId);
    if(this._dhCont && window.dropdownHelper){
        window.dropdownHelper.addDropdownHandler(this);
    }
};

DatePickerVersionTwo.prototype.createPickerComponents = function(){
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
	dateInput.className = 'datepicker_input';
	container.appendChild(dateInput);

	var jqDateInput = jQuery(dateInput);
	jqDateInput.outerWidth(dateInputWidth).outerHeight(dateInputHeight);
	jqDateInput.css("border-radius","4px");
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
	datePickerIcon.src = this.iconImage || 'uiWidget/images/datepicker_calendaricon.png';
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

	this.calendar = new CalendarVersionTwo(this.calendarId, this.initDate);
	this.calendar.setStyles(this.calendarStyles);
	this.calendar.onCalendarClick = function(dateElement){
		self.setInputDate();
		self.closeCalendar();
	};
};

DatePickerVersionTwo.prototype.openCalendar = function(){
	this.calendar.open();
};

DatePickerVersionTwo.prototype.closeCalendar = function(){
	this.calendar.close();
};

DatePickerVersionTwo.prototype.toggleCalendar = function(){
	this.calendar.toggle();
};

DatePickerVersionTwo.prototype.setCalendarDate = function(){
	var dateStr = this.jqDateInput.val();
	this.calendar.setCurrDate(this.parseDateStr(dateStr));
	this.setInputDate();
};

DatePickerVersionTwo.prototype.onChange = function(){

};

DatePickerVersionTwo.prototype.setInputDate = function(){
	var year = this.calendar.getCurrYear();
	var month = this.calendar.getCurrMonth();
	var date = this.calendar.getCurrDate();

	var dateStr = this.formDateStr(year, month, date);

	this.inputYear = year;
	this.inputMonth = month;
	this.inputDate = date;
	this.inputDateStr = dateStr;
	this.jqDateInput.val(dateStr);
	this.onChange();
};

DatePickerVersionTwo.prototype.formDateStr = function(year, month, date){
	return year
		+ '-'
		+ (month < 9 ? '0' + (month + 1) : (month + 1))
		+ '-'
		+ (date < 10 ? '0' + date : date);
};

DatePickerVersionTwo.prototype.parseDateStr = function(dateStr){
	var dateparts = dateStr.split('-');
	return {
		year: parseInt(dateparts[0]),
		month: parseInt(dateparts[1]) - 1,
		date: parseInt(dateparts[2])
	};
};

DatePickerVersionTwo.prototype.getDate = function(){
	return this.inputDate;
};

DatePickerVersionTwo.prototype.getMonth = function(){
	return this.inputMonth;
};

DatePickerVersionTwo.prototype.getYear = function(){
	return this.inputYear;
};

DatePickerVersionTwo.prototype.getDateStr = function(){
	return this.inputDateStr;
};

DatePickerVersionTwo.prototype.setCurrDate = function(dest){
	if(dest){
		this.calendar.setCurrDate(dest, true);
		this.setInputDate();
	}
};

DatePickerVersionTwo.prototype.disable = function(){
    this.jqDateInput.attr('disabled', true);
    this.$datePickerIcon.unbind();
};

DatePickerVersionTwo.prototype.enable = function(){
    var self = this;
    this.jqDateInput.attr('disabled', false);
    this.$datePickerIcon.unbind().click(function(){
        self.toggleCalendar();
    });
};

DatePickerVersionTwo.prototype.handleDropdowns = function(target, delegate){
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

DatePickerVersionTwo.prototype.clear = function(){
    this.inputYear = undefined;
    this.inputMonth = undefined;
    this.inputDate = undefined;
    this.inputDateStr = undefined;
    this.jqDateInput.val('');
    if(this.calendar.opened){
        this.closeCalendar();
    }
};
