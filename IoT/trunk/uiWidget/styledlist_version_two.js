/*
var obj = {
	containerId:
	rows:
	columns:
	listType:
	totalCount:
	data: [[{label:
			},{label:
			},{label:
			}],
			[],
			[]]
	titles: [{label:
			},{label:
			},{label:
			}]
	styles:{
		borderColor:
		borderWidth:
		titleBg:
		titleColor
		cellBg:
		cellColor:
		footBg:
		footColor:
		titleHeight:
		cellHeight:
		iconColor:
		inputBg:
		inputBorder:
		columnsWidth:[]
	}
}
*/

function NewStyledListVersionTwo(obj){
  console.log(obj);
	var conf = obj;
	if(conf){
		this.container = conf.container;
		this.rowsLmt = conf.rows || 1;
		this.columnsLmt = conf.columns || 1;
		this.data = conf.data;
		this.titles = conf.titles;
		this.styles = conf.styles;
		this.listType = conf.listType || 0;
		this.totalCount = conf.totalCount || 0;
		this.updateTitle = conf.updateTitle || false;
		this.async = conf.async;
		this.tableBodyTdDiffStyles=conf.tableBodyTdDiffStyles || "";
	}
	if(this.container.length==0)
		return null;
	else
		this.init();
};

NewStyledListVersionTwo.prototype.init = function(){
	this.footLabels = {
		navPre: i18n('UIWIDGET_STYLEDLIST_ZHUANDAO'),
		navSuf: i18n('UIWIDGET_STYLEDLIST_YE'),
		totPre: i18n('UIWIDGET_STYLEDLIST_GONG')
	};
	this.currPage = 0;

	if(this.listType === 0)
		this.totalCount = this.data && this.data.length  || 0;

	this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
};

NewStyledListVersionTwo.prototype.create = function(){
	this.createList();
	var self = this;
	this.fillContent(function(){
		self.fillList();
	});
};

NewStyledListVersionTwo.prototype.getPageData = function(pageNumber, callback){
   
};

NewStyledListVersionTwo.prototype.onTotalCount = function(count){
    this.totalCount = Number(count);
    this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
};

NewStyledListVersionTwo.prototype.update = function(param){
	if(this.listType === 0){
		this.data = param;
		this.totalCount = this.data && this.data.length  || 0;
		this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
	}else{
		this.totalCount = param;
    	this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
	}
	this.currPage = 0;
	this.refreshList();
};

NewStyledListVersionTwo.prototype.fillContent = function(callback){
	this.currTop = this.currPage * this.rowsLmt;
	this.content = [];
	if(this.listType === 0){
		for(var i = 0; i < this.rowsLmt; i++){
			var dataItem = this.data[this.currTop + i];
			if(dataItem !== undefined && dataItem !== null)
				this.content.push(dataItem);
		}
		if(typeof callback == 'function'){
			callback();
		}
	} else if(this.async){
		var self = this;
		this.getPageData(this.currPage + 1, function(content){
			self.content = content;
			if(typeof callback === 'function'){
				callback();
			}
		});
	} else {
		this.content = this.getPageData(this.currPage + 1);
		if(typeof callback == 'function'){
			callback();
		}
	}
};

NewStyledListVersionTwo.prototype.createList = function(){
	var jqContainer = jQuery(this.container);
	if(jqContainer.length==0)
		return;

	jqContainer.empty();

	if(jqContainer.css('position') == 'static'){
		jqContainer.css({
			position: 'relative'
		});
	}

	var table = document.createElement('table');
	jqContainer.append(table);

	var jqTable = jQuery(table);
	jqTable.outerWidth(jqContainer.width()-1);
	jqTable.outerHeight(jqContainer.height()-1);
	jqTable.outerHeight(jqContainer.height()-1);
	this.addListHead(jqTable);
	this.addListBody(jqTable);
	this.addListFoot(jqTable);

	this.setStyles(jqTable);

	this.jqTable = jqTable;
};

NewStyledListVersionTwo.prototype.fillList = function(){
	this.fillListHead();
	this.fillListBody();
	this.fillListFoot();
};

NewStyledListVersionTwo.prototype.addListHead = function(jqTable){
	var thead = document.createElement('thead');
	jqTable.append(thead);
	var jqThead = jQuery(thead);
	for(var i = 0; i < this.columnsLmt; i++){
		var td = document.createElement('td');
		jqThead.append(td);
	}
};

