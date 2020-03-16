var reportData = (function(){
	/*
	 * param: 具体定义见文档 "年华专区数据采集规范" 的描述
	 *  {
	 *    pageID: x,
	 *    columnID: x,
	 *    columnName: x,
	 *    pageNum: x,
	 *    serviceNum: x,
	 *    serviceEntrance: x,
	 *    PaymentMethod: x,
	 *    Codeerror: x,
	 *    Payerror: x,
	 * }
	 */
	function report(obj){
		if(obj == null || typeof obj != 'object'){
			return false;
		}
		var valueList = [];

		for(var i = 0, len = keys.length; i < len; i += 1){
			var key = keys[i];
			var prop = keyMap[key];
			var val = obj[prop];
			valueList.push(val);
		}

		debug('report valueList: ' + valueList.join(','));

		if(typeof collectData == 'function'){
			collectData('0142', keys, valueList);
		} else if(typeof Collect != 'undefined' && typeof Collect.put == 'function'){
			var ret = Collect.put('0142', keys, valueList);
			debug('Collect ret: ' + ret);
		}

		if(typeof sendReport == 'function'){
			var smartCardId = '';
			try{
				smartCardId = getCAId();
			}catch(e){
				debug('get smart_card_id error: ' + e.message);
			}
			sendReport('pv', {
				smart_card_id: smartCardId,
				page_id: obj.pageID,
				column_id: obj.columnID,
				column_name: obj.columnName,
				pv_page_number: obj.pageNum,
				pv_page_object_count: obj.serviceNum,
				cm_action: obj.serviceEntrance,
				pay_via: obj.PaymentMethod,
				general_error_code: obj.Codeerror,
				pay_error_code: obj.Payerror
			});
		}

		return true;
	}

	function debug(str){
		if(typeof iPanel != 'undefined' && typeof iPanel.debug == 'function'){
			iPanel.debug(str);
		} else if(typeof console != 'undefined' && typeof console.log == 'function'){
			//console.log(str);
		}
	}

	var keyMap = {
		'P': 'pageID',
		'C': 'columnID',
		'CN': 'columnName',
		'PN': 'pageNum',
		'SN': 'serviceNum',
		'SE': 'serviceEntrance',
		'PM': 'PaymentMethod',
		'CE': 'Codeerror',
		'PE': 'Payerror'
	};

	var keys = ['P', 'C', 'CN', 'PN', 'SN', 'SE', 'PM', 'CE', 'PE'];

	function getCAId() {
		var tmpVal;
		if (typeof GHWEBAPI != 'undefined') {
			tmpVal = GHWEBAPI.GetParam("CardID").ParamValue;
		}else if(navigator.userAgent.indexOf("iPanel") != -1) {
			tmpVal = CA.card.serialNumber;
		}
		return tmpVal;
	}

	return report;
})();
