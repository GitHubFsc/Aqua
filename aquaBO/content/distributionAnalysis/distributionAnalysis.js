fenbu_fenxi= new Object();
fenbu_fenxi.init = function () {
	this.fenzu_id_array=[];
  this.aquadaasData=AquaDaaSHost;
	this.initPara();
	this.initDom();
	this.bindEvents();
}
fenbu_fenxi.initPara = function(){
	this.dataFromServer=[];
  this.relationShip_quotas_group=null;//指标和分组的对应关系
	this.choosedQuotasInQuotasPopup=[];//非提交数据，默认显示在页面上数据
	this.choosedQuotasInPage=[];//提交数据
  this.measure_="";
	this.checkBoxOrRadio={"display_container_fenzu":"radioButton"};//分组默认单选
	this.dataChoosedInFilterPopup=[];
	this.groupingArray=[];//传给分组对话框的数据
	this.no_group=false;
	this.actionChecker_getSelected=[];
	this.groupStatus="notChooseQuotas_noGroup";
	this.groupStatus_action();
	this.menuChooseIndex=0;
	this.groups_after_chooseQuotas=[];
};
fenbu_fenxi.formatFenzuData = function(feuzuServerData){
	var groupsLenArray=[];
	for(var i in feuzuServerData){
	  if(feuzuServerData[i].group){groupsLenArray.push(feuzuServerData[i].group.length)}
		else{groupsLenArray.push(0)}
	};
  var groupsLenArray_min=(Math.min.apply(null, groupsLenArray));//指标里面group长度最小的。
	var groupArray_L1=[];//最后合并后的group数据(一维)。
	var feuzuServerData_transferToArray=[];
	for(var j in feuzuServerData){
		feuzuServerData_transferToArray.push(feuzuServerData[j]);
	}
	var feuzuServerData_transferToArray_len=feuzuServerData_transferToArray.length;
	if(groupsLenArray_min>0)//指标中任何指标group都不能为空,否则界面上分组就是空。
	{
		if(feuzuServerData_transferToArray[0]){//以第1个指标作为标准
			for(let i=0;i<groupsLenArray_min;i++){
				var groupArray_L2=[];//最后合并后的group数据(二维)。
				var firstQuota_group_L1=feuzuServerData_transferToArray[0].group[i];//第一个指标group下面一级元素，如["vv99", "po_id", "po_name"]。
				var firstQuota_group_L1_len=firstQuota_group_L1.length;
				for(let j=0;j<firstQuota_group_L1_len;j++){
					var firstQuota_group_L2=firstQuota_group_L1[j];//第一个指标group下面二级元素，如"vv99"。
					var existInOtherQuota=true;
					for(let k=0;k<feuzuServerData_transferToArray_len;k++){//把firstQuota_group_L2在其他指标中的同位置数组中查是否存在
						var otherQuotaGroupUnitInThisLocation=feuzuServerData_transferToArray[k].group[i];
						if(jQuery.inArray(firstQuota_group_L2,otherQuotaGroupUnitInThisLocation)==-1){//该group位置下的某一分组项在其他指标同位置不存在
							existInOtherQuota=false;
							break;
						}
					}
					if(existInOtherQuota){groupArray_L2.push(firstQuota_group_L2)}
				}
				groupArray_L1.push(groupArray_L2);
			}
		}
	}
	return groupArray_L1
};
fenbu_fenxi.getOrgDataByCompanyNameB=function(_companyName){
	var data_ = "";
	var xhr = new my.aqua.xhr();
	var url = my.aqua.restRoot + my.aqua.encodePath(my.aqua.xgxPath +_companyName+"/") + "?metadata;";
	xhr.open("GET", url, false);
	my.aqua.addXHRHeaderRequest(xhr, "GET", url, "cdmi-container");
	xhr.send();
	if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
			data_ = JSON.parse(xhr.responseText);
	} else {
			data_ = "";
	}
	return data_;
};
fenbu_fenxi.getChildDataByObjectID = function(parent_id){
	var childData = null;
	if( parent_id && parent_id !=""){
		var parent_uri = my.aqua.xgxPath;
		var object_type = "application/cdmi-container";
		var result_spec = '"cdmi_results_specification" : {"objectID" : "1","objectName" : "1",'
				+ '"metadata" : {"company_name" : "1","company_addr" : "1", "company_phone" : "1", "company_status" : "1", "company_type" : "1", "company_parentObjectID" : "1", "company_tifOrgCode":"1"}}';

		var scope_spec = 	'"cdmi_scope_specification" : [{"objectType" : "== '+ object_type + '","parentURI":"== ' + parent_uri + '",'
				+ '"metadata":{"company_status": "== 1", "org_bOutofSchool": "== 0", "company_parentObjectID":"== ' + parent_id +
				'"}},{"objectType" : "== '+ object_type + '","parentURI":"== ' + parent_uri + '",'
				+ '"metadata":{"company_status": "== 1", "org_bOutofSchool": "!*", "company_parentObjectID":"== ' + parent_id + '"}}]';

		var url = my.aqua.restRoot + "/cdmi_query/?sort=alphabet-";

		var xhr = new XMLHttpRequest();
		xhr.open("PUT", url, false);
		my.aqua.addXHRHeaderRequest(xhr, "PUT", url, object_type);
		var request_send = '{' + scope_spec + ',' + result_spec + '}';
		xhr.send(request_send);
		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
			childData = JSON.parse(xhr.responseText);
		}else{
			console.log("获取组织parent_id为" + parent_id + "的下级组织信息失败");
		}
	}
	return childData;
};
fenbu_fenxi.getAllSchool=function(){
	var that=this;
	var org="";
	var orgArray=[];
	if(this.currUserInfo_&&this.currUserInfo_.user_organization){
			org=this.getOrgDataByCompanyNameB(this.currUserInfo_.user_organization);
			orgArray.push(org.metadata.company_name);
	}
	if(this.currUserInfo_.user_organization=="总公司"){
			//获取下级组织的数据
			orgArray.push(org.metadata.company_tifOrgCode);
			var childOrgData = that.getChildDataByObjectID(that.getObjectID());
			if(childOrgData.container)
			for(var a=0;a<childOrgData.container.length;a++){
					if(childOrgData.container[a].metadata&&childOrgData.container[a].metadata.company_name)
					{
							orgArray.push(childOrgData.container[a].metadata.company_name);
					}
			}
	}
	return orgArray
};
fenbu_fenxi.getObjectID = function(){
	var res = null;
	var url_query = '/aqua/rest/cdmi' + my.aqua.xgxPath;
	var nowDateTime = new Date().getTime();
	var method = 'GET';
	var contentType = 'application/cdmi-container';
	var StringToSign = method + '\n' + contentType + '\n'+ nowDateTime + '\n' + url_query;
	jQuery.ajax({
			type: method,
			async: false,
			url: my.aqua.host + url_query + '?objectID',
			dataType: 'json',
			headers: {
					"Accept": "application/cdmi-container",
					"Content-Type": "application/cdmi-container",
					"Authorization": "AQUA " + my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign)),
					"x-aqua-date": nowDateTime
			},
			success: function(data){
					if(data.objectID && data.objectID !=""){
							res = data.objectID;
					}
			},
			error: function(data){
					console.log("获取一级组织的objectID失败");
			}
	});
	return res;
};
fenbu_fenxi.initDom=function(){
	this.initCalendar();
	this.initGroupByChoosedQuotas([]);
	jQuery("#distributionAnalysis_seachConditionContainer").mCustomScrollbar({
    axis: 'y'
  });
}
fenbu_fenxi.getGroupEleDisplayName=function(groupStoredName){
	var groupStoredName_split=groupStoredName.split(":");
	if(typeof groupStoredName_split!="undefined"){
		return (groupStoredName_split.length>0?groupStoredName_split[1]:groupStoredName_split[0])
	}
}