NewStyledListVersionTwo.prototype.fillListHead = function(){
	var self = this;
	this.jqTable.find('thead td').each(function(index, item){
		var titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
		if(titleCellContent !== undefined && titleCellContent !== null)
			item.innerHTML = titleCellContent;
	});
};

NewStyledListVersionTwo.prototype.addListBody = function(jqTable){
	var tbody = document.createElement('tbody');
	jqTable.append(tbody);
	var jqTbody = jQuery(tbody);
	for(var i = 0; i < this.rowsLmt; i++){
		var row = document.createElement('tr');
		jqTbody.append(row);
		var jqRow = jQuery(row);
		for(var j = 0; j < this.columnsLmt; j++){
			var td = document.createElement('td');
			jqRow.append(td);
		}
	}
};

NewStyledListVersionTwo.prototype.fillListBody = function(){
	var self = this;
	var mainBody = this.jqTable[0].children[1];
	jQuery(mainBody).children('tr').each(function(index, item){
		jQuery(item).children('td').each(function(tdIndex, tdItem){
			if((self.tableBodyTdDiffStyles!="")&&(self.tableBodyTdDiffStyles.column)&&(jQuery.inArray(tdIndex+1,self.tableBodyTdDiffStyles.column)!=-1)&&(self.tableBodyTdDiffStyles.className)){
			  var currentTdIndex=jQuery.inArray(tdIndex+1,self.tableBodyTdDiffStyles.column);
				jQuery(this).removeClass("table_td_basic").addClass(self.tableBodyTdDiffStyles.className[currentTdIndex])
			}
			var bodyCellContent = self.content && self.content[index]
				&& self.content[index][tdIndex] && self.content[index][tdIndex].label;
			if(bodyCellContent !== undefined && bodyCellContent !== null)
				tdItem.innerHTML = bodyCellContent;
			else
				tdItem.innerHTML = '';
		});
	});
};

NewStyledListVersionTwo.prototype.addListFoot = function(jqTable){
	var tfoot = document.createElement('tfoot');
	var row = document.createElement('tr');
	var td = document.createElement('td');

	jQuery(td).attr('colspan', this.columnsLmt);
	jQuery(row).append(td);
	jQuery(tfoot).append(row);
	jqTable.append(tfoot);

	var inputBorder = this.styles && this.styles.inputBorder || '1px solid';
	var inputBg = this.styles && this.styles.inputBg || 'white';
	var inputWidth = this.styles && this.styles.inputWidth || '40px';
	var inputHeight = this.styles && this.styles.inputHeight || '20px';
	var inputAlign = this.styles && this.styles.inputAlign || 'center';
	var innerTable = '<table cellspacing="7" class=\"table_foot_table\"><tbody><tr><td styledlistfunc="beginPage" class="table_foot_ele_basic table_foot_border_and_font" style="width:43px">'+i18n('UIWIDGET_STYLEDLIST_SHOUYE')+'</td>';
	innerTable=innerTable	+ '<td styledlistfunc="prevPage" class="table_foot_ele_basic table_foot_border_and_font" style="width:55pxs">'
		+ this.getPrevIcon()
		+ '</td><td style="width:26px;background-color:#fe931f;color:#ffffff" styledlistfunc="curPage">'
		+ '</td><td styledlistfunc="nextPage" class="table_foot_ele_basic table_foot_border_and_font" style="width:55px">'
		+ this.getNextIcon()
		+ '</td><td styledlistfunc="endPage" class="table_foot_ele_basic table_foot_border_and_font" style="width:42px">'+i18n('UIWIDGET_STYLEDLIST_WEIYE')+'</td>'
		+ '<td class="table_foot_ele_basic" style="width:20px;color:#777777">'
		+ this.footLabels.totPre + '</td><td style="color:#777777" styledlistfunc="totPage">'
		+ '</td><td style="color:#777777"><div style="margin-left:-6px;">'+i18n('UIWIDGET_STYLEDLIST_YE')+'/</div></td><td style="color:#777777" styledlistfunc="totCount">'
		+ '</td><td style="color:#777777" >'
		+ this.footLabels.navPre + '</td><td style="color:#777777" >'
		+ '<input type="text" styledlistfunc="navInput" style="text-align:'
		+ inputAlign +';width:'
		+ inputWidth + ';height:' + inputHeight + ';color:inherit;background-color:'
		+ inputBg + ';border:' + inputBorder + ';"/>'
		+ '</td><td style="color:#777777" >'
		+ this.footLabels.navSuf + '</td><td></tr></tbody></table>';
	jQuery(td).append(innerTable);
	jQuery(td.children[0]).css({
		display: 'inline-table'
	});

	var self = this;
	jQuery(tfoot).find('td [styledlistfunc="prevPage"]').click(function(){
		self.changePage(-1);
	});
	jQuery(tfoot).find('td [styledlistfunc="nextPage"]').click(function(){
		self.changePage(1);
	});
	jQuery(tfoot).find('td [styledlistfunc="beginPage"]').click(function(){
	  if((self.pagesLmt)>1&&(self.currPage!=0)){
			self.currPage=0;
			self.refreshList();
		}
	});
	jQuery(tfoot).find('td [styledlistfunc="endPage"]').click(function(){
		if((self.pagesLmt)>(self.currPage + 1)){
			self.currPage=(self.pagesLmt - 1);
			self.refreshList();
		}
	});
	jQuery(tfoot).find('input').change(function(){
		var pageNumber = jQuery(this).val();
		self.changePage(pageNumber);
	});
};

