function PopupDialog_filterAndGroup(confObj) {
	if (confObj) {
    this.filterArray=["年级","教材","学校"];
    this.filterType="grade";
		this.local = confObj.local;
		this.localContent = confObj.content;
    this.filter_obj_exist=[];
		this.htmlUri = confObj.url;
		this.dialogWidth = confObj.width;
		this.dialogHeight = confObj.height;
		this.perWidth = confObj.perWidth;
		this.perHeight = confObj.perHeight;
		this.ajaxOnEachCreate = confObj.ajaxOnEachCreate;
		this.callbackRef = confObj.context;
		this.drawnCallback = confObj.callback;
		this.calSupport = confObj.calSupport;
    this.company_tifOrgCode_="";
    this.gradeObj__=[];
		this.quotaobj=confObj.data;
		/*
        this.quotaobj=[{id:"sbas_1",name:"新用户数"},
        {id:"sbas_2",name:"活跃用户人数"},
        {id:"sbas_3",name:"活跃度"},
        {id:"sbas_4",name:"核心课观看人数"},
        {id:"sbas_5",name:"练习课观看人数"},
        {id:"sbas_6",name:"练习课互动人数"},
        {id:"sbas_7",name:"知识课观看人数"},
        {id:"sbas_8",name:"核心课报名人数"},
        {id:"sbas_9",name:"练习课报名人数"},
        {id:"sbas_10",name:"知识课报名人数"},
        {id:"sbas_11",name:"练习课预约人数"},
        {id:"sbas_12",name:"产品包购买人数"},
        {id:"sbas_13",name:"活跃用户次数"},
        {id:"sbas_14",name:"核心课观看次数"},
        {id:"sbas_15",name:"练习课观看次数"},
        {id:"sbas_16",name:"练习课互动次数"},
        {id:"sbas_17",name:"知识课观看次数"},
        {id:"sbas_18",name:"核心课报名次数"},
        {id:"sbas_19",name:"练习课报名次数"},
        {id:"sbas_20",name:"知识课报名次数"},
        {id:"sbas_21",name:"练习课预约次数"},
        {id:"sbas_22",name:"产品包购买次数"},
        {id:"sbas_23",name:"观看人数"},
        {id:"sbas_24",name:"互动人数"},
        {id:"sbas_25",name:"课程报名人数"},
        {id:"sbas_26",name:"课程预约人数"},
        {id:"sbas_27",name:"完成作业人数"},
        {id:"sbas_28",name:"完成测试题人数"},
        {id:"sbas_29",name:"讨论区发言人数"},
        {id:"sbas_30",name:"论坛发言人数"},
        {id:"sbas_31",name:"手工签到人数"},
        {id:"sbas_32",name:"绑定手机人数"},
        {id:"sbas_33",name:"用户登录人数"},
        {id:"sbas_34",name:"观看次数"},
        {id:"sbas_35",name:"互动次数"},
        {id:"sbas_36",name:"课程报名次数"},
        {id:"sbas_37",name:"课程预约次数"},
        {id:"sbas_38",name:"完成作业次数"},
        {id:"sbas_39",name:"完成测试题次数"},
        {id:"sbas_40",name:"讨论区发言次数"},
        {id:"sbas_41",name:"论坛发言次数"},
        {id:"sbas_42",name:"用户登录次数"},
        {id:"sbas_43",name:"手工签到次数"},
        {id:"sbas_44",name:"绑定手机次数"},
        {id:"sbas_45",name:"慕课观看人数"},
        {id:"sbas_46",name:"慕课观看次数"},
        {id:"sbas_47",name:"普通课程观看人数"},
        {id:"sbas_48",name:"普通课程看次数"},
        {id:"sbas_49",name:"微课观看人数"},
        {id:"sbas_50",name:"微课观看次数"}]
		*/
    }

	if (!this.perWidth)
		this.dialogWidth = parseInt(this.dialogWidth, 10);

	if (!this.perHeight)
		this.dialogHeight = parseInt(this.dialogHeight, 10);
	this.init();
};

PopupDialog_filterAndGroup.maskId = 'popup-dialog-mask';
PopupDialog_filterAndGroup.dialogId = 'popup-dialog-dialog';

PopupDialog_filterAndGroup.prototype.getCurrUserInfo = function() {
    var res = {};
    var that=this;
    var xhr = new my.aqua.xhr();
    var url = my.aqua.restRoot +  my.aqua.encodePath(my.aqua.xgxPath + "总公司/users") + my.aqua.userName+ "?metadata;";
    xhr.open("GET", url, false);
    my.aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
    xhr.send();
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
        var jsonData = JSON.parse(xhr.responseText);
        if(jsonData && jsonData.metadata){
            res=jsonData.metadata;
        }
    }else{
        console.log("获取当前登录用户的相关信息失败");
    }
    return res;
}

PopupDialog_filterAndGroup.clear = function() {
    var mask;
    var dialog;
    while ( mask = document.getElementById(PopupDialog_filterAndGroup.maskId)) {
        jQuery(mask).remove();
    }

    while ( dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId)) {
        jQuery(dialog).remove();
    }

    if (PopupDialog_filterAndGroup.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog_filterAndGroup.reLocateDialogFunc);
        PopupDialog_filterAndGroup.reLocateDialogFunc = null;
    }
};

PopupDialog_filterAndGroup.scrollIntoView = function() {
    window.scrollTo(0, 0);
};

