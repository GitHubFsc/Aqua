/*
var conf = {
	container:
	rows:
	columns:
	listType:
	totalCount:
	data: [[{label:},{label:},{label:}],[],[]]
	titles: [{label:},{label:},{label:}]
	styles: {
		columnsWidth: [0.1,0.2]
	}
}
*/

function StyleableList(conf){
	if(conf != null){
		this.container = conf.container;
		this.rowsLmt = conf.rows || 1;
		this.columnsLmt = conf.columns || 1;
		this.data = conf.data;
		this.titles = conf.titles;
		this.listType = conf.listType || 0;
		this.totalCount = conf.totalCount || 0;
		this.updateTitle = conf.updateTitle || false;
		this.async = conf.async;
		this.styles = conf.styles || {};
	}
	if(this.container != null){
		this.init();
	} else {
		return null;
	}
};

StyleableList.prototype.init = function(){
	this.labels = {
		firstPage: i18n('StyleableList_firstPage'),
		prevPage: i18n('StyleableList_prevPage'),
		nextPage: i18n('StyleableList_nextPage'),
		lastPage: i18n('StyleableList_lastPage')
	};
	this.templates = {
		totals: i18n('StyleableList_templateTotal'),
		turnPage: i18n('StyleableList_templateTurnPage')
	}
	this.currPage = 0;

	if(this.listType === 0){
		this.totalCount = this.data && this.data.length  || 0;
	}

	this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);

	this.$root = jQuery(this.container);
};

StyleableList.prototype.create = function(){
	var self = this;
	this.createList();
	this.fillContent(function(){
		self.fillListHead();
		self.fillListBody();
		self.updateControls();
	});
};

StyleableList.prototype.getPageData = function(pageNumber, callback){
};

StyleableList.prototype.onTotalCount = function(count){
	this.totalCount = Number(count);
	this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
};

