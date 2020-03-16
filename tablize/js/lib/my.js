
/**
 * @author hua.zhang
 */

if (!window.my) {
    window.my = {};
}

/**
 * 说明：获取Dom对象所在窗口的X,Y位置。
 * 参数：参数1 - Dom对象
 * 返回：位置对象{x: 距离窗口左边框的像素点, y: 距离窗口上边框的像素点}
 */
my.getObjAbsolutePosition = function(obj){
    var coord = {
        x: 0,
        y: 0
    };
    var element = obj;
    while (element) {
        coord.x += element.offsetLeft;
        // - element.scrollLeft;
        coord.y += element.offsetTop;
        // - element.scrollTop;
        element = element.offsetParent;
    }
    element = obj;
    while (element) {
        coord.x -= element.scrollLeft ? element.scrollLeft : 0;
        coord.y -= element.scrollTop ? element.scrollTop : 0;
        element = element.parentNode;
    }
    coord.x += document.documentElement.scrollLeft;
    coord.y += document.documentElement.scrollTop;
    return coord;
}
/**
 * 说明：生成按钮dom对象，保存在my.Button.obj下。
 * 参数：参数1 – 在按钮上显示的文字；参数2 – 按钮模板（0或者没有参数2表示默认模板，1表示另一种模板）
 * 返回：无。
 */
my.button = function(showName){
    this.obj = document.createElement("div");
    var str = [];
    if (arguments.length == 1) {
        str.push("<table cellspacing='0' cellpadding='0' border='0' height='22px' onmouseover='this.children[0].children[0].children[1].className=\"my_buttonHoverMiddle\";' onmouseout='this.children[0].children[0].children[1].className=\"my_buttonMiddle\";'>");
        str.push("<tbody><tr><td class='my_buttonLeft'><div></div></td>");
        str.push("<td class='my_buttonMiddle'>" + showName + "</td>");
        str.push("<td class='my_buttonRight'><div></div></td>");
        str.push("</tr></tbody></table>");
        this.obj.innerHTML = str.join("");
        this.obj.style.height = "22px";
        this.obj.style.overflowY = "hidden";
        this.obj.style.display = "";
    }
    else if (arguments.length == 2 && arguments[1] == "1") {
        str.push("<table cellspacing='0' cellpadding='0' border='0' height='18px' style='color:#FFFFFF;' class='my_hand'>");
        str.push("<tbody><tr><td class='button1Left'><div></div></td><td style='background: #8C8A8C;width:4px'></td>");
        str.push("<td style='background: #8C8A8C;'><span style='white-space:nowrap;font-family: Arial;font-weight:normal;font-size:12px;'>" + showName + "</span></td>");
        str.push("<td style='background: #8C8A8C;width:4px'></td><td class='button1Right'><div></div></td>");
        str.push("</tr></tbody></table>");
        this.obj.innerHTML = str.join("");
        this.obj.style.height = "18px";
        this.obj.style.overflowY = "hidden";
        this.obj.style.display = "";
    }
    else if(arguments.length == 2 && arguments[1] == "2"){
        //str.push("<table cellspacing='0' cellpadding='0' border='0' class='my_primaryButton' onmouseover='this.children[0].children[0].children[1].className=\"my_primaryButtonHoverMiddle\";this.children[0].children[0].children[0].children[0].className=\"my_primaryButtonHoverLeft\";this.children[0].children[0].children[2].children[0].className=\"my_primaryButtonHoverRight\";' onmouseout='this.children[0].children[0].children[1].className=\"my_primaryButtonMiddle\";this.children[0].children[0].children[0].children[0].className=\"my_primaryButtonLeft\";this.children[0].children[0].children[2].children[0].className=\"my_primaryButtonRight\";'>");
        str.push("<table cellspacing='0' cellpadding='0' border='0' class='my_primaryButton'>");
        str.push("<tbody><tr><td class='my_primaryButtonLeft'><div class='my_primaryButtonLeft'></div></td>");
        str.push("<td class='my_primaryButtonMiddle'>" + showName + "</td>");
        str.push("<td class='my_primaryButtonRight'><div class='my_primaryButtonRight'></div></td>");
        str.push("</tr></tbody></table>");
        this.obj.innerHTML = str.join("");
        this.obj.disabled=false;
        this.obj.onmouseover=function(){
            if(this.disabled == false){
                this.children[0].children[0].children[0].children[1].className="my_primaryButtonHoverMiddle";
                this.children[0].children[0].children[0].children[0].children[0].className="my_primaryButtonHoverLeft";
                this.children[0].children[0].children[0].children[2].children[0].className="my_primaryButtonHoverRight";
            }
        };
        this.obj.onmouseout=function(){
            if(this.disabled == false){
                this.children[0].children[0].children[0].children[1].className="my_primaryButtonMiddle";
                this.children[0].children[0].children[0].children[0].children[0].className="my_primaryButtonLeft";
                this.children[0].children[0].children[0].children[2].children[0].className="my_primaryButtonRight";
            }
        };
        this.obj.ondisabled=function(){
            if(this.disabled == false){
                this.children[0].children[0].children[0].children[1].className="my_primaryButtonMiddle";
                this.children[0].children[0].children[0].children[0].children[0].className="my_primaryButtonLeft";
                this.children[0].children[0].children[0].children[2].children[0].className="my_primaryButtonRight";
            }
            else if(this.disabled==true){
                this.children[0].children[0].children[0].children[1].className="my_primaryButtonDisabledMiddle";
                this.children[0].children[0].children[0].children[0].children[0].className="my_primaryButtonDisabledLeft";
                this.children[0].children[0].children[0].children[2].children[0].className="my_primaryButtonDisabledRight";
            }
        };
        this.obj.className = "my_primaryButton";
        this.obj.style.overflowY = "hidden";
        this.obj.style.display = "";
    }
    else if(arguments.length == 2 && arguments[1] == "3"){
        str.push("<table cellspacing='0' cellpadding='0' border='0' height='32px' onmouseover='this.children[0].children[0].children[1].className=\"my_secondaryButtonHoverMiddle\";' onmouseout='this.children[0].children[0].children[1].className=\"my_secondaryButtonMiddle\";'>");
        str.push("<tbody><tr><td class='my_secondaryButtonLeft'><div></div></td>");
        str.push("<td class='my_secondaryButtonMiddle'>" + showName + "</td>");
        str.push("<td class='my_secondaryButtonRight'><div></div></td>");
        str.push("</tr></tbody></table>");
        this.obj.innerHTML = str.join("");
        this.obj.style.height = "32px";
        this.obj.style.overflowY = "hidden";
        this.obj.style.display = "";
    }
}
/**
 * 获取当前浏览器窗口大小。
 * 参数：无
 * 返回：{w: 窗口宽度（像素）, h:窗口高度（像素）}
 */