fenbu_fenxi.refreshGroupDisplay_noGroup=function(){
	var jq=jQuery;
	var self=this;
	self.choosedQuotasInQuotasPopup["display_container_fenzu"]=[];//指标联动的默认分组数据为空。
	self.choosedQuotasInPage["display_container_fenzu"]=[];//过去选择好提交的分组清空。
	self.refreshfenzuCommon();
  self.groupStatus="chooseQuotas_noGroup";	
	self.groupStatus_action();
}

fenbu_fenxi.refreshGroupDisplay=function(index){
	var jq=jQuery;
	var self=this;
	var groups_after_chooseQuotas=self.groups_after_chooseQuotas[index];
	var groups_after_chooseQuotas_length=groups_after_chooseQuotas.length;
	var fenzuArray=[];
	for(var i=0;i<groups_after_chooseQuotas_length;i++){
		fenzuArray.push({"id":groups_after_chooseQuotas[i],"name":self.getGroupEleDisplayName(groups_after_chooseQuotas[i])})
		//fenzuArray.push({"id":groups_after_chooseQuotas[i],"name":groups_after_chooseQuotas[i]})
	};
	self.choosedQuotasInQuotasPopup["display_container_fenzu"]=fenzuArray;
	self.refreshfenzuCommon();
	self.groupStatus="chooseQuotas_hasGroup";
  self.groupStatus_action();	
}

fenbu_fenxi.refreshfenzuCommon=function(){
  var self=this;
	var obj={
	"clickType":self.checkBoxOrRadio["display_container_fenzu"],
	"containerId":"display_container_fenzu",
	"data":self.choosedQuotasInQuotasPopup,
	"isChoosed":"unChoosed",
	"style":"margin-top:5px;width:auto;height:22px;line-height:20px;",
	"radioStyle":"margin-top:1px",
	"textStyle":"",
	//"textStyle":"width:62px;max-width:62px;"
	};
	self.drawFilterDisplayRegion(obj);
	var height=document.getElementById("display_container_fenzu").offsetHeight+"px";
	document.getElementById("distribution_fenzu_container").style.height=height
}

