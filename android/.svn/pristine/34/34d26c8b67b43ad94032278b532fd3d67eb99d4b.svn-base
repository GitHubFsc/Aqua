var PaaSTreeRoot = '/aquapaas/rest/navigation/trees/';

var RootNode = new ColumnNode(null, '年华', '1');

var Tabsv = {
	columnNode: new ColumnNode(RootNode, '戏曲年华', '7'),

	init: function(){
		this.navPath = NavigationRoot;
		ViewDefault.navPath = this.navPath + '/百姓戏台';
		ViewAnother.navPath = this.navPath + '/曲种选段';
		// this.setTabs();
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
			if(page >= 0 && page <= 3){
				this.focus.row = page;
			}
		}
		setFocus(this);
		this.changeFocus(pageFocus);
	},
	setTabs: function(){
		$_id('tab_0').innerText = '百姓戏台';
		$_id('tab_1').innerText = '曲种选段';
	},
	focus: {
		row: 0,
		lmt: {
			row: 1
		}
	},
	focusPosition: {
		select: [{top: '205px'}, {top: '264px'}],
		focus: [{top: '204px'}, {top: '263px'}]
	},
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.up:
		case keyValue.UP:
			if(this.focus.row > 0){
				this.focus.row -= 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			if(this.focus.row < this.focus.lmt.row){
				this.focus.row += 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.left:
		case keyValue.LEFT:
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			this.navToSub();
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
		var $sel = $_id('tab_select');
		var pos = this.focusPosition.select[this.focus.row];
		$sel.style.top = pos.top;
		var $f = $_id('tab_focus');
		var fp = this.focusPosition.focus[this.focus.row];
		$f.style.top = fp.top;
		switch(this.focus.row){
		case 0:
			ViewDefault.show(pageFocus);
			App.store.setValue('page', '0');
			break;
		case 1:
			ViewAnother.show(pageFocus);
			App.store.setValue('page', '1');
			break;
		default:
			break;
		}
	},
	navToSub: function(){
		switch(this.focus.row){
		case 0:
			setFocus(ViewDefault);
			break;
		case 1:
			setFocus(ViewAnother);
			break;
		default:
			break;
		}
	},
	findShowingSector: function(){
		var index = 0;
		var $secs = $$('.entry_sector');
		for(var i = 0, len = $secs.length; i < len; i+=1){
			if($secs[i].style.display != 'none'){
				index = i;
				break;
			}
		}
		return index;
	},
	setSector: function(id, callback, index, preserve){
		index = index != null ? index: 0;
		var $secs = $$('.entry_sector');
		if(!preserve){
			for(var i = 0, len = $secs.length; i < len; i+=1){
				if(i != index){
					$secs[i].style.display = 'none';
				}
			}
		}
		var template = App.getTemplate(id);
		var $sec = $$('.entry_sector')[index];
		if($sec != null){
			$sec.innerHTML = '';
			$sec.innerHTML = template;
			$sec.style.display = 'block';
		}
		if (typeof callback == 'function') {
			callback();
		}
	},
	showSector: function(index, callback){
		index = index != null ? index: 0;
		var $secs = $$('.entry_sector');
		for(var i = 0, len = $secs.length; i < len; i+=1){
			if(i != index) {
				$secs[i].style.display = 'none';
			}
		}
		$secs[index].style.display = 'block';
		if(typeof callback == 'function'){
			callback();
		}
	},
	onFocusIn: function(){
		$_id('tab_focus').style.visibility = 'visible';
		switch(this.focus.row){
		case 0:
			ViewDefault.collectTitle();
			break;
		case 1:
			ViewAnother.collectTitle();
			break;
		default:
			break;
		}
		// var $s = $$('.entry_selected')[0];
		// if($s != null){
			// $s.classList.remove('entry_selected');
			// $s.classList.add('entry_focus');
		// }
	},
	onFocusOut: function(){
		$_id('tab_focus').style.visibility = '';
		// var $f = $$('.entry_focus')[0];
		// if($f != null){
			// $f.classList.remove('entry_focus');
			// $f.classList.add('entry_selected');
		// }
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
			if(!this.left()){
				setFocus(Tabsv);
			}
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
			this.up();
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

var ViewDefault = new UITab();
ViewDefault.focusPosition = {
	grid: [
	{top: '173px', left: '205px'}, {top: '173px', left: '529px'}, {top: '173px', left: '851px'},
	{top: '388px', left: '205px'}, {top: '388px', left: '529px'}, {top: '388px', left: '851px'}
	]
}
ViewDefault.collector.pageID = '17';
ViewDefault.columnNode = new ColumnNode(Tabsv.columnNode, '百姓戏台', '0');
ViewDefault.show = function(pageFocus){
	var _this = this;
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';

	_this.dataView = null;
	_this.setGridView(function(){
		if(pageFocus != null){
			setFocus(_this);
		}
		//  else {
		// 	_this.collector.collect();
		// }
	}, null, pageFocus);
};
ViewDefault.collectTitle = function(){
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	// this.collector.collect();
};
ViewDefault.setGridView = function(callback, flag, pageFocus){
	var _this = this;
	var currPage, gridFocus;
	if(pageFocus != null){
		currPage = pageFocus.dataView.currPage,
		gridFocus = pageFocus.grid.focus;
	}
	_this.getPageData(function(data){
		_this.gridData = data;
		var num = data.length;
		_this.collector.pageNum = _this.dataView.currPage;
		_this.collector.serviceNum = num;
		_this.grid = new GridNav({
			cols: 3,
			num: num
		});
		if(gridFocus != null){
			_this.grid.focus.col = gridFocus.col;
			_this.grid.focus.row = gridFocus.row;
		}

		for(var i = 0; i < 6; i+=1){
			var item = data[i];
			if(item != null){
				$_id('grid_poster_' + i).setAttribute('src', item.poster || '');
				$_id('grid_txt_' + i).children[0].innerText = item.name || '';
				$_id('grid_cell_' + i).style.visibility = 'visible';
			} else {
				$_id('grid_cell_' + i).style.visibility = 'hidden';
			}
		}
		var $pi = $_id('grid_page_indicator');
		if($pi != null){
			$pi.innerHTML = '' + (_this.dataView.currPage + 1) + ' / ' + _this.dataView.pageNum + ' 页';
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag, currPage);
};
ViewDefault.getPageData = function(callback, flag, currPage){
	var _this = this;
	if(this.dataView == null){
		my.paas.getNavigation(this.navPath, function(data){
			var items = data.children;
			var assets = [];
			var assetIds = [];
			for(var i = 0, len = items.length; i < len; i+=1){
				var item = items[i];
				if(item != null && item.node_class == 'asset'){
					var provider_id = item.metadata_public.ProviderId;
					var provider_asset_id = item.metadata_public.ProviderAssetId;
					assets.push({
						name: item.name,
						provider_id: provider_id,
						provider_asset_id: provider_asset_id
					});
					assetIds.push(provider_id + '_' + provider_asset_id);
				}
			}
			if(assets.length > 0){
				var url = my.paas.host + '/aquapaas/rest/search/content_by_id/asset?ids=' + assetIds.join(',');
				my.paas.request({
					type: 'GET',
					url: url,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					async: true,
					done: function(vods){
						vods = JSON.parse(vods);

						// 使数据变多
						var arr1 = [],arr2 = [];
						for(var i = 0; i < 8; i++){
							arr1[i] = vods[0];
						}
						vods = arr1;
						// console.log('vods',vods);
						for(var i = 0; i < 8; i++){
							arr2[i] = assets[0];
						}
						assets = arr2;

						for(var j = 0, jLen = assets.length; j < jLen; j+=1){
							var asset = assets[j];
							for(var k = 0, kLen = vods.length; k < kLen; k += 1){
								var vod = vods[k];
								if(asset.provider_id == vod.provider_id && asset.provider_asset_id == vod.provider_asset_id){
									asset.poster = parseAssetPoster(vod, 0);
									break;
								}
							}
						}
					},
					always: function(){
						_this.dataView = new PagedView(assets, 6);
						_this.dataView.getData(callback, flag, currPage);
					}
				}, ['app']);
			}
		});
	} else {
		this.dataView.getData(callback, flag, currPage);
	}
};
ViewDefault.changeGridFocus = function(){
	clearMarquee();
	var grid = this.grid;
	if(grid != null){
		var index = grid.focus.row * grid.colNum + grid.focus.col;
		var $cell = $_id('grid_cell_' + index);
		if($cell != null){
			var $sf = $_id('grid_focus');
			if($sf != null){
				var pos = this.focusPosition.grid[index];
				$sf.style.left = pos.left;
				$sf.style.top = pos.top;
				$sf.style.visibility = 'visible';

				var $epl = $_id('grid_txt_' + index).children[0];
				if($epl != null){
					if($epl.offsetWidth > $cell.clientWidth){
						$epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
					}
				}

				var item = this.gridData[index];
				if(item != null){
					var node = new ColumnNode(this.columnNode, item.name, index);
					this.gridColumnNode = node;
					this.collector.pageNum = this.dataView.currPage;
					this.collector.serviceNum = this.gridData.length;
					this.collector.columnID = node.getNodeId();
					this.collector.columnName = node.getNodePath();
					// this.collector.collect();
				}
			}
		}
	}
};
ViewDefault.up = function(){
	var _this = this;
	if(!this.grid.up()){
		this.setGridView(function(){
		  _this.changeGridFocus();
		}, -1);
		return false;
	}
	if(this.grid != null){
		this.changeGridFocus();
		return true;
	}
}
ViewDefault.down = function(){
	var _this = this;
	if(!this.grid.down()){
		this.setGridView(function(){
			_this.changeGridFocus();
		}, 1);
	}
	if(this.grid != null){
		this.changeGridFocus();
		return true;
	}
}
ViewDefault.left = function(){
	if(this.grid != null && this.grid.left()){
		this.changeGridFocus();
		return true;
	} else {
		this.show();
	}
};
ViewDefault.right = function(){
	var _this = this;
	if(!this.grid.right()){
		if (_this.grid.focus.row < _this.grid.rowNum - 1) {
		  _this.grid.focus.col = 0;
		  _this.grid.focus.row += 1;
		} else {
			this.setGridView(function(){
				_this.changeGridFocus();
			}, 1);
		}
	}
	if(this.grid != null){
		this.changeGridFocus();
		return true;
	}
}
ViewDefault.onFocusIn = function(){
	this.changeGridFocus();
};

ViewDefault.onFocusOut = function(){
	var $f = $_id('grid_focus');
	$f.style.visibility = '';
	clearMarquee();
};
ViewDefault.enterPressed = function(){
	var focus = this.grid != null ? this.grid.focus : null;
	if(focus != null){
		var index = focus.row * 3 + focus.col;
		var item = this.gridData[index];
		if(item != null){
			var pid = item.provider_id;
			var paid = item.provider_asset_id;
			this.storeFocus();
			// this.collector.collect();
			App.goPlayer({
				provider_id: pid,
				provider_asset_id: paid
			});
		}
	}

};
ViewDefault.pageDown = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, 1);
};
ViewDefault.pageUp = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, -1);
}
ViewDefault.storeFocus = function(){
	var pageFocus = {};
	if(this.dataView != null){
		pageFocus.dataView = {
			currPage: this.dataView.currPage
		};
	}
	if(this.grid != null){
		pageFocus.grid = {
			focus: this.grid.focus
		};
	}
	App.store.setValue('pageFocus', JSON.stringify(pageFocus));
}

function TabView(){}
TabView.prototype = ViewDefault;

var ViewAnother = new TabView();
ViewAnother.collector.pageID = '17';
ViewAnother.columnNode = new ColumnNode(Tabsv.columnNode, '曲种选段', '1');
