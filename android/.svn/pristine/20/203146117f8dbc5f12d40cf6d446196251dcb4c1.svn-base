(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        exports.module = factory(utils) :
        typeof define === 'function' && define.amd ?
        define(['utils'], factory) : (global.app = factory(utils))
})(this, (function() {
    var deepClone = utils.deepClone;
    var getJson = utils.getJson;
    var addEvent = utils.addEvent;
    var getStrByLen = utils.getStrByLen;
    var useMarquee = utils.useMarquee;
    var playVideo = utils.playVideo;
    var exitApp = utils.exitApp;
    var getHash = utils.getHash;
    var setHash = utils.setHash;
    var savePortal = utils.savePortal
        //var report = utils.report
    var pageID = '15'
    var frame = function() {
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
        focusOffset: 26,
        folderPos: [
            { l: 0, t: 0 },
            { l: 283, t: 0 },
            { l: 566, t: 0 },
            { l: 848, t: 0 },
            { l: 0, t: 215 },
            { l: 283, t: 215 },
            { l: 566, t: 215 },
            { l: 848, t: 215 }
        ],
        init: function() {
            console.log("2019.8.23版本 黑底红字");
            console.log("~~~~~~~~~~~~~~~~~~~~~");
            console.log("浏览器版本号="+navigator.userAgent);
            console.log("浏览器插件")
            var plugins = navigator.plugins;
            for (var i = 0; plugins.length>i; i++) {
                console.log(plugins[i].name);
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~");
            if (location.search) {
                savePortal();
            }
            //report.setKey('pageID', pageID)
            this.loadData();
        },
        setBackground: function(url) {
            // this.api.background(function(url) {
            document.body.style.backgroundImage = 'url(' + url + ')'
                // })
        },
        bindEvents: function() {
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
                     if (self.curIndex==7) {
                        self.loadPage(self.curPage + 1)
                     }else{
                        self.setFocus(self.curIndex + 1);
                     }
                },
                up: function () {
                     if (self.curPage>0 &&self.curIndex<=3) {
                        self.loadPage(self.curPage -1)
                     }else{
                          self.setFocus(self.curIndex - 4)
                     }
                   
                },
                down: function () {
                     if (self.curPage>=0 &&self.curIndex>=4) {
                        self.loadPage(self.curPage +1)
                     }else{
                          self.setFocus(self.curIndex + 4)
                     }
                },
                enter: function() {
                    var data = self.model.data[self.curPage * 8 + self.curIndex]
                    setHash({
                      page: self.curPage,
                      index: self.curIndex
                    })
                    playVideo({
                      ProviderId: data.pid,
                      ProviderAssetId: data.paid
                    })
                },
                pageup: function() {
                    self.loadPage(self.curPage - 1)
                },
                pagedown: function() {
                    self.loadPage(self.curPage + 1)
                },
                back: function() {
                    // report.setKey('serviceEntrance', '-1')
                    // report.send();
                     exitApp();
                    // window.location.href = "app://exit"
                }
            })
        },
        emptyPage: function() {
            for (var i = 1; i < 9; i++) {
                document.getElementById('folder' + i).style.backgroundImage = '';
                document.getElementById('text' + i).innerHTML = ''
            }
        },
        loadPage: function(page) {
            var p = page,
                data = this.model.data;
            var self = this;
            if (p < 0 || p >= Math.ceil(data.length / 8)) {
                p = this.curPage
            }
            var set = data.slice(p * 8, (p + 1) * 8)
            self.api.getPosterBoard(set, function(resp) {
                    self.renderPage(p, resp)
                })
                // if (p < this.curPage) {
                //   report.setKey('serviceEntrance', '2')
                // } else if (p > this.curPage) {
                //   report.setKey('serviceEntrance', '3')
                // }
            this.curPage = p;
            document.getElementById('curPage').innerHTML = (this.curPage + 1)
                // return p;
                //埋点
                // report.setKey('pageNum', self.curPage)
                // report.setKey('serviceNum', set.length)
                //设焦点
            this.setFocus(this.curIndex)
        },
        renderPage: function(p, set) {
            if (p !== this.curPage) {
                this.emptyPage();
            }
            for (var i = 0; i < 8; i++) {
                var item = set[i];
                if (item) {
                    document.getElementById('folder' + (i + 1)).style.display = 'block';
                    document.getElementById('folder' + (i + 1)).style.backgroundImage = 'url(' + item.bg + ')';
                    document.getElementById('text' + (i + 1)).innerHTML = getStrByLen(item.text, 16)
                } else {
                    document.getElementById('folder' + (i + 1)).style.display = 'none';
                }
            }
        },
        loadData: function(idx) {
            var self = this;
            this.api.list(treeRoot + '?children=1&app_key=' + app_key + '&timestamp=' + new Date().toISOString(), function(resp) {
                var background = resp.metadata['背景图片']
                if (background) {
                    self.setBackground(background)
                }
                var data = resp.children;
                data.sort(function(a, b) {
                    return parseInt(a.index) - parseInt(b.index)
                })
                self.model.list(data)
                document.getElementById('totalPage').innerHTML = Math.ceil(parseInt(data.length) / 8)
                self.loadPage(self.curPage)
                self.bindEvents();
            });
        },
        setFocus: function(idx) {
            var focus, index;
            if (idx > -1 && idx < 8) {
                index = idx
            } else {
                index = this.curIndex
            }
            while (index >= Math.min(this.model.data.length - this.curPage * 8, 8)) {
                index--
            }
            document.getElementById('focus').style.display = 'block'
            document.getElementById('focus').style.left = this.folderPos[index].l - this.focusOffset + 'px'
            document.getElementById('focus').style.top = this.folderPos[index].t - this.focusOffset + 'px'
            if (index !== this.curIndex) {
                document.getElementById('folder' + (this.curIndex + 1)).style.left = this.folderPos[this.curIndex].l + 'px'
                document.getElementById('folder' + (this.curIndex + 1)).style.top = this.folderPos[this.curIndex].t + 'px'
                document.getElementById('folder' + (this.curIndex + 1)).style.width = ''
                document.getElementById('folder' + (this.curIndex + 1)).style.height = ''
                var prev_data = this.model.data[this.curPage * 8 + this.curIndex]
                if (prev_data) {
                    document.getElementById('text' + (this.curIndex + 1)).innerHTML = getStrByLen(prev_data.text, 16)
                }
                // report.setKey('serviceEntrance', '0')//埋点
            }
            // document.getElementById('folder' + (index + 1)).style.left = this.folderPos[index].l - 6 + 'px'
            // document.getElementById('folder' + (index + 1)).style.top = this.folderPos[index].t - 4 + 'px'
            document.getElementById('folder' + (index + 1)).style.left = this.folderPos[index].l + 'px'
            document.getElementById('folder' + (index + 1)).style.top = this.folderPos[index].t + 'px'
                // document.getElementById('folder' + (index + 1)).style.width = '266px'
                // document.getElementById('folder' + (index + 1)).style.height = '187px'
            document.getElementById('text' + (index + 1)).innerHTML = useMarquee(this.model.data[this.curPage * 8 + index].text, 16)
            var jeimu = JSON.stringify(this.model.data[index]);
            console.log("当前节目(setFocus)="+jeimu);
            this.curIndex = index;
                // return index;
                //埋点
                // report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + '/' + this.model.data[this.curPage * 8 + index].text)
                // report.setKey('columnID', pageID + this.curIndex)
                // report.send();
        }
    }
    var API = {
        list: function(url, callback) {
            var self = this;
            getJson(url, function(resp) {
                callback && callback(resp);
            })
        },
        background: function(callback) {
            getJson(treeRoot + '?app_key=' + app_key + '&timestamp=' + new Date().toISOString(), function(item) {
                callback && callback(item.metadata['背景图片'])
            })
        },
        getPosterBoard: function(data, callback) {
            var _data = data,
                ids = _data.map(function(item) {
                    return item.pid + '_' + item.paid
                }),
                url = paas_host + '/aquapaas/rest/search/content_by_id/asset?ids=' + ids.join(',') + '&app_key=' + app_key + '&timestamp=' + new Date().toISOString()
            if (ids.length > 0) {
                getJson(url, function(resp) {
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
        list: function(set) {
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
        init: function() {
            try {
                utils.debug(showLog);
                var app = new frame();
            } catch (e) {
                console.log('>>>>error message:' + e.message);
            } finally {

            }
        }
    }

}))