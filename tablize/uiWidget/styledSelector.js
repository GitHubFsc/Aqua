function StyledSelector(obj){
	if(obj){
		this.containerId = obj.containerId;
		this.selectables = obj.options;
		this.styles = obj.styles;
		this.placeholder = obj.placeholder;
		this.maxDropRows = obj.maxDrops || 10;
	}

	this.init();
};

StyledSelector.prototype.init = function(){
	this.lvPairs = {};
	this.vlPairs = {};

	var lmt = this.selectables && this.selectables.length || 0;
	for(var i = 0; i < lmt; i++){
		var option = this.selectables[i];
		var label = option.label;
		var value = option.value;
		this.lvPairs[label] = value;
		this.vlPairs[value] = label;
	}
};

StyledSelector.prototype.create = function(){
	var container = document.getElementById(this.containerId);
	if(!container)
		return;

	this._dhCont = document.getElementById(this.containerId);
	if(this._dhCont && window.dropdownHelper){
		window.dropdownHelper.addDropdownHandler(this);
	}

	var jqContainer = jQuery(container);
	if(jqContainer.css('position') == 'static')
		jqContainer.css({
			position: 'relative'
		});

	jqContainer.empty();
	this.addSelectorInput(jqContainer);
	this.addSelectorIcon(jqContainer);
	this.addSelectorDropBox(jqContainer);
	this.createOptionTable();
	var cntWidth = jqContainer.width();
	if(this.jqDropBox.outerWidth() < cntWidth){
		this.jqDropBox.outerWidth(cntWidth);
	}

	if(this.placeholder){
		this.jqSelInput.val(this.placeholder);
	}else if(typeof this.value !== 'undefined'){
		this.setValue(this.value);
	}else if(this.selectables && this.selectables[0]){
		this.setValue(this.selectables[0].value);
	}else{
		this.setValue('');
	}

	return this;
};

StyledSelector.prototype.addSelectorInput = function(jqContainer){
	var cntHeight = jqContainer.height();
	var cntWidth = jqContainer.width();

	var selInput = document.createElement('input');
	selInput.type = 'text';
	selInput.className = 'styled-selector-inputbox';
	jqContainer.append(selInput);

	var jqSelInput = jQuery(selInput);
	jqSelInput.attr({
		readonly: true
	}).css({
		position: 'absolute',
		cursor: 'default',
		left: 0,
		top: 0
	}).outerWidth(cntWidth).outerHeight(cntHeight);

	var self = this;
	jqSelInput.click(function(){
		if(self.droped)
			self.hideDropBox();
		else
			self.showDropBox();
	});

	this.jqSelInput = jqSelInput;
};

StyledSelector.prototype.addSelectorIcon = function(jqContainer){
	var cntHeight = jqContainer.height();
	var cntWidth = jqContainer.width();
	var iconSize = this.styles && this.styles.iconSize;

	var dropIcon = document.createElement('div');
	dropIcon.className = 'styled-selector-dropicon';
	jqContainer.append(dropIcon);

	var jqDropIcon = jQuery(dropIcon);
	jqDropIcon.append(this.getOpenIcon());
	var iconWidth = jqDropIcon.width() || iconSize;
	var iconHeight = jqDropIcon.height() || iconSize;
	var iconTop = Math.floor((cntHeight - iconHeight)/2);
	jqDropIcon.css({
		position: 'absolute',
		right: 8,
		top: iconTop,
		cursor: 'default'
	});

	var self = this;
	jqDropIcon.bind('click', document.getElementById(this.containerId), function(ev){
	    ev.originalEvent = ev.originalEvent || {};
	    ev.originalEvent.dropdownDelegate = ev.data;
		if(self.droped)
			self.hideDropBox();
		else
			self.showDropBox();
	});

	this.jqDropIcon = jqDropIcon;
};

StyledSelector.prototype.addSelectorDropBox = function(jqContainer){
	var cntHeight = jqContainer.height();
	var cntWidth = jqContainer.width();

	var optionHeight = this.styles && this.styles.optionHeight || 16;
	var optionsNum = this.selectables && this.selectables.length || 0;
	var dropBoxHeight = Math.ceil(optionHeight * this.maxDropRows);
	if(optionsNum < this.maxDropRows)
		dropBoxHeight = Math.ceil(optionHeight * optionsNum);

	var dropBox = document.createElement('div');
	dropBox.className = 'styled-selector-dropbox';
	jqContainer.append(dropBox);

	var jqDropBox = jQuery(dropBox);
	jqDropBox.hide();
	jqDropBox.css({
		position: 'absolute',
		'overflow-x': 'hidden',
		'overflow-y': 'auto',
		color: 'inherit',
		top: cntHeight,
		backgroundColor: 'inherit'
	});

	// jqDropBox.outerWidth(cntWidth).height(dropBoxHeight);
	jqDropBox.height(dropBoxHeight);

	this.jqDropBox = jqDropBox;
};

