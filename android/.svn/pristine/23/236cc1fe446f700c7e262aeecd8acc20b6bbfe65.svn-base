function AppRepoint(){

}
AppRepoint.prototype = {
	init: function(){

	},

	keys: ['P', 'C', 'CN', 'PN', 'SN', 'SE', 'PM', 'CE', 'PE'],

	pageID: '',
	columnID: '',
	columnName: '',
	pageNum: 0,
	serviceNum: 0,
	serviceEntrance: '0',
	PaymentMethod: 0,
	Codeerror: '0',
	Payerror: '0',

	getValues: function(){
		var vals = [];
		vals.push(this.pageID);
		vals.push(this.columnID);
		vals.push(this.columnName);
		vals.push(this.pageNum);
		vals.push(this.serviceNum);
		vals.push(this.serviceEntrance);
		vals.push(this.PaymentMethod);
		vals.push(this.Codeerror);
		vals.push(this.Payerror);
		return vals;
	},

	// //  埋点
	// collect: function(){
	// 	if(typeof reportData == 'function'){
	// 		reportData({
	// 			pageID: this.pageID,
	// 			columnID: this.columnID,
	// 			columnName: this.columnName,
	// 			pageNum: this.pageNum,
	// 			serviceNum: this.serviceNum,
	// 			serviceEntrance: this.serviceEntrance,
	// 			PaymentMethod: this.PaymentMethod,
	// 			Codeerror: this.Codeerror,
	// 			Payerror: this.Payerror,
	// 		});
	// 	}
	// }
};

var PaaSTreeRoot = '/aquapaas/rest/navigation/trees/';