fenbu_fenxi.showFenzuDownload=function(formatFenzuData){
	var self=this;
  var jq=jQuery;
	//不管有没有分组，下拉菜单头都要显示，保留箭头，默认不分组。
	jq("#distribution_fenzuMenu_body").empty();
	document.getElementById("distribution_fenzuMenu_title").innerHTML=i18n("FENBUFENXI_BUFENZU");//默认不分组
	jq("#distribution_fenzuMenu_body").append("<div class=\"distribution_downMenu_row\" title=\""+i18n("FENBUFENXI_BUFENZU")+"\" onmouseover=\"javascript:this.style.color='#29bff4'\" onmouseout=\"javascript:this.style.color='#888888'\">"+i18n("FENBUFENXI_BUFENZU")+"</div>");
	document.getElementById("distribution_fenzuMenu").style.display="block";
	if(formatFenzuData.length==0){
		self.no_group=true;
		document.getElementById("display_container_fenzu").style.display="none";
	}
	else{
		self.no_group=false;
		var groupCount=formatFenzuData.length;
		//document.getElementById("distribution_fenzuMenu_title").innerHTML=i18n("FENBUFENXI_DI")+"1"+i18n("FENBUFENXI_ZU");
		//第一个选项：不分组
		for(var i=0;i<groupCount;i++){
		  var eachFormatFenzuData=formatFenzuData[i];
			var menuRowDisplayName="";
			for(var j=0,eachFormatFenzuDataSplitLen=eachFormatFenzuData.length;j<eachFormatFenzuDataSplitLen;j++){
				var eachFormatFenzuDataSplitUnit=eachFormatFenzuData[j];
				eachFormatFenzuDataSplitUnitRightPart="";
				if(eachFormatFenzuDataSplitUnit.indexOf(":")!=-1){
					eachFormatFenzuDataSplitUnitRightPart=eachFormatFenzuDataSplitUnit.substring(eachFormatFenzuDataSplitUnit.indexOf(":")+1,eachFormatFenzuDataSplitUnit.length);
					if(j==0){
						menuRowDisplayName=eachFormatFenzuDataSplitUnitRightPart.toUpperCase();
					}
					else{
						menuRowDisplayName+=("+"+eachFormatFenzuDataSplitUnitRightPart.toUpperCase());
					}
				}
			}
			//var chineseNum=transfer_ArabNum_toChineseNum.numberToChinese((i+1))
			var chineseNum=(i+1);
			var menuBodyDisplay="block;";
			if(formatFenzuData[i].length==0){
				menuBodyDisplay="none;";
			}
			jq("#distribution_fenzuMenu_body").append("<div style=\"display:"+menuBodyDisplay+";max-width:calc(100% - 12px);overflow:hidden;white-space:nowrap;text-overflow:ellipsis\" class=\"distribution_downMenu_row\" title=\""+menuRowDisplayName+"\" onmouseover=\"javascript:this.style.color='#29bff4'\" onmouseout=\"javascript:this.style.color='#888888'\">"+menuRowDisplayName+"</div>");
		};
		document.getElementById("display_container_fenzu").style.display="block";
	}
	self.refreshGroupDisplay_noGroup();//不管又没有分组，默认不分组
	this.bindEvents_fenzu();//暂且定下不管分不分组都能点菜单展开
	jq(".distribution_downMenu_row").each(function(){
		jq(this).unbind().bind('click', function () {
				var menuIndex=jq(this).index();
				if(self.menuChooseIndex!=menuIndex){//菜单切换
					self.clearFilter();
					self.menuChooseIndex=menuIndex
				}
				if(menuIndex==0){//下拉菜单第一项为不分组
					self.refreshGroupDisplay_noGroup();
				}
				else{
					var menuIndex_=menuIndex-1;
					self.refreshGroupDisplay(menuIndex_);
				}
				self.hide('distribution_fenzuMenu_body',this);
				jq("#distribution_fenzuMenu_top").find("img").css("transform","rotate(0deg)");
    });
  });
};
fenbu_fenxi.show=function(id){
	document.getElementById(id).style.display="block";
};
fenbu_fenxi.hide=function(id,obj){
	document.getElementById(id).style.display="none";
	document.getElementById("distribution_fenzuMenu_title").innerHTML=jQuery(obj).text()
};
fenbu_fenxi.offSet=function(curEle) {
	var totalLeft = null;
	var totalTop = null;
	var par = curEle.offsetParent;
	//首先把自己本身的相加
	totalLeft += curEle.offsetLeft;
	totalTop += curEle.offsetTop;
	//现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
	while (par){
			if (navigator.userAgent.indexOf("MSIE 8.0") === -1){
					//不是IE8我们才进行累加父级参照物的边框
					totalTop += par.clientTop;
					totalLeft += par.clientLeft;
			}
			totalTop += par.offsetTop;
			totalLeft += par.offsetLeft;
			par = par.offsetParent;
	}
	return {left: totalLeft,top: totalTop};
}
fenbu_fenxi.expandSonContainer=function(){
  var jq=jQuery;
	var containerTop=this.offSet(document.getElementById("distribution_fenzuMenu_title")).top-26+"px";
	jq("#distribution_fenzuMenu_body").css({"top":containerTop,"left":"79px"})
	var border=2;
	var height=document.getElementById("distribution_fenzuMenu_top").offsetHeight;
	var top=document.getElementById("distribution_fenzuMenu").offsetTop;
	var bodyHeight=document.getElementById("distribution_fenzuMenu_body").offsetHeight;
	var addHeight=border*2+height+top+bodyHeight+4;
	var sonHeight=document.getElementById("distributionAnalysis_seachConditionContainer_son").offsetHeight;
	/*
	if(sonHeight<addHeight){
		document.getElementById("distributionAnalysis_seachConditionContainer_son").style.height=(addHeight+"px");
	}
	*/
}
fenbu_fenxi.getAllQuotas=function(callback){
	var self=this;
	var mapping_name="analytics_index_info_field_mapping";
	var url_=AquaDaaSHost+"/aquadaas/rest/jsonfile/content/"+mapping_name+"";
	url_ += '?app_key=' + paasAppKey;
	url_ += '&timestamp=' + new Date().toISOString();
	var type_="GET";
	jQuery.ajax({
		url: url_,
		type: type_,
		async: true,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-aqua-sign': getPaaS_x_aqua_sign(type_, url_)
		}
	}).done(function(data){
	  var objrelationShipQuotasGroup={};
		if(data){
		  for(var i = 0, len = data.length; i < len; i+=1){
				var group = data[i];
				if(group.analytics_field){
				  var groupAnalyticsField=group.analytics_field;
					for(var j in groupAnalyticsField){
						objrelationShipQuotasGroup[j]=groupAnalyticsField[j]
					}
				}
			};
			self.relationShip_quotas_group=objrelationShipQuotasGroup;
			callback(data)
		}
	})
}
fenbu_fenxi.initIndexChecker=function(){
  var self=this;
	self.getAllQuotas(function(data){
		var indexes=[];
		if(data){
			for(var i = 0, len = data.length; i < len; i+=1){
				var group = data[i];
        var indexGroup = {};
        indexGroup.label = group.analytics_group;
				var groupFields = group.analytics_field;
				for(var key in groupFields){
          if(groupFields.hasOwnProperty(key)){
            var index = groupFields[key];
            var desc = index.desc?index.desc:"";
            indexes.push({"checked":false,"key":key,"label":desc,group:indexGroup})
          };
        }
			}
		}
		if(typeof self._actionChecker=="undefined"){
			var checker = new IndexChecker({
				indexes: indexes,
				title: i18n('FENBUFENXI_INDEX_CHECKER'),
			});
			self._actionChecker = checker;
		};
		self._actionChecker.onSelect = function() {
			var selected = self._actionChecker.getSelected();
			self.actionChecker_getSelected=selected;
			var selected_len=selected.length;
			var array_=[];
			for(var i=0;i<selected_len;i++){
				var data_={"id":selected[i].key,"name":selected[i].label};
				array_.push(data_);
			}
			self.choosedQuotasInQuotasPopup["display_container_zhibiao"]=array_;
			self.choosedQuotasInPage["display_container_zhibiao"]=array_;//指标弹框选择后，在外部界面默认全选。
			var obj={
				"clickType":"checkBox",
				"containerId":"display_container_zhibiao",
				"data":self.choosedQuotasInQuotasPopup,
				"isChoosed":"choosed",
				"style":"margin-top:23px;width:auto;",
				"radioStyle":"",
				"textStyle":""
			};
			self.drawFilterDisplayRegion(obj);
			self.initGroupByChoosedQuotas(selected);
		};
		self._actionChecker.open();
	})
}
fenbu_fenxi.initGroupByChoosedQuotas=function(selected){//指标更新时，分组更新
  var jq=jQuery;
	var self=this;
	if(selected.length==0){//没选任何指标时，下面下拉菜单不显示。
		jq("#display_container_fenzu").empty().hide();
		self.groupStatus="notChooseQuotas_noGroup";
	  //不管有没有分组，下拉菜单头都要显示，保留箭头，默认不分组。
	  document.getElementById("distribution_fenzuMenu_title").innerHTML=i18n("FENBUFENXI_BUFENZU");//默认不分组
	  jq("#distribution_fenzuMenu_body").empty().append("<div class=\"distribution_downMenu_row\" onmouseover=\"javascript:this.style.color='#29bff4'\" onmouseout=\"javascript:this.style.color='#888888'\">"+i18n("FENBUFENXI_BUFENZU")+"</div>");
	  document.getElementById("distribution_fenzuMenu").style.display="block";
		self.refreshGroupDisplay_noGroup();
		this.bindEvents_fenzu();//暂且定下不管分不分组都能点菜单展开
	  jq(".distribution_downMenu_row").each(function(){
		 jq(this).unbind().bind('click', function () {
				var menuIndex=jq(this).index();
				if(self.menuChooseIndex!=menuIndex){//菜单切换
					self.clearFilter();
					self.menuChooseIndex=menuIndex
				}
				self.refreshGroupDisplay_noGroup();
				/*
				if(menuIndex==0){//下拉菜单第一项为不分组
					self.refreshGroupDisplay_noGroup();
				}
				else{
					var menuIndex_=menuIndex-1;
					self.refreshGroupDisplay(menuIndex_);
				}
				*/
				self.hide('distribution_fenzuMenu_body',this);
				jq("#distribution_fenzuMenu_top").find("img").css("transform","rotate(0deg)");
     });
   });
		self.groupStatus_action();
	}
	else{
		if(this.relationShip_quotas_group!=null){
			var selected_len=selected.length;
			var relationShip_quotas_group_for_selectedQuotas={};
			for(var i=0;i<selected_len;i++){
				var quotaKey=selected[i].key;
				if(this.relationShip_quotas_group[quotaKey]){
					relationShip_quotas_group_for_selectedQuotas[quotaKey]=this.relationShip_quotas_group[quotaKey]
				}
			}
			var formatFenzuData=this.formatFenzuData(relationShip_quotas_group_for_selectedQuotas);
			this.groups_after_chooseQuotas=formatFenzuData;
			this.showFenzuDownload(formatFenzuData);
		}
	};
	this.clearFilter();//过滤全部清除。
};
fenbu_fenxi.clearFilter=function(){
	var jq=jQuery;
	var self=this;
	jq("#filter_display_container").empty();
	for(var a in self.choosedQuotasInQuotasPopup){
	 if( (a.indexOf("filter_display_container")!=-1)&&(a.indexOf("_son")!=-1) ){
		 delete(self.choosedQuotasInQuotasPopup[a]);
	 }
	}
	for(var b in self.choosedQuotasInPage){
	 if( (b.indexOf("filter_display_container")!=-1)&&(b.indexOf("_son")!=-1) ){
		 delete(self.choosedQuotasInPage[b]);
	 }
	}
};
fenbu_fenxi.listFilterData=function(resultChooseFromPopup){
  var jq=jQuery;
	var resultChooseFromPopup_len=resultChooseFromPopup.length;
	var dataChoosedInFilterPopup=[];
	for(var i=0;i<resultChooseFromPopup_len;i++){
	  var obj={"categary":{"name":resultChooseFromPopup[i].name,"id":resultChooseFromPopup[i].id},"contents":resultChooseFromPopup[i].selected};
		dataChoosedInFilterPopup.push(obj)
	};
	var data =dataChoosedInFilterPopup;
	var data_len=data.length;
	jq("#filter_display_container").empty();
	
	for(var i=0;i<data_len;i++){
	  var containerDisplay="none";
		if((typeof data[i].contents!="undefined")&&(data[i].contents.length>0)){
			containerDisplay="block"
		}
	  var title=data[i]["categary"].name+i18n("FENBUFENXI_GUOLVB");
		jq("#filter_display_container").append("<div id=\"filter_display_container"+i+"\" style=\"width:819px;display:"+containerDisplay+"\"><div class=\"hiddenCategary\" style=\"display:none\">"+data[i]["categary"].id+"</div><div title=\""+title+"\" style=\"font-size:14px;width:auto;width:auto;display:inline-block;margin-top:2px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;vertical-align:top;\">"+title+"</div><div id=\"filter_display_container"+i+"_son\" style=\"display:inline-block;height:auto;width:697px;overflow:hidden;\"></div>");
		var contents_len=data[i].contents.length;
		var array_=[];
		for(var j=0;j<contents_len;j++){
			var data_={"id":"","name":data[i].contents[j]};
			array_.push(data_);
		}
		this.choosedQuotasInQuotasPopup["filter_display_container"+i+"_son"]=array_;
	  this.choosedQuotasInPage["filter_display_container"+i+"_son"]=array_;//指标弹框选择后，在外部界面默认全选。
		var obj={
			"clickType":"checkBox",
			"containerId":"filter_display_container"+i+"_son",
			"data":this.choosedQuotasInQuotasPopup,
			"isChoosed":"choosed",
			"style":"margin-top:4px;margin-bottom:19px;width:auto",
			"radioStyle":"",
			"textStyle":""
		};
		this.drawFilterDisplayRegion(obj);
	};
};
fenbu_fenxi.bindEvents=function(){
  var jq=jQuery;
	var self=this;
	document.getElementById("distributionAnalysis_zhibiaoButton").onclick=function(){
	   self.initIndexChecker();
	};
	document.getElementById("distributionAnalysis_fenzuSwitchButton").onclick=function(){
	  var checkBoxOrRadio=(self.checkBoxOrRadio.display_container_fenzu=="radioButton")?"checkBox":"radioButton";
		this.checkBoxOrRadio={"display_container_fenzu":checkBoxOrRadio}
		self.checkBoxOrRadio.display_container_fenzu=checkBoxOrRadio;
		var img=(checkBoxOrRadio=="checkBox")?"singlechoose.png":"multichoose.png";
		document.getElementById("distributionAnalysis_fenzuSwitchButton_img").src="content/distributionAnalysis/image/"+img;
		document.getElementById("distributionAnalysis_fenzuSwitchButton_text").innerHTML=(checkBoxOrRadio=="checkBox")?i18n("FENBUFENXI_DANXUAN_SPLIT"):i18n("FENBUFENXI_DUOXUAN_SPLIT");
		self.choosedQuotasInPage["display_container_fenzu"]=[];//分组切换多选单选后，默认一个都不选择。
		var obj={
			"clickType":self.checkBoxOrRadio["display_container_fenzu"],
			"containerId":"display_container_fenzu",
			"data":self.choosedQuotasInQuotasPopup,
			"isChoosed":"unChoosed",
			"style":"margin-top:5px;width:auto;height:22px;line-height:20px",
			"radioStyle":"margin-top:1px",
			"textStyle":"",
			//"textStyle":"width:62px;max-width:62px;"
		};
		self.drawFilterDisplayRegion(obj);
	}
	document.getElementById("distributionAnalysis_resetAllConditions").onclick=function(){//仅仅重置过滤
		//document.getElementById("date_picker_begin-datepicker-input").value="";
    //document.getElementById("date_picker_end-datepicker-input").value="";
		//jq("#display_container_zhibiao").empty();
		//document.getElementById("distribution_fenzuMenu").style.display="none";
		//document.getElementById("distribution_fenzuMenu_body").style.display="none";
    //document.getElementById("distribution_fenzuMenu_title").innerHTML="";
		//jq("#display_container_fenzu").css("display","none").empty();
		jq("#filter_display_container").empty();
		for(var a in self.choosedQuotasInQuotasPopup){
		 if( (a.indexOf("filter_display_container")!=-1)&&(a.indexOf("_son")!=-1) ){
			 delete(self.choosedQuotasInQuotasPopup[a]);
		 }
		};
		for(var b in self.choosedQuotasInPage){
		 if( (b.indexOf("filter_display_container")!=-1)&&(b.indexOf("_son")!=-1) ){
			 delete(self.choosedQuotasInPage[b]);
		 }
		};
		self.dataChoosedInFilterPopup=[];
	}
};
fenbu_fenxi.bindEvents_fenzu=function(){
  var self=this;
  var jq=jQuery;
	jQuery("#distribution_fenzuMenu_top").unbind().bind('click',function(){
		if(jq("#distribution_fenzuMenu_body").css("display")=="none"){
		  self.expandSonContainer();
			jq("#distribution_fenzuMenu_body").css("display","block");
			jq(this).find("img").css("transform","rotate(180deg)");
		}
	  else{
			jq("#distribution_fenzuMenu_body").css("display","none");
			jq(this).find("img").css("transform","rotate(0deg)");
		}
	})
	jq("#distribution_fenzuMenu_top").mouseout(function(){
	  
		//self.fenzuMenuTimeout=setTimeout(function(){jq("#distribution_fenzuMenu_body").css("display","none")},2000)
	})
	jq("#distribution_fenzuMenu_body").mouseover(function(){
		clearTimeout(self.fenzuMenuTimeout);
		self.fenzuMenuTimeout=null;
	})
	jq("#distribution_fenzuMenu_body").mouseout(function(){
	   
		//self.fenzuMenuBodyTimeout=setTimeout(function(){jq("#distribution_fenzuMenu_body").css("display","none")},2000)
	})
}
fenbu_fenxi.drawFilterDisplayRegion=function(obj){
  var jq=jQuery;
  var self=this;
	var radioStyle=obj.radioStyle;
	var textStyle=obj.textStyle;
	var borderRadius=(obj.clickType=="radioButton")?"border-radius:10px;":"";
	var l1Style="cursor:pointer;color:#828282;float:left;overflow:hidden;"+obj.style+";"
	var l2Style="border-radius:2px;height:16px;width:16px;border:1px #d6d6d6 solid;float:left;"+borderRadius+";"+radioStyle+";";//l2Style和l3Style为radiusButton或checkBox的样式。
	var l3Style="border-radius:1px;margin-left:3px;margin-top:3px;height:10px;width:10px;"+borderRadius+";";
	var l4Style="text-align:left;width:auto;float:left;"+textStyle+"white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-left:12px";
	var l4StyleAuto="margin-right:10px;text-align:left;width:auto;float:left;"+textStyle+"margin-left:12px";
	var data=obj.data[obj.containerId];
	var container=obj.containerId;
	var len=data.length;
	jq("#"+obj.containerId+"").empty();
	for(var i=0;i<len;i++){
		var addHiddenContentDom_content=data[i].id;
		if(obj.containerId=="display_container_fenzu"){
		  var array_=data[i].id.split(":");
			addHiddenContentDom_content=array_[0]
		}
		var addHiddenContentDom="<div class=\"hiddenContent\" style=\"display:none\">"+addHiddenContentDom_content+"</div>"
		var class_=((obj.isChoosed=="unChoosed")?"d4d4d4":"bg32beea");
		if(obj.containerId=="display_container_fenzu"){
			if(i==0){//mail:2019.3.25 分组选择后, 需要默认选择第一个
				class_="bg32beea"
			}
		}
		jq("#"+obj.containerId+"").append("<div style=\""+l1Style+";\"><div class=\"each_checkbox_filter_display\" style=\""+l2Style+"\"><div class=\""+class_+"\" style=\""+l3Style+"\"></div></div>"+addHiddenContentDom+"<div class=\"ifLongSuplusStyle\" title=\""+data[i].name+"\" style=\""+l4StyleAuto+"\">"+data[i].name+"</div></div>");
	  if(obj.containerId=="display_container_fenzu"){
			jq("#"+container+"").find(".each_checkbox_filter_display").each(function(){
				let parent=jq(this).parent();
				 if(jq(this).children().attr("class")=="bg32beea"){
				 self.choosedQuotasInPage[obj.containerId]=[{"id":jq(parent).find(".hiddenContent").text(),"name":jq(parent).find(".ifLongSuplusStyle").text()}];
				}
			})
		};
	};
	var closeure = function(clickType_) {
		jq("#"+container+"").find(".each_checkbox_filter_display").each(function(){
				jq(this).unbind();
				jq(this).bind('click', function () {
					let parent=jq(this).parent();
					if(clickType_=="radioButton"){
						 if(jq(this).children().attr("class")=="d4d4d4"){
							jq(this).children().attr("class","bg32beea");
							jq(this).parent().siblings().find(".bg32beea").attr("class","d4d4d4");
							self.choosedQuotasInPage[obj.containerId]=[{"id":jq(parent).find(".hiddenContent").text(),"name":jq(parent).find(".ifLongSuplusStyle").text()}];
						}
						else{
							jq(this).parent().siblings().find(".bg32beea").attr("class","d4d4d4");
							jq(this).children().attr("class","d4d4d4");//单选可以去除
							self.choosedQuotasInPage[obj.containerId]=[];
						}
					}
					else{//默认为复选框。
						if(jq(this).children().attr("class")=="d4d4d4"){
								jq(this).children().attr("class","bg32beea");
								self.choosedQuotasInPage[obj.containerId].push({"id":jq(parent).find(".hiddenContent").text(),"name":jq(parent).find(".ifLongSuplusStyle").text()})
						}
						else{//移除选择   
							jq(this).children().attr("class","d4d4d4");
							let parent=jq(this).parent();
							let id_=jq(parent).find(".hiddenContent").text();
							let hiddenContent=id_;
							let index_=0;
							var choosedQuotas_=self.choosedQuotasInQuotasPopup[obj.containerId];
							if(container!="display_container_fenzu"){  //here
								for(var i=0;i<choosedQuotas_.length;i++){
									if(choosedQuotas_[i]["id"]==id_){
										index_=i;
										break;
									}
								}
							}
							else{
							    var choosedQuotasInPageThisContainerId=self.choosedQuotasInPage[obj.containerId];
									for(var i= 0,lenChoosedQuotasInPage = choosedQuotasInPageThisContainerId.length;i<lenChoosedQuotasInPage;i++){
										if(hiddenContent==choosedQuotasInPageThisContainerId[i].id){
											index_=i
										}
									}
								}		
							if(index_!=-1){
								self.choosedQuotasInPage[obj.containerId].splice(index_,1);
							}
						}
						if(container=="display_container_zhibiao")
							{
							 let tempArr=[];
							 var choosedQuotasInPage_=self.choosedQuotasInPage[obj.containerId];
							 for(var i=0;i<choosedQuotasInPage_.length;i++){
							  obj_={
									"checked":true,
									"key":choosedQuotasInPage_[i].id,
									"label":choosedQuotasInPage_[i].name,
								}
								tempArr.push(obj_)
							 }
							 self.actionChecker_getSelected=tempArr;
							};
					}
					if(obj.containerId=="display_container_fenzu"){
						self.groupingArray=[];//防止分组单选多选切换。
						/*//目前讨论下来，过滤内容不根据分组内容显示。
						if( (typeof self.choosedQuotasInPage["display_container_fenzu"]!="undefined")&&(self.choosedQuotasInPage["display_container_fenzu"].length>0) ){
							var display_container_fenzu=self.choosedQuotasInPage["display_container_fenzu"];
							var display_container_fenzu_len=display_container_fenzu.length;
							for(var i=0;i<display_container_fenzu_len;i++){
								var obj_={
									"id":display_container_fenzu[i].id,
									"name":display_container_fenzu[i].name,
									"selected":[]
								}
								self.groupingArray.push(obj_)
							}
					 }
					 */
					}
					else if(obj.containerId=="display_container_zhibiao"){
						let array_=[];
						if(typeof self.choosedQuotasInPage[obj.containerId]!="undefined"){
							let len=self.choosedQuotasInPage[obj.containerId].length;
							for(let i=0;i<len;i++){
								let temp=self.choosedQuotasInPage[[obj.containerId]][i];
								let obj_={
									"checked":true,
									"key":temp.id,
									"label":temp.name,
								}
								array_.push(obj_)
							};
							self.initGroupByChoosedQuotas(array_);
						}
					}
					else{
					}
				});
		});
	}(obj.clickType)
	//*/
};
fenbu_fenxi.drawDefaultTable=function(){
	var jQ=jQuery;
	var array_=this.measure_.split(",");
	var defaultTableLength=5;
	var zhibiao_length=jQ("#display_container_zhibiao").find(".ifLongSuplusStyle").length;
	for(var a=0;a<zhibiao_length;a++){
			var lr="";
			var name_=jQ("#display_container_zhibiao").find(".ifLongSuplusStyle").eq(a).text();
			if(a%2==0){lr="left"}
			else{lr="right"}
			jQ("#searchResultContainer").append("<div style=\"width:calc(50% - 24px);height:271px;float:"+lr+";border:1px #eaeaea solid;overflow:hidden;margin-top:39px;\"><div style=\"float:left;height:100%;width:208px;\"><div style=\"height:23px;width:100%;overflow:hidden;margin-left:15px;margin-top:13px\"><div style=\"font-size:12px;float:left;width:auto;height:24px;line-height:24px\">"+name_+"</div><div style=\"font-size:6px;float:left;width:26px;;height:11px;text-align:center;line-height:11px;border-radius:2px;background-color:#fd807f;color:#fff9f9;font-family:Arial;margin-left:6px;font-weight:bold\">index</div></div><div style=\"height:calc(100% - 39px);width:100%;position:relative;\"><div id=\"echartt_"+a+"\" style=\"position:absolute;height:220px;width:100%;top:0px\"></div></div></div><div style=\"float:right;height:100%;width:calc(100% - 220px);margin-right:12px;color:#848484;\"><div id=\"analyze_chartContainer_"+a+"\" style=\"margin-top:27px;height:232px;\" class=\"chartEachTableContainer\"></div></div>");
			var thA=i18n("FENBUFENXI_TULI");
			var thB=i18n("FENBUFENXI_FENZU");
			var thC=i18n("FENBUFENXI_ZHANBI");
			jQ("#analyze_chartContainer_"+a+"").append("<table id=\"analyze_chartContainer_"+a+"_table\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\" style=\"table-layout:fixed;width:100%;border:1px solid #eaeaea;border-right:0;border-bottom:0;border-radius:4px\"><tr style=\"font-size:14px\"><th class=\"fenbufenxi_td\"  style=\"height:38px\"  width=\"19%\">"+thA+"</th><th class=\"fenbufenxi_td\"  style=\"height:38px\"  width=\"54%\">"+thB+"</th><th class=\"fenbufenxi_td\"  style=\"height:38px\"  width=\"26%\">"+thC+"</th></tr></table>")
			for(var b=0;b<defaultTableLength;b++){
					jQ("#analyze_chartContainer_"+a+"_table").append("<tr><td class=\"fenbufenxi_td\"></td><td class=\"fenbufenxi_td\"></td><td class=\"fenbufenxi_td\"></td></tr>")
			}
	}
}