my.screenBox = function(){
    var ret = {
        w: null,
        h: null
    };
    if (window.innerHeight) {
        ret.w = window.innerWidth;
        ret.h = window.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight) {
        ret.w = document.documentElement.clientWidth;
        ret.h = document.documentElement.clientHeight;
    }
    else if (document.body) {
        ret.w = document.body.clientWidth;
        ret.h = document.body.clientHeight;
    }
    if (!ret.w || !ret.h) {
        ret = null;
    }
    return ret;
}
/**
 * 获取Dom对象的大小。
 * 参数：参数1 – Dom对象的HTML字符串或Dom对象；参数2 – 存放参数1的对象的容器style。
 * 返回：{w: 窗口宽度（像素）, h:窗口高度（像素）}
 */
my.getHTMLObjBox = function(){
    var obj = dojo.query("div[getStringWidth='true']", document.body);
    var tmpObj = null;
    if (!obj || obj.length == 0 || !obj[0]) {
        var divObj = document.createElement("div");
        divObj.style.zIndex = "1";
        divObj.getStringWidth = "true";
        divObj.style.height = "0px";
        divObj.style.width = "0px";
        divObj.style.overflow = "hidden";
        dojo.attr(divObj, "getStringWidth", "true");
        divObj.innerHTML = "<table><tr><td></td></tr></table>"
        document.body.appendChild(divObj);
        tmpObj = divObj;
    }
    else {
        tmpObj = obj[0];
    }
    var tdObj = dojo.query("td", tmpObj)[0];

    if (arguments.length > 0) {
        if (typeof(arguments[0]) == "string") {
            tdObj.innerHTML = arguments[0];
        }
        else {
            tdObj.appendChild(arguments[0]);
        }
    }
    if (arguments.length >= 2) {
        var styles = arguments[1];
        tdObj.setAttribute("style", styles);
    }
    if (arguments.length == 3) {
        tdObj.className = arguments[2];
    }
    var ret = {
        w: tdObj.offsetWidth,
        h: tdObj.offsetHeight
    };
    tdObj.innerHTML = "";
    tdObj.setAttribute("style", "");
    tdObj.className = "";
    return ret;
}
/**
 * 说明：获取页面加载的某个Javascript脚步文件的访问路径。
 * 参数：参数1 – javascript文件名。
 * 返回：路径字符串
 */
