(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? exports.module = factory(utils) :
        typeof define === 'function' && define.amd ? define(['utils'], factory) : (global.app = factory(utils))
})(this, (function() {
    deepClone = utils.deepClone;
    getJson = utils.getJson;
    postJson = utils.postJson;
    addEvent = utils.addEvent;
    getUrlParam = utils.getUrlParam;
    getStrByLen = utils.getStrByLen;
    useMarquee = utils.useMarquee;
    search_store = MyStorage.getStorage({ type: 'search' }),
        store_data = search_store.getValue('searchData');
    var frame = function() {
        var pane = deepClone({}, Pane);
        var api = deepClone({}, API);
        var model = deepClone({}, Model);
        pane.api = api;
        pane.model = model;
        pane.init();
    };
    var Pane = {
        /*通过该值判断那块区域聚焦
         * true 字母数字
         * false 清空 退格*/
        Updownposition: true,
        /*输入框的值*/
        InputValue: "",
        /*清空 退格*/
        btnindex: 0,
        /*字母数字键盘*/
        letterPos: [
            { left: 15, top: 207 }, { left: 72, top: 207 }, { left: 130, top: 207 }, { left: 188, top: 207 }, { left: 245, top: 207 }, { left: 303, top: 207 },
            { left: 15, top: 263 }, { left: 72, top: 263 }, { left: 130, top: 263 }, { left: 188, top: 263 }, { left: 245, top: 263 }, { left: 303, top: 263 },
            { left: 15, top: 319 }, { left: 72, top: 319 }, { left: 130, top: 319 }, { left: 188, top: 319 }, { left: 245, top: 319 }, { left: 303, top: 319 },
            { left: 15, top: 375 }, { left: 72, top: 375 }, { left: 130, top: 375 }, { left: 188, top: 375 }, { left: 245, top: 375 }, { left: 303, top: 375 },
            { left: 15, top: 431 }, { left: 72, top: 431 }, { left: 130, top: 431 }, { left: 188, top: 431 }, { left: 245, top: 431 }, { left: 303, top: 431 },
            { left: 15, top: 487 }, { left: 72, top: 487 }, { left: 130, top: 487 }, { left: 188, top: 487 }, { left: 245, top: 487 }, { left: 303, top: 487 }
        ],
        letterindex: 0,/*字母数字按键位置*/
        /*热搜词*/
        HotsearchPos: [
            { left: 40, top: 116 }, { left: 378, top: 116 },
            { left: 40, top: 186 }, { left: 378, top: 186 },
            { left: 40, top: 256 }, { left: 378, top: 256 },
            { left: 40, top: 326 }, { left: 378, top: 326 },
            { left: 40, top: 396 }, { left: 378, top: 396 },
            { left: 40, top: 466 }, { left: 378, top: 466 }
        ],
        Hotsearchindex: 0,/*热搜词按键位置*/
        /*精选节目*/
        posterPos: [
            { left: 24, top: 72 }, { left: 160, top: 72 }, { left: 298, top: 72 }, { left: 436, top: 72 }, { left: 573, top: 72 },
            { left: 24, top: 299 }, { left: 160, top: 299 }, { left: 298, top: 299 }, { left: 436, top: 299 }, { left: 573, top: 299 }
        ],
        posterindex: 0,/*精选节目按键位置*/
        /*上下页*/
        PageurningTPos: [
            { left: 243, top: 530 }, { left: 409, top: 530 }
        ],
        PageurningTindex: 0,/*翻页按键位置*/
        pagenumber: 0, //当前页
        pagedatasum: 0, //当前页面节目数
        backUrl: "",//一个变量存放路径,返回进入页面的页面
        detail:false,//判断是否是详情返回的
        letterflag:true,//设定一个字母数字控制变量,处理页面返回数据未渲染时禁止数字字母按键操作
        posterflag:false,//设定一个热搜词变量,处理页面返回数据未渲染时禁止精选结果
        init: function() {
            if (getUrlParam('?backUrl')) {
                this.backUrl = decodeURIComponent(getUrlParam('?backUrl'));
            }
            if (this.backUrl) {
                this.backUrl = this.backUrl;
            } else {
                this.backUrl = location.href.slice(0, location.href.lastIndexOf('/') + 1) + "index.html";
            }
            if(location.href.match("detail")){
                this.detail = true;
            }
            if (this.detail) {
                if (JSON.parse(store_data).InputValue) {
                    var searchData = JSON.parse(store_data);
                    this.InputValue = searchData.InputValue;
                    if (this.InputValue) {
                        this.pagenumber = searchData.pagenumber;
                        this.Updownposition = searchData.Updownposition;
                        this.btnindex = searchData.btnindex;
                        this.letterindex = searchData.letterindex;
                        this.posterindex = searchData.posterindex;
                        this.posterflag = searchData.posterflag;
                        this.backUrl = searchData.backUrl;
                        this.setInputValue(this.InputValue);
                        this.loadFeaturedresultsData();
                    }
                }
            }else{
                this.letterbindEvents(); //字母按键
                this.loadHotsearchData(); //获取热搜词数据
            }
        },

        /*获取热搜词 渲染*/
        loadHotsearchData: function() {
            var self = this;
            if (document.getElementById("searchBar").value) {
                document.getElementById("search_Featuredresults").style.display = "black";
                document.getElementById("search_Hotsearch").style.display = "none";
            } else {
                document.getElementById("search_Featuredresults").style.display = "none";
                document.getElementById("search_Hotsearch").style.display = "black";
            }
            self.emptyPage();
            self.api.HotsearchList(function(resp) {
                if (resp.length > 2) {
                    resp.sort(function(a, b) {
                        return parseInt(a.play_count) - parseInt(b.play_count);
                    });
                }
                console.log('热搜词')
                self.model.HotsearchList(resp);
                self.renderHotsearch();
            });
        },
        renderHotsearch: function() {
            this.emptyPage();
            var data = this.model.HotsearchData;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item) {
                    document.getElementById('search_Hotsearch_div' + i).style.display = 'block';
                    document.getElementById('search_Hotsearch_div' + i).innerHTML = (i + 1) + "." + getStrByLen(item.title, 25);
                    document.getElementById('search_Hotsearch_div' + i).style.textIndent = "10px";
                } else {
                    document.getElementById('search_Hotsearch_div' + i).style.display = 'none';
                }
            }
        },

        /*获取节目数据 渲染*/
        loadFeaturedresultsData: function() {
            var self = this;
            self.model.FeaturedresultsData.length = 0;
            self.pagedatasum = 0;
            document.getElementById('currentPage').innerHTML = "0";
            document.getElementById("totalPages").innerHTML = "0";
            self.emptyPage();
        	self.api.FeaturedresultsList(self.InputValue, function(resp) {
                console.log('精选结果');
                self.model.FeaturedresultsList(resp);
                self.loadPosterPage(self.pagenumber);
                document.getElementById("totalPages").innerHTML = Math.ceil(self.model.FeaturedresultsData.length / 10);
        	})
    	},
        loadPosterPage: function(pagenumber) {
            var self = this,
                data =self.model.FeaturedresultsData;            
            if (pagenumber < 0 || pagenumber >= Math.ceil(data.length / 10)) {
                pagenumber = self.pagenumber
            }
            self.pagenumber = pagenumber;
            document.getElementById('currentPage').innerHTML = (self.pagenumber + 1);
            var set = data.slice(pagenumber * 10, (pagenumber + 1) * 10);
            self.renderPosterPage(pagenumber, set)
            if (self.posterflag){
                self.posterbindEvents();
                if (data.length>0) {
                    self.posterFocus(self.posterindex);
                }
            }
        },
        emptyPage: function() {
            if (this.InputValue) {
                for (var i = 0; i < 10; i++) {
                    document.getElementById('search_Featuredresults_img' + i).src = '';
                    document.getElementById('search_Featuredresults_text' + i).innerHTML = ''
                    document.getElementById('search_Featuredresults_film' + i).style.display = 'none';
                }
            }else{
                for (var i = 0; i < 12; i++) {
                    document.getElementById('search_Hotsearch_div' + i).innerHTML = "";
                    document.getElementById('search_Hotsearch_div' + i).style.display = 'none';
                }
            }
        },
        renderPosterPage: function(pagenumber, data) {
            this.emptyPage();
            this.pagedatasum = data.length;
            if (this.pagedatasum > 0) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item) {
                        document.getElementById('search_Featuredresults_film' + i).style.display = 'block';
                        document.getElementById('search_Featuredresults_img' + i).src = item.bg;
                        document.getElementById('search_Featuredresults_text' + i).innerHTML = getStrByLen(item.title, 11);

                    } else {
                        document.getElementById('search_Featuredresults_film' + i).style.display = 'none';
                    }
                }
            } else {
                document.getElementById('currentPage').innerHTML = "0";
                document.getElementById("totalPages").innerHTML = "0";
            }
            this.letterflag = true;
        },

        /*按键事件*/
        /*字母数字按键事件*/
        letterbindEvents: function() {
            var self = this;
            document.getElementById("search_letter_Selected").style.display = 'black';
            document.getElementById("search_Hotsearch_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_foot_Selected").style.display = 'none';
            document.getElementById("search_btn_clear").src = "img/search/delete0.png";
            document.getElementById("search_btn_backspace").src = "img/search/backspace0.png";
            addEvent({
                left: function() {
                    self.letterFocus(self.letterindex - 1)
                },
                right: function() {
                    if ((self.letterindex + 1) % 6 == 0) {
                        if (self.InputValue.length > 0) {
                            if (self.model.FeaturedresultsData.length > 0) {
                                self.posterFocus(self.posterindex);
                                self.posterbindEvents();
                            }
                        } else {
                            if (self.model.HotsearchData.length > 0) {
                                self.HotsearchFocus(0);
                                self.HotsearchbindEvents()
                            }
                        }
                    } else {
                        self.letterFocus(self.letterindex + 1)
                    }
                },
                up: function() {
                    if (self.letterindex < 6) {
                        self.Updownposition = false;
                        if (self.letterindex < 3) {
                            self.btnindex = 0;
                            self.btnFocus(self.btnindex);
                            self.btnbindEvents();
                        }
                        if (self.letterindex > 2 && self.letterindex < 6) {
                            self.btnindex = 1;
                            self.btnFocus(self.btnindex);
                            self.btnbindEvents();
                        }
                    } else {
                        self.letterFocus(self.letterindex - 6)
                    }
                },
                down: function() {
                    self.letterFocus(self.letterindex + 6)
                },
                enter: function() {
                    if (self.letterflag) {
                    	self.letterflag = false;
                    	var letterList = document.getElementById("search_letter").getElementsByTagName('div');
                    	self.InputValue += letterList[self.letterindex].innerText;
                    	self.setInputValue(self.InputValue);
                    	self.pagenumber = 0;
                        self.posterindex = 0;
                    	self.loadFeaturedresultsData();
                    }
                },
                back: function() {
                    var searchData = {
                        InputValue: "",
                        pagenumber: 0,
                        posterindex: 0,
                        Updownposition: false,
                        btnindex: 0,
                        letterindex: 0,
                        posterflag:false,
                        backUrl: null
                    };
                    location.href = self.backUrl;
                }
            })
        },
        letterFocus: function(idx) {
            var index;
            if (idx > -1 && idx < 42) {
                if (idx > 35) {
                    idx = idx - 36;
                }
                index = idx;
            } else {
                index = this.letterindex
            }
            document.getElementById('search_letter_Selected').style.display = 'block';
            document.getElementById('search_letter_Selected').style.left = this.letterPos[index].left + 'px';
            document.getElementById('search_letter_Selected').style.top = this.letterPos[index].top + 'px';
            var Hotsearch = this.model.HotsearchData[this.Hotsearchindex];
            if (Hotsearch) {
                document.getElementById('search_Hotsearch_div' + this.Hotsearchindex).innerHTML = getStrByLen(this.Hotsearchindex + 1 + "." + Hotsearch.title, 25);
                document.getElementById('search_Hotsearch_div' + this.Hotsearchindex).style.textIndent = "10px";
            }
            var program = this.model.FeaturedresultsData[this.pagenumber * 10 + this.posterindex];
            if (program) {
                document.getElementById('search_Featuredresults_text' + this.posterindex).innerHTML = getStrByLen(program.title, 11);
            }
            this.letterindex = index;
        },
        /*清空,退格按键事件*/
        btnbindEvents: function() {
            var self = this;
            document.getElementById("search_letter_Selected").style.display = 'none';
            document.getElementById("search_Hotsearch_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_foot_Selected").style.display = 'none';
            addEvent({
                left: function() {
                    self.btnFocus(self.btnindex - 1 < 0 ? 0 : self.btnindex - 1)
                },
                right: function() {
                    if (self.btnindex + 1 > 1) {
                        if (self.InputValue.length > 0) {
                            if (self.model.FeaturedresultsData.length > 0) {
                                self.posterFocus(self.posterindex);
                                self.posterbindEvents();
                            }
                        } else {
                            if (self.model.HotsearchData.length > 0) {
                                self.HotsearchFocus(0);
                                self.HotsearchbindEvents()
                            }
                        }
                    } else {
                        self.btnFocus(self.btnindex + 1)
                    }
                },
                up: function() {
                    self.btnFocus(self.btnindex)
                },
                down: function() {
                    self.Updownposition = true;
                    self.letterFocus(self.letterindex);
                    self.letterbindEvents();
                },
                enter: function() {
                    self.posterflag = false;
                    if (self.btnindex == 0) {
                        self.InputValue = "";
                        self.setInputValue(self.InputValue);
                    } else {
                        self.InputValue = self.InputValue.slice(0, self.InputValue.length - 1);
                        self.setInputValue(self.InputValue);
                    }
                    if (self.InputValue) {
                        self.pagenumber = 0;
                        self.loadFeaturedresultsData();
                    }else{
                        self.loadHotsearchData();
                    }
                    if (self.model.FeaturedresultsData.length<=0) {
                        self.btnFocus(self.btnindex);
                        self.btnbindEvents();
                    }
                    self.emptyPage();
                },
                back: function() {
                    var searchData = {
                        InputValue: "",
                        pagenumber: 0,
                        posterindex: 0,
                        Updownposition: false,
                        btnindex: 0,
                        letterindex: 0,
                        posterflag:false,
                        backUrl: null
                    };
                    location.href = self.backUrl;
                }
            })
        },
        btnFocus: function(idx) {
            if (idx == 0) {
                document.getElementById("search_btn_clear").src = "img/search/delete1.png";
                document.getElementById("search_btn_backspace").src = "img/search/backspace0.png";
            } else {
                document.getElementById("search_btn_clear").src = "img/search/delete0.png";
                document.getElementById("search_btn_backspace").src = "img/search/backspace1.png";
            }
            var Hotsearch = this.model.HotsearchData[this.Hotsearchindex];
            if (Hotsearch) {
                document.getElementById('search_Hotsearch_div' + this.Hotsearchindex).innerHTML = getStrByLen(this.Hotsearchindex + 1 + "." + Hotsearch.title, 25);
                document.getElementById('search_Hotsearch_div' + this.Hotsearchindex).style.textIndent = "10px";
            }
            var program = this.model.FeaturedresultsData[this.pagenumber * 10 + this.posterindex];
            if (program) {
                document.getElementById('search_Featuredresults_text' + this.posterindex).innerHTML = getStrByLen(program.title, 11);
            }
            this.btnindex = idx;
        },
        /*热搜词按键事件*/
        HotsearchbindEvents: function() {
            var self = this;
            document.getElementById("search_letter_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_foot_Selected").style.display = 'none';
            document.getElementById("search_btn_clear").src = "img/search/delete0.png";
            document.getElementById("search_btn_backspace").src = "img/search/backspace0.png";
            addEvent({
                left: function() {
                    if ((self.Hotsearchindex - 1 + 1) % 2 == 0) {
                        if (!self.Updownposition) {
                            self.btnFocus(1);
                            self.btnbindEvents();
                        } else {
                            self.letterFocus(self.letterindex);
                            self.letterbindEvents();
                        }
                    } else {
                        self.HotsearchFocus(self.Hotsearchindex - 1)
                    }
                },
                right: function() {
                    self.HotsearchFocus(self.Hotsearchindex + 1)
                },
                up: function() {
                    self.HotsearchFocus(self.Hotsearchindex - 2)
                },
                down: function() {
                    self.HotsearchFocus(self.Hotsearchindex + 2)
                },
                enter: function() {
                    document.getElementById("search_Hotsearch_Selected").style.display = 'none';
                    self.InputValue = self.model.HotsearchData[self.Hotsearchindex].titleabbreviate.toUpperCase();
                    self.setInputValue(self.InputValue);
                    self.pagenumber = 0;
                    self.posterflag = true;
                    self.loadFeaturedresultsData();
                },
                back: function() {
                    var searchData = {
                        InputValue: "",
                        pagenumber: 0,
                        posterindex: 0,
                        Updownposition: false,
                        btnindex: 0,
                        letterindex: 0,
                        posterflag:false,
                        backUrl: null
                    };
                    location.href = self.backUrl;
                }
            })
        },
        HotsearchFocus: function(idx) {
            var index;
            if (idx > -1 && idx < 12) {
                index = idx;
            } else {
                index = this.Hotsearchindex
            }
            while (index >= this.model.HotsearchData.length) {
                index--;
            }
            document.getElementById('search_Hotsearch_Selected').style.display = 'block';
            document.getElementById('search_Hotsearch_Selected').style.left = this.HotsearchPos[index].left + 'px';
            document.getElementById('search_Hotsearch_Selected').style.top = this.HotsearchPos[index].top + 'px';
            if (index != this.Hotsearchindex && typeof this.Hotsearchindex == "number") {
                var Hotsearch = this.model.HotsearchData[this.Hotsearchindex].title;
                document.getElementById('search_Hotsearch_div' + this.Hotsearchindex).innerHTML = getStrByLen(this.Hotsearchindex + 1 + "." + Hotsearch, 25);
                document.getElementById('search_Hotsearch_div' + this.Hotsearchindex).style.textIndent = "10px";
            }
            var Hotsearch_title = this.model.HotsearchData[index].title;
            if (Hotsearch_title.length>=9) {
                document.getElementById('search_Hotsearch_div' + index).style.textIndent = "0px";
            }
            document.getElementById('search_Hotsearch_div' + index).innerHTML = useMarquee(index + 1 + "." + Hotsearch_title, 25);

            var program = this.model.FeaturedresultsData[this.pagenumber * 10 + this.posterindex];
            if (program) {
                document.getElementById('search_Featuredresults_text' + this.posterindex).innerHTML = getStrByLen(program.title, 11);
            }
            this.Hotsearchindex = index;
        },
        /*精选结果按键事件*/
        posterbindEvents: function() {
            var self = this;
            document.getElementById("search_letter_Selected").style.display = 'none';
            document.getElementById("search_Hotsearch_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_foot_Selected").style.display = 'none';
            document.getElementById("search_btn_clear").src = "img/search/delete0.png";
            document.getElementById("search_btn_backspace").src = "img/search/backspace0.png";
            if (self.model.FeaturedresultsData.length>0 || self.detail) {
                self.detail = false;
                document.getElementById('search_Featuredresults_Selected').style.display = 'block';
            }else{
                document.getElementById('search_Featuredresults_Selected').style.display = 'nonoe';
            }
            addEvent({
                left: function() {
                    if ((self.posterindex) % 5 == 0) {
                        if (!self.Updownposition) {
                            self.posterflag = false;
                            self.btnFocus(1);
                            self.btnbindEvents();
                        } else {
                            self.posterflag = false;
                            self.letterFocus(self.letterindex);
                            self.letterbindEvents();
                        }
                    } else {
                        self.posterFocus(self.posterindex - 1)
                    }
                },
                right: function() {
                    if ((self.posterindex + 1) > self.pagedatasum - 1) {
                        self.PageurningTFocus(self.PageurningTindex);
                        self.PageurningTbindEvents();
                    } else {
                        self.posterFocus(self.posterindex + 1)
                    }
                },
                up: function() {
                    self.posterFocus(self.posterindex - 5)
                },
                down: function() {
                    self.posterflag = false;
                    if ((self.posterindex + 5) > self.pagedatasum - 1) {
                        self.PageurningTFocus(self.PageurningTindex);
                        self.PageurningTbindEvents();
                    } else {
                        self.posterFocus(self.posterindex + 5);
                    }
                },
                enter: function() {
                    self.posterflag = true;
                    var searchData = {
                        InputValue: self.InputValue,
                        pagenumber: self.pagenumber,
                        posterindex: self.posterindex,
                        Updownposition: self.Updownposition,
                        btnindex: self.btnindex,
                        letterindex: self.letterindex,
                        posterflag:self.posterflag,
                        backUrl: self.backUrl
                    };
                    search_store.setValue('searchData', JSON.stringify(searchData));
                    /*跳转到详情*/
                    // console.log('self.model.FeaturedresultsData[self.posterindex].pid'+self.model.FeaturedresultsData[self.posterindex+self.pagenumber*10].pid);
                    // console.log('self.model.FeaturedresultsData[self.posterindex].paid'+self.model.FeaturedresultsData[self.posterindex+self.pagenumber*10].paid);
                    // console.log('self.model.FeaturedresultsData[self.posterindex].title'+self.model.FeaturedresultsData[self.posterindex+self.pagenumber*10].title);
                    var url = location.href.slice(0, location.href.lastIndexOf('/') + 1);
                    location.href = 'detail.html?provider_id=' + self.model.FeaturedresultsData[self.posterindex+self.pagenumber*10].pid 
                    + '&provider_asset_id=' + self.model.FeaturedresultsData[self.posterindex+self.pagenumber*10].paid + '&backUrl=' + url + "search.html?detail";
                },
                back: function() {
                    var searchData = {
                        InputValue: "",
                        pagenumber: 0,
                        posterindex: 0,
                        Updownposition: false,
                        btnindex: 0,
                        letterindex: 0,
                        posterflag:false,
                        backUrl: null
                    };
                    location.href = self.backUrl;
                }
            })
        },
        posterFocus: function(idx) {
            var self = this;
            var index;
            console.log('idx(posterFocus)'+idx);
            console.log('pagedatasum(posterFocus)'+self.pagedatasum);
            if (idx > -1 && idx < 10) {
                index = idx;
            } else {
                index = self.posterindex;
            }
            while (index >= self.pagedatasum) {
                index--;
            }
            document.getElementById('search_Featuredresults_Selected').style.left = self.posterPos[index].left + 'px';
            document.getElementById('search_Featuredresults_Selected').style.top = self.posterPos[index].top + 'px';
            var Hotsearch = self.model.HotsearchData[self.Hotsearchindex];
            if (Hotsearch) {
                document.getElementById('search_Hotsearch_div' + self.Hotsearchindex).innerHTML = getStrByLen(self.Hotsearchindex + 1 + "." + Hotsearch.title, 25);
                document.getElementById('search_Hotsearch_div' + self.Hotsearchindex).style.textIndent = "10px";
            }
            if (index != self.posterindex && typeof self.posterindex == "number") {
                var program = self.model.FeaturedresultsData[self.pagenumber * 10 + self.posterindex].title;
                document.getElementById('search_Featuredresults_text' + self.posterindex).innerHTML = getStrByLen(program, 11);
            }
            console.log('index=='+index);
            console.log('this.model.FeaturedresultsData'+self.model.FeaturedresultsData.length);
            document.getElementById('search_Featuredresults_text' + index).innerHTML = useMarquee(self.model.FeaturedresultsData[self.pagenumber * 10 + index].title, 11);
            console.log('this.model.FeaturedresultsData[this.pagenumber * 10 + index]'+self.model.FeaturedresultsData[self.pagenumber * 10 + index]);
            self.posterindex = index;
        },
        /*分页按键事件*/
        PageurningTbindEvents: function() {
            var self = this;
            document.getElementById("search_Featuredresults_foot_Selected").style.display = 'black';
            document.getElementById("search_letter_Selected").style.display = 'none';
            document.getElementById("search_Featuredresults_Selected").style.display = 'none';
            document.getElementById("search_Hotsearch_Selected").style.display = 'none';
            document.getElementById("search_btn_clear").src = "img/search/delete0.png";
            document.getElementById("search_btn_backspace").src = "img/search/backspace0.png";
            addEvent({
                left: function() {
                    self.PageurningTFocus(self.PageurningTindex - 1 < 0 ? 0 : self.PageurningTindex - 1)
                },
                right: function() {
                    self.PageurningTFocus(self.PageurningTindex + 1)
                },
                up: function() {
                    if (self.model.FeaturedresultsData.length>0) {
                        self.posterbindEvents()
                        self.posterFocus(self.posterindex);
                    }else{
                        self.posterbindEvents()
                    }
                },
                enter: function() {
                    self.posterindex = 0;
                    self.posterflag = false;
                    if (self.PageurningTindex == 1) {
                        if (self.pagenumber+1 != document.getElementById("totalPages").innerHTML) {
                            self.loadPosterPage(self.pagenumber + 1);
                        }
                    } else {
                        if (self.pagenumber-1 >= 0) {
                            self.loadPosterPage(self.pagenumber - 1);
                        }
                    }
                },
                back: function() {
                    var searchData = {
                        InputValue: "",
                        pagenumber: 0,
                        posterindex: 0,
                        Updownposition: false,
                        btnindex: 0,
                        letterindex: 0,
                        posterflag:false,
                        backUrl: null
                    };
                    location.href = self.backUrl;
                }
            })
        },
        PageurningTFocus: function(idx) {
            var index;
            if (idx > -1 && idx < 2) {
                index = idx;
            } else {
                index = this.PageurningTindex
            }
            document.getElementById('search_Featuredresults_foot_Selected').style.display = 'block';
            document.getElementById('search_Featuredresults_foot_Selected').style.left = this.PageurningTPos[index].left + 'px';
            document.getElementById('search_Featuredresults_foot_Selected').style.top = this.PageurningTPos[index].top + 'px';
            var program = this.model.FeaturedresultsData[this.pagenumber * 10 + this.posterindex];
            if (program) {
                document.getElementById('search_Featuredresults_text' + this.posterindex).innerHTML = getStrByLen(program.title, 11);
            }
            this.PageurningTindex = index;
        },
        /*处理页面输入内容*/
        setInputValue: function(InputValue) {
            if (InputValue) {
                document.getElementById("search_Hotsearch_top").style.display = 'none';
                document.getElementById("search_Hotsearch").style.display = 'none';
                document.getElementById("search_Featuredresults_top").style.display = 'block';
                document.getElementById("search_Featuredresults").style.display = 'block';
                document.getElementById("search_Featuredresults_foot").style.display = 'block';
                document.getElementById("searchBar").innerHTML = InputValue;
            } else {
                document.getElementById("search_Hotsearch_top").style.display = 'block';
                document.getElementById("search_Hotsearch").style.display = 'block';
                document.getElementById("search_Featuredresults_top").style.display = 'none';
                document.getElementById("search_Featuredresults").style.display = 'none';
                document.getElementById("search_Featuredresults_foot").style.display = 'none';
                document.getElementById("searchBar").innerHTML = '输入影片或演员的首字母或全拼';
            }
        }
    };
    var API = {
        HotsearchList: function(callback) {
            /*查询热搜词 假定只有12条*/
            var url = "http://172.16.20.201:8031/aquapaas/rest/search/contents/searchkeyword",urlParam = [],data = []; //本地测试接口
            // var url = paasHost + "/aquapaas/rest/search/contents/searchkeyword", urlParam = [], data = [];
            urlParam.push('sort_by=title');
            urlParam.push('sort_mode=d');
            urlParam.push('app_key=' + paasAppKey); //应用级授权
            urlParam.push('timestamp=' + new Date().toISOString()); //应用级授权
            url += '?' + urlParam.join('&');
            postJson(url, data, function(resp) {
                callback && callback(resp);
            })
        },
        FeaturedresultsList: function(InputValue, callback) {
            /*输入框有值 调用传递 影片或演员的首字母或全拼 的API*/
            // var url = "http://api.xor-live.io/aquapaas/rest/search/contents/vod",urlParam = [],data = []; //本地测试接口
            var url = paasHost + "/aquapaas/rest/search/contents/vod", urlParam = [], data = [];
            urlParam.push('sort_by=title');
            urlParam.push('sort_mode=d');
            urlParam.push("start=0");
            urlParam.push("end=999");
            urlParam.push('app_key=' + paasAppKey); //应用级授权
            urlParam.push('timestamp=' + new Date().toISOString()); //应用级授权
            data.push("title=" + InputValue + '&title_op=lk'); //影片标题
            data.push("titleabbreviation=" + InputValue + "&titleabbreviation_op=lk"); //影片缩拼
            data.push("actors=" + InputValue + "&actors_op=lk"); //演员
            url += '?' + urlParam.join('&');
            postJson(url, data, function(resp) {
                callback && callback(resp);
            })
        },
    };
    var Model = {
        HotsearchData: [],
        HotsearchList: function(set) {
            var ret = [];
            for (var i = 0; i < set.length; i++) {
                var item = set[i];
                ret.push({
                    title: item.title,
                    titleabbreviate: item.titleabbreviate,
                    actors: item.actors ? item.actors : ""
                })
            }
            this.HotsearchData = ret;
        },
        FeaturedresultsData: [],
        FeaturedresultsList: function(set) {
            var ret = [];
            for (var i = 0; i < set.length; i++) {
                var item = set[i];
                var pid = item.provider_id;
                var paid = item.provider_asset_id;
                var posters = item.packageposterboard || item.posterboard || null;
                ret.push({
                    pid: pid,
                    paid: paid,
                    title: item.title,
                    titleabbreviation: item.titleabbreviation,
                    actors: item.actors ? item.actors : "",
                    bg: posters?(posters.split(',')[1]):""
                    
                })
            }
            this.FeaturedresultsData = ret;
        }
    };
    return {
        init: function() {
            utils.debug(printLog);
            var app = new frame();
        }
    }
}));