PopupDialog_filterAndGroup.prototype.init = function() {
};

PopupDialog_filterAndGroup.prototype.locate = function(mask, dialog) {
	jQuery(mask).css({
		position : 'fixed',
		left : 0,
		top : 0,
		width : '100%',
		height : '100%',
		zIndex : 1000,
		backgroundColor : 'rgba(0,0,0,0.5)'
	});

	var jqDialog = jQuery(dialog);
	var normalDialogLeft, normalDialogTop;

	if (this.perWidth) {
		var widthPer = parseInt(this.dialogWidth, 10);
		normalDialogLeft = '' + Math.floor(50 - widthPer / 2) + '%';
	} else {
		if(this.calSupport){
			normalDialogLeft = Math.floor((window.innerWidth - this.dialogWidth)/2);
		}else{
			var dialogOffsetHorizontal = Math.floor(this.dialogWidth / 2);
			normalDialogLeft = 'calc( 50% - ' + dialogOffsetHorizontal + 'px )';
		}
	}

	if (this.perHeight) {
		var heightPer = parseInt(this.dialogHeight, 10);
		normalDialogHeight = '' + Math.floor(50 - heightPer / 2) + '%';
	} else {
		if(this.calSupport){
			normalDialogTop = Math.floor((window.innerHeight - this.dialogHeight)/2);
		}else{
			var dialogOffsetVertical = Math.floor(this.dialogHeight / 2);
			normalDialogTop = 'calc( 50% - ' + dialogOffsetVertical + 'px )';
		}
	}

	jqDialog.css({
		position : 'absolute',
		left : normalDialogLeft,
		top : normalDialogTop,
		width : this.dialogWidth,
		height : this.dialogHeight,
		zIndex : 1001
	});
	
	if(!this.calSupport){
		jqDialog.css({
			left: '-webkit-' + normalDialogLeft,
			top: '-webkit-' + normalDialogTop
		});
	}

	function reLocateDialog() {
		var dialogLeft = dialog.offsetLeft;
		var dialogTop = dialog.offsetTop;

		if (dialogLeft < 0) {
			dialogLeft = 0;
		} else {
			dialogLeft = normalDialogLeft;
		}

		if (dialogTop < 0) {
			dialogTop = 0;
		} else {
			dialogTop = normalDialogTop;
		}

		jqDialog.css({
			left : dialogLeft,
			top : dialogTop
		});

		dialogLeft = dialog.offsetLeft;
		dialogTop = dialog.offsetTop;

		if (dialogLeft <= 0) {
			dialogLeft = 0;
		} else {
			dialogLeft = normalDialogLeft;
		}

		if (dialogTop <= 0) {
			dialogTop = 0;
		} else {
			dialogTop = normalDialogTop;
		}

		jqDialog.css({
			left : dialogLeft,
			top : dialogTop
		});
	}

	reLocateDialog();

	if (PopupDialog_filterAndGroup.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog_filterAndGroup.reLocateDialogFunc);
    }
	PopupDialog_filterAndGroup.reLocateDialogFunc = reLocateDialog;
	jQuery(window).bind('resize', PopupDialog_filterAndGroup.reLocateDialogFunc);
};

PopupDialog_filterAndGroup.prototype.getLocalContent = function() {
	var localContent = this.localContent || '';
	var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
	if (dialog) {
		dialog.innerHTML = patchHTML(localContent);
		if (this.drawnCallback && this.callbackRef)
			this.drawnCallback.call(this.callbackRef);
	}
};

PopupDialog_filterAndGroup.prototype.bindPopupEvent = function() {
    var that=this;
    var gradeObjNameArray=[];
    jQuery("#Popup_filterAndGroup_close").bind('click', function () {
        that.close()
    });
    jQuery("#manage_dialog_warn_foot_cancel_btn").bind('click', function () {
        that.close()
    });
    jQuery("#manage_dialog_warn_foot_confirm_btn").bind('click', function () {
        var filterArray=[];
        var zhibiaoArray=[];
        var jq=jQuery;
        jq("#filter_filtergroupContainer").find(".delete_div").each(function(){
            filterArray.push({"text":jq(this).find(".delete_words").text(),"type":jq(this).attr("name")});
            gradeObjNameArray.push(jq(this).find(".delete_words").attr("name"));
            })
        jq("#zhibiao_filtergroupContainer").find(".delete_div").each(function(){
            zhibiaoArray.push(jq(this).find(".delete_words").text());
        })
        var filterObj={
            "filter":{//过滤
                "grade":filterArray.reverse(),
                "book":[],
                "school":[]
            },
            "quota":zhibiaoArray.reverse(),//指标,
            "gradeObjNameArray_":gradeObjNameArray.reverse()
        };
        that.close();
        if (that.drawnCallback){
            that.filterObj_=filterObj;
            that.drawnCallback.call(that.callbackRef);
        }
    });
    this.drawContainer("filter");
    this.drawContainer("zhibiao");
}


PopupDialog_filterAndGroup.prototype.getOrgDataByCompanyName = function(_companyName){
    var tifOrgCode = "";
    if(_companyName == "总公司"){
        tifOrgCode = MANAGER.organizationCode;
    }else{
        var xhr = new my.aqua.xhr();
        var url = my.aqua.restRoot +  my.aqua.encodePath(my.aqua.xgxPath + _companyName  +"/") + "?metadata;objectID;";
        xhr.open("GET", url, false);
        my.aqua.addXHRHeaderRequest(xhr, "GET", url, "cdmi-container");
        xhr.send();
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
            data = JSON.parse(xhr.responseText);
            if(data.metadata.company_tifOrgCode){
                tifOrgCode =  data.metadata.company_tifOrgCode;
            }
        }else{
            console.log("获取" + _companyName +"的相关信息失败");
        }
    }

    return tifOrgCode;
};

