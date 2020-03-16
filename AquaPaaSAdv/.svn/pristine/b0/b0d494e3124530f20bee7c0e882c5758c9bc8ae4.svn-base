var viewDistributeState = (function($) {

	function preZero(num, len){
		var str = num.toString();
		while(str.length < len){
			str = '0' + str;
		}
		return str;
	}

	function fromDateToString(obj, needtime){
		var year = obj.getFullYear();
		var month = obj.getMonth();
		var date = obj.getDate();

		var str = '';
		str += year;
		str += '-';
		str += preZero(month+1,2);
		str += '-';
		str += preZero(date,2);

		if(needtime){
			var hours = obj.getHours();
			var mins = obj.getMinutes();
			var secs = obj.getSeconds();
			str += ' ';
			str += preZero(hours,2);
			str += ':';
			str += preZero(mins,2);
			str += ':';
			str += preZero(secs,2);
		}

		return str;
	};

	function fromStringToDate(str){
		var ret = /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/.exec(str);
		return new Date(Number(ret[1]), Number(ret[2])-1, Number(ret[3]), Number(ret[4]), Number(ret[5]), Number(ret[6]));
	}

	function viewDistribute(parent, type, obj) {
		/*
		 * type
		 * adposition: 广告位,
		 * aditem: 素材,
		 * adgroup: 素材组，
		 * adpolicy: 策略
		 */
		var dmRoot = paasHost + paasDomain + '/dm';

		var dmObjectType = '';
		var dmObjectId = '';
		switch(type){
		case 'adposition':
			dmObjectType = 'adv_placement';
			dmObjectId = obj.ext_id;
			break;
		case 'aditem':
			dmObjectType = 'adv_material';
			dmObjectId = obj.id;
			break;
		case 'adgroup':
			dmObjectType = 'adv_material_group';
			dmObjectId = obj.id;
			break;
		case 'adpolicy':
			dmObjectType = 'adv_policy';
			dmObjectId = obj.id;
			break;
		}

		var dmStateList = [];
		var dmSites = {};

		var stateList = new StyledList({
			rows: 11,
			columns: 6,
			containerId: 'compSitesList',
			async: true,
			titles: [{
				label: i18n('ADPOS_CNECT_SITE_ID')
			}, {
				label: i18n('ADPOS_CNECT_SITE_NAME')
			}, {
				label: i18n('ADPOS_SITE_STATE')
			}, {
				label: i18n('ADPOS_SITE_RECENTTIME')
			}, {
				label: i18n('ADPOS_SITE_RECENTSTATE')
			}, {
				label: i18n('ADPOS_LIST_TITLE_OPR')
			}],
			listType: 0,
			data: [],
			styles: {
				borderColor: 'transparent',
				borderWidth: 1,
				titleHeight: 46,
				titleBg: 'rgb(93,161,192)',
				titleColor: 'white',
				cellBg: 'white',
				evenBg: 'rgb(245,245,245)',
				cellColor: 'rgb(114,114,114)',
				footBg: 'white',
				footColor: 'rgb(121,121,121)',
				iconColor: 'rgb(93,161,192)',
				inputBorder: '1px solid rgb(203,203,203)',
				inputBg: 'white',
				columnsWidth: [0.09, 0.2, 0.15, 0.22, 0.13]//114,254,182,271,165
			}
		});

		function getListData(pageNumber, gotData) {
			var url = dmRoot + '/object_status/adv/' + dmObjectType + '/' + dmObjectId;
			$.ajax({
				url: url,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).done(function(data) {
				dmStateList = data;
				stateList.updateInPage(formListData(dmStateList));
			});
		}

		function formListData(data) {
			data = $.makeArray(data);
			var listdata = [];
			for (var i = 0, len = data.length; i < len; i += 1) {
				var item = data[i];
				var oprHist = '<span name="history" class="adSite_operation" data-index="' + i + '">' + i18n('OPS_SITE_HISTORY') + '</span>';
				var oprMnul = '<span name="manual" class="adSite_operation" data-index="' + i + '">' + i18n('OPS_SITE_MANUAL') + '</span>';
				var siteId = item.siteId;
				var site = dmSites[siteId];
				var siteName = site && site.name || '';
				var adv = null, dm = null;
				site && site.endpoints && site.endpoints.forEach(function(endpoint) {
					if (endpoint.app_type == 'adv') {
						adv = endpoint;
					} else if (endpoint.app_type == 'dm') {
						dm = endpoint;
					}
				});
				var mlabel = '';
				mlabel += '<div class="' + (adv && adv.available ? 'site-admin-avail' : 'site-admin-unavail') + '">' + i18n('SITE_ADMIN_SITE_ADV') + '</div>';
				mlabel += '<div class="' + (dm && dm.available ? 'site-admin-avail' : 'site-admin-unavail') + '">' + i18n('SITE_ADMIN_SITE_DM') + '</div>';
				var listitem = [{
					label: siteId
				}, {
					label: siteName
				}, {
					label: mlabel
				}, {
					label: item.lastDistributeTime != null ? fromDateToString(new Date(item.lastDistributeTime), true) : ''
				}, {
					label: i18n('ADV_DM_STATE_STATUS_' + item.distributeStatus)
				}, {
					label: oprHist + oprMnul
				}];
				listdata.push(listitem);
			}
			return listdata;
		}

		function getDMSites(){
			var url = dmRoot + '/site';
			$.ajax({
				url: url,
				type: 'GET',
				async: false,
			}).done(function(data){
				for(var i = 0, len = data.length; i < len; i+=1){
					dmSites[data[i].id] = data[i];
				}
			});
		}

		function manualDistribute(targetId){
			var url = dmRoot + '/object/adv/' + dmObjectType + '/' + dmObjectId;
			url += '?site_id=' + obj.site_id + '&manual=true';
			$.ajax({
				type: 'PUT',
				url: url,
				headers: {
					'Content-Type': 'application/json',
				},
				data: dmObjectType == 'adv_placement' ? JSON.stringify({site: [targetId]}) : JSON.stringify({}),
			}).done(function(){
				alert(i18n('ADV_MANUAL_DISTROK'));
			}).fail(function(xhr){
				if(xhr.status == 204){
					alert(i18n('ADV_MANUAL_DISTROK'));
				} else {
					alert(i18n('ADV_MANUAL_DISTRFAIL'));
				}
			});
		}

		var $parent = $(parent);
		$parent.show();
		$.get('content/utils/comp_distribute.html', function(data) {
			$parent.append(patchHTML(data));
			$('#compSitesBack').on('click', function() {
				$parent.empty().hide();
			});
			$('#compSitesTitle').append(obj.name + i18n('ADPOS_OPERATION_DIST'));
			$('#compSitesList').on('click', '.adSite_operation', function() {
				var $opr = $(this);
				var index = $opr.attr('data-index');
				var opr = $opr.attr('name');
				switch(opr) {
				case 'history':
					viewDistributeHistory('#compSiteHistory', type, obj, dmSites[dmStateList[index].siteId], dmSites);
					break;
				case 'manual':
					manualDistribute(dmStateList[index].siteId);
					break;
				}
			});
			getDMSites();
			stateList.create();
			getListData();
		});
	}

	return viewDistribute;
})(jQuery);

/*
 * type
 * adposition: 广告位,
 * aditem: 素材,
 * adgroup: 素材组，
 * adpolicy: 策略
 * adsite: 站点
 */
var viewDistributeHistory = (function($) {
	function viewDistry(parent, type, obj, site, dmSites) {
		var $parent = $(parent);
		$parent.show();
		$.get('content/utils/site_history.html', function(data) {
			$parent.append(patchHTML(data));
			$('#compSiteHstBack').on('click', function() {
				$parent.empty().hide();
			});
			switch(type) {
			case 'adsite':
				getAdSiteDistry(obj);
				break;
			default:
				getDefaultDistry(type, obj, site, dmSites);
				break;
			}
		});
	}

	function getDefaultDistry(type, obj, site, dmSites) {
		var dmObjectType = '';
		var dmObjectId = '';
		switch(type){
		case 'adposition':
			dmObjectType = 'adv_placement';
			dmObjectId = obj.ext_id;
			break;
		case 'aditem':
			dmObjectType = 'adv_material';
			dmObjectId = obj.id;
			break;
		case 'adgroup':
			dmObjectType = 'adv_material_group';
			dmObjectId = obj.id;
			break;
		case 'adpolicy':
			dmObjectType = 'adv_policy';
			dmObjectId = obj.id;
			break;
		}

		$('#compSiteHstTitle').text(obj.name + (site && site.name || '') + i18n('OPS_SITE_HISTORY'));
		var listOption = {
			rows: 11,
			columns: 5,
			containerId: 'compSiteHstList',
			async: true,
			titles: [{
				label: i18n('ADPOS_CNECT_SITE_ID')
			}, {
				label: i18n('ADPOS_CNECT_SITE_NAME')
			}, {
				label: i18n('ADSITE_DISTRICREATE_TIME')
			}, {
				label: i18n('ADSITE_DISTRIEND_TIME')
			}, {
				label: i18n('ADPOS_OPERATION_DIST')
			}],
			listType: 1,
			data: [],
			styles: {
				borderColor: 'transparent',
				borderWidth: 1,
				titleHeight: 46,
				titleBg: 'rgb(93,161,192)',
				titleColor: 'white',
				cellBg: 'white',
				evenBg: 'rgb(245,245,245)',
				cellColor: 'rgb(114,114,114)',
				footBg: 'white',
				footColor: 'rgb(121,121,121)',
				iconColor: 'rgb(93,161,192)',
				inputBorder: '1px solid rgb(203,203,203)',
				inputBg: 'white',
				columnsWidth: [0.09, 0.2, 0.27, 0.27]//114,254,329,329
			}
		};

		function formListData(data) {
			data = $.makeArray(data);
			var listdata = data.map(function(item, i) {
				var site = dmSites[item.site_id];
				return [{
					label: item.site_id
				}, {
					label: site && site.name || ''
				}, {
					label: convertTimeString(item.create_time)
				}, {
					label: convertTimeString(item.complete_time)
				}, {
					label: i18n('SITE_ADMIN_TASK_' + item.status) || ''
				}];
			});
			return listdata;
		}

		var distriList = new StyledList(listOption);
		distriList.getPageData = function(pageNumber, gotData) {
			var url = paasHost + paasDomain + '/dm';
			url += '/task/adv/' + dmObjectType + '/' + dmObjectId;
			$.ajax({
				url: url + '?page=' + (pageNumber - 1) + '&size=11',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).done(function(data) {
				$.ajax({
					url: url + '?count=true',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).done(function(count) {
					count = count.count != null ? count.count : 0;
					distriList.onTotalCount(count);
					gotData(formListData(data));
				});
			});
		};
		distriList.create();
	}

	function getAdSiteDistry(obj) {
		$('#compSiteHstTitle').text(obj.name + i18n('OPS_SITE_HISTORY'));
		var listOption = {
			rows: 11,
			columns: 7,
			containerId: 'compSiteHstList',
			async: true,
			titles: [{
				label: i18n('ADPOS_CNECT_SITE_ID')
			}, {
				label: i18n('ADPOS_CNECT_SITE_NAME')
			}, {
				label: i18n('ADSITE_DISTRI_OBJTYPE')
			}, {
				label: i18n('ADSITE_DISTRI_OBJID')
			}, {
				label: i18n('ADSITE_DISTRICREATE_TIME')
			}, {
				label: i18n('ADSITE_DISTRIEND_TIME')
			}, {
				label: i18n('ADPOS_OPERATION_DIST')
			}],
			listType: 1,
			data: [],
			styles: {
				borderColor: 'transparent',
				borderWidth: 1,
				titleHeight: 46,
				titleBg: 'rgb(93,161,192)',
				titleColor: 'white',
				cellBg: 'white',
				evenBg: 'rgb(245,245,245)',
				cellColor: 'rgb(114,114,114)',
				footBg: 'white',
				footColor: 'rgb(121,121,121)',
				iconColor: 'rgb(93,161,192)',
				inputBorder: '1px solid rgb(203,203,203)',
				inputBg: 'white',
				columnsWidth: [0.09, 0.09, 0.1, 0.25, 0.16, 0.16]
			}
		};
		function formListData(data) {
			data = $.makeArray(data);
			var listdata = data.map(function(item, i) {
				return [{
					label: obj.id
				}, {
					label: obj.name
				}, {
					label: item.object_type
				}, {
					label: item.object_id
				}, {
					label: convertTimeString(item.create_time)
				}, {
					label: convertTimeString(item.complete_time)
				}, {
					label: i18n('SITE_ADMIN_TASK_' + item.status) || ''
				}];
			});
			return listdata;
		}

		var distriList = new StyledList(listOption);
		distriList.getPageData = function(pageNumber, gotData) {
			var url = paasHost + paasDomain + '/dm';
			url += '/task/' + obj.id;
			$.ajax({
				url: url + '?page=' + (pageNumber - 1) + '&size=11',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).done(function(data) {
				$.ajax({
					url: url + '?count=true',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).done(function(count) {
					count = count.count != null ? count.count : 0;
					distriList.onTotalCount(count);
					gotData(formListData(data));
				});
			});
		};
		distriList.create();
	}

	return viewDistry;
})(jQuery);
