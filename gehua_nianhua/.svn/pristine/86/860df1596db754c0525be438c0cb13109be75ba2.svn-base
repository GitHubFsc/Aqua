var PaaSTreeRoot = '/aquapaas/rest/navigation/trees/';

var RootNode = new ColumnNode(null, '年华', '1');

var Tabsv = {
	columnNode: new ColumnNode(RootNode, '拾箴美术馆', '8'),

	init: function(){
		this.isReady = false;
		this.navPath = NavigationRoot;
		ViewDefault.navPath = this.navPath + '/艺术家';
		ViewCraft.navPath = this.navPath + '/艺术品';
		ViewSchool.navPath = this.navPath + '/艺学堂';
		ViewSight.navPath = this.navPath + '/艺识流';
		this.setTabs();
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
				this.focus.col = page;
			}
		}
		setFocus(this);
		if(pageFocus != null && pageFocus.isSearch){
			SearchInput.searchStr = pageFocus.searchStr;
			ViewSearch.show(pageFocus);
		} else {
			this.changeFocus(pageFocus);
		}
		SearchInput.init();
		this.isReady = true;
	},
	setTabs: function(){
		$_id('tab_0').innerText = '艺术家';
		$_id('tab_1').innerText = '艺术品';
		$_id('tab_2').innerText = '艺学堂';
		$_id('tab_3').innerText = '艺识流';
	},
	focus: {
		col: 0,
		lmt: {
			col: 3
		}
	},
	focusPosition: {
		focus: [{left: '486px'}, {left: '664px'}, {left: '842px'}, {left: '1020px'}]
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
		var $f = $_id('tab_focus');
		var fp = this.focusPosition.focus[this.focus.col];
		$f.style.left = fp.left;
		if(!pageFocus){
			$f.style.visibility = 'visible';
		}
		var $sel = $_class('tab_select')[0];
		if($sel != null){
			$sel.classList.remove('tab_select');
		}
		$_id('tab_' + this.focus.col).classList.add('tab_select');
		switch(this.focus.col){
		case 0:
			ViewDefault.show(pageFocus);
			App.store.setValue('page', '0');
			break;
		case 1:
			ViewCraft.show(pageFocus);
			App.store.setValue('page', '1');
			break;
		case 2:
			ViewSchool.show(pageFocus);
			App.store.setValue('page', '2');
			break;
		case 3:
			ViewSight.show(pageFocus);
			App.store.setValue('page', '3');
			break;
		default:
			break;
		}
		this.isSearch = false;
	},
	navToSub: function(){
		switch(this.focus.col){
		case 0:
			ViewDefault.isReady && setFocus(ViewDefault);
			break;
		case 1:
			ViewCraft.isReady && setFocus(ViewCraft);
			break;
		case 2:
			ViewSchool.isReady && setFocus(ViewSchool);
			break;
		case 3:
			ViewSight.isReady && setFocus(ViewSight);
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
		if(this.isReady){
			if(this.isSearch){
				this.changeFocus();
			} else {
				$_id('tab_focus').style.visibility = 'visible';
				switch(this.focus.col){
				case 0:
					ViewDefault.collectTitle();
					break;
				case 1:
					ViewCraft.collectTitle();
					break;
				case 2:
					ViewSchool.collectTitle();
					break;
				case 3:
					ViewSight.collectTitle();
					break;
				default:
					break;
				}
			}
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
	},
	onSearchShow: function(){
		var $sel = $_class('tab_select')[0];
		if($sel != null){
			$sel.classList.remove('tab_select');
		}
		this.isSearch = true;
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

var ViewDefault = new UITab();
ViewDefault.focusPosition = {
	grid: [
	{top: '160px', left: '387px'}, {top: '160px', left: '783px'},
	{top: '375px', left: '387px'}, {top: '375px', left: '783px'}
	]
};
ViewDefault.collector.pageID = '18';
ViewDefault.columnNode = new ColumnNode(Tabsv.columnNode, '艺术家', '0');
ViewDefault.show = function(pageFocus){
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
ViewDefault.collectTitle = function(){
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	this.collector.collect();
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
			cols: 2,
			num: num
		});
		if(gridFocus != null){
			_this.grid.focus.col = gridFocus.col;
			_this.grid.focus.row = gridFocus.row;
		}

		for(var i = 0; i < 4; i+=1){
			var item = data[i];
			if(item != null){
				$_id('grid_poster_' + i).setAttribute('src', item.poster || '');
				// $_id('grid_txt_' + i).children[0].innerText = item.name || '';
				$_id('grid_cell_' + i).style.visibility = 'visible';
			} else {
				$_id('grid_cell_' + i).style.visibility = 'hidden';
			}
		}
		var $pi = $_id('grid_page_indicator');
		if($pi != null){
			$pi.innerHTML = '第' + (_this.dataView.currPage + 1) + '页 / 共' + _this.dataView.pageNum + '页';
		}
		if(num > 0){
			_this.isReady = true;
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
						_this.dataView = new PagedView(assets, 4);
						_this.dataView.getData(callback, flag, currPage);
					}
				}, ['app']);
			} else {
				_this.dataView = new PagedView(assets, 4);
				_this.dataView.getData(callback, flag, currPage);
			}
		});
	} else {
		this.dataView.getData(callback, flag, currPage);
	}
};
ViewDefault.changeGridFocus = function(){
	// clearMarquee();
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

				// var $pfel = $_class('grid_focus')[0];
				// if($pfel != null){
					// $pfel.classList.remove('grid_focus');
				// }
				// $cell.classList.add('grid_focus');

				// var $epl = $_id('grid_txt_' + index).children[0];
				// if($epl != null){
					// if($epl.offsetWidth > $cell.clientWidth){
						// $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
					// }
				// }

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
ViewDefault.up = function(){
	if(this.grid != null && this.grid.up()){
		this.changeGridFocus();
		return true;
	} else {
		return false;
	}
};
ViewDefault.down = function(){
	if(this.grid != null && this.grid.down()){
		this.changeGridFocus();
		return true;
	}
};
ViewDefault.left = function(){
	if(this.grid != null && this.grid.left()){
		this.changeGridFocus();
		return true;
	} else {
		setFocus(SearchInput);
		return true;
	}
};
ViewDefault.right = function(){
	if(this.grid != null && this.grid.right()){
		this.changeGridFocus();
		return true;
	}
};
ViewDefault.onFocusIn = function(){
	this.changeGridFocus();
};

ViewDefault.onFocusOut = function(){
	var $f = $_id('grid_focus');
	$f.style.visibility = '';
	// var $pfel = $_class('grid_focus')[0];
	// if($pfel != null){
		// $pfel.classList.remove('grid_focus');
	// }
	// clearMarquee();
};
ViewDefault.enterPressed = function(){
	var focus = this.grid != null ? this.grid.focus : null;
	if(focus != null){
		var index = focus.row * this.grid.colNum + focus.col;
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
};
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
};

function TabView(){}
TabView.prototype = ViewDefault;

var ViewCraft = new TabView();
ViewCraft.collector.pageID = '18';
ViewCraft.columnNode = new ColumnNode(Tabsv.columnNode, '艺术品', '1');

var ViewSchool = new TabView();
ViewSchool.collector.pageID = '18';
ViewSchool.columnNode = new ColumnNode(Tabsv.columnNode, '艺学堂', '2');

var ViewSight = new TabView();
ViewSight.collector.pageID = '18';
ViewSight.columnNode = new ColumnNode(Tabsv.columnNode, '艺识流', '3');

var ViewSearch = new TabView();
ViewSearch.collector.pageID = '18';
ViewSearch.columnNode = new ColumnNode(Tabsv.columnNode, '搜索', '4');
ViewSearch.show = function(pageFocus){
	Tabsv.onSearchShow();
	var _this = this;
	_this.isReady = false;
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '1';

	_this.dataView = null;
	_this.setGridView(function(){
		if(pageFocus != null){
			setFocus(_this);
		} else {
			_this.collector.collect();
		}
	}, null, pageFocus);
};
ViewSearch.onFocusIn = function(){
	this.collector.serviceEntrance = '0';
	this.changeGridFocus();
};
ViewSearch.getPageData = function(callback, flag, currPage){
	var _this = this;
	if(this.dataView == null){
		my.paas.request({
			url: my.paas.host + '/aquapaas/rest/search/contents/intelligent/vod?visible=true&person_slot=&title_slot=&properties=title,posterboard,packageposterboard,category,provider_id,provider_asset_id'
				+ '&missing_field=bundle_id&keyword=' + SearchInput.searchStr,
			type: 'POST',
			data: JSON.stringify(["tags=navpath:vod/H0/歌华业务扩展/年华/拾箴美术馆&tags_op=lk"]),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			done: function(data){
				var json = null;
				try{
					json = JSON.parse(data);
				}catch(e){
					log(e.message);
				}
				var items = json || [];
				var assets = [];
				// var assetIds = [];
				for(var i = 0, len = items.length; i < len; i+=1){
					var item = items[i];
					// if(item != null && item.node_class == 'asset'){
						// var provider_id = item.metadata_public.ProviderId;
						// var provider_asset_id = item.metadata_public.ProviderAssetId;
						// assets.push({
							// name: item.name,
							// provider_id: provider_id,
							// provider_asset_id: provider_asset_id
						// });
						// assetIds.push(provider_id + '_' + provider_asset_id);
					// }
					if(item != null){
						assets.push({
							name: item.title,
							provider_id: item.provider_id,
							provider_asset_id: item.provider_asset_id,
							poster: parseAssetPoster(item, 0)
						});
					}
				}
				_this.dataView = new PagedView(assets, 4);
				_this.dataView.getData(callback, flag, currPage);
			// if(assets.length > 0){
				// var url = my.paas.host + '/aquapaas/rest/search/content_by_id/asset?ids=' + assetIds.join(',');
				// my.paas.request({
					// type: 'GET',
					// url: url,
					// headers: {
						// 'Accept': 'application/json',
						// 'Content-Type': 'application/json'
					// },
					// async: true,
					// done: function(vods){
						// vods = JSON.parse(vods);
						// for(var j = 0, jLen = assets.length; j < jLen; j+=1){
							// var asset = assets[j];
							// for(var k = 0, kLen = vods.length; k < kLen; k += 1){
								// var vod = vods[k];
								// if(asset.provider_id == vod.provider_id && asset.provider_asset_id == vod.provider_asset_id){
									// asset.poster = parseAssetPoster(vod, 0);
									// break;
								// }
							// }
						// }
					// },
					// always: function(){
						// _this.dataView = new PagedView(assets, 4);
						// _this.dataView.getData(callback, flag, currPage);
					// }
				// }, ['app']);
			// } else {
				// _this.dataView = new PagedView(assets, 4);
				// _this.dataView.getData(callback, flag, currPage);
			// }
			},
			fail: function(){
				_this.dataView = new PagedView([], 4);
				_this.dataView.getData(callback, flag, currPage);
			}
		}, ['app']);
	} else {
		this.dataView.getData(callback, flag, currPage);
	}
};
ViewSearch.storeFocus = function(){
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
	pageFocus.isSearch = true;
	pageFocus.searchStr = SearchInput.searchStr;
	App.store.setValue('pageFocus', JSON.stringify(pageFocus));
};

var SearchInput = new UITab();
SearchInput.searchStr = '';
SearchInput.focus = {
	row: 0,
	lmt: {
		row: 1
	}
};
SearchInput.init = function(){
	this.setInput();
	$_id('search_btn').innerText = '搜 索';
};
SearchInput.setInput = function(){
	var $in = $_id('search_input');
	if(this.searchStr == null || this.searchStr == ''){
		$in.innerText = '请输入搜索内容';
		$in.classList.add('placeholder');
	} else {
		$in.innerText = this.searchStr;
		$in.classList.remove('placeholder');
	}
};
SearchInput.up = function(){
	if(this.focus.row == 1){
		this.focus.row -= 1;
		this.changeFocus();
		return true;
	} else {
		return false;
	}
};
SearchInput.down = function(){
	if(this.focus.row == 0){
		this.focus.row += 1;
		this.changeFocus();
	}
	return true;
};
SearchInput.right = function(){
	if(Tabsv.isSearch){
		ViewSearch.isReady && setFocus(ViewSearch);
	} else {
		Tabsv.navToSub();
	}
	return true;
};
SearchInput.enterPressed = function(){
	if(this.focus.row == 1){
		if(this.searchStr != null && this.searchStr != ''){
			ViewSearch.show();
		}
	} else if(this.focus.row == 0){
		InputKeyboard.show(this);
	}
};
SearchInput.numInput = function(digit){
	if(this.focus.row == 0){
		this.searchStr += digit;
		this.setInput();
	}
};
SearchInput.back = function(){
	if(this.focus.row == 0){
		this.searchStr = this.searchStr.slice(0, -1);
		this.setInput();
		return true;
	}
	return false;
};
SearchInput.changeFocus = function(){
	switch(this.focus.row){
	case 0:
		$_id('search_input_focus').style.visibility = 'visible';
		$_id('search_btn_focus').style.visibility = '';
		break;
	case 1:
		$_id('search_input_focus').style.visibility = '';
		$_id('search_btn_focus').style.visibility = 'visible';
		break;
	}
};
SearchInput.onFocusIn = function(){
	this.focus.row = 0;
	this.changeFocus();
};
SearchInput.onFocusOut = function(){
	$_id('search_input_focus').style.visibility = '';
	$_id('search_btn_focus').style.visibility = '';
};
SearchInput.onKeyboardIn = function(value){
	if(value == 'clear'){
		this.searchStr = '';
	} else if(value == 'backspace'){
		this.searchStr = this.searchStr.slice(0, -1);
	} else {
		this.searchStr += value;
	}
	this.setInput();
};

var InputKeyboard = {
	show: function(anchor){
		this.anchor = anchor;
		$_id('keyboard_box').style.visibility = 'visible';
		setFocus(this, true, true);
	},
	focusPosition:{
		grid: [
		{left: '8px', top: '0'}, {left: '118px', top: '0'}, {left: '228px', top: '0'},
		{left: '8px', top: '57px'}, {left: '118px', top: '57px'}, {left: '228px', top: '57px'},
		{left: '8px', top: '114px'}, {left: '118px', top: '114px'}, {left: '228px', top: '114px'},
		{left: '8px', top: '176px'}, {left: '118px', top: '176px'}, {left: '228px', top: '176px'}
		]
	},
	focus: {
		index: 0,
		lmt: 11
	},
	values: [
		['1'],                     ['A', 'B', 'C', '2'], ['D', 'E', 'F', '3'],
		['G', 'H', 'I', '4'],      ['J', 'K', 'L', '5'], ['M', 'N', 'O', '6'],
		['P', 'Q', 'R', 'S', '7'], ['T', 'U', 'V', '8'], ['W', 'X', 'Y', 'Z', '9'],
		['clear'],                 ['0'],                ['backspace']
	],
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.left:
		case keyValue.LEFT:
			if(this.focus.index - 1 >= 0){
				this.focus.index -= 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			if(this.focus.index + 1 <= this.focus.lmt){
				this.focus.index += 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.up:
		case keyValue.UP:
			if(this.focus.index - 3 >= 0){
				this.focus.index -= 3;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			if(this.focus.index + 3 <= this.focus.lmt){
				this.focus.index += 3;
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
			this.hide();
			return false;
			break;
		case keyValue.pageup:
		case keyValue.pageUp:
		case keyValue.PageUp:
		case keyValue.PAGEUP:
			return false;
			break;
		case keyValue.pagedown:
		case keyValue.pageDown:
		case keyValue.PageDown:
		case keyValue.PAGEDOWN:
			return false;
			break;
		case keyValue.enter:
		case keyValue.ENTER:
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
			this.inputValue(code - 48);
			return false;
			break;
		default:
			break;
		}
	},
	hide: function(){
		$_id('keyboard_box').style.visibility = '';
		setFocus(this.anchor, true, true);
		this.anchor = null;
	},
	inputValue: function(val){
		if(this.anchor != null){
			this.anchor.onKeyboardIn(val);
		}
	},
	enterPressed: function(){
		var index = this.focus.index;
		var values = this.values[index];
		if(values.length == 1){
			this.inputValue(values[0]);
		} else {
			this.valuePop.show(values, index);
		}
	},
	changeFocus: function(){
		var index = this.focus.index;
		var pos = this.focusPosition.grid[index];
		var $f = $_id('keyboard_focus');
		$f.style.left = pos.left;
		$f.style.top = pos.top;
	},

	valuePop: {
		position: [
		{left: '', top: ''}, {left: '128px', top: '56px'}, {left: '238px', top: '56px'},
		{left: '16px', top: '113px'}, {left: '128px', top: '113px'}, {left: '238px', top: '113px'},
		{left: '16px', top: '170px'}, {left: '128px', top: '170px'}, {left: '238px', top: '170px'}
		],
		show: function(values, fcIndex){
			this.values = values;
			var $pop = $_id('keyboard_valuepop');
			var num = values.length;
			this.focus = {
				index: 0,
				lmt: num - 1
			};
			var html = '';
			for(var i = 0; i < num; i+=1){
				var val = values[i];
				html += '<div class="keyboard_popitem">' + val + '</div>';
			}
			$pop.innerHTML = html;
			var pos = this.position[fcIndex];
			$pop.style.left = pos.left;
			$pop.style.top = pos.top;
			$pop.style.visibility = 'visible';
			setFocus(this, true);
		},
		onKeyEvent: function(e){
			var code = e.which || e.keyCode;
			switch(code){
			case keyValue.left:
			case keyValue.LEFT:
				if(this.focus.index -1 >= 0){
					this.focus.index -= 1;
					this.changeFocus();
				}
				return false;
				break;
			case keyValue.right:
			case keyValue.RIGHT:
				if(this.focus.index + 1 <= this.focus.lmt){
					this.focus.index += 1;
					this.changeFocus();
				}
				return false;
				break;
			case keyValue.up:
			case keyValue.UP:
				this.hide();
				return false;
				break;
			case keyValue.down:
			case keyValue.DOWN:
				return false;
				break;
			case keyValue.back:
			case keyValue.BACK:
			case keyValue.Back:
			case keyValue.quit:
			case keyValue.QUIT:
			case keyValue.Quit:
				this.hide();
				return false;
				break;
			case keyValue.enter:
			case keyValue.ENTER:
				this.enterPressed();
				return false;
			default:
				break;
			}
		},
		enterPressed: function(){
			var index = this.focus.index;
			var value = this.values[index];
			InputKeyboard.inputValue(value);
		},
		onFocusIn: function(){
			this.changeFocus();
		},
		changeFocus: function(){
			var index = this.focus.index;
			var $pops = $_id('keyboard_valuepop').children;
			var $pf = $_class('keyboard_pop_focus')[0];
			if($pf != null){
				$pf.classList.remove('keyboard_pop_focus');
			}
			var $f = $pops[index];
			if($f != null){
				$f.classList.add('keyboard_pop_focus');
			}
		},
		hide: function(){
			$_id('keyboard_valuepop').style.visibility = '';
			setFocus(InputKeyboard, true, true);
		}
	}
};
