(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        exports.module = factory() :
        typeof define === 'function' && define.amd ?
        define(factory) : (global.utils = factory())
})(this, (function() {
    var timer = null;
    /**
     * 深度克隆
     */
    function deepClone(dest, src) {
        for (var item in src) {
            switch (typeof src[item]) {
                case 'function':
                    dest[item] = src[item]
                    break;
                case 'array':
                case 'number':
                case 'string':
                case 'object':
                case 'boolean':
                    dest[item] = JSON.parse(JSON.stringify(src[item]))
                default:

            }
        }
        return dest;
    }
    /**
     * 设置流化应用计时器
     */
    function setCyberTimer() {
        if (typeof CyberCloud !== 'undefined') {
            clearTimeout(timer);
            timer = setTimeout(function() {
                    console.log('exit cloud');
                    GHWEBAPI.ExitCloud()
                }, 3 * 60 * 1000) //3分钟
        }
    }
    /**
     * 按键事件
     */
    function keyEvent(e, opts) {
        var key = e.which || e.keyCode,
            ret = true;
        console.log('key:' + key);
        setCyberTimer();
        switch (key) {
            case keyValue().UP:
            case keyValue().up:
                opts.up && opts.up();
                ret = false;
                break;
            case keyValue().DOWN:
            case keyValue().down:
                opts.down && opts.down();
                ret = false;
                break;
            case keyValue().LEFT:
            case keyValue().left:
                opts.left && opts.left();
                ret = false;
                break;
            case keyValue().RIGHT:
            case keyValue().right:
                opts.right && opts.right();
                ret = false;
                break;
            case keyValue().ENTER:
            case keyValue().enter:
                opts.enter && opts.enter();
                ret = false;
                break;
            case keyValue().PAGEUP:
            case keyValue().PageUp:
            case keyValue().pageup:
            case keyValue().prevPage:
                opts.pageup && opts.pageup();
                ret = false;
                break;
            case keyValue().PAGEDOWN:
            case keyValue().PageDown:
            case keyValue().pagedown:
            case keyValue().nextPage:
                opts.pagedown && opts.pagedown();
                ret = false;
                break;
            case keyValue().BACK:
            case keyValue().back:
            case keyValue().Back:
            case keyValue().quit:
            case keyValue().Quit:
            case keyValue().QUIT:
            case 512:
                opts.back && opts.back();
                ret = false;
                break;
            default:
        }
        return ret;
    }
    //添加按键事件
    function addEvent(callback) {
        setCyberTimer(); //进入页面的时候就开始运行计时器
        document.onkeydown = function(e) {
            return keyEvent(e, callback)
        }
    }
    //获得数据
    function getJson(src, callback) {
        doRequest({
            type: 'get',
            url: src,
            callback: callback
        })
    }
    //内置的请求方法
    function doRequest(opts) {
        var request = new XMLHttpRequest(),
            type = opts.type,
            url = opts.url,
            callback = opts.callback,
            data = opts.data || {};
        request.open(type, url, true)
        request.overrideMimeType("text/html;charset=utf-8");
        if (url.indexOf('/aquapaas/') > -1) {
            request.setRequestHeader('Accept', 'application/json')
            request.setRequestHeader('Content-Type', 'application/json')
            request.setRequestHeader('x-aqua-sign', x_aqua_sign(type, url))
        }
        console.log('url:' + url);
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback && callback(JSON.parse(this.response || '{}'))
            } else if (this.readyState == 4) {
                console.log('code:' + this.status);
                console.log('possible error reason:' + decodeURIComponent(this.getResponseHeader('x-aqua-error-message')));
            }
        }
        request.send(data);
    }
    /**
     * 是否启用机顶盒debug模式
     * @param  {boolean} enable true:启用 false:禁用
     * @return {void}           无返回值
     */
    function debug(enable) {
        var logPane = document.querySelector('#log');
        if (!logPane) {
            var logPane = document.createElement('div');
            logPane.id = 'log'
            logPane.style.position = 'absolute';
            logPane.style.height = '710px';
            logPane.style.width = '1260px';
            logPane.style.wordWrap = 'auto';
            logPane.style.wordBreak = 'break-all';
            logPane.style.backgroundColor = 'RGBA(1, 1, 1, 0.5)';
            logPane.style.color="RGB(243, 5, 5)";
            logPane.style.zIndex = '999';
            logPane.style.top = '10px';
            logPane.style.left = '20px';
            logPane.style.display = 'none';
            document.body.appendChild(logPane)
        } else {
            logPane.style.display = 'none';
        }
        if (enable) {
            logPane.style.display = 'block';
            if (!console) {
                console = {};
            }
            console.log = function(str) {
                var len = document.getElementsByTagName('br').length
                if (len > 15) {
                    logPane.innerHTML = '';
                    logPane.innerHTML += str + '<br>';
                } else {
                    logPane.innerHTML += str + '<br>';
                }
            }
        }
    }
    /**
     * 获得字符串的长度
     * @param  {str} val 字符串内容
     * @return {int}     字符串的长度
     */
    function getStrLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) {
                len += 1;
            } else {
                len += 2;
            }
        }
        return len;
    }
    /**
     * 是否采用marquee模式
     * @param  {str} str 字符串内容
     * @param  {int} len 超过该长度后使用marquee
     * @return {str}     返回字符串。如果超长则使用marquee，不然则返回字符串的原长度
     */
    function useMarquee(str, len) {
        var str_len = getStrLen(str)
        var ret = ''
        if (str_len > len) {
            ret = '<marquee>' + str + '</marquee>'
        } else {
            ret = str
        }
        return ret;
    }
    /**
     * 根据字符串长度获得显示的内容，超出长度显示'...'
     * @param  {str} val 字符串
     * @param  {int} len 字符串限制长度
     * @return {str}     返回格式化后的字符串
     */
    function getStrByLen(val, len) {
        var str = '';
        var tmp_len = 0
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if (length >= 0 && length <= 128) {
                tmp_len += 1;
            } else {
                tmp_len += 2;
            }
            if (tmp_len < len) {
                str += val[i]
            }
        }
        if (getStrLen(str) < getStrLen(val)) {
            str += '...';
        }
        return str;
    }
    /**
     * 获取URL参数
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    function getUrlParam(key) {
        var url = location.search
        var ret = '';
        var hasUrlParam = url.indexOf('?') !== -1 ? true : false
        if (hasUrlParam) {
            var search = url.slice(url.indexOf('?') + 1)
            var searchList = search.split('&').map(function(item) {
                var key = item.split('=')[0]
                var value = item.split('=')[1]
                return {
                    key: key,
                    value: value
                }
            })
            for (var i = 0; i < searchList.length; i++) {
                var item = searchList[i]
                if (item.key == key) {
                    ret = item.value
                }
            }
            if (key == 'backUrl') {
                ret = search.slice(search.lastIndexOf('backUrl=') + 8)
            }
        }
        return ret;
    }
    /**
     * 退出APP
     */
    function exitApp() {
        var HomeStartParam = {
            AppMode: 'Mixed',
            AppID: portalAppId,
            AppType: 'WEB',
            AppParam: {
                Linux: linuxLink,
                Android: androidLink,
                ThinClient: thinClientLink
            }
        }
         console.log("浏览器版本号="+navigator.userAgent);
        if (navigator.userAgent.lastIndexOf('iPanel') > -1) { //linux
            var portal = getPortal();
            var backUrl = frameEntrance + new Date().getTime();
            console.log('portal:' + portal)
            if (portal) {
                backUrl = portal
            }
            location.href = backUrl
        } else if (typeof CyberCloud !== 'undefined') { //瘦终端
            var portal = getPortal();
            console.log('portal:' + portal)
            var ret = null;
            if (portal) {
                ret = GHWEBAPI.StartApp(JSON.parse(portal), null, "")
            } else {
                ret = GHWEBAPI.StartApp(HomeStartParam, null, "")
            }
            console.log(JSON.stringify(ret))
        } else { //android
            // var portal = getPortal();
            // console.log('portal:' + portal)
            // var backUrl = frameEntrance + new Date().getTime();
            // if (portal) {
            //     backUrl = portal
            // }
            // location.href = backUrl"app:exit"
            window.location.href ="app://exit";
        }
    }
    /**
     * 保存应用入口portal
     */
    function savePortal() {
        if (navigator.userAgent.lastIndexOf('iPanel') > -1) { //iPanel
            var backUrl = decodeURIComponent(getUrlParam('backUrl'))
            if (backUrl) {
                console.log('save portal linux:' + backUrl);
                iPanel.setGlobalVar("nianhuaBackURL", backUrl);
            }
        } else if (typeof CyberCloud !== 'undefined') { //thin client
            var backUrl = decodeURIComponent(getUrlParam("AppBackParam"));
            if (backUrl) {
                console.log('save portal thin client:' + backUrl);
                setCookie("nianhuaBackURL", backUrl, 30);
            }
        } else { //android
            var backUrl = decodeURIComponent(getUrlParam('backUrl'))
                // if (backUrl) { // DataAccess 废弃
                //   console.log('save portal android:' + backUrl);
                //   var table = DataAccess.getUserPropertyTable('nianhuaBackURL')
                //   console.log('>>>>>>>>get table id:' +  table);
                //   if (table == -1) {
                //     table = DataAccess.createUserPropertyTable('nianhuaBackURL')
                //     console.log('>>>>>>>>create table id:' +  table);
                //   } else if (table < 0) {
                //     console.log('table error code:' + table);
                //     return;
                //   }
                //   var item = DataAccess.getProperty(table, 'portal')
                //   console.log('>>>>>>>>get table item:' +  item);
                //   if (!item) {
                //     DataAccess.createItem(table, 'protal', backUrl)
                //     console.log('>>>>>>>> createItem');
                //   }
                //   DataAccess.setProperty(table, 'portal', backUrl)
                //   console.log('>>>>>>>> setProperty');
                // }
            if (backUrl) {
                console.log('save portal android:' + backUrl);
                setCookie("nianhuaBackURL", backUrl, 30);
            }
        }
    }
    /**
     * 获取应用入口portal
     * @return {[type]} [description]
     */
    function getPortal() {
        var portal = ''
        if (navigator.userAgent.lastIndexOf('iPanel') > -1) { //iPanel
            portal = iPanel.getGlobalVar("nianhuaBackURL");
        } else if (typeof CyberCloud !== 'undefined') { //瘦终端
            portal = getCookie('nianhuaBackURL');
        } else { //Android
            //DataAccess不稳定 改用cookie
            // var table = DataAccess.getUserPropertyTable('nianhuaBackURL')
            // console.log('>>>>>>>>>>> table id:' + table);
            // if (table > 0) {
            //   portal = DataAccess.getProperty(table, 'portal')
            //   console.log('>>>>>>>>portal:' + portal);
            // } else {
            //   console.log('>>>>>>>>table not found');
            // }
            portal = getCookie('nianhuaBackURL')
        }
        return portal
    }
    /**
     * 获取hash信息
     * @return {obj} 返回hash的JSON对象
     */
    function getHash() {
        var ret = null;
        var hash = location.hash.replace(/^#/, '')
        if (hash) {
            ret = eval('[' + decodeURIComponent(hash) + ']')[0]
        }
        return ret;
    }
    /**
     * 设置页面的hash值
     * @param {obj} obj JSON对象
     */
    function setHash(obj) {
        var ret = ''
        var hash = JSON.stringify(obj)
        location.hash = hash;
    }
    // ========================= base64编码

    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    //客户端Base64编码
    function base64Encode(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
    //客户端Base64解码
    function base64Decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            }
            while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            }
            while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
    //utf16字符串转换为utf8
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;

        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);

            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i)
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
            }
        }
        return out;
    };

    //utf16字符串转换为utf8
    function utf8to16(str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    out += str.charAt(i - 1);

                    break;

                case 12:
                case 13:
                    char2 = str.charCodeAt(i++);

                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;

                case 14:
                    char2 = str.charCodeAt(i++);

                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break
            }
        }

        return out;
    };

    // ======================== sha1 算法详情
    var chrsz = 8;

    function str_hmac_sha1(key, data) {
        return binb2str(core_hmac_sha1(key, data));
    }

    /*
     * Convert an array of big-endian words to a string
     */
    function binb2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask);
        return str;
    }

    /*
     * Calculate the HMAC-SHA1 of a key and some data
     */
    function core_hmac_sha1(key, data) {
        var bkey = str2binb(key);
        if (bkey.length > 16)
            bkey = core_sha1(bkey, key.length * chrsz);

        var ipad = Array(16),
            opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
        return core_sha1(opad.concat(hash), 512 + 160);
    }

    /*
     * Convert an 8-bit or 16-bit string to an array of big-endian words
     * In 8-bit function, characters >255 have their hi-byte silently ignored.
     */
    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
        return bin;
    }

    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    function core_sha1(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for (var j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = rol(b, 30);
                b = a;
                a = t;
            }

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
            e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);
    }
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    function sha1_ft(t, b, c, d) {
        if (t < 20)
            return (b & c) | ((~b) & d);
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    }

    /*
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }
    // ====================== x_aqua_sign
    function x_aqua_sign(method, url) {
        if (typeof url !== 'string' || typeof method !== 'string') {
            return '';
        }
        if (url.indexOf('//') > -1) {
            url = url.split('//')[1];
            url = url.slice(url.indexOf('/'));
        }
        var string_to_sign;
        if (url.indexOf('?') > -1) {
            var urlParts = url.split('?');
            var urlPath = urlParts[0];
            var urlParam = urlParts[1];
            var params = urlParam.split('&');
            var paramArray = [];
            for (var i = 0, len = params.length; i < len; i++) {
                var param = params[i];
                var paramParts = param.split('=');
                var paramKey = paramParts[0];
                var paramValue = paramParts[1];
                if (paramValue.match(/%[a-fA-F0-9]{2}/)) {
                    paramValue = decodeURIComponent(paramValue);
                }
                paramArray.push((paramKey + ':' + paramValue).toLowerCase());
            }
            paramArray.sort();
            string_to_sign = (method + urlPath).toLowerCase() + '?' + paramArray.join(':');
        } else {
            string_to_sign = (method + url).toLowerCase();
        }
        string_to_sign = strictEncodeURIComponent(string_to_sign).toLowerCase();
        // log(string_to_sign);
        var x_aqua_sign = base64Encode(str_hmac_sha1(paasAppSecret, utf16to8(string_to_sign)));
        return x_aqua_sign;
    }

    function strictEncodeURIComponent(s) {
        s = encodeURIComponent(s);
        var i = s.search(/[!\*'\(\)]/);
        if (i == -1) {
            return s;
        }
        return s.replace("!", '%21').replace("*", '%2A').replace("'", '%27').replace("(", '%28').replace(")", '%29');
    }
    // ==================== 播放器
    function playVideo(opts) {
        var pid = opts.ProviderId,
            paid = opts.ProviderAssetId;
        //下面出现的所有参数均为文档中所说的必选参数
        var playParam = {
            AppKey: appKey,
            ProviderID: pid,
            ProviderAssetID: paid,
            MovieID: MovieID,
            Type: 1,
            PlayerURL: {
                Linux: '',
                Android: '',
                ThinClient: ''
            }
        }
        var backParam = {
            AppMode: appMode,
            AppID: appId,
            AppType: appType,
            AppParam: {
                Linux: location.href,
                Android: location.href,
                ThinClient: location.href
            }
        }
        if (navigator.userAgent.lastIndexOf('iPanel') > -1) {
            try {
                var CAID = CA.card.serialNumber
                var groupId = Math.floor(VOD.server.nodeGroupId)
                var play_url = LinuxPlayerUrl + '?caid=' + CAID + '&key=' +  (LinuxPlayParam.key||'') + '&nodeGroup=' + groupId + '&ip=' + (LinuxPlayParam.ip||'')
                play_url += '&pid=' + pid + ';' + paid
                play_url += '&back=' + encodeURIComponent(location.href)
            } catch (e) {
                console.log(e.message);
            } finally {
                console.log('play_url:' + play_url)
                location.href = play_url
            }
        } else {
            // console.log('playParam:' + JSON.stringify(playParam));
            // console.log('backParam:' + JSON.stringify(backParam));
            try {
                var play_url = playerUrl+'?';
                play_url += '&pid=' + pid + '&paid=' + paid;
                play_url += '&back=' + encodeURIComponent(backParam.AppParam.Android);
            } catch (e) {
                console.log(e.message);
            } finally {
                // console.log('play_url:' + play_url)
                location.href = play_url
            }
        }
    }
    // ====================== 键值定义
    function keyValue() {
        var keyvalue = {}
        keyvalue.up = 1; //上键
        keyvalue.down = 2; //下键
        keyvalue.left = 3; //左键
        keyvalue.right = 4; //右键
        keyvalue.enter = 13; //确定键
        keyvalue.prevPage = 372; //前一页
        keyvalue.nextPage = 373; //下一页
        keyvalue.back = 340; // 返回(盒子)
        keyvalue.red = 2305; //红键
        keyvalue.yellow = 834; //黄键2307
        keyvalue.blue = 2308; //蓝键
        keyvalue.green = 833; //2306 绿键(盒子) 4097 绿键(模拟器)
        keyvalue.play = 4160; //播放
        keyvalue.pause = 4162; //暂停
        keyvalue.stop = 4161; //停止
        keyvalue.info = 4100; //info键

        keyvalue.one = 49; //1键
        keyvalue.two = 50; //2键
        keyvalue.three = 51; //3键
        keyvalue.four = 52; //4键
        keyvalue.five = 53;
        keyvalue.six = 54;
        keyvalue.seven = 55;
        keyvalue.eight = 56;
        keyvalue.nine = 57;
        keyvalue.zero = 48;

        keyvalue.volumeup = 595;
        keyvalue.volumedown = 596;
        keyvalue.quit = 339;

        keyvalue.pageup = 374;
        keyvalue.pagedown = 375;
        keyvalue.pageUp = 372;
        keyvalue.pageDown = 373;

        keyvalue.ENTER = 13;
        keyvalue.LEFT = 37;
        keyvalue.UP = 38;
        keyvalue.RIGHT = 39;
        keyvalue.DOWN = 40;
        keyvalue.BACK = 27; //返回
        keyvalue.MENU = 93; //目录
        keyvalue.VOLUMEUP = 190; // .
        keyvalue.VOLUMEDOWN = 188; // ,
        keyvalue.QUIT = 81;
        keyvalue.PAGEUP = 34;
        keyvalue.PAGEDOWN = 33;

        keyvalue.Back = 8; // 模拟器
        keyvalue.PageUp = 177;
        keyvalue.PageDown = 176;
        keyvalue.Quit = 137;
        return keyvalue;
    }




    // ==================== 埋点
    /*function report() {
      var changed = false;
      var valueMap = {
        pageID: '',
        columnID: '',
        columnName: '',
        pageNum: '0',
        serviceNum: '0',
        serviceEntrance: '0',
        PaymentMethod: 0,
        Codeerror: '0',
        Payerror: '0'
      }

      function send() {
        if (typeof reportData == 'function') {
          if (changed) {
            console.log('report valueMap:' + JSON.stringify(valueMap));
            changed = false;
            reportData(valueMap)
          } else {
            console.log('invalid report');
          }
        } else {
          console.log('report fail! valueMap:' + JSON.stringify(valueMap));
        }
      }
      // 设置埋点数据
      function setKey(key, value) {
        if (existKey(key)) {
          var prev_value = valueMap[key]
          if (prev_value !== value || key == 'serviceEntrance') {
            changed = true
          }
          valueMap[key] = value
        }
      }
      // 检查数据有效性
      function existKey(name) {
        var exist = false;
        for (var key in valueMap) {
          if (key == name) {
            exist = true
          }
        }
        return exist
      }
      return {
        send: send,
        setKey: setKey
      }
    }*/
    /**
     * 设置cookie
     */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    /**
     * 获取Cookie
     */
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    // ==================== 工具模块返回
    return {
        deepClone: deepClone,
        addEvent: addEvent,
        getJson: getJson,
        useMarquee: useMarquee,
        getStrByLen: getStrByLen,
        playVideo: playVideo,
        getUrlParam: getUrlParam,
        exitApp: exitApp,
        getHash: getHash,
        setHash: setHash,
        debug: debug,
        savePortal: savePortal,
        //report: report()
    }
}))