my.getLocalJsPath = function(jsName){
    var jss = document.getElementsByTagName("script");
    var result = "";
    for (var i = 0; i < jss.length; i++) {
        if (jss[i].src && jss[i].src != "") {
            var tmp = jss[i].src.split("/");
            if (tmp[tmp.length - 1] == jsName) {
                result = jss[i].src.slice(0, jss[i].src.lastIndexOf("/") + 1);
                break;
            }
        }
    }
    return result;
};
/**
 * 显示控件库存放在服务器的路径。
 */
my.jsPath = my.getLocalJsPath("my.js");
/**
 * 说明：通过Javascript方式链接CSS文件。
 * 参数：参数1 – CSS文件及路径
 * 返回：无
 */
my.linkCSS = function(pathName){
    var style = document.createElement("link");
    style.href = my.jsPath + pathName;
    style.rel = "stylesheet";
    style.type = "text/css";
    document.getElementsByTagName("HEAD").item(0).appendChild(style);
};

//my.linkCSS("resource/themes/blue/my.css");
//my.linkCSS("resource/themes/green/my.css");
//my.linkCSS("resource/themes/purple/my.css");

my.linkJs = function(pathName){
    var script = document.createElement("script");
    script.type ="text/javascript";
    script.src = my.jsPath+pathName;
    document.getElementsByTagName("HEAD").item(0).appendChild(script);
}

/**
 * 说明：获取Dom对象的style属性值
 * 参数：参数1 – Dom对象；参数2 – style属性名。
 * 返回：style属性值
 */
my.getStyle = function(elem, name){
    //如果该属性存在于style[]中，则它最近被设置过(且就是当前的)
    if (elem.style[name]) {
        return elem.style[name];
    }
    //否则，尝试IE的方式
    else if (elem.currentStyle) {
        return elem.currentStyle[name];
    }
    //或者W3C的方法，如果存在的话
    else if (document.defaultView && document.defaultView.getComputedStyle) {
        //它使用传统的"text-Align"风格的规则书写方式，而不是"textAlign"
        name = name.replace(/([A-Z])/g, "-$1");
        name = name.toLowerCase();
        //获取style对象并取得属性的值(如果存在的话)
        var s = document.defaultView.getComputedStyle(elem, "");
        return s && s.getPropertyValue(name);
        //否则，就是在使用其它的浏览器
    }
    else {
        return null;
    }
};
/**
 * 说明：在console中打印出当前时间戳以及与前一个打印时间戳之间相隔多少毫秒。
 * 参数：参数1：打印时所需要携带的说明文字。（可选）
 * 返回：无
 */
my.printTime = function(){
    var nowTime = new Date().getTime();
    if(!this.performenceTime){
        this.performenceTime=nowTime;
    }
    console.log(nowTime + ":" + (nowTime - this.performenceTime) + "::" + (arguments[0] ? arguments[0] : ""));
    performenceTime = nowTime;
};
/**
 * 说明：将一个带有“%”百分比字符串，转换成实际数字。
 * 参数：参数1 – 数字字符串；参数2 – 百分百的实际数值
 * 返回：百分比折算后的实际数值。
 */
my.parsePercent = function(str, count){
    var ret = str;
    if (typeof(str) == "string") {
        if (str.indexOf("%") == str.length - 1) {
            ret = count * (parseFloat(str) / 100);
        }
    }

    return ret;
}
/**
 * 说明：通过判断操作系统语言，获取相应语言包文件中的语言对象。
 * 参数：参数1 – 语言包名；参数2 – 语言包存放位置（可选）
 * 返回：对应语言包文件中的语言对象。
 */