StyleableList.prototype.update = function(param){
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

StyleableList.prototype.fillContent = function(callback){
	var self = this;
	this.currTop = this.currPage * this.rowsLmt;
	this.content = [];
	if(this.listType === 0){
		for(var i = 0; i < this.rowsLmt; i++){
			var dataItem = this.data[this.currTop + i];
			if(dataItem != null){
				this.content.push(dataItem);
			}
		}
		if(typeof callback == 'function'){
			callback();
		}
	} else if(this.async){
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

StyleableList.prototype.createList = function(){
	var _this = this;
	var frag = document.createDocumentFragment();
	var jqTable = jQuery('<table>')
		.addClass('styleable_list').appendTo(frag);

	this.addListHead(jqTable);
	this.addListBody(jqTable);

	this.$controls = this.addListControl(frag);
	this.$table = jqTable;
	this.$root.empty().append(frag);

	this.$controls.on('click', '.styleable_list_btn_active', function(){
		var nav = jQuery(this).attr('nav-func');
		var num = null;
		switch(nav){
		case 'first':
			num = '1';
			break;
		case 'last':
			num = String(_this.pagesLmt);
			break;
		case 'prev':
			num = -1;
			break;
		case 'next':
			num = 1;
			break;
		default:
			break;
		}
		if(num != null){
			_this.changePage(num);
		}
	}).on('keyup', '.styleable_list_turn_input', function(e){
		if(e.keyCode == 13 || e.which == 13){
			var val = jQuery(this).val();
			_this.changePage(val);
		}
	});

};

StyleableList.prototype.addListHead = function(jqTable){
	var jqThead = jQuery('<thead>')
		.appendTo(jqTable);
	var $hr = jQuery('<tr>').addClass('styleable_list_title').appendTo(jqThead)
	for(var i = 0; i < this.columnsLmt; i++){
		var $ht = jQuery('<td>').addClass('styleable_list_col').appendTo($hr);
		var w = this.styles.columnsWidth != null ? this.styles.columnsWidth[i] : null;
		var ws = null;
		if(typeof w == 'number'){
			ws = (w * 100) + '%';
		} else if(w != null){
			ws = w;
		}
		if(ws != null){
			$ht.css('width', ws);
		}
	}
};

StyleableList.prototype.fillListHead = function(){
	var self = this;
	this.$table.find('.styleable_list_title>.styleable_list_col').each(function(index, item){
		var $item = jQuery(item);
		$item.empty();
		var label = self.titles && self.titles[index] && self.titles[index].label;
		if(typeof label == 'function'){
			$item.append(label());
		} else if(label != null) {
			$item.append(label);
		}
	});
};

StyleableList.prototype.addListBody = function(jqTable){
	var jqTbody = jQuery('<tbody>').appendTo(jqTable);
	for(var i = 0; i < this.rowsLmt; i++){
		var jqRow = jQuery('<tr>').appendTo(jqTbody)
			.addClass('styleable_list_row');
		for(var j = 0; j < this.columnsLmt; j++){
			jQuery('<td>').addClass('styleable_list_col').appendTo(jqRow);
		}
	}
};

StyleableList.prototype.fillListBody = function(){
	var self = this;
	var $body = this.$table.children('tbody');
	$body.children('tr').each(function(index, item){
		jQuery(item).children('td').each(function(tdIndex, tdItem){
			var $cell = jQuery(tdItem);
			$cell.empty();
			var label = self.content && self.content[index]
				&& self.content[index][tdIndex] && self.content[index][tdIndex].label;
			if(typeof label == 'function'){
				$cell.append(label());
			} else if(label != null){
				$cell.append(label);
			}
		});
	});
};

StyleableList.prototype.addListControl = function(frag){
	var self = this;
	var $ = jQuery;

	var $controls = $('<div>').addClass('styleable_list_controls')
		.appendTo(frag);

	var $first = $('<div>').addClass('styleable_list_control_btn')
		.attr('nav-func', 'first')
		.append(this.labels.firstPage)
		.appendTo($controls);
	var $prev = $('<div>').addClass('styleable_list_control_btn')
		.attr('nav-func', 'prev')
		.append(this.labels.prevPage)
		.appendTo($controls);

	var $currPage = $('<div>').addClass('styleable_list_control_currpage')
		.appendTo($controls);

	var $next = $('<div>').addClass('styleable_list_control_btn')
		.attr('nav-func', 'next')
		.append(this.labels.nextPage)
		.appendTo($controls);
	var $last = $('<div>').addClass('styleable_list_control_btn')
		.attr('nav-func', 'last')
		.append(this.labels.lastPage)
		.appendTo($controls);

	var totals = this.templates.totals.replace('{totalPage}', '<span class="styleable_list_total_page"></span>')
		.replace('{totalCount}', '<span class="styleable_list_total_count"></span>');
	var $totals = $('<div>').addClass('styleable_list_totals')
		.append(totals)
		.appendTo($controls);
	var turnPage = this.templates.turnPage.replace('{pageNo}', '<input class="styleable_list_turn_input"/>');
	var $turn = $('<div>').addClass('styleable_list_turnpage')
		.append(turnPage)
		.appendTo($controls);

	return $controls;
};

StyleableList.prototype.updateControls = function(){
	var $first = this.$controls.find('.styleable_list_control_btn[nav-func=first]')
	var $prev = this.$controls.find('.styleable_list_control_btn[nav-func=prev]');
	var $next = this.$controls.find('.styleable_list_control_btn[nav-func=next]');
	var $last = this.$controls.find('.styleable_list_control_btn[nav-func=last]');
	if(this.currPage == 0){
		$first.removeClass('styleable_list_btn_active');
		$prev.removeClass('styleable_list_btn_active');
	} else {
		$first.addClass('styleable_list_btn_active');
		$prev.addClass('styleable_list_btn_active');
	}
	if(this.pagesLmt > 0 && this.currPage == this.pagesLmt - 1){
		$next.removeClass('styleable_list_btn_active');
		$last.removeClass('styleable_list_btn_active');
	} else if(this.pagesLmt > 0){
		$next.addClass('styleable_list_btn_active');
		$last.addClass('styleable_list_btn_active');
	} else {
		$next.removeClass('styleable_list_btn_active');
		$last.removeClass('styleable_list_btn_active');
	}
	this.$controls.find('.styleable_list_control_currpage').text(this.currPage + 1);
	this.$controls.find('.styleable_list_total_page').text(this.pagesLmt);
	var totalNum = this.totalCount;
	if(typeof this.getCustomTotal == 'function'){
		totalNum = this.getCustomTotal();
	}
	this.$controls.find('.styleable_list_total_count').text(totalNum);
};

StyleableList.prototype.changePage = function(changeType){
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
	if(prevPage != this.currPage){
		this.refreshList();
	}
};

StyleableList.prototype.refreshList = function(){
	var self = this;
	this.fillContent(function(){
		if(self.updateTitle){
			self.fillListHead();
		}
		self.fillListBody();
		self.updateControls();
	});
};

StyleableList.prototype.updateInPage = function(data){
	//update list for type 0, keeping currPage.
	if(this.listType === 0){
		this.data = data;
		this.totalCount = this.data && this.data.length  || 0;
		this.pagesLmt = Math.ceil(this.totalCount/this.rowsLmt);
		this.currPage = Math.max(0,Math.min(this.currPage, this.pagesLmt - 1));
		this.refreshList();
	}
};