fenbu_fenxi.To_gradeName=function(data_){
	var array_=this.dialog_filterAndGroup.gradeObj__;
	for(var a=0;a<array_.length;a++){
			if(array_[a].objName==data_){
					return array_[a].grade_name;
			}
	}
	return data_
}

fenbu_fenxi.doCombination=function(arr){
	var totalArr = [];// 总数组
	if(arr.length==0){
		return totalArr
	}
	else{
		var count = arr.length - 1; //数组长度(从0开始)
		var tmp = [];
		return doCombinationCallback(arr, 0);//从第一个开始
		//js 没有静态数据，为了避免和外部数据混淆，需要使用闭包的形式
		function doCombinationCallback(arr, curr_index) {
			for(val of arr[curr_index]) {
				tmp[curr_index] = val;//以curr_index为索引，加入数组
				//当前循环下标小于数组总长度，则需要继续调用方法
				if(curr_index < count) {
						doCombinationCallback(arr, curr_index + 1);//继续调用
				}else{
						totalArr.push(tmp);//(直接给push进去，push进去的不是值，而是值的地址)
				}
				//js  对象都是 地址引用(引用关系)，每次都需要重新初始化，否则 totalArr的数据都会是最后一次的 tmp 数据；
				oldTmp = tmp;
				tmp = [];
				for(index of oldTmp) {
						tmp.push(index);
				}
			}
			return totalArr;
		}
	}
}

