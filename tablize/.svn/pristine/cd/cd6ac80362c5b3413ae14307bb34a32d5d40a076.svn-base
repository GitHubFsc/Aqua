var Months = [i18n('JANUARY'), i18n('FEBRUARY'), i18n('MARCH'), i18n('APRIL'), i18n('MAY'), i18n('JUNE'), i18n('JULY'), i18n('AUGUST'), i18n('SEPTEMBER'), i18n('OCTOBER'), i18n('NOVEMBER'), i18n('DECEMBER')];
var Weekdays = [i18n('SUNDAY'), i18n('MONDAY'), i18n('TUESDAY'), i18n('WEDNESDAY'), i18n('THURSDAY'), i18n('FRIDAY'), i18n('SATURDAY')];
var Leap_Year_Month_Days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var Nonleap_Year_Month_Days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var Weekday_Order = [0, 1, 2, 3, 4, 5, 6];
var NOW = new Date();

/*
 * DateListHelper是Calendar中主要的单纯数据处理单元。
 */
function DateListHelper(custom, custom_year, custom_month){
    this.first_weekday_pref = 0; //以周几作为一周第一天的偏好设置。

    this.curr_month = []; //日历当前显示的月份。
    var year = NOW.getFullYear();
    var month = NOW.getMonth();
    this.curr_month.push(custom ? custom_year : year);
    this.curr_month.push(custom ? custom_month : month);

    this.date_list = []; //存储日历中显示的所有日期序列。
    this.meta_list = []; //存储对应于日期序列的冗余信息，当前仅记录了该日期是否是当前月的状态。
}

DateListHelper.prototype.isLeapYear = function(year){
    if(((year%4 == 0) && (year%100 != 0)) || (year%400 == 0))
        return true;
    return false;
};

DateListHelper.prototype.getMonthDays = function(_month){
    var year = _month[0];
    var month = _month[1];
    if(this.isLeapYear(year))
        return Leap_Year_Month_Days[month];
    return Nonleap_Year_Month_Days[month];
};

DateListHelper.prototype.getPrevMonth = function(curr_month){
    var year = curr_month[0];
    var month = curr_month[1];
    var prev = [];
    if(month > 0){
        prev.push(year);
        prev.push(month -1);
    }else{
        prev.push(year - 1);
        prev.push(11);
    }
    return prev;
};

DateListHelper.prototype.getNextMonth = function(curr_month){
    var year = curr_month[0];
    var month = curr_month[1];
    var next = [];
    if(month< 11){
        next.push(year);
        next.push(month + 1);
    }else{
        next.push(year + 1);
        next.push(0);
    }
    return next;
};

DateListHelper.prototype.getNextDate = function(curr_month, date){
	var next_date_year = curr_month[0];
	var next_date_month = curr_month[1];
	var next_date = date + 1;
	if(next_date > this.getMonthDays(curr_month)){
		next_date = 1;
		next_date_month += 1;
		if(next_date_month > 11){
			next_date_month = 0;
			next_date_year +=1;
		} 
	}
	return [next_date_year, next_date_month, next_date];
};

DateListHelper.prototype.refresh = function(){
    this.initDateList();
};

DateListHelper.prototype.initDateList = function(){
    this.date_list = [];
    this.meta_list = [];

    var prev_month = this.getPrevMonth(this.curr_month);
    var next_month = this.getNextMonth(this.curr_month);

    var prev_list = this.getMonthDateList(prev_month);
    var curr_list = this.getMonthDateList(this.curr_month);
    var next_list = this.getMonthDateList(next_month);

    var curr_first_weekday = curr_list[0].getDay();
    var prev_nums = 0;
    for(var i=0; i<7; i++){
        if(Weekday_Order[i] == curr_first_weekday){
            prev_nums = i;
            break;
        }
    }
    var curr_nums = curr_list.length;
    var next_nums = 42 - prev_nums - curr_nums;

    this.pushMonthDateList(this.date_list, prev_list, prev_nums, 0, this.meta_list, 0);
    this.pushMonthDateList(this.date_list, curr_list, curr_nums, 1, this.meta_list, 1);
    this.pushMonthDateList(this.date_list, next_list, next_nums, 1, this.meta_list, 0);
};

