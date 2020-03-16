/**
 * 动态load HTML和添加JavaSript引用
 * @author qiang.huo
 * @date 2014-01-15
 * @param htmlUri HTML文件的路径
 * 		  HTML页面的内容为一组element(DIV,TABLE,..)
 * @param container 被加载到的容器（DIV,TD,BODY,..）
 * @param isSync 是否异步加载 true异步加载，false同步加载
 * @param jses 是一个对象{uri:"xx.js",objName:"objName"}，
 * 		  或是一个数组，存放多个此种格式的对象
 * 		  uri指js文件的路径，objName指js的对象名称
 * @description 支持同步加载，对应浏览器有IE,Firefox,chrome等同内核浏览器
*/
function Include(htmlUri,container,isSync,jses){
	this.container = container;
	if(typeof(container) == "string"){
		this.container = document.getElementById(container);
	}
	this.htmlUri = htmlUri;
	this.isSync = isSync;
	this.jses = jses;
	this.tmpDivObj = null;
	this.height = 0;
	this.tmpChild = null;
	this.scriptObjs = [];
}

/**
 * 获取XmlHttpRequest对象
 * @returns XmlHttpRequest对象
 */
Include.prototype.getXhr = function(){
	var xmlHttpReq = null;
	if(window.XMLHttpRequest){
		xmlHttpReq = new XMLHttpRequest();
	}else{
		xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlHttpReq.sendAsBinary = function(datastr){
		function byteValue(x){
			return x.charCodeAt(0) & 0xff;
		}
		var ords = Array.prototype.map.call(datastr, byteValue);
		var ui8a = new Uint8Array(ords);
		this.send(ui8a.buffer);
	};
	return xmlHttpReq;
};

/**
 * 载入
 * @returns
 */
Include.prototype.load = function(){
	var xmlHttpReq = this.getXhr();
	var self = this;
	//加载HTML内容
	if(this.htmlUri){
		//在匿名方法中，除了同步外，this会变得无效,故定义self指针指向原来的this
		this.htmlCallBack = function(){
			if(xmlHttpReq.readyState == 4){
				if(xmlHttpReq.status == 200 || xmlHttpReq.status == 0 || xmlHttpReq.status == 304){
					self.tmpDivObj = document.createElement("DIV");
					self.tmpDivObj.innerHTML = xmlHttpReq.responseText;
					var len = self.tmpDivObj.children.length;
					for(var i = 0; i < len; i++){
						self.tmpChild = self.tmpDivObj.children[i];
						if(self.tmpChild && self.tmpChild.style.display != "none"){
							self.container.appendChild(self.tmpChild);
							self.height += self.tmpChild.offsetHeight;
						}
						self.tmpChild = null;
					}
					self.container.style.height = self.height + "px";
					self.height = 0;
					self.tmpDivObj = null;
				}
			}
		};
		if(this.isSync){//异步
			xmlHttpReq.onreadystatechange = this.htmlCallBack;
		}
		xmlHttpReq.open("GET", this.htmlUri, this.isSync);
		xmlHttpReq.send(null);
		if(!this.isSync){//同步
			this.htmlCallBack();
		}
	}
	//添加JavaScript引用
	if(this.jses instanceof Object && !(this.jses instanceof Array)){
		var js = [this.jses];
		this.jses = js;
	}
	if(this.jses instanceof Array){
		for(var i = 0; i < this.jses.length; i++){
			this.referJses(this.jses[i].uri,this.jses[i].objName);
		}
	}
};

/**
 * 添加引用js文件
 * @param xmlHttpReq
 * @returns
 */
Include.prototype.referJses = function(jsUri,objName){
    var xmlHttpReq = this.getXhr();
    var self = this;
    if(!this.jsCallBack){//设置回调函数
        this.jsCallBack = function(xmlHttpReq,objNewName){
            if(xmlHttpReq.readyState == 4){
                if(xmlHttpReq.status == 200 || xmlHttpReq.status == 0 || xmlHttpReq.status == 304){
                    var myHead = document.getElementsByTagName("HEAD").item(0);
                    var myScript = document.createElement("SCRIPT");
                    myScript.language = "javascript";
                    myScript.type = "text/javascript";
                    myScript.id = objNewName;
                    try{//IE8以及以下不支持这种方式，需要通过text属性来设置
                        myScript.appendChild(document.createTextNode(xmlHttpReq.responseText));
                    }catch(e){
                        myScript.text = xmlHttpReq.responseText;
                    }
                    myHead.appendChild(myScript);
                    self.scriptObjs.push([myScript,objNewName]);
                }
            }
        };
    }
    if(this.isSync){//异步
        xmlHttpReq.onreadystatechange = this.jsCallBack;
    }
    xmlHttpReq.open("GET", jsUri, this.isSync);
    xmlHttpReq.send(null);
    if(!this.isSync){//同步
        this.jsCallBack(xmlHttpReq,objName);
    }
};

/**
 * 移除HTML
 * @returns
 */
Include.prototype.rmvHtml = function(){
	var len = this.container.children.length;
	if(len > 0){
		for(;len > 0; len--){
			this.container.removeChild(this.container.children[0]);
		}
	}
};

/**
 * 移除JavaScript脚本
 * @returns
 */
Include.prototype.rmvJses = function(){
	if(this.scriptObjs.length > 0){
		var myHead = document.getElementsByTagName("HEAD").item(0);
		for(var i = 0; i < this.scriptObjs.length; i++){
			var rsScript = myHead.removeChild(this.scriptObjs[i][0]);
			window[this.scriptObjs[i][1]] = undefined;
			try{
				var rsDel = delete window[this.scriptObjs[i][1]];
			}catch(e){/*IE8及下删除会抛错，用catch捕获*/}
		}
		this.scriptObjs = [];
	}
};

/**
 * 移除HTML和JavaScript脚本
 * @returns
 */
Include.prototype.remove = function(){
	this.rmvHtml();
	this.rmvJses();
};