fenbu_fenxi.searchData=function(){
	var jq=jQuery;
	var that=this;
	jq("#display_container_fenzu").find(".bg32beea").each(function(){
	  var storedText=jq(this).parent().parent().find(".hiddenContent").text();
		that.fenzu_id_array.push(storedText);
	})
  jq("#distributionAnalysis_searchButton").unbind();
	var dimensionConditions_=[];
	var choosedQuotasInPage=this.choosedQuotasInPage;
	var measure_para="";//指标参数
	var fenzuPara_original="";//分组参数
	if(typeof choosedQuotasInPage["display_container_zhibiao"]!="undefined"){
		measure_para = (choosedQuotasInPage["display_container_zhibiao"].map(function (item) {
			return item.id;
		})).join(",");
	};
	if(typeof choosedQuotasInPage["display_container_fenzu"]!="undefined"){
		fenzuPara_original = (choosedQuotasInPage["display_container_fenzu"].map(function (item) {
			return item.id;
		})).join(",");
	};
	var fenzuPara_array=fenzuPara_original.split(":");
  var fenzuPara=fenzuPara_array[0]
	var l1_len=jq("#filter_display_container").children().length;
	var array_condition=[];
	for(var i=0;i<l1_len;i++){
	  var array_condition_l2=[];
		var title=jq("#filter_display_container").find(".hiddenCategary").eq(i).text();
		var l2_len=jq("#filter_display_container"+i+"_son").children().length; 
		for(var j=0;j<l2_len;j++){
		  var l2_name=jq("#filter_display_container"+i+"_son").find(".ifLongSuplusStyle").eq(j).text();
			if(jq("#filter_display_container"+i+"_son").find(".each_checkbox_filter_display").eq(j).children().attr("class")=="bg32beea"){
				array_condition_l2.push(title+"="+"'"+l2_name+"'");
			}
		}
		if(array_condition_l2.length>0){
			array_condition.push(array_condition_l2)
		}
	};
	var combine_filterCondition_=[];
	if(l1_len!=0)
	{combine_filterCondition_=this.doCombination(array_condition)};
	var combineBodyData={
			"dimensionConditions": combine_filterCondition_
	};
	if((l1_len==0)||combine_filterCondition_.length==0){
			combineBodyData={}
	}
	var beginStr="";
	var endStr="";
	if(document.getElementById("date_picker_begin-datepicker-input").value!="")
	{
			beginStr=document.getElementById("date_picker_begin-datepicker-input").value+"T00:00:00"+encodeURIComponent("+")+"0800";
	}
	if(document.getElementById("date_picker_end-datepicker-input").value!="")
	{
			endStr=document.getElementById("date_picker_end-datepicker-input").value+"T00:00:00"+encodeURIComponent("+")+"0800";
	}
	var time_unit="day";
	this.measure_=measure_para;
	if(measure_para.length==0){
		trendAnalysis_Lib.openMessageDialog(i18n("TRENDANALYSIS_DIALOG_CONTENT2"));
		return;
	};
	var url_ = this.aquadaasData + '/aquadaas/rest/analytics/' + time_unit + '?measure='+measure_para+'&dimension='+fenzuPara+'&begin_time='+beginStr+'&end_time='+endStr+'';
	url_ += '&app_key=' + paasAppKey;
	url_ += '&timestamp=' + new Date().toISOString();
	jQuery.ajax({
			url: url_,
			data: JSON.stringify(combineBodyData),
			type: 'POST',
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign('POST', url_)
			}
	}).done(function(data){
			jQuery("#searchResultContainer").empty();
			that.dataFromServer=data;
			if(data.length==0){
					alert(i18n("FENBUFENXI_NODATA"));
					that.drawDefaultTable();
			}
		 else{
					that.drawSeachrResults(data,measure_para,fenzuPara);
			}
	}).fail(function (jqXHR, textStatus) {
			jQuery("#searchResultContainer").empty();
			alert(i18n("FENBUFENXI_SEARCHFAIL"));
			that.drawDefaultTable();
	}).always(function(){
		document.getElementById("distributionAnalysis_searchButton").onclick=function(){fenbu_fenxi.searchData()};
	});
}