PopupDialog_filterAndGroup.prototype.getOrgDataByCompanyNameB = function (_companyName) {
    var data_ = "";
    var xhr = new my.aqua.xhr();
    var url = my.aqua.restRoot + my.aqua.encodePath(my.aqua.xgxPath + _companyName + "/") + "?metadata;";
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


PopupDialog_filterAndGroup.prototype.getGrades = function() {
    this.currUserInfo_=this.getCurrUserInfo();
    var user_organization_=this.currUserInfo_.user_organization;
    var company_tifOrgCode=this.getOrgDataByCompanyName(user_organization_);
    this.company_tifOrgCode_=company_tifOrgCode;
    var orgPath = (company_tifOrgCode == MANAGER.organizationCode) ? company_tifOrgCode : MANAGER.organizationCode + "/" + company_tifOrgCode;
    var parent_uri = my.aqua.tifPath + 'schedules/' + orgPath + '/';
    var object_type = "application/cdmi-object";
    var result_spec = {
        "objectID": "1",
        "objectName": "1",
        "parentURI": "1",
        "metadata": {
            "grade_type": "1",
            "grade_name": "1"
        }
    };
    var scope_spec = [{
        "objectType": "== " + object_type,
        "parentURI": "== " + parent_uri,
        "metadata": {
            "grade_type": "*",
            "grade_name": "*"
        }
    }];

    var specs = {
        'cdmi_scope_specification': scope_spec,
        'cdmi_results_specification': result_spec
    };
    var url = my.aqua.restRoot + "/cdmi_query/?sort=alphabet-";
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, false);
    my.aqua.addXHRHeaderRequest(xhr, "PUT", url, object_type);
    xhr.send(JSON.stringify(specs));

    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
        data = JSON.parse(xhr.responseText);
    }else{
        console.log("获取年级列表信息失败");
    }
    return data;
}

PopupDialog_filterAndGroup.prototype.getOrgData = function() {
    var that=this;
    var org="";
    var orgArray=[];
    if(this.currUserInfo_&&this.currUserInfo_.user_organization){
        org=this.getOrgDataByCompanyNameB(this.currUserInfo_.user_organization);
        orgArray.push(org.metadata.company_name);
       // orgArray.push(org);
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

        /*
        if(childOrgData && childOrgData.container){
            for(var i = 0; i < childOrgData.container.length; i++){
                orgDataList.push(childOrgData.container[i]);
            }
        }
        orgNum += childOrgData.count;
        */
    }
    return orgArray
}

PopupDialog_filterAndGroup.prototype.getChildDataByObjectID = function(parent_id){
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

PopupDialog_filterAndGroup.prototype.getObjectID = function(){
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

PopupDialog_filterAndGroup.prototype.getBooksList=function(){
    this.currUserInfo_=this.getCurrUserInfo();
    var user_organization_=this.currUserInfo_.user_organization;
    var company_tifOrgCode=this.getOrgDataByCompanyName(user_organization_);
    this.company_tifOrgCode_=company_tifOrgCode;
    var orgPath = (company_tifOrgCode == MANAGER.organizationCode) ? company_tifOrgCode : MANAGER.organizationCode + "/" + company_tifOrgCode;
    var parent_uri = my.aqua.tifPath + 'schedules/' + orgPath + '/';
    var object_type = "application/cdmi-object";
    var result_spec = {
        "metadata": {
            "book_name": "1"
        }
    };
    var scope_spec = [{
        "objectType": "== " + "application/cdmi-object'",
        "parentURI": "== " + "/default/tif/textbooks/books/"
    }];
    if(this.currUserInfo_.user_organization!="总公司"){
        scope_spec[0].metadata={
            book_organization: 'multi- ' + this.company_tifOrgCode_  + ',' + MANAGER.organizationCode
        };
    }
    var specs = {
        'cdmi_scope_specification': scope_spec,
        'cdmi_results_specification': result_spec
    };
    var url = my.aqua.restRoot + "/cdmi_query/?sort=alphabet-";
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, false);
    my.aqua.addXHRHeaderRequest(xhr, "PUT", url, object_type);
    xhr.send(JSON.stringify(specs));
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
        data = JSON.parse(xhr.responseText);
    }else{

    }
    return data;
}

PopupDialog_filterAndGroup.prototype.setDownMenuWidth = function(array_,para) {//设置弹出窗体中最小宽度：最小108像素，最多324像素。
    var jq=jQuery;
		var compare=this.compare
    array_.sort(compare);  
		var maxWidth="";
		if(array_[array_.length-1]>324){maxWidth="324px"}
		else if(array_[array_.length-1]<108){maxWidth="108px"}
    else{maxWidth=array_[array_.length-1]+"px"};
		var maxWidth_menuB=parseInt(maxWidth)-4+"px";
		jq("#filterAndGroup_menuBody_"+para+"_son").children().each(function(){
        jq(this).width(maxWidth);
    })
		jq("#filterAndGroup_menuBody_"+para+",#filterAndGroup_menuBody_"+para+"_son,#filterAndGroup_menuBody_"+para+",#filterAndGroup_menuTemp_"+para+",#"+para+"_filtergroupContainer__son_menuContainer").width(maxWidth);
		if(para=="filter"){//指标没有一级分类的下拉菜单。
			jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").width(maxWidth_menuB);
			jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").children().each(function(){
					jq(this).width(maxWidth_menuB);
			})
		}
	}
