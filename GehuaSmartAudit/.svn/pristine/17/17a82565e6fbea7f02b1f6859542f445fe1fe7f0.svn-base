/**
 * element = {
 * 	label: ''
 * 	value: ''
 * 	dropdown: ''
 * }
 *
 * option = {
 * 	elements: []
 * 	styles: {}
 * }
 */

function StyledSwitcher(option) {
	this.elements = option && option.elements || [];
	this.container = option && option.container;
	this.styles = option && option.styles;

	if(!this.container)
		return null;

	this.init();
};

StyledSwitcher.prototype = {
	init : function() {
		this.elLen = this.elements && this.elements.length || 0;

		this._dhCont = jQuery(this.container)[0];
		if(this._dhCont && window.dropdownHelper){
		    window.dropdownHelper.addDropdownHandler(this);
		}
	},

	getSwitcherEls: function(contRow){
		this.swEls = [];
		this.dropDowns = [];
		var self = this;
		var outColor = this.styles && this.styles.outColor || 'rgb(79,184,241)';
		var borderRadius = this.styles && this.styles.borderRadius || '5px';
		borderRadius = (parseInt(borderRadius, 10) - 1) + 'px';

		for(var i = 0; i < this.elLen; i++){
			var switcherEl = document.createElement('td');
			var jqSwEl = jQuery(switcherEl);

			var element = this.elements[i];
			var elLabel = element && element.label || '';
			var weight = element && element.weight || '';

			var colSpan = element && element.colSpan;
			if(typeof colSpan !== 'undefined'){
				jqSwEl.attr('colspan', colSpan);
			}

			if(weight === 'default')
				this.focusIndex = i;

			var $sweTitle = jQuery('<div>').addClass('switcher_choice_handle').append(elLabel);

			jqSwEl.append($sweTitle);

			if(element.dropdown){
				$sweTitle.append(
					 '<div class="switcher_dropdown_icon">' +
					 this.getDropIcon() +
					 '</div>');
				var dropDownItem = {
					open: false
				};

				var elDropDown = element.dropdown;
				var dropDownDiv = document.createElement('div');
				var dropParams = {
					top: typeof elDropDown.top !== 'undefined' ? elDropDown.top : '100%',
					right: typeof elDropDown.right !== 'undefined' ? elDropDown.right : 0,
				};

				var jqDropDown = jQuery(dropDownDiv).css({
					position: 'absolute',
					top: dropParams.top,
					cursor: 'default'
				}).addClass('switcher_choice_dropdown').hide();

				if(elDropDown.align === 'left'){
					delete dropParams['right'];
					dropParams.left = typeof elDropDown.left !== 'undefined' ? elDropDown.left : 0;
					jqDropDown.css({
						left: dropParams.left
					});
				}else{
					jqDropDown.css({
						right: dropParams.right
					});
				}

				var dropDownContent;
				if(typeof elDropDown.content == 'string'){
					dropDownContent = elDropDown.content;
				}else if(typeof elDropDown.content == 'function'){
					dropDownContent = elDropDown.content();
				}

				dropDownContent = typeof dropDownContent !== 'undefined' ? dropDownContent : '';

				dropDownItem.view = jqDropDown.append(dropDownContent);

				this.dropDowns.push(dropDownItem);

				jqSwEl.append(dropDownDiv);

				var bindChange = elDropDown.bindChange;
				if(typeof bindChange == 'function'){
					bindChange(function(el){
						self.dropdownChange.call(self, el);
					});
				}
			}else{
				this.dropDowns.push(null);
			}

			jqSwEl.css({
				backgroundColor: outColor,
				cursor: 'pointer'
			});

			if(this.elLen > 1 && (i == 0)){
				jqSwEl.css({
					'border-radius': '' + borderRadius + ' 0 0 ' + borderRadius
				});
			}else if(this.elLen > 1 && (i == this.elLen - 1)){
				jqSwEl.css({
					'border-radius': '0 ' + borderRadius + ' ' + borderRadius + ' 0'
				});
			}else if(this.elLen == 1){
				jqSwEl.css({
					'border-radius': '' + borderRadius + ' ' + borderRadius + ' ' + borderRadius + ' ' + borderRadius
				});
			}

			contRow.append(switcherEl);

			jqSwEl.bind('click', function(ev){
				var $target = jQuery(ev.target);
				if(ev.target === this
					|| ($target.hasClass('switcher_choice_handle') && ev.target == this.children[0])
					|| $target.parents('.switcher_choice_handle')[0] == this.children[0]
				){
					if($target.parents('.switcher_dropdown_icon').length > 0){
						ev.originalEvent.dropdownDelegate = $target.parents('.switcher_dropdown_icon')[0];
					}
					self.switcherClick(this);
				}
			});

			this.swEls.push(switcherEl);
		}
	},

	dropdownChange : function(obj){
		if(obj){
			var outColor = this.styles && this.styles.outColor || 'rgb(79,184,241)';
			var dropItem = obj.parentNode.parentNode;
			for(var i = 0, max = this.swEls.length; i < max; i++){
				var item = this.swEls[i];
				if(item === dropItem){
					var dropdown = this.dropDowns[i];
					if(dropdown.open == true){
						dropdown.open = false;
						dropdown.view.hide();
						jQuery(item).children('.switcher_choice_handle').children('.switcher_dropdown_icon').empty().append(this.getDropIcon());
						if(this.elLen === 1){
							item.style.backgroundColor = outColor;
						}
					}
					break;
				}
			}
			this.valueChange();
		}
	},

	switcherClick : function(obj){
		var self = this;
		var focusColor = this.styles && this.styles.focusColor || 'rgb(7,138,206)';
		var outColor = this.styles && this.styles.outColor || 'rgb(79,184,241)';

		var dropdownToggle = false;

		jQuery.each(this.swEls, function(i, item){
			var itemBg;
			if(item === obj){
				itemBg = focusColor;
				self.focusIndex = i;
			}else{
				itemBg = outColor;
			}

			var jqItem = jQuery(item);

			var element = self.elements[i];
			var dropdown = self.dropDowns[i];
			if(dropdown && (i == self.focusIndex)){
				if(dropdown.open == true){
					dropdown.open = false;
					dropdown.view.hide();
					jqItem.children('.switcher_choice_handle').children('.switcher_dropdown_icon').empty().append(self.getDropIcon());
					if(self.elLen === 1){
						itemBg = outColor;
					}
				}else{
					dropdown.open = true;
					dropdown.view.show();
					jqItem.children('.switcher_choice_handle').children('.switcher_dropdown_icon').empty().append(self.getUpIcon());
				}
				dropdownToggle = true;
			}else if(dropdown){
				dropdown.open = false;
				dropdown.view.hide();
				jqItem.children('.switcher_choice_handle').children('.switcher_dropdown_icon').empty().append(self.getDropIcon());
			}

			jqItem.css('background-color', itemBg);
		});

		if(!dropdownToggle){
			this.valueChange();
		}
	},

	valueChange: function(){
		var currValue = this.getValue();
		if(this.previousValue !== currValue){
			this.previousValue = currValue;
			this.onChange(currValue);
		}
	},

	create : function() {
		var borderWidth = this.styles && this.styles.borderWidth || 1;
		var textColor = this.styles && this.styles.textColor || 'white';
		var fontSize = this.styles && this.styles.fontSize || '12px';
		var borderColor = this.styles && this.styles.bordoerColor || 'rgb(10,137,203)';
		var borderRadius = this.styles && this.styles.borderRadius || '5px';

		var container = jQuery(this.container);
		var lineHeight = container.height() - 2 * parseInt(borderRadius, 10);

		var switcher = document.createElement('table');

		var jqSwitcher = jQuery(switcher);
		jqSwitcher.css({
			position: 'relative',
			tableLayout: 'fixed',
			width: '100%',
			height: '100%',
			textAlign: 'center',
			color: textColor,
			fontSize: '12px',
			backgroundColor: borderColor,
			'border-radius': borderRadius,
			'line-height': lineHeight + 'px',
		}).attr('cellpadding',0).attr('cellspacing', borderWidth);

		var elsRow = document.createElement('tr');
		jqSwitcher.append(elsRow);
		var jqElsRow = jQuery(elsRow);

		this.getSwitcherEls(jqElsRow);

		container.empty().append(switcher);

		this.setDefaultFocus();
	},

	setDefaultFocus: function(){
		this.switcherClick(this.swEls[this.focusIndex]);
	},

	onChange : function(){

	},

	getValue: function(){
		if(typeof this.focusIndex == 'undefined'){
			return;
		}
		var element = this.elements[this.focusIndex];
		if(element && (typeof element.value == 'function')){
			return element.value();
		}else if(element){
			return element.value;
		}
	},

	getUpIcon : function() {
		var iconColor = this.styles && this.styles.iconColor || 'transparent';
		var iconInnerColor = this.styles && this.styles.iconInnerColor || 'white';

		var _icon =	'<svg width="16" height="16">' +
			'<rect width="16" height="16" style="fill:' + iconColor + '"/>' +
			'<polygon points="8,4 4,11 12,11" style="fill:' + iconInnerColor + '"/>' +
			'</svg>';
		return _icon;
	},

	getDropIcon : function() {
		var iconColor = this.styles && this.styles.iconColor || 'transparent';
		var iconInnerColor = this.styles && this.styles.iconInnerColor || 'white';

		var _icon =	'<svg width="16" height="16">' +
			'<rect width="16" height="16" style="fill:' + iconColor + '"/>' +
			'<polygon points="4,5 12,5 8,12" style="fill:' + iconInnerColor + '"/>' +
			'</svg>';
		return _icon;
	},

    handleDropdowns: function(target, delegate){
        var container = jQuery(this.container);
        if((container.length === 0) || (container[0] !== this._dhCont)){
            window.dropdownHelper.removeDropdownHandler(this);
            return;
        }
        var _cont = container[0];

        var isChild = window.dropdownHelper.checkIsChild(_cont, target, delegate);
        if(!isChild){
            this.hideAllDropdowns();
        }
    },

    hideAllDropdowns: function(){
        var self = this;
        var outColor = this.styles && this.styles.outColor || 'rgb(79,184,241)';
        jQuery.each(this.swEls, function(i, item){
            var dropdown = self.dropDowns[i];
            var jqItem = jQuery(item);
            if(dropdown){
                dropdown.open = false;
                dropdown.view.hide();
                jqItem.children('.switcher_choice_handle').children('.switcher_dropdown_icon').empty().append(self.getDropIcon());
                if(self.elLen === 1){
                    jqItem.css('background-color', outColor);
                }
            }
        });
    }
};
