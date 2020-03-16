(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        exports.module = factory(utils) :
        typeof define === 'function' && define.amd ?
            define(['utils'], factory) : (global.app = factory(utils))
})(this, (function () {
    var deepClone = utils.deepClone;
    var getJson = utils.getJson;
    var addEvent = utils.addEvent;
    var getStrByLen = utils.getStrByLen;
    var useMarquee = utils.useMarquee;
    var playVideo = utils.playVideo;
    var exitApp = utils.exitApp;
    var getHash = utils.getHash;
    var setHash = utils.setHash;
    var savePortal = utils.savePortal;
    var pageID = '14'
    var frame = function () {
        var pane = deepClone({}, Pane)
        var api = deepClone({}, API)
        var model = deepClone({}, Model);
        var state = getHash();
        if (state) {
            pane.curPage = state.page || pane.curPage
            pane.curIndex = state.index || pane.curIndex
        }
        pane.api = api;
        pane.model = model;
        pane.init();
    }
    var Pane = {
        curPage: 0,
        curIndex: 0,
        focusOffset: 27,
        folderPos: [
            { l: 111, t: 178 },
            { l: 657, t: 178 },
            { l: 111, t: 412 },
            { l: 657, t: 412 }
        ],
        menuPos: [
            { l: 84, t: 151 },
            { l: 630, t: 151 },
            { l: 84, t: 385 },
            { l: 630, t: 385 }
        ],
        init: function () {
            // console.log("2019.8.23版本 黑底红字");
            // console.log("~~~~~~~~~~~~~~~~~~~~~");
            // console.log("浏览器版本号="+navigator.userAgent);
            // console.log("浏览器插件")
            // var plugins = navigator.plugins;
            // for (var i = 0; plugins.length>i; i++) {
            //     console.log(plugins[i].name);
            // }
            // console.log("~~~~~~~~~~~~~~~~~~~~~");
            if (location.search) {
                savePortal();
            }
            this.loadData();
        },
        loadData: function (idx) {
            var self = this;
            this.api.list(treeRoot + '?children=1&app_key=' + app_key + '&timestamp=' + new Date().toISOString(), function (resp) {
                var background = resp.metadata['背景图片']
                if (background) {
                    self.setBackground(background)
                }
                console.log('resp:' + resp.children);
                var data = resp.children;

                data.sort(function (a, b) {
                    return parseInt(a.index) - parseInt(b.index)
                })
                self.model.list(data)
                document.getElementById('totalPage').innerHTML = Math.ceil(parseInt(data.length) / 4)
                self.loadPage(self.curPage)
                self.bindEvents();
            });
        },
        loadPage: function (page) {
            var p = page,
                data = this.model.data;
            var self = this;
            if (p < 0 || p >= Math.ceil(data.length / 4)) {
                p = this.curPage
            }
            var set = data.slice(p * 4, (p + 1) * 4)
            self.api.getPosterBoard(set, function (resp) {
                self.renderPage(p, resp)
            })
            if (p < this.curPage) {
                report.setKey('serviceEntrance', '2')
            } else if (p > this.curPage) {
                report.setKey('serviceEntrance', '3')
            }
            this.curPage = p;
            document.getElementById('curPage').innerHTML = (this.curPage + 1)
            //设焦点
            this.setFocus(this.curIndex)
        },
        setFocus: function (idx) {
            var focus, index;
            if (idx > -1 && idx < 4) {
                index = idx
            } else {
                index = this.curIndex
            }
            while (index >= Math.min(this.model.data.length - this.curPage * 4, 4)) {
                index--
            }
            document.getElementById('focus').style.display = 'block'
            document.getElementById('focus').style.left = this.menuPos[index].l + 'px'
            document.getElementById('focus').style.top = this.menuPos[index].t + 'px'
            this.curIndex = index;
            var jeimu = JSON.stringify(this.model.data[this.curIndex]);
            console.log("当前节目(setFocus)="+jeimu);
        },
        renderPage: function (p, set) {
            if (p !== this.curPage) {
                this.emptyPage();
            }
            for (var i = 0; i < 4; i++) {
                var item = set[i];
                if (item) {
                    document.getElementById('folder' + (i + 1)).style.display = 'block';
                    document.getElementById('folder' + (i + 1)).src = item.bg;
                } else {
                    document.getElementById('folder' + (i + 1)).style.display = 'none';
                }
            }
        },
        emptyPage: function () {
            for (var i = 1; i < 4; i++) {
                document.getElementById('folder' + i).src = '';
            }
        },
        
        setBackground: function (url) {
            document.body.style.backgroundImage = 'url(' + url + ')'
        },
        bindEvents: function () {
            var self = this;
            addEvent({
                left: function () {
                    if (self.curPage>0 &&self.curIndex==0) {
                        self.loadPage(self.curPage - 1)
                     }else{
                        self.setFocus(self.curIndex - 1);
                     }
                },
                right: function () {
                     if (self.curIndex==3) {
                        self.loadPage(self.curPage + 1)
                     }else{
                        self.setFocus(self.curIndex + 1);
                     }
                },
                up: function () {
                     if (self.curPage>0 &&self.curIndex<=1) {
                        self.loadPage(self.curPage -1)
                     }else{
                        self.setFocus(self.curIndex - 2);
                     }
                   
                },
                down: function () {
                     if (self.curPage>=0 &&self.curIndex>=2) {
                        
                        self.loadPage(self.curPage +1)
                     }else{
                        self.setFocus(self.curIndex + 2);
                     }
                },
                enter: function () {
                    setHash({
                        page: self.curPage,
                        index: self.curIndex,
                    });
                    var data = self.model.data[(self.curPage * 4 + self.curIndex)];
                    playVideo({
                        ProviderId: data.pid,
                        ProviderAssetId: data.paid,
                    });
                },
                pageup: function () {
                    self.loadPage(self.curPage - 1)
                },
                pagedown: function () {
                    self.loadPage(self.curPage + 1)
                },
                back: function () {
                    exitApp();
                }
            })
        }
    }
    var API = {
        list: function (url, callback) {
            console.log("url="+url);
            var self = this;
            getJson(url, function (resp) {
                callback && callback(resp);
            })
        },
        background: function (callback) {
            getJson(treeRoot + '?app_key=' + app_key + '&timestamp=' + new Date().toISOString(), function (item) {
                callback && callback(item.metadata['背景图片'])
            })
        },
        getPosterBoard: function (data, callback) {
            var _data = data,
                ids = _data.map(function (item) {
                    return item.pid + '_' + item.paid
                }),
                url = paas_host + '/aquapaas/rest/search/content_by_id/asset?ids=' + ids.join(',') + '&app_key=' + app_key + '&timestamp=' + new Date().toISOString()
            if (ids.length > 0) {
                getJson(url, function (resp) {
                    var tmp = []
                    for (var i = 0; i < _data.length; i++) {
                        var target = _data[i]
                        for (var j = 0; j < resp.length; j++) {
                            var asset = resp[j]
                            if (target.pid == asset.provider_id && target.paid == asset.provider_asset_id) {
                                target.bg = (asset.posterboard || '').split(',').pop()
                            }
                        }
                        if (!!!target.bg) {
                            target.bg = ''
                        }
                        tmp.push(target)
                    }
                    callback && callback(tmp)
                })
            } else {
                callback && callback(_data)
            }
        }
    }
    var Model = {
        list: function (set) {
            var ret = [];
            for (var i = 0; i < set.length; i++) {
                var item = set[i]
                var pid = item.metadata_public.ProviderId
                var paid = item.metadata_public.ProviderAssetId
                // var posters = item.bg.split(',')
                // var poster = posters.pop();
                ret.push({
                    text: item.name,
                    // bg: item.bg,
                    pid: pid,
                    paid: paid
                })
            }
            this.data = ret;
        }
    }
    return {
        init: function () {
            utils.debug(showLog);
            var app = new frame();
        }
    }

}))