var PaaSTreeRoot = '/aquapaas/rest/navigation/trees/';

var RootNode = new ColumnNode(null, '年华', '1');

var Tabsv = {
	columnNode: new ColumnNode(RootNode, '红星专区', '11'),

	init: function(){
		var _this = this;
		this.isReady = false;
		this.navPath = NavigationRoot;
		var pageFocus = App.store.getValue('pageFocus');
		try{
			pageFocus = typeof pageFocus == 'string' && pageFocus != '' ? JSON.parse(pageFocus) : null;
		}catch(e){
			log(e.message);
		}
		if(pageFocus != null){
			var seq = Number(pageFocus.seq);
			if(seq >= 0 && seq <= this.focus.lmt.seq){
				this.focus.seq = seq;
			}
		}
		this.collector = new AppRepoint();
		this.collector.pageID = '21';
		this.setTabs(function(){
			_this.isReady && setFocus(_this);
		});
	},
	setTabs: function(callback){
		var _this = this;
		this.getData(function(data){
			_this.pageData = data;
			var num = data.length;
			if(num > 0){
				_this.isReady = true;
			}
			_this.focus.lmt.seq = num - 1;
			_this.collector.serviceNum = num;
			for(var i = 0; i < 2; i+=1){
				var item = data[i];
				if(item != null){
					$_id('poster_' + i).setAttribute('src', (item.metadata && item.metadata['节目海报']) || item.poster || '');
					$_id('tab_' + i).style.visibility = 'visible';
				} else {
					$_id('tab_' + i).style.visibility = 'hidden';
				}
			}
			if(typeof callback == 'function'){
				callback();
			}
		})
	},
	getData: function(callback){
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
						provider_asset_id: provider_asset_id,
						metadata: item.metadata
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
						callback(assets);
					}
				}, ['app']);
			} else {
				callback(assets);
			}
		});
	},
	focus: {
		seq: 0,
		lmt: {
			seq: 1
		}
	},
	focusPosition: {
		focus: [{left: '78px'}, {left: '682px'}],
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
			return false;
			break;
		case keyValue.left:
		case keyValue.LEFT:
			this.collector.serviceEntrance = '0';
			if(this.focus.seq > 0){
				this.focus.seq -= 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			this.collector.serviceEntrance = '0';
			if(this.focus.seq < this.focus.lmt.seq){
				this.focus.seq += 1;
				this.changeFocus();
			}
			return false;
			break;
		case keyValue.enter:
		case keyValue.ENTER:
			this.collector.serviceEntrance = '1';
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
		var $f = $_id('tab_focus');
		var fp = this.focusPosition.focus[this.focus.seq];
		$f.style.left = fp.left;
		var index = this.focus.seq;
		var item = this.pageData[index];
		var node = new ColumnNode(this.columnNode, item.name, index);
		this.collector.columnName = node.getNodePath();
		this.collector.columnID = node.getNodeId();
		this.collector.collect();
	},
	onFocusIn: function(){
		this.changeFocus();
		$_id('tab_focus').style.visibility = 'visible';
	},
	onFocusOut: function(){
	},
	enterPressed: function(){
		var index = this.focus.seq;
		var item = this.pageData[index];
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
	},
	storeFocus: function(){
		var pageFocus = {
			seq: this.focus.seq
		};
		App.store.setValue('pageFocus', JSON.stringify(pageFocus));
	}
};