NewStyledListVersionTwo.prototype.fillListFoot = function(){
	var self = this;
	var commonStyle="height:25px;line-height:25px;";
	this.jqTable.find('tfoot td[styledlistfunc="curPage"]')[0].innerHTML = this.currPage + 1;
	this.jqTable.find('tfoot td[styledlistfunc="totPage"]')[0].innerHTML = "<div style=\"margin-left:-6px;"+commonStyle+"\">"+this.pagesLmt+"</div>";
	var totalCount=this.totalCount+i18n('UIWIDGET_STYLEDLIST_SHUJU');
	this.jqTable.find('tfoot td[styledlistfunc="totCount"]')[0].innerHTML = "<div style=\"margin-left:-7px;"+commonStyle+"\">"+totalCount+"</div>";
	this.jqTable.find('tfoot input[styledlistfunc="navInput"]').val(this.currPage + 1);
	var beforeColor=((self.pagesLmt)>1&&(self.currPage!=0))?"#777777":"#e0e0e0";
	var beginCursorStyle=((self.pagesLmt)>1&&(self.currPage!=0))?"pointer":"default";
	var endColor=((self.pagesLmt)>(self.currPage + 1))?"#777777":"#e0e0e0";
	var endCursorStyle=((self.pagesLmt)>(self.currPage + 1))?"pointer":"default";
	self.jqTable.find('tfoot td[styledlistfunc="beginPage"],tfoot td[styledlistfunc="prevPage"]').css({"color":beforeColor,"cursor":beginCursorStyle});
	self.jqTable.find('tfoot td[styledlistfunc="nextPage"],tfoot td[styledlistfunc="endPage"]').css({"color":endColor,"cursor":endCursorStyle});
  this.jqTable.find('tfoot table').css("visibility","visible");
};

NewStyledListVersionTwo.prototype.getPrevIcon = function(){
	var prevPageIcon=i18n('UIWIDGET_STYLEDLIST_SHANGYIYE');
	return prevPageIcon;
};

NewStyledListVersionTwo.prototype.getNextIcon = function(){
	var nextPageIcon=i18n('UIWIDGET_STYLEDLIST_XIAYIYE');
	return nextPageIcon;
};

