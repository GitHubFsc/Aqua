var PaaSTreeRoot = '/aquapaas/rest/navigation/trees/';

var RootNode = new ColumnNode(null, '年华', '1');

var WeekLabels = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

var Tabsv = {
	columnNode: new ColumnNode(RootNode, NavigationRoot.slice(NavigationRoot.lastIndexOf('/') + 1), '9'),

	init: function(){
		var _this = this;
		this.navPath = NavigationRoot;
		this.pageModels = [];
		this.setTabs(function(){
			var page = App.store.getValue('page');
			if(page != null && page != '') {
				var pageFocus = App.store.getValue('pageFocus');
				try{
					pageFocus = typeof pageFocus == 'string' && pageFocus != '' ? JSON.parse(pageFocus) : null;
				}catch(e){
					log(e.message);
				}
			} else {
				page = getURLParameter('page');
			}
			if(page != ''){
				page = Number(page);
				if(page >= 0 && page <= _this.focus.lmt.col){
					_this.focus.col = page;
				}
			}
			setFocus(_this, false, pageFocus != null);
			_this.changeFocus(pageFocus);
		});
		this.setClock();
	},
	setClock: function(){
		var _this = this;
		if(this.clockInterval != null){
			clearInterval(this.clockInterval);
		}
		function setClockTime(){
			var date = new Date();
			var m = date.getMonth();
			var d = date.getDate();
			var wd = date.getDay();

			var h = date.getHours();
			var min = date.getMinutes();

			var dateStr = (m + 1) + '月' + d + '日';
			var weekStr = WeekLabels[wd];
			var timeStr = preZero(h) + ':' + preZero(min);

			if(_this.clockDateStr != dateStr){
				$_id('clock_date').innerText = dateStr;
				_this.clockDateStr = dateStr;
			}

			if(_this.clockWeekStr != weekStr){
				$_id('clock_weekday').innerText = weekStr;
				_this.clockWeekStr = weekStr;
			}

			if(_this.clockTimeStr != timeStr){
				$_id('clock_time').innerText = timeStr;
				_this.clockTimeStr = timeStr;
			}

		}
		setClockTime();
		this.clockInterval = setInterval(setClockTime, 5000);
	},
	setTabs: function(callback){
		var _this = this;
		my.paas.getNavigation(this.navPath, function(data){
			var pages = data.children;
			var num = pages.length;
			_this.focus.lmt.col = num - 1;
			var html = '';
			for(var i = 0; i < num; i += 1){
				var page = pages[i];
				html += '<div id="tab_' + i + '" class="tab_header"><span>' + page.name + '</span></div>';
				var styleNo = page.metadata['样式'];
				var templateFile = 'templates/t' + styleNo + '/layout.json';

				_this.pageModels[i] = getPageModel(templateFile, page, _this.navPath, i);
			}
			$_id('tabs_header').innerHTML = html;
			if(typeof callback == 'function'){
				callback();
			}
		});
	},
	focus: {
		col: 0,
		lmt: {
			col: 0
		}
	},
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.up:
		case keyValue.UP:
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			this.navToSub();
			return false;
			break;
		case keyValue.left:
		case keyValue.LEFT:
			if(this.focus.col > 0){
				this.focus.col -= 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			if(this.focus.col < this.focus.lmt.col){
				this.focus.col += 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.back:
		case keyValue.BACK:
		case keyValue.Back:
		case keyValue.quit:
		case keyValue.QUIT:
		case keyValue.Quit:
			App.back();
			return false;
		}
	},
	changeFocus: function(pageFocus){
		var index = this.focus.col;
		var $f = $_id('tab_focus');
		var fPos = index * 250 + 15;
		$f.style.left = fPos + 'px';
		if(!pageFocus){
			$f.style.visibility = 'visible';
		}
		var $sel = $_class('tab_select')[0];
		if($sel != null){
			$sel.classList.remove('tab_select');
		}
		var $tel = $_id('tab_' + index);
		if($tel != null){
			$tel.classList.add('tab_select');
		}
		if(this.livingTab != null && typeof this.livingTab.onTabOut == 'function'){
			this.livingTab.onTabOut();
		}
		var pageModel = this.pageModels[index];
		if(pageModel != null){
			pageModel.show(pageFocus);
			App.store.setValue('page', String(index));
			this.livingTab = pageModel;
			if(!pageFocus){
				pageModel.collectTitle();
			}
		}
	},
	navToSub: function(){
		var pageModel = this.pageModels[this.focus.col];
		if(pageModel != null){
			pageModel.isReady && setFocus(pageModel);
		}
	},
	onFocusIn: function(){
		$_id('tab_focus').style.visibility = 'visible';
		var index = this.focus.col;
		var pageModel = this.pageModels[index];
		if(pageModel != null && pageModel.isReady){
			pageModel.collectTitle();
		}
	},
	onFocusOut: function(){
		$_id('tab_focus').style.visibility = '';
	}
};

