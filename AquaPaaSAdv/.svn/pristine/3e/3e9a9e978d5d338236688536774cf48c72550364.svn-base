var getCombiSelector = (function($) {

	var defaults = {
		filters: [{
			label: i18n('ADV_FILTER_SITE_ALL'),
			value: 'ALL',
			colSpan: 2,
			weight: 'default'
		}, {
			label: 'A',
			value: 'A'
		}, {
			label: 'B',
			value: 'B'
		}, {
			label: 'C',
			value: 'C'
		}, {
			label: 'D',
			value: 'D'
		}, {
			label: 'E',
			value: 'E'
		}, {
			label: 'F',
			value: 'F'
		}, {
			label: 'G',
			value: 'G'
		}, {
			label: 'H',
			value: 'H'
		}, {
			label: 'I',
			value: 'I'
		}, {
			label: 'J',
			value: 'J'
		}, {
			label: 'K',
			value: 'K'
		}, {
			label: 'L',
			value: 'L'
		}, {
			label: 'M',
			value: 'M'
		}, {
			label: 'N',
			value: 'N'
		}, {
			label: 'O',
			value: 'O'
		}, {
			label: 'P',
			value: 'P'
		}, {
			label: 'Q',
			value: 'Q'
		}, {
			label: 'R',
			value: 'R'
		}, {
			label: 'S',
			value: 'S'
		}, {
			label: 'T',
			value: 'T'
		}, {
			label: 'U',
			value: 'U'
		}, {
			label: 'V',
			value: 'V'
		}, {
			label: 'W',
			value: 'W'
		}, {
			label: 'X',
			value: 'X'
		}, {
			label: 'Y',
			value: 'Y'
		}, {
			label: 'Z',
			value: 'Z'
		}],
		displayColumns: 5,
		displayStyles: {
			textColor: 'rgb(121,121,121)',
			BgColor: 'transparent',
			textFocus: 'white',
			BgFocus: '#5da1c0',
			itemHeight: '30px',
			fontSize: '14px',
			borderSpacing: '20px 5px',
		},
		singleCheck: false,
		getInnerView: function() {
			var self = this;
			var $inner = $('<div>').addClass('au_analysis_channel_picker');
			var $header = $('<div>').addClass('au_analysis_channel_picker_switcher').appendTo($inner);

			this.pickerSwitcher = new StyledSwitcher({
				elements: this.filters,
				container: $header[0],
				styles: {
					borderWidth: '0',
					borderRadius: '0px',
					outColor: '#81b2c8',
					focusColor: '#3e7a96'
				}
			});

			this.$displays = $('<div>').addClass('au_analysis_channel_picker_display').appendTo($inner);

			this.pickerSwitcher.onChange = function(filter) {
				self.switchPicker(filter);
			};

			this.pickerSwitcher.create();

			$('<p>').addClass('au_analysis_channel_picker_cancel_button').text(i18n('DIALOG_CANCEL')).click(function() {
				self.cancel();
			}).appendTo($inner);

			$('<p>').addClass('au_analysis_channel_picker_submit_button').text(i18n('DIALOG_OK')).click(function() {
				self.submit();
			}).appendTo($inner);

			this.$inner = $inner;

			return $inner[0];
		},
		switchPicker: function(value) {
			this.displayChannels = [];
			if (value === 'ALL') {
				for (var i = 0, max = this.channels.length; i < max; i++) {
					this.displayChannels.push(this.channels[i]);
				}
			} else {
				for (var i = 0, max = this.channels.length; i < max; i++) {
					var channel = this.channels[i];
					if (value.toLowerCase() === channel.py.substr(0, 1).toLowerCase()) {
						this.displayChannels.push(channel);
					}
				}
			}
			this.fillDisplay();
		},
		fillDisplay: function() {
			var self = this;
			var $table = $('<table>').css({
				position: 'relative',
				color: this.displayStyles.textColor,
				width: '100%',
				tableLayout: 'fixed',
				textAlign: 'center',
				fontSize: this.displayStyles.fontSize,
				'border-collapse': 'separate',
				'border-spacing': this.displayStyles.borderSpacing,
				backgroundColor: this.displayStyles.BgColor,
			}).attr({
				'cellpadding': 0
			});

			var rowNum = Math.ceil(this.displayChannels.length / this.displayColumns);

			this.$displayItems = [];
			for (var i = 0; i < rowNum; i++) {
				var $row = $('<tr>');
				for (var j = 0; j < this.displayColumns; j++) {
					var $item = $('<td>').appendTo($row);

					$item.height(this.displayStyles.itemHeight);

					var index = i * this.displayColumns + j;
					var displayChannel = this.displayChannels[index];
					if (displayChannel) {
						var label = displayChannel.label || '';
						$item.append(label);

						$item.css({
							position: 'relative',
							cursor: 'pointer',
							overflow: 'hidden',
							'text-overflow': 'ellipsis',
							'whie-space': 'nowrap',
							'word-break': 'keep-all'
						}).click(function() {
							self.$displayItemClick(this);
						});

						if (displayChannel.tmpChecked) {
							$item.css({
								backgroundColor: this.displayStyles.BgFocus,
								color: this.displayStyles.textFocus
							});
						} else {
							$item.css({
								backgroundColor: 'transparent',
								color: 'inherit',
							});
						}
						this.$displayItems.push($item);
					}
				}
				$table.append($row);
			}

			this.$displays.empty().append($table);
		},
		$displayItemClick: function(obj) {
			var self = this;
			$.each(this.$displayItems, function(i, $item) {
				if (self.singleCheck) {
					var channel = self.displayChannels[i];
					if ($item[0] === obj) {
						channel.tmpChecked = !channel.tmpChecked;
						if(channel.tmpChecked){
							$item.css({
								backgroundColor: self.displayStyles.BgFocus,
								color: self.displayStyles.textFocus
							});
						} else {
							$item.css({
								backgroundColor: 'transparent',
								color: 'inherit',
							});
						}
					} else {
						channel.tmpChecked = false;
						$item.css({
							backgroundColor: 'transparent',
							color: 'inherit',
						});
					}
				} else {
					if ($item[0] === obj) {
						var channel = self.displayChannels[i];
						if (channel.tmpChecked) {
							channel.tmpChecked = false;
							$item.css({
								backgroundColor: 'transparent',
								color: 'inherit',
							});
						} else {
							channel.tmpChecked = true;
							$item.css({
								backgroundColor: self.displayStyles.BgFocus,
								color: self.displayStyles.textFocus
							});
						}
					}
				}
			});
			// this.$inner.hide().show();
			// Make IE repait for td background-color change.
		},
		updateDisplay: function() {
			var self = this;
			$.each(this.$displayItems, function(i, $item) {
				var channel = self.displayChannels[i];
				if (channel.tmpChecked) {
					$item.css({
						backgroundColor: self.displayStyles.BgFocus,
						color: self.displayStyles.textFocus
					});
				} else {
					$item.css({
						backgroundColor: 'transparent',
						color: 'inherit',
					});
				}
			});
			// this.$inner.hide().show();
			// Make IE repait for td background-color change.
		},
		cancel: function() {
			for (var i = 0, max = this.channels.length; i < max; i++) {
				var channel = this.channels[i];
				channel.tmpChecked = channel.checked;
			}
			this.updateDisplay();
			this.notifyChange();
		},
		submit: function() {
			for (var i = 0, max = this.channels.length; i < max; i++) {
				var channel = this.channels[i];
				channel.checked = channel.tmpChecked;
			}
			this.updateDisplay();
			this.notifyChange();
		},
		notifyChange: function() {
			for (var i = 0, max = this.listeners.length; i < max; i++) {
				var listener = this.listeners[i];
				if ( typeof listener == 'function') {
					listener(this.$inner[0]);
				}
			}
		},
		listeners: [],
		getOuterView: function() {
			var self = this;
			var drop = [{
				label: '<div class="combi_selector_label">' + self.label + '</div>',
				dropdown: {
					align: 'left',
					content: function() {
						return self.getInnerView();
					},
					bindChange: function(listener) {
						self.listeners.push(listener);
					}

				},
				value: function() {
					return self.getResult();
				}

			}];

			this.channelSelector = new StyledSwitcher({
				container: this.container,
				elements: drop,
				styles: {
					borderColor: '#597f89',
					borderRadius: '2px',
					focusColor: '#5da1c0',
					outColor: '#5da1c0'
				}
			});

			this.channelSelector.getUpIcon = function(){
				return '<div class="combi_selector_arrow_up"></div>';
			};

			this.channelSelector.getDropIcon = function(){
				return '<div class="combi_selector_arrow_down"></div>';
			};

			this.channelSelector.create();

			this.channelSelector.onChange = function(channels) {
				if ( typeof self.onChange == 'function') {
					self.onChange(channels);
				}
			};
		},
		getResult: function() {
			var result = [];
			for (var i = 0, max = this.channels.length; i < max; i++) {
				var channel = this.channels[i];
				if (channel && channel.checked) {
					result.push(channel);
				}
			}
			return result;
		},
		create: function() {
			this.getOuterView();
		},
		onChange: null,

	};

	var getSelector = function(options) {
		var delegate = $.extend({}, defaults, options);
		$.makeArray(delegate.channels).forEach(function(channel) {
			if (channel) {
				channel.py = window.PY.changeToPy(channel.label);
			}
		});
		return delegate;
	};

	return getSelector;
})(jQuery);