fenbu_fenxi.formatGroupData=function(arr,fenzu,measure){
 var map = {},
	dest = [];
	for(var i = 0; i < arr.length; i++){
		var ai = arr[i];
		var str="";
		for(var a = 0; a < fenzu.length; a++){
			str=str+"&"+ai[fenzu[a]]//每组数据的各分组项值组成的唯一键
		}
		if(!map[str]){
			dest.push(ai);
			map[str] = ai;
		}else{
			for(var j = 0; j < dest.length; j++){
				var dj = dest[j];
				var str_="";
				for(var a = 0; a < fenzu.length; a++){
					str_=str_+"&"+dj[fenzu[a]]//每组数据的各分组项值组成的唯一键
				}
				if((str_) == (str)){
					for(var b = 0; b < measure.length; b++){
					  var dj_measure_b=0;
						var ai_measure_b=0;
						if(typeof ai[measure[b]]!="undefined"){
							ai_measure_b=parseInt(ai[measure[b]]);
						};
						if(typeof dj[measure[b]]!="undefined"){
							dj_measure_b=parseInt(dj[measure[b]]);
						}
						dj[measure[b]]=dj_measure_b+ai_measure_b;
					}
				}
			}	
		}
	}
	return dest
}

fenbu_fenxi.bubbleSort=function(arr,containerid){
  var self=this;
	var jq=jQuery;
	var len = arr.length;
	var display_container_zhibiao=self.choosedQuotasInPage["display_container_zhibiao"];
　for (var i = 0; i < len; i++){
		for (var j = 0; j < len - 1 - i; j++) {
			var currentQuotaValueInCurrentGroup=0;
			var currentQuotaValueInCurrentGroupSecond=0
			var data_unit=arr[j];
			var dataUnitSecond=arr[j+1];
			for(var k in data_unit){
				if(k==containerid){
					if(data_unit[k]==""){
						currentQuotaValueInCurrentGroup=0
					}
					else{
						currentQuotaValueInCurrentGroup=parseInt(data_unit[k]);
					};
					if(dataUnitSecond[k]==""){
						currentQuotaValueInCurrentGroupSecond=0
					}
					else{
						currentQuotaValueInCurrentGroupSecond=parseInt(dataUnitSecond[k]);
					}
				}
			};
			if (currentQuotaValueInCurrentGroup < currentQuotaValueInCurrentGroupSecond) { //相邻元素两两对比
　　　　var temp = arr[j+1]; //元素交换
　　　　arr[j+1] = arr[j];
　　　　arr[j] = temp;
　　　}
		}
	};
　return arr;
},