function UITab(){
	this.collector = new AppRepoint();
}

UITab.prototype = {
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.left:
		case keyValue.LEFT:
			this.collector.serviceEntrance = '0';
			this.left();
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			this.collector.serviceEntrance = '0';
			this.right();
			return false;
			break;
		case keyValue.up:
		case keyValue.UP:
			this.collector.serviceEntrance = '0';
			if(!this.up()){
				setFocus(Tabsv);
			}
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			this.collector.serviceEntrance = '0';
			this.down();
			return false;
			break;
		case keyValue.back:
		case keyValue.BACK:
		case keyValue.Back:
		case keyValue.quit:
		case keyValue.QUIT:
		case keyValue.Quit:
			this.collector.serviceEntrance = '-1';
			if(this.back()){

			} else {
				App.back();
			}
			return false;
			break;
		case keyValue.pageup:
		case keyValue.pageUp:
		case keyValue.PageUp:
		case keyValue.PAGEUP:
			this.collector.serviceEntrance = '2';
			this.pageUp();
			return false;
			break;
		case keyValue.pagedown:
		case keyValue.pageDown:
		case keyValue.PageDown:
		case keyValue.PAGEDOWN:
			this.collector.serviceEntrance = '3';
			this.pageDown();
			return false;
			break;
		case keyValue.enter:
		case keyValue.ENTER:
			this.collector.serviceEntrance = '1';
			this.enterPressed();
			return false;
		case keyValue.zero:
		case keyValue.one:
		case keyValue.two:
		case keyValue.three:
		case keyValue.four:
		case keyValue.five:
		case keyValue.six:
		case keyValue.seven:
		case keyValue.eight:
		case keyValue.nine:
			this.numInput(code - 48);
			return false;
			break;
		default:
			break;
		}
	},

	numInput: function(num){
		return false;
	},

	pageUp: function(){
		return false;
	},

	pageDown: function(){
		return false;
	},

	enterPressed: function(){
		return false;
	},

	back: function(){
		return false;
	},

	down: function(){
		return false;
	},

	left: function(){
		return false;
	},

	right: function(){
		return false;
	},

	up: function(){
		return false;
	}

};