NewStyledListVersionTwo.prototype.setStyles = function(jqTable){
	var cellspacing = this.styles && this.styles.borderWidth || 1;
	var bgColor = this.styles && this.styles.borderColor || 'black';
	jqTable.attr('cellspacing', cellspacing);
	jqTable.css({
		backgroundColor: bgColor,
		tableLayout: 'fixed'
	});

	var titleBg = this.styles && this.styles.titleBg || 'white';
	var titleColor = this.styles && this.styles.titleColor || 'black';
	var cellBg = this.styles && this.styles.cellBg || 'white';
	var cellColor = this.styles && this.styles.cellColor || 'black';
	var footBg = this.styles && this.styles.footBg || 'white';
	var footColor = this.styles && this.styles.footColor || 'black';

	var evenBg = this.styles && this.styles.evenBg;
	var oddBg = this.styles && this.styles.oddBg;

	var titleHeight = this.styles && this.styles.titleHeight || 40;
	var cellHeight = this.styles && this.styles.cellHeight;

	if(!cellHeight){
		var footHeight = 40;
		cellspacing = Number(cellspacing);
		var headHeight = titleHeight + 2 * cellspacing;
		footHeight += 2 * cellspacing;
		cellHeight = Math.floor((jqTable.height() - headHeight - footHeight - (this.rowsLmt - 1) * cellspacing)/this.rowsLmt - 2 * cellspacing);
	}

	var columnsWidth = this.styles && this.styles.columnsWidth;
	var columnsMinWidth = this.styles && this.styles.columnsMinWidth;
	var ifColumnsWidthAll = this.styles && this.styles.ifColumnsWidthAll;
	
	jqTable.find('thead td').css({
		color: titleColor,
		backgroundColor: titleBg,
		fontWeight: 'bold',
	}).addClass("table_td_basic").height(titleHeight);

	var self = this;
	var jqTableWidth = jqTable.width();
	if(columnsWidth && columnsWidth.length)
		jqTable.find('thead td').each(function(index, item){
			if(!ifColumnsWidthAll){
				if(index >= self.columnsLmt - 1){
					return;
				}
			}
			var itemWidth;
			if(!isNaN(Number(columnsWidth[index]))){
				itemWidth = Math.round(jqTableWidth * columnsWidth[index]);
			}
			if(!isNaN(Number(columnsMinWidth && columnsMinWidth[index]))){
				var minWidth = columnsMinWidth[index];
				if(typeof itemWidth == 'undefined' || itemWidth < minWidth){
					itemWidth = minWidth;
				}
			}
			if(typeof itemWidth != 'undefined'){
				jQuery(item).width(itemWidth);
			}
		});

	var mainBody = jqTable[0].children[1];
	var tmpJQMB = jQuery(mainBody);
	tmpJQMB.find('td').css({
		color: cellColor,
	  'position': 'relative'
	}).addClass("table_td_basic").height(cellHeight);

	tmpJQMB.find('tr:nth-child(2n-1) td').css({
		backgroundColor: (oddBg ? oddBg: cellBg)
	});

	tmpJQMB.find('tr:nth-child(2n) td').css({
		backgroundColor: (evenBg ? evenBg: cellBg)
	});

	var foot = jqTable[0].children[2];
	jQuery(foot).find('td').each(function(index){
		var position=((index==0||index==6)?"right":"center");
		var footBg_currentTd="";
		if(jQuery(this).attr("styledlistfunc")=="curPage"){
			footBg_currentTd="fe931f"
		}
		else{
			footBg_currentTd=footBg;
		}
		jQuery(this).css({
			backgroundColor: footBg_currentTd,
			textAlign: position
		});
	})
};

NewStyledListVersionTwo.prototype.changePage = function(changeType){
	var prevPage = this.currPage;
	switch(changeType){
		case -1:
			this.currPage = Math.max(0, this.currPage - 1);
			break;
		case 1:
			this.currPage = Math.max(0, Math.min(this.currPage + 1, this.pagesLmt - 1));
			break;
		default:
			var pageNumber = parseInt(changeType,10);
			if(isNaN(pageNumber))
				return;
			this.currPage = Math.max(0, Math.min(pageNumber - 1, this.pagesLmt - 1));
			break;
	}
	if(prevPage != this.currPage)
		this.refreshList();
};

NewStyledListVersionTwo.prototype.refreshList = function(){
	var self = this;
	this.fillContent(function(){
		if(self.updateTitle){
			self.fillListHead();
		}
		self.fillListBody();
		self.fillListFoot();
	});
};

NewStyledListVersionTwo.prototype.updateInPage = function(data){
	//update list for type 0, keeping currPage.
	if(this.listType === 0){
		this.data = data;
		this.totalCount = this.data && this.data.length  || 0;
		this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
		this.currPage = Math.max(0,Math.min(this.currPage, this.pagesLmt - 1));
		this.refreshList();
	}
};

NewStyledListVersionTwo.prototype.resize = function(){
    this.createList();
    this.fillList();
};