PopupDialog_filterAndGroup.prototype.compare = function (x, y) {//比较函数
		if (x < y) {
			return -1;
		} else if (x > y) {
			return 1;
		} else {
			return 0;
		}
}

PopupDialog_filterAndGroup.prototype.showDownMenu = function(para) {
    var that=this;
    if(document.getElementById("filterAndGroup_menuTemp_"+para+"")!=null){
        return;
    }
    var contentArray=[];
    var gradeObjNameArray=[];
    var objArray=[];
    var menuTitle="";
	var gradeLength_=0;
    switch(para){
        case "filter":
            var gradeObj=this.getGrades().objects;
            var gradeObj__=[];
            for(var a=0;a<gradeObj.length;a++){
                gradeObj__.push({"grade_name":gradeObj[a].metadata.grade_name,"objName":gradeObj[a].objectName})
            }
            this.gradeObj__=gradeObj__;
            if(gradeObj)
            {
				gradeLength_=gradeObj.length;
                for(var a=0;a<gradeObj.length;a++){
                    contentArray.push(gradeObj[a].metadata.grade_name);
                    gradeObjNameArray.push(gradeObj[a].objectName);
                }
            }
            menuTitle="年级";
            break;
        case "zhibiao":
            var quotaobj_=this.quotaobj;
            for(var a=0;a<quotaobj_.length;a++)
            {
                contentArray.push(quotaobj_[a].name)
            }
            menuTitle="指标";
            break;
        default:
            break;
    }
    var that=this;
    var jq=jQuery;
    var menuTopStyle="width:108px;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;margin-top:10px;margin-left:14px;height:24px;border:1px #dcdcdc solid;font-size:12px;color:#848484;background-color:#ffffff;cursor:pointer";
		var diverse=3;
		var topDistance=parseInt(jQuery("#PopupDialog_filterAndGroup_addButton_"+para+"").position().top)+parseInt(jQuery("#PopupDialog_filterAndGroup_addButton_filter").css("marginTop"));
		var leftDistance=parseInt(jQuery("#PopupDialog_filterAndGroup_addButton_"+para+"").position().left)+parseInt(jQuery("#PopupDialog_filterAndGroup_addButton_filter").css("marginLeft"))+108;
		var firstRowMarginLeft=14;
		if(leftDistance+132>(jq("#"+para+"_filtergroupContainer_parent").innerWidth()+diverse)){//换行
			topDistance=topDistance+parseInt(jQuery("#PopupDialog_filterAndGroup_addButton_"+para+"").css("marginTop"))+parseInt(jQuery("#PopupDialog_filterAndGroup_addButton_filter").innerHeight());
			leftDistance=firstRowMarginLeft;
		}
		if(topDistance>jq("#"+para+"_filtergroupContainer_parent").innerHeight()+3){
			topDistance=jq("#"+para+"_filtergroupContainer_parent").innerHeight()
		}
		jq("#"+para+"_filtergroupContainer_parent").append("<div id=\""+para+"_filtergroupContainer__son_menuContainer\" style=\""+menuTopStyle+";position;absolute;left:"+leftDistance+"px;top:"+topDistance+"px;position:absolute;margin-left:0;margin-top:0;z-index:2\"><div id=\"filterAndGroup_menuTemp_"+para+"\" style=\"position:relative;width:100%;height:100%\"><div id=\"filterAndGroup_menuTemp_"+para+"_menuTitle\"style=\"width:auto;position:absolute;left:2px;right:2px;top:2px;border:1px #dcdcdc solid;height:18px;overflow:hidden\"><div style=\"float:left;width:auto;height:18px;line-height:18px;padding-left:10px;font-weight:bold\" class=\"ifLongSuplusStyle\">"+menuTitle+"</div><img src=\"images/downMenu.png\" style=\"float:right;margin-right:9px;margin-top:4px\"></div></div>");
		var maxMenuContainerHeight=3+30*3+6+"px";
    var maxMenuContainerHeightb=3+30*3+"px";
    var menuBodyContainerStyle="background-color:#ffffff;z-index:10;border-left:1px #dcdcdc solid;border-right:1px #dcdcdc solid;position:absolute;top:25px;left:-1px;height:auto;max-height:"+maxMenuContainerHeight+";overflow-y:auto;overflow-x:hidden;width:auto;";
    var menuBodyContainerStyleb="background-color:#ffffff;z-index:10;border-left:1px #dcdcdc solid;border-right:1px #dcdcdc solid;position:absolute;top:25px;left:-1px;height:auto;max-height:"+maxMenuContainerHeightb+";width:100%;";
    jq("#filterAndGroup_menuTemp_"+para+"").append("<div id=\"filterAndGroup_menuBody_"+para+"\" style=\""+menuBodyContainerStyleb+";max-height:300px\"></div>");
    var class_="";
    var array__=[];
    jq("#filterAndGroup_menuBody_"+para+"").append("<div id=\"filterAndGroup_menuBody_"+para+"_son\" style=\"height:auto;width:100%;\"></div>");
		jq("#filterAndGroup_menuBody_"+para+"").each(function(){
        jQuery(this).mCustomScrollbar({
            axis: 'y'
        });
    })
		var td_leftCheckBoxStyle="border-radius:2px;position:absolute;height:14px;width:14px;border:1px #d6d6d6 solid;left:16px;top:7px";
		var td_leftCheckBox_sonStyle="border-radius:1px;margin-left:2px;margin-top:2px;height:10px;width:10px";
		for(var a=0;a<contentArray.length;a++)
    {
        if(para=="zhibiao")
        {jq("#filterAndGroup_menuBody_"+para+"_son").append("<div id=\"menuBodySon_"+para+"_"+a+"\" title=\""+contentArray[a]+"\" style=\"height:30px;width:200px;border-bottom:1px #dcdcdc solid;position:relative;overflow-x:hidden;background-color:#ffffff;z-index:10;\"><div class=\"each_checkbox_"+para+"\" style=\""+td_leftCheckBoxStyle+"\"><div class=\""+class_+"\" style=\""+td_leftCheckBox_sonStyle+"\"></div></div><div class=\"ifLongSuplusStyle\" style=\"text-align:left;position:absolute;left:47px;height:28px;line-height:28px;width:auto;\">"+contentArray[a]+"</div></div>")}
        else{
			  jq("#filterAndGroup_menuBody_"+para+"_son").append("<div id=\"menuBodySon_"+para+"_"+a+"\" title=\""+contentArray[a]+"\" style=\"height:30px;width:200px;border-bottom:1px #dcdcdc solid;position:relative;overflow-x:hidden;background-color:#ffffff;z-index:10;\"><div class=\"each_checkbox_"+para+"\" style=\""+td_leftCheckBoxStyle+"\"><div class=\""+class_+"\" style=\""+td_leftCheckBox_sonStyle+"\"></div></div><div name=\""+gradeObjNameArray[a]+"\" class=\"ifLongSuplusStyle\" style=\"text-align:left;position:absolute;left:47px;height:28px;line-height:28px;width:auto;\">"+contentArray[a]+"</div></div>")
			}
        var width__=47+ jq("#menuBodySon_"+para+"_"+a+"").find(".ifLongSuplusStyle").outerWidth()+2+23+"px";
        array__.push(parseInt(width__))
    }
		this.setDownMenuWidth(array__,para);
    var h=document.getElementById("filterAndGroup_menuBody_"+para+"_son").offsetHeight+"px";
    document.getElementById("filterAndGroup_menuBody_"+para+"").style.height=h;
    jq("#filterAndGroup_menuBody_"+para+"").children().each(function(){
    });
    var buttonTop=document.getElementById("filterAndGroup_menuBody_"+para+"").offsetHeight+25+"px";
    jq("#filterAndGroup_menuTemp_"+para+"").append("<div id=\"filterAndGroup_button_"+para+"_container\" style=\""+menuBodyContainerStyle+"top:"+buttonTop+";height:32px;border:0;background-color:#ffffff;z-index:10;width:100%;display:none\"><div style=\"height:30px;border:0;position:relative;overflow-x:hidden;\"><div id=\"filterAndGroup_button_"+para+"\" style=\"border-radius:3px;color:#ffffff;font-size:12px;text-align:center;position:absolute;right:0;height:20px;line-height:20px;background-color:#2cbdea;border:0;bottom:0px;width:50px;\">确&nbsp&nbsp定</div></div></div>");
    var bodyTop=parseInt(jq("#filterAndGroup_menuBody_"+para+"").css("top"));
		var bodyH=document.getElementById("filterAndGroup_menuBody_"+para+"").offsetHeight;
		var top_=bodyTop+bodyH+"px";
		jq("#filterAndGroup_button_"+para+"_container").css({"top":top_,"display":"block"});
		var h__=document.getElementById("filterAndGroup_menuTemp_"+para+"").offsetHeight+document.getElementById("filterAndGroup_menuBody_"+para+"").offsetHeight+document.getElementById("filterAndGroup_button_"+para+"").parentNode.offsetHeight+"px";
    jq("#filterAndGroup_menuTemp_"+para+"").parent().height(h__);
    jQuery(".each_checkbox_"+para+"").each(function(){
        jQuery(this).bind('click', function () {
            if(jQuery(this).children().attr("class")==""){
                jQuery(this).children().attr("class","bg32beea")
            }
            else{
                jQuery(this).children().attr("class","")
            }
        })
    });
    jQuery("#filterAndGroup_button_"+para+"").bind('click',{para: para}, function () {
        that.addConditions(para)
    })
    /*
    jQuery("#filterAndGroup_menuBody_"+para+"").mCustomScrollbar({
        axis: 'yx'
    });
    */

    if(para=="zhibiao"){
        jq("#filterAndGroup_menuTemp_" + para + "").append("<div id=\"menuB_filterAndGroup_menuBody_" + para + "_sonMenu\" style=\"" + menuBodyContainerStyleb + ";z-index:100;display:none;border-bottom:1px solid #dcdcdc;height:30px;left:2px;top:22px;width:105px\"></div>");
        jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").append("<div class=\"menuB_menuBodySon_" + para + "_son\" id=\"menuB_menuBodySon_" + para + "_0\" style=\"height:30px;line-height:30px;text-align:center;width:auto;border-bottom:1px #dcdcdc solid;position:relative;overflow-x:hidden;background-color:#ffffff;z-index:10;\">"+i18n('FENBUFENXI_ZHIBIAOC')+"</div>")
    }

    if(para=="filter")
    {
        var filterArray_=this.filterArray;
        var width__=document.getElementById("filterAndGroup_menuTemp_"+para+"_menuTitle").offsetWidth-2+"px";
        jq("#filterAndGroup_menuTemp_" + para + "").append("<div id=\"menuB_filterAndGroup_menuBody_" + para + "_sonMenu\" style=\"" + menuBodyContainerStyleb + ";z-index:100;display:none;border-bottom:1px solid #dcdcdc;height:93px;left:2px;top:22px;width:" + width__ + "\"></div>");
        for (var a = 0; a < filterArray_.length; a++) {
           jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").append("<div class=\"menuB_menuBodySon_" + para + "_son\" id=\"menuB_menuBodySon_" + para + "_" + a + "\" style=\"height:30px;line-height:30px;text-align:center;width:auto;border-bottom:1px #dcdcdc solid;position:relative;overflow-x:hidden;background-color:#ffffff;z-index:10;\">"+filterArray_[a] +"</div>")
        }
        document.getElementById("filterAndGroup_menuTemp_"+para+"_menuTitle").onclick=function(){
            if(jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").css("display")=="none"){
                jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").css("display","block");
            }
            else{
                jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").css("display","none");
            }
            var w=document.getElementById("menuB_filterAndGroup_menuBody_" + para + "_sonMenu").offsetWidth+"px";
        }
        jq(".menuB_menuBodySon_" + para + "_son").each(function(){

            jq(this).bind('click', function () {
                jq("#menuB_filterAndGroup_menuBody_" + para + "_sonMenu").css("display","none");
                jq("#filterAndGroup_menuBody_"+para+"_son").empty();
                jq("#filterAndGroup_button_"+para+"_container").remove();
                var contentArray=[];
                var gradeObjNameArray=[];
                var text__=jq(this).text();
                jq("#filterAndGroup_menuTemp_"+para+"_menuTitle").find(".ifLongSuplusStyle").text(text__);
                switch(jq(this).text())
                {
                    case filterArray_[0]:


                        that.filterType="grade";
                        var gradeObj=that.getGrades().objects;
                        if(gradeObj)
                        {
                            gradeLength_=gradeObj.length;
                            for(var a=0;a<gradeObj.length;a++){
                                contentArray.push(gradeObj[a].metadata.grade_name);
                                gradeObjNameArray.push(gradeObj[a].objectName);
                            }
                        }
                        break;
                    case filterArray_[1]:
                        that.filterType="book";
                        var books=that.getBooksList();
                        if(books&&books.objects){
                            for(var a=0;a<books.objects.length;a++){
                                contentArray.push(books.objects[a].metadata.book_name)
                            }
                        }
                        for(var a=0;a<contentArray.length;a++){
                            gradeObjNameArray.push("");
                        }
                        break;
                    case filterArray_[2]:
                        that.filterType="school";
                        contentArray=that.getOrgData();

                        for(var a=0;a<contentArray.length;a++){
                            gradeObjNameArray.push("");
                        }
                        break;
                    default:
                        break;
                }
                var gradeLength_=0;
                var maxMenuContainerHeight=3+30*3+6+"px";
                var maxMenuContainerHeightb=3+30*3+"px";
                var menuBodyContainerStyle="background-color:#ffffff;z-index:10;border-left:1px #dcdcdc solid;border-right:1px #dcdcdc solid;position:absolute;top:25px;left:-1px;height:auto;max-height:"+maxMenuContainerHeight+";overflow-y:auto;overflow-x:hidden;width:auto;";
                var menuBodyContainerStyleb="background-color:#ffffff;z-index:10;border-left:1px #dcdcdc solid;border-right:1px #dcdcdc solid;position:absolute;top:25px;left:-1px;height:auto;max-height:"+maxMenuContainerHeightb+";width:auto;";
                var class_="";
                var array__=[];
                for(var a=0;a<contentArray.length;a++)
                {
                    jq("#filterAndGroup_menuBody_"+para+"_son").append("<div title=\""+contentArray[a]+"\" id=\"menuBodySon_"+para+"_"+a+"\" style=\"height:30px;width:auto;border-bottom:1px #dcdcdc solid;position:relative;overflow-x:hidden;background-color:#ffffff;z-index:10;width:200px;\"><div class=\"each_checkbox_"+para+"\" style=\"border-radius:2px;position:absolute;height:16px;width:16px;border:1px #d6d6d6 solid;left:16px;top:6px\"><div class=\""+class_+"\" style=\"border-radius:1px;margin-left:3px;margin-top:3px;height:10px;width:10px\"></div></div><div name=\""+gradeObjNameArray[a]+"\"  class=\"ifLongSuplusStyle\" style=\"text-align:left;position:absolute;left:47px;height:28px;line-height:28px;width:auto;\">"+contentArray[a]+"</div></div>")
                    var width__=47+ jq("#menuBodySon_"+para+"_"+a+"").find(".ifLongSuplusStyle").outerWidth()+23+"px";
                    array__.push(parseInt(width__))
                }
								that.setDownMenuWidth(array__,para);
                var h=document.getElementById("filterAndGroup_menuBody_"+para+"_son").offsetHeight+"px";
                document.getElementById("filterAndGroup_menuBody_"+para+"").style.height=h;
                var buttonTop=document.getElementById("filterAndGroup_menuBody_"+para+"").offsetHeight+25+"px";
                jq("#filterAndGroup_menuTemp_"+para+"").append("<div id=\"filterAndGroup_button_"+para+"_container\" style=\""+menuBodyContainerStyle+"top:"+buttonTop+";height:32px;border:0;background-color:#ffffff;z-index:10;width:100%;display:none\"><div style=\"height:30px;border:0;position:relative;overflow-x:hidden;\"><div id=\"filterAndGroup_button_"+para+"\" style=\"border-radius:3px;color:#ffffff;font-size:12px;text-align:center;position:absolute;right:0;height:20px;line-height:20px;background-color:#2cbdea;border:0;bottom:0px;width:50px;\">确&nbsp&nbsp定</div></div></div>");
								var bodyTop=parseInt(jq("#filterAndGroup_menuBody_"+para+"").css("top"));
								var bodyH=document.getElementById("filterAndGroup_menuBody_"+para+"").offsetHeight;
								var top_=bodyTop+bodyH+"px";
								jq("#filterAndGroup_button_"+para+"_container").css({"top":top_,"display":"block"});
								var h__=document.getElementById("filterAndGroup_menuTemp_"+para+"_menuTitle").offsetHeight+document.getElementById("filterAndGroup_menuBody_"+para+"").offsetHeight+document.getElementById("filterAndGroup_button_"+para+"").parentNode.offsetHeight+"px";
                jQuery("#filterAndGroup_button_"+para+"").bind('click',{para: para}, function () {
                    that.addConditions(para)
                })
                jq("#filterAndGroup_menuTemp_"+para+"").parent().height(h__);
                jQuery(".each_checkbox_"+para+"").each(function(){
                    jQuery(this).bind('click', function () {
                        if(jQuery(this).children().attr("class")==""){
                            jQuery(this).children().attr("class","bg32beea")
                        }
                        else{
                            jQuery(this).children().attr("class","")
                        }
                    })
                });
            })

        })//二层菜单。
    }
}