function getPageModel(templateFile, data, parentNav, index){
	var model = new UITab();
	model.pageData = data;
	model.templateFile = templateFile;
	model.navPath = parentNav + '/' + data.name;
	model.collector.pageID = '19';
	model.columnNode = new ColumnNode(Tabsv.columnNode, data.name, String(index));
	model.focus = {
		index: 0,
		lmt: 0
	};
	model.collectTitle = function(){
		this.collector.columnID = this.columnNode.getNodeId();
		this.collector.columnName = this.columnNode.getNodePath();
		this.collector.collect();
	};
	model.show = function(pageFocus){
		var _this = this;
		this.isReady = false;
		if(this.templateData == null){
			App.getJson(this.templateFile, function(data){
				_this.templateData = data;
				_this.drawLayout();
				_this.fillLayout(function(){
					if(pageFocus != null){
						_this.focus.index = pageFocus.index;
						_this.changeFocus();
						setFocus(_this, false, true);
					}
				});
			});
		} else {
			this.drawLayout();
			this.fillLayout();
		}
	};
	model.fillLayout = function(callback){
		var _this = this;
		my.paas.getNavigation(this.navPath, function(data){
			var blockData = data && data.children || [];
			var blocks = _this.templateData.blocks;
			_this.navData = blockData;
			var assetBlocks = [];
			var assetIds = [];
			for(var i = 0, len = blocks.length; i < len; i+=1){
				var block = blocks[i];
				var blockItem = blockData[i];
				if(blockItem != null){
					if(block.isMiniVideo){
						_this.playMiniVideo(blockItem, block);
					} else if(blockItem.node_class == 'folder') {
						$_id('tab_block_poster_' + i).src = blockItem.metadata['预览图'] || '';
					} else if(blockItem.node_class == 'asset'){
						var defPoster = blockItem.metadata && blockItem.metadata['节目海报'];
						if(defPoster != null && defPoster != ''){
							$_id('tab_block_poster_' + i).src = defPoster;
						} else {
							assetBlocks.push(i);
							assetIds.push(blockItem.metadata_public.ProviderId + '_' + blockItem.metadata_public.ProviderAssetId);
						}
					}
				}
			}

			var idLen = assetIds.length;
			if(idLen > 0){
				getAssets(assetIds, function(assets){
					if(assets != null){
						var assetNum = assets.length;
						for(var j = 0; j < idLen; j+=1){
							var assetId = assetIds[j];
							for(var k = 0; k < assetNum; k += 1){
								var asset = assets[k];
								if(assetId == asset.provider_id + '_' + asset.provider_asset_id){
									var poster = parseAssetPoster(asset, 0);
									$_id('tab_block_poster_' + assetBlocks[j]).src = poster;
									break;
								}
							}
						}
					}
				}, false);
			}

			if(typeof callback == 'function'){
				callback();
			}

		}, ['app', 'user']);
	};
	model.playMiniVideo = function(asset, block){
		log('set mini video');
		var position = block.box.position;
		AutoVod.play({
			provider_id: asset.metadata_public.ProviderId,
			provider_asset_id: asset.metadata_public.ProviderAssetId
		}, {
			left: parseInt(position.left, 10),
			top: parseInt(position.top, 10),
			width: parseInt(position.width, 10),
			height: parseInt(position.height, 10)
		});
	};
	model.onTabOut = function(){
		if(this.hasMiniVideo){
			log('close mini video.');
			AutoVod.close();
		}
	};
	model.enterPressed = function(){
		var index = this.focus.index;
		var item = this.navData[index];
		if(item != null){
			this.collector.collect();
			if(item.node_class == 'folder'){
				if(item.metadata['类型'] == '图片'){
					var imgUrl = item.metadata['内容图'] || '';
					if(imgUrl != ''){
						ImageViewer.show(imgUrl, this);
					}
				}else if(item.metadata['类型'] == '网页'){
					var link = '';
					switch(DeviceType){
					case 1://Android
						link = item.metadata['安卓跳转链接'] || '';
						break;
					case 2://ThinClient
						link = item.metadata['瘦终端跳转链接'] || '';
						break;
					case 3://iPanel
						link = item.metadata['中间件跳转链接'] || '';
						break;
					default:
						break;
					}
					link = link || item.metadata['跳转链接'] || '';
					if(link != ''){
						this.storeFocus();
						this.goPortalLink(link);
					}
				}
			} else if(item.node_class == 'asset'){
				this.storeFocus();
				App.goPlayer({
					provider_id: item.metadata_public.ProviderId,
					provider_asset_id: item.metadata_public.ProviderAssetId
				});
			}
		}
		return false;
	};
	model.drawLayout = function(){
		var bg = model.pageData.metadata['背景图片'];
		if(bg == null || bg == ''){
			bg = this.templateData['background-image'];
		}
		$_id('bgimg').setAttribute('src', bg);
		var cntLayout = $_id('tab_content').getAttribute('data-layout');
		if(cntLayout != this.templateFile){
			this.buildBlocks();
		}
		this.isReady = true;
	};
	model.buildBlocks = function(){
		var _this = this;
		var frag = $_f();
		var blocks = this.templateData.blocks;
		var num = blocks.length;
		for(var i = 0; i < num; i += 1){
			var block = blocks[i];
			var pos = block.box.position;
			var $blo = $_('div');
			$blo.id = 'tab_block_' + i;
			$blo.className = 'tab_block';
			$blo.style.left = pos.left;
			$blo.style.top = pos.top;
			$blo.style.width = pos.width;
			$blo.style.height = pos.height;
			if(!block.isMiniVideo){
				var $img = $_('img');
				$img.id = 'tab_block_poster_' + i;
				$img.className = 'block_poster';
				$img.src = '';
				$blo.appendChild($img);
			} else {
				_this.hasMiniVideo = true;
			}
			frag.appendChild($blo);
		}
		var $cnt = $_id('tab_content');
		$cnt.innerHTML = '';
		$cnt.appendChild(frag);
		$cnt.setAttribute('data-layout', this.templateFile);
		this.focus.lmt = num - 1;
	};
	model.up = function(){
		var index = this.focus.index;
		var block = this.templateData.blocks[index];
		var next = block.navigation.up;
		if(next == -1){
			return false;
		} else if(next != null){
			this.focus.index = next;
			this.changeFocus();
			return true;
		}
	};
	model.down = function(){
		var index = this.focus.index;
		var block = this.templateData.blocks[index];
		var next = block.navigation.down;
		if(next == -1){
			return false;
		} else if(next != null){
			this.focus.index = next;
			this.changeFocus();
			return true;
		}
	};
	model.left = function(){
		var index = this.focus.index;
		var block = this.templateData.blocks[index];
		var next = block.navigation.left;
		if(next == -1){
			return false;
		} else if(next != null){
			this.focus.index = next;
			this.changeFocus();
			return true;
		}
	};
	model.right = function(){
		var index = this.focus.index;
		var block = this.templateData.blocks[index];
		var next = block.navigation.right;
		if(next == -1){
			return false;
		} else if(next != null){
			this.focus.index = next;
			this.changeFocus();
			return true;
		}
	};
	model.changeFocus = function(){
		var index = this.focus.index;
		var eff = this.templateData.blocks[index].focus;
		var $f = $_id('block_focus');
		$f.style.left = eff.position.left;
		$f.style.top = eff.position.top;
		$f.style.width = eff.position.width;
		$f.style.height = eff.position.height;
		$f.style.backgroundImage = 'url(' + eff.image + ')';
		$f.style.visibility = 'visible';

		var item = this.navData && this.navData[index];
		if(item != null) {
			var columnNode = new ColumnNode(this.columnNode, item.name, index);
			this.collector.columnName = columnNode.getNodePath();
			this.collector.columnID = columnNode.getNodeId();
			this.collector.collect();
		}
	};
	model.onFocusIn = function(){
		this.focus.index = 0;
		this.changeFocus();
	};
	model.onFocusOut = function(){
		$_id('block_focus').style.visibility = '';
	};

	model.storeFocus = function(){
		var pageFocus = {index: this.focus.index};
		App.store.setValue('pageFocus', JSON.stringify(pageFocus));
	};
	model.goPortalLink = function(url){
		log(url);
		var homeUrl = location.origin + location.pathname;
		if(window.AuditTreeVersion != null && window.AuditTreeVersion != ''){
			homeUrl += '?tree_version=' + window.AuditTreeVersion;
		}
		switch(DeviceType){
		case 1:
		case 3:
			var target = url;
			if(url.indexOf('?') > -1){
				target += '&backUrl=' + encodeURIComponent(homeUrl);
			} else {
				target += '?backUrl=' + encodeURIComponent(homeUrl);
			}
			location.href = target;
			break;
		case 2:
			var backParam = window.AppBackParam;
			backParam.AppParam = {
				Linux: homeUrl,
				Android: homeUrl,
				ThinClient: homeUrl
			};

			var startParam = window.NHAppStartParam;
			startParam.AppParam = {
				Linux: url,
				Android: url,
				ThinClient: url
			};
			var retStart = GHWEBAPI.StartApp(startParam, backParam, '');
			if(retStart.ResultCode != 0){
				log(retStart.Description);
			}

			break;
		}
	};



	return model;
}


var ImageViewer = {
	show: function(url, obj){
		this.preFocus = obj;
		$_id('img_view_item').src = url;
		$_id('img_viewer').style.visibility = 'visible';
		setFocus(this, true, true);
	},
	hide: function(){
		$_id('img_viewer').style.visibility = '';
		setFocus(this.preFocus, true, true);
	},
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.back:
		case keyValue.Back:
		case keyValue.BACK:
		case keyValue.quit:
		case keyValue.QUIT:
		case keyValue.Quit:
			this.hide();
			return false;
			break;
		}
	}
};

function getAssets(assetIds, callback, async){
	var url = my.paas.host + '/aquapaas/rest/search/content_by_id/asset?ids=' + assetIds.join(',');
	try{
		my.paas.request({
			type: 'GET',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			async: !!async,
			done: function(vods){
				vods = JSON.parse(vods);
				if(typeof callback == 'function'){
					callback(vods);
				}
			},
			fail: function(){
				if(typeof callback == 'function'){
					callback(null);
				}
			}
		}, ['app']);
	}catch(e){
		log(e.message);
	}
}
