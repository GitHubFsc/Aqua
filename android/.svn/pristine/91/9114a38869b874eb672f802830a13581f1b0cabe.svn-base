(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        exports.module = factory(utils) :
        typeof define === 'function' && define.amd ?
        define(['utils'], factory) : (global.app = factory(utils))
})(this, (function(utils) {
    var deepClone = utils.deepClone;
    var getJson = utils.getJson;
    var addEvent = utils.addEvent;
    var getStrByLen = utils.getStrByLen;
    var useMarquee = utils.useMarquee
    var playVideo = utils.playVideo;
    var exitApp = utils.exitApp;
    var getHash = utils.getHash;
    var setHash = utils.setHash
    var savePortal = utils.savePortal
        // var report = utils.report
    var pageID = '16'
    var hash = null
    var frame = function() {
        var pane = deepClone({}, Pane)
        var api = deepClone({}, API)
        var model = deepClone({}, Model);
        hash = getHash();
        if (hash) {
            pane.curPage = hash.curPage || pane.curPage
            pane.curMenu = hash.curMenu || pane.curMenu
            pane.curIndex = hash.curIndex || 0
            pane.focusType = hash.focusType || pane.focusType
        }
        pane.api = api;
        pane.model = model;
        pane.init();
    }
    var Pane = {
        curPage: 0,
        curMenu: 0,
        curIndex: null,
        focusOffset: 26,
        focusType: 'menu',
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
            this.loadData(this.curMenu);
        },
        setBackground: function() {
            // this.api.background(function(url) {
            //   document.body.style.backgroundImage = 'url(' + url + ')'
            // })
        },
        bindEvents: function() {
            var self = this;
            addEvent({
                left: function() {
                    if (self.focusType == 'menu') {
                        self.setFocus(0)
                    } else {
                        if (self.curPage>0 && self.curIndex==0) {
                             self.curIndex=7;
                            self.loadPage(self.curPage - 1)
                        }else{
                            self.setFocus(self.curIndex - 1)
                        }
                    }
                },
                right: function() {
                    if (self.focusType == 'menu') {
                        self.setFocus(1)
                    } else {
                        if (self.curPage>=0 && self.curIndex==7) {
                            self.curIndex=0;
                            self.loadPage(self.curPage +1)
                        }else{
                            self.setFocus(self.curIndex +1)
                        } 
                       
                    }
                },
                up: function() {
                    if (self.focusType == 'folder' && self.curIndex < 4) {
                        self.focusType = 'menu'
                        self.setFocus(self.curMenu);
                    } else if (self.focusType == 'folder' && self.curIndex < 8) {
                        self.setFocus(self.curIndex - 4)
                    }
                },
                down: function() {
                    if (self.focusType == 'menu') {
                        self.focusType = 'folder';
                        self.setFocus(0);
                    } else {
                        if (self.model.data.length-8<=0) {
                             self.setFocus(self.curIndex + 4);
                         }else{
                            if (self.curPage>=0 && self.curIndex>=4) {
                                self.curIndex=0;
                                self.loadPage(self.curPage +1);
                            }else{
                                 self.setFocus(self.curIndex + 4);
                            }
                         }
                    }
                },
                enter: function() {
                    if (self.focusType == 'folder') {
                        var data = self.model.data[self.curPage * 8 + self.curIndex]
                        var curHash = hash || {}
                        curHash.curPage = self.curPage
                        curHash.curMenu = self.curMenu
                        curHash.curIndex = self.curIndex
                        curHash.focusType = self.focusType
                        setHash(curHash)
                        playVideo({
                          ProviderId: data.pid,
                          ProviderAssetId: data.paid
                        })
                    }
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
                    // window.location.href = "app://exit"
                    exitApp();
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
                // if (p != this.curPage) {
                //     //埋点
                //     report.setKey('pageNum', self.curPage)
                //     report.setKey('serviceNum', set.length)
                //     if (p < this.curPage) {
                //         report.setKey('serviceEntrance', '2')
                //     } else if (p > this.curPage) {
                //         report.setKey('serviceEntrance', '3')
                //     }
                // }
            this.curPage = p;
            document.getElementById('curPage').innerHTML = parseInt(this.curPage + 1)
            self.api.getPosterboard(set, function(resp) {
                self.renderPage(p, resp)
            })
        },
        renderPage: function(p, set) {
            this.emptyPage();
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
            //设焦点
            this.setMenu(this.curMenu)
            this.setFocus(this.focusType == 'menu' ? this.curMenu : this.curIndex)
        },
        loadData: function(idx) {
            var self = this;
            this.api.list(treeRoot + menuRoot[idx] + '?children=1&app_key=' + app_key + '&timestamp=' + new Date().toISOString(), function(resp) {
                var data = resp;
                // data = data.concat(data).concat(data);
                self.model.list(data)
                document.getElementById('totalPage').innerHTML = Math.ceil(data.length / 8)
                self.loadPage(self.curPage)
                self.bindEvents();
            });
        },
        setFocus: function(idx) {
            var focus, index;
            if (this.focusType == 'menu') {
                index = idx;
                this.setMenu(index);
                if (this.curIndex != null) {
                    document.getElementById('folder' + (this.curIndex + 1)).style.left = this.folderPos[this.curIndex].l + 'px'
                    document.getElementById('folder' + (this.curIndex + 1)).style.top = this.folderPos[this.curIndex].t + 'px'
                    document.getElementById('folder' + (this.curIndex + 1)).style.width = ''
                    document.getElementById('folder' + (this.curIndex + 1)).style.height = ''
                    var prev_data = this.model.data[this.curPage * 8 + this.curIndex]
                    if (prev_data) {
                        document.getElementById('text' + (this.curIndex + 1)).innerHTML = getStrByLen(prev_data.text, 16)
                    }
                }
                this.curIndex = null;
                document.getElementById('focus').style.display = '';
                if (index !== this.curMenu) {
                    this.curPage = 0;
                    this.loadData(index);
                    // report.setKey('serviceEntrance', '0')
                }
                this.curMenu = index;
                // 埋点
                // report.setKey('columnID', pageID + this.curMenu)
                // report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[this.curMenu])
            } else {
                if (idx > -1 && idx < Math.min(this.model.data.length - this.curPage * 8, 8)) {
                    index = idx
                } else {
                    index = this.curIndex
                    if (index == null) {
                        index = idx
                    }
                    while (index >= Math.min(this.model.data.length - this.curPage * 8, 8)) {
                        index--
                    }
                }
                document.getElementById('focus').style.display = 'block'
                document.getElementById('focus').style.left = this.folderPos[index].l - this.focusOffset + 'px'
                document.getElementById('focus').style.top = this.folderPos[index].t - this.focusOffset + 'px'
                if (index !== this.curIndex && typeof this.curIndex == 'number') {
                    document.getElementById('folder' + (this.curIndex + 1)).style.left = this.folderPos[this.curIndex].l + 'px'
                    document.getElementById('folder' + (this.curIndex + 1)).style.top = this.folderPos[this.curIndex].t + 'px'
                        // document.getElementById('folder' + (this.curIndex + 1)).style.width = ''
                        // document.getElementById('folder' + (this.curIndex + 1)).style.height = ''
                    var prev_data = this.model.data[this.curPage * 8 + this.curIndex]
                    if (prev_data) {
                        document.getElementById('text' + (this.curIndex + 1)).innerHTML = getStrByLen(prev_data.text, 16)
                    }
                    //report.setKey('serviceEntrance', '0')
                }
                // document.getElementById('folder' + (index + 1)).style.left = this.folderPos[index].l - 6+ 'px'
                // document.getElementById('folder' + (index + 1)).style.top = this.folderPos[index].t - 4 + 'px'
                document.getElementById('folder' + (index + 1)).style.left = this.folderPos[index].l + 'px'
                document.getElementById('folder' + (index + 1)).style.top = this.folderPos[index].t + 'px'
                    // document.getElementById('folder' + (index + 1)).style.width = '266px'
                    // document.getElementById('folder' + (index + 1)).style.height = '187px'
                document.getElementById('text' + (index + 1)).innerHTML = useMarquee(this.model.data[this.curPage * 8 + index].text, 16)
                var jeimu = JSON.stringify(this.model.data[index]);
                console.log("当前节目(setFocus)="+jeimu);
                this.curIndex = index
                    // 埋点
                    //report.setKey('columnID', pageID + this.curMenu + this.curIndex)
                    //report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[this.curMenu] + '/' + this.model.data[this.curPage * 8 + this.curIndex].text)
            }
            //发送埋点
            //report.send()
            // return index;
        },
        setMenu: function(index) {
            var focus = document.getElementById('menu')
            focus.className = 'f' + index
        }
    }
    var API = {
        list: function(url, callback) {
            var self = this;
            getJson(url, function(resp) {
                var data = resp.children
                data.sort(function(a, b) {
                        return parseInt(a.index) - parseInt(b.index)
                    })
                    // self.getPosterboard(data, callback)
                callback && callback(data)
            })
        },
        background: function(callback) {
            getJson(treeRoot + '?app_key=' + app_key + '&timestamp=' + new Date().getTime(), function(item) {
                callback && callback(item.metadata['背景图片'])
            })
        },
        getPosterboard: function(data, callback) {
            var ids = data.map(function(item) {
                    return item.pid + '_' + item.paid
                }),
                _data = data
            var url = paas_host + '/aquapaas/rest/search/content_by_id/asset?ids=' + ids.join(',') + '&app_key=' + app_key + '&timestamp=' + new Date().toISOString();
            if (ids.length > 0) {
                getJson(url, function(resp) {
                    var tmp = []
                    for (var i = 0; i < _data.length; i++) {
                        var target = _data[i];
                        for (var j = 0; j < resp.length; j++) {
                            var asset = resp[j];
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
                var paid = item.metadata_public.ProviderAssetId;
                ret.push({
                    text: item.name,
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
                console.log(location.href);
                var app = new frame();
            } catch (e) {

            } finally {

            }
        }
    }

}))