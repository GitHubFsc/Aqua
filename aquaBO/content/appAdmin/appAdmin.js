var addAdmin={
  initPara:function(){
    this._listRows=15;
    this._listColumns=4;
    this._listData=[];
	this.currentPage=0;
    this._listTitles=[{
      label:  "App Key"
    }, {
      label: "App Name"
    }, {
      label: i18n("APP_ADMIN_NEED_TOKEN_CHECK")
    }, {
      label: "操作"
    }];
    this._listStyles={
      borderColor: "#E2E2E2",
      borderWidth: "1px",
      titleBg: "#45d1f4",
      titleColor: "#FFFFFF",
      titleHeight: "31px",
      cellBg: "white",
      evenBg: "#F5FDFF",
      cellColor: "#797979",
      cellHeight: "34px",
      footBg: "#FFFFFF",
      footColor: "#797979",
      inputBg: "#FFFFFF",
      inputBorder: "#CBCBCB",
      iconColor: "#0099CB",
      columnsWidth: [0.269, 0.286, 0.268, 0.171]
    };
    this.popupObjectNew = {
      url: "content/appAdmin/appAdmin_popup_add.html",
      width: 696,
      height: 574,
      context: this,
      callback: this.initPopup
    };
		this.popupObject = {
      url: "content/appAdmin/appAdmin_popup_add.html",
      width: 696,
      height: 636,
      context: this,
      callback: this.initPopup
    };
    this.squareIndex=0;
    this.action_="create";
    this.selectedObj={};
    this.fromData="";
		this.rawData=[];
		this.rowIndex=0;
  },
  resetAppSecret:function(){
    var appKey_=document.getElementById("appAdmin_appKey").value;
    var type_="POST";
    var url_=aquapaas_host+"/aquapaas/rest/application/"+appKey_+"/regenerate?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + ""
    jQuery.ajax({
      url: url_,
      type: type_,
      headers: {
        "Content-Type": "application/json",
        "x-aqua-sign":getPaaS_x_aqua_sign(type_,url_)
      }
    }).done(function (data) {
          var data=data;
          var newKey=(data&&data.app_secret)?data.app_secret:"";
          document.getElementById("addAdmin_appSecret_son").value=newKey;
        }).fail(function () {
          alert("重置失败")
        })
  },
  initPopupCommon:function(){
    var scropeTrLen=4;
    if(this.enterAppMethod=="notLogin")
    {
      for(var a=0;a<scropeTrLen;a++)
      {
        jQuery("#popup_app_tableRegion").append("<tr><td></td><td></td><td></td><td></td></tr>")
      }
      jQuery("#appAdmin_mainTable").css("visibility","visible");
      return;
    }
    var jQ=jQuery;
    var type_="GET";
    var url_=aquapaas_host+"/aquapaas/rest/gateway/scope?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + "";
    jQ.ajax({
      url: url_,
      type: type_,
      async: false,
      headers: {
        "Content-Type": "application/json",
        "x-aqua-sign":getPaaS_x_aqua_sign(type_,url_)
      }
    }).done(function (data) {
          var surplus_=0;

          //模拟数据
          /*var data=[{
            id : "app.admin",
            name : "管理",
            description : "可管理订单、用户等",
            resource_groups : [
              "order.admin",
              "user.admin",
              "notification.mass"
            ]
          },{
            id : "app.admin2",
            name : "管理2",
            description : "可管理订单、用户等2",
            resource_groups : [
              "order.admin",
              "user.admin",
              "notification.mass"
            ]
          }];*/
          //模拟数据


          for(var a=0;a<data.length;a++)
          {
            var data_=data[a];
            var id_=data_.id?data_.id:"";
            var name_=data_.name?data_.name:"";
            var description_=data_.description?data_.description:"";
            jQuery("#popup_app_tableRegion").append("<tr><td><div class=\"squareChoosed_outer\" onclick=\"addAdmin.switch_(this)\"><div style=\"display:none\" class=\"squareChoosed_inner\"></div></div></td><td>"+id_+"</td><td>"+name_+"</td><td>"+description_+"</td></tr>")
          }

          if(data.length<4)
          {surplus_=4-data.length};
          for(var a=0;a<surplus_;a++)
          {
            jQuery("#popup_app_tableRegion").append("<tr><td></td><td></td><td></td><td></td></tr>")
          };
					jQ("#appAdmin_mainTable").mCustomScrollbar({
						theme:"my-theme"
					});
          jQuery("#appAdmin_mainTable").css("visibility","visible")
        })
  },

  initPopup:function(){
	  var jq=jQuery;
    switch(this.action_)
    {
      case "create":
					this.__validComb = new newSelect("#app_admin_token_check_container", [{
						key: i18n("APP_ADMIN_NEED_TOKEN_TRUE"),
						value: "true"
					}, {
						key: i18n("APP_ADMIN_NEED_TOKEN_FALSE"),
						value: "false"
					}], {
						backgroundIMGStyle: 2,
						width: "100%",
						height: "32px",
						background: "#ffffff",
						selectbackground: "#ffffff"
					}, function () {
						//what to do
						// _this.__listTable.refreshList();
						//_this.query();
				});
        this.initPopupCommon();
        document.getElementById("appAdmin_button_commit").innerHTML="确定";
        break;
      case "edit":
				jq("#addAdmin_appSecret").css("width","calc(100% - 48px)");
        this.initPopupCommon();
        this.initPopupEdit();
        document.getElementById("appAdmin_button_commit").innerHTML="更新";
        break;
      case "onlyView":
        this.initPopupCommon();
        this.initPopupEdit();
				this.__validComb.setDisable();
        this.initPopupOnlyView();
        document.getElementById("appAdmin_button_commit").innerHTML="确定";
        break;
      default:
        break;
    }
  },
  initPopupOnlyView:function(){
	  var jq=jQuery;
		jq("#addAdmin_appSecret").parent().css("display","block");
		//jq("#app_admin_token_check_container").append("<div style=\"width:100%;height:100%;position:relative;\"></div>");
		jq("#app_admin_token_check_container").css("background-color","#ebebeb");
		jq("#app_admin_token_check_container").find(".select-status").css("background-color","#ebebeb");
		jq("#app_admin_token_check_container").find(".select-header").css("background-color","#ebebeb");
		jq(".app_admin_input_edit").each(function(){
			jq(this).removeClass("app_admin_input_white").addClass("app_admin_input_grey")
		});
    //jQuery("#appAdmin_tokenCheck").css("background-color","#ebebeb");
    jQuery(".squareChoosed_inner").each(function(){
         jQuery(this).css("background-color","#cccccc");
         jQuery(this).css("display","block");
    });
    jQuery(".squareChoosed_outer").each(function(){
      jQuery(this).css("background-color","#ebebeb");
    });
    jQuery("#addAdmin_resetSecret").css("display","none");
		document.getElementById("lectureCreatePage_info_course_description_value").readOnly=true;
		jq("#app_admin_token_check_container").find(".select-header").css("cursor","default")   
  },
  initPopupEdit:function(){
		var jq=jQuery;
		jq("#addAdmin_appSecret").parent().css("display","block");
		this.__validComb = new newSelect("#app_admin_token_check_container", [{
        key: i18n("APP_ADMIN_NEED_TOKEN_TRUE"),
        value: "true"
      }, {
        key: i18n("APP_ADMIN_NEED_TOKEN_FALSE"),
        value: "false"
      }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "32px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {
        //what to do
        // _this.__listTable.refreshList();
        //_this.query();
     });
		jq(".app_admin_input_edit").each(function(){
			jq(this).removeClass("app_admin_input_grey").addClass("app_admin_input_white")
		});
    var hasToken=jQuery(this.selectedObj).parent().find(".hasToken").text();
    var des_=jQuery(this.selectedObj).parent().find(".desc").text().replace("null","");
    var key_=jQuery(this.selectedObj).parent().parent().find("td").eq(0).text();
    var name_=jQuery(this.selectedObj).parent().parent().find("td").eq(1).text();
    var secret_=jQuery(this.selectedObj).parent().parent().find("td").eq(2).text();
		
    var allowed_scopes_=jQuery(this.selectedObj).parent().find(".allowed_scopes").text().split(",");
    document.getElementById("appAdmin_appKey").value=key_;
    document.getElementById("appAdmin_appName").value=name_;
    document.getElementById("lectureCreatePage_info_course_description_value").value=des_;
	var hasToken_=i18n("APP_ADMIN_NEED_TOKEN_TRUE");
	if( ( typeof(hasToken)=="undefined")||(hasToken=="false") ){
		hasToken_=i18n("APP_ADMIN_NEED_TOKEN_FALSE")
	};
	  jq("#app_admin_token_check_container").find(".select-header").text(hasToken_);
    document.getElementById("addAdmin_appSecret").style.display="inline-block";
    document.getElementById("addAdmin_resetSecret").style.display="inline-block";
		var currentRawDate=this.rawData[this.rowIndex];//here
		var secret_=currentRawDate.app_secret||"";
    document.getElementById("addAdmin_appSecret_son").value=secret_;//here
    if(this.action_=="edit")
    {document.getElementById("popupCenterDivTopLeft").innerHTML="编辑应用";}
    else{document.getElementById("popupCenterDivTopLeft").innerHTML="查看应用";};
    document.getElementById("appAdmin_appKey").readOnly=true;
    document.getElementById("addAdmin_appSecret_son").readOnly=true;
		jq("#appAdmin_appKey").removeClass("app_admin_input_white").addClass("app_admin_input_grey");
		jq("#addAdmin_appSecret_son").removeClass("app_admin_input_white").addClass("app_admin_input_grey");
    jQuery("#popup_app_tableRegion").find("tr").each(function(){
          for(var a=0;a<allowed_scopes_.length;a++)
          {
            if(allowed_scopes_[a]==jQuery(this).children("td").eq(1).text())
            {
              jQuery(this).children("td").eq(0).find(".squareChoosed_inner").css("display","block");
              continue;
            }
          }
        });
  },
  checkIfCanCommit:function(){
    if( (document.getElementById("appAdmin_appKey")!=null)&&(document.getElementById("appAdmin_appKey").value=="") )
    {alert("请填写App Key");return "canNotComit"}
    else if( (document.getElementById("appAdmin_appName")!=null)&&(document.getElementById("appAdmin_appName").value=="") )
    {alert("请填写App Name");return "canNotComit"}
    else{return "canComit"}
  },

  commit_:function(){
    if(this.enterAppMethod=="notLogin"){
      alert("请登录用户。");
      return;
    }
    if(this.checkIfCanCommit()=="canNotComit"){return}
    switch(this.action_)
    {
      case "create":
        this.commitApp("create");
        break;
      case "edit":
      case "onlyView":
        this.commitApp("edit");
        break;
      default:
        break;
    }
  },
  commitApp:function(key_){
	  var jq=jQuery;
	  var self=this;
    var key_=key_;
    var that=addAdmin;
    if(this.action_=="onlyView"){
      that.dialog.close();
      return;
    };
    var appKey_=document.getElementById("appAdmin_appKey").value;
    var appName=document.getElementById("appAdmin_appName").value;
		var tmp_=jq("#app_admin_token_check_container").find(".select-header").text();
    var tokenCheck=( tmp_==i18n("APP_ADMIN_NEED_TOKEN_FALSE")?true:false);
    var desc_=document.getElementById("lectureCreatePage_info_course_description_value").value;
    var scopeIdList=[];
    jQuery(".squareChoosed_inner").each(function(){
      if(jQuery(this).css("display")!="none")
      {
        var scopeId=jQuery(this).closest("tr").children("td").eq(1).text();
        scopeIdList.push(scopeId)
      }
    });
    var objStr=JSON.stringify({
      "name": appName,
      "description": desc_,
      "skip_token": tokenCheck,
      "allowed_scopes": scopeIdList
    });
    var type_="";
    switch(key_)
    {
      case "create":
        type_="POST";
        break;
      case "edit":
        type_="PUT";
        break;
      default:
        break;
    }
    var url_=aquapaas_host+"/aquapaas/rest/application/"+appKey_+"?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + "";
    jQuery.ajax({
      url: url_,
      type: type_,
      headers: {
        "Content-Type": "application/json",
        "x-aqua-sign":getPaaS_x_aqua_sign(type_,url_)
      },
      data: objStr
    }).done(function () {
			if(that._listTable&&typeof(that._listTable.currPage)== "undefined" )
            {
			  that.currentPage=0
            }
			else{
				that.currentPage=that._listTable.currPage;
			}
          if(key_=="edit")
          {
            var obj_=that.selectedObj;
            jQuery(obj_).closest("tr").children("td").eq(0).text(appKey_);
            jQuery(obj_).closest("tr").children("td").eq(1).text(appName);
						var tmp_=jq("#app_admin_token_check_container").find(".select-header").text();
            jQuery(obj_).closest("tr").children("td").eq(2).text(tmp_);
            jQuery(obj_).closest("tr").children("td").eq(3).find(".desc").text(desc_);
						var secret=document.getElementById("addAdmin_appSecret_son").value;
						self.rawData[self.rowIndex].app_secret=secret;
			var isHasToken_=( tmp_==i18n("APP_ADMIN_NEED_TOKEN_FALSE")?false:true);
			jQuery(obj_).parent().find(".hasToken").text(isHasToken_);
            that.dialog.close();
            return;
          }
          that.dialog.close();
          switch(that.fromData)
          {
            case "default":
              that.queryData();
              break;
            case "search":
              that.queryDataSearch();
              break;
            default:
              that.queryData();
              break;
          }
          that.updateListTable()
        }).fail(function () {
          that.dialog.close();
        })
  },
  refreshTable_search:function(e){
    if(this.enterAppMethod=="notLogin"){
      alert("请登录用户。");
      return;
    };
		var keyCode = e.which || e.keycode ||"";
		if(e=="button"){//点击按钮搜索
			keyCode=13
		};
    if(keyCode==13){
      var that=addAdmin;
      if(that._listTable&&typeof(that._listTable.currPage)!= "undefined" )
      {
        that._listTable.currPage=0;
      }
      that.queryDataSearch();
      that.updateListTable()
    }
  },
  queryDataSearch:function(){
	  var self=this;
    this.fromData="search";
    var that=addAdmin;
    var _self = that._listTable;
    var keyWord_=document.getElementById("search_input_").value;
    var type_="GET";
    var url_=aquapaas_host+"/aquapaas/rest/application/?name="+keyWord_+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + "";
    jQuery.ajax({
      url: url_,
      type: type_,
      async: false,
      headers: {
        "Content-Type": "application/json",
        "x-aqua-sign":getPaaS_x_aqua_sign(type_,url_)
      }
    }).done(function (data, status, xhr) {
          var response_ = data;
					self.rawData=data;
          var x_aqua_total_count= xhr.getResponseHeader("Content-Type");
          //_self.onTotalCount(x_aqua_total_count ? x_aqua_total_count : 1);
          //that.queryCallback(response_);
          addAdmin._listData=[];
          for(var a=0;a<data.length;a++)
          {
					  var skipRawData=false;//默认当值不存在时，是false;
						if((typeof data[a].skip_token!="undefined")&&(data[a].skip_token)&&(data[a].skip_token!=null)){
							skipRawData=data[a].skip_token//skipRawData值为true或者false
						};
						var needCheckToken=skipRawData?i18n("APP_ADMIN_NEED_TOKEN_FALSE"):i18n("APP_ADMIN_NEED_TOKEN_TRUE");
            var tokenCheck_=data[a].skip_token?false:true;
            var description_=data[a].description;
            var allowed_scopes_=data[a].allowed_scopes?(data[a].allowed_scopes):"";
            addAdmin._listData.push([{label:data[a].app_key},{label:data[a].name},{label:needCheckToken},{label:'<span class="row_index" style="display:none">'+a+'</span><span onclick="addAdmin.popup_App_onlyView(this)" class="wordsInTable">查看</span><span onclick="addAdmin.popup_App_edit(this)" class="wordsInTable" style="margin-left:27px">编辑</span><span onclick="addAdmin.popupDelete(this)" class="wordsInTable" style="margin-left:27px">删除</span><span style=\"display:none\" class=\'hasToken\'>'+tokenCheck_+'</span><span style=\"display:none\" class=\'desc\'>'+description_+'</span><span style=\"display:none\" class=\'allowed_scopes\'>'+allowed_scopes_+'</span>'}])
          }
        })
  },
  switch_:function(obj){
    if(this.action_=="onlyView"){return};
    var ele_=jQuery(obj).find(".squareChoosed_inner").css("display");
    if(ele_=="none")
    {
      jQuery(obj).find(".squareChoosed_inner").css("display","block");
      jQuery(obj).find(".squareChoosed_inner").attr("id","chosedIcon_scope")
    }
    else{
      jQuery(obj).find(".squareChoosed_inner").css("display","none");
    }
  },
  updateListTable: function (restorePage) {
    var that=addAdmin;
    this._listTable = new StyledList({
      containerId: "mainTableContainer",
      rows: this._listRows,
      columns: this._listColumns,
      titles: this._listTitles,
      styles: this._listStyles,
      listType: 0,
      async: false,
      data: addAdmin._listData,
	  currentPage:this.currentPage
    });
    this._listTable.create();
  },
  init:function(){
    this.enterAppMethod="login";
    if( ( (typeof(my.paas)=="undefined")||(my.paas==null) )||( (typeof(my.paas)=="undefined")||(my.paas==null) ) ) //免登录aquaPaas状态
    {this.enterAppMethod="notLogin"};
    this.queryData();
    this.updateListTable();
    this.bindEvent();
  },
  bindEvent:function(){
    var that=addAdmin;
    document.getElementById('ErrorMSG_close_cancelOrder').onclick = function () {
      that.opendialog('ErrorMSG_cancelOrder', false);
    };
    document.getElementById('ErrorMSG_cancel_cancelOrder').onclick = function () {
      that.opendialog('ErrorMSG_cancelOrder', false);
    }
  },
  queryCallback: function (response) {
    var _self = this._listTable;
    var results = response || [];
    var returnData=[];
    for(var i = 0; i < results.length; i++) {
      var tmp=results[i];
      returnData.push([{
        label: tmp.app_key
      }, {
        label: tmp.name
      }, {
        label:tmp.app_secret
      }, {
        label: ""
      }]);
    }
    return returnData
  },
  queryData: function (pageNumber) {
	  var self=this;
    if(this.enterAppMethod=="notLogin")//目前非登录授权无法查看数据，所以处理为空表格。
    {
      alert("请登录用户。");
      var rowCount_=this._listRows;
      for(var a=0;a<rowCount_;a++)
      {
        addAdmin._listData.push([{label:""},{label:""},{label:""},{label:""},{label:""}])
      }
      return;
    }
     this.fromData="default";
     var that=addAdmin;
     var _self = that._listTable;
     var type_="GET";
     var url_= aquapaas_host+"/aquapaas/rest/application/?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + "";
    jQuery.ajax({
      url: url_,
      type: type_,
      async: false,
      headers: {
        "Content-Type": "application/json",
        "x-aqua-sign":getPaaS_x_aqua_sign(type_,url_)
      }
    }).done(function (data, status, xhr) {
       var response_ = data;
			 self.rawData=data;
       var x_aqua_total_count= xhr.getResponseHeader("Content-Type");
       //_self.onTotalCount(x_aqua_total_count ? x_aqua_total_count : 1);
       //that.queryCallback(response_);
       addAdmin._listData=[];
       for(var a=0;a<data.length;a++)
       {
         var tokenCheck_=data[a].skip_token?false:true;
         var description_=data[a].description;
         var allowed_scopes_=data[a].allowed_scopes?(data[a].allowed_scopes):"";
				 var skipRawData=false;//默认当值不存在时，是false;
				 if((typeof data[a].skip_token!="undefined")&&(data[a].skip_token)&&(data[a].skip_token!=null)){
					 skipRawData=data[a].skip_token//skipRawData值为true或者false
				 };
				 var needCheckToken=skipRawData?i18n("APP_ADMIN_NEED_TOKEN_FALSE"):i18n("APP_ADMIN_NEED_TOKEN_TRUE");
         addAdmin._listData.push([{label:data[a].app_key},{label:data[a].name},{label:needCheckToken},{label:'<span class="row_index" style="display:none">'+a+'</span><span onclick="addAdmin.popup_App_onlyView(this)" class="wordsInTable">查看</span><span onclick="addAdmin.popup_App_edit(this)" class="wordsInTable" style="margin-left:27px">编辑</span><span onclick="addAdmin.popupDelete(this)" class="wordsInTable" style="margin-left:27px">删除</span><span style=\"display:none\" class=\'hasToken\'>'+tokenCheck_+'</span><span style=\"display:none\" class=\'desc\'>'+description_+'</span><span style=\"display:none\" class=\'allowed_scopes\'>'+allowed_scopes_+'</span>'}])
       }
    })
  },
  popupDelete:function(obj){
    var that=this;
    var appKey_=jQuery(obj).parent().parent().find("td").eq(0).text();
    var type_="DELETE";
    var url_=aquapaas_host+"/aquapaas/rest/application/"+appKey_+"?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"&user_id=" + my.paas.user_id+"&access_token=" + my.paas.access_token + "";
    var event = function () {
      jQuery.ajax({
        url: url_,
        type: type_,
        headers: {
          "Content-Type": "application/json",
          "x-aqua-sign":getPaaS_x_aqua_sign(type_,url_)
        }
      }).done(function (data) {
            that.opendialog('ErrorMSG_cancelOrder', false);
            alert("删除成功");
			
            if(that._listTable&&typeof(that._listTable.currPage)== "undefined" )
            {
			  that.currentPage=0
            }
			else{
				that.currentPage=that._listTable.currPage;
			}
            switch(that.fromData)
            {
              case "default":
                that.queryData();
                break;
              case "search":
                that.queryDataSearch();
                break;
              default:
                that.queryData();
                break;
            }
            that.updateListTable()
          }).fail(function () {
            that.opendialog('ErrorMSG_cancelOrder', false);
            alert("删除失败")
          })
    };
    var type = "cancel";
    var length=1;
    var obj = {
      type: type,
      event: event,
      callback: function () {
        var text_ = "您确定要删除\""+appKey_+"\"吗";
        document.getElementById('ErrorMes_cancelOrder').innerHTML = text_;
      }
    }
    this.openErrorMsgB(obj);
  },
  openErrorMsgB: function (obj, callback) {
    var self = this;
    if (!obj.type) {
      return;
    }
    if (obj.event) {
      document.getElementById('ErrorMSG_ok_cancelOrder').onclick = function () {
        obj.event();
        self.opendialog('ErrorMSG_cancelOrder', false);
      }
    }
    if (typeof obj.callback == 'function') {
      obj.callback();
    }
    this.opendialog('ErrorMSG_cancelOrder', true, callback);
  },
  opendialog: function (id, show, callback) {
    $(id + "Back").style.display = show == true ? "block" : "none";
    $(id).style.display = show == true ? "block" : "none";
    if (typeof callback == "function") {
      callback();
    }
  },
  popup_App:function(){
    this.action_="create";
    var that=this;
    that.dialog=new PopupDialog(this.popupObjectNew);
    that.dialog.open();
  },
  popup_App_edit:function(obj){
		var jq=jQuery;
	  this.rowIndex=jq(obj).closest("td").find(".row_index").text();
    this.selectedObj=obj;
    this.action_="edit";
    var that=this;
    that.dialog=new PopupDialog(this.popupObject);
    that.dialog.open();
  },
  popup_App_onlyView:function(obj){
	  var jq=jQuery;
	  this.rowIndex=jq(obj).closest("td").find(".row_index").text();
    this.selectedObj=obj;
    this.action_="onlyView";
    var that=this;
    that.dialog=new PopupDialog(this.popupObject);
    that.dialog.open();
  },
  mopen: function (object, id, isFather) {
    if( (id=="downMenu")&&(this.action_=="onlyView") ){return}
    jQuery(".downMenu").each(function () {
      if (id !== jQuery(this).attr("id")) {
        jQuery(this).css("display", "none")
      }
    });
    var ddmenuitem = jQuery("#" + id);
    if (ddmenuitem.css("display") == "none") {
      ddmenuitem.css("display", "block");
    }
    else {
      ddmenuitem.css("display", "none");
    }
    if (!isFather) {//子节点
      if (object) {
        var inputText = jQuery(object).text();
        var object_parent = jQuery(object).parent();
        var object_parentB = jQuery(object_parent).parent();
        jQuery(object_parentB).find("div[name='inputTitle']").text(inputText)
      }
    }
  },
  closeCenterDiv:function(){
  this.dialog.close();
  }
}
addAdmin.initPara();
addAdmin.init();