PopupDialog_filterAndGroup.prototype.drawContainer = function(para) {
    var addButtonText=i18n('FENBUFENXI_TIANJIAGUOLV');
    var minH="167px";
    switch(para){
        case "filter":
            addButtonText=i18n('FENBUFENXI_TIANJIAGUOLV');
            minH="167px";
            break;
        case "zhibiao":
            addButtonText=i18n('FENBUFENXI_TIANJIAZHIBIAO');
            minH="162px";
            break;
        default:
            break;
    }
    var that=this;
    var jq=jQuery;
    var data_=""+para+"_obj_exist";
    jq("#"+para+"_filtergroupContainer").empty();

    for(var a=0;a<data_.length;a++){}
    jq("#"+para+"_filtergroupContainer").append("<div style=\"height:auto;min-height:"+minH+";width:418px\" id=\""+para+"_filtergroupContainer__son\"><div id=\"PopupDialog_filterAndGroup_addButton_"+para+"\" style=\"vertical-align:top;display:inline-block;;margin-left:14px;margin-top:10px;width:94px;height:26px;position:relative;cursor:pointer\"><img src=\"images/addfilter.png\"  style=\"position:absolute;top:0;left:0;width:94px;height:26px;\"/><div style=\"color:#82daf6;height:26px;line-height:26px;position:absolute;left:31px;top:0px;font-weight:bold;font-size:12px\">"+addButtonText+"</div></div>")
    jq("#PopupDialog_filterAndGroup_addButton_"+para+"").bind('click', {para: para},function() {
        if(para=="filter"){  that.filterType="grade";}
        that.showDownMenu(para);
        });

    jQuery("#"+para+"_filtergroupContainer").mCustomScrollbar({
        axis: 'yx'
    });
}

