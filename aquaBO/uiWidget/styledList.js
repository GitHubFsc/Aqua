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

function StyledList(obj){
	var conf = obj;
	if(conf){
		this.containerId = conf.containerId;
		this.rowsLmt = conf.rows || 1;
		this.columnsLmt = conf.columns || 1;
		this.data = conf.data;
		this.titles = conf.titles;
		this.styles = conf.styles;
		this.listType = conf.listType || 0;
		this.totalCount = conf.totalCount || 0;
		this.updateTitle = conf.updateTitle || false;
		this.async = conf.async;
	}
	if(!this.containerId)
		return null;
	else
		this.init();
};

StyledList.prototype.init = function(){
	this.footLabels = {
		navPre: '转到第',
		navSuf: '页，',
		curPre: '当前第',
		curSuf: '页，',
		totPre: '共',
		totSuf: '页，',
		totLSuf: '行'
	};
	this.currPage = 0;

	if(this.listType === 0)
		this.totalCount = this.data && this.data.length  || 0;

	this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
};

StyledList.prototype.create = function(){
	this.createList();
	var self = this;
	this.fillContent(function(){
		self.fillList();
	});
};

StyledList.prototype.getPageData = function(pageNumber, callback){

};

StyledList.prototype.onTotalCount = function(count){
    this.totalCount = Number(count);
    this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
};

