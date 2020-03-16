// @formatter:off
(function(JS){
    var analysis = JS.namespace('auAnalysis'),
        analyzer = JS.checkExist('auAnalysis.realtimeAnalysis'),
        ChannelPicker = JS.checkExist('auAnalysis.ChannelPicker');
    // @formatter:on

    var ChannelDropdown = analysis.ChannelDropdown = function(options) {
        var container = options && options.container;
        if ( typeof container === 'string') {
            if (container.substr(0, 1) === '#') {
                this.containerId = container.slice(1);
                this.container = jQuery(container).empty();
            } else {
                this.containerId = container;
                this.container = jQuery(document.getElementById(container)).empty();
            }
        } else {
        }
        
        this.styles = options && options.styles;
    };

    ChannelDropdown.prototype = {
        init: function() {
            if (this.container.css('position') === 'static') {
                this.container.css('position', 'relative');
            }
            this.value = null;
            
            this._dhCont = document.getElementById(this.containerId);
            if(this._dhCont && window.dropdownHelper){
                window.dropdownHelper.addDropdownHandler(this);
            }
        },

        create: function() {
            this.init();

            this.channelPicker = new ChannelPicker({
                noUpdate: true,
                noProgram: true,
                singleCheck: true,
                channels: analyzer.channels
            });

            this.addInput();
            this.addIcon();
            this.addDropBox();
        },

        addInput: function() {
            var cntHeight = this.container.height();
            var cntWidth = this.container.width();

            var selInput = document.createElement('input');
            selInput.type = 'text';
            selInput.className = 'styled-selector-inputbox';
            this.container.append(selInput);

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
            jqSelInput.click(function() {
                if (self.droped)
                    self.hideDropBox();
                else
                    self.showDropBox();
            });

            this.jqSelInput = jqSelInput;
        },

        addIcon: function() {
            var cntHeight = this.container.height();
            var cntWidth = this.container.width();
            var iconSize = this.styles && this.styles.iconSize;

            var dropIcon = document.createElement('div');
            dropIcon.className = 'styled-selector-dropicon';
            this.container.append(dropIcon);

            var jqDropIcon = jQuery(dropIcon);
            jqDropIcon.append(this.getOpenIcon());
            var iconWidth = jqDropIcon.width() || iconSize;
            var iconHeight = jqDropIcon.height() || iconSize;
            var iconTop = Math.floor((cntHeight - iconHeight) / 2);
            jqDropIcon.css({
                position: 'absolute',
                right: 8,
                top: iconTop,
                cursor: 'default'
            });

            var self = this;
            jqDropIcon.bind('click', document.getElementById(this.containerId), function(ev) {
                ev.originalEvent = ev.originalEvent || {};
                ev.originalEvent.dropdownDelegate = ev.data;
                if (self.droped)
                    self.hideDropBox();
                else
                    self.showDropBox();
            });

            this.jqDropIcon = jqDropIcon;
        },

        addDropBox: function() {
            var dropBox = document.createElement('div');
            dropBox.className = 'styled-selector-dropbox';
            this.container.append(dropBox);

            var jqDropBox = jQuery(dropBox);
            jqDropBox.hide();
            jqDropBox.css({
                position: 'absolute',
                color: 'inherit',
                top: '100%',
                zIndex: '20',
                width: '100%',
            });
            var pickerView = this.channelPicker.getPicker();
            jQuery(pickerView).css({
                position: 'absolute',
                right: 0,
                top: '-1px',
            });
            jqDropBox.append(pickerView);

            var self = this;
            this.channelPicker.addChangeListener(function() {
                self.getChannelPickerChange();
            });

            this.jqDropBox = jqDropBox;
        },

        getChannelPickerChange: function() {
            var result = this.channelPicker.getResult();
            if (result.length > 0) {
                channel = result[0];
                this.value = channel;
            } else {
                this.value = null;
            }
            this.setInputValue();
            this.hideDropBox();
        },

        setInputValue: function() {
            if (this.value !== null) {
                this.jqSelInput.val(this.value.label);
            } else {
                this.jqSelInput.val('');
            }
        },

        showDropBox: function() {
            this.jqDropBox.show();
            this.droped = true;
            this.setDropIcon();
        },

        hideDropBox: function() {
            this.jqDropBox.hide();
            this.droped = false;
            this.setDropIcon();
        },

        getValue: function() {
            return this.value;
        },

        setDropIcon: function() {
            var icon;
            if (this.droped) {
                icon = this.getCloseIcon();
            } else {
                icon = this.getOpenIcon();
            }

            this.jqDropIcon.empty().append(icon);
        },

        // @formatter:off
        getOpenIcon: function() {
            var iconColor = this.styles && this.styles.iconColor || 'black';
            var iconInnerColor = this.styles && this.styles.iconInnerColor || 'white';

            var _icon = '<svg width="16" height="16">' + 
                '<rect width="16" height="16" style="fill:' + iconColor + '"/>' + 
                '<polygon points="4,5 12,5 8,12" style="fill:' + iconInnerColor + '"/>' + 
                '</svg>';
            return _icon;
        },

        getCloseIcon: function() {
            var iconColor = this.styles && this.styles.iconColor || 'black';
            var iconInnerColor = this.styles && this.styles.iconInnerColor || 'white';

            var _icon = '<svg width="16" height="16">' + 
                '<rect width="16" height="16" style="fill:' + iconColor + '"/>' + 
                '<polygon points="8,4 4,11 12,11" style="fill:' + iconInnerColor + '"/>' + 
                '</svg>';
            return _icon;
        },
        // @formatter:on

        handleDropdowns: function(target, delegate) {
            var container = document.getElementById(this.containerId);

            if (!container || (container !== this._dhCont)) {
                window.dropdownHelper.removeDropdownHandler(this);
                return;
            }

            var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);

            if (!isChild && this.droped) {
                this.hideDropBox();
            }
        },
        
        setChosen: function(channelIds){
            this.channelPicker.setChosen(channelIds);
            var result = this.channelPicker.getResult();
            if (result.length > 0) {
                channel = result[0];
                this.value = channel;
            } else {
                this.value = null;
            }
            this.setInputValue();
        }
    };

    // @formatter:off
}(window.JS));
// @formatter:on