var Youai = {
	init: function(){
		UiCatStar.navPath = this.navPath + '/年华明星';
		UiCatGroup.navPath = this.navPath + '/艺术团';
		UiCatCast.navPath = this.navPath + '/演出实况';
		UiCatActs.navPath = this.navPath + '/近期活动';
		this.columnNode = new ColumnNode(RootNode, '有哎社区', '0');
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
		this.changeFocus(pageFocus);
	},
	focus: {
		col: 1,
		lmt: {
			col: 3,
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
		var $pre = $$('.entry_focus')[0];
		if($pre != null){
			$pre.classList.remove('entry_focus');
		}
		var $el = $$('.entry')[this.focus.col];
		if($el != null){
			$el.classList.add('entry_focus');
		}
		switch(this.focus.col){
		case 0:
			UiCatStar.show(pageFocus);
			App.store.setValue('page', '0')
			break;
		case 1:
			UiCatGroup.show(pageFocus);
			App.store.setValue('page', '1')
			break;
		case 2:
			UiCatCast.show(pageFocus);
			App.store.setValue('page', '2')
			break;
		case 3:
			UiCatActs.show(pageFocus);
			App.store.setValue('page', '3')
			break;
		default:
			break;
		}
	},
	navToSub: function(){
		switch(this.focus.col){
		case 0:
			setFocus(UiCatStar);
			break;
		case 1:
			var elIndex = this.findShowingSector();
			if(elIndex == 0){
				setFocus(UiCatGroup);
			} else if(elIndex == 1){
				setFocus(UiGroupDetail);
			}
			break;
		case 2:
			setFocus(UiCatCast);
			break;
		case 3:
			setFocus(UiCatActs);
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
		var $s = $$('.entry_selected')[0];
		if($s != null){
			$s.classList.remove('entry_selected');
			$s.classList.add('entry_focus');
		}
	},
	onFocusOut: function(){
		var $f = $$('.entry_focus')[0];
		if($f != null){
			$f.classList.remove('entry_focus');
			$f.classList.add('entry_selected');
		}
	}
};

function PagedView(data, pageSize){
	if(data != null && typeof data.length != 'undefined'){
		this.data = data;
	} else {
		this.data = [];
	}
	this.pageSize = pageSize > 0 ? pageSize: 1;
	this.init();
}

PagedView.prototype = {
	init: function(){
		this.currPage = 0;
		this.length = this.data.length;
		var pageNum = Math.ceil(this.length/this.pageSize);
		this.pageLmt = pageNum - 1;
		this.pageNum = pageNum;
	},

	previous: function(){
		if(this.currPage > 0){
			this.currPage -=  1;
			return true;
		} else {
			return false;
		}
	},

	next: function(){
		if(this.currPage < this.pageLmt){
			this.currPage += 1;
			return true;
		} else {
			return false;
		}
	},

	getData: function(callback, flag, currPage){
		if(currPage != null){
			this.currPage = currPage;
		} else {
			if(flag > 0){
				if(!this.next()){
					return false;
				}
			} else if(flag < 0) {
				if(!this.previous()){
					return false;
				}
			}
		}
		var start = this.currPage * this.pageSize;
		var end = start + this.pageSize;
		start = Math.min(start, this.length - 1);
		end = Math.min(end, this.length);
		var arr = [];
		if(this.length > 0){
			for(var i = start; i < end; i += 1){
				arr.push(this.data[i]);
			}
		}
		if(typeof callback == 'function'){
			callback(arr);
		}
	}
};

function UiCat(){
	this.collector = new AppRepoint();
}

UiCat.prototype = {
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
				setFocus(Youai);
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

var UiCatStar = new UiCat();
UiCatStar.focusPosition = {
	grid: [
	{left: '82px', top: '178px'}, {left: '464px', top: '178px'}, {left: '856px', top: '178px'},
	{left: '82px', top: '406px'}, {left: '464px', top: '406px'}, {left: '856px', top: '406px'}
	]
};
UiCatStar.collector.pageID = '10';
UiCatStar.show = function(pageFocus){
	var _this = this;
	this.columnNode = new ColumnNode(Youai.columnNode, '年华明星', '0');
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	Youai.setSector('uistar', function(){
		// _this.tgBit = null;
		_this.dataView = null;
		_this.setGridView(function(){
			if(pageFocus != null){
				setFocus(_this);
			// } else {
			// 	_this.collector.collect();
			}
		}, null, pageFocus);
	});
};
UiCatStar.setGridView = function(callback, flag, pageFocus){
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
		var grid = _this.grid;
		var $f = $_f();
		for(var i = 0; i < grid.rowNum; i+=1){
			var $row = $_('div');
			$row.className = 'grid_row';
			for(var j = 0; j < grid.colNum; j+=1){
				var index = i * grid.colNum + j;
				if(index < num){
					var item = data[index];
					var $el = $_('div');
					$el.className = 'grid_el';
					var $poster = $_('div');
					$poster.className = 'grid_el_poster';
					$img = $_('img');
					$img.className = 'poster';
					$img.src = item.poster || '';
					$poster.appendChild($img);
					var $txt = $_('div');
					$txt.className = 'grid_el_txt';
					$txt.innerHTML = checkToMarquee(item.name || '');
					$el.appendChild($poster);
					$el.appendChild($txt);
					$row.appendChild($el);
				} else {
					break;
				}
			}
			$f.appendChild($row);
		}
		var $grid = $$('.star_grid')[0];
		if($grid != null) {
			$grid.innerHTML = '';
			$grid.appendChild($f);
		}
		var $pi = $$('.page_indicator')[0];
		if($pi != null){
			$pi.innerHTML = '第' + (_this.dataView.currPage + 1) + '页/共' + _this.dataView.pageNum + '页';
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag, currPage);
};
UiCatStar.getPageData = function(callback, flag, currPage){
	// if(this.tgBit != null){
		// this.tgBit = Number(!this.tgBit);
	// } else {
		// this.tgBit = 0;
	// }
	// var url = 'test/list' + this.tgBit + '.json';
	// App.getJson(url, function(data){
		// var num = data.length;
		// if(typeof callback == 'function'){
			// callback(data, num)
		// }
	// })
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
					always: function(xhr){
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
UiCatStar.changeGridFocus = function(){
	clearMarquee();
	var grid = this.grid;
	// var $pr = $$('.grid_focus')[0];
	// if($pr != null){
		// $pr.classList.remove('grid_focus');
	// }
	if(grid != null){
		var row = grid.focus.row;
		var $row = $$('.grid_row')[row];
		if($row != null){
			var col = grid.focus.col;
			var $el = $row.children[col];
			if($el != null){
				// $el.classList.add('grid_focus');
				var $sf = $$('.star_grid_focus')[0];
				if($sf != null){
					// var rect = $el.getBoundingClientRect();
					// if(rect.left > 0 && rect.top > 0){
						// $sf.style.left = (rect.left - 4) + 'px';
						// $sf.style.top = (rect.top - 4) + 'px';
					// }

					var index = row * grid.colNum + col;

					var pos = this.focusPosition.grid[index];
					$sf.style.left = pos.left;
					$sf.style.top = pos.top;
					$sf.style.display = 'block';

					var $epl = $$('.txt_marquee_placer', $el)[0];
					if($epl != null){
						if($epl.offsetWidth > $el.clientWidth){
							$epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
						}
					}

					var item = this.gridData[index];

					log('item明星==='+JSON.stringify(item));
					// 测试ftp海报为何拿不到
					var bgImgUrl = item.poster;
					try {
						my.paas.request({
							type: 'GET',
							url: bgImgUrl,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							async: true,
							done: function(resp){
								log('resp==='+JSON.stringify(resp))
							},
							always: function(xhr){
								// log('xhr=='+JSON.stringify(xhr));
								// log('xhr.readyState==='+xhr.readyState);
								// log('xhr.status==='+xhr.status);
							}
						}, []);
					} catch (error) {
						log('error.message'+error.message);
					}

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
	}
};
UiCatStar.up = function(){
	if(this.grid != null && this.grid.up()){
		this.changeGridFocus();
		return true;
	} else {
		this.show();
		return false;
	}
}
UiCatStar.down = function(){
	var _this = this;
	if(!this.grid.down()){  //更改切换聚焦逻辑，最后一行内容翻页
		this.setGridView(function(){
			_this.changeGridFocus();
		}, 1);
	}
	if(this.grid != null){
		this.changeGridFocus();
	}
}
UiCatStar.left = function(){
	var _this = this;
	if(!this.grid.left()){  //更改切换聚焦逻辑，当前页面第一个内容翻页
		if (_this.grid.focus.col == 0 && _this.grid.focus.row > 0) {
		  _this.grid.focus.col = _this.grid.focus.lmt.col;
		  _this.grid.focus.row -= 1;
		}
		this.setGridView(function(){  //翻页回到最后一个内容
		  _this.grid.focus.col = _this.grid.focus.lmt.col;
		  _this.grid.focus.row = _this.grid.focus.lmt.row;
		  _this.changeGridFocus();
		}, -1);
	}
	if(this.grid != null){
		this.changeGridFocus();
	}
};
UiCatStar.right = function(){
	var _this = this;
	if(!this.grid.right()){  //更改切换聚焦逻辑，最后一个内容翻页
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
	}
}
UiCatStar.onFocusIn = function(){
	this.changeGridFocus();
	// var $f = $$('.star_grid_focus')[0];
	// if($f != null){
		// $f.style.display = 'block';
	// }
};

UiCatStar.onFocusOut = function(){
	var $f = $$('.star_grid_focus')[0];
	if($f != null){
		$f.style.display = 'none';
	}
	// var $sf = $$('.grid_focus')[0];
	// if($sf != null){
		// $sf.classList.remove('grid_focus');
	// }
	clearMarquee();
};
UiCatStar.enterPressed = function(){
	var focus = this.grid != null ? this.grid.focus : null;
	if(focus != null){
		var index = focus.row * 3 + focus.col;
		var item = this.gridData[index];
		// var vod = item.metadata['视频'];
		// if(vod != null && vod.indexOf('+') > -1){
		if(item != null){
			// var ids = vod.split('+');
			// var pid = ids[0];
			// var paid = ids[1];
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
UiCatStar.pageDown = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, 1);
};
UiCatStar.pageUp = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, -1);
}
UiCatStar.storeFocus = function(){
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

var UiCatGroup = new UiCat();
UiCatGroup.focusPosition = {
	grid: [
	{left: '232px', top: '194px'}, {left: '556px', top: '194px'}, {left: '878px', top: '194px'},
	{left: '232px', top: '409px'}, {left: '556px', top: '409px'}, {left: '878px', top: '409px'}
	],
	nav: [
	{top: '205px'}, {top: '262px'}
	]
}
UiCatGroup.collector.pageID = '10';
UiCatGroup.show = function(pageFocus){
	var _this = this;
	this.columnNode = new ColumnNode(Youai.columnNode, '艺术团', '1');
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	Youai.setSector('uigroup', function(){
		var inputNum = '';
		if(pageFocus != null && typeof pageFocus.inputNum == 'string'){
			inputNum = pageFocus.inputNum;
		}
		_this.inputNum = inputNum;
		_this.setNavView(pageFocus);
		_this.setSearchStr(_this.inputNum);
	});
};
UiCatGroup.setNavView = function(pageFocus){
	var _this = this;
	this.getNavData(function(){
		// _this.navData = ['合唱', '模特', '舞蹈', '器乐'];
		_this.navData = ['合唱', '模特'];
		_this.navNodes = [
			new ColumnNode(_this.columnNode, '合唱', '0'),
			new ColumnNode(_this.columnNode, '模特', '1')
			// new ColumnNode(_this.columnNode, '舞蹈', '2'),
			// new ColumnNode(_this.columnNode, '器乐', '3')
		];
		_this.navGrid = new GridNav({
			col: 1,
			num: 4
		});
		var navFocus;
		if(pageFocus != null && pageFocus.navGrid != null){
			navFocus = pageFocus.navGrid.focus;
		}
		if(navFocus != null){
			_this.navGrid.focus.col = navFocus.col;
			_this.navGrid.focus.row = navFocus.row;
		}
		_this.changeNavFocus(pageFocus);
		if(pageFocus != null && pageFocus.isSearch){
			_this.searchGroup(pageFocus);
		}
	});
};
UiCatGroup.getNavData = function(callback){
	if(typeof callback == 'function'){
		callback();
	}
};
UiCatGroup.changeNavFocus = function(pageFocus){
	var _this = this;
	var grid = this.navGrid;
	if(grid != null){
		var $ia = $$('.input_active')[0];
		if($ia != null){
			$ia.classList.remove('input_active');
		}
		var row = grid.focus.row;
		if(row <= 1) {
			this.setSearchStr(this.inputNum);
			var $pr = $$('.grp_nav_el_focus')[0];
			if($pr != null){
				$pr.classList.remove('grp_nav_el_focus');
			}
			var $nav = $$('.grp_nav_item')[row];
			if($nav != null){
				$nav.classList.add('grp_nav_el_focus');
				// var rect = $nav.getBoundingClientRect();
				var $nf = $$('.grp_nav_focus')[0];
				// if($nf != null && rect.top > 0){
				if($nf != null){
					$nf.classList.remove('search_in');
					$nf.classList.remove('search_btn');
					// $nf.style.top = rect.top + 'px';
					var pos = this.focusPosition.nav[row];
					$nf.style.top = pos.top;
				}
			}
			this.selectedNav = this.navData[row];
			this.selectedNavNode = this.navNodes[row];
			this.collector.columnID = this.selectedNavNode.getNodeId();
			this.collector.columnName = this.selectedNavNode.getNodePath();
			this.setGridView(function(){
				if(pageFocus != null){
					setFocus(_this);
				// } else {
				// 	_this.collector.collect();
				}
			}, null, pageFocus);
		} else if(row == 2){
			var $nf = $$('.grp_nav_focus')[0];
			if($nf != null){
				$nf.classList.remove('search_btn');
				$nf.classList.add('search_in');
				$nf.style.top = '';
			}
			var $si = $$('.grp_search_in')[0];
			$si.classList.add('input_active');
			this.setSearchStr(this.inputNum, true);
		} else if(row == 3){
			this.setSearchStr(this.inputNum);
			var $nf = $$('.grp_nav_focus')[0];
			if($nf != null){
				$nf.classList.remove('search_in');
				$nf.classList.add('search_btn');
				$nf.style.top = '';
			}
		}
	}
};
UiCatGroup.changeGridFocus = function(){
	clearMarquee();
	// var $pr = $$('.grp_el_focus')[0];
	// if($pr != null){
		// $pr.classList.remove('grp_el_focus');
	// }
	var $grid = $$('.grp_grid')[0];
	var grid = this.grid;
	if(grid != null){
		var row = grid.focus.row;
		var $row = $$('.grid_row', $grid)[row];
		if($row != null){
			var col = grid.focus.col;
			var $el = $row.children[col];
			if($el != null){
				// $el.classList.add('grp_el_focus');
				var $sf = $$('.grp_grid_focus')[0];
				if($sf != null){
					// var rect = $el.getBoundingClientRect();
					// if(rect.left > 0 && rect.top > 0){
						// $sf.style.left = (rect.left - 5) + 'px';
						// $sf.style.top = (rect.top - 5) + 'px';
						// $sf.style.display = 'block';
					// }

					var index = row * grid.colNum + col;

					var pos = this.focusPosition.grid[index];
					$sf.style.left = pos.left;
					$sf.style.top = pos.top;
					$sf.style.display = 'block';

					var $epl = $$('.txt_marquee_placer', $el)[0];
					if($epl != null){
						if($epl.offsetWidth > $el.clientWidth){
							$epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
						}
					}

					var item = this.gridData[index];

					log('item艺术团==='+JSON.stringify(item));
					// 测试ftp海报为何拿不到
					var bgImgUrl = item.poster;
					try {
						my.paas.request({
							type: 'GET',
							url: bgImgUrl,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							async: true,
							done: function(resp){
								log('resp==='+JSON.stringify(resp))
							},
							always: function(xhr){
								// log('xhr=='+JSON.stringify(xhr));
								// log('xhr.readyState==='+xhr.readyState);
								// log('xhr.status==='+xhr.status);
							}
						}, []);
					} catch (error) {
						log('error.message'+error.message);
					}
					
					if(item != null){
						var node = new ColumnNode(this.selectedNavNode, item.name, index);
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
	}
};
UiCatGroup.setGridView = function(callback, flag, pageFocus, isSearch){
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
		var grid = _this.grid;
		var $f = $_f();
		for(var i = 0; i < grid.rowNum; i+=1){
			var $row = $_('div');
			$row.className = 'grid_row';
			for(var j = 0; j < grid.colNum; j+=1){
				var index = i * grid.colNum + j;
				if(index < num){
					var item = data[index];
					var $el = $_('div');
					$el.className = 'grid_el';
					var $poster = $_('div');
					$poster.className = 'grid_el_poster';
					$img = $_('img');
					$img.className = 'poster';
					$img.src = item.metadata['预览图'] || '';
					$poster.appendChild($img);
					var $txt = $_('div');
					$txt.className = 'grid_el_txt';
					$txt.innerHTML = checkToMarquee(item.name || '');
					$el.appendChild($poster);
					$el.appendChild($txt);
					$row.appendChild($el);
				} else {
					break;
				}
			}
			$f.appendChild($row);
		}
		var $grid = $$('.grp_grid')[0];
		if($grid != null){
			$grid.innerHTML = '';
			$grid.appendChild($f);
		}
		var $pi = $$('.page_indicator')[0];
		if($pi != null){
			$pi.innerHTML = '第' + (_this.dataView.currPage + 1) + '页/共' + _this.dataView.pageNum + '页';
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag, currPage, isSearch);
};
UiCatGroup.getPageData = function(callback, flag, currPage, isSearch){
	// if(this.tgBit != null){
		// this.tgBit = Number(!this.tgBit);
	// } else {
		// this.tgBit = 0;
	// }
	// var url = 'test/grp' + this.tgBit + '.json';
	// App.getJson(url, function(data){
		// var num = data.length;
		// if(typeof callback == 'function'){
			// callback(data, num)
		// }
	// });
	var _this = this;
	if(flag != null){
		this.dataView.getData(callback, flag, currPage);
	} else {
		if(isSearch){
			var url = my.paas.host + '/aquapaas/rest/navigation/trees/nodes/';
			url += Youai.navPath.replace(PaaSTreeRoot, '');
			url += '?key=metadata.艺术团编号&value=' + this.inputNum + '&op=lk&enable=all';
			my.paas.request({
				url: url,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				done: function(data){
					log('Search ok.');
					try{
						var items = JSON.parse(data);
						_this.dataView = new PagedView(items, 6);
						_this.dataView.getData(callback, flag, currPage);
					}catch(e){
						log(e.message);
					}
				},
				fail: function(xhr){
					log('Search fail: ' + this.inputNum + ', ' + xhr.status)
				}
			}, ['app']);
		} else {
			this.nodePath = this.navPath + '/' + this.selectedNav;
			my.paas.getNavigation(this.nodePath, function(data){
				var items = data.children;
				_this.dataView = new PagedView(items, 6);
				_this.dataView.getData(callback, flag, currPage);
			});
		}
	}
};
UiCatGroup.removeGridFocus = function(){
	var $of = $$('.grp_grid_focus')[0];
	if($of != null){
		$of.style.display = 'none';
	}
	// var $gf = $$('.grp_el_focus')[0];
	// if($gf != null){
		// $gf.classList.remove('grp_el_focus');
	// }
};
UiCatGroup.addNavFocus = function(){
	var $f = $$('.grp_nav_focus')[0];
	if($f != null){
		$f.style.display = 'block';
		if($f.classList.contains('search_in')){
			var $si = $$('.grp_search_in')[0];
			$si.classList.add('input_active');
			this.setSearchStr(this.inputNum, true);
		}
	}
};
UiCatGroup.removeNavFocus = function(){
	var $f = $$('.grp_nav_focus')[0];
	if($f != null){
		$f.style.display = 'none';
	}
	var $ia = $$('.input_active')[0];
	if($ia != null){
		$ia.classList.remove('input_active');
	}
	this.setSearchStr(this.inputNum);
};
UiCatGroup.left = function(){
	if(!this.isNav){
		if(this.grid != null && this.grid.left()){
			this.changeGridFocus();
			return true;
		} else {
			this.isNav = true;
			clearMarquee();
			this.removeGridFocus();
			this.addNavFocus();
		}
	}
	return true;
};
UiCatGroup.right = function(){
	var _this = this;
	if(this.isNav){
		this.isNav = false;
		_this.grid.focus.row = 0;
		this.removeNavFocus();
		this.changeGridFocus();
	} else {
		if(!this.grid.right()){  //更改切换聚焦逻辑，最后一个内容翻页
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
	return true;
};
UiCatGroup.up = function(){
	if(this.isNav){
		if(this.navGrid != null && this.navGrid.up()){
			this.changeNavFocus();
			return true;
		} else {
			return false;
		}
	} else {
		if(this.grid != null && this.grid.up()){
			this.changeGridFocus();
			return true;
		} else {
			this.show();
			return false;
		}
	}
};
UiCatGroup.down = function(){
	var _this = this;
	if(this.isNav){
		if(this.navGrid != null && this.navGrid.down()){
			this.changeNavFocus();
			return true;
		}
	} else {
		if(!this.grid.down()){  //更改切换聚焦逻辑，最后一行内容翻页
			this.setGridView(function(){
				_this.changeGridFocus();
			}, 1);
		}
		if(this.grid != null){
			this.changeGridFocus();
			return true;
		}
	}
	return true;
}
UiCatGroup.pageUp = function(){
	if(!this.isNav){
		var _this = this;
		this.setGridView(function(){
			_this.changeGridFocus();
		}, -1);
	}
};
UiCatGroup.pageDown = function(){
	if(!this.isNav){
		var _this = this;
		this.setGridView(function(){
			_this.changeGridFocus();
		}, 1);
	}
};
UiCatGroup.numInput = function(num){
	if(this.isNav){
		if(this.navGrid != null && this.navGrid.focus.row == 2){
			if(this.inputNum == null){
				this.inputNum = '';
			}
			if(this.inputNum.length >= 5){
				return false;
			}
			this.inputNum += String(num);
			this.setSearchStr(this.inputNum, true);
		}
	}
	return true;
};
UiCatGroup.back = function(){
	if(this.isNav){
		if(this.navGrid != null && this.navGrid.focus.row == 2){
			this.inputNum = this.inputNum.slice(0, -1);
			this.setSearchStr(this.inputNum, true);
			return true;
		}
	}
	return false;
};
UiCatGroup.setSearchStr = function(str, isActive){
	var $in = $$('.grp_search_in')[0];
	if(!isActive){
		if(str == ''){
			$in.innerHTML = '|艺术团编号';
		} else {
			$in.innerHTML = str;
		}
	} else {
		$in.innerHTML = str + '|';
	}
};
UiCatGroup.onFocusIn = function(){
	this.isNav = false;
	this.changeGridFocus();
};
UiCatGroup.onFocusOut = function(){
	this.removeGridFocus();
	this.removeNavFocus();
	clearMarquee();
};
UiCatGroup.backToView = function(){
	var _this = this;
	_this.collector.serviceEntrance = '-1';
	Youai.showSector(0, function(){
		setFocus(_this);
	});
};
UiCatGroup.searchGroup = function(pageFocus){
	var _this = this;
	if(this.inputNum != null && this.inputNum.length > 0){
		this.selectedNavNode = new ColumnNode(this.columnNode, '搜索', '4');
		this.collector.columnID = this.selectedNavNode.getNodeId();
		this.collector.columnName = this.selectedNavNode.getNodePath();
		this.collector.serviceEntrance = '1';
		this.setGridView(function(){
			if(pageFocus != null){
				setFocus(_this);
			// } else {
			// 	_this.collector.collect();
			}
		}, null, pageFocus, true);
	}
};
UiCatGroup.enterPressed = function(){
	if(this.isNav){
		if(this.navGrid != null && this.navGrid.focus.row == 3){
			this.searchGroup();
		}
	} else {
		if(this.grid != null){
			var focus = this.grid.focus;
			var index = focus.row * this.grid.colNum + focus.col;
			var grp = this.gridData[index];
			var nodePath = this.nodePath;
			if(grp.metadata_public != null){
				var navpath = grp.metadata_public.navpath;
				if(typeof navpath == 'string' && navpath != ''){
					if(navpath.slice(-1) == '/'){
						navpath = navpath.slice(0, -1);
					}
					if(navpath.charAt(0) == '/'){
						navpath = navpath.slice(1);
					}
					if(navpath.length > 0){
						nodePath = PaaSTreeRoot + navpath;
					}
				}
			}
			UiGroupDetail.show(nodePath, grp);
		}
	}
	return true;
}
UiCatGroup.storeFocus = function(){
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
	if(this.navGrid != null){
		pageFocus.navGrid = {
			focus: this.navGrid.focus
		};
		pageFocus.isSearch = this.navGrid.focus.row == 2 || this.navGrid.focus.row == 3;
	}
	pageFocus.inputNum = this.inputNum;
	App.store.setValue('pageFocus', JSON.stringify(pageFocus));
};

var UiGroupDetail = new UiCat();
UiGroupDetail.focusPosition = {
	grid: [
	{left: '84px'}, {left: '370px'}, {left: '653px'}, {left: '935px'}
	]
}
UiGroupDetail.collector.pageID = '100';
UiGroupDetail.show = function(nodePath, grp){
	var _this = this;
	this.navPath = nodePath + '/' + grp.name;
	this.grpData = grp;
	this.collector.serviceEntrance = '1';
	Youai.setSector('uigroup_detail', function(){
		_this.focus = {
			row: 0,
			lmt: {
				row: 1
			}
		};
		_this.setDetailView(grp);
		setFocus(_this);
	}, 1);
	this.$sector = $$('.entry_sector')[1];
};
UiGroupDetail.setDetailView = function(grp){
	var _this = this;
	// this.getDetailData(function(data){
		var $poster = $$('.grp_detail_poster')[0];
		$poster.innerHTML = '<img src="' + (grp.metadata['内容图'] || '')  + '" />';
		$$('.grp_name_txt')[0].innerHTML = grp.name || '';
		$$('.grp_info_txt')[0].innerHTML = grp.metadata['文字简介'] || '';
		_this.setNavView();
	// });
};
UiGroupDetail.setNavView = function(){
	this.navGrid = new GridNav({
		cols: 1,
		num: 1
	});
	// var names = ['风采掠影', '作品展示', '团队荣誉'];
	var names = ['风采掠影'];
	this.navData = names;
	this.navNodes = [
		new ColumnNode(UiCatGroup.gridColumnNode, '风采掠影', '1'),
		new ColumnNode(UiCatGroup.gridColumnNode, '作品展示', '2'),
		new ColumnNode(UiCatGroup.gridColumnNode, '团队荣誉', '3')
	]
	var frag = $_f();
	for(var i = 0, len = names.length; i < len; i+=1){
		var $nav = $_('div');
		$nav.className = 'grp_detail_nav';
		$nav.innerHTML = names[i];
		frag.appendChild($nav);
	}
	var $navs = $$('.grp_detail_navs')[0];
	if($navs != null){
		$navs.innerHTML = '';
		$navs.appendChild(frag);
		$navs.children[0].classList.add('grp_det_nav_sel');
		this.selectedNav = this.navData[0];
		this.selectedNavNode = this.navNodes[0];
		this.setGridView();
	}
};
UiGroupDetail.setGridView = function(callback, flag){
	var _this = this;
	this.getPageData(function(data){
		_this.gridData = data;
		var num = data.length;

		_this.grid = new GridNav({
			cols: 4,
			num: num
		});
		var grid = _this.grid;
		var $f = $_f();
		for(var i = 0; i < grid.rowNum; i+=1){
			var $row = $_('div');
			$row.className = 'grid_row';
			for(var j = 0; j < grid.colNum; j+=1){
				var index = i * grid.colNum + j;
				if(index < num){
					var item = data[index];
					var $el = $_('div');
					$el.className = 'grid_el';
					var $poster = $_('div');
					$poster.className = 'grid_el_poster';
					$img = $_('img');
					$img.className = 'poster';
					// $img.src = item.metadata['图片'] || '';
					$img.src = item.poster || '';
					$poster.appendChild($img);
					var $txt = $_('div');
					$txt.className = 'grid_el_txt';
					$txt.innerHTML = checkToMarquee(item.name || '');
					$el.appendChild($poster);
					$el.appendChild($txt);
					$row.appendChild($el);
				} else {
					break;
				}
			}
			$f.appendChild($row);
		}
		var $grid = $$('.grp_detail_grid')[0];
		if($grid != null) {
			$grid.innerHTML = '';
			$grid.appendChild($f);
		}
		var $pi = $$('.page_indicator', _this.$sector)[0];
		if($pi != null){
			$pi.innerHTML = '第' + (_this.dataView.currPage + 1) + '页/共' + _this.dataView.pageNum + '页';
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag);
};
UiGroupDetail.getPageData = function(callback, flag){
	// if(this.tgBit != null){
		// this.tgBit = Number(!this.tgBit);
	// } else {
		// this.tgBit = 0;
	// }
	// var url = 'test/detp' + this.tgBit + '.json';
	// App.getJson(url, function(data){
		// var num = data.length;
		// if(typeof callback == 'function'){
			// callback(data, num)
		// }
	// })
	var _this = this;
	if(flag != null){
		this.dataView.getData(callback, flag);
	} else {
		this.nodePath = this.navPath + '/' + this.selectedNav;
		my.paas.getNavigation(this.nodePath, function(data){
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
						_this.dataView.getData(callback, flag);
					}
				}, ['app']);
			}
		});
	}
};
UiGroupDetail.pageDown = function(){
	var _this = this;
	if(this.focus.row == 1){
		this.setGridView(function(){
			_this.changeFocus();
		}, 1);
	}
};
UiGroupDetail.pageUp = function(){
	var _this = this;
	if(this.focus.row == 1){
		this.setGridView(function(){
			_this.changeFocus();
		}, -1);
	}
};
UiGroupDetail.getDetailData = function(callback){
	// var _this = this;
	// App.getJson('test/det0.json', function(data){
		// _this.detailData = data;
		// if(typeof callback == 'function'){
			// callback(data);
		// }
	// });
	if(typeof callback == 'function'){
		callback();
	}
};
UiGroupDetail.up = function(){
	if(this.focus.row > 0){
		this.focus.row -= 1;
		this.changeFocus();
		return true;
	} else {
		return false;
	}
};
UiGroupDetail.down = function(){
	if(this.focus.row < this.focus.lmt.row){
		if(this.focus.row == 0){
			if(this.grid == null || this.grid.num == 0){
				return true;
			}
		}
		this.focus.row += 1;
		this.changeFocus();
	}
	return true;
};
UiGroupDetail.left = function(){
	switch(this.focus.row){
	case 0:
		break;
	// case 1:
		// if(this.navGrid != null && this.navGrid.left()){
			// this.changeFocus();
		// }
		// break;
	case 1:
		if(this.grid != null && this.grid.left()){
			this.changeFocus();
		}
		break;
	}
	return true;
};
UiGroupDetail.right = function(){
	switch(this.focus.row){
	case 0:
		break;
	// case 1:
		// if(this.navGrid != null && this.navGrid.right()){
			// this.changeFocus();
		// }
		// break;
	case 1:
		if(this.grid != null && this.grid.right()){
			this.changeFocus();
		}
		break;
	}
	return true;
};
UiGroupDetail.back = function(){
	UiCatGroup.backToView();
	return true;
};
UiGroupDetail.changeFocus = function(){
	clearMarquee();
	var $f = $$('.grp_detail_focus')[0];
	if($f != null){
		$f.classList.remove('row1');
		$f.classList.remove('row2');
		$f.classList.remove('row3');

		// var $gp = $$('.grp_det_grid_focus')[0];
		// if($gp != null){
			// $gp.classList.remove('grp_det_grid_focus');
		// }

		switch(this.focus.row){
		case 0:
			$f.style.left = "";
			$f.classList.add('row1');
			var node = new ColumnNode(UiCatGroup.gridColumnNode, '团队简介', '0');
			this.gridColumnNode = node;
			this.collector.columnID = node.getNodeId();
			this.collector.columnName = node.getNodePath();
			this.collector.pageNum = 0;
			this.collector.serviceNum = 0;
			// this.collector.collect();
			break;
		// case 1:
			// $f.classList.add('row2');
			// var ngrid = this.navGrid;
			// if(ngrid != null){
				// var $np = $$('.grp_det_nav_sel')[0];
				// if($np != null){
					// $np.classList.remove('grp_det_nav_sel');
				// }
				// var col = ngrid.focus.col;
				// var $nav = $$('.grp_detail_nav')[col];
				// if($nav != null){
					// $nav.classList.add('grp_det_nav_sel');
					// var rec = $nav.getBoundingClientRect();
					// if(rec.left > 0){
						// $f.style.left = rec.left - 24 + 'px';
					// }
				// }
				// if($np != $nav){
					// this.selectedNav = this.navData[col];
					// this.selectedNavNode = this.navNodes[col];
					// this.setGridView();
				// }
				// this.collector.pageNum = this.dataView.currPage;
				// this.collector.serviceNum = this.gridData.length;
				// this.collector.columnID = this.selectedNavNode.getNodeId();
				// this.collector.columnName = this.selectedNavNode.getNodePath();
				// this.collector.collect();
			// }
			// break;
		case 1:
			$f.classList.add('row3');
			var grid = this.grid;
			if(grid != null){
				var col = grid.focus.col;
				var $grid = $$('.grp_detail_grid')[0];
				if($grid != null){
					var $el = $grid.children[0].children[col];
				}
				if($el != null){
					// $el.classList.add('grp_det_grid_focus');
					// var rect = $el.getBoundingClientRect();
					// if(rect.left > 0){
						// $f.style.left = rect.left - 3 + 'px';
					// }

					var item = this.gridData[col];

					var pos = this.focusPosition.grid[col];
					$f.style.left = pos.left;

					var $epl = $$('.txt_marquee_placer', $el)[0];
					if($epl != null){
						if($epl.offsetWidth > $el.clientWidth){
							$epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
						}
					}

					if(item != null){
						var node = new ColumnNode(this.selectedNavNode, item.name, col);
						this.gridColumnNode = node;
						this.collector.pageNum = this.dataView.currPage;
						this.collector.serviceNum = this.gridData.length;
						this.collector.columnID = node.getNodeId();
						this.collector.columnName = node.getNodePath();
						// this.collector.collect();
					}
				}
			}
			break;
		}
	}
};
UiGroupDetail.onFocusIn = function(){
	this.changeFocus();
	var $f = $$('.grp_detail_focus')[0];
	if($f != null){
		$f.style.display = 'block';
	}
};
UiGroupDetail.onFocusOut = function(){
	var $f = $$('.grp_detail_focus')[0];
	if($f != null){
		$f.style.display = 'none';
	}
	clearMarquee();
};
UiGroupDetail.enterPressed = function(){
	switch(this.focus.row){
	case 0:
		UiGroupDetInfo.show(this.grpData);
		break;
	case 1:
		if(this.grid != null && this.dataView != null){
			var focus = this.grid.focus;
			var select = this.gridData[focus.col];
			// if(select.metadata['类型'] == '视频'){
				// var vod = select.metadata['视频'];
				// if(vod != null && vod.indexOf('+') > -1){
				if(select != null){
					// var ids = vod.split('+');
					this.storeFocus();
					// this.collector.collect();
					App.goPlayer({
						provider_id: select.provider_id,
						provider_asset_id: select.provider_asset_id
					});
				}
			// } else {
				// UiGroupDetCaro.show(this.dataView.data, select);
			// }
		}
		break;
	}
	return true;
};
UiGroupDetail.backToView = function(){
	var _this = this;
	_this.collector.serviceEntrance = '-1';
	Youai.showSector(1, function(){
		setFocus(_this);
	});
};
UiGroupDetail.storeFocus = function(){
	UiCatGroup.storeFocus();
};

var UiGroupDetInfo = new UiCat();
UiGroupDetInfo.collector.pageID = '1000';
UiGroupDetInfo.up = function(){
	return true;
};
UiGroupDetInfo.back = function(){
	UiGroupDetail.backToView();
	return true;
};
UiGroupDetInfo.enterPressed = function(){
	UiGroupDetail.backToView();
	return true;
};
UiGroupDetInfo.show = function(data){
	var _this = this;
	Youai.setSector('uigroup_det_info', function(){
		_this.setView(data);
		setFocus(_this);
	}, 2, true);
};
UiGroupDetInfo.setView = function(data){
	var $name = $$('.grp_det_info_name')[0];
	if($name != null){
		$name.innerHTML = data.name || '';
	}
	var $txt = $$('.grp_det_info_txt')[0];
	if($txt != null){
		$txt.innerHTML = data.metadata['文字简介'] || '';
	}
	var node = UiGroupDetail.gridColumnNode;
	this.collector.columnID = node.getNodeId();
	this.collector.columnName = node.getNodePath();
	this.collector.pageNum = 0;
	this.collector.serviceNum = 0;
	this.collector.serviceEntrance = '1';
	// this.collector.collect();
};

UiGroupDetCaro = new UiCat();
UiGroupDetCaro.collector.pageID = '1001';
UiGroupDetCaro.up = function(){
	return true;
};
UiGroupDetCaro.back = function(){
	UiGroupDetail.backToView();
	return true;
};
UiGroupDetCaro.left = function(){
	if(this.caro != null && this.caro.minus()){
		this.changeFocus();
	}
	return true;
};
UiGroupDetCaro.right = function(){
	if(this.caro != null && this.caro.plus()){
		this.changeFocus();
	}
	return true;
};
UiGroupDetCaro.changeFocus = function(){
	// if(this.tgBit == null){
		// this.tgBit = 0;
	// } else {
		// this.tgBit = Number(!this.tgBit);
	// }
	// var el = this.caroData[this.tgBit];
	var index = this.caro.focus.index;
	var item = this.caroData[index];
	if(item != null){
		var node = new ColumnNode(UiGroupDetail.selectedNavNode, item.name, index);
		this.collector.pageNum = index;
		this.collector.serviceNum = this.caroData.length;
		this.collector.columnID = node.getNodeId();
		this.collector.columnName = node.getNodePath();
		// this.collector.collect();
	}
	if(item.metadata['类型'] != '视频'){
		var el = item.metadata['图片'] || '';
		var $el = $$('.grp_det_caro_picpos')[0];
		if($el != null){
			$el.innerHTML = '<img src="' + el + '" />';
		}
	} else {
		var vod = item.metadata['视频'];
		if(vod != null && vod.indexOf('+') > -1){
			var ids = vod.split('+');
			this.storeFocus();
			App.goPlayer({
				provider_id: ids[0],
				provider_asset_id: ids[1]
			});
		}
	}
};
UiGroupDetCaro.show = function(data, select){
	var _this = this;
	_this.caroData = data;
	Youai.setSector('uigroup_det_caro', function(){
		_this.setView(data, select);
		// _this.tgBit = 0;
		setFocus(_this);
	}, 2, true);
};
UiGroupDetCaro.setView = function(data, select){
	var _this = this;
	// this.getData(function(items){
		// _this.caroData = items;
		var num = data.length;
		_this.caro = new CaroNav({
			num: num,
			loop: false
		});
		var index = 0;
		for(var i = 0, len = data.length; i < len; i+=1){
			if(data[i].id == select.id){
				index = i;
				break;
			}
		}
		_this.caro.focus.index = index;
		// var el = items[0];
		var el = select.metadata['图片'] || '';
		var $el = $$('.grp_det_caro_picpos')[0];
		if($el != null){
			$el.innerHTML = '<img src="' + el + '" />';
		}
	// });
	var node = UiGroupDetail.gridColumnNode;
	this.collector.columnID = node.getNodeId();
	this.collector.columnName = node.getNodePath();
	this.collector.pageNum = index;
	this.collector.serviceNum = num;
	this.collector.serviceEntrance = '1';
	// this.collector.collect();
};
UiGroupDetCaro.getData = function(callback){
	// App.getJson('test/detc0.json', function(data){
		// if(typeof callback == 'function'){
			// callback(data);
		// }
	// });
};
UiGroupDetCaro.storeFocus = function(){
	UiCatGroup.storeFocus();
};

function StarLikeView(){}
StarLikeView.prototype = UiCatStar;
var UiCatCast = new StarLikeView();
UiCatCast.collector.pageID = '10';
UiCatCast.show = function(pageFocus){
	var _this = this;
	this.columnNode = new ColumnNode(Youai.columnNode, '演出实况', '2');
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	Youai.setSector('uicast', function(){
		// _this.tgBit = null;
		_this.dataView = null;
		_this.ovtgBit = null;
		_this.setGridView(function(){
			if(pageFocus != null){
				setFocus(_this);
			// } else {
			// 	_this.collector.collect();
			}
		}, null, pageFocus);
	});
};
UiCatCast.setOverGridView = function(callback, flag){
	var _this = this;
	_this.getOverPageData(function(data){
		_this.overGridData = data;
		var num = data.length;
		_this.collector.pageNum = _this.overDataView.currPage;
		_this.collector.serviceNum = num;
		_this.overGrid = new GridNav({
			cols: 3,
			num: num
		});
		var grid = _this.overGrid;
		var $f = $_f();
		for(var i = 0; i < grid.rowNum; i+=1){
			var $row = $_('div');
			$row.className = 'grid_row';
			for(var j = 0; j < grid.colNum; j+=1){
				var index = i * grid.colNum + j;
				if(index < num){
					var item = data[index];
					var $el = $_('div');
					$el.className = 'grid_el';
					var $poster = $_('div');
					$poster.className = 'grid_el_poster';
					$img = $_('img');
					$img.className = 'poster';
					$img.src = parseAssetPoster(item) || parseBundlePoster(_this.overBundle);
					$poster.appendChild($img);
					var $txt = $_('div');
					$txt.className = 'grid_el_txt';
					$txt.innerHTML = checkToMarquee(item.name || '');
					$el.appendChild($poster);
					$el.appendChild($txt);
					$row.appendChild($el);
				} else {
					break;
				}
			}
			$f.appendChild($row);
		}
		var $grid = $$('.cast_overgrid_els')[0];
		if($grid != null){
			$grid.innerHTML = '';
			$grid.appendChild($f);
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag);
};
UiCatCast.getOverPageData = function(callback, flag){
	// if(this.ovtgBit != null){
		// this.ovtgBit = Number(!this.ovtgBit);
	// } else {
		// this.ovtgBit = 0;
	// }
	// var url = 'test/list' + this.ovtgBit + '.json';
	// App.getJson(url, function(data){
		// var num = 6;
		// if(typeof callback == 'function'){
			// callback(data, num)
		// }
	// });
	var _this = this;
	if(flag != null){
		this.overDataView.getData(callback, flag);
	} else {
		var url = my.paas.host + '/aquapaas/rest/search/content_by_id/vod?ids=' + this.overBundleId;
		my.paas.request({
			type: 'GET',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			async: true,
			done: function(bundles){
				bundles = JSON.parse(bundles);
				_this.overBundle = bundles[0];
				var url = my.paas.host + '/aquapaas/rest/search/contents/asset?bundle_id=' + _this.overBundleId +
					'&bundle_id_op=eq&visible=true';
				my.paas.request({
					type: 'GET',
					url: url,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					async: true,
					done: function(data){
						var items = JSON.parse(data);
						_this.overDataView = new PagedView(items, 6);
						_this.overDataView.getData(callback, flag);
					}
				}, ['app']);
			}
		}, ['app']);


	}
};
UiCatCast.up = function(){
	if(this.isOverlay){
		if(this.overGrid != null && this.overGrid.up()){
			this.changeOverGridFocus();
		}
		return true;
	} else if(this.grid != null && this.grid.up()){
		this.changeGridFocus();
		return true;
	} else {
		this.show();
		return false;
	}
};
UiCatCast.down = function(){
	var _this = this;
	if(this.isOverlay){
		if(!this.overGrid.down()){
			this.setOverGridView(function(){
				_this.changeOverGridFocus();
			}, 1);
		}
		if(this.overGrid != null && this.overGrid.down()){
			this.changeOverGridFocus();
		}
	} else {
		if(!this.grid.down()){
			this.setGridView(function(){
				_this.changeGridFocus();
			}, 1);
		}
		if(this.grid != null){
			this.changeGridFocus();
		}
	}
};
UiCatCast.left = function(){
	var _this = this;
	if(this.isOverlay){
		if(!this.overGrid.left()){
			this.setOverGridView(function(){
				_this.changeOverGridFocus();
			}, -1);
		}
		if(this.overGrid != null){
			this.changeOverGridFocus();
		}
	} else {
		if(!this.grid.left()){  //更改切换聚焦逻辑，当前页面第一个内容翻页
			if (_this.grid.focus.col == 0 && _this.grid.focus.row > 0) {
			  _this.grid.focus.col = _this.grid.focus.lmt.col;
			  _this.grid.focus.row -= 1;
			}
			this.setGridView(function(){  //翻页回到最后一个内容
			  _this.grid.focus.col = _this.grid.focus.lmt.col;
			  _this.grid.focus.row = _this.grid.focus.lmt.row;
			  _this.changeGridFocus();
			}, -1);
		}
		if(this.grid != null){
			this.changeGridFocus();
		}
	}
};
UiCatCast.right = function(){
	var _this = this;
	if(this.isOverlay){
		if(!this.overGrid.right()){
			this.setOverGridView(function(){
				_this.changeOverGridFocus();
			}, 1);
		}
		if(this.overGrid != null){
			this.changeOverGridFocus();
		}
	} else {
		if(!this.grid.right()){  //更改切换聚焦逻辑，最后一个内容翻页
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
		}
	}
};
UiCatCast.back = function(){
	if(this.isOverlay){
		var $overlay = $$('.cast_overlay')[0];
		$overlay.style.display = 'none';
		this.isOverlay = false;
		this.collector.pageID = '10';

		var $el = $$('.grid_focus')[0];
		if($el != null){
			var $epl = $$('.txt_marquee_placer', $el)[0];
			if($epl != null){
				if($epl.offsetWidth > $el.clientWidth){
					$epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
				}
			}
		}
		return true;
	}
	return false;
};
UiCatCast.enterPressed = function(){
	var _this = this;
	if(this.isOverlay){
		var focus = this.overGrid != null ? this.overGrid.focus : null;
		if(focus != null){
			var index = focus.row * 3 + focus.col;
			var item = this.overGridData[index];
			this.storeFocus();
			App.goPlayer({
				provider_id: item.provider_id,
				provider_asset_id: item.provider_asset_id
			});
		}
	} else {
		var focus = this.grid != null ? this.grid.focus : null;
		if(focus != null){
			var index = focus.row * 3 + focus.col;
			var item = this.gridData[index];
			this.storeFocus();
			App.goPlayer({
				provider_id: item.provider_id,
				provider_asset_id: item.provider_asset_id
			});
		}
		// if(focus != null){
		// 	var index = focus.row * 3 + focus.col;
		// 	var item = this.gridData[index];
		// 	var vod = item.metadata['视频'];
		// 	var bundle = item.metadata['Bundle标志'];
		// 	if(bundle != null && bundle.indexOf('+') > -1){
		// 		var bids = bundle.split('+');
		// 		var bpid = bids[0];
		// 		var bpaid = bids[1];
		// 		this.overBundleId = bpid + '_' + bpaid;
		// 		this.isOverlay = true;
		// 		clearMarquee();
		// 		this.collector.pageID = '101';
		// 		var $overlay = $$('.cast_overlay')[0];
		// 		$overlay.style.display = 'block';
		// 		$$('.cast_overgrid_txt')[0].innerHTML = item.name;
		// 		this.setOverGridView(function(){
		// 			_this.changeOverGridFocus();
		// 			$$('.cast_overgrid_focus')[0].style.display = 'block';
		// 		});
		// 	}else if(vod != null && vod.indexOf('+') > -1){
		// 		var ids = vod.split('+');
		// 		var pid = ids[0];
		// 		var paid = ids[1];
		// 		this.storeFocus();
		// 		// this.collector.collect();
		// 		App.goPlayer({
		// 			provider_id: pid,
		// 			provider_asset_id: paid
		// 		});
		// 	}
		// }
	}
};
UiCatCast.pageDown = function(){  //演出实况
	var _this = this;
	if(this.isOverlay){
		this.setOverGridView(function(){
			_this.changeOverGridFocus();
		}, 1);
	} else {
		this.setGridView(function(){
			_this.changeGridFocus();
		}, 1);
	}
};
UiCatCast.pageUp = function(){
	var _this = this;
	if(this.isOverlay){
		this.setOverGridView(function(){
			_this.changeOverGridFocus();
		}, -1)
	} else {
		this.setGridView(function(){
			_this.changeGridFocus();
		}, -1);
	}
};
UiCatCast.changeOverGridFocus = function(){
	clearMarquee();
	var grid = this.overGrid;
	var $over = $$('.cast_overlay')[0]
	var $pr = $$('.grid_focus', $over)[0];
	if($pr != null){
		$pr.classList.remove('grid_focus');
	}
	if(grid != null){
		var row = grid.focus.row;
		var $row = $$('.grid_row', $over)[row];
		if($row != null){
			var col = grid.focus.col;
			var $el = $row.children[col];
			if($el != null){
				var $epl = $$('.txt_marquee_placer', $el)[0];
				if($epl != null){
					if($epl.offsetWidth > $el.clientWidth){
						$epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
					}
				}

				$el.classList.add('grid_focus');
				var $sf = $$('.cast_overgrid_focus')[0];
				if($sf != null){
					var rect = $el.getBoundingClientRect();
					if(rect.left > 0 && rect.top > 0){
						$sf.style.left = (rect.left - 38) + 'px';
						$sf.style.top = (rect.top - 35) + 'px';
					}

					var index = row * grid.colNum + col;
					var item = this.overGridData[index];
					if(item != null){
						var node = new ColumnNode(this.gridColumnNode, item.name, index);
						this.collector.pageNum = this.overDataView.currPage;
						this.collector.serviceNum = this.overGridData.length;
						this.collector.columnID = node.getNodeId();
						this.collector.columnName = node.getNodePath();
						// this.collector.collect();
					}
				}
			}
		}
	}
};

var UiCatActs = new UiCat();
UiCatActs.focusPosition = {
	grid: [
	{top: '174px'}, {top: '316px'}, {top: '458px'}
	]
}
UiCatActs.collector.pageID = '10';
UiCatActs.show = function(pageFocus){
	var _this = this;
	this.columnNode = new ColumnNode(Youai.columnNode, '近期活动', '3');
	this.collector.columnID = this.columnNode.getNodeId();
	this.collector.columnName = this.columnNode.getNodePath();
	this.collector.serviceEntrance = '0';
	Youai.setSector('uiacts', function(){
		// _this.tgBit = null;
		_this.dataView = null;
		_this.setGridView(function(){
			if(pageFocus != null){
				setFocus(_this);
			} else {
				_this.showListItemPoster(0);
				// _this.collector.collect();
			}
		});
	});
};
UiCatActs.setGridView = function(callback, flag){
	var _this = this;
	this.getPageData(function(data){
		_this.gridData = data;
		var num = data.length;
		_this.collector.pageNum = _this.dataView.currPage;
		_this.collector.serviceNum = num;
		var grid = new GridNav({
			cols: 1,
			num: num
		});
		_this.grid = grid;
		var $f = $_f();
		for(var i = 0; i < grid.rowNum; i+=1){
			var item = data[i];
			var $el = $_('div');
			$el.className = 'list_item';
			var $txt = $_('div');
			$txt.className = 'list_item_txt';
			$txt.innerHTML = item.metadata['文字介绍'] || '';
			$el.appendChild($txt);
			$f.appendChild($el);
		}
		var $list = $$('.acts_list')[0];
		$list.innerHTML = '';
		$list.appendChild($f);
		var $pi = $$('.page_indicator')[0];
		if($pi != null){
			$pi.innerHTML = '第' + (_this.dataView.currPage + 1) + '页/共' + _this.dataView.pageNum + '页';
		}
		if(typeof callback == 'function'){
			callback();
		}
	}, flag);
};
UiCatActs.getPageData = function(callback, flag){
	// if(this.tgBit != null){
		// this.tgBit = Number(!this.tgBit);
	// } else {
		// this.tgBit = 0;
	// }
	// var url = 'test/act' + this.tgBit + '.json';
	// App.getJson(url, function(data){
		// var num = data.length;
		// if(typeof callback == 'function'){
			// callback(data, num)
		// }
	// });
	var _this = this;
	if(this.dataView == null){
		my.paas.getNavigation(this.navPath, function(data){
			var items = data.children;
			_this.dataView = new PagedView(items, 3);
			_this.dataView.getData(callback, flag);
		});
	} else {
		this.dataView.getData(callback, flag);
	}
};
UiCatActs.left = function(){
	return true;
};
UiCatActs.right = function(){
	return true;
};
UiCatActs.up = function(){
	if(this.grid != null && this.grid.up()){
		this.changeGridFocus();
		return true;
	}
	return false;
};
UiCatActs.down = function(){
	var _this = this;
	if(!this.grid.down()){  //更改切换聚焦逻辑，最后一行内容翻页
		this.setGridView(function(){
			_this.changeGridFocus();
		}, 1);
	}
	if(this.grid != null){
		this.changeGridFocus();
	}
	return true;
};
UiCatActs.pageDown = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, 1);
};
UiCatActs.pageUp = function(){
	var _this = this;
	this.setGridView(function(){
		_this.changeGridFocus();
	}, -1);
};
UiCatActs.enterPressed = function(){

};
UiCatActs.changeGridFocus = function(){
	var $pr = $$('.list_focus')[0];
	if($pr != null){
		$pr.classList.remove('list_focus');
	}
	var grid = this.grid;
	if(grid != null){
		var index = grid.focus.row;
		var $el = $$('.list_item')[index];
		if($el != null){
			$el.classList.add('list_focus');
			var $of = $$('.list_out_focus')[0];
			if($of != null){
				// var rect = $el.getBoundingClientRect();
				// if(rect.left > 0 && rect.top > 0){
					// $of.style.left = rect.left - 28 + 'px';
					// $of.style.top = rect.top - 27 + 'px';
				// }
				var pos = this.focusPosition.grid[index];
				$of.style.top = pos.top;
			}
			this.showListItemPoster(index);

			var item = this.gridData[index];
			if(item != null){
				var node = new ColumnNode(this.columnNode, item.name, index);
				this.collector.columnID = node.getNodeId();
				this.collector.columnName = node.getNodePath();
				this.collector.pageNum = this.dataView.currPage;
				this.collector.serviceNum = this.gridData.length;
				// this.collector.collect();
			}
		}
	}
};
UiCatActs.showListItemPoster = function(index){
	var $poster = $$('.act_poster')[0];
	var item = this.gridData != null ? this.gridData[index] : null;
	var img = '';
	if(item != null){
		img = item.metadata['预览图'] || '';
	}
	$poster.innerHTML = '<img src="' + img + '" />';
};
UiCatActs.onFocusIn = function(){
	this.changeGridFocus();
	var $of = $$('.list_out_focus')[0];
	if($of != null){
		$of.style.display = 'block';
	}
};
UiCatActs.onFocusOut = function(){
	var $of = $$('.list_out_focus')[0];
	if($of != null){
		$of.style.display = 'none';
	}
	var $lf = $$('.list_focus')[0];
	if($lf != null){
		$lf.classList.remove('list_focus');
	}
};

function GridNav(obj){
	this.colNum = obj.cols != null ? obj.cols : 1;
	this.num = obj.num != null ? obj.num : 0;
	this.init();
}

GridNav.prototype = {
	init: function(){
		this.focus = {
			col: 0,
			row: 0,
			lmt: {
				row: 0,
				col: 0,
			}
		};
		this.rowNum = Math.ceil(this.num/this.colNum);
		this.focus.lmt.row = this.rowNum - 1;
		var lastRowNum = this.num - (this.rowNum - 1) * this.colNum;
		this.focus.lmt.col = lastRowNum - 1;
	},

	up: function(){
		if(this.focus.row > 0){
			this.focus.row -= 1;
			return true;
		}
		return false;
	},

	down: function(){
		if(this.focus.row < this.focus.lmt.row){
			this.focus.row += 1;
			if(this.focus.row == this.focus.lmt.row){
				if(this.focus.col > this.focus.lmt.col){
					this.focus.col = this.focus.lmt.col;
				}
			}
			return true;
		}
		return false;
	},

	left: function(){
		if(this.focus.col > 0){
			this.focus.col -= 1;
			return true;
		}
		return false;
	},

	right: function(){
		if(this.focus.row < this.focus.lmt.row){
			if(this.focus.col < this.colNum - 1){
				this.focus.col += 1;
				return true;
			}
		} else if(this.focus.row == this.focus.lmt.row){
			if(this.focus.col < this.focus.lmt.col){
				this.focus.col += 1;
				return true;
			}
		}
		return false;
	}
};

function CaroNav(obj){
	this.num = obj.num != null ? obj.num : 0;
	this.isLoop = !!obj.loop;
	this.init();
}

CaroNav.prototype = {
	init: function(){
		this.focus = {
			index: 0,
			lmt: 0
		};
		this.focus.lmt = this.num - 1;
	},

	plus: function(){
		if(this.focus.index < this.focus.lmt){
			this.focus.index += 1;
			return true;
		} else if(this.isLoop){
			this.focus.index = 0;
			return true;
		} else {
			return false;
		}
	},

	minus: function(){
		if(this.focus.index > 0){
			this.focus.index -= 1;
			return true;
		} else if(this.isLoop){
			this.focus.index = this.focus.lmt;
			return true;
		} else {
			return false;
		}
	}
};

function parseAssetPoster(asset, index){
	var poster = '';
	var posters = asset && (typeof asset.posterboard == 'string') && asset.posterboard.split(',') || [];
	index = index != null ? index : posters.length-1;
	poster = posters[index];
	if(poster == null){
		poster = '';
	}
	return poster;
}

function parseBundlePoster(bundle, index){
	var poster = '';
	var posters = bundle && (typeof bundle.packageposterboard == 'string') && bundle.packageposterboard.split(',') || [];
	index = index != null ? index : posters.length-1;
	poster = posters[index];
	if(poster == null){
		poster = '';
	}
	return poster;
}

function ColumnNode(parentNode, name, bit){
	this.bit = bit;
	this.name = name;
	this.parent = parentNode;
}

ColumnNode.prototype = {
	getNodeId: function(){
		if(this.nodeId != null){
			return this.nodeId;
		}
		var id = '';
		if(this.parent != null){
			id += this.parent.getNodeId();
		}
		id += this.bit;
		this.nodeId = id;
		return id;
	},

	getNodePath: function(){
		if(this.nodePath != null){
			return this.nodePath;
		}
		var path = '';
		if(this.parent != null){
			path += this.parent.getNodePath();
		}
		path += '/' + this.name;
		this.nodePath = path;
		return path;
	},
}

var RootNode = new ColumnNode(null, '年华', '1');