my.localization = function(file){
    var ret = null;
    var parentObj = parent ? parent : window;
    var resource = "resource";
    if (arguments.length > 1) {
        resource = arguments[1];
    }
    if (parentObj["_my_" + file]) {
        ret = parentObj["_my_" + file];
    }
    else {
        if (!parentObj.myLocalization) {
            parentObj.myLocalization = dojo.locale;
        }
        if (parentObj.myLocalization != "root") {
            try {
                dojo.requireLocalization(resource, file, parentObj.myLocalization, parentObj.myLocalization);
                parentObj["_my_" + file] = dojo.i18n.getLocalization(resource, file, parentObj.myLocalization);
            }
            catch (e) {
                console.log(e.message);
                //parentObj.myLocalization = "root";
                try {
            		dojo.requireLocalization(resource, file, "root", "root");
            		if (parentObj["_my_" + file]) {
                		parentObj["_my_" + file] = dojo.mixin(dojo.i18n.getLocalization(resource, file, "root"), parentObj["_my_" + file]);
            		} else {
                		parentObj["_my_" + file] = dojo.i18n.getLocalization(resource, file, "root");
            		}
        		} catch (e) {
            		console.log(e.message);
            		//parentObj.myLocalization = "root";
        		}
            }
        }
        ret = parentObj["_my_" + file];
    }
    return ret;
}
/**
 * 说明：按照日期格式要求生成对应字符串
 * 参数：参数日期格式字符串
 * 返回：当前日期对象所对应的字符串
 */
window.Date.prototype.format = function(mask){
    var d = this;
    var zeroize = function(value, length){
        if (!length)
            length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };
    return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,4}|m{1,4}|M{1,4}|tt|TT|TZ|yy(?:yy)?|([hHMs])\1?|[lLZ])/g, function($0){
        switch ($0) {
            case 'd':{
                return d.getDate();
            }
            case 'dd':{
                return zeroize(d.getDate());
            }
            case 'ddd':{
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            }
            case 'dddd':{
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            }
            case 'M':{
                return d.getMonth() + 1;
            }
            case 'MM':{
                return zeroize(d.getMonth() + 1);
            }
            case 'MMM':{
                return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'][d.getMonth()];
            }
            case 'MMMM':{
                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            }
            case 'yy':{
                return String(d.getFullYear()).substr(2);
            }
            case 'yyyy':{
                return d.getFullYear();
            }
            case 'h':{
                return d.getHours() % 12 || 12;
            }
            case 'hh':{
                return zeroize(d.getHours() % 12 || 12);
            }
            case 'H':{
                return d.getHours();
            }
            case 'HH':{
                return zeroize(d.getHours());
            }
            case 'm':{
                return d.getMinutes();
            }
            case 'mm':{
                return zeroize(d.getMinutes());
            }
            case 's':{
                return d.getSeconds();
            }
            case 'ss':{
                return zeroize(d.getSeconds());
            }
            case 'l':{
                return zeroize(d.getMilliseconds(), 3);
            }
            case 'L':{
                var m = d.getMilliseconds();
                if (m > 99)
                    m = Math.round(m / 10);
                return zeroize(m);
            }
            case 'tt':{
                return d.getHours() < 12 ? 'am' : 'pm';
            }
            case 'TT':{
                return d.getHours() < 12 ? 'AM' : 'PM';
            }
            case 'Z':{
                return d.toUTCString().match(/[A-Z]+$/);
            }
            case 'TZ':{
                var tmp = 0 - d.getTimezoneOffset();
                if (tmp >= 0) {
                    return "+" + zeroize(tmp / 60) + ":" + zeroize(tmp % 60);
                }
                else {
                    return zeroize(tmp / 60) + ":" + zeroize(tmp % 60);
                }
            }
            // Return quoted strings with the surrounding quotes removed
            default:
                return $0.substr(1, $0.length - 2);
        }
    });
};
/**
 * 说明：将带有日期格式的字符串转换成可以校验日期格式的正则表达式。
 * 参数：参数1 – 带有日期格式的字符串。
 * 返回：正则表达式对象。
 */
