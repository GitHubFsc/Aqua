function rmvFocus(){
	var $f = $_class('focus')[0];
	if($f != null){
		$f.classList.remove('focus');
	}
}

var TopEntry = {
	onFocusIn: function(){
		this.changeFocus();
	},
	onFocusOut: function(){
		rmvFocus();
		$_id('tope_focus').style.visibility = '';
	},
	focusStyle: [
	{left: '910px'},
	{left: '977px'}
	],
	changeFocus: function(){
		rmvFocus();
		var $f = null;
		switch(this.focus){
		case 0:
			$f = $_id('search');
			break;
		case 1:
			$f = $_id('mine');
			break;
		default:
			break;
		}
		if($f != null){
			$f.classList.add('focus');
		}
		var fs = this.focusStyle[this.focus];
		var $tf = $_id('tope_focus');
		if($tf != null && fs != null){
			$tf.style.left = fs.left;
			$tf.style.visibility = 'visible';
		}
	},
	enterPressed: function(){
		this.storeFocus();
		switch(this.focus){
		case 0:
			goSearch();
			break;
		case 1:
			goMine();
			break;
		default:
			break;
		}
	},
	storeFocus: function(){
		var pageFocus = {
			tag: 'top',
			index: this.focus
		};
		App.storage.setValue('focus', JSON.stringify(pageFocus));
	},
	focus: 0,
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.up:
		case keyValue.UP:
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			FolderNav.navToSub();
			return false;
			break;
		case keyValue.left:
		case keyValue.LEFT:
			if(this.focus == 1){
				this.focus = 0;
				this.changeFocus();
			} else {
				setFocus(FolderNav);
			}
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			if(this.focus == 0){
				this.focus = 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.enter:
		case keyValue.ENTER:
			this.enterPressed();
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
			break;
		default:
			break;
		}
	}
};