PopupDialog_filterAndGroup.prototype.addConditions = function(para) {
    var jq=jQuery;
    var existContentsArray=[];
    jq("#"+para+"_filtergroupContainer__son").find(".delete_words").each(function(){
        existContentsArray.push(jq(this).text())
    });
    var that=this;
    var jq=jQuery;
    var addContents=[];
    var gradeObjNameArray=[];
    jq(".each_checkbox_"+para+"").each(function(){
            if(jq(this).children().attr("class")=="bg32beea"){
                addContents.push(jq(this).parent().find(".ifLongSuplusStyle").text());
            }
           if(para=="filter"){
               gradeObjNameArray.push(jq(this).parent().find(".ifLongSuplusStyle").attr("name"));
           }
    });
    jq("#filterAndGroup_menuTemp_"+para+"").parent().remove();
    for(var a=0;a<addContents.length;a++){
        if (jQuery.inArray(addContents[a], existContentsArray) != -1) {
            continue
        }
        jq("#"+para+"_filtergroupContainer__son").prepend("<div class=\"delete_div\" name=\""+that.filterType+"\" style=\"vertical-align:top;margin-top:10px;margin-left:14px;height:24px;line-height:24px;min-width:78px;width:auto;background-color:#7ad8f5;color:#e3f6fd;overflow:hidden;border:1px #52c4e7 solid;font-weight:bold;border-radius:4px;display:inline-block;\"><div class=\"delete_words\" name=\""+gradeObjNameArray[a]+"\" style=\"float:left;font-size:12px;width:auto;margin-left:10px;\">"+addContents[a]+"</div><img class=\"delete_icon\" src=\"images/smallCloseb.png\"  style=\"float:left;margin-left:19px;margin-top:7px;cursor:pointer\"/><div style=\"float:left;width:9px;height:100%\"></div></div></div>")
    };
    jq("#"+para+"_filtergroupContainer").find(".delete_icon").each(function(){
        jq(this).bind('click',function() {
				    var delete_div_width=jQuery(this).closest(".delete_div").outerWidth();
						if(document.getElementById(""+para+"_filtergroupContainer__son_menuContainer")!=null){//下拉菜单没关闭时去点击删除按钮。
							var tempElement=document.getElementById(""+para+"_filtergroupContainer__son_menuContainer");
							var topDistance=parseInt(tempElement.style.top);
              var leftDistance=parseInt(tempElement.style.left);
							var diverse=3;
							var firstRowMarginLeft=14;
							jQuery(this).closest(".delete_div").remove();
							if(leftDistance-firstRowMarginLeft-delete_div_width-diverse<0){//返回上一行
								var beforeButton=jQuery("#PopupDialog_filterAndGroup_addButton_"+para+"");
								leftDistance=(beforeButton.position().left+beforeButton.outerWidth()+firstRowMarginLeft+firstRowMarginLeft);
								topDistance=topDistance-36
							}
							else{
								leftDistance=leftDistance-firstRowMarginLeft-delete_div_width;
								if(leftDistance<14){leftDistance=14}
							}
							tempElement.style.top=topDistance+"px";
							tempElement.style.left=leftDistance+"px";
						}
						//var maxMenuContainerHeight=3+30*3+6+"px";
        });
    });
}