my.dateStrToRegExp = function(mask){
    var ret = "";
    var formatArry = {
        "MMM": {
            regValue: "(Jan.|Feb.|Mar.|Apr.|May.|Jun.|Jul.|Aug.|Sep.|Oct.|Nov.|Dec.)"
        },
        "MMMM": {
            regValue: "(January|February|March|April|May|June|July|August|September|October|November|December)"
        }, //*
        "d": {
            regValue: "([0123]?\\d?)"
        },
        "ddd": {
            regValue: "(Sun|Mon|Tue|Wed|Thr|Fri|Sat)"
        }, //*
        "M": {
            regValue: "([01]?\\d?)" //*
        },
        "dddd": {
            regValue: "(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)" //*
        },
        "yyyy": {
            regValue: "(\\d{4})"
        },
        "yy": {
            regValue: "(\\d{2})" //*
        },
        "MM": {
            regValue: "([0,1]\\d{1})"
        },
        "dd": {
            regValue: "([0,1,2,3]\\d{1})"
        },
        "H": {
            regValue: "([012]?\\d?)" //*
        },
        "HH": {
            regValue: "([0,1,2]\\d{1})"
        },
        "h": {
            regValue: "([01]?\\d?)" //*
        },
        "hh": {
            regValue: "([0,1]\\d{1})" //*
        },
        "m": {
            regValue: "([012345]?\\d?)"
        }, //*
        "mm": {
            regValue: "([0,1,2,3,4,5]\\d{1})"
        },
        "s": {
            regValue: "([012345]?\\d?)"
        }, //*
        "ss": {
            regValue: "([0,1,2,3,4,5]\\d{1})"
        },
        "l": {
            regValue: "(\\d{1}\\d{1}\\d{1})"
        }, //*
        "L": {
            regValue: "([0,1]\\d{1}\\d{1})"
        }, //*
        "tt": {
            regValue: "(am|pm)"
        }, //*
        "TT": {
            regValue: "(AM|PM)"
        }, //*
        "Z": {
            regValue: "(UTC|GMT)"
        } //*
    };
    ret = mask.replace(/"[^"]*"|'[^']*'|(?:d{1,4}|m{1,4}|M{1,4}|tt|TT|yy(?:yy)?|([hHMs])\1?|[lLZ])/g, function(word){
        return formatArry[word].regValue;
    });
    ret = ret.replace(/\s+/g, "\\s+");
    //console.log(ret);
    return new RegExp("^" + ret + "$");
    //return new RegExp(ret);
}
/**
 * 说明：将当前字符串中带有{$变量名}字样的通过对应的变量名替换成变量值。
 * 参数：参数1 – 变量名对象。例如：{变量名1：变量值，变量名2：变量值}
 * 返回：被替换后的字符串。
 */
window.String.prototype.myReplace = function(obj){
    var ret = this;
    var _Expr = /\$\{(\S*?)\}/gi;
    var mach = _Expr.exec(this);
    while (mach) {
        if(typeof obj[mach[1]] !== 'undefined'){
            ret = ret.replace(mach[0], obj[mach[1]]);
        }
        mach = _Expr.exec(this);
    }
    return ret;
}
/**
 * 说明：按照日期格式将字符串转换成对应的日期对象。
 * 参数：参数1 – 日期格式字符串
 * 返回：当前字符串通过日期格式化后转换成的对应日期对象。
 */
window.String.prototype.formatToDate = function(mask){
    var _point = 0;
    var str = this;

    //var arry = mask.match(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|M{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g);
    var arry = mask.match(/"[^"]*"|'[^']*'|(?:d{1,4}|m{1,4}|tt|TT|M{1,4}|yy(?:yy)?|([hHMs])\1?|[lLZ])/g);
    //console.log(arry);
    var replaceStr = [];
    for (var i = 0; i < arry.length; i++) {
        replaceStr.push("$" + (i + 1));
    }
    var tmpStr = str.replace(my.dateStrToRegExp(mask), replaceStr.join("|"));
    //console.log(tmpStr);
    var valueArry = tmpStr.split("|");
    var tmpDateObj={year:1970,month:0,date:1,hours:0,minutes:0,seconds:0,milliseconds:0};
    for(var i = 0;i<arry.length;i++){
        tmpDateObj[arry[i]]=valueArry[i];
    }
    if(tmpDateObj.yyyy)
    {
        tmpDateObj.year=parseInt(tmpDateObj.yyyy,10);
    }
    if(tmpDateObj.yy){
        tmpDateObj.year=parseInt(tmpDateObj.yy,10);
        if(tmpDateObj.year>=70)
        {
            tmpDateObj.year+=1900;
        }
        else
        {
            tmpDateObj.year+=2000;
        }
    }
    if(tmpDateObj.MM){
        tmpDateObj.month=parseInt(tmpDateObj.MM,10)-1;
    }
    if(tmpDateObj.M){
        tmpDateObj.month=parseInt(tmpDateObj.M,10)-1;
    }
    if(tmpDateObj.MMM){
        var tmp = "Jan.|Feb.|Mar.|Apr.|May.|Jun.|Jul.|Aug.|Sep.|Oct.|Nov.|Dec.".split("|");
        var i = 0;
        while (i < tmp.length) {
            if (tmpDateObj.MMM.localeCompare(tmp[i]) == 0) {
                tmpDateObj.month=i;
                break;
            }
            i++;
        }
    }
    if(tmpDateObj.MMMM){
        var tmp = "January|February|March|April|May|June|July|August|September|October|November|December".split("|");
        var i = 0;
        while (i < tmp.length) {
            if (tmpDateObj.MMMM.localeCompare(tmp[i]) == 0) {
                tmpDateObj.month=i;
                break;
            }
            i++;
        }
    }
    if(tmpDateObj.dd){
        tmpDateObj.date=parseInt(tmpDateObj.dd,10);
    }
    if(tmpDateObj.d){
        tmpDateObj.date=parseInt(tmpDateObj.d,10);
    }
    if(tmpDateObj.H){
        tmpDateObj.hours=parseInt(tmpDateObj.H,10);
    }
    if(tmpDateObj.HH){
        tmpDateObj.hours=parseInt(tmpDateObj.HH,10);
    }
    if(tmpDateObj.h){
        tmpDateObj.hours=parseInt(tmpDateObj.h,10);
    }
    if(tmpDateObj.hh){
        tmpDateObj.hours=parseInt(tmpDateObj.hh,10);
    }
    if((tmpDateObj.tt && tmpDateObj.tt=="pm") || tmpDateObj.TT && tmpDateObj.TT == "PM"){
        tmpDateObj.hours+=12;
    }
    if(tmpDateObj.mm){
        tmpDateObj.minutes=parseInt(tmpDateObj.mm,10);
    }
    if(tmpDateObj.m){
        tmpDateObj.minutes=parseInt(tmpDateObj.m,10);
    }
    if(tmpDateObj.ss){
        tmpDateObj.seconds=parseInt(tmpDateObj.ss,10);
    }
    if(tmpDateObj.s){
        tmpDateObj.seconds=parseInt(tmpDateObj.s,10);
    }
    var ret = new Date();
    ret.setFullYear(tmpDateObj.year,tmpDateObj.month,tmpDateObj.date);
    ret.setHours(tmpDateObj.hours,tmpDateObj.minutes,tmpDateObj.seconds);
    return ret;
}
/**
 * 说明：将当前按照URL格式的字符串转化成自定义URL对象。
 * 参数：无
 * 返回：自定义URL对象。{protocol: "",userInfo: "",user: "",password: "",host: "",hostName: "",hostPort: "",params: [],path: [],file: "",urlStr: ""}
 */
