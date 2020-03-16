/*
*1.查看历史记录
*2.直接进入播放
*3.清空历史记录
*4.返回首页
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        exports.module = factory(utils) :
        typeof define === 'function' && define.amd ?
            define(['utils'], factory) : (global.app = factory(utils))
})(this, function (){
	var deepClone = utils.deepClone,
		getJson = utils.getJson,
		addEvent = utils.addEvent,
		debug = utils.debug,
		history_store = MyStorage.getStorage(),
		store_data = history_store.getValue('xor.kgqws.history');
	var frame = function (){
		var pane = deepClone({}, Pane),
        	api = deepClone({}, API),
        	model = deepClone({}, Model);
        pane.api = api;
        pane.model = model;
		pane.init();
	}
	var Pane = {
		curIndex: 0,
		totalIndex: 0,  //总数据
		curPage: 0,   //当前页
		totalPage: 0,  //总页数
		operation: 'false', //是否打开操作对话框
		operationIndex: 0, // 选中操作
		pageIndex: 0,   //分页按键
		isPage: 'false', //是否进入了分页
		posterImgs: [
			{l: 90, t: 130},
			{l: 275, t: 130},
			{l: 460, t: 130},
			{l: 645, t: 130},
			{l: 830, t: 130},
			{l: 1015, t: 130},
			{l: 90, t: 385},
			{l: 275, t: 385},
			{l: 460, t: 385},
			{l: 645, t: 385},
			{l: 830, t: 385},
			{l: 1015, t: 385}
		],
		pageFocus: [
			{l: 550, t: 660},
			{l: 690, t: 660}
		],
		init: function (){
			console.log('navigator.userAgent=='+navigator.userAgent);
			if (navigator.userAgent.lastIndexOf('iPanel') > -1) {// linux
				console.log('CAID=='+CA.card.serialNumber);
            } 
			setupPaaS(function() {   //拿到my.paas数据
				console.log('paas ready');
			});
			this.loadData();
		},
		// 加载页面海报
		loadData: function (){
			var _this = this;
			if(store_data){
				var curData = JSON.parse(store_data);
				_this.curIndex = curData.curIndex;
				_this.curPage = curData.curPage;
			}
			_this.bindEvents();
			_this.api.list(function (resp){  //获取pid_paid
				_this.model.list(resp);
				_this.loadPage(_this.curPage);
			});
		},
		// 事件绑定
		bindEvents: function (){
			var _this = this;
			addEvent({
                left: function () {
					if(_this.operation == 'false'){
						if(_this.isPage == 'false'){
							if(_this.model.data.length > 0){
								if(_this.curIndex == 0){
									_this.setPosterFocus(_this.curIndex);
								} else {
									_this.setPosterFocus(_this.curIndex - 1);
								}
							}
						} else {
							if(_this.pageIndex == 0){
								_this.setPageFocus(_this.pageIndex);
							} else {
								_this.setPageFocus(_this.pageIndex - 1);
							}
						}
					} else {
						if(_this.operationIndex == 0){
							_this.menuOperation(_this.operationIndex);
						} else {
							_this.menuOperation(_this.operationIndex - 1);
						}
					}
                },
                right: function () {
					if(_this.operation == 'false'){
						if(_this.isPage == 'false'){
							if(_this.model.data.length > 0){
								if(_this.curIndex == 11 || (_this.curPage * 12 + _this.curIndex) == _this.totalIndex - 1){
									_this.setPageFocus(_this.pageIndex);
								} else {
									if(_this.curIndex < 11){
										_this.setPosterFocus(_this.curIndex + 1);
									} else {
										_this.setPageFocus(_this.pageIndex);
									}
								}
							}
						} else {
							if(_this.pageIndex == 1){
								_this.setPageFocus(_this.pageIndex);
							} else {
								_this.setPageFocus(_this.pageIndex + 1);
							}
						}
					} else {
						if(_this.operationIndex == 3){
							_this.menuOperation(_this.operationIndex);
						} else {
							_this.menuOperation(_this.operationIndex + 1);
						}
					}
                },
                up: function () {
					if(_this.operation == 'false'){
						if(_this.isPage == 'false'){
							if(_this.model.data.length > 0){
								if(_this.curIndex >= 5){
									_this.setPosterFocus(_this.curIndex - 6);
								} else {
									_this.curIndex = 0;
									_this.setPosterFocus(_this.curIndex);
								}
							}
						} else {// 跳出分页
								_this.isPage = 'false';
							//    _this.curIndex = 0;
								_this.pageIndex = 0;
							_this.setPosterFocus(_this.curIndex);
						}
					}
                },
                down: function () {
					if(_this.operation == 'false'){
						if(_this.isPage == 'false'){
							if(_this.model.data.length > 0){
								if(_this.curIndex == 11 || (_this.curPage * 12 + _this.curIndex) == _this.totalIndex - 1 || (_this.totalIndex - _this.curPage * 12) <= 6){
									_this.setPageFocus(_this.pageIndex);
								} else {
									if(_this.curIndex <= 5){
										_this.setPosterFocus(_this.curIndex + 6);
									} else {
										_this.setPageFocus(_this.pageIndex);
									}
								}
							}
						}
					}
                },
                enter: function () {
					if(_this.model.data.length > 0){
						if(_this.isPage == 'false'){
							if(_this.operation == 'false'){
								_this.operation = 'true';
								_this.operationIndex = 0;
								document.getElementById('histroy_dialog').style.display = 'block';
								_this.menuOperation(_this.operationIndex);
							} else {
								store_data = '';
								_this.operation = 'false';
								document.getElementById('histroy_dialog').style.display = 'none';
								switch (_this.operationIndex) {
									case 0:
										console.log('播放videoids数组的index=='+_this.curIndex+'videoid=='+_this.model.videoids[_this.curIndex]);
										var vod = {
											videoid: _this.model.videoids[_this.curIndex]
										}
										playVideo(vod)
										break;
									case 1:
										_this.menuEmpty();
										break;
									case 2:
										_this.menuCancle();
										break;
									default:
										break;
								};
							};
						} else {
							switch (_this.pageIndex) {
								case 0:
									this.pageup();
									break;
								case 1:
									this.pagedown();
									break;
								default:
									break;
							};
						}
					}
                },
                pageup: function () {
					if(_this.operation == 'false'){
						if(_this.model.data.length > 0){
							if(_this.curPage == 0){
								_this.loadPage(_this.curPage);
							} else {
								_this.curIndex = 0;
								_this.loadPage(_this.curPage - 1);
							}
							_this.setPageFocus(0);
						}
					}
                },
                pagedown: function () {
					if(_this.operation == 'false'){
						if(_this.model.data.length > 0){
							if(_this.curPage == _this.totalPage - 1){
								_this.loadPage(_this.curPage);
							} else {
								_this.curIndex = 0;
								_this.loadPage(_this.curPage + 1);
							}
							_this.setPageFocus(1);
						}
					}
                },
                back: function (){
					if(_this.operation == 'false'){
						history_store.setValue('xor.kgqws.history', '');
						var url = location.href.slice(0, location.href.lastIndexOf('/') + 1);
						location.href = url + 'index.html';
					} else {
						_this.operation = 'false';
                    	document.getElementById('histroy_dialog').style.display = 'none';
					}
                },
            })
		},
		// 加载页面
		loadPage: function (page){
			var _this = this;
			var p = page, data = _this.model.data;
			if(p < 0 || p >= _this.totalPage){
				p = _this.curPage;
			}
			var post_data = data.slice(p * 12, (p + 1) * 12);
			_this.totalIndex = data.length;
			_this.totalPage = Math.ceil(_this.totalIndex / 12);
			if(post_data.length > 0){
				var ids = _this.model.listIds(post_data);
				_this.api.listPoster(ids, function (resp){  //获取海报
					var poster_srcs = _this.model.listPoster(resp);
					for(var i = 0; i < 12; i++){
						var item = post_data[i];
						if(item){
							var history_poster_img = document.getElementById('history_poster_img' + i);
							history_poster_img.style.display = 'block';
							history_poster_img.src = poster_srcs[i];
							history_poster_img.style.left = _this.posterImgs[i].l + 'px';
							history_poster_img.style.top = _this.posterImgs[i].t + 'px';
						} else {
							document.getElementById('history_poster_img' + i).style.display = 'none';
						}
					}
					_this.curPage = p;
					document.getElementById('history_current_page').innerHTML = _this.curPage + 1;
					document.getElementById('history_total_page').innerHTML = _this.totalPage;
					if(_this.isPage == 'false'){
						_this.setPosterFocus(_this.curIndex);
					} else {
						_this.setPageFocus(_this.pageIndex);
					}
				});
			}
		},
		//海报聚焦
		setPosterFocus: function (idx){
			var _this = this;
			var index;
            if (0 <= idx < 12) {
                index = idx;
            } else {
                index = _this.curIndex;
			}
			while (index < 0) {
                index = 0;
			}
			while (index >= Math.min(_this.model.data.length - _this.curPage * 12, 12)) {
                index--;
			}
			if(_this.model.data.length > 0){
				document.getElementById('history_page_focus').style.display = 'none';
				var poster_focus = document.getElementById('history_poster_focus');
				poster_focus.style.display = 'block';
				poster_focus.style.left = _this.posterImgs[index].l + 'px';
				poster_focus.style.top = _this.posterImgs[index].t + 'px';
				_this.curIndex = index;
			}
		},
		// 分页聚焦
		setPageFocus: function (index){
			var _this = this;
			_this.isPage = 'true';
            var poster_focus = document.getElementById('history_poster_focus');
            poster_focus.style.display = 'none';
			var page_focus = document.getElementById('history_page_focus');
            page_focus.style.display = 'block';
            page_focus.style.left = _this.pageFocus[index].l + 'px';
            page_focus.style.top = _this.pageFocus[index].t + 'px';
            _this.pageIndex = index;
		},
		// menu操作
		menuOperation: function (index){
			var _this = this;
			switch (index) {
	          case 0:
	            document.getElementById('histroy_empty').classList.remove("btn_checked");
	            document.getElementById('histroy_cancel').classList.remove("btn_checked");
	            document.getElementById('histroy_video').classList.add("btn_checked");
	            break;
	          case 1:
	            document.getElementById('histroy_video').classList.remove("btn_checked");
	            document.getElementById('histroy_cancel').classList.remove("btn_checked");
	            document.getElementById('histroy_empty').classList.add("btn_checked");
				break;
			  case 2:
	            document.getElementById('histroy_video').classList.remove("btn_checked");
	            document.getElementById('histroy_empty').classList.remove("btn_checked");
	            document.getElementById('histroy_cancel').classList.add("btn_checked");
	            break;
	          default:
	            break;
	        };
	        _this.operationIndex = index;
		},
		// 清空记录
		menuEmpty: function (){
			var _this = this;
			_this.api.menuDelete(function (status){
				if(status == 'success'){
					_this.operation = 'false';
					_this.isPage = 'false';
					_this.curIndex = 0;
					_this.curPage = 0;
					_this.pageIndex = 0;
					_this.loadData();
					document.getElementById('histroy_dialog').style.display = 'none';
				}
			})
		},
		// 取消
		menuCancle: function (){
			var _this = this;
			_this.operation = 'false';
        	document.getElementById('histroy_dialog').style.display = 'none';
		},
	};
	var API = {   // 代码重叠部分为测试数据
		list: function (callback){
			var _this = this;
			// var smard_card_id = '1372466432';
			// var start_date = '1970-01-01';
			// var end_date = '2019-12-17';
			// var url = 'http://172.16.20.155:8080/aquapaas/rest/multiapp/viewhistory/subscriber/' + smard_card_id;
			// var opts = [];
	      	// opts.push('start_date=' + start_date);
	      	// opts.push('end_date=' + end_date);
	      	// opts.push('view_delete_flag=' + 'false');
			var smard_card_id = Model.getSmardCardId();  //拿到机顶盒smard_card_id
			var start_date = '1970-01-01';
			var end_date = Model.formatDate();
			var url = paasHost + '/aquapaas/rest/multiapp/viewhistory/subscriber/' + smard_card_id;
			var opts = [];
	      	opts.push('start_date=' + start_date);
	      	opts.push('end_date=' + end_date);
	      	opts.push('view_delete_flag=' + 'true');   //过滤标记删除的数据
	      	opts.push('app_key=' + paasAppKey);
	      	opts.push('timestamp=' + new Date().toISOString());
			url += "?" + opts.join('&');
			console.log('list_url=='+url);
			var type = 'get';
			var Accept = 'application/multiapp-viewhistory';
			getJson(type, url, Accept, function (resp) {
                callback && callback(resp);
            });
		},
		listPoster: function (ids, callback){
			var _this = this;
			var doc_type = 'vod';
			// var url = 'http://api.xor-live.io/aquapaas/rest/search/content_by_id/' + doc_type;
			// var opts = [];
	      	// opts.push('ids=30000_FTIT0120190614237587,ZGD_7A15DBF16DFE8B3B18DD99BABD66716C');
			var url =  paasHost + '/aquapaas/rest/search/content_by_id/' + doc_type;
			var opts = [];
	      	opts.push('ids=' + ids);
	      	opts.push('app_key=' + paasAppKey);
	      	opts.push('timestamp=' + new Date().toISOString());
			url += "?" + opts.join('&');
			var type = 'get';
			var Accept = 'application/json';
			getJson(type, url, Accept, function (resp) {
				callback && callback(resp);
            });
		},
		menuDelete: function (callback){
			var _this = this;
			// var smard_card_id = '1372466432';
			// var end_date = '2019-12-17';
			// var url = 'http://172.16.20.155:8080/aquapaas/rest/multiapp/viewhistory/deleteflag/' + smard_card_id;
			var smard_card_id = Model.getSmardCardId();
			var end_date = Model.formatDate();
			var url = paasHost + '/aquapaas/rest/multiapp/viewhistory/deleteflag/' + smard_card_id;
			var opts = [];
	      	opts.push('end_date=' + end_date);
	      	opts.push('app_key=' + paasAppKey);
	      	opts.push('timestamp=' + new Date().toISOString());
			url += "?" + opts.join('&');
			var type = 'get';
			var Accept = 'application/multiapp-viewhistory';
			getJson(type, url, Accept, function (resp, status) {
				callback && callback(status);
            });
		}
	};
	var Model = {
		data: [],
		videoids: [],
		list: function (ret){
			if(ret && ret.details){
				this.data = ret.details;
			}
		},
		listIds: function (data){
			var ids = [];
			for(var i = 0; i < data.length; i++){
				var pid_paid = data[i].provider_id + '_' + data[i].provider_asset_id;
				ids.push(pid_paid);
			}
			return ids;
		},
		listPoster: function (ret){
			var _this = this;
			var poster_srcs = [];
			for(var i = 0; i < ret.length; i++){
				_this.videoids.push(ret[i].videoid || '');
				if(ret[i].posterboard){
					poster_srcs.push(ret[i].posterboard);
				} else if(ret[i].packageposterboard){
					poster_srcs.push(ret[i].packageposterboard.split(',')[1]);
				}
			}
			return poster_srcs;
		},
		formatDate: function (){
			var date = new Date();
			var y = date.getFullYear();  
			var m = date.getMonth() + 1;  
			m = m < 10 ? '0' + m : m;  
			var d = date.getDate();  
			d = d < 10 ? ('0' + d) : d;  
			return y + '-' + m + '-' + d;  
		},
		getSmardCardId: function(){
			var ret = ''
			try {
				if (navigator.userAgent.lastIndexOf('iPanel') > -1) {// linux
					ret = CA.card.serialNumber;
				// } else { // android
				// 	var result = GHWEBAPI.GetParam(key)
				// 	if (result.ResultCode == '0') {
				// 		ret = result.ParamValue
				// 	} else {
				// 		console.log('get param error:' + result.Description);
				// 	}
				}
			} catch (e) {
				console.log('error: ' + e.message);
			} finally {
			}
			return ret;
		}
	};
	return {
        init: function () {
        	debug(printLog);
            var app = new frame();
        }
    }
})