(function($){
var dmRoot = paasHost + paasDomain + '/dm';
var dmUriPrefix = 'aquapaas/rest/dm/';
var advUriPrefix = 'aquapaas_adv/rest/ads/';

var siteAdmin = {
	init: function(){
		var self = this;
		if(window.AdvSystemType == "central"){
			$('#siteAdmin_centralMonitorLink').show()
		}
		$('#siteAdmin_search_input').on('keyup', function(evt){
			if(evt.keyCode == 13){
				self.searchListData();
			}
		});
		$('#siteAdmin_search_input_icon').on('click', function(){
			self.searchListData();
		});
		$('#siteAdmin_addBtn').on('click', function(){
			self.addSite();
		});
		$('#siteAdmin_siteList').on('click', '.adSite_operation', function(){
			var $opr = $(this);
			var index = $opr.attr('data-index');
			var opr = $opr.attr('name');
			var site = self.sitesData && self.sitesData[index];
			switch(opr){
			case 'view':
				self.viewSite(site);
				break;
			case 'edit':
				self.editSite(site);
				break;
			case 'history':
				viewDistributeHistory('#siteAdminSiteLayer', 'adsite', site);
				break;
			case 'delete':
				self.deleteSite(site);
				break;
			case 'monitor':
			  var monitorUrl=(site.monitor_address&&(site.monitor_address!=null))?site.monitor_address:"";
				if(monitorUrl!="")
        {
					var monitor_url=(((monitorUrl.substring(0,7)=="http://")||(monitorUrl.substring(0,8)=="https://"))?monitorUrl:("http://"+monitorUrl))
					window.open(monitor_url,'_blank')
				}
				break;
			}
		});
		$('#siteAdmin_centralMonitorLink').on('click', function(){
		  if((typeof AdvCentralSiteMonitorAddress!="undefined")&&(AdvCentralSiteMonitorAddress!=""))
			{window.open(AdvCentralSiteMonitorAddress,'_blank')}
		});
		this.setList();
	},

	setList: function(){
		var self = this;
		var list = new StyledList({
			rows: 11,
			columns: 6,
			containerId: 'siteAdmin_siteList',
			async: true,
			titles: [{
			label: i18n('ADPOS_CNECT_SITE_ID')
			}, {
			label: i18n('ADPOS_CNECT_SITE_NAME')
			}, {
			label: i18n('ADPOS_CNECT_SITE_IP')
			}, {
			label: i18n('SITE_ADMIN_SITEPORT')
			}, {
			label: i18n('ADPOS_CNECT_SITE_STATUS')
			}, {
			label: i18n('ADPOS_LIST_TITLE_OPR')
			}],
			listType: 0,
			data: [],
			styles: { borderColor: 'transparent',
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
				columnsWidth: [0.09,0.19,0.12,0.17,0.18]//117,232,155,211,225
			}
		});

		list.create();
		this.list = list;
		this.getListData();
	},

	addSite: function(){
		var self = this;
		var dialog = new PopupDialog({
			url: 'content/site_admin/site_ne_dialog.html',
			width: 358,
			height: 470,
			context: {},
			callback: function(){
				$('#siteAdmin_neTitle').text(i18n('SITE_ADMIN_ADDBTN'));
				$('#siteAdmin_neSubmit').text(i18n('ADPOS_DIALOG_SUBMIT_XINJIAN'));
				$('#siteAdmin_neSubmit').on('click', function(){
					var id = $.trim($('#siteAdmin_siteId').val());
					var name = $.trim($('#siteAdmin_siteName').val());
					var ip = $.trim($('#siteAdmin_siteIP').val());
					var port = $.trim($('#siteAdmin_sitePort').val());
					var url = dmRoot + '/site/' + encodeURIComponent(name);
					var monitor_address_value=$.trim($('#siteAdmin_MonitorLink').val());
					var siteObj = {
						id: id,
						name: name,
						endpoints: [{
							ip: ip,
							port: port,
							app_type: 'adv',
							uri_prefix: advUriPrefix
						}, {
							ip: ip,
							port: port,
							app_type: 'dm',
							uri_prefix: dmUriPrefix
						}],
						monitor_address:monitor_address_value
					};
					$.ajax({
						type: 'PUT',
						url: url,
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify(siteObj)
					}).done(function(){
						self.getListData();
						dialog.close();
					}).fail(function(){
						alert(i18n('SITE_ADMIN_SITE_ADD_FAIL'));
					});
				});
			}
		});
		dialog.open();
	},
	getListData: function() {
		var self = this;
		var url = dmRoot + '/site';
		$.ajax({
			url: url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).done(function(data) {
			self.formListData(data);
		});
	},

	searchListData: function(){
		var self = this;
		var searchText = $('#siteAdmin_search_input').val();
		if(searchText != ''){
			var url = dmRoot + '/site/search/' + encodeURIComponent(searchText);
			$.ajax({
				url: url,
				type: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			}).done(function(data){
				self.formListData(data);
			});
		} else {
			self.getListData();
		}
	},

	viewSite: function(site){
		var dialog = new PopupDialog({
			url: 'content/site_admin/site_view_dialog.html',
			width: 358,
			height: 490,
			context: {},
			callback: function(){
				$('#siteAdmin_siteId').val(site.id).attr('disabled', true);
				$('#siteAdmin_siteName').val(site.name).attr('disabled', true);
				var adv = null, dm = null;
				site.endpoints.forEach(function(endpoint){
					if(endpoint.app_type == 'adv'){
						adv = endpoint;
					} else if(endpoint.app_type == 'dm'){
						dm = endpoint;
					}
				});
				$('#siteAdmin_siteIP').val(adv.ip).attr('disabled', true);
				$('#siteAdmin_sitePort').val(adv.port).attr('disabled', true);
				$('#siteAdmin_MonitorLink').val((site.monitor_address&&(site.monitor_address!=null))?site.monitor_address:"").attr('disabled', true);
				$('#siteAdmin_siteAdState').text(adv.available ? 'True': 'False')
					.addClass(adv.available ? 'site-admin-app-state-avail' : 'site-admin-app-state-unavail');
				$('#siteAdmin_siteDmState').text(dm.available ? 'True': 'False')
					.addClass(dm.available ? 'site-admin-app-state-avail' : 'site-admin-app-state-unavail');
			}
		});
		dialog.open();
	},

	editSite: function(site){
		var self = this;
		var dialog = new PopupDialog({
			url: 'content/site_admin/site_ne_dialog.html',
			width: 358,
			height: 470,
			context: {},
			callback: function(){
				$('#siteAdmin_neTitle').text(i18n('SITE_ADMIN_EDITSITE'));
				$('#siteAdmin_neSubmit').text(i18n('ADPOS_DIALOG_SUBMIT'));
				$('#siteAdmin_siteId').val(site.id).attr('disabled', true);
				$('#siteAdmin_siteName').val(site.name);
				var adv = null, dm = null;
				site.endpoints.forEach(function(endpoint){
					if(endpoint.app_type == 'adv'){
						adv = endpoint;
					} else if(endpoint.app_type == 'dm'){
						dm = endpoint;
					}
				});
				$('#siteAdmin_siteIP').val(adv.ip);
				$('#siteAdmin_sitePort').val(adv.port);
				var site_monitor_address=((site.monitor_address&&(site.monitor_address!=null))?site.monitor_address:"")
				$('#siteAdmin_MonitorLink').val((site.monitor_address&&(site.monitor_address!=null))?site.monitor_address:"");
				$('#siteAdmin_neSubmit').on('click', function(){
					var name = $.trim($('#siteAdmin_siteName').val());
					var ip = $.trim($('#siteAdmin_siteIP').val());
					var port = $.trim($('#siteAdmin_sitePort').val());
					var monitor_address_value=$.trim($('#siteAdmin_MonitorLink').val());
					site.name = name;
					site.monitor_address=monitor_address_value;
					site.endpoints[0].ip = ip;
					site.endpoints[0].port = port;
					site.endpoints[1].ip = ip;
					site.endpoints[1].port = port;
					var url = dmRoot + '/site/' + encodeURIComponent(site.id);
					$.ajax({
						type: 'POST',
						url: url,
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						data: JSON.stringify(site)
					}).done(function(){
						self.getListData();
						dialog.close();
					}).fail(function(xhr){
						alert(xhr.statusText);
					});
				});
			}
		});
		dialog.open();
	},

	deleteSite: function(site){
		var self = this;
		var dialog = new PopupDialog({
			url: 'content/site_admin/delete_dialog.html',
			width: 480,
			height: 268,
			context: {},
			callback: function() {
				$('#siteAdmin_delInfo').text(i18n('ADPOS_DIALOG_DEL_CONFIRM_INFO') + (site.name || '') + i18n('SITE_ADMIN_QUESM'));
				$('#siteAdmin_delSubmit').on('click', function() {
					var url = dmRoot + '/site/' + encodeURIComponent(site.id);
					$.ajax({
						type: 'DELETE',
						url: url,
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					}).done(function(){
						self.getListData();
						dialog.close();
						alert(i18n('SITE_ADMIN_SITE_DEL_OK'));
					}).fail(function(){
						alert(i18n('SITE_ADMIN_SITE_DEL_FAIL'));
					});
				});
			}

		});
		dialog.open();
	},

	formListData: function(data){
		var self = this;
		if(window.AdvSystemType == 'local'){
			data = data.filter(function(item){
				return item.id == window.AdvCentralSiteId;
			});
			if(data.length >= 1){
				$('#siteAdmin_addBtn').off('click').addClass('panel-button-disabled');
			}
		}
		self.sitesData = data;
		var len = data.length;
		var listdata = [];
		var monitorDisplay=((window.AdvSystemType == "central")?"inline":"none");
		for (var i = 0; i < len; i += 1) {
			var item = data[i];
			var oprHist = '<span name="history" class="adSite_operation" data-index="' + i + '">' + i18n('OPS_SITE_HISTORY') + '</span>';
			var oprMonitor = '<span style="display:' + monitorDisplay + '" name="monitor" class="adSite_operation" data-index="' + i + '">' + i18n('OPS_SITE_MONITOR') + '</span>';
			var oprView = '<span name="view" class="adSite_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_VIEW') + '</span>';
			var oprEdit = '<span name="edit" class="adSite_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_EDIT') + '</span>';
			var oprDel = '<span name="delete" class="adSite_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DELETE') + '</span>';
			var adv = null, dm = null;
			item.endpoints.forEach(function(endpoint) {
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
				label: item.id
			}, {
				label: item.name
			}, {
				label: adv && adv.ip
			}, {
				label: adv && adv.port
			}, {
				label: mlabel
			}, {
				label: oprView + oprEdit + oprHist + oprMonitor + oprDel
			}];
			listdata.push(listitem);
		}
		self.list.updateInPage(listdata);
	}

};

siteAdmin.init();

window.SiteAdmin = siteAdmin;
})(jQuery);