window.String.prototype.formatUrl = function(){
    var ret = {
        protocol: "",
        userInfo: "",
        user: "",
        password: "",
        host: "",
        hostName: "",
        hostPort: "",
        params: [],
        path: [],
        file: "",
        urlStr: ""
    };
    if (this.match(/^[a-zA-Z]+[\:][\/][\/]([\w|\.]+[\:][\w|\.]*[\@])?([^\\\/\:\*\?\'\"\<\>\|\s])+[\:]?[\d]{0,5}([\/][^\\\/\:\*\?\'\"\<\>\|]+)*(\?[^\\\/\:\*\?\'\"\<\>\|\&\=]+\=[^\\\/\:\*\?\'\"\<\>\|\&\=]*(\&[^\\\/\:\*\?\'\"\<\>\|\&\=]+\=[^\\\/\:\*\?\'\"\<\>\|\&\=]*)*)?[\/]?$/)) {
        ret.protocol = this.match(/^[a-zA-Z]+\:\/\//);
        if (ret.protocol && ret.protocol[0]) {
            ret.protocol = ret.protocol[0].replace(/\:\/\/$/, "");
        }
        else {
            ret.protocol = "";
        }
        var tmp = this.replace(/^[a-zA-Z]+\:\/\//, "");
        //console.log(tmp);
        if (tmp != "") {
            ret.userInfo = tmp.match(/^[\w|\.]+\:[\w|\.]*\@/);
            if (ret.userInfo && ret.userInfo[0]) {
                ret.userInfo = ret.userInfo[0].replace(/\@$/, "");
            }
            else {
                ret.userInfo = "";
            }
            ret.user = "";
            ret.password = "";
            if (ret.userInfo != "") {
                ret.user = ret.userInfo.split(":")[0];
                ret.password = ret.userInfo.split(":")[1];
            }
            tmp = tmp.replace(/^[\w|\.]+\:[\w|\.]*\@/, "");
            //console.log(tmp);
        }
        if (tmp != "") {
            ret.host = tmp.match(/^[^\\\/\:\*\?\'\"\<\>\|\s]+[\:]?[\d]{0,5}[\/]?/);
            if (ret.host && ret.host[0]) {
                ret.host = ret.host[0].replace(/\/$/, "");
            }
            else {
                ret.host = "";
            }
            ret.hostName = "";
            ret.hostPort = "";
            if (ret.host != "") {
                if (ret.host.split(":")[0]) {
                    ret.hostName = ret.host.split(":")[0];
                }
                if (ret.host.split(":")[1]) {
                    ret.hostPort = ret.host.split(":")[1];
                }
            }
            tmp = tmp.replace(/^[^\\\/\:\*\?\'\"\<\>\|\s]+[\:]?[\d]*[\/]?/, "");
            //console.log(tmp);
        }
        if (tmp != "") {
            ret.params = tmp.match(/\?[^\\\/\:\*\?\'\"\<\>\|\&\=]+\=[^\\\/\:\*\?\'\"\<\>\|\&\=]*(\&[^\\\/\:\*\?\'\"\<\>\|\&\=]+\=[^\\\/\:\*\?\'\"\<\>\|\&\=]*)$/);
            if (ret.params && ret.params[0]) {
                ret.params = ret.params[0].replace(/^\?/, "").split("&");
            }
            else {
                ret.params = [];
            }
            tmp = tmp.replace(/\?[^\\\/\:\*\?\'\"\<\>\|\&\=]+\=[^\\\/\:\*\?\'\"\<\>\|\&\=]*(\&[^\\\/\:\*\?\'\"\<\>\|\&\=]+\=[^\\\/\:\*\?\'\"\<\>\|\&\=]*)$/, "");
            //console.log(tmp);
        }
        if (tmp !== "") {
            tmp = "/" + tmp;
            ret.urlStr = tmp.match(/^[\/][^\\\/\:\*\?\'\"\<\>\|]+([\/][^\\\/\:\*\?\'\"\<\>\|]+)*[\/]?/);
            if (ret.urlStr && ret.urlStr[0]) {
                ret.urlStr = ret.urlStr[0];
            }
            else {
                ret.urlStr = "";
            }

            ret.file = tmp.match(/[\/][^\\\/\:\*\?\'\"\<\>\|\.]+[\.][^\\\/\:\*\?\'\"\<\>\|\.]+$/);
            if (ret.file && ret.file[0]) {
                ret.file = ret.file[0].replace(/(^\/)/, "");
            }
            else {
                ret.file = "";
            }
            tmp = tmp.replace(/[\/][^\\\/\:\*\?\'\"\<\>\|\.]+[\.][^\\\/\:\*\?\'\"\<\>\|\.]+$/, "");
        }

        if (tmp !== "") {
            ret.path = tmp.match(/^[\/][^\\\/\:\*\?\'\"\<\>\|]+([\/][^\\\/\:\*\?\'\"\<\>\|]+)*[\/]?/);
            if (ret.path && ret.path[0]) {
                ret.path = ret.path[0].replace(/(^\/)/, "");
                ret.path = ret.path.replace(/(\/$)/, "").split("\/");
            }
            else {
                ret.path = [];
            }
        }
    }

    return ret;
}
/**
 * 说明：将Javascript中的Object对象转换成Json格式的字符串。
 * 参数：参数1 – javascript中的Object对象
 * 返回：Json格式的字符串。
 */
my.toJson = function(obj){
    var ret = null;
    //try {
    var objType = typeof(obj);
    switch (objType) {
        case "undefined":
        case "null":{
            ret = objType;
            break;
        }
        case "number":
        case "boolean":{
            ret = obj.toString();
            break;
        }
        case "string":{
            ret = obj.replace(/\\/g, "\\\\");
            ret = ret.replace(/\r*\n/g, "\\n");
            break;
        }
        case "function":{
            var tmp = obj();
            ret = my.toJson(tmp);
            break;
        }
        case "object":{
            if (obj instanceof Array) {
                objType = "array";
            }
            else {
                var tmp = [];
                var tmpValue = [];
                for (var x in obj) {
                    tmp.push(x);
                }
                tmp.sort(function(a, b){
                    if (a == "@type") {
                        return -1;
                    }
                    else if (b == "@type") {
                        return 1;
                    }
                    else {
                        return a.localeCompare(b);
                    }
                });
                for (var i = 0; i < tmp.length; i++) {
                    switch (typeof obj[tmp[i]]) {
                        case "undefined":
                        case "null":
                        case "number":
                        case "boolean":{
                            tmpValue.push('"' + tmp[i] + '":' + my.toJson(obj[tmp[i]]));
                            break;
                        }
                        case "string":{
                            tmpValue.push('"' + tmp[i] + '":"' + my.toJson(obj[tmp[i]]) + '"');
                            break;
                        }
                        default:
                            tmpValue.push('"' + tmp[i] + '":' + my.toJson(obj[tmp[i]]));
                            break;
                    }
                }
                ret = "{" + tmpValue.join(",") + "}";
                break;
            }
        }
        case "array":{
            var tmp = [];
            for (var i = 0; i < obj.length; i++) {
                switch (typeof obj[i]) {
                    case "undefined":
                    case "null":
                    case "number":
                    case "boolean":
                    case "string":{
                        tmp.push('"' + my.toJson(obj[i]) + '"');
                        break;
                    }
                    default:
                        tmp.push(my.toJson(obj[i]));
                        break;
                }
            }
            ret = "[" + tmp.join(",") + "]";
            break;
        }
        default:
            break;
    }
    //}
    //catch (e) {
    //  alert(e.message);
    //}
    return ret;
}

/**
 * 说明：按照日期格式要求生成对应字符串
 * 参数：参数日期格式字符串
 * 返回：当前日期对象所对应的字符串
 */
my.formatDate = function(date1,mask){
  var d = date1;
  var zeroize = function(value, length){
    if (!length)
      length = 2;
    value = String(value);
    for (var i = 0, zeros = ''; i < (length - value.length); i++) {
      zeros += '0';
    }
    return zeros + value;
  };
  mask = mask.replace("yyyy", d.getFullYear());
  mask = mask.replace("MM", zeroize(d.getMonth() + 1));
  mask = mask.replace("dd", zeroize(d.getDate()));
  mask = mask.replace("HH", zeroize(d.getHours()));
  mask = mask.replace("mm", zeroize(d.getMinutes()));
  mask = mask.replace("ss", zeroize(d.getSeconds()));
  return mask;
  return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,4}|m{1,4}|M{1,4}|tt|TT|TZ|yy(?:yy)?|([hHMs])\1?|[lLZ])/g, function($0){
    switch ($0) {
      case 'd':{
        return d.getDate();
      }
      case 'dd':{
        return zeroize(d.getDate());
      }
      case 'ddd':{
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
      }
      case 'dddd':{
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
      }
      case 'M':{
        return d.getMonth() + 1;
      }
      case 'MM':{
        return zeroize(d.getMonth() + 1);
      }
      case 'MMM':{
        return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'][d.getMonth()];
      }
      case 'MMMM':{
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
      }
      case 'yy':{
        return String(d.getFullYear()).substr(2);
      }
      case 'yyyy':{
        return d.getFullYear();
      }
      case 'h':{
        return d.getHours() % 24 || 24;
      }
      case 'hh':{
        return zeroize(d.getHours() % 24 || 24);
      }
      case 'H':{
        return d.getHours();
      }
      case 'HH':{
        return zeroize(d.getHours());
      }
      case 'm':{
        return d.getMinutes();
      }
      case 'mm':{
        return zeroize(d.getMinutes());
      }
      case 's':{
        return d.getSeconds();
      }
      case 'ss':{
        return zeroize(d.getSeconds());
      }
      case 'l':{
        return zeroize(d.getMilliseconds(), 3);
      }
      case 'L':{
        var m = d.getMilliseconds();
        if (m > 99)
          m = Math.round(m / 10);
        return zeroize(m);
      }
      case 'tt':{
        return d.getHours() < 12 ? 'am' : 'pm';
      }
      case 'TT':{
        return d.getHours() < 12 ? 'AM' : 'PM';
      }
      case 'Z':{
        return d.toUTCString().match(/[A-Z]+$/);
      }
      case 'TZ':{
        var tmp = 0 - d.getTimezoneOffset();
        if (tmp >= 0) {
          return "+" + zeroize(tmp / 60) + ":" + zeroize(tmp % 60);
        }
        else {
          return zeroize(tmp / 60) + ":" + zeroize(tmp % 60);
        }
      }
      // Return quoted strings with the surrounding quotes removed
      default:
        return $0.substr(1, $0.length - 2);
    }
  });
};
/**
 * 说明：运行一个本地的应用程序。只支持IE。
 * 参数： 参数1 - 应用程序名+完整的路径。例如：C:\\Program Files\\VideoLAN\\VLC\\vlc.exe http:\/\/127.0.0.1\/tests\/bubujingxin301.mp4
 * 返回：无
 */
my.openShell = function(cmd){
    if (dojo.isIE) {
        var obj = new ActiveXObject("WScript.Shell");
        obj.Exec(cmd);
    }
    else {
        alert("This openShell function is only support IE browser.");
    }
}
