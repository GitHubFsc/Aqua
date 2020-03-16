var uiUtil = {
    /*
     （1）getChartBar() 获得如图所示的柱形图的 html string.												OVER~
     （2）toPercentage() 将Number或String转为百分比String, (可定制小数位数，默认一位）					OVER~
     （3）getStreamText() 将传入的内容着色添加箭头后返回 html string.									OVER~
     （4）getChartBarDetail()将传入的内容，格式化后返回 html string.（如标出的内容所示，“5s"是传入参数）
     */
    toPercentage: function(obj, precision) {
        if ( typeof (precision) == "undefined") {
            precision = 1;
        }
        var result = parseFloat(obj);
        if (!isNaN(result) && (obj >= 0)) {
            return (result * 100).toFixed(precision).toString() + "%";
        } else {
            return "";
        }
    },
    getStreamText: function(option) {
        /*
         * option = {
         * 	direction: 'in/out',
         * 	num: ''
         * }
         */
        var text;
        if ( typeof option.num == 'undefined') {
            return '';
        }

        if (option.direction == 'in') {
            text = "<span style = 'vertical-align: middle;color:#e60012;line-height:30px'>" + option.num + "</span><img style=' vertical-align:middle; margin-left: 5px;' src =  'uiWidget/images/FiveSecondUp.png'/>";
        } else {
            text = "<span style = 'vertical-align: middle;color:#009944;line-height:30px'>" + option.num + "</span><img style=' vertical-align:middle; margin-left: 5px;' src =  'uiWidget/images/FiveSecondDown.png'/>";
        }
        return text;
    },
    getChartBar: function(option) {
        /*
         * option = {
         *	max: '',
         * 	num: '',
         *	direction: ''
         *	rectColor: ''
         * 	inerTextColor: '',
         *  outerTextColor: '',
         *  barWidth: '',
         * }
         */
        if (( typeof option.num == 'undefined') || ( typeof option.max == 'undefined')) {
            return '';
        }

        if (!option.rectColor) {
            option.rectColor = '#80d2fc';
        }
        if (!option.inerTextColor) {
            option.inerTextColor = '#2687ba';
        }
        if (!option.outerTextColor) {
            option.outerTextColor = '#797979';
        }
        var max_length = option && option.barWidth || 345;
        var length = option.num / option.max * max_length;
        if (length >= max_length / 2) {
            var text = "<div class = 'ChartBar_main' style = 'background:" + option.rectColor + ";width:" + length + "px'><span style = 'color:" + option.inerTextColor + "'>" + option.num + "</span></div>";
        } else {
            var text = "<div class = 'ChartBar_main' style = 'background:" + option.rectColor + ";width:" + length + "px'></div> <div style = 'width : 50px;float:left;height:28px;padding:4px 0 4px 0;'><span style='line-height:28px;height:28px;padding-left:10px;color:" + option.outerTextColor + "'>" + option.num + "</span></div>";
        }
        return text;
    },
    getChartBarDetail: function(info) {
        /*
         * info = {
         * 	channel: '',
         * 	rank: '',
         *  audience: '',
         *  audienceRating: '',
         *  duration: '',
         * 	flowIn: '',
         * 	flowOut: '',
         * 	program: ''
         * }
         */

        if ( typeof info.rank == 'undefined') {
            info.rank = '';
        }

        if ( typeof info.audience == 'undefined') {
            info.audience = '';
        }
        // @formatter:off
        var div1 = "<div class = 'ChartBarDetail_head'><span style='line-height:29px;padding-left: 20%;'>" + info.channel + "</span></div>"; //标题
        var div2 = "<table style='color:#797979;width : 100%;' class='ChartBarDetail_table'>" + 
                "<tbody><tr class = 'ChartBarDetail_lefttd'>" + 
                "	<td style='text-align:center'> 收 视 排 名</td>" + 
                "	<td>: " + info.rank + "</td>" + 
                "</tr>" + 
                "<tr class = 'ChartBarDetail_lefttd'>" + 
                "	<td style='text-align:center'> 收 视 人 数</td>" + 
                "	<td>: " + info.audience + "</td>" + 
                "</tr>" + 
                "<tr class = 'ChartBarDetail_lefttd'>" + 
                "	<td style='text-align:center'> 收  视  率 </td>" + 
                "	<td>: " + this.toPercentage(info.audienceRating) + "</td>" + 
                "</tr>" + 
                "<tr class = 'ChartBarDetail_lefttd'>" + 
                "	<td style='text-align:center'> 流出 </td>" + 
                "	<td>: " + this.getStreamText({direction: 'out', num: info.flowOut}) + "</td>" + 
                "</tr>" + 
                "<tr class = 'ChartBarDetail_lefttd'>" + 
                "	<td style='text-align:center'> 流入 </td>" + 
                "	<td>: " + this.getStreamText({direction: 'in', num: info.flowIn}) + "</td>" + 
                "</tr>" + 
                "<tr class = 'ChartBarDetail_lefttd'>" + 
                "	<td style='text-align:center'> 目前收看节目 </td>" + 
                "	<td>: " + info.program + "</td>" + 
                "</tr>" + 
                "</tbody></table>";
        // @formatter:on
        return div1 + div2;
    },

    previousPages: {

    },

    includePage: function(container, folder, html, jses) {
        if (folder && container) {
            container = $$(container);
            var pageInfo = {
                "addToDomObject": container,
                "sync": false
            };
            if (html) {
                pageInfo.htmlFile = folder + "/" + html;
            }
            var len = jses.length;
            if (jses && len > 0) {
                var jsFiles = [];
                for (; len > 0; len--) {
                    jsFiles.push({
                        "path": folder + "/" + jses[len - 1].name,
                        "removable": jses[len - 1].removable
                    });
                }
                pageInfo.jsFiles = jsFiles;
            }
            var pageObj = new my.includeHTMLJSFile(pageInfo);
            //加载新页面前移出前一页
            // this.removePreviousPage(container);
            pageObj.load();
            this.setPreviousPage(container, pageObj);
        }
    },

    removePreviousPage: function(container) {
        var previousPage = this.previousPages[container];
        if (previousPage) {
            previousPage.remove();
            delete this.previousPages[container];
        }
    },

    setPreviousPage: function(container, pageObj) {
        this.previousPages[container] = pageObj;
    },

    checkDependence: function(depList) {
        /*
         * depList = [{
         *  module : '',
         * 	path: '',
         * 	removable: ''
         * }];
         */
        var depJSes = [];
        for (var i = 0, max = depList.length; i < max; i++) {
            var depItem = depList[i];
            if (depItem && depItem.module && window[depItem.module]) {
                continue;
            } else if (depItem) {
                var jsItem = {
                    name: depItem.path,
                    removable: ( typeof depItem.removable !== 'undefined' ? depItem.removable : true)
                };
                depJSes.push(jsItem);
            }
        }

        return depJSes;
    },

    getBar: function(barHeight, barWidth, barColor, barBorderRadius) {
        var bar = document.createElement('div');
        jQuery(bar).css({
            height: barHeight,
            width: barWidth,
            backgroundColor: barColor,
            borderRadius: barBorderRadius
        });

        return bar;
    },

    getAquaXhrHeaders: function(method, url, contentType) {
        if(!my.aqua.accessKeyId || !my.aqua.secretAccessKey){
            return;
        }
        if (url.indexOf('//') > -1) {
            url = url.split('//')[1];
        }
        
        var tmp1 = (url.indexOf("/") >= 0) ? url.indexOf("/") : 0;
        var tmp2 = url.indexOf("?");
        var urlPath = url.substr(tmp1, ((tmp2 >= 0) ? (tmp2) : url.length) - tmp1);
        var nowDateTime = new Date().getTime();

        var StringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;

        return {
            'Accept': contentType,
            'Content-Type': contentType,
            'Authorization': 'AQUA ' + my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign)),
            'x-aqua-date': nowDateTime,
            'x-aqua-read-reference-redirect': false,
        };
    },

    getDateToStr: function(_date) {
        var year = _date.getFullYear();
        var month = _date.getMonth();
        var date = _date.getDate();
        var hours = _date.getHours();
        var mins = _date.getMinutes();
        var secs = _date.getSeconds();

        year = String(year);
        month = month > 8 ? String(month + 1) : '0' + (month + 1);
        date = date > 9 ? String(date) : '0' + date;
        hours = hours > 9 ? String(hours) : '0' + hours;
        mins = mins > 9 ? String(mins) : '0' + mins;
        secs = secs > 9 ? String(secs) : '0' + secs;

        return year + '-' + month + '-' + date + ' ' + hours + ':' + mins + ':' + secs;
    },

    getStrToDate: function(str) {
        if ( typeof str !== 'string') {
            throw new Error('parsing to Date should be typeof string.');
        }

        var year = 1970, month = 1, date = 1, hour = 0, min = 0, sec = 0;

        if (str.length > 9) {
            year = str.substr(0, 4);
            month = str.substr(5, 2);
            date = str.substr(8, 2);
        }

        if (str.length > 18) {
            hour = str.substr(11, 2);
            min = str.substr(14, 2);
            sec = str.substr(17, 2);
        }

        year = parseInt(year, 10);
        month = parseInt(month, 10) - 1;
        date = parseInt(date, 10);
        hour = parseInt(hour, 10);
        min = parseInt(min, 10);
        sec = parseInt(sec, 10);

        return new Date(year, month, date, hour, min, sec);
    }

};