StyledSelector.prototype.createOptionTable = function(){
	var optionTable = document.createElement('table');
	var jqTable = jQuery(optionTable);
	jqTable.css({
		color: 'inherit',
		width: '100%'
	}).attr({
		cellspacing: 0,
		cellpadding: 0
	});

	var optionHeight = this.styles && this.styles.optionHeight || 16;
	var self = this;

	for(var i = 0; i < this.selectables.length; i++){
		var item = this.selectables[i];

		var optionRow = document.createElement('tr');
		jqTable.append(optionRow);

		var optionTd = document.createElement('td');
		var jqTd = jQuery(optionTd);
		jqTd.attr('title', item.label);
		jqTd.append(item.label).css({
			'word-break': 'keep-all',
			'white-space': 'nowrap',
			overflow: 'hidden',
			cursor: 'pointer'
		}).height(optionHeight);

		jQuery(optionRow).append(optionTd);

		jqTd.click(function(){
			var label = this.innerHTML;
			label = label.replace(/(&\w+;)/g, function(match, entity){
				return StyledSelector.entities[entity];
			});
			var value = self.lvPairs[label];
			self.setValue(value);
			self.hideDropBox();
		});
	}

	this.jqDropBox.empty().append(optionTable);
	// jqTable.outerWidth(this.jqDropBox.width());
};


StyledSelector.prototype.getOpenIcon = function(){
	var iconColor = this.styles && this.styles.iconColor || 'black';
	var iconInnerColor = this.styles && this.styles.iconInnerColor || 'white';

	var _icon = '<svg width="16" height="16">'
		+ '<rect width="16" height="16" style="fill:' + iconColor + '"/>'
		+ '<polygon points="4,5 12,5 8,12" style="fill:' + iconInnerColor + '"/>'
		+ '</svg>';
	return _icon;
};

StyledSelector.prototype.getCloseIcon = function(){
	var iconColor = this.styles && this.styles.iconColor || 'black';
	var iconInnerColor = this.styles && this.styles.iconInnerColor || 'white';

	var _icon = '<svg width="16" height="16">'
		+ '<rect width="16" height="16" style="fill:' + iconColor + '"/>'
		+ '<polygon points="8,4 4,11 12,11" style="fill:' + iconInnerColor + '"/>'
		+ '</svg>';
	return _icon;
};


StyledSelector.prototype.onChange = function(selector){

};

StyledSelector.prototype.getValue = function(){
	return this.value;
};

StyledSelector.prototype.setValue = function(value){
	if(this.placeholder){
		this.jqSelInput.val(this.placeholder);
	}else{
		var label = this.vlPairs[value];
		if(typeof label !== 'undefined'){
			this.jqSelInput.val(label);
		} else {
			this.jqSelInput.val(value);
		}
	}
	this.value = value;
	this.onChange(this);
	return this;
};

StyledSelector.prototype.getLabel = function(){
	if(this.value !== undefined)
		return this.vlPairs[this.value];
};

StyledSelector.prototype.disable = function(){
	this.jqSelInput.attr('disabled', true);
	this.jqDropIcon.unbind();
};

StyledSelector.prototype.enable = function(){
    var self = this;
    this.jqSelInput.attr('disabled', false);
    this.jqDropIcon.unbind().bind('click', document.getElementById(this.containerId), function(ev){
        ev.originalEvent = ev.originalEvent || {};
        ev.originalEvent.dropdownDelegate = ev.data;
        if(self.droped)
            self.hideDropBox();
        else
            self.showDropBox();
    });
};

StyledSelector.prototype.showDropBox = function(){
	this.jqDropBox.show();
	this.droped = true;
	this.setDropIcon();
};

StyledSelector.prototype.hideDropBox = function(){
	this.jqDropBox.hide();
	this.droped = false;
	this.setDropIcon();
};

StyledSelector.prototype.setDropIcon = function(){
	var icon;
	if(this.droped){
		icon = this.getCloseIcon();
	}else{
		icon = this.getOpenIcon();
	}

	this.jqDropIcon.empty().append(icon);
};

StyledSelector.prototype.updateOptions = function(options){
	this.selectables = options;
	this.init();
	this.create();
};

StyledSelector.prototype.handleDropdowns = function(target, delegate){
    var container = document.getElementById(this.containerId);

    if(!container || (container !== this._dhCont)){
        window.dropdownHelper.removeDropdownHandler(this);
        return;
    }

    var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);

    if(!isChild && this.droped){
        this.hideDropBox();
    }
};

StyledSelector.entities = {
	'&gt;': '>',
	'&lt;': '<'
};
