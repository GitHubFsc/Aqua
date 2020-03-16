/*
__serviceID : 业务场景ID  , 字符串类型， 如 : "0101";
__key : 传输Key , 数组类型，如 ：["S","V","PC","ID","MA","PP","ST","ED","CV"];
__val : 传输Key对应的值 , 数组类型;
__key & __val 具体定义见文档 "歌华有线信息采集高清交互机顶盒接口规范XXX" 的描述
*/

function collectData(__serviceID,__key,__val){
	if((navigator.appName.toLowerCase()).indexOf("ipanel") != -1){
		if (Collect){
			//特殊处理一下
			iPanel.debug("collectData_collectData_charsetDivObj = " + typeof(window["iPanelCharsetDiv"]));
			if (typeof(window["iPanelCharsetDiv"]) == "undefined"){
				//创建一个DIV
				var divObj = document.createElement("div");
				divObj.style.position = "absolute";
				divObj.style.width = "1px";
				divObj.style.height = "1px";
				divObj.style.left = "0px";
				divObj.style.top = "0px";
				divObj.id = "iPanelCharsetDiv";
				window["iPanelCharsetDiv"] = divObj;
			}
			window["iPanelCharsetDiv"].innerHTML = "";

			iPanel.debug("collectData_collectData__before_serviceID = " + __serviceID + "__flag = " + flag + "__val = " + __val);
			for (var i = 0; i < __val.length; i++){
				if (typeof __val[i] == "string"){
					//将字符串转成unicode数组
					var tmpVal = [];
					for (var j = 0; j < __val[i].length ; j++){
						tmpVal.push(__val[i].charCodeAt(j));
					}
					__val[i] = tmpVal;
				}
			}
			
			//特殊处理一下
			ipanel_set_charset();
			
			for (var i = 0; i < __val.length; i++){
				if (typeof __val[i] == "object" && typeof __val[i].length != "undefined" && __val[i].length > 0){
					//这里表示字符串经过了charCodeAt的处理后的生成的数组,这里进行复原处理
					var tmpStr = "";
					for (var j = 0; j < __val[i].length; j++){
						tmpStr += String.fromCharCode(parseInt((__val[i])[j]));
					}
					iPanel.debug("collect_collectData_collectData_tmpStr = " + tmpStr);
					__val[i] = tmpStr;
				}
			}

			var flag = Collect.put(__serviceID,__key,__val);
			iPanel.debug("collectData_collectData__after_serviceID = " + __serviceID + "__flag = " + flag + "__val = " + __val);
		}
		else{
			iPanel.debug("error! no Collect object!");
		}
	}
}

function ipanel_set_charset() {
    //特殊处理一下
	var collectWidget = iPanel.pageWidgets.getByName("collectWidget");
	if(typeof(collectWidget) != "undefined" && collectWidget != null){
		var charsetDivObj = collectWidget.document.getElementById("iPanelCharsetDiv");
		iPanel.debug("collectData_ipanel_set_charset_charsetDivObj = " + charsetDivObj);
		if (!charsetDivObj){
			//创建一个DIV
			var divObj = collectWidget.document.createElement("div");
			divObj.style.position = "absolute";
			divObj.style.width = "1px";
			divObj.style.height = "1px";
			divObj.style.left = "0px";
			divObj.style.top = "0px";
			divObj.id = "iPanelCharsetDiv";
			collectWidget.document.body.appendChild(divObj);
		}
		collectWidget.document.getElementById("iPanelCharsetDiv").innerHTML = " ";
	}
	else{
		iPanel.debug("collectData_ipanel_set_charset_collectWidget = null!!!!!");
	}
}