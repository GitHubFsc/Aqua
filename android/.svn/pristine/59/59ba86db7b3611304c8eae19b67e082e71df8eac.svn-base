(function(globle, factory) {
    typeof exports === 'objects' && typeof module !== 'undefined' ?
        exports.module = factory(utils) :
        typeof define === 'function' && define.amd ?
        define(['utils'], factory) :
        (globle.app = factory(utils))
})(this, (function(utils) {
    'use strict'
    var deepClone = utils.deepClone,
        addEvent = utils.addEvent,
        getJson = utils.getJson,
        useMarquee = utils.useMarquee,
        getStrByLen = utils.getStrByLen,
        getUrlParam = utils.getUrlParam,
        debug = utils.debug,
        exitApp = utils.exitApp,
        getHash = utils.getHash,
        setHash = utils.setHash,
        playVideo = utils.playVideo,
        savePortal = utils.savePortal,
        // report = utils.report,
        pageID = '11',
        hash = null;
    var dialog = function() {
        var pane = deepClone({}, Pane);
        // pane.curMenu = parseInt(getUrlParam('menu')||0)
        var api = deepClone({}, API);
        var model = deepClone({}, Model);
        hash = getHash() //记录hash值到模块变量
        if (hash) {
            pane.focusType = typeof hash.focusType !== 'undefined' ? hash.focusType : pane.focusType
            pane.curMenu = typeof hash.curMenu !== 'undefined' ? hash.curMenu : pane.curMenu
            pane.curIndex = typeof hash.curIndex !== 'undefined' ? hash.curIndex : pane.curIndex

        }
        pane.api = api;
        pane.model = model;
        pane.init();
    }
    var Pane = {
        curIndex: 0,
        curMenu: 0,
        //用于区分当前焦点所在位置
        //menu 左侧菜单 
        //folder 右侧节目
        focusType: 'menu',
        //一个全局变量 判断左侧分类方法是否是第一次执行
        menuflag: true,
        menuPos: [
            { l: -41, t: 75 },
            { l: -41, t: 261 },
            { l: -41, t: 433 }
        ],
        folderPos: [
            { l: 202, t: 102 },
            { l: 709, t: 102 },
            { l: 202, t: 412 },
            { l: 402, t: 412 },
            { l: 602, t: 412 },
            { l: 802, t: 412 },
            { l: 1002, t: 412 }
        ],
        init: function() {
            console.log("2019.8.26版本 黑底红字");
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
            this.CsetMenu(this.curMenu);
            this.loadData(this.curMenu);
            // this.setMenu(this.curMenu)
            // if (this.focusType == 'folder') {
            //     this.setFocus(this.curIndex)
            // }
            // this.bindEvents();
        },
        bindEvents: function() {
            var self = this;
            addEvent({
                up: function() {
                    if (self.focusType == 'menu') {
                        self.menuflag = false,
                            self.setMenu(self.curMenu - 1)
                    } else {
                        if (self.curIndex > 1) {
                            self.setFocus(Math.floor(self.curIndex / 4))
                        }
                    }
                    return false;
                },
                down: function() {
                    if (self.focusType == 'menu') {
                        self.menuflag = false,
                            self.curIndex = 0;
                        self.setMenu(self.curMenu + 1)
                    } else {
                        if (self.curIndex > 1) {
                            self.gotoLv2();
                        } else {
                            if(self.model.data.length-self.curIndex <= 2){
                                self.gotoLv2();
                            } else {
                                self.setFocus((self.curIndex + 1) * 2) //0->2 1->4
                            }
                        }
                    }
                    return false;
                },
                left: function() {
                    if (self.focusType == 'folder' && (self.curIndex == 0 || self.curIndex == 2)) {
                        self.focusType = 'menu'
                        self.curIndex = 0;
                        self.setMenu(self.curMenu)
                    } else if (self.focusType == 'folder') {
                        self.setFocus(self.curIndex - 1)
                    }
                    return false;
                },
                right: function() {
                    if (self.focusType == 'menu') {
                        self.focusType = 'folder'
                        if (Math.floor(self.curMenu / 2) > 0) {
                            self.setFocus(0);
                        } else {
                            self.setFocus(Math.floor(self.curMenu / 2) * 2)
                        }
                    } else if (self.curIndex !== self.model.data.length - 1 && self.curIndex !== 1) {
                        self.setFocus(self.curIndex + 1);
                    } else if (self.curIndex >= self.model.data.length) {
                        self.gotoLv2();
                    } else {
                        self.gotoLv2();
                    }
                    return false;
                },
                enter: function() {
                    if (self.focusType == 'folder') {
                        var curHash = {};
                        curHash.curMenu = self.curMenu;
                        curHash.curIndex = self.curIndex;
                        curHash.focusType = self.focusType;
                        setHash(curHash)
                        self.gotoDetail();
                    } else {
                        self.gotoLv2()
                    }
                    return false;
                },
                back: function() {
                    document.getElementById('ad').style.display = '';
                    setTimeout(function() {
                         exitApp();
                       // location.href="app://exit";
                    }, 2 * 1000)
                    return false;
                }
            })
        },
        gotoLv2: function() {
            var self = this;
            var appBackParam = null;
            var curHash = hash || {};
            curHash.focusType = self.focusType;
            curHash.curMenu = self.curMenu;
            curHash.curIndex = self.curIndex;
            setHash(curHash);
            var url = './second.html';
            url += location.hash;
            location.href = url;
        },
        gotoDetail: function() {
            var item = this.model.data[this.curIndex],
                parent = document.querySelectorAll('.menu')[this.curMenu],
                self = this,
                appBackParam = null;
            var curHash = hash || {}
            curHash.focusType = self.focusType
            curHash.curIndex = self.curIndex
            curHash.curMenu = self.curMenu
            setHash(curHash)
            if (item) {
                var url = 'asset.html?prev=index1&pid=' + item.pid + '&paid=' + item.paid + "&name=" + item.text;
                appBackParam = getUrlParam('backUrl')
                if (appBackParam) {
                    url += '&backUrl=' + appBackParam;
                }
                url += location.hash
                location.href = url;
            }
        },
        goto3Detail: function() {
            var item = this.model.data[this.curIndex];
            //2019-05-07根据金磊的要求，现在写死假数据
            if (item) {
                var vspUrl = vsphost + "/vsp_outlet/catalog/reverse/json?id=10048905&paids=" + item.paid + "&caid=1370495919&key=ahof3hgaobpgn7";
                getJson(vspUrl, function(resp) {
                    var vspId = resp.result.list[0].id;
                    // console.log('vspId:' + vspId);
                    if (vspId != "undefined") {
                        if (navigator.userAgent.lastIndexOf('iPanel') > -1) { //iPanel
                            // console.log('goto ipanel');
                            location.href = yuanxianhost + "/jiaying_dsyx_ghitv/details.html?entry=20&dataId=" + vspId;
                        } else { //歌华适配层
                            try {
                                if (CyberCloud) { // 瘦终端
                                    // console.log('goto thinClientLink');
                                    var ret = GHWEBAPI.StartApp({
                                        AppMode: 'Mixed',
                                        AppID: portalAppId,
                                        AppType: 'WEB',
                                        AppParam: {
                                            Linux: yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId,
                                            Android: yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId,
                                            ThinClient: yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId
                                        }
                                    }, null, "")
                                }
                            } catch (e) {
                                // console.log('androidLink:' + (yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId));
                                location.href = yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId;
                            } finally {

                            }
                        }
                    }
                })
            }
        },
        setFocus: function(index) {
            document.getElementById('menu2').style.display = 'none';
            var focus = document.getElementById('focus')
            var jeimu = JSON.stringify(this.model.data[index]);
            console.log("当前节目(setFocus)="+jeimu);
            focus.style.display = 'none';
            focus.style.left = this[this.focusType + 'Pos'][index].l + 'px'
            focus.style.top = this[this.focusType + 'Pos'][index].t + 'px'
            focus.classList.remove('b')
            focus.classList.remove('f')
            if (this.focusType == 'folder') {
                focus.classList.add(index < 2 ? 'b' : 'f')
            }
            focus.style.display = 'block'
            if (this.focusType == 'folder') {
                if (index !== this.curIndex) {
                   
                    document.querySelectorAll('.text')[index].innerHTML = getStrByLen(this.model.data[index].text, 16)
                    document.querySelectorAll('.text')[index].innerHTML = useMarquee(this.model.data[index].text, 16)
                }
                this.curIndex = index
            }
        },
        setMenu: function(idx) {
            document.getElementById('menu2').style.display = 'block';
            document.getElementById('focus').style.display = 'none';
            var self = this,
                index = idx,
                // 拿到所有的分类标签
                list = document.querySelectorAll('.menu'),
                focus = list[index];
            if (!focus) {
                index = self.curMenu
                focus = list[index]
            }
            // console.log("index(setMenu)=", index);
            // 判断页面首次进来  
            // /首次menuflag为true
            if (this.menuflag) {
                self.setMenuActive(focus);
                if (index !== self.curMenu) {
                    self.curMenu = index;
                    self.loadData(index)
                }
            } else {
                //延迟0 .3 秒执行
                setTimeout(function() {
                    self.setMenuActive(focus);
                    if (index !== self.curMenu) {
                        self.curMenu = index;
                        self.loadData(index)
                    }
                }, 200)
            }
            var menuactive = document.getElementById("menuactive");
            menuactive.style.display = "block";
            menuactive.style.left = self.menuPos[index].l + 'px';
            menuactive.style.top = self.menuPos[index].t + 'px';
            //  return self.setFocus(index);
        },
        CsetMenu : function(idx){
            document.getElementById('menu2').style.display = 'block';
            document.getElementById('focus').style.display = 'none';
            var self = this,
                index = idx,
                // 拿到所有的分类标签
                list = document.querySelectorAll('.menu'),
                focus = list[index];
            if (!focus) {
                index = self.curMenu;
                focus = list[index];
            }
            self.setMenuActive(focus);
            var menuactive = document.getElementById("menuactive");
            menuactive.style.display = "block";
            menuactive.style.left = self.menuPos[index].l + 'px';
            menuactive.style.top = self.menuPos[index].t + 'px';
        },
        setMenuActive: function(focus) {
            //获取选中标签
            var menu = document.querySelector('.menu.active')
            if (menu) {
                menu.classList.remove('active')
            }
            focus.classList.add('active')
        },
        removeFocus: function() {
            var menu = document.querySelector('.menu.focus'),
                list = document.querySelector('.folder.focus');
            if (menu) {
                menu.classList.remove('focus')
            }
            if (list) {
                list.classList.remove('focus')
            }
        },
        loadData: function(idx) {
            var self = this;
            //var menuRoot = ['热播电影', '经典电影', '经典剧集']
            //拿数据(没有海报)
            self.api.list(menuRoot[idx], function(resp) {
                var data = resp.children;
                data.sort(function(a, b) {
                        return parseInt(a.index) - parseInt(b.index)
                    })
                    //拿海报
                self.api.getPosterBoard(data, function(resp) {
                        self.model.data = self.model.list(resp);
                        //传递数据 渲染页面
                        self.loadPage(self.model.data);
                    })
                    //添加按键事件
                self.bindEvents();
            })
        },
        
        loadPage: function(set) {
            //清空节目列表
            this.emptyPage();
            //清空节目列表
            this.emptyPage();
            // console.log("set(loadPage)=", set);
            var list = document.querySelectorAll('.folder');
            var text = document.querySelectorAll('.text');
            //清空节目列表
            this.emptyPage();
            this.emptyPage();
            for (var i = 0; i < set.length; i++) {
                var item = set[i];
                (function(el, url) {
                    var image = new Image();
                    image.style.width = '100%';
                    image.style.height = '100%'
                    image.onload = function() {
                        el.appendChild(this)
                    }
                    image.src = url
                })(list[i], item.bg)
                if (this.curMenu !== 0) {
                    list[i].classList.add('free')
                    list[i].innerHTML += '<div class="mask"></div>'
                }
                if (i > 1) {
                    text[i].innerHTML = getStrByLen(item.text, 20)
                }
            }
            this.focusType == "menu" ? this.setMenu(this.curMenu) : this.setFocus(this.curIndex);
        },
        emptyPage: function() {
            var list = document.querySelectorAll('.folder'),
                text = document.querySelectorAll('.small.text')
            for (var i = 0; i < list.length; i++) {
                list[i].innerHTML = ''
                list[i].classList.remove('free')
            }
            for (var i = 0; i < text.length; i++) {
                text[i].innerHTML = ''
            }
        }
    };
    var API = {
        //拿数据        
        list: function(type, callback) {
            var url = treeRoot + type + '/推荐?children=1&enable=all&app_key=' + app_key + '&timestamp=' + new Date().toISOString()
            getJson(url, callback)
        },
        //拿海报
        getPosterBoard: function(data, callback) {
            var ids = data.map(function(item) {
                return [item.metadata_public.ProviderId, item.metadata_public.ProviderAssetId].join('_')
            });
            var _data = data;
            var url = paas_host + '/aquapaas/rest/search/content_by_id/vod?ids=' + ids.join(',') + '&app_key=' +
                app_key + '&timestamp=' + new Date().toISOString();
            if (ids.length > 0) {
                getJson(url, function(resp) {
                    var tmp = [];
                    for (var i = 0; i < _data.length; i++) {
                        var target = _data[i];
                        for (var j = 0; j < resp.length; j++) {
                            var asset = resp[j]
                            if (target.metadata_public.ProviderId == asset.provider_id &&
                                target.metadata_public.ProviderAssetId == asset.provider_asset_id) {
                                var bg = asset.posterboard || asset.packageposterboard || ''
                                target.bg = bg.split(',').pop();
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
        //jm :[{
          //      "text": "建党伟业", "pid": "shoulujiemu", "paid": "SLJM0000000000007403",
          //      "bg": "http://edu.changning.xor-live.io:8081/poster/shoulujiemu_SLJM0000000000007403.jpg"
          //  },
          //  {
           //     "text": "开国大典", "pid": "shoulujiemu", "paid": "SLJM1000000000007403",
           //     "bg": "http://edu.changning.xor-live.io:8081/poster/shoulujiemu_SLJM1000000000007403.jpg"
           // },
           // {
           //     "text": "血战钢锯岭", "pid": "shoulujiemu", "paid": "SLJM2000000000007403",
           //     "bg": "http://edu.changning.xor-live.io:8081/poster/shoulujiemu_SLJM2000000000007403.jpg"
          //  }],
        list: function(data) {
            var ret = [];
            var index = 0;
            while (ret.length < data.length) {
                var item = data[index];
                if (item) {
                    var pid = item.metadata_public.ProviderId;
                    var paid = item.metadata_public.ProviderAssetId;
                    ret.push({
                        text: item.name,
                        bg: item.metadata['节目海报'] || item.bg,
                        pid: pid,
                        paid: paid
                    })
                }
                index++
            }
            return ret;
        }
    }
    return {
        init: function() {
            try {
                debug(showLog);
                var app = new dialog();
            } catch (e) {
                console.log('*******frame error='+e.message);
            } finally {
            }
        }
    }
}))










 