fenbu_fenxi.drawSeachrResults=function(data_old,measure,fenzu){
  var data_=this.formatGroupData(data_old,fenzu.split(","),measure.split(","));
  var jq=jQuery;
	var self=this;
	if(typeof this.choosedQuotasInPage["display_container_zhibiao"]!="undefined"){//选择了指标
		for(var i= 0,len_quotaNumber = self.choosedQuotasInPage["display_container_zhibiao"].length;i<len_quotaNumber;i++){
			var display_container_zhibiao=self.choosedQuotasInPage["display_container_zhibiao"];
			var lr=((i%2==0)?"left":"right");
			var l1_style="width:calc(50% - 24px);height:271px;border:1px #eaeaea solid;overflow:hidden;margin-top:39px;";
			var l2_a_style="float:left;height:100%;width:208px";
			var l2_a_l3_style="height:23px;width:100%;overflow:hidden;margin-left:15px;margin-top:13px";
			var l2_a_l3_l4_a_style="font-size:12px;float:left;width:auto;height:24px;line-height:24px";
			var l2_a_l3_l4_b_ele="<div style=\"font-size:6px;float:left;width:26px;;height:11px;text-align:center;line-height:11px;border-radius:2px;background-color:#fd807f;color:#fff9f9;font-family:Arial;margin-left:6px;font-weight:bold\">index</div></div>";
			var l2_b_style="float:right;height:100%;width:calc(100% - 220px);margin-right:12px;color:#848484;";
			var table_td1_l1_style="width:100%;height:100%;position:relative";
			var table_td1_l2_style="position: absolute; top: 6px; bottom: 6px; left: 6px; right: 6px;";
			var table_td2_style="font-size:13px;;white-space: nowrap;word-break: keep-all;text-overflow: ellipsis;overflow:hidden";
			var table_td3_style="color:#1c1615;font-size:15px;white-space: nowrap;word-break: keep-all;text-overflow: ellipsis;overflow:hidden";
			jq("#searchResultContainer").append("<div style=\"float:"+lr+";"+l1_style+"\"><div style=\""+l2_a_style+"\"><div style=\""+l2_a_l3_style+"\"><div style=\""+l2_a_l3_l4_a_style+"\">"+display_container_zhibiao[i].name+"</div>"+l2_a_l3_l4_b_ele+"<div style=\"height:calc(100% - 39px);width:100%;position:relative;\"><div id=\"echartt_"+i+"\" style=\"position:absolute;height:220px;width:calc(100% + 220px);top:0px;z-index:5\"></div></div></div><div style=\""+l2_b_style+"\"><div id=\"analyze_chartContainer_"+i+"\" style=\"margin-top:27px;height:232px;\" class=\"chartEachTableContainer\"></div></div></div>");
			var thArray=[i18n("FENBUFENXI_TULI"),i18n("FENBUFENXI_FENZU"),i18n("FENBUFENXI_ZHANBI")];
			var thWidthArray=["19.38%","43%","36.3%"];
			var colorArray=["#C23531", "#2F4554", "#61A0A8", "#D48265", "#91C7AE", "#749F83", "#CA8622", "#BDA29A", "#6E7074",  "#546570", "#C4CCD3","#37A2DA","#32C5E9","#67E0E3","#9FE6B8","#FFDB5C","#FF9F7F","#FB7293","#E062AE","#E690D1","#E7BCF3","#9D96F5","#8378EA","#96BFFF","#DD6B66","#759AA0","#E69D87","#8DC1A9","#EA7E53","#EEDD78","#73A373","#7289AB","#91CA8C","#F49F42"];//参考echarts官方页面的theme主题
			var colorArray_concat=["#C23531", "#2F4554", "#61A0A8", "#D48265", "#91C7AE", "#749F83", "#CA8622", "#BDA29A", "#6E7074",  "#546570", "#C4CCD3","#37A2DA","#32C5E9","#67E0E3","#9FE6B8","#FFDB5C","#FF9F7F","#FB7293","#E062AE","#E690D1","#E7BCF3","#9D96F5","#8378EA","#96BFFF","#DD6B66","#759AA0","#E69D87","#8DC1A9","#EA7E53","#EEDD78","#73A373","#7289AB","#91CA8C","#F49F42"];//参考echarts官方页面的theme主题
			jq("#analyze_chartContainer_"+i+"").append("<table id=\"analyze_chartContainer_"+i+"_table\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\" style=\"table-layout:fixed;width:100%;border:1px solid #eaeaea;border-right:0;border-bottom:0;border-radius:4px\"><tr id=\"analyze_chartContainer_"+i+"_table_th\" style=\"font-size:14px\"></tr></table>");
			for(var j= 0,th_length = thArray.length;j<th_length;j++){
				jq("#analyze_chartContainer_"+i+"_table_th").append("<th class=\"fenbufenxi_td\" style=\"height:38px\"  width=\""+thWidthArray[j]+"\">"+thArray[j]+"</th>")
			} 
			var groupCount=data_.length;//数据返回长度代表分组(行数);
			var minTrCount=5;
			var surplusCount=minTrCount-groupCount;
			var currentQuotaInAllGroup_count=0;//当前指标在所有指标累加和。
			var currentQuotaInAllGroup_array=[];
			var td_color_array=[];
			for(var j= 0;j<groupCount;j++){
				var data_unit=data_[j];
				for(var k in data_unit){
					if(k==display_container_zhibiao[i].id){
					  if(data_unit[k]!=""){
						currentQuotaInAllGroup_count=currentQuotaInAllGroup_count+parseInt(data_unit[k]);
						}
					}
				};
			}
			var beginColorIndex=0;
			while (colorArray.length<groupCount)
      {
       colorArray=colorArray.concat(colorArray_concat)
      }
			
			//排序
			var dataTemp=this.bubbleSort(data_,display_container_zhibiao[i].id);
			var data_=dataTemp;
			for(var j= beginColorIndex;j<groupCount;j++){
				beginColorIndex=j;
				var current_td1_color=colorArray[j];
				if(typeof colorArray[j]=="undefined"){
					current_td1_color=colorArray[0];
					beginColorIndex=0;
				}
				td_color_array.push(current_td1_color);
				var data_unit=data_[j];
				var data_unit_groupValueCombine=[];
				var currentQuotaInCurrentGroup_percent=" 0% ( 0 )";//当前指标在当前分组的值。
				var currentQuotaValueInCurrentGroup=0;
				for(var k in data_unit){
				  if(jq.inArray(k,self.fenzu_id_array)!=-1){
						data_unit_groupValueCombine.push(data_unit[k])
					};
					if(k==display_container_zhibiao[i].id){
						if(data_unit[k]==""){
							currentQuotaValueInCurrentGroup=0
						}
						else{
							currentQuotaValueInCurrentGroup=parseInt(data_unit[k]);
						}
						if(currentQuotaInAllGroup_count!=0){//分母不能为0
							if((currentQuotaInAllGroup_count=="")||(data_unit[k]=="")){
								currentQuotaInCurrentGroup_percent=" 0% ( 0 )"
							}
							else
							{
							currentQuotaInCurrentGroup_percent=(Math.round(parseInt(data_unit[k])/currentQuotaInAllGroup_count*100)+"%"+" ("+" "+parseInt(data_unit[k])+" "+")")
							};
						}
						else{
							currentQuotaInCurrentGroup_percent=" 0% ( 0 )"
						}
					}
				};
				var data_unit_groupValueCombine_str=data_unit_groupValueCombine.join("&");
				if(data_unit_groupValueCombine_str=="&"){data_unit_groupValueCombine_str=""};
				var td1_html="<td class=\"fenbufenxi_td\"><div style=\""+table_td1_l1_style+"\"><div style=\"background-color:"+current_td1_color+";"+table_td1_l2_style+"\"></div></div></td>";
				var td2_html="<td style=\""+table_td2_style+"\" title=\""+data_unit_groupValueCombine_str+"\" class=\"fenbufenxi_td\">"+data_unit_groupValueCombine_str+"</td>";
				var td3_html="<td  class=\"fenbufenxi_td\" title=\""+currentQuotaInCurrentGroup_percent+"\" style=\""+table_td3_style+"\">"+currentQuotaInCurrentGroup_percent+"</td>";
				jq("#analyze_chartContainer_"+i+"_table").append("<tr>"+td1_html+""+td2_html+""+td3_html+"</tr>");
				currentQuotaInAllGroup_array.push({value:currentQuotaValueInCurrentGroup,name:data_unit_groupValueCombine_str});
			};
			self.drawPie(i,currentQuotaInAllGroup_array,td_color_array,display_container_zhibiao[i].name);
			if(surplusCount>0){
			  for(var a= 0;a<surplusCount;a++){
					jq("#analyze_chartContainer_"+i+"_table").append("<tr><td class=\"fenbufenxi_td\"></td><td class=\"fenbufenxi_td\"></td><td class=\"fenbufenxi_td\"></td></tr>");
				}
			}
			jq("#analyze_chartContainer_"+i+"").mCustomScrollbar({
        axis: 'y'
			});
		}
	}
}
fenbu_fenxi.drawPie=function(index_,pieData,pieColorArray,title){
	var jq=jQuery;
	var that=this;
	jq(".chartEachTableContainer").eq(index_).mCustomScrollbar({
			axis: 'yx'
	});
	var option = {
			title : {
					text: '',
					subtext: '',
					x:'center'
			},
			tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
					x : 'center',
					y : 'bottom',
					data:['']
			},
			toolbox: {
					show : false,
					feature : {
							mark : {show: true},
							dataView : {show: false, readOnly: false},
							magicType : {
									show: true,
									type: ['pie', 'funnel']
							},
							restore : {show: false},
							saveAsImage : {show: true}
					}
			},
			color:pieColorArray,//自己设置扇形图颜色
			calculable : true,
			series : [
					{
							name:title,
							type:'pie',
							radius : [20, 76],
							center : ['96', '129'],
							roseType : 'radius',
							label: {
									normal: {
											show: false
									},
									emphasis: {
											show: false
									}
							},
							lableLine: {
									normal: {
											show: false
									},
									emphasis: {
											show: true
									}
							},
							data:pieData
					}
			]
	};
	//初始化echarts实例
	var myChart = echarts.init(document.getElementById('echartt_'+index_+''));
	myChart.setOption(option);
};
fenbu_fenxi.fillFilterDisplay=function(){
    this.popupReturnData=this.dialog_filterAndGroup.filterObj_;
    var data_=this.popupReturnData;
    if(typeof data_== "undefined" ){return};
    var array1=data_.filter.book;
    var array2=data_.filter.grade;
    var array3=data_.filter.school;
    var quota_=data_.quota;
    var gradeObjNameArray_=data_.gradeObjNameArray_?data_.gradeObjNameArray_:"";
    var arrayCombine1=array1.concat(array2);
    var arrayCombine2=arrayCombine1.concat(array3);
    jQuery("#filter_display_container").empty();
    jQuery("#display_container_zhibiao").empty();
}