/*
 * 取得输入月份从月初到月末的日期列表
 */
DateListHelper.prototype.getMonthDateList = function(_month){
    var year = _month[0];
    var month = _month[1];

    var month_days = this.getMonthDays(_month);

    var date_list = [];
    for(var i = 1; i <= month_days; i++){
        var date = new Date(year, month, i);
        date_list.push(date);
    }
    return date_list;
};

/*
 * 将日期以及冗余信息从源序列压入目标序列
 */
DateListHelper.prototype.pushMonthDateList = function(dest_list, origin_list, nums, direction, meta_list, meta){
    for(var i = 0; i < nums; i++){
        if(direction){
            dest_list.push(origin_list[i]);
        }else{
            dest_list.push(origin_list[origin_list.length - nums + i]);
        }
        meta_list.push(meta);
    }
};

DateListHelper.prototype.monthChange = function(type, _dest){
    var dest = [];
    if(!_dest){
        dest.push(this.curr_month[0]);
        dest.push(this.curr_month[1]);
    }else{
        dest = _dest;
    }
    switch(type){
        case -1:
            this.curr_month = this.getPrevMonth(this.curr_month);
            break;
        case 1:
            this.curr_month = this.getNextMonth(this.curr_month);
            break;
        case -2:
            this.curr_month[0] -= 1;
            break;
        case 2:
            this.curr_month[0] += 1;
            break;
        case 0:
            this.curr_month = dest;
            break;
        default:
            break;
    }
    this.refresh();
};

/*
 * DatesGrid用来描绘包含星期表头的日历
 */
function DatesGrid(helper, containerId){
    this.helper = helper;
	this.containerId = containerId;
    this.html = "";
    
    this.date_name = this.containerId + '-date';
}

DatesGrid.prototype.draw = function(){
    var _html = [];

    _html.push("<table id=\"grid\" cellspacing=\"0px\">");
    _html.push(this.drawTitle());
    _html.push(this.drawGrid());
    _html.push("</table>");

    this.html = _html.join("");
};

DatesGrid.prototype.drawGrid = function(){
    var grid = [];
    var label_list = [];
    var meta_list = [];
    var name_list = [];
    var data_list = [];

    for(var i = 0; i < this.helper.date_list.length; i++){
        var label = this.helper.date_list[i].getDate();
        var data_single = this.helper.date_list[i].format("yyyy-MM-dd");
        label_list.push(label);
        var meta = this.helper.meta_list[i];
        meta_list.push( meta ? " class=\"curr-month\" " : " class=\"non-curr-month\" ");
        name_list.push( meta ? " name=\"" + this.date_name + "\" " : "");
        data_list.push( meta ? " td_date='" + data_single + "'" : "");
    }

    grid.push("<tbody id=\"dates\">");
    var index = 0;
    for(var i=0; i < 6; i++){
        grid.push("<tr>");
        for(var j=0; j < 7; j++){

            var td = "<td" + meta_list[index] + name_list[index] + data_list[index] + ">" + String(label_list[index]) + "</td>";

            grid.push(td);
            index++;
        }
        grid.push("</tr>");
    }
    grid.push("</tbody>");

    return grid.join("");
};

DatesGrid.prototype.drawTitle = function(){
    var title = [];
    var title_label_list = [];

    for(var i=0; i<7; i++){
        title_label_list.push(Weekdays[Weekday_Order[i]]);
    }

    title.push("<thead id=\"date-title\"><tr>");
    for(var i=0; i<7; i++){
        var td = "<td class=\"td-date-title\">" + title_label_list[i] + "</td>";
        title.push(td);
    }
    title.push("</tr></thead>");

    return title.join("");
};


/*
 * CtrlTitle用来描绘含控制按钮以及当前月份显示的顶端部分
 */
function CtrlTitle(helper, containerId){
    this.helper = helper;
	this.containerId = containerId;
    this.html = "";
    
    this.btn_name = this.containerId + '-btn';
}