var Tabsv = {
	columnNode: null,

	show: function(page, pageFocus){
		var _this = this;
		this.pageModels = [];
		this.isReady = false;
		this.setTabs(function(){
			if(page == null){
				page = 0;
			} else {
				page = Number(page);
			}
			if(!isNaN(page)){
				_this.focus.col = Math.max(0, Math.min(page, _this.focus.lmt.col));
			}
			if(pageFocus != null){
				setFocus(_this, false, true);
			}
			_this.changeFocus(pageFocus);
		});
	},
	getTabs: function(callback){
		var data = this.folderData.children;
		if(typeof callback == 'function'){
			callback(data);
		}
	},
	setTabs: function(callback){
		var _this = this;
		var pages = [];
		_this.getTabs(function(pages){
			_this.tabsData = pages;
			var num = pages.length;
			_this.focus.lmt.col = num - 1;
			var html = '';
			for(var i = 0; i < num; i += 1){
				var page = pages[i];
				html += '<div id="tab_' + i + '" class="tab_header"><span>' + page.name + '</span></div>';
				var templateFile = 'templates/t' + page.styleNo + '/layout.json';
				_this.pageModels[i] = getPageModel(templateFile, page, _this.navPath, i, _this);
			}
			$_id('tabs_header').innerHTML = html;
			_this.isReady = true;
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
	storeFocus: function(){
		var pageFocus = {
			tag: 'tabs',
			index: this.focus.col
		};
		App.storage.setValue('focus', JSON.stringify(pageFocus));
	},
	enterPressed: function(){
		var tab = this.tabsData[this.focus.col];
		if(tab.name != '推荐'){
			//TODO
			this.storeFocus();
			location.href = './column.html?name=' + encodeURIComponent(tab.name) + '&nodepath=' + FolderNav.focus.col;
		}
	},
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.up:
		case keyValue.UP:
			setFocus(FolderNav);
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
		case keyValue.enter:
		case keyValue.ENTER:
			this.enterPressed();
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
		var $sel = $_class('tab_select')[0];
		if($sel != null){
			$sel.classList.remove('tab_select');
		}
		var $tel = $_id('tab_' + index);
		if($tel != null){
			$tel.classList.add('tab_select');
			var $nav = $_id('tabs_header');
			if($nav.scrollWidth > $nav.clientWidth){
				var rect = $tel.getBoundingClientRect();
				if(rect.left < 82){
					$nav.scrollLeft += rect.left - 82;
				} else if(rect.right > 1198){
					$nav.scrollLeft += rect.right - 1198;
				}
			}
			var $f = $_id('tab_focus');
			if($f != null){
				$f.style.width = $tel.clientWidth + 'px';
				var nrec = $tel.getBoundingClientRect();
				$f.style.left = (nrec.left - 1) + 'px';
				if(pageFocus != null && pageFocus.tag == 'tabs'){
					$f.style.visibility = 'visible';
				}
			}
		}
		var pageModel = this.pageModels[index];
		if(pageModel != null){
			pageModel.show(pageFocus != null && pageFocus.tag == 'page' ? pageFocus : null);
			App.storage.setValue('page', String(index));
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
	},
	onFocusOut: function(){
		$_id('tab_focus').style.visibility = '';
	}
};

var FolderNav = {
	init: function(){
		var _this = this;
		this.navPath = '/aquapaas/rest/navigation/trees/' + naviTreeName;
		this.folderModels = [];
		this.setFolders(function(){
			var page = App.storage.getValue('page');
			var folder = App.storage.getValue('folder');
			var pageFocus = App.storage.getValue('focus');
			log('page: ' + page + ', folder: ' + folder + ', focus: ' + pageFocus);
			try{
				pageFocus = typeof pageFocus == 'string' && pageFocus != '' ? JSON.parse(pageFocus) : null;
			}catch(e){
				log(e.message);
			}
			if(folder != null && folder != ''){
				_this.focus.col = Math.max(0, Math.min(Number(folder), _this.focus.lmt));
			}
			if(pageFocus != null){
				if(pageFocus.tag == 'top'){
					TopEntry.focus = pageFocus.index;
					setFocus(TopEntry);
				} else {
					setFocus(_this, false, true);
				}
				_this.changeFocus(page, pageFocus);
			} else {
				setFocus(_this, false, true);
				_this.changeFocus();
			}
		});
	},
	onFocusIn: function(){
		$_id('folder_focus').style.visibility = 'visible';
	},
	onFocusOut: function(){
		$_id('folder_focus').style.visibility = '';
	},
	focusStyle:[
		{left: '84px'},
		{left: '195px'},
		{left: '307px'}
	],
	changeFocus: function(page, pageFocus){
		var index = this.focus.col;
		var fs = this.focusStyle[index];
		var $sel = $_class('folder_select')[0];
		if($sel != null){
			$sel.classList.remove('folder_select');
		}
		var $f = $_id('folder_' + index);
		if($f != null){
			$f.classList.add('folder_select');
		}
		var $ff = $_id('folder_focus');
		if($ff != null && fs != null){
			$ff.style.left = fs.left;
		} else {
			log('no focus col: ' + index);
		}
		if(!pageFocus){
			$ff.style.visibility = 'visible';
		}
		var folderModel = this.folderModels[index];
		if(folderModel != null){
			folderModel.show(page, pageFocus != null && (pageFocus.tag == 'tabs' || pageFocus.tag == 'page') ? pageFocus: null);
			App.storage.setValue('folder', String(index));
		}
	},
	storeFocus: function(){
		var pageFocus = {
			tag: 'folder',
			index: this.focus
		};
		App.storage.setValue('focus', JSON.stringify(pageFocus));
	},
	focus: {
		col: 0,
		lmt: 0
	},
	setFolders: function(callback){
		var _this = this;
		this.getFolders(function(folders){
			_this.folders = folders;
			var num = folders.length;
			_this.focus.lmt = num - 1;
			var html = '';
			for(var i = 0; i < num; i += 1){
				var folder = folders[i];
				html += '<div id="folder_' + i + '" class="folder"></div>';
				_this.folderModels[i] = getFolderModel(folder, _this.navPath);
			}
			$_id('folders').innerHTML = html;
			if(typeof callback == 'function'){
				callback();
			}
		});
	},
	getFolders: function(callback){
		var data = [
		{
			name: '综合点播',
			children: [
			{name: '推荐', styleNo: '1'},
			{name: '电视剧', styleNo: '2'},
			{name: '综艺', styleNo: '3'},
			{name: '电影', styleNo: '4'},
			{name: '少儿', styleNo: '5'},
			{name: '动漫', styleNo: '6'},
			{name: '百科', styleNo: '7'},
			{name: '教育', styleNo: '8'},
			{name: '万花筒', styleNo: '9'},
			{name: '芒果荟', styleNo: '4'}
			]
		},
		{
			name: '全现场',
			children: [
			{name: '竞技现场', styleNo: '7'},
			{name: '东方大剧院', styleNo: '6'}
			]
		},
		{
			name: '课堂',
			children: [
			{name: '英语课程', styleNo: '3'},
			{name: '数学课堂', styleNo: '3'},
			{name: '语文课堂', styleNo: '3'},
			{name: '理科课堂', styleNo: '3'},
			{name: '文科课堂', styleNo: '3'},
			{name: '备考专题', styleNo: '3'}
			]
		}
		]
		if(typeof callback == 'function'){
			callback(data);
		}
	},
	navToSub: function(){
		var model = this.folderModels[this.focus.col];
		if(model != null){
			model.isReady && setFocus(model);
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
			if(this.focus.col < this.focus.lmt){
				this.focus.col += 1;
				this.changeFocus();
			} else {
				setFocus(TopEntry);
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
			break;
		default:
			break;
		}
	}
};

function PageNav(){}
PageNav.prototype = Tabsv;

function getFolderModel(folder, parentNav){
	var model = new PageNav();
	model.folderData = folder;
	model.navPath = parentNav + '/' + folder.name;
	return model;
}

function UITab(pageNav){
	this.pageNav = pageNav;
}

UITab.prototype = {
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.left:
		case keyValue.LEFT:
			this.left();
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			this.right();
			return false;
			break;
		case keyValue.up:
		case keyValue.UP:
			if(!this.up()){
				setFocus(this.pageNav);
			}
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			this.down();
			return false;
			break;
		case keyValue.back:
		case keyValue.BACK:
		case keyValue.Back:
		case keyValue.quit:
		case keyValue.QUIT:
		case keyValue.Quit:
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
			this.pageUp();
			return false;
			break;
		case keyValue.pagedown:
		case keyValue.pageDown:
		case keyValue.PageDown:
		case keyValue.PAGEDOWN:
			this.pageDown();
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

function getPageModel(templateFile, data, parentNav, index, pageNav){
	var model = new UITab(pageNav);
	model.pageData = data;
	model.templateFile = templateFile;
	model.navPath = parentNav + '/' + data.name;
	model.focus = {
		index: 0,
		lmt: 0
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
				var dataIndex = block.dataIndex;
				if(dataIndex != null){
					var blockItem = blockData[dataIndex];
					if(blockItem != null){
						if(blockItem.node_class == 'folder') {
							$_id('tab_block_poster_' + i).src = blockItem.metadata['FILE_poster'] || '';
						} else if(blockItem.node_class == 'asset'){
							var defPoster = blockItem.metadata && blockItem.metadata['FILE_poster'];
							if(defPoster != null && defPoster != ''){
								$_id('tab_block_poster_' + i).src = defPoster;
							} else {
								assetBlocks.push(i);
								assetIds.push(blockItem.metadata_public.ProviderId + '_' + blockItem.metadata_public.ProviderAssetId);
							}
						}
					}
				}
			}

			var idLen = assetIds.length;
			if(idLen > 0){
				getVodData(assetIds, function(assets){
					if(assets != null){
						var assetNum = assets.length;
						for(var j = 0; j < idLen; j+=1){
							var assetId = assetIds[j];
							for(var k = 0; k < assetNum; k += 1){
								var asset = assets[k];
								if(assetId == asset.provider_id + '_' + asset.provider_asset_id){
									var poster = asset.doc_type == 'asset' ? parseAssetPoster(asset, 0) : parseBundlePoster(asset, 0);
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
	model.enterPressed = function(){
		var index = this.focus.index;
		var block = this.templateData.blocks[index];
		if(block.func != null){
			this.storeFocus();
			eval(block.func);
			return true;
		}
		var item = this.navData[index];
		if(item != null){
			if(item.node_class == 'folder'){
				this.storeFocus();
				goAlbum(item.metadata.album_path)
			} else if(item.node_class == 'asset' || item.node_class == 'bundle'){
				this.storeFocus();
				//TODO go detail
				goDetail(item.metadata_public.ProviderId, item.metadata_public.ProviderAssetId);
			}
		}
		return false;
	};
	model.drawLayout = function(){
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
				$img.src = block.box.image != null ? block.box.image : '';
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
		var $el = $_id('tab_block_' + index);
		if($el != null){
			var rect = $el.getBoundingClientRect();
			var $f = $_id('block_focus');
			if($f != null){
				$f.style.left = (rect.left - 5) + 'px';
				$f.style.top = (rect.top - 5) + 'px';
				$f.style.width = (rect.width + 4) + 'px';
				$f.style.height = (rect.height + 4) + 'px';
				$f.style.visibility = 'visible';
			}
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
		var pageFocus = {
			tag: 'page',
			index: this.focus.index
		};
		App.storage.setValue('focus', JSON.stringify(pageFocus));
	};
	model.goPortalLink = function(url){
		log(url);
	};

	return model;
}

function goHistory(){
	location.href = './history.html';
}

function goSearch(){
	location.href = './search.html';
}

function goMine(){
	location.href = './mine.html?backUrl=' + location.href;
}
function goDetail(pid, paid){
	var url = './detail.html',
			urlParam = [];
	urlParam.push('provider_id=' + pid)
	urlParam.push('provider_asset_id=' + paid)
	urlParam.push('backUrl=' + location.href);
	url += '?' + urlParam.join('&')
	location.href = url
}
function goAlbum(path) {
	my.paas.getNavigation('/aquapaas/rest/navigation/trees/' + path, function(data) {
		var template = data.metadata_public.style || '10',
				url = './topic/' + template + '/index.html'
				urlParam = [];
		urlParam.push('topic=' + encodeURIComponent(path))
		urlParam.push('backUrl=' + location.href)
		url += '?' + urlParam.join('&')
		location.href = url
	}, ['app', 'user'])
}