PopupDialog_filterAndGroup.prototype.deleteObj = function(obj) {
    jQuery(obj).closest(".delete_div").remove()
}

PopupDialog_filterAndGroup.prototype.getContentHtml = function() {
	if (!this.htmlUri)
		return;
	var self = this;
	if (this.ajaxOnEachCreate) {
		jQuery.get(this.htmlUri, function(data) {
			var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
			if (dialog) {
				dialog.innerHTML = patchHTML(data);
                self.bindPopupEvent();
                if (self.drawnCallback && self.callbackRef)
					self.drawnCallback.call(self.callbackRef);
			}
		});

	} else {

		if ((this.htmlUri == this.prevHtml) && this.htmlData) {
			var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
			if (dialog) {
				dialog.innerHTML = patchHTML(this.htmlData);
                self.bindPopupEvent();
				if (self.drawnCallback && self.callbackRef)
					self.drawnCallback.call(self.callbackRef);
			}
		} else {
			jQuery.get(this.htmlUri, function(data) {
				var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
				if (dialog) {
					dialog.innerHTML = patchHTML(data);
                    self.bindPopupEvent();
					self.htmlData = data;
					if (self.drawnCallback && self.callbackRef)
						self.drawnCallback.call(self.callbackRef);
				}
			});
			this.prevHtml = this.htmlUri;
		}

	}
};

