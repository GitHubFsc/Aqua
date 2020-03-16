;(function(_win){
	iDebug("collect.js--enter 2018-01-11 15:00--");
	/*资源文件请求参数 start*/
	//1、资源文件要求开机请求，如果请求失败，那么就隔10分钟再请求，一直反复；
	//2、在上报主服务器和备份服务器均失败后，需要触发资源文件的再次更新
	var resourceAjaxObj = {requestAbort:function(){}};
	var resourceIp = "http://172.16.206.151";
	//var resourceIp = "http://172.16.206.250";
	var resourcePort = "13160";
	var resourceTimer = 15000;							//资源文件请求15s超时
	var resourceFailTimer = 10*60*1000;					//资源文件请求失败后间隔多久再去请求一次【包括超时】
	var resourceFailTimeout = -1;
	/*资源文件请求参数 end*/

	/*资源文件数据 start*/
	var HMasterAddress = "";							//http主上报地址
	var HSlaveAddress = "";								//http备上报地址
	var UMasterAddress = "";							//UDP主上报地址
	var USlaveAddress = "";								//UDP备上报地址
	var Timestamp = 0;									//首轮上报的绝对时间点
	var Strategy = "";									//采集策略JSON文件地址
	/*资源文件数据 end*/

	/*配置文件请求参数 start*/
	/*var configIp = "http://192.168.104.3";*/
	var configIp = "http://172.16.206.151";
	//var configIp = "http://172.16.206.250";
	var configPort = "13160";
	var configAjaxObj = {requestAbort:function(){}};
	var configUrl = "";									//采集策略文件地址,从请求的资源文件中获取到
	var configTimer = 15000;							//配置文件15s请求超时
	var configFailTimer = 10*60*1000;					//配置文件请求失败后间隔多久再去请求一次【包括超时】
	var configFailTimeout = -1;
	/*配置文件请求参数 end*/

	/*配置文件数据 start*/
	var collectEnable = 0;								//是否采集，0不采集，1采集
	var confUpdateMode = 0;								//更新策略，0定时更新，1通知更新
	var confUpdatePeriod = 0;							//定时更新时间，单位秒
	var protocol = "";									//上报的协议
	var period = 0;										//上报周期，单位秒
	var actionMax = 0;									//缓存的最大的条数
	var keycodeInterval = 0;							//按键行为有效性间隔
	var tvInterval = 0;									//直播切台行为有效性间隔
	var resendNum = 0;									//数据上报错误的重传次数
	var sendArray = [];									//需要上报的业务场景
	var extralArray = [];								//立即上报的业务场景
	/*配置文件数据 end*/


	/*上报参数 start*/
	var sendTimer = 10000;								//上报超时时间设置
	var enableBakServer = false;						//是否启动了备份服务器，如启用则后面都向备份服务器上报
	var recordData = [];								//用于保存采集的数据
	var recordDataMax = 1000;							//最多容许存的条数，超过则不再采集
	var sendingCacheData = "";							//当前正在上报的缓存数据
	var configTimeout = -1;								//配置文件更新timeout
	var periodTimeout = -1;								//上报周期timeout
	var sendCacheAjaxObj = null;						//这里用于发送缓存的数据，发送有时间周期间隔，发送失败的还需要重传
	var sendCurrAjaxObj = [];							//这里因为要立即发送，所以可能同时会有多个ajax对象
	/*上报参数 end*/

	/*获取资源文件 start*/
	function getResource(__flag){
		var UID = getCAId(); //CA.card.serialNumber;
		var region = getNodeGroupId(); //VOD.server.nodeGroupId;
		var SW = getSTBsVersion(); //hardware.STB.sVersion;
		var HW = getSTBhVersion(); //hardware.STB.hVersion;

		if (region >= 0 && region <= 5119){
			region = "A";
		}
		else if (region >= 5120 && region <= 10239){
			region = "B";
		}
		else if (region >= 10240 && region <= 12031){
			region = "C";
		}
		else if (region >= 12032 && region <= 20479){
			region = "D";
		}
		else if (region >= 20480 && region <= 25599){
			region = "E";
		}
		else if (region >= 25600 && region <= 30719){
			region = "F";
		}
		else if (region >= 30720 && region <= 40959){
			region = "G";
		}
		else if (region >= 40960 && region <= 65535){
			region = "H";
		}
		var resourceUrl = resourceIp + ":" + resourcePort + "/collect/resource?UID=" + UID + "&Region=" +region+ "&SW=" + SW + "&HW=" + HW;//Region统一写成gehua
		iDebug("collect_getResource_resourceUrl = " + resourceUrl + "____flag = " + __flag);
		
		clearTimeout(resourceFailTimeout);
		resourceAjaxObj.requestAbort();
		resourceAjaxObj = new AJAX_OBJ(resourceUrl,getResourceSuccess,getResourceFail);
		resourceAjaxObj.userName = "resource";
		resourceAjaxObj.timeout = configTimer;
		resourceAjaxObj.requestData("true");
	}

	function getResourceSuccess(xmlResponse){
		var text = xmlResponse.responseText;
		iDebug("collect_getResourceSuccess_text = " + text);
		if (text.substr(0,1) == "{"){
			eval("var jsonData =" + text);
			HMasterAddress = jsonData.HMasterAddress;
			HSlaveAddress = jsonData.HSlaveAddress;
			UMasterAddress = jsonData.UMasterAddress;
			USlaveAddress = jsonData.USlaveAddress;
			Timestamp = jsonData.Timestamp;

			enableBakServer = false;//资源文件更新后，备份服务器失效
			cacheSending = "no";//资源文件更新后，可以重传数据

			if (configUrl == "" && jsonData.Strategy != ""){
				//第一次获取到策略文件地址，需要去请求策略文件
				configUrl = jsonData.Strategy;
				getConfig();
			}
			if (typeof jsonData.Time != "undefined"){
				calibrateTime(jsonData.Time);
			}
		}
		else{
			resourceFailTimeout = setTimeout("getResource(1)",resourceFailTimer);
		}
	}

	function getResourceFail(){
		iDebug("collect_getResourceFail");
		resourceFailTimeout = setTimeout("getResource(2)",resourceFailTimer);
	}
	/*获取资源文件 end*/


	/*获取策略文件 start*/
	function getConfig(){
		iDebug("collect_getConfig_configUrl = " + configUrl);
		configAjaxObj = new AJAX_OBJ(configUrl,getConfigSuccess,getConfigFail);
		configAjaxObj.timeout = configTimer;
		configAjaxObj.requestData("true");
	}

	function getConfigSuccess(xmlResponse){
		var text = xmlResponse.responseText;
		var currTime = getCurrTime(1);
		iDebug("collect_configUpdate_time = success " + text + "time=" + currTime);
		if (text.substr(0,1) == "{") {
			eval("var jsonData =" + text);
			collectEnable = parseInt(jsonData.enable);
			confUpdateMode = parseInt(jsonData.confUpdateMode);
			confUpdatePeriod = parseInt(jsonData.confUpdatePeriod);
			protocol = jsonData.protocol;
			if (protocol != "0"){//采集的协议不为http,则直接不再采集
				collectEnable = 0;
			}
			period = parseInt(jsonData.period);
			actionMax = parseInt(jsonData.actionMax);
			actionInterval = parseInt(jsonData.actionInterval);
			keycodeInterval = parseInt(jsonData.keycodeInterval);
			tvInterval = parseInt(jsonData.tvInterval);
			resendNum = parseInt(jsonData.resendNum);
			sendArray = jsonData.sendArray;
			extralArray = jsonData.extralArray;
			
			if (Collect){
				Collect.keycodeInterval = keycodeInterval;
				Collect.tvInterval = tvInterval;
			}
			else{
				iDebug("collect_getConfigSuccess_Collect error");
			}
			clearInterval(configTimeout);
			clearTimeout(periodTimeout);
			
			iDebug("collect_getConfigSuccess_collectEnable = " + collectEnable + "__confUpdateMode = " + confUpdateMode);
			if (confUpdateMode == 0){//定时更新
				configTimeout = setInterval("configUpdate(1)",confUpdatePeriod*1000);
			}
			
			if (collectEnable == 1){//检测采集发送周期
				var checkTime = period * 1000;
				if ((Timestamp - currTime) > 0){
					checkTime = Timestamp - currTime;
					if (checkTime > 10*60*1000){//偏移太久了，设置回period
						iDebug("collect_getConfigSuccess_checkTime = " + checkTime);
						checkTime = period * 1000;
					}
				}
				periodTimeout = setTimeout("checkPeriod()",checkTime);//首次偏移时间
			}

			/*新的配置更新了，还有老的数据没有到周期或者没有达到缓存的最大条数，先上传*/
			if (recordData.length > 0){
				sendCacheData();
				iDebug("collect_getConfigSuccess_sendCacheData");
			}
		}

		// zengk add adnvcae 重定向有问题，需要根据返回的策略文件URL再请求一次才能拿到真正的策略文件
		else if (text.substr(0,5) == "http:") {
			configUrl = text;
			getConfig();
		}
		else {
			iDebug("collect_getConfigSuccess_error");
			configFailTimeout = setTimeout("configUpdate(2)",configFailTimer);
		}
	}

	function getConfigFail(){
		var currTime = getCurrTime(2);
		iDebug("collect_configUpdate_time = failure "+currTime);
		configFailTimeout = setTimeout("configUpdate(3)",configFailTimer);
	}

	function configUpdate(__flag){//策略更新，__flag用于表示什么状况触发的配置更新
		iDebug("collect_configUpdate___flag = " + __flag);
		clearTimeout(configFailTimeout);
		if (configAjaxObj){
			configAjaxObj.requestAbort();
			var UID = getCAId();//CA.card.serialNumber;
			
			configUrl = configIp + ":" + configPort + "/collect/strategy?UID=" + UID; //+ "&Region=" + region + "&SW=" + SW + "&HW=" + HW;
			iDebug("collect_getConfig_configUrl = " + configUrl);
			configAjaxObj = new AJAX_OBJ(configUrl,getConfigSuccess,getConfigFail);
			configAjaxObj.timeout = configTimer;
			configAjaxObj.requestData("true");
			var currTime = getCurrTime(3);
			iDebug("collect_configUpdate_time = start "+currTime);
		}
		else{
			iDebug("collect_configUpdate_error");
		}
	}

	function checkPeriod(){//上报周期检测
		sendCacheData();
		iDebug("collect_checkPeriod_sendCacheData");
		periodTimeout = setTimeout("checkPeriod()",period*1000);
	}
	/*获取策略文件 end*/


	/*数据采集 入口 start*/
	//数据采集,Collect.put方法主要是给到采集数据用，提供给第三方【这里注意，注册的这个对象用到的变量和方法是这个页面的，所以该widget不能销毁】
	var CollectObject = function(){
		this.keycodeInterval = 0;
		this.tvInterval = 0;
		this.put = function(__ServiceID,__key,__val){
			iDebug("collect_put_collectEnable = " + collectEnable + "____ServiceID = " + __ServiceID);
			if (collectEnable == 1){//容许采集
				if (__key.length != __val.length || __ServiceID == "" || __ServiceID == null || typeof __ServiceID == "undefined"){//数据不匹配或者无数据
					return 0;
				}
				var flag = checkType(__ServiceID);
				iDebug("collect_put_recordData.length = " + recordData.length + "__flag = " + flag); 
				if (flag == 0){//数据不在采集策略中 丢弃不上报
					return 0; 
				}
				
				/*
				 * new Date()出来的时间有可能是NaN，这里做一下处理
				 */
				var currTime = getCurrTime(4);
				iDebug("collect_put_currTime = " + currTime + "__ currServerTime = " + currServerTime); 

				/**
				 * 如果当前时间比页面记录的服务器时间小了半个小时，这时候以页面记录的服务器时间为准
				 */
				if (currServerTime != 0 && (currServerTime - currTime) > 30*60*1000 ){
					currTime = currServerTime;
				}

				var UID = getCAId();//CA.card.serialNumber;

				iDebug("collect_put_UID = " + UID);
				if(typeof UID == "undefined" || UID == null || UID == ""){//卡号异常则丢弃不上报 2016-06-24
					return 0;
				}
				var regionId = getNodeGroupId();//VOD.server.nodeGroupId;
				var dataStr = "";
				if (__key.length == 0){
					dataStr = "<?><[" + __ServiceID + "," + currTime + "," + UID + "," +regionId+ "]>";
				}
				else{
					dataStr = "<?><[" + __ServiceID + "," + currTime + "," + UID + "," +regionId+ "]><|>";
				}
				for (var i = 0 ; i < __key.length; i++){
					if (typeof __val[i] == "undefined" || __val[i] == null){
						dataStr += "<(" + __key[i] + ",)>";	
					}
					else{
						dataStr += "<(" + __key[i] + "," + __val[i] + ")>";
					}
					if (i != __key.length - 1){
						dataStr += "<&>";
					}
				}
				dataStr = dataStr.replace("\n\r","").replace("<br>","").replace("\n","");
				dataStr += "\n";
				iDebug("collect_put_dataStr = " + dataStr);

				if (flag == 1){//加入缓存，等到采集策略条件满足则上报
					if (recordData.length >= recordDataMax){//已经超过了最大的长度的限制了，不再采集
						return 0;
					}
					recordData.push(dataStr); 
					if (recordData.length >= actionMax){
						sendCacheData();
						iDebug("collect_put_sendCacheData");
					}
				}
				else if (flag== 2){//立即上报
					sendCurrData(dataStr);
				}
				return 1;
			}
			else{
				recordData =[];//已经缓存的数据丢弃
				return 0;
			}
		};
		this.sendAll = function () { // 将所有缓存的数据全部一次性上报
			iDebug("collect_put_sendAll");
			if (recordData.length > 0){
				sendCacheData();
			}
		};
	}

	function checkType(__serviceType){
		for (var i = 0; i < extralArray.length; i++){//检测看下是否是立即上报的业务
			if (__serviceType == extralArray[i]){
				return 2;
			}
		}
		for (var i = 0; i < sendArray.length; i++){//检测是否是需要上报的业务
			if (__serviceType == sendArray[i]){
				return 1;
			}
		}
		return 0;
	}
	/*数据采集 入口 end*/

	/*缓存数据上报 start*/
	//主服务器上报
	var sendCacheDataNum = 0;
	var cacheSending = "no";		//是否正在发送,no表示无数据正在发送,main表示正在像主服务器上报,bak表示正在像备份服务器上报
	function sendCacheData(){
		iDebug("collect_sendCacheData_cacheSending = " + cacheSending,7);
		if (cacheSending != "no"){//有数据正在上报
			return;
		}
		iDebug("collect_sendCacheData_start_HMasterAddress = " + HMasterAddress + "_enableBakServer = " + enableBakServer);

		getSendData();
		iDebug("collect_sendCacheData_sendingCacheData = " + sendingCacheData);
		if (sendingCacheData == ""){
			var currTime = getCurrTime(5);
			iDebug("collect_sendCacheData_currTime = " + currTime + "__ currServerTime = " + currServerTime); 

			/**
			 * 如果当前时间比页面记录的服务器时间小了半个小时，这时候以页面记录的服务器时间为准
			 */
			if (currServerTime != 0 && (currServerTime - currTime) > 30*60*1000 ){
				currTime = currServerTime;
			}

			var UID = getCAId(); //CA.card.serialNumber;
			
			var regionId = getNodeGroupId();//VOD.server.nodeGroupId;
			sendingCacheData = "<?><[0701," + currTime + "," + UID + "," +regionId+ "]>\n";
		}

		if (HMasterAddress == "" || enableBakServer){
			sendCacheDataToBak();
			return;
		}
		sendCacheRequest();
	}

	function sendCacheRequest(){
		if (sendCacheAjaxObj){
			sendCacheAjaxObj.requestAbort();
		}
		sendCacheAjaxObj = new AJAX_OBJ(HMasterAddress,sendSuccess,sendFail);
		sendCacheAjaxObj.urlParameters = sendingCacheData;
		sendCacheAjaxObj.timeout = sendTimer;
		sendCacheAjaxObj.requestData("post");
		cacheSending = "main";
	}
	function getSendData(){
		sendingCacheData = "";
		sendCacheDataNum = 0;
		for (var i = 0; i < actionMax; i++){
			if (recordData.length > 0){
				sendingCacheData += recordData.splice(0,1)[0];
			}
			else{
				break;
			}
		}
	}
	function sendSuccess(xmlResponse){
		cacheSending = "no";
		var text = xmlResponse.responseText;
		iDebug("collect_sendSuccess_text = " + text);
		if (text.substr(0,1) == "{"){
			eval("var jsonData =" + text);
			var result = jsonData.result;
			var confUpdate = jsonData.confUpdate;
			if (typeof jsonData.Time != "undefined"){
				calibrateTime(jsonData.Time);
			}
			if (result != "0"){//请求失败了
				sendFail();
			}
			else if (result == "0"){
				sendCacheDataNum = 0;
				if (recordData.length >= actionMax){
					sendCacheData();
					iDebug("collect_sendSuccess_sendCacheData");
				}
			}

			if (confUpdate == "0"){//config需要更新
				configUpdate(4);
			}
		}
		else{
			sendFail();
		}
	}

	function sendFail(){
		cacheSending = "no";
		iDebug("collect_sendFail_sendCacheDataNum = " + sendCacheDataNum);
		sendCacheDataNum++;
		if (sendCacheDataNum >= resendNum){
			sendCacheDataNum = 0;
			sendCacheDataToBak();		//主服务器上报失败，上报备份服务器
		}
		else{
			iDebug("collect_sendFail_sendCacheRequest");
			sendCacheRequest();
			iDebug("collect_sendFail_sendCacheRequest_end");
		}
	}

	//缓存数据备份服务器上报
	function sendCacheDataToBak(){
		iDebug("collect_sendCacheDataToBak_cacheSending = " + cacheSending + "__enableBakServer = " + enableBakServer);
		if (cacheSending == "bak" && enableBakServer){//有备份服务器有数据正在上报
			return;
		}

		if (HSlaveAddress != ""){
			enableBakServer = true;	//开启备份服务器		
			sendCacheAjaxObj.requestAbort();
			sendCacheAjaxObj = new AJAX_OBJ(HSlaveAddress,sendToBakSuccess,sendToBakFail);
			sendCacheAjaxObj.urlParameters = sendingCacheData;
			sendCacheAjaxObj.timeout = sendTimer;
			sendCacheAjaxObj.requestData("post");
		}
		cacheSending = "bak";
	}

	function sendToBakSuccess(xmlResponse){
		cacheSending = "no";
		iDebug("collect_sendToBakSuccess");
		var text = xmlResponse.responseText;
		iDebug("collect_sendToBakSuccess_text = " + text);
		if (text.substr(0,1) == "{"){
			eval("var jsonData =" + text);
			var result = jsonData.result;
			var confUpdate = jsonData.confUpdate;
			if (typeof jsonData.Time != "undefined"){
				calibrateTime(jsonData.Time);
			}
			if (result != "0"){//请求失败了
				sendToBakFail();
			}
			else if (result == "0"){
				
				sendCacheDataNum = 0;
				if (recordData.length >= actionMax){
					sendCacheData();
					iDebug("collect_sendToBakSuccess_sendCacheData");
				}
			}
			if (confUpdate == "0"){//config需要更新
				configUpdate(4);
			}
		}
		else{
			sendToBakFail();
		}
	}

	function sendToBakFail(){//上报备份服务器失败，则重新请求策略文件
		cacheSending = "no";

		iDebug("collect_sendToBakFail_sendCacheDataNum = " + sendCacheDataNum);
		sendCacheDataNum++;
		if (sendCacheDataNum >= resendNum){
			sendCacheDataNum = 0;
			getResource(3);					//更新资源文件
			enableBakServer = false;		//备份服务器失效了，改回主服务器
		}
		else{
			if (sendCacheAjaxObj){
				sendCacheAjaxObj.requestAbort();
			}
			sendCacheAjaxObj = new AJAX_OBJ(HSlaveAddress,sendToBakSuccess,sendToBakFail);
			sendCacheAjaxObj.urlParameters = sendingCacheData;
			sendCacheAjaxObj.timeout = sendTimer;
			sendCacheAjaxObj.requestData("post");
		}
	}
	/*缓存数据上报 end*/


	/*立即上报数据 start*/
	//主服务器上报
	var sendCurrDataNum = [];
	function sendCurrData(__dataStr){
		iDebug("collect_sendCurrData_start_HMasterAddress = " + HMasterAddress + "enableBakServer = " + enableBakServer + "__sendCurrAjaxObj.length = " +sendCurrAjaxObj.length);
		var currAjax = null;
		var i = 0;
		for (i = 0; i < sendCurrAjaxObj.length; i ++){
			iDebug("collect_sendCurrData_i = " + i + "__status = " + sendCurrAjaxObj[i].xmlHttp.readyState);
			if (sendCurrAjaxObj[i].xmlHttp.readyState == 0 || sendCurrAjaxObj[i].xmlHttp.readyState == 4){
				currAjax = sendCurrAjaxObj[i];
				currAjax.requestAbort();
				currAjax = new AJAX_OBJ(HMasterAddress,sendCurrSuccess,sendCurrFail);
				sendCurrAjaxObj[i] = currAjax;//这里要重新赋值一下，将之前的xml对象冲掉，否则的话再取这个数组中的这个元素还是老的xml对象
				break;
			}
		}
		if (currAjax == null){
			currAjax = new AJAX_OBJ(HMasterAddress,sendCurrSuccess,sendCurrFail);
			sendCurrAjaxObj.push(currAjax);
		}
		sendCurrDataNum[i] = 0;
		if (HMasterAddress == "" || enableBakServer){
			sendCurrDataToBak(i,__dataStr);
			return;
		}
		currAjax.callbackParams = [i,__dataStr];
		currAjax.urlParameters = __dataStr;
		currAjax.timeout = sendTimer;
		currAjax.requestData("post");
	}

	function sendCurrSuccess(xmlResponse,__str){
		iDebug("collect_sendCurrSuccess___str = " + __str[0] + "__" + __str[1]);
		var text = xmlResponse.responseText;
		iDebug("collect_sendCurrSuccess_text = " + text);
		if (text.substr(0,1) == "{"){
			eval("var jsonData =" + text);
			var result = jsonData.result;
			var confUpdate = jsonData.confUpdate;
			if (typeof jsonData.Time != "undefined"){
				calibrateTime(jsonData.Time);
			}
			if (result != "0"){//请求失败了
				sendCurrFail("",__str);
			}
			else if (result == "0"){
				sendCurrDataNum[__str[0]] = 0;
			}
			if (confUpdate == "0"){//config需要更新
				configUpdate(4);
			}
		}
		else{
			sendCurrFail("",__str);
		}
	}

	function sendCurrFail(xmlResponse,__str){
		iDebug("collect_sendCurrFail__str = " + __str[0] + "__" + __str[1]);
		var __num = __str[0];
		sendCurrDataNum[__num]++;
		iDebug("collect_sendCurrFail__num = " + __num + "__" + sendCurrDataNum[__num]);
		if (sendCurrDataNum[__num] >= resendNum){
			sendCurrDataNum[__num] = 0;
			sendCurrDataToBak(__num,__str[1]);		//主服务器上报失败，上报备份服务器
		}
		else{
			var currAjax = sendCurrAjaxObj[__num];
			currAjax.requestAbort();
			currAjax = new AJAX_OBJ(HMasterAddress,sendCurrSuccess,sendCurrFail);
			sendCurrAjaxObj[__num] = currAjax;//这里要重新赋值一下，将之前的xml对象冲掉，否则的话再取这个数组中的这个元素还是老的xml对象
			currAjax.callbackParams = __str;
			currAjax.urlParameters = __str[1];
			currAjax.timeout = sendTimer;
			currAjax.requestData("post");
		}
	}

	//立即上报数据备份服务器上报
	function sendCurrDataToBak(__num,__dataStr){
		iDebug("collect_sendCurrDataToBak___num = " + __num + "____dataStr = " + __dataStr)
		if (HSlaveAddress != ""){
			enableBakServer = true;	//开启备份服务器
			var currAjax = sendCurrAjaxObj[__num];
			currAjax.requestAbort();
			currAjax = new AJAX_OBJ(HSlaveAddress,sendCurrToBackSuccess,sendCurrToBackFail);
			sendCurrAjaxObj[__num] = currAjax;//这里要重新赋值一下，将之前的xml对象冲掉，否则的话再取这个数组中的这个元素还是老的xml对象
			currAjax.callbackParams = [__num,__dataStr];
			currAjax.urlParameters = __dataStr;
			currAjax.timeout = sendTimer;
			currAjax.requestData("post");
		}
	}

	function sendCurrToBackSuccess(xmlResponse,__str){
		iDebug("collect_sendCurrToBackSuccess");
		var text = xmlResponse.responseText;
		iDebug("collect_sendCurrToBackSuccess_text = " + text);
		if (text.substr(0,1) == "{"){
			eval("var jsonData =" + text);
			var result = jsonData.result;
			var confUpdate = jsonData.confUpdate;
			if (typeof jsonData.Time != "undefined"){
				calibrateTime(jsonData.Time);
			}
			if (result == "0"){
				sendCurrDataNum[__str[0]] = 0;
			}
			else{
				sendCurrToBackFail("",__str)
			}
			if (confUpdate == "0"){//config需要更新
				configUpdate(4);
			}
		}
	}

	function sendCurrToBackFail(xmlResponse,__str){
		iDebug("collect_sendCurrToBackFail___str = " + __str);
		var __num = __str[0];
		iDebug("collect_sendCurrToBackFail___num = " + sendCurrDataNum[__num]);
		sendCurrDataNum[__num]++;
		if (sendCurrDataNum[__num] < resendNum){
			var currAjax = sendCurrAjaxObj[__num];
			currAjax.requestAbort();
			currAjax = new AJAX_OBJ(HSlaveAddress,sendCurrToBackSuccess,sendCurrToBackFail);
			sendCurrAjaxObj[__num] = currAjax;//这里要重新赋值一下，将之前的xml对象冲掉，否则的话再取这个数组中的这个元素还是老的xml对象
			currAjax.callbackParams = __str;
			currAjax.urlParameters = __str[1];
			currAjax.timeout = sendTimer;
			currAjax.requestData("post");
		}
		else{//备份服务器上报失败了，恢复主服务器吧。。。
			enableBakServer = false;		//备份服务器失效了，改回主服务器
		}
	}
	/*立即上报数据 end*/

	function AJAX_OBJ(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
		/**
		 * AJAX通过GET或POST的方式进行异步或同步请求数据
		 * 注意：
		 * 	1、服务器240 No Content是被HTTP标准视为请求成功的
		 * 	2、要使用responseXML就不能设置_charset，需要直接传入null
		 * 	3、_frame，就是实例化本对象的页面对象，请尽量保证准确，避免出现难以解释的异常
		 */
		/**
		 * @param{string} _url: 请求路径
		 * @param{function} _successCallback: 请求成功后执行的回调函数，带一个参数（可扩展一个）：new XMLHttpRequest()的返回值
		 * @param{function} _failureCallback: 请求失败/超时后执行的回调函数，参数同成功回调，常用.status，.statusText
		 * @param{string} _urlParameters: 请求路径所需要传递的url参数/数据
		 * @param{*} _callbackParams: 请求结束时在回调函数中传入的参数，自定义内容
		 * @param{boolean} _async: 是否异步调用，默认为true：异步，false：同步
		 * @param{string} _charset: 请求返回的数据的编码格式，部分iPanel浏览器和IE6不支持，需要返回XML对象时不能使用
		 * @param{number} _timeout: 每次发出请求后多长时间内没有成功返回数据视为请求失败而结束请求（超时）
		 * @param{number} _frequency: 请求失败后隔多长时间重新请求一次
		 * @param{number} _requestTimes: 请求失败后重新请求多少次
		 * @param{object} _frame: 窗体对象，需要严格控制，否则会有可能出现页面已经被销毁，回调还执行的情况
		 */
		this.url = _url || "";
		this.successCallback = _successCallback || function(_xmlHttp, _params) {
			iDebug("[xmlHttp] responseText: " + _xmlHttp.responseText);
		};
		this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
			iDebug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
		};
		this.urlParameters = _urlParameters || "";
		this.callbackParams = _callbackParams || null;
		this.async = typeof(_async) == "undefined" ? true : _async;
		this.charset = _charset || null;
		this.timeout = _timeout || 30000; //30s
		this.frequency = _frequency || 10000; //10s
		this.requestTimes = _requestTimes || 0;
		this.frame = _frame || window;

		this.timer = -1;
		this.counter = 0;

		this.method = "GET";
		this.headers = null;
		this.username = "";
		this.password = "";

		this.userName = "";				//加一个参数，表示哪个地方用到该xmlHttp对象
		this.failFlag = false;			//加一个失败的标识，如果该xml已经执行过失败了，第二次则不再进行[超时处理时，当超时时readyState=1 时，abort ajax请求后立即发出来一个readyState=4, status=0 这种状态，导致失败又被执行一次]

		this.createXmlHttpRequest = function() {
			var xmlHttp = null;
			try { //Standard
				xmlHttp = new XMLHttpRequest();
			} catch (exception) { //Internet Explorer
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (exception) {
					try {
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (exception) {
						return false;
					}
				}
			}
			return xmlHttp;
		};

		/*this.getInstance = function(){
			for (var i = 0; i < objPool.length; i ++){
				iDebug("collect_getInstance_objPool["+i+"].readyState = " + objPool[i].readyState);
				if (objPool[i].readyState == 0 || objPool[i].readyState == 4){
					return objPool[i];
				}
			}
			objPool[objPool.length] = this.createXmlHttpRequest();
			return objPool[objPool.length - 1];
		};*/

		this.xmlHttp = this.createXmlHttpRequest();

		this.requestData = function(_method, _headers, _username, _password) {
			/**
			 * @param{string} _method: 传递数据的方式，POST/GET
			 * @param{string} _headers: 传递数据的头信息，json格式
			 * @param{string} _username: 服务器需要认证时的用户名
			 * @param{string} _password: 服务器需要认证时的用户密码
			 */
			this.frame.clearTimeout(this.timer);
			this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
			this.headers = typeof(_headers) == "undefined" ? null : _headers;
			this.username = typeof(_username) == "undefined" ? "" : _username;
			this.password = typeof(_password) == "undefined" ? "" : _password;

			var target = this;
			this.xmlHttp.onreadystatechange = function() {
				target.stateChanged();
			};
			if (this.method == "POST") { //encodeURIComponent
				var url = encodeURI(this.url);
				var data = this.urlParameters;
			} else {
				var url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
				var data = null;
			}
			if (this.username != "") {
				this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
			} else {
				this.xmlHttp.open(this.method, url, this.async);
			}
			/*var contentType = false;
			if (this.headers != null) {
				for (var key in this.headers) {
					if (key.toLowerCase() == "content-type") {
						contentType = true;
					}
					this.xmlHttp.setRequestHeader(key, this.headers[key]);
				}
			}
			if (!contentType) {
				this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			}
			if (this.charset != null) { //要使用responseXML就不能设置此属性
				this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
			}*/
			if(navigator.userAgent.indexOf("advanced") == -1){//3.0的需要设置为gbk编码，advanced默认为utf-8
				this.xmlHttp.setRequestHeader("Content-Type", "text/html; charset=gbk");
			}
			iDebug("[xmlHttp] " + this.method + " url: " + url + ", data: " + data);
			this.xmlHttp.send(data);
			
			//超时处理
			this.timer = this.frame.setTimeout(function() {
				target.checkStatus();
			}, this.timeout);
		};
		this.stateChanged = function() { //状态处理
			if (this.xmlHttp.readyState < 2) {
				iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
			} else {
				iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
			}

			var target = this;
			/*if (this.xmlHttp.readyState == 2) {
				this.timer = this.frame.setTimeout(function() {
					target.checkStatus();
				}, this.timeout);
			} else if (this.xmlHttp.readyState == 3) {
				if (this.xmlHttp.status == 401) {
					iDebug("[xmlHttp] Authentication, need correct username and pasword");
				}
			} else if (this.xmlHttp.readyState == 4) {
				this.frame.clearTimeout(this.timer);
				if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
					this.success();
				} else {
					this.failed();
				}
			}*/
			if (this.xmlHttp.readyState == 4) {
				this.frame.clearTimeout(this.timer);
				if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
					this.success();
				} else {
					iDebug("[xmlHttp] readyState_failFlag new = " + this.failFlag);
					if (!this.failFlag){
						this.failed();
						this.failFlag = true;
					}
				}
			}
		};
		this.success = function() {
			iDebug("[xmlHttp] this.xmlHttp.responseText = " + this.xmlHttp.responseText);
			if (this.callbackParams == null) {
				this.successCallback(this.xmlHttp);
			} else {
				this.successCallback(this.xmlHttp, this.callbackParams);
			}
			this.counter = 0;
		};
		this.failed = function() {
			if (this.callbackParams == null) {
				this.failureCallback(this.xmlHttp);
			} else {
				this.failureCallback(this.xmlHttp, this.callbackParams);
			}
			this.counter = 0;
		};
		this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
			if (this.xmlHttp.readyState != 4) {
				if (this.counter < this.requestTimes) {
					this.requestAgain();
					iDebug("[xmlHttp] requestAgain");
				} else {
					this.requestAbort();
					iDebug("[xmlHttp] readyState=" + this.xmlHttp.readyState + " timeout_new_this.failFlag = " + this.failFlag);
					if (!this.failFlag){
						this.failed();
						this.failFlag = true;
					}
				}
			}
		};
		this.requestAgain = function() {
			this.requestAbort();
			var target = this;
			this.frame.clearTimeout(this.timer);
			this.timer = this.frame.setTimeout(function() {
				iDebug("[xmlHttp] request again");
				target.counter++;
				target.requestData(target.method, target.headers, target.username, target.password);
			}, this.frequency);
		};
		this.requestAbort = function() {
			iDebug("[xmlHttp] call abort");
			this.frame.clearTimeout(this.timer);
			this.xmlHttp.abort();
		};
		this.addParameter = function(_json) {
			/**
			 * @param{object} _json: 传递的参数数据处理，只支持json格式
			 */
			var url = this.url;
			var str = this.urlParameters;
			for (var key in _json) {
				if (url.indexOf("?") != -1) {
					url = "";
					if (str == "") {
						str = "&" + key + "=" + _json[key];
					} else {
						str += "&" + key + "=" + _json[key];
					}
					continue;
				}
				if (str == "") {
					str += "?";
				} else {
					str += "&";
				}
				str += key + "=" + _json[key];
			}
			this.urlParameters = str;
			return str;
		};
		this.getResponseXML = function() { //reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
			if (this.xmlHttp.responseXML != null) {
				return this.xmlHttp.responseXML;
			} else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
				return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
			}
			return null;
		};
	}

	function iDebug(_str) {
		if (navigator.appName.indexOf("iPanel") != -1) {
			iDebug(_str);
		} else {
			//console.log(_str);
		}
	}
	
	//获取ca卡号
	function getCAId() {
		var tmpVal;
		if (typeof(GHWEBAPI) != 'undefined') {
			tmpVal = GHWEBAPI.GetParam("CardID").ParamValue;
		} else if (navigator.appName.indexOf("iPanel") != -1) {
			tmpVal = CA.card.serialNumber;
		} else {
			tmpVal = "123456789";
		}
		iDebug("collect.js getCAId tmpVal=" + tmpVal);
		return tmpVal;
	}

	//获取区域ID
	function getNodeGroupId() {
		var tmpVal;
		if (typeof(GHWEBAPI) != 'undefined') {
			tmpVal = GHWEBAPI.GetParam("ServiceGroupID").ParamValue;
		} else if (navigator.appName.indexOf("iPanel") != -1) {
			tmpVal = VOD.server.nodeGroupId;
		} else {
			tmpVal = "1111";
		}
		iDebug("[app][ngb] getNodeGroupId tmpVal=" + tmpVal);
		return tmpVal;
	}
	
	// 获取软件版本号
	function getSTBsVersion(_id) {
		var tmpVal = "";
		if (typeof(GHWEBAPI) != 'undefined') {
			tmpVal = GHWEBAPI.GetParam("STBsVersion").ParamValue;
		} else if (navigator.appName.indexOf("iPanel") != -1) {
			tmpVal = hardware.STB.sVersion;
		} else {

		}
		iDebug("collect.js getSTBhVersion tmpVal=" + tmpVal);
		return tmpVal;
	}

	// 获取硬件版本号
	function getSTBhVersion(_id) {
		var tmpVal = "";
		if (typeof(GHWEBAPI) != 'undefined') {
			tmpVal = GHWEBAPI.GetParam("STBhVersion").ParamValue;
		} else if (navigator.appName.indexOf("iPanel") != -1) {
			tmpVal = hardware.STB.hVersion;
		} else {

		}
		iDebug("collect.js getSTBhVersion tmpVal=" + tmpVal);
		return tmpVal;
	}
	
	/**
	 * 获取当前时间
	 * 根据收视率数据上报结果来看，时间有可能是NaN，这里做判断
	 */
	function getCurrTime(__flag){
		var currTime = (new Date()).getTime();
		iDebug("collect_getCurrTime___flag = " + __flag + "__currTime = " + currTime);

		if (isNaN(currTime)){
			if (currServerTime != 0){
				currTime = currServerTime;
			}
			else {
				currTime = 0;
			}
		}
		else{
			currTime = Math.floor(currTime);
		}	
		return currTime;	
	}
			
	/**
	 * 上报数据发现其上报的时间点不对，有时候是1970年，有时候不是当天的时间，这里做一下兼容处理
	 * 上报时间兼容处理 start
	 */
	var currServerTime = 0;				//开机起来获取到资源配置文件的时候会返回一个服务器时间，同时上报也会返回 服务器时间，收到后就就行校正
	var serverTimeout = -1;
	/**
	 * 校正页面记录的时间
	 */
	function calibrateTime(__time){
		iDebug("collect_calibrateTime___time = " + __time + "__currServerTime = " + currServerTime);
		clearTimeout(serverTimeout);

		if (typeof __time != "undefined"){
			currServerTime = parseInt(__time,10);
		}
		else{
			currServerTime += 1000;
		}

		serverTimeout = setTimeout("calibrateTime()",1000);
	}


	var collectObj = new CollectObject();
	getResource();

	_win.Collect = collectObj;

})(window)
