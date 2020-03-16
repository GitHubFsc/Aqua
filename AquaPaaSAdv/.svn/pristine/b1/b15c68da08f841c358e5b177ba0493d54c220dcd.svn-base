var chooseSelfAdvUser = (function($){
	var SelfAdvUserData = [];

	var chooseSelfAdvUser = function(){
    this.token = "user_id=" + my.paas.user_id +
      "&user_type=" + my.paas.user_type +
      "&access_token=" + my.paas.access_token +
      "&app_key=" + paasAppKey +
      "&timestamp=";
		this.callback = function(){};
	};
	chooseSelfAdvUser.prototype.initPara = function(){
	  var self=this;
		var titlesAarray = [
      "",
      i18n('SELF_SERVICE_ADVISER_MANAGE_YONGHUMING'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_CAOZUO')
    ];
    var titles_label_array = (titlesAarray.map(function (item) {
      return {label: item};
    }));
		var list_row = 11;
		self.tableStyle={
      rows: list_row,
      columns: titlesAarray.length,
      containerId: 'choose_self_adv_user_table_container',
      titles: titles_label_array,
      listType: 1,
      data: [],
      styles: {
        borderColor: 'rgb(226,226,226)',
        borderWidth: 1,
        titleHeight: 36,
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
        columnsWidth: [0.04, 0.18, 0.42, 0.19, 0.15]
      }
    }
		self.formatServerData=[];
	};
	chooseSelfAdvUser.prototype.listSelfAdvUserTable=function(){
	  var self = this;
    var jq = jQuery;
    var list_row = 11;
    var selfAdvUserTableList = new StyledList(self.tableStyle);
		selfAdvUserTableList.getPageData = function (pageNumber) {
		  var listSelf=this;
		  var listDatas=[];
		  self.getUser_step1(function (data,xhr) {
			  if(typeof(xhr) !="undefined"){
					var totalCount = xhr.getResponseHeader('x-aqua-total-count');
          listSelf.onTotalCount(totalCount || 0);
				};
				var user_ids_Array = data || [];
				user_ids_Array = user_ids_Array.map(function(item){
					return item.userid;
				});
				self.getUser_step2(user_ids_Array, function(data){
					SelfAdvUserData = user_ids_Array.map(function(user_id){
						var tmp = data.filter(function(user_item){
							return user_item.user_id == user_id
						})
						if(tmp.length == 0){
							return {
								user_id: user_id
							}
						}else{
							return tmp[0]
						}
					});
					self.formatServerData=SelfAdvUserData;
					for(var i= 0,len = SelfAdvUserData.length;i<len;i++){
						var storeName="";
						var AquaPaaSAdv_MiniP_ContactName="";
						if(SelfAdvUserData[i]&&SelfAdvUserData[i].metadata){
							storeName=SelfAdvUserData[i].metadata.AquaPaaSAdv_MiniP_StoreName||"";
							AquaPaaSAdv_MiniP_ContactName=SelfAdvUserData[i].metadata.AquaPaaSAdv_MiniP_ContactName||"";
						}
						listDatas.push([{
						"label": i+1
            },{
						"label": SelfAdvUserData[i].user_name||""
            },{
						"label": storeName
            },{
						"label": AquaPaaSAdv_MiniP_ContactName
            },{
						"label": "<span class='opr' data-id='" + i + "'>" + i18n("SUCAI_XUANZE") + "</span>"
            }])
					} 
				})
			},pageNumber,list_row);
			return listDatas
		};
		selfAdvUserTableList.create();
	};
	chooseSelfAdvUser.prototype.bindEvent = function(){
		var self = this;
		var jq=jQuery;
		jq("#choose_self_adv_user_search_button").on("click",function(){
			self.searchContent()
		});
		jq("#choose_self_adv_user_search_input").on("keyup",function(event){
			var key = event.which || event.keycode;
			if(key&&(key==13)){
				self.searchContent()
			}
		})
	};
	chooseSelfAdvUser.prototype.searchContent = function(){
	  var jq=jQuery;
		var self=this;
		var searchKeyWord=jq("#choose_self_adv_user_search_input").val();//here
		var list_row = 11;
    var selfAdvUserTableListSearch = new StyledList(self.tableStyle);
		selfAdvUserTableListSearch.getPageData = function (pageNumber) {
			var listDatas=[];
			var searchCondition={
					"user_scope_specification": [{
						"user_type":"== 0",
						"metadata":{
						 "AquaPaaSAdv_MiniP_StoreName":"*"//当时讨论的自助广告主必填字段
						}
					 }
					]
			};
			if(searchKeyWord!=""){
				searchCondition["user_scope_specification"][0]["metadata"][""+self.searchMetadata+""]="contains "+searchKeyWord+"";
			};
			var listSelf = this;
			var start = (pageNumber - 1) * list_row;
			var end = pageNumber * list_row - 1;
			self.currPage={};
			self.currPage[self.dataRequestMethod] = (pageNumber - 1);
			var listDatas = [];
			var url = paasHost + "/aquapaas/rest/users/cdmi_query"
			url=url+"?access_token=" + my.paas.access_token + "";
			url=url+"&start=" + start +"";
			url=url+"&end=" + end +"";
			url=url+"&app_key=" + paasAppKey +"";
			url=url+"&timestamp=" + new Date().toISOString() +"";
			url=url+"&user_id=" + my.paas.user_id +"";
      jQuery.ajax({
        type: 'PUT',
        async: false,
        url: url,
				data: JSON.stringify(searchCondition),
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        error: function (error) {
        }
      }).done(function (data, status, xhr) {
				if (data&&data.users) {
					var tagDatasMatchUserDatas = [];
				  var users=data.users;
					self.formatServerData=users;
					var totalCount = data.count||0;
          listSelf.onTotalCount(totalCount || 0);
					for(var i= 0,len = users.length;i<len;i++){
						var storeName="";
						var AquaPaaSAdv_MiniP_ContactName="";
						if(users[i]&&users[i].metadata){
							storeName=users[i].metadata.AquaPaaSAdv_MiniP_StoreName||"";
							AquaPaaSAdv_MiniP_ContactName=users[i].metadata.AquaPaaSAdv_MiniP_ContactName||"";
						}
						listDatas.push([{
							"label": i+1
							},{
							"label": users[i].user_name||""
							},{
							"label": storeName
							},{
							"label": AquaPaaSAdv_MiniP_ContactName
							},{
							"label": "<span class='opr' data-id='" + i + "'>" + i18n("SUCAI_XUANZE") + "</span>"
						}])
					}
				}
			});
			return listDatas
		};
		selfAdvUserTableListSearch.create();
	};
  chooseSelfAdvUser.prototype.init = function(callback){
    var that = this;
		var jq=jQuery;
		that.initPara();
    that.callback = callback || function(){};
    this.chooseUserDialog = new PopupDialog({
      url: 'content/chooseSelfAdvUser/chooseSelfAdvUser.html',
      width: 863,
      height: 578,
      context: that,
      callback: function () {
				var isTimingSelect_options = [{
					key: "AquaPaaSAdv_MiniP_StoreName",
					value: i18n("SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG")
				},{
					key: "AquaPaaSAdv_MiniP_ContactName",
					value: i18n("SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING")
				}, {
					key: "AquaPaaSAdv_MiniP_PromoCode",
					value: i18n("SELF_SERVICE_ADVISER_MANAGE_PROMOTE_CODE")
				}];
				var isTimingSelect = new newSelectChooseSelfAdvUser("#choose_self_adv_user_select", [], {
					width: 103,
					height: 28,
					background: "#7EB7D4",
					fontSize: 14,
					liFontSize: 14,
					color: "white",
					liColor: "white",
					selectbackground: "#7EB7D4",
					headerBorder: "1px solid #6D9FBA",
					liBorderColor: "#6D9FBA",
					openIconUrl: "./uiWidget/images/open4.png",
					closeIconUrl: "./uiWidget/images/close4.png",
				},function(value){
					that.searchMetadata=value//here
				});
		   isTimingSelect.updateSelectOptions(isTimingSelect_options);
			 that.searchMetadata="AquaPaaSAdv_MiniP_StoreName";
			 that.listSelfAdvUserTable(); 
			 that.bindEvent();
			 jq('#choose_self_adv_user_table_container').on('click', '.opr', function () {
					var dataIndex=jq(this).attr("data-id");
					var formatServerData=that.formatServerData[dataIndex];
					var user_id = formatServerData.user_id;
					var user_name = formatServerData.user_name;
					that.callback && that.callback(user_id, user_name);
				})
      }
    });
    this.chooseUserDialog.open();
  }
  chooseSelfAdvUser.prototype.formListDataForChooseUserList = function (Data) {
    var list_data = [];
    for (var i = 0; i < Data.length; i = i + 1) {
      var data = Data[i]
      var record = this.formListRowDataForChooseUserList(data, i);
      list_data.push(record);
    }
    return list_data;
  };
  chooseSelfAdvUser.prototype.formListRowDataForChooseUserList = function (data, i) {
    var that = this;
    var label1, label2, label3, label4;
    label1 = i;
    label2 = data.user_name || "";
    label3 =  "";
    if(data.metadata && data.metadata.AquaPaaSAdv_TelephoneNumber){
      label3 =  data.metadata.AquaPaaSAdv_TelephoneNumber;
    }
    var oprChoosed = "<span class='sucai_smallWord_in_td' style='margin-left:0px;' data-type='choose' data-id='" + i + "'/>" +  i18n("SUCAI_XUANZE") + "</span>";
    label4 = oprChoosed;
    var arr = [{label: label1}, {label: label2}, {label: label3}, {label: label4}];
    return arr;
  };
  chooseSelfAdvUser.prototype.getUser_step1 = function (callback,pageNum,list_row) {
		var start = (pageNum - 1) * list_row;
    var end = pageNum * list_row - 1;
    var that = this;
    var url = paasHost + paasDomain + "/usertags/query?" + that.token + new Date().toISOString();
    url = url + "&tags_and=selfregadvuser/NORMAL";
		url += '&start=' + start;
    url += '&end=' + end;
    var result = null;
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
      },
      contentType: "application/json",
      dataType: "json",
    }).done(function (data, status, xhr) {
      result = data || [];
      callback && callback(result,xhr);
    }).fail(function(xhr){
      result = [];
      callback && callback(result,xhr);
    });
  };
  chooseSelfAdvUser.prototype.getUser_step2 = function (user_ids, callback) {
    var that = this;
    if(user_ids.length == 0){
      callback && callback([]);
      return
    }
    var url = paasHost + paasDomain + "/users/public?" + that.token + new Date().toISOString();
    url = url + "&user_ids=" + user_ids.join(",");
    var result = null;
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
      },
      contentType: "application/json",
      dataType: "json",
    }).done(function (data, status, xhr) {
      result = data || [];
      callback && callback(result);
    }).fail(function(xhr){
      result = [];
      callback && callback(result);
    });
    return result;
  };

  return chooseSelfAdvUser;
})(jQuery);