PopupDialog_filterAndGroup.prototype.create = function() {
	var mask = document.getElementById(PopupDialog_filterAndGroup.maskId);
	var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
	if (mask || dialog) {
		PopupDialog_filterAndGroup.clear();
	}

	mask = document.createElement('div');
	mask.id = PopupDialog_filterAndGroup.maskId;
	document.body.appendChild(mask);
	dialog = document.createElement('div');
	dialog.id = PopupDialog_filterAndGroup.dialogId;
	document.body.appendChild(dialog);

	this.locate(mask, dialog);
	if (this.local)
		this.getLocalContent();
	else
		this.getContentHtml();
	PopupDialog_filterAndGroup.scrollIntoView();
};

PopupDialog_filterAndGroup.prototype.destroy = function() {
	PopupDialog_filterAndGroup.clear();
};

PopupDialog_filterAndGroup.prototype.open = function() {
	this.create();
};

PopupDialog_filterAndGroup.prototype.close = function() {
    PopupDialog_filterAndGroup.clear();
};

PopupDialog_filterAndGroup.prototype.show = function() {
	var mask = document.getElementById(PopupDialog_filterAndGroup.maskId);
	var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
	if (mask && dialog) {
		mask.style.display = 'block';
		dialog.style.display = 'block';
		PopupDialog_filterAndGroup.scrollIntoView();
	} else {
		this.create();
	}
};

PopupDialog_filterAndGroup.prototype.hide = function() {
	var mask = document.getElementById(PopupDialog_filterAndGroup.maskId);
	if (mask) {
		mask.style.display = 'none';
	}
	var dialog = document.getElementById(PopupDialog_filterAndGroup.dialogId);
	if (dialog) {
		dialog.style.display = 'none';
	}
};

PopupDialog_filterAndGroup.prototype.resize = function(obj, live) {
	if (obj && obj.width)
		this.dialogWidth = obj.width;
	if (obj && obj.height)
		this.dialogHeight = obj.height;
	
	if(live){
		this.locate(document.getElementById(PopupDialog_filterAndGroup.maskId), document.getElementById(PopupDialog_filterAndGroup.dialogId));
	}
};

jQuery(function(){
    jQuery(document.body).off('click', '.popup_dialog_clear').on('click', '.popup_dialog_clear', function(){
        PopupDialog_filterAndGroup.clear();
    });    
});