CtrlTitle.prototype.draw = function(){
    var _html = [];

    var name = " name=\"" + this.btn_name + "\" ";

    var back_year = "<td id=\"back-year\" class=\"ctrl\"" + name + "\">" + "<<"  + "</td>";
    var back_month = "<td id=\"back-month\" class=\"ctrl\"" + name + "\">" + "<" + "</td>";
    var forw_month = "<td id=\"forw-month\" class=\"ctrl\"" + name + "\">" + ">" + "</td>";
    var forw_year = "<td id=\"forw-year\" class=\"ctrl\""+ name + "\">" +">>" + "</td>";

    var year = this.helper.curr_month[0];
    var month = this.helper.curr_month[1];
    var month_label = Months[month];
    var year_label = String(year);
    var month_box = "<td id=\"month-box\" class=\"month-box\">" +
        month_label + "</td>";
    var year_box = "<td id=\"year-box\" class=\"year-box\">" +
        year_label + "</td>";

    _html.push("<table id=\"ctrl-title\" cellspacing=\"0px\"><tr>");
    _html.push(back_year);
    _html.push(back_month);
    _html.push(month_box);
    _html.push(year_box);
    _html.push(forw_month);
    _html.push(forw_year);
    _html.push("</tr></table>");

    this.html = _html.join("");
};

/*
 * Calendar构建
 */
function TicketCalendar(containerId, custom, year, month){
    this.html = "";
    this.containerId = containerId;
    this.helper = custom ? new DateListHelper(custom, year, month) : new DateListHelper();
    this.helper.initDateList();

	this.btn_name = this.containerId + '-btn';
	this.date_name = this.containerId + '-date';
    this.ctrl_title = new CtrlTitle(this.helper, this.containerId);
    this.dates_grid = new DatesGrid(this.helper, this.containerId);

    this.curr_month_date_elements = [];
    
	this.refresh();
}

TicketCalendar.prototype.refresh = function(){
	if(!this.containerId) return;
    this.draw();
    var calendar = document.getElementById(this.containerId);
    calendar.innerHTML = this.html;
    this.refreshCurrMonthElements();
    this.eventHndl();
};

TicketCalendar.prototype.draw = function(){
    var _html = [];

    this.ctrl_title.draw();
    this.dates_grid.draw();
    _html.push(this.ctrl_title.html);
    _html.push(this.dates_grid.html);

    this.html = _html.join("");
};

TicketCalendar.prototype.monthChange = function(type, dest){
    this.helper.monthChange(type, dest);
    this.refresh();
};

TicketCalendar.prototype.onClick = function(object){
    switch(object.id){
        case "back-year":
            this.monthChange(-2);
            break;
        case "back-month":
            this.monthChange(-1);
            break;
        case "forw-month":
            this.monthChange(1);
            break;
        case "forw-year":
            this.monthChange(2);
            break;
        default:
            this.extendOnClick(object);
            break;
    }
};

/*
 * 这是一个可以在click事件下进行额外扩展操作的函数。传入的object是当前发生click事件的对象。
 */
TicketCalendar.prototype.extendOnClick = function(object){
};


TicketCalendar.prototype.getClickables = function(){
    var clickables = [];

    var btns = document.getElementsByName(this.btn_name);
    var dates = document.getElementsByName(this.date_name);
    for(var i = 0; i< btns.length; i++)
        clickables.push(btns[i]);
    for(var j = 0; j < dates.length; j++)
        clickables.push(dates[j]);

    return clickables;
};

TicketCalendar.prototype.refreshCurrMonthElements = function(){
    this.curr_month_date_elements = [];
    this.curr_month_date_elements = document.getElementsByName(this.date_name);
    this.extendRefresh(this.curr_month_date_elements);
};

/*
 * 这是每次日历刷新后可以接收到当前所有日期元素序列的扩展函数。
 */
TicketCalendar.prototype.extendRefresh = function(date_list){
};

TicketCalendar.prototype.eventHndl = function(){
    var clickables = this.getClickables();
    var _calendar = this;
    for(var i=0; i < clickables.length; i++){
       var obj = clickables[i];
       obj.onclick = function(){
       	_calendar.onClick(this);
       };
    }

};