StyledList.prototype.update = function(param){
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

StyledList.prototype.fillContent = function(callback){
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

StyledList.prototype.createList = function(){
	var container = document.getElementById(this.containerId);
	if(!container)
		return;

	var jqContainer = jQuery(container);

	jqContainer.empty();

	if(jqContainer.css('position') == 'static'){
		jqContainer.css({
			position: 'relative'
		});
	}

	var table = document.createElement('table');
	jqContainer.append(table);

	var jqTable = jQuery(table);
	jqTable.outerWidth(jqContainer.width());
	jqTable.outerHeight(jqContainer.height());

	this.addListHead(jqTable);
	this.addListBody(jqTable);
	this.addListFoot(jqTable);

	this.setStyles(jqTable);

	this.jqTable = jqTable;
};

StyledList.prototype.fillList = function(){
	this.fillListHead();
	this.fillListBody();
	this.fillListFoot();
};

StyledList.prototype.addListHead = function(jqTable){
	var thead = document.createElement('thead');
	jqTable.append(thead);
	var jqThead = jQuery(thead);
	for(var i = 0; i < this.columnsLmt; i++){
		var td = document.createElement('td');
		jqThead.append(td);
	}
};

StyledList.prototype.fillListHead = function(){
	var self = this;
	this.jqTable.find('thead td').each(function(index, item){
		var titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
		if(titleCellContent !== undefined && titleCellContent !== null)
			item.innerHTML = titleCellContent;
	});
};

StyledList.prototype.addListBody = function(jqTable){
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

StyledList.prototype.fillListBody = function(){
	var self = this;
	var mainBody = this.jqTable[0].children[1];
	jQuery(mainBody).children('tr').each(function(index, item){
		jQuery(item).children('td').each(function(tdIndex, tdItem){
			var bodyCellContent = self.content && self.content[index]
				&& self.content[index][tdIndex] && self.content[index][tdIndex].label;
			if(bodyCellContent !== undefined && bodyCellContent !== null)
				tdItem.innerHTML = bodyCellContent;
			else
				tdItem.innerHTML = '';
		});
	});
};

StyledList.prototype.addListFoot = function(jqTable){
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
	var inputAlign = this.styles && this.styles.inputAlign || 'right';

	var innerTable = '<table><tbody><tr><td>'
		+ this.footLabels.navPre + '</td><td>'
		+ '<input type="text" styledlistfunc="navInput" style="margin-left:3px;margin-right:3px;text-align:'
		+ inputAlign +';width:'
		+ inputWidth + ';height:' + inputHeight + ';color:inherit;background-color:'
		+ inputBg + ';border:' + inputBorder + ';"/>'
		+ '</td><td>'
		+ this.footLabels.navSuf + '</td><td>'
		+ this.footLabels.curPre + '</td><td styledlistfunc="curPage">'
		+ '</td><td>'
		+ this.footLabels.curSuf + '</td><td>'
		+ this.footLabels.totPre + '</td><td styledlistfunc="totPage">'
		+ '</td><td>'
		+ this.footLabels.totSuf + '</td><td>'
		+ this.footLabels.totPre + '</td><td styledlistfunc="totLine">'
		+ '</td><td>'
		+ this.footLabels.totLSuf + '</td><td style="width:5px;">'
		+ '</td><td styledlistfunc="prevPage" style="cursor:pointer;">'
		+ this.getPrevIcon()
		+ '</td><td style="width:5px;"></td><td styledlistfunc="nextPage" style="cursor:pointer;">'
		+ this.getNextIcon()
		+ '</td><td style="width:5px;"></td></tr></tbody></table>';
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
	jQuery(tfoot).find('input').change(function(){
		var pageNumber = jQuery(this).val();
		self.changePage(pageNumber);
	});
};

StyledList.prototype.fillListFoot = function(){
	var self = this;
	this.jqTable.find('tfoot td[styledlistfunc="curPage"]')[0].innerHTML = this.currPage + 1;
	this.jqTable.find('tfoot td[styledlistfunc="totPage"]')[0].innerHTML = this.pagesLmt;
	this.jqTable.find('tfoot td[styledlistfunc="totLine"]')[0].innerHTML = this.totalCount;
	this.jqTable.find('tfoot input[styledlistfunc="navInput"]').val(this.currPage + 1);
};

StyledList.prototype.getPrevIcon = function(){
	var iconColor = this.styles && this.styles.iconColor || 'black';

	var _icon = '<svg width="16" height="16">'
		+ '<rect width="16" height="16" style="fill:' + iconColor + '"/>'
		+ '<polygon points="11,4 4,8 11,12" style="fill:#ffffff"/>'
		+ '</svg>';
	return _icon;
};

StyledList.prototype.getNextIcon = function(){
	var iconColor = this.styles && this.styles.iconColor || 'black';

	var _icon = '<svg width="16" height="16">'
		+ '<rect width="16" height="16" style="fill:' + iconColor + '"/>'
		+ '<polygon points="5,4 12,8 5,12" style="fill:#ffffff"/>'
		+ '</svg>';
	return _icon;
};

StyledList.prototype.setStyles = function(jqTable){
	var cellspacing = this.styles && this.styles.borderWidth || 1;
	var bgColor = this.styles && this.styles.borderColor || 'black';
	jqTable.attr('cellspacing', cellspacing);
	jqTable.attr('cellpadding', 0);
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
		// var headHeight = titleHeight + 2 * cellspacing;
		// footHeight += 2 * cellspacing;
		cellHeight = Math.floor((jqTable.height() - titleHeight - footHeight - (this.rowsLmt + 3) * cellspacing)/this.rowsLmt);
	}

	var columnsWidth = this.styles && this.styles.columnsWidth;

	jqTable.find('thead td').css({
		color: titleColor,
		backgroundColor: titleBg,
		textAlign: 'center',
		overflow: 'hidden',
		fontWeight: 'bold',
		'word-break': 'keep-all',
		'white-space': 'nowrap',
		'text-overflow': 'ellipsis'
	}).height(titleHeight);

	var self = this;
	if(columnsWidth && columnsWidth.length)
		jqTable.find('thead td').each(function(index, item){
			if(index < self.columnsLmt - 1 && columnsWidth[index]){
				var itemWidth = Math.round(jqTable.width() * columnsWidth[index]);
				jQuery(item).width(itemWidth);
			}
		});

	var mainBody = jqTable[0].children[1];
	var tmpJQMB = jQuery(mainBody);
	tmpJQMB.find('td').css({
		color: cellColor,
		textAlign: 'center',
		overflow: 'hidden',
		'word-break': 'keep-all',
		'white-space': 'nowrap',
		'text-overflow': 'ellipsis',
	    'position': 'relative'
	}).height(cellHeight);

	tmpJQMB.find('tr:nth-child(2n-1) td').css({
		backgroundColor: (oddBg ? oddBg: cellBg)
	});

	tmpJQMB.find('tr:nth-child(2n) td').css({
		backgroundColor: (evenBg ? evenBg: cellBg)
	});

	var foot = jqTable[0].children[2];
	jQuery(foot).find('td').css({
		color: footColor,
		backgroundColor: footBg,
		textAlign: 'right',
		overflow: 'hidden',
		'word-break': 'keep-all',
		'white-space': 'nowrap',
		'text-overflow': 'ellipsis'
	});
};

StyledList.prototype.changePage = function(changeType){
	var prevPage = this.currPage;
	switch(changeType){
		case -1:
			this.currPage = Math.max(0, this.currPage - 1);
			break;
		case 1:
			this.currPage = Math.max(0, Math.min(this.currPage + 1, this.pagesLmt - 1));
			break;
		default:
			var pageNumber = parseInt(changeType, 10);
			if(isNaN(pageNumber))
				return;
			this.currPage = Math.max(0, Math.min(pageNumber - 1, this.pagesLmt - 1));
			break;
	}
	if(prevPage != this.currPage)
		this.refreshList();
};

StyledList.prototype.refreshList = function(){
	var self = this;
	this.fillContent(function(){
		if(self.updateTitle){
			self.fillListHead();
		}
		self.fillListBody();
		self.fillListFoot();
	});
};

StyledList.prototype.updateInPage = function(data){
	//Same length of Data
	if(this.listType === 0){
		this.data = data;
		this.fillContent();
		this.fillListBody();
	}
};

StyledList.prototype.resize = function(){
    this.createList();
    this.fillList();
};