fenbu_fenxi.popup_filterAndGroup=function(){
    this.dialog_filterAndGroup.open();
}

fenbu_fenxi.initCalendar=function(){
    var datePicker_start = new DatePicker({
        containerId: "date_picker_begin",
        editable: true,
        dateInputStyles: {
            borderColor: "#eaeef0",
            width: "142px"
        },
        calendarStyles: {
            width: 250,
            navTitleHeight: 25,
            navTitleBgColor: 'rgb(84,190,245)',
            datesViewHeight: 160,
            datesViewGridColor: 'rgb(226,226,226)',
            datesViewCellColor: 'rgb(254,254,254)',
            weekdaysHeight: 22,
            weekdaysColor: 'rgb(74,174,237)',
            currMonthColor: 'rgb(121,121,121)',
            nonCurrMonthColor: 'rgb(200,200,200)',
            align: 'right'
        },
				calendarObj:{"day":1}
    });
     var datePicker_end = new DatePicker({
        containerId: "date_picker_end",
        editable: true,
        dateInputStyles: {
            borderColor: "#eaeef0",
            width: "142px"
        },
        calendarStyles: {
            width: 250,
            navTitleHeight: 25,
            navTitleBgColor: 'rgb(84,190,245)',
            datesViewHeight: 160,
            datesViewGridColor: 'rgb(226,226,226)',
            datesViewCellColor: 'rgb(254,254,254)',
            weekdaysHeight: 22,
            weekdaysColor: 'rgb(74,174,237)',
            currMonthColor: 'rgb(121,121,121)',
            nonCurrMonthColor: 'rgb(200,200,200)',
            align: 'right'
        },
				calendarObj:{}
    });
};
fenbu_fenxi.groupStatus_action=function(){
  var jq=jQuery;
	jq("#distribution_fenzuMenu_body").css("display","none");
	jq("#distribution_fenzuMenu_top").find("img").css("transform","rotate(0deg)");
  var jq=jQuery;
	var self=this;
	if(this.groupStatus=="chooseQuotas_hasGroup"){
		jq("#distributionAnalysis_filterButton").css({
			"background-color":"#2dbce8",
			"border":"2px solid #11a8d7",
			"color":"#ffffff"
		});
		jq("#distributionAnalysis_filterButton").find("img").attr("src","content/distributionAnalysis/image/filter.png");
		jq("#distributionAnalysis_filterButton").unbind().bind('click',function(){
		 if(typeof self.choosedQuotasInPage["display_container_zhibiao"]=="undefined"){
			trendAnalysis_Lib.openMessageDialog(i18n("TRENDANALYSIS_DIALOG_CONTENT2"));
      return;
		 }
			var selected=self.actionChecker_getSelected;
			if(self.relationShip_quotas_group!=null){
				var selected_len=selected.length;
				var relationShip_quotas_group_for_selectedQuotas={};
				for(var i=0;i<selected_len;i++){
					var quotaKey=selected[i].key;
					if(self.relationShip_quotas_group[quotaKey]){
						relationShip_quotas_group_for_selectedQuotas[quotaKey]=self.relationShip_quotas_group[quotaKey]
					}
				}
			  var formatFenzuData=self.formatFenzuData(relationShip_quotas_group_for_selectedQuotas);
				var formatFenzuData_array=[];
				for(var i=0;i<formatFenzuData.length;i++){
					for(var j=0;j<formatFenzuData[i].length;j++){
						formatFenzuData_array.push(formatFenzuData[i][j])
					}
				};
				var formatFenzuData_array_distinct = [];
				for (var w = 0; w < formatFenzuData_array.length; w++) {
					var count = 0;
					for (var y = 0; y < formatFenzuData_array_distinct.length; y++) {
						if (formatFenzuData_array_distinct[y] == formatFenzuData_array[w]) {
							count++;
						}
					}
					if (count < 1) formatFenzuData_array_distinct.push(formatFenzuData_array[w]);
				}
				var formatFenzuData_array_distinct_len=formatFenzuData_array_distinct.length;
				if(self.groupingArray.length==0){//初次进入过滤框时。
					for(var i=0;i<formatFenzuData_array_distinct_len;i++){
						var formatFenzuData_array_distinct_commonSplit=formatFenzuData_array_distinct[i].split(":");
						var obj_={
							"id":formatFenzuData_array_distinct_commonSplit[0],
							"selected":[]
						};
						obj_.name=((typeof formatFenzuData_array_distinct_commonSplit[1]!="undefined")?formatFenzuData_array_distinct_commonSplit[1]:"");
						self.groupingArray.push(obj_);
					}	
				}
		  }
		 //}
     trendAnalysis_Lib.openFilterDialog(self.groupingArray,function(result){
			self.groupingArray=result;
			self.listFilterData(result);
     });		 
	 });
	}
	else{
		jq("#distributionAnalysis_filterButton").css({
			"background-color":"#f6f6f6",
			"border":"2px solid #e2dfdf",
			"color":"#c3c3c3"
		});
		jq("#distributionAnalysis_filterButton").find("img").attr("src","content/distributionAnalysis/image/filter_dark.png");
		jq("#distributionAnalysis_filterButton").unbind();
	}
};

fenbu_fenxi.init();
