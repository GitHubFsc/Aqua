var PaaSTreeRoot = '/aquapaas/rest/navigation/trees/';

var RootNode = new ColumnNode(null, '年华', '1');

var Tabsv = {
	columnNode: new ColumnNode(RootNode, '养老生活', '10'),

	init: function(){
		this.isReady = false;
		this.navPath = NavigationRoot;
		VCollege.navPath = this.navPath + '/家庭护理';
		VNarrator.navPath = this.navPath + '/讲述者';
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
			if(page >= 0 && page <= this.focus.lmt.seq){
				this.focus.seq = page;
			}
		}
		setFocus(this, false, pageFocus != null);
		this.changeFocus(pageFocus);
	},
	setTabs: function(){

	},
	focus: {
		seq: 0,
		lmt: {
			seq: 1
		}
	},
	focusPosition: {
		focus: [{top: '76px', left: '811px', width: '195px', height: '85px', backgroundImage: 'img/cut/tab_focus_0.png'},
			{top: '76px', left: '1006px', width: '182px', height: '85px', backgroundImage: 'img/cut/tab_focus_1.png'}],
		select: [{top: '90px', left: '825px', width: '168px', height: '54px', backgroundImage: 'img/cut/tab_select_0.png'},
			{top: '90px', left: '1017px', width: '157px', height: '54px', backgroundImage: 'img/cut/tab_select_1.png'}]
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
			if(this.focus.seq > 0){
				this.focus.seq -= 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			if(this.focus.seq < this.focus.lmt.seq){
				this.focus.seq += 1;
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
		var $sel = $_id('tab_select');
		var pos = this.focusPosition.select[this.focus.seq];
		$sel.style.left = pos.left;
		$sel.style.width = pos.width;
		$sel.style.backgroundImage = 'url(' + pos.backgroundImage + ')';
		var $f = $_id('tab_focus');
		var fp = this.focusPosition.focus[this.focus.seq];
		$f.style.left = fp.left;
		$f.style.width = fp.width;
		$f.style.backgroundImage = 'url(' + fp.backgroundImage + ')';
		switch(this.focus.seq){
		case 0:
			VCollege.show(pageFocus);
			App.store.setValue('page', '0');
			break;
		case 1:
			VNarrator.show(pageFocus);
			App.store.setValue('page', '1');
			break;
		default:
			break;
		}
	},
	navToSub: function(){
		switch(this.focus.seq){
		case 0:
			VCollege.isReady && setFocus(VCollege);
			break;
		case 1:
			VNarrator.isReady && setFocus(VNarrator);
			break;
		default:
			break;
		}
	},
	onFocusIn: function(){
		$_id('tab_focus').style.visibility = 'visible';
		switch(this.focus.seq){
		case 0:
			VCollege.isReady && VCollege.collectTitle();
			break;
		case 1:
			VNarrator.isReady && VNarrator.collectTitle();
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

var VCollege = new UITab();
VCollege.focusPosition = {
	grid: [
	{top: '149px', left: '81px'}, {top: '149px', left: '627px'},
	{top: '382px', left: '81px'}, {top: '382px', left: '627px'}
	]
}
VCollege.gridSize = 4;
VCollege.gridColNum = 2;
VCollege.collector.pageID = '20';
VCollege.columnNode = new ColumnNode(Tabsv.columnNode, '家庭护理', '0');
VCollege.show = function(pageFocus){
	var _this = this;
	_this.isReady = false;
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';

	_this.dataView = null;
	_this.setGridView(function(){
		if(pageFocus != null){
			setFocus(_this);
		} else {
			_this.collector.collect();
		}
	}, null, pageFocus);
};
VCollege.collectTitle = function(){
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	this.collector.collect();
};
VCollege.setGridView = function(callback, flag, pageFocus){
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
			cols: _this.gridColNum,
			num: num
		});
		if(gridFocus != null){
			_this.grid.focus.col = gridFocus.col;
			_this.grid.focus.row = gridFocus.row;
		}

		for(var i = 0; i < _this.gridSize; i+=1){
			var item = data[i];
			if(item != null){
				$_id('grid_poster_' + i).setAttribute('src', (item.metadata && item.metadata['节目海报']) || item.poster || '');
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
		if(num > 0){
			_this.isReady = true;
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag, currPage);
};
VCollege.getPageData = function(callback, flag, currPage){
	var _this = this;
	if(this.dataView == null){
		my.paas.getNavigation(this.navPath, function(data){
			var items = data && data.children || [];
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
						_this.dataView = new PagedView(assets, _this.gridSize);
						_this.dataView.getData(callback, flag, currPage);
					}
				}, ['app']);
			} else {
				_this.dataView = new PagedView(assets, _this.gridSize);
				_this.dataView.getData(callback, flag, currPage);
			}
		});
	} else {
		this.dataView.getData(callback, flag, currPage);
	}
};
VCollege.changeGridFocus = function(){
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
					this.collector.collect();
				}
			}
		}
	}
};
VCollege.up = function(){
	if(this.grid != null && this.grid.up()){
		this.changeGridFocus();
		return true;
	} else {
		return false;
	}
}
VCollege.down = function(){
	if(this.grid != null && this.grid.down()){
		this.changeGridFocus();
		return true;
	}
}
VCollege.left = function(){
	if(this.grid != null && this.grid.left()){
		this.changeGridFocus();
		return true;
	}
};
VCollege.right = function(){
	if(this.grid != null && this.grid.right()){
		this.changeGridFocus();
		return true;
	}
}
VCollege.onFocusIn = function(){
	this.changeGridFocus();
};

VCollege.onFocusOut = function(){
	var $f = $_id('grid_focus');
	$f.style.visibility = '';
	clearMarquee();
};
VCollege.enterPressed = function(){
	var focus = this.grid != null ? this.grid.focus : null;
	if(focus != null){
		var index = focus.row * this.gridColNum + focus.col;
		var item = this.gridData[index];
		if(item != null){
			var pid = item.provider_id;
			var paid = item.provider_asset_id;
			this.storeFocus();
			this.collector.collect();
			App.goPlayer({
				provider_id: pid,
				provider_asset_id: paid
			});
		}
	}

};
VCollege.pageDown = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, 1);
};
VCollege.pageUp = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, -1);
}
VCollege.storeFocus = function(){
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
TabView.prototype = VCollege;

var VNarrator = new TabView();
VNarrator.columnNode = new ColumnNode(Tabsv.columnNode, '讲述者', '1');
