console.log(1);
//启动页面：MyPage.navToXiTongYongHuGuanLi();
var system_user_management= new Object();
system_user_management.init = function () {
  this.user = {
    username : storage_username,
    password : storage_password,
    domain: storage_domain,
    img_folder:storage_qualification_folder
  }
  this.return_usersData_thisPage={};
  this.current_row_index=0;
  my_aqua.init(this.user.username, this.user.password, this.user.domain);
  this.netdisk_user={};
  this.init_table_para();
  this.current_upload_file_url="";
  this.popupNewEditTop="";
  this.adv_user_role_array=[
    {"key":"0","value":""+i18n('ADV_SYSUSER_GUANGGAOZHU')+""},
    {"key":"1","value":""+i18n('ADV_SYSUSER_YUNYINGSHANG')+""},
    {"key":"2","value":""+i18n('ADV_SYSUSER_CHUBANZHE')+""}
    //{"key":"xiTongGuanLiJueSe","value":""+i18n('ADV_SYSUSER_XITONGGUANLIYUAN')+""}//3 为模拟数据user_type
  ];
  /*
  this.sysCategory=[
	{"displayName":""+i18n('ADV_SYSUSER_PAIQICHAKAN')+"","value":1},
	{"displayName":""+i18n('ADV_SYSUSER_GUANGGAOWEI')+"","value":2},
	{"displayName":""+i18n('ADV_SYSUSER_GUANGGAOSUCAI')+"","value":4},
	{"displayName":""+i18n('ADV_SYSUSER_GUANGGAOCELUE')+"","value":8},
	{"displayName":""+i18n('ADV_SYSUSER_SUCAISHENHE')+"","value":16},
	{"displayName":""+i18n('ADV_SYSUSER_CELUESHEHE')+"","value":32},
	{"displayName":""+i18n('ADV_SYSUSER_TOUFANGBAOGAOJITONGJIBAOGAO')+"","value":64},
	{"displayName":""+i18n('ADV_SYSUSER_BIAOQIANGUANLI')+"","value":128},
	{"displayName":""+i18n('ADV_SYSUSER_YONGHUGUANLI')+"","value":256},
	{"displayName":""+i18n('ADV_SYSUSER_HETONGGUANLI')+"","value":512},
	{"displayName":""+i18n('ADV_SYSUSER_ZHANDIANGUANLI')+"","value":1024},
	{"displayName":""+i18n('ADV_SYSUSER_ZENGQIANGSHENHE')+"","value":2048}
  ];
  */
  //新版权限控制
  this.sysCategory=[
	{"displayName":""+i18n('ADV_SYSUSER_PAIQICHAKAN')+"","value":1},
	{"displayName":""+i18n('ADV_SYSUSER_GUANGGAOWEI')+"","value":2},
	{"displayName":""+i18n('ADV_SYSUSER_BASIC_FUNCTION')+"","value":2048},
	{"displayName":""+i18n('ADV_SYSUSER_GUANGGAOSUCAI')+"","value":4096},//素材
	{"displayName":""+i18n('ADV_SYSUSER_SUCAIZU')+"","value":8192},//素材组
	{"displayName":""+i18n('ADV_SYSUSER_GUANGGAOCELUE')+"","value":8},
	{"displayName":""+i18n('ADV_SYSUSER_SUCAISHENHE')+"","value":16},
	{"displayName":""+i18n('MAIN_MENU_SUCAIFABU')+"","value":16777216},
	{"displayName":""+i18n('ADV_SYSUSER_CELUESHEHE')+"","value":32},
	{"displayName":""+i18n('ADV_SYSUSER_TONGJI_BAOBIAO')+"","value":16384},
	{"displayName":""+i18n('ADV_SYSUSER_JISHU_BAOBIAO')+"","value":32768},
	{"displayName":""+i18n('ADV_SYSUSER_RENSHU_BAOBIAO')+"","value":65536},
	{"displayName":""+i18n('ADV_SYSUSER_QUSHI_BAOBIAO')+"","value":131072},
	{"displayName":""+i18n('ADV_SYSUSER_TOUFANG_BAOGAO')+"","value":262144},
	{"displayName":""+i18n('ADV_SYSUSER_YUYUE_BAOGAO')+"","value":524288},
	{"displayName":""+i18n('ADV_SYSUSER_GUANLI')+"","value":1048576},
	{"displayName":""+i18n('ADV_SYSUSER_BIAOQIANGUANLI')+"","value":128},
	{"displayName":""+i18n('ADV_SYSUSER_HETONGGUANLI')+"","value":512},
	{"displayName":""+i18n('ADV_SYSUSER_XITONGYONGHU')+"","value":2097152},
	{"displayName":""+i18n('ADV_SYSUSER_ZIZHUYONGHU')+"","value":4194304},
	{"displayName":""+i18n('ADV_SYSUSER_YONGHUSHENHE')+"","value":8388608},
	{"displayName":""+i18n('ADV_SYSUSER_ZHANDIANGUANLI')+"","value":1024}
  ];
  
  //模拟
  /*
 this.gotoAuthPage(); 
  return;
  */
  
  
  this.draw_page_elements();//表格上方的元素。
  this.show_all_system_user();
  this.edit_row_in_all_data_index=0;//点击编辑所在的行的数据在所有数据中的index.
  this.init_popup_para();
  this.img_width=0;
  this.img_height=0;
  this.first_view_pic="";
  this.pageHeight={
	"new_notOpenSysUserCategory":728,
	"new_openSysUserCategory":890,
	"edit_notOpenSysUserCategory":659,
	"edit_openSysUserCategory":821,
  }
  this.popupFrom="new";
  //this.sucai_current_type = "img";
  this.initTitle();
  this.bindEvent();
};

system_user_management.gotoAuthPage =  function (data) {
	var $=jQuery;
	var self=this;
	var nStr="";
	var aStr="";
	for(var i= 0,len = 28;i<len;i++){
		nStr=nStr+"n";
		aStr=aStr+"a";
	};
	this.currentUserMenuRightAllNotChoose=nStr;
	this.currentUserMenuRightAllChoose=aStr;
	$("#sys-user-admin-page2-bottom").show();
	document.getElementById("adv_sysUserManage_auth_return").onclick=function(){
		$("#sys-user-admin-page2-bottom").hide();
		$("#adv_sysUserManage_index_page").show();
	    $("#adv_sysUserManage_auth_container").hide();
	};
	document.getElementById("sys-user-admin-page2-btn-cancel").onclick=function(){
		$("#sys-user-admin-page2-bottom").hide();
		$("#adv_sysUserManage_index_page").show();
	    $("#adv_sysUserManage_auth_container").hide();
	};
	document.getElementById("sys-user-admin-page2-btn-confirm").onclick=function(){//更新权限
		 var current_user_passID=system_user_management.return_usersData_thisPage.users[self.edit_row_in_all_data_index].user_id;
		 var update_data_array = {
			"metadata": {
			  AquaPaaSAdv_UserRight:self.authNum 
			 }
		  };
		  var url_update_user = paasHost + "/aquapaas/rest/users/other/"+current_user_passID;
		  url_update_user +="?user_id="+my.paas.user_id+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
		  var xhr_update_user = new XMLHttpRequest();
		  xhr_update_user.open("PUT", url_update_user, false);
		  xhr_update_user.setRequestHeader("Content-Type", "application/json");
		  xhr_update_user.setRequestHeader("Accept", "application/json");
		  xhr_update_user.setRequestHeader("x-aqua-sign",getPaaS_x_aqua_sign("PUT",url_update_user));
		  xhr_update_user.send(JSON.stringify(update_data_array));
		  if( (xhr_update_user.readyState == 4)&&(xhr_update_user.status == 200 || xhr_update_user.status == 0 || xhr_update_user.status == 304)){
		    $("#sys-user-admin-page2-bottom").hide();
			$("#adv_sysUserManage_index_page").show();
	        $("#adv_sysUserManage_auth_container").hide();
		  };
		  self.table_component.refreshList()
	};
    var title="";
    var authNum="";
    if(typeof data.metadata!="undefined"){
		if(typeof data.metadata.AquaPaaSAdv_UserRight!="undefined"){
			authNum=data.metadata.AquaPaaSAdv_UserRight
		};
		if(typeof data.metadata.AquaPaaSAdv_CompanyName!="undefined"){
			title=data.metadata.AquaPaaSAdv_CompanyName;
			if(title!=""){
				$("#adv_sysUserManage_company_name").text(title+i18n("ADV_SYSUSER_SHOUQUAN"))
			}
		}
	};
	
	//表示是转换权限格式（由 2048这种整形转为"nnnnnnannnnna"）之前的用户
	console.log(authNum);
	console.log(typeof authNum);
	if(typeof authNum !="string"){
		authNum=this.currentUserMenuRightAllNotChoose
	};
	this.authNum=authNum;
	if(authNum!=""){
		//权限字符串长度是会变化的
		if(authNum.length<this.currentUserMenuRightAllNotChoose.length){
			var currentUserMenuRight=this.authNum;
			var diff=(self.currentUserMenuRightAllNotChoose.length-this.authNum.length);
			var nValue="";
			for(var i= 0,len = diff;i<len;i++){
				nValue=nValue+"n"//缺少位补n
			}
			this.authNum=currentUserMenuRight+nValue
		}
	}
	else{//AquaBO_menuUserRight在metadata里不存在，或者为空字符串
		this.authNum=self.currentUserMenuRightAllNotChoose//默认没任何权限
	};
	
	var jq=jQuery;
	jq("#adv_sysUserManage_index_page").hide();
	jq("#adv_sysUserManage_auth_container").show();
	document.getElementById("sys-user-admin-page2-part2-menu-tree-table").innerHTML="";
	document.getElementById("sys-user-admin-page2-part2-menu-tree").innerHTML="";
	var zTreeObj;
	var self=this;
	this.allChooseClickBySelf="false";
	this.treeInitFinish=false;
	
	var minHeight=28;
	
	var zNodes=[{
		name: i18n("ADV_SYSUSER__ALL_CHOOSE"),
		open: true,
		menuTreeId:"all",
		children: [{
			name: i18n("ADV_SYSUSER_PAIQICHAKAN"),
			open: true,
			height:minHeight,
			menuTreeId:0
		},{
			name: i18n("ADV_SYSUSER_GUANGGAOWEI"),
			open: true,
			height:minHeight,
			menuTreeId:1
		},{
			name: i18n("ADV_SYSUSER_BASIC_FUNCTION"),
			open: true,
			height:86,
			menuTreeId:2,
			children: [{
				name: i18n("ADV_SYSUSER_GUANGGAOSUCAI"),
				open: true,
				height:minHeight,
				menuTreeId:3
			},{
				name: i18n("ADV_SYSUSER_SUCAIZU"),
				open: true,
				height:minHeight,
				menuTreeId:4
			},{
				name: i18n("ADV_SYSUSER_GUANGGAOCELUE"),
				open: true,
				height:minHeight,
				menuTreeId:5
			}]
		},{
			name: i18n("ADV_SYSUSER_SUCAISHENHE"),
			open: true,
			height:115,
			menuTreeId:6,
			children: [{
				name: i18n("ADV_SYSUSER_SUCAICHUSHEN"),
				open: true,
				height:minHeight,
				menuTreeId:7
			},{
				name: i18n("ADV_SYSUSER_SUCAIZHONGSHEN"),
				open: true,
				height:minHeight,
				menuTreeId:8
			},{
				name: i18n("MAIN_MENU_SUCAIFABU"),
				open: true,
				height:minHeight,
				menuTreeId:9
			},{
				name: i18n("ADV_SYSUSER_SUCAIQITING"),
				open: true,
				height:minHeight,
				menuTreeId:10
			}]
		},{
			name: i18n("ADV_SYSUSER_CELUESHEHE"),
			open: true,
			height:86,
			menuTreeId:11,
			children: [{
				name: i18n("ADV_SYSUSER_CELUECHUSHEN"),
				open: true,
				height:minHeight,
				menuTreeId:12
			},{
				name: i18n("ADV_SYSUSER_CELUEZHONGSHEN"),
				open: true,
				height:minHeight,
				menuTreeId:13
			},{
				name: i18n("ADV_SYSUSER_CELUEQITING"),
				open: true,
				height:minHeight,
				menuTreeId:14
			}]
		},{
			name: i18n("ADV_SYSUSER_TONGJI_BAOBIAO"),
			open: true,
			height:144,
			menuTreeId:15,
			children: [{
				name: i18n("ADV_SYSUSER_JISHU_BAOBIAO"),
				open: true,
				height:minHeight,
				menuTreeId:16
			},{
				name: i18n("ADV_SYSUSER_RENSHU_BAOBIAO"),
				open: true,
				height:minHeight,
				menuTreeId:17
			},{
				name: i18n("ADV_SYSUSER_QUSHI_BAOBIAO"),
				open: true,
				height:minHeight,
				menuTreeId:18
			},{
				name: i18n("ADV_SYSUSER_TOUFANG_BAOGAO"),
				open: true,
				height:minHeight,
				menuTreeId:19
			},{
				name: i18n("ADV_SYSUSER_YUYUE_BAOGAO"),
				open: true,
				height:minHeight,
				menuTreeId:20
			}
		  ]
		},{
			name: i18n("ADV_SYSUSER_GUANLI"),
			open: true,
			height:144,
			menuTreeId:21,
			children: [{
				name: i18n("ADV_SYSUSER_BIAOQIANGUANLI"),
				open: true,
				height:minHeight,
				menuTreeId:22
			},{
				name: i18n("ADV_SYSUSER_HETONGGUANLI"),
				open: true,
				height:minHeight,
				menuTreeId:23
			},{
				name: i18n("ADV_SYSUSER_XITONGYONGHU"),
				open: true,
				height:minHeight,
				menuTreeId:24
			},{
				name: i18n("ADV_SYSUSER_ZIZHUYONGHU"),
				open: true,
				height:minHeight,
				menuTreeId:25
			},{
				name: i18n("ADV_SYSUSER_YONGHUSHENHE"),
				open: true,
				height:minHeight,
				menuTreeId:26
			}
		  ]
		},{
			name: i18n("ADV_SYSUSER_ZHANDIANGUANLI"),
			open: true,
			height:minHeight,
			menuTreeId:27
		}]
	}];
	var setting = {			
	  callback: {
			beforeCheck:function(treeId, treeNode){
				if(treeNode.menuTreeId=="all"){//主动选择了all
					self.allChooseClickBySelf="true"
				}
				else{
					self.allChooseClickBySelf="false"
				};
			},
			onCheck: function(event, treeId, treeNode){
				if(self.treeInitFinish){//初始化tree完成
					 if(treeNode.menuTreeId!="all"){
						if(self.allChooseClickBySelf=="true"){//点击全选，跳过一个个刷新
							var temp=0;
							}
							else{//点击了非全选项
								var menuTreeId=treeNode.menuTreeId;
								var currentUserMenuRight=self.authNum;
								var index_=menuTreeId;
								var leftPart=currentUserMenuRight.substring(0,index_);
								var rightPart=currentUserMenuRight.substring(index_+1,currentUserMenuRight.length);
								var content="n";
								var zTree = $.fn.zTree.getZTreeObj("sys-user-admin-page2-part2-menu-tree");
								var node = zTree.getNodeByParam("menuTreeId","all");
								if(treeNode.checked){
								   content="a";
								   if(self.authNum==self.currentUserMenuRightAllChoose){
										zTree.checkNode(node, true, false);
									}
									else{
										zTree.checkNode(node, false, false);
									}
								}
								else{
									zTree.checkNode(node, false, false);
								};
								var combine=leftPart+content+rightPart;
								self.authNum=combine;
								
								self.drawMenuAuthRightPart(zNodes[0]["children"])
							}
					 }
					 else{
					 	if(self.allChooseClickBySelf=="false"){//全选不是主动点的，是被联动的
						}
						else{
							if(treeNode.checked){
								self.authNum=self.currentUserMenuRightAllChoose
							}
							else{
								self.authNum=self.currentUserMenuRightAllNotChoose
							}
							self.drawMenuAuthRightPart(zNodes[0]["children"])
						}	
						
					}
				}
				else{
				 
				};
			},
			beforeCollapse:function(event, treeId, treeNode){
				
			},
			onCollapse:function(event, treeId, treeNode){
				
			},
			onExpand:function(event, treeId, treeNode){
				
			}
		},
		check:{
			enable: true,
			autoCheckTrigger:true,
			chkStyle:"checkbox",
			//chkboxType:{"N": "s"},
			chkboxType: { "Y" : "", "N" : "" }//一开始节点勾选是完全和读到的数据一一对应的。不存在父子任何关联。
		},
		showLine: true,  //设置是否显示节点与节点之间的连线
	};  // zTree 的参数配置，后面详解
	zTreeObj = $.fn.zTree.init($("#sys-user-admin-page2-part2-menu-tree"), setting, zNodes); //初始化zTree，三个参数一次分别是容器(zTree 的容器 className 别忘了设置为 "ztree")、参数配置、数据源
	var sysCategoryLen=this.sysCategory.length;
	var treeRowDistance=41;
	var treeRowDistanceRemoveBottomLine=treeRowDistance-1;
	for(var i= 0,len = self.currentUserMenuRightAllNotChoose.length;i<len;i++){
		$("#sys-user-admin-page2-part2-menu-tree-table").append("<div style=\"height:"+treeRowDistanceRemoveBottomLine+"px;width:100%;border-bottom:1px #e2e2e2 solid\"></div>")
	};
	this.checkTreeItems(authNum);
	var zTree = $.fn.zTree.getZTreeObj("sys-user-admin-page2-part2-menu-tree");88
	zTree.setting.check.chkboxType = {"Y": "ps","N": "s"};
	this.treeInitFinish=true;
	this.drawMenuAuthRightPart(zNodes[0]["children"])//全选不用在右边显示
};

system_user_management.drawMenuAuthRightPart=function(zNodesChildren){
			var authNum=this.authNum;
			var currentUserMenuRight=this.authNum;
			var container=document.getElementById("sys-user-admin-page2-part2-menu-tree-right");
			container.innerHTML="";
			for(var i= 0,len = zNodesChildren.length;i<len;i++) {
				var row = document.createElement("div");
				//row.style.cssText="height:auto;width:auto;min-width:720px;border-bottom:2px #e2e2e2 solid";
				var width=(((typeof zNodesChildren[i].children!="undefined")&&(zNodesChildren[i].children.length>0))?"calc(50% - 1px);":"100%");
				container.appendChild(row);
				var height=zNodesChildren[i].height;
				row.style.cssText="height:"+height+"px;line-height:"+height+"px;width:100%;border-bottom:1px #e2e2e2 solid";
				var menuTreeId=zNodesChildren[i].menuTreeId;
				var menuL1 = document.createElement("div");
				if(currentUserMenuRight.substring(menuTreeId,menuTreeId+1)=="a"){
					menuL1.className = "menu_right_auth_div"
				}
				else{
					menuL1.className = "menu_right_auth_div_gray"
				}
				
				menuL1.style.cssText="float:left;height:"+height+"px;line-height:"+height+"px;width:"+width+";text-align:center;border-right:0";
				menuL1.innerHTML=zNodesChildren[i].name;
				row.appendChild(menuL1);
				
				if(zNodesChildren[i].children){
					var rowL2 = document.createElement("div");
					var height=28;
					rowL2.style.cssText="float:right;height:"+height+"px;line-height:"+height+"px;width:"+width+";border-left:1px #e2e2e2 solid";
					row.appendChild(rowL2);
					for(var j= 0,lenL2 = zNodesChildren[i].children.length;j<lenL2;j++){
					  var childrenL2=zNodesChildren[i].children[j];
					  var menuL2 = document.createElement("div");
					  menuL2.style.cssText="border-bottom:1px #e2e2e2 solid;width:100%;height:"+height+"px;;border-right:0";
					  var menuTreeIdL2=childrenL2.menuTreeId;
					  if(currentUserMenuRight.substring(menuTreeIdL2,menuTreeIdL2+1)=="a"){
							menuL2.className = "menu_right_auth_div_l2";
							menuL1.className = "menu_right_auth_div"
						}
						else{
							menuL2.className = "menu_right_auth_div_l2_gray"
						}
						menuL2.innerHTML=zNodesChildren[i].children[j].name;
						rowL2.appendChild(menuL2);
					 };
			}
			
     }
			/*
		  var zNodesChildrenArray=[];
			for(var i in zNodesChildren){
				zNodesChildrenArray.push(zNodesChildrenArray);
			}
			*/
};

system_user_management.checkTreeItems=function(authNum){
    var $=jQuery;
	var currentUserMenuRight=authNum;
	this.authNum=authNum;
	var self=this;
	var zTree = $.fn.zTree.getZTreeObj("sys-user-admin-page2-part2-menu-tree");
	var nodeAll = zTree.getNodeByParam("menuTreeId","all");
	var sysCategory=this.sysCategory;
	var currentUserMenuRightAllChoose=this.currentUserMenuRightAllChoose;
	for(var i= 0,len = currentUserMenuRightAllChoose.length;i<len;i++){
		var temp=currentUserMenuRight.substring(i,i+1);
		if(temp!=""){
			switch(temp)
			{
			case "a":
				var node = zTree.getNodeByParam("menuTreeId",i,null);//here
				zTree.checkNode(node, true, true);
				break;
			case "n":
				var node = zTree.getNodeByParam("menuTreeId",i,null);
				zTree.checkNode(node, false, true);
				break;
			default:
				break;
			}
		}
		else{
			var node = zTree.getNodeByParam("menuTreeId",i,null);
			zTree.checkNode(node, false, true);
		}
	};
	if(currentUserMenuRight==self.currentUserMenuRightAllChoose){
		zTree.checkNode(nodeAll, true, false);
	}
	else{
		zTree.checkNode(nodeAll, false, false);
	};
};

system_user_management.bindEvent =  function () {
  var that = this;
  jQuery('#adv_sys_user_manage_position_list').on('click', '.opr', function () {
    var opr = jQuery(this);
    if (opr.parents('.opr_more').length > 0) {
      var $more = opr.parents('.opr_more');
      if ($more.hasClass('open')) {
        $more.removeClass('open');
      } else {
        jQuery('.opr-more-open').removeClass('open');
        $more.addClass('open');
      }
    }
    var type = opr.attr('data-type');
    var index = opr.attr('data-id');
    switch (type) {
      case 'open_popup_zizhiFile':
        that.open_popup_zizhiFile(index)
        break;
      case 'open_popup_edit_system_user_edit':
        that.open_popup_edit_system_user_edit(index)
        break;
      case 'reset':
        that.open_popup_reset(index)
        break;
	  case 'auth':
	    var data=that.return_usersData_thisPage.users[index];
		that.edit_row_in_all_data_index=index;
        that.gotoAuthPage(data)
        break;
      case 'open_popup_delete':
        that.open_popup_delete(index)
        break;

      default:
        break;
    }
  });
}



system_user_management.search_user=function(keyCode){
  var keyCode=keyCode;
  if(keyCode==undefined)
  {keyCode=13};
  if(keyCode==13){
    this.processed_get_table_data_from_server=[];
    this.draw_table_after_data_ready("search");
  }
}
system_user_management.initTitle=function(){
  var search = window.location.search;
  var parameters = my.base64Decode(search.replace("?","")).split(";");
  var type = parameters && parameters[0];
  if(type && (type == "jumpToLocalUserManage") && (AdvSystemType == "local")){
    document.title = "广告运营(" + AdvSelfSiteName + ")";
  }
}

system_user_management.init_table_para=function(){

  this.pageSize = 11;         //每页显示记录数
  this.table_component = null; //表格控件
  this.get_table_data_from_server=null;
  this.get_table_data_from_server_search=null;
  this.processed_get_table_data_from_server=[];//把服务器原数据处理后的数据。
  this.edit_data_array_from_server=null;//编辑打开的该id所有数据。
}

system_user_management.process_data_from_server = function (data_from_server) {
  this.processed_get_table_data_from_server=[];
  var data_from_server=data_from_server;
  if(data_from_server.users)
  {
    var data_from_server_users=data_from_server.users;
    for(var c in data_from_server_users)
    {
      if(data_from_server_users[c].metadata)
      {
        var this_metadata=data_from_server_users[c].metadata;
        var company_name=this_metadata.AquaPaaSAdv_CompanyName?this_metadata.AquaPaaSAdv_CompanyName:"";
        var role_key=this_metadata.AquaPaaSAdv_UserRole?this_metadata.AquaPaaSAdv_UserRole:"";
        var role_name="";
        for(var d in this.adv_user_role_array)
        {
          if(role_key==this.adv_user_role_array[d].key){role_name=this.adv_user_role_array[d].value}
        }
        var user_name=data_from_server_users[c].user_name?data_from_server_users[c].user_name:"";
        var legal_man=this_metadata.AquaPaaSAdv_LegalPerson?this_metadata.AquaPaaSAdv_LegalPerson :"";
        var contact_man=this_metadata.AquaPaaSAdv_Contact?this_metadata.AquaPaaSAdv_Contact :"";
				var telephone_number="";
				var fax_number="";
				var validate_time="";
				//电话区号和号码同时为空时
				if( ((typeof this_metadata.AquaPaaSAdv_TelephoneAreaCode=="undefined")||(this_metadata.AquaPaaSAdv_TelephoneAreaCode==null)||(this_metadata.AquaPaaSAdv_TelephoneAreaCode==""))&&((typeof this_metadata.AquaPaaSAdv_TelephoneNumber=="undefined")||(this_metadata.AquaPaaSAdv_TelephoneNumber==null)||(this_metadata.AquaPaaSAdv_TelephoneNumber=="")) ){
					telephone_number=""
				}
				else{
					telephone_number=(this_metadata.AquaPaaSAdv_TelephoneAreaCode?this_metadata.AquaPaaSAdv_TelephoneAreaCode :"")+"-"+(this_metadata.AquaPaaSAdv_TelephoneNumber?this_metadata.AquaPaaSAdv_TelephoneNumber :"");
				};
				if( ((typeof this_metadata.AquaPaaSAdv_FaxAreaCode=="undefined")||(this_metadata.AquaPaaSAdv_FaxAreaCode==null)||(this_metadata.AquaPaaSAdv_FaxAreaCode==""))&&((typeof this_metadata.AquaPaaSAdv_FaxNumber=="undefined")||(this_metadata.AquaPaaSAdv_FaxNumber==null)||(this_metadata.AquaPaaSAdv_FaxNumber=="")) ){
					fax_number=""
				}
				else{
					fax_number=(this_metadata.AquaPaaSAdv_FaxAreaCode?this_metadata.AquaPaaSAdv_FaxAreaCode :"")+"-"+(this_metadata.AquaPaaSAdv_FaxNumber?this_metadata.AquaPaaSAdv_FaxNumber :"");
				};
				if( ((typeof this_metadata.AquaPaaSAdv_ContractStartDate=="undefined")||(this_metadata.AquaPaaSAdv_ContractStartDate==null)||(this_metadata.AquaPaaSAdv_ContractStartDate==""))&&((typeof this_metadata.AquaPaaSAdv_ContractEndDate=="undefined")||(this_metadata.AquaPaaSAdv_ContractEndDate==null)||(this_metadata.AquaPaaSAdv_ContractEndDate=="")) ){
					validate_time=""
				}
				else{
					validate_time=(this_metadata.AquaPaaSAdv_ContractStartDate?this_metadata.AquaPaaSAdv_ContractStartDate:"")+"--"+(this_metadata.AquaPaaSAdv_ContractEndDate?this_metadata.AquaPaaSAdv_ContractEndDate:"");
				};
        var mail_box=this_metadata.AquaPaaSAdv_Email?this_metadata.AquaPaaSAdv_Email :"";
        var address=this_metadata.AquaPaaSAdv_Address?this_metadata.AquaPaaSAdv_Address :"";
        var displayNone="display:none";
        /*
        if(my.paas.user_type=="xiTongGuanLiJueSe"){
          displayNone="display:inline-block";
        }
        */
        var getSingleItemOperation = function (i,role) {
          var opr1 = "<span class='opr' data-type='open_popup_zizhiFile'  data-id='" + i + "'>" + i18n('ADV_SYSUSER_CHAKAN') + "</span>";
          var opr2 = "<span class='opr' data-type='open_popup_edit_system_user_edit'  data-id='" + i + "'>" + i18n('ADV_SYSUSER_BIANJI') + "</span>";
          var opr3 = "<span class='opr' data-type='open_popup_delete'  data-id='" + i + "'>" + i18n('ADV_SYSUSER_SHANCHU') + "</span>";

          var oprMore_detail = '<div class="opr_more_detail" >' +
            '<div class="opr">' + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + '<img src="image/more_up_arrow.png">' + '</div>' +
			((role=="1")?('<div class="opr" data-type="auth" data-id="' + i + '">' + i18n("ADV_SYSUSER_SHOUQUAN") + '</div>'): "") +
            ((my.paas.user_type=="1")?('<div class="opr" data-type="reset" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD") + '</div>') : "") +
            '<div class="opr" data-type="open_popup_delete" data-id="' + i + '">' + i18n('ADV_SYSUSER_SHANCHU') + '</div>' +
            '</div>';
          var oprMore = '<div class="opr_more">' +
            '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + '<img src="image/more_down_arrow.png">' + '</span>' + oprMore_detail;
          '</div>'
          var opr;
          opr = opr1 + opr2;
          opr = opr + oprMore;
          return opr;
        };

        var processed_data_unit = [
          {label: user_name},
          {label: company_name},
          {label: role_name},
          {label: legal_man},
          {label: contact_man},
          {label: telephone_number},
          {label: fax_number},
          {label: mail_box},
          {label: address},
          {label: validate_time},
          /*{label: "<span class=\"adv_data_index_in_all_data\" style=\"display:none\">" + c + "</span>" +
                "<span class=\"smallWord_in_td\" style=\"margin-left:8px;margin-right:10px;" + displayNone + "\" onclick=\"system_user_management.open_popup_zizhiFile(this)\">启用</span>" +
                "<span class=\"smallWord_in_td\" style=\"margin-left:8px\" onclick=\"system_user_management.open_popup_zizhiFile(this)\">" + i18n('ADV_SYSUSER_CHAKAN') + "</span>" +
                "<span class=\"smallWord_in_td\" onclick=\"system_user_management.open_popup_edit_system_user_edit(this)\">" + i18n('ADV_SYSUSER_BIANJI') + "</span>" +
                "<span onclick=\"system_user_management.open_popup_delete(this)\"\" class=\"smallWord_in_td\">" + i18n('ADV_SYSUSER_SHANCHU') + "</span>"}*/
          {label: getSingleItemOperation(c,role_key)},

                ];
        this.processed_get_table_data_from_server.push(processed_data_unit);
      }
     // var get_table_data_from_server_unit=[{label: "公司名称1"};
    }
  }
}

system_user_management.show_all_system_user = function () {
  //var data_from_server=system_user_management.get_all_system_user_data_from_server();
  //this.process_data_from_server(data_from_server);
  this.draw_table_after_data_ready("default");
}

system_user_management.draw_table_after_data_ready=function(para){
  ///*
  //if((my.paas.user_type==1)||(my.paas.user_type=="xiTongGuanLiJueSe") ){
  //登录用户是系统管理员或运营管理。
  if(my.paas.user_type==1 ){
  }
  else{
    jQuery("#adv_sys_user_manage_table_Conainer").empty();
    jQuery("#adv_sys_user_manage_table_Conainer").css("display","none");
    jQuery("#adv_sys_user_manage_table_Conainer").addClass("adv_full_body_huge_div");
    jQuery("#adv_sys_user_manage_table_Conainer").text(i18n("ADV_SYSUSER_NOTE_NORIGHT"));
    var this_height=jQuery("#adv_sys_user_manage_table_Conainer").height()+"px";
    jQuery("#adv_sys_user_manage_table_Conainer").css("line-height",this_height);
    jQuery("#adv_sys_user_manage_table_Conainer").css("display","block");
    return;
  }
  jQuery("#adPos_addPosition").css("display","block");
  jQuery("#panel_search_input_container").css("display","block");
  //*/
  var this_text_ = jQuery("#adPos_search_input").val();
	var this_condition={
		"user_scope_specification": [{
			"user_type":"== 0",
			"metadata":{
			 "AquaPaaSAdv_MiniP_StoreName": "!*"//不是自助广告主用户
				}
		  },{
			"user_type":"== 1",
			"metadata":{
			 "AquaPaaSAdv_MiniP_StoreName": "!*"//不是自助广告主用户
				}
		  },{
			"user_type":"== 2",
			"metadata":{
			 "AquaPaaSAdv_MiniP_StoreName": "!*"//不是自助广告主用户
				}
		  }
		]
	};
  if ((para =="search")&&(this_text_!="")) {//搜索
		this_condition.user_scope_specification[0].nick_name="contains " + this_text_ + "";
		this_condition.user_scope_specification[1].nick_name="contains " + this_text_ + "";
		this_condition.user_scope_specification[2].nick_name="contains " + this_text_ + "";
  }
	else{
		delete this_condition.user_scope_specification[0].nick_name;
		delete this_condition.user_scope_specification[1].nick_name;
		delete this_condition.user_scope_specification[2].nick_name;
	}
  if(this.processed_get_table_data_from_server.length>0)
  {
    jQuery("#adv_sys_user_manage_position_list").empty()
  }
      var title=[i18n('ADV_SYSUSER_GONGSIMINGCHENG'),i18n('ADV_SYSUSER_JIAOSE'),i18n('ADV_SYSUSER_GONGSIFAREN'),i18n('ADV_SYSUSER_LIANXIREN'),i18n('ADV_SYSUSER_DIANHUAHAOMA'),i18n('ADV_SYSUSER_CHUANZHEN'),i18n('ADV_SYSUSER_YOUXIANG'),i18n('ADV_SYSUSER_DIZHI'),i18n('ADV_SYSUSER_YOUXIAOSHIJIAN'),i18n('ADV_SYSUSER_CAOZUO')];
      var widths = ["0.0933","0.08","0.06","0.0941","0.109","0.08","0.08","0.0595","0.08","0.1"];
      this.table_component = new StyledList({
        rows: 11,
        columns: 11,
        containerId: 'adv_sys_user_manage_position_list',
        titles: [{
          label: i18n('ADV_SYSUSER_YONGHUMING')
        },{
            label: i18n('ADV_SYSUSER_GONGSIMINGCHENG')
          }, {
            label: i18n('ADV_SYSUSER_JIAOSE')
          }, {
            label: i18n('ADV_SYSUSER_GONGSIFAREN')
          }, {
            label: i18n('ADV_SYSUSER_LIANXIREN')
          }, {
            label: i18n('ADV_SYSUSER_DIANHUAHAOMA')
          }, {
            label: i18n('ADV_SYSUSER_CHUANZHEN')
          }, {
            label: i18n('ADV_SYSUSER_YOUXIANG')
          }, {
            label: i18n('ADV_SYSUSER_DIZHI')
          }, {
            label: i18n('ADV_SYSUSER_YOUXIAOSHIJIAN')
          }, {
            label: i18n('ADV_SYSUSER_CAOZUO')
          }
        ],
        listType: 1,//为0时，一次获取所有内容，再分页。为1时，一次分页获取每页内容。
        data: [],
        styles: {
          borderColor: '#ebebeb',
          borderWidth: 1,
          titleHeight: 46,
          titleBg: '#5da1c0',
          titleColor: '#ffffff',
          cellBg: '#ffffff',
          evenBg: '#f5f5f5',
          cellColor: '#6e6e6e',
          footBg: '#ffffff',
          footColor: '#797979',
          iconColor: '#5da1c0',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',//?
          columnsWidth:widths
        }
      });
    this.table_component.getPageData = function (pageNumber) {
        var listSelf = this;
        var listData;
        var start = (pageNumber - 1) * 11+1;
        var end = pageNumber * 11 - 1+1;
        var query = '&start=' + start;
        query += '&end=' + end;
        var url_show_all_user = paasHost + "/aquapaas/rest/users/cdmi_query?access_token=" + my.paas.access_token + ""+query+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+""+"&user_id=" + my.paas.user_id+"";
        var xhr_show_all_user = new XMLHttpRequest();
        xhr_show_all_user.open("PUT", url_show_all_user, false);
        xhr_show_all_user.setRequestHeader("Content-Type", "application/json");
        xhr_show_all_user.setRequestHeader("Accept", "application/json");
        xhr_show_all_user.setRequestHeader("x-aqua-sign",getPaaS_x_aqua_sign("PUT",url_show_all_user));
        var xhr_show_all_user_filter_condition=this_condition;
        xhr_show_all_user.send(JSON.stringify(xhr_show_all_user_filter_condition));
        if ((xhr_show_all_user.readyState == 4) && (xhr_show_all_user.status == 200 || xhr_show_all_user.status == 0 || xhr_show_all_user.status == 304)) {
          if (xhr_show_all_user.responseText) {
            var totalCount =  JSON.parse(xhr_show_all_user.responseText).count;
            system_user_management.return_usersData_thisPage=JSON.parse(xhr_show_all_user.responseText);
            listSelf.onTotalCount(totalCount || 0);
            system_user_management.get_table_data_from_server = JSON.parse(xhr_show_all_user.responseText);
            system_user_management.process_data_from_server(system_user_management.get_table_data_from_server);
          }
        }
        return system_user_management.processed_get_table_data_from_server;
      };
      this.table_component.create();
      return this.table_component
}

system_user_management.downMeun_disappear=function(downMenu_container_id){
  if(jQuery("#"+downMenu_container_id).css("display")!="none")
    {jQuery("#"+downMenu_container_id).css("display","none")}
  else{jQuery("#"+downMenu_container_id).css("display","block")}
}

system_user_management.init_popup_para=function() {
  var popupObject ={
    url:"content/xi_tong_yong_hu_guan_li/popup_newAdd_systemUser.html",
    width:760,
   // height:728,
    height:876,
    context:this,
    callback:this.init_popup_newSystemUser_para_and_widget
  };
  this.dialog=new PopupDialog(popupObject);
  var popupObject_edit ={
    url:"content/xi_tong_yong_hu_guan_li/popup_edit_systemUser.html",
    width:760,
    height:659,
    context:this,
    callback:this.init_popup_editSystemUser_para_and_widget
  };
  this.dialog_edit=new PopupDialog(popupObject_edit);
  var popupObject_upload_zizhiFile ={
    url:"content/xi_tong_yong_hu_guan_li/popup_zizhi_file.html",
    width:760,
    height:370,
    context:this,
    callback:this.get_qulification_file
  };
  this.dialog_zizhiFile=new PopupDialog(popupObject_upload_zizhiFile);
  var popupObject_delete ={
    url:"content/xi_tong_yong_hu_guan_li/pop_up_delete_dialog.html",
    width:478,
    height:268,
    context:this
    //callback:this.init_popup_editSystemUser_para_and_widget
  };
  this.dialog_delete=new PopupDialog(popupObject_delete);
  var popupObject_reset ={
    url:"content/xi_tong_yong_hu_guan_li/changePassword.html",
    width:375,
    height:188,
    context:this,
    callback:this.dialog_reset_callback
  };
  this.dialog_reset=new PopupDialog(popupObject_reset);

};

system_user_management.init_popup_newSystemUser_para_and_widget = function () {
  this.popupNewEditTop=jQuery("#popup-dialog-dialog").css("top");
  this.popupFrom="new";
  this.init_downMenu_popup_newSystemUser();
  this.init_calendar_popup_newSystemUser();
  this.choose_upload_file();
  var selectedArray=[];
  this.display_sysCategory(selectedArray);
};

system_user_management.display_sysCategory=function(selectedArray){
    return;
    var sysCategory_=this.sysCategory;
	for(var i=0;i<sysCategory_.length;i++){
	    var l_=0;
		var t_=0;
	    if( (i==0)||(i==4)||(i==8) ){
			l_=13;
		}
		else if( (i==1)||(i==5)||(i==9) ){
			l_=198;
		}
		else if( (i==2)||(i==6)||(i==10) ){
			l_=382;
		}
		else if( (i==3)||(i==7)||(i==11) ){
			l_=567;
		}
		else{}
		if(i<4){
			t_=18
		}
		else if(i>3&&i<8){
			t_=57
		}
		else{
			t_=96
		}
		var select_="notSelected";
		for(var k=0;k<selectedArray.length;k++){
			if(i==selectedArray[k]){select_="selected"}
		}
		this.create_CheckboxWords_inContainer("advUserManage_sysManage_categoryContainer_"+this.popupFrom+"",sysCategory_[i].displayName,sysCategory_[i].value,l_,t_,select_)
	}
};

system_user_management.create_CheckboxWords_inContainer=function(containerid,displayWords,value,left,top,select_){
    var display_=((select_=="selected")?"block":"none");
	var checkBoxHTML="<div style=\"vertical-align:middle;display:inline-block;height:14px;width:14px;background-color:#ffffff;border:1px #e1e2e4 solid;\"><img class=\"advUserManage_checkboxIconPic\" style=\"display:"+display_+";height:14px;width:14px\" src = \"image/checkbox.png\"/></div>";
	var wordsHTML="<div style=\"vertical-align:middle;display:inline-block;margin-left:5px;height:14px;line-height:14px;color:#717171;\">"+displayWords+"</div>";
	jQuery("#"+containerid+"").append("<div onclick=\"system_user_management.clickCheckBox(this)\" style=\"cursor:pointer;line-height:14px;width:auto;position:absolute;left:"+left+"px;top:"+top+"px;\">"+checkBoxHTML+""+wordsHTML+"</div>");
};

system_user_management.clickCheckBox = function (obj) {
	if(jQuery(obj).find(".advUserManage_checkboxIconPic").css("display")=="none"){
	   jQuery(obj).find(".advUserManage_checkboxIconPic").css("display","block")
	}
    else{
		jQuery(obj).find(".advUserManage_checkboxIconPic").css("display","none")
	}
}

system_user_management.init_popup_editSystemUser_para_and_widget = function () {
  this.popupNewEditTop=jQuery("#popup-dialog-dialog").css("top");
  this.popupFrom="edit";
  this.init_downMenu_popup_newSystemUser();
  this.init_calendar_popup_newSystemUser();
  this.init_edit_popup_para();
  this.choose_upload_file();
}

system_user_management.init_edit_popup_para = function () {
  var that=this;
  var this_index=this.edit_row_in_all_data_index;
  var this_data_array=this.get_table_data_from_server;
  var this_data_array_user=[];
  if(this_data_array.users)
  this_data_array_user=this_data_array.users;
  var this_data_array_user_index=this_data_array_user[this_index];
  this.edit_data_array_from_server=this_data_array_user_index;
  var this_data_array_user_index_metadata=this_data_array_user_index.metadata;

  var file_url=this_data_array_user_index_metadata.AquaPaaSAdv_CertificateFileURL;
  var index_keyword_a="/"+storage_qualification_folder;
  var index_keyword_b="?aquatoken";
  if(file_url){
    var file_url_name_index_a=file_url.indexOf(index_keyword_a)+index_keyword_a.length;
    var file_url_name_index_b=file_url.indexOf(index_keyword_b);
    if(file_url_name_index_b<0){
      file_url = file_url + index_keyword_b;
      file_url_name_index_b=file_url.indexOf(index_keyword_b)
    }
    var this_file_name_encoder=file_url.substring(file_url_name_index_a,file_url_name_index_b);
    var this_file_name=decodeURIComponent(this_file_name_encoder);
    jQuery("#adv_input_region_company_uploadFile").val(this_file_name);
  }
  jQuery("#adv_input_region_userID").val(this_data_array_user_index.user_name?this_data_array_user_index.user_name:"");
  jQuery("#adv_input_region_companyName").val(this_data_array_user_index.nick_name?this_data_array_user_index.nick_name:"");
  jQuery("#adv_input_region_company_legalMan").val(this_data_array_user_index_metadata.AquaPaaSAdv_LegalPerson);
  jQuery("#adv_input_region_contactMan").val(this_data_array_user_index_metadata.AquaPaaSAdv_Contact);
  jQuery("#adv_input_region_company_email").val(this_data_array_user_index_metadata.AquaPaaSAdv_Email);
  jQuery("#adv_input_region_address").val(this_data_array_user_index_metadata.AquaPaaSAdv_Address);
  var this_role=this_data_array_user_index_metadata.AquaPaaSAdv_UserRole;
  if(this_role=="1"){
	//document.getElementById("advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").style.display="block";
	jQuery("#popup-dialog-dialog").css("top",0);
	jQuery("#advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").closest(".advUserManage_sysManage_popupContainer").css("height",that.pageHeight[""+this.popupFrom+"_openSysUserCategory"]+"px")
	if(this_data_array_user_index_metadata&&this_data_array_user_index_metadata.AquaPaaSAdv_UserRight)
		{
			var userRight=this_data_array_user_index_metadata.AquaPaaSAdv_UserRight;
			var userRightToStr=userRight.toString(2);//转为2进制
			var userRight_transfer=userRightToStr.split("").reverse();
			var category_array=[];
			for(var i=0;i<userRight_transfer.length;i++){
				if(userRight_transfer[i]==1){
				    var value_=1*Math.pow(2,i);
					var this_sysCategory=this.sysCategory;
					var this_sysCategory_length=this_sysCategory.length;
					for(var j=0;j<this_sysCategory_length;j++){
						if(this_sysCategory[j].value==value_){
						category_array.push(j+"");
					    break;
						}
					}	
				}
			};
			var selectedArray=category_array;
			this.display_sysCategory(selectedArray);
		}
		else{//对于老的数据，如果没有AquaPaaSAdv_UserRight字段，现实默认的分类UI。
			var selectedArray=[];
			this.display_sysCategory(selectedArray);
		}
  }
  else{
	var selectedArray=["0"];
	this.display_sysCategory(selectedArray);
	document.getElementById("advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").style.display="none";
	jQuery("#advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").closest(".advUserManage_sysManage_popupContainer").css("height",that.pageHeight[""+this.popupFrom+"_notOpenSysUserCategory"]+"px")
  }
  jQuery("#adv_input_region_phone1").val(this_data_array_user_index_metadata.AquaPaaSAdv_TelephoneAreaCode);
  jQuery("#adv_input_region_phone2").val(this_data_array_user_index_metadata.AquaPaaSAdv_TelephoneNumber);
  jQuery("#adv_input_region_fax1").val(this_data_array_user_index_metadata.AquaPaaSAdv_FaxAreaCode);
  jQuery("#adv_input_region_fax2").val(this_data_array_user_index_metadata.AquaPaaSAdv_FaxNumber);
  jQuery("#adv_input_region_company_contractStartTime-datepicker-input").val(this_data_array_user_index_metadata.AquaPaaSAdv_ContractStartDate);
  jQuery("#adv_input_region_company_contractEndTime-datepicker-input").val(this_data_array_user_index_metadata.AquaPaaSAdv_ContractEndDate);
  var role_value="";
  for(var b in this.adv_user_role_array)
  {
    if(this.adv_user_role_array[b].key==this_role)
    {
      jQuery("#adv_input_region_role").text(this.adv_user_role_array[b].value)
    }

  }

}



system_user_management.init_calendar_popup_newSystemUser=function(){
  var calendarStyles = {
    width: 292,
    navTitleHeight: 20,
    navTitleBgColor: '#5da1c0',
    datesViewHeight: 150,
    datesViewGridColor: '#e2e2e2',
    datesViewCellColor: '#ffffff',
    weekdaysHeight: 20,
    weekdaysColor: '#000000',
    currMonthColor: '#737373',
    nonCurrMonthColor: '#e2e2e2'
  };
  this.adv_datePicker_startDate = new DatePicker({
    containerId: 'adv_input_region_company_contractStartTime',
    calendarStyles: calendarStyles,
    dateInputStyles: {
      borderColor: '#e2e2e2'
    },
    iconImage: 'image/adv_calendar_icon.png'
  });

  this.adv_datePicker_endDate = new DatePicker({
    containerId: 'adv_input_region_company_contractEndTime',
    calendarStyles: calendarStyles,
    dateInputStyles: {
      borderColor: '#e2e2e2'
    },
    iconImage: 'image/adv_calendar_icon.png'
  });
  this.adv_datePicker_startDate.onChange = function() {
    var datestr = this.getDateStr();
    jQuery("form[method=POST] input[name=start_date]").val(datestr);
  };
  this.adv_datePicker_endDate.onChange = function() {
    var datestr = this.getDateStr();
    jQuery("form[method=POST] input[name=end_date]").val(datestr);
  };

}

system_user_management.init_downMenu_popup_newSystemUser = function () {
  this.initUserTypeMenu()
  var downMenu_container_height=this.adv_user_role_array.length*31+this.adv_user_role_array.length+"px";
  jQuery("#downMenu_role_container").append("<div id=\"downMenu_role_container_\" style=\"z-index:10;display:none;cursor:pointer;background-color:white;position:absolute;border: 1px solid #e2e2e2;border-top:0;width:296px;top:20;height:"+downMenu_container_height+"\"></div>");
  var that=this;
  for(var b=0;b<this.adv_user_role_array.length;b++)
    {
      jQuery("#downMenu_role_container_").append("<div id=\"downMenu_role_son"+b+"\" class=\"downMenu_hover\" style=\"padding-left:11px;z-indx:200;width:285px;height:31px;line-height:31px;border-bottom:1px solid #e2e2e2;\">"+this.adv_user_role_array[b].value+"</div>")
      jQuery("#downMenu_role_son"+b+"").bind('click',{para_content_id: this.adv_user_role_array[b].value}, function (events) {
        that.write_to_div("adv_input_region_role",events.data.para_content_id,"downMenu_role_container_")
      });
    };

}

system_user_management.getSelector=function(containerId, options) {
	var selector = new StyledSelector({
		containerId: containerId,
		styles: {
			optionHeight: 25
		},
		options: options
	});
	selector.getCloseIcon = function() {
		return '<div class="styled-selector-up-arrow"></div>';
	};
	selector.getOpenIcon = function() {
		return '<div class="styled-selector-down-arrow"></div>';
	};
	return selector;
};

system_user_management.initUserTypeMenu= function () {
	var jq=jQuery;
    //this.popupFrom
	var item = [{name: i18n("ADV_SYSUSER_ALL_PLATFORM_USER") ,value:"ALL"},{name: i18n("ADV_SYSUSER_MULTI_PLATFORM_USER") ,value:"multi"}]
	var temp=[];
	for(var i=0;i<item.length;i++){
		temp.push({
			label:item[i].name||"",
			value:item[i].value||""
		})
	};
	var dfAdSelector = this.getSelector('downMenu_user_type_container', temp);
	dfAdSelector.create();
	this.dfAdSelector=dfAdSelector;
	dfAdSelector.onChange = function () {
		var filtid = this.getValue();
		console.log(filtid);
		if(filtid=="ALL"){
			jq("#advUserManagePlatform_container").find(".advUserManage_checkboxPic").each(function(){
			  jq(this).css("visibility","visible")
			});    	
		}
		else{
			jq("#advUserManagePlatform_container").find(".advUserManage_checkboxPic").each(function(){
			  jq(this).css("visibility","hidden")
			});  
		}
	 }
	var this_index=this.edit_row_in_all_data_index;
	var this_data_array=this.get_table_data_from_server;
	var this_data_array_user=[];
	if(this_data_array.users)
	this_data_array_user=this_data_array.users;
	var this_data_array_user_index=this_data_array_user[this_index];
	console.log(this_data_array_user_index);
	if(this.popupFrom=="edit"){
		if(typeof this_data_array_user_index.metadata!="undefined"){
			if(typeof this_data_array_user_index.metadata.aquapass_platform_id!="undefined"){
				if(this_data_array_user_index.metadata.aquapass_platform_id!="ALL"){
					dfAdSelector.setValue("multi")
				}
			}
		}
	};
   this.drawItems();
};

system_user_management.drawItems= function () {
	var jq=jQuery;
	
	if((typeof PLATFORM!="undefined")&&(PLATFORM.length!=0)){
		console.log(1);
		var itemStyle="cursor:pointer;line-height:14px;width:100%";
		var tdInOneRow=3;
		var trLen=Math.ceil(PLATFORM.length/tdInOneRow);
		console.log(trLen);
		var table=document.getElementById("advUserManagePlatform");
		var isAll="all";
		var split=[];
		if(this.popupFrom=="edit"){
			var this_index=this.edit_row_in_all_data_index;
			var this_data_array=this.get_table_data_from_server;
			var this_data_array_user=[];
			if(this_data_array.users)
			this_data_array_user=this_data_array.users;
			var this_data_array_user_index=this_data_array_user[this_index];
			if(typeof this_data_array_user_index.metadata!="undefined"){
				if(typeof this_data_array_user_index.metadata.aquapass_platform_id!="undefined"){
					if(this_data_array_user_index.metadata.aquapass_platform_id!="ALL"){
						isAll="notAll";
						split=this_data_array_user_index.metadata.aquapass_platform_id.split(",")
					}
				}
			}
		};

		for(var i=0;i<trLen;i++){
			var trHeight=((i<(trLen-1))?37:32); 
			var trL3 = document.createElement("tr"); 
			table.appendChild(trL3);
			for(var j= 0,lenB = tdInOneRow;j<lenB;j++){
				var td = document.createElement("td"); 
				td.style.cssText="vertical-align:top;height:"+trHeight+"px";
				var index=i*tdInOneRow+j;
				if(typeof PLATFORM[index] !="undefined"){
					var name=PLATFORM[index].name||"";
					var platformId=PLATFORM[index].platform_id||"";
					var visible="visible";
					if(isAll=="notAll"){
					    console.log(platformId);
					    console.log(split);
						if(jq.inArray(platformId,split)==-1){
							visible="hidden"
						}
					};
					console.log(visible);
					var checkBoxHTML="<div class=\"advUserManage_checkbox_container\" style=\"display:inline-block;height:14px;width:14px;background-color:#ffffff;border:1px #e1e2e4 solid;\"><img class=\"advUserManage_checkboxPic\" style=\"visibility:"+visible+";height:14px;width:14px\" src=\"image/checkbox.png\"></div>";
					td.width=(((j+1)%3==0)?"22%":"39%");
					var itemHTML="<div class=\"adv_user_manage_surplus_item\" style=\"display:inline-block;width:calc(100% - 24px);margin-left:6px;height:14px;line-height:14px;color:#717171;\">"+name+"</div>";
					td.innerHTML="<div data-value=\""+platformId+"\" style=\""+itemStyle+"\">"+checkBoxHTML+""+itemHTML+"</div>"	 
				};
				trL3.appendChild(td);
			}
		}
	}
	jq("#advUserManagePlatform_container").show();
	jq("#advUserManagePlatform_container").find(".advUserManage_checkbox_container").unbind().bind('click', function () {
        if(jq(this).children().css("visibility")=="hidden"){
			jq(this).children().css("visibility","visible")
		}
		else{
			jq(this).children().css("visibility","hidden")
		}
     });
}



system_user_management.block_commit_if_format_wrong=function(){
  var commit_info=this.check_input();
  if( this.display_wrong_input_interface(commit_info)=="para wrong" )
  {return ("para wrong")}
};

system_user_management.display_wrong_input_interface=function(commit_info){
  var commit_info=commit_info;
  if(commit_info!="para correct")
    {
      if( (commit_info.id)&&(commit_info.info) )
      showInputErr(commit_info.id, commit_info.info);
      return ("para wrong")
    }
}


system_user_management.check_input=function(){
  var wrong_input_obj={};
  if( (jQuery("#adv_input_region_userID"))&&(jQuery("#adv_input_region_userID").val()==""))
  {
    wrong_input_obj={
      "id":"#adv_input_region_userID",
      "info":i18n("ADV_SYSUSER_ALERT_YONGHUMING_KONG")
    }
    return wrong_input_obj}
  else if( (jQuery("#adv_input_region_userPwd"))&&(jQuery("#adv_input_region_userPwd").val()==""))
  {
    wrong_input_obj={
      "id":"#adv_input_region_userPwd",
      "info":i18n("ADV_SYSUSER_ALERT_MIMA_KONG")
    }
    return wrong_input_obj
  }
  else if(jQuery("#adv_input_region_companyName").val()=="")
  {
    wrong_input_obj={
      "id":"#adv_input_region_companyName",
      "info":i18n("ADV_SYSUSER_ALERT_COMPANY_NAME_KONG")
    }
    return wrong_input_obj
  }
  else if(jQuery("#adv_input_region_role").text()=="")
  {
    wrong_input_obj={
      "id":"#adv_input_region_role",
      "info":i18n("ADV_SYSUSER_ALERT_JIAOSE_KONG")
    }
    return wrong_input_obj
  }
  else if( (jQuery("#adv_input_region_userPwd"))&&(jQuery("#adv_input_region_userPwd").val()!=jQuery("#adv_input_region_userPwd_confirm").val()))
  {
    wrong_input_obj={
      "id":"#adv_input_region_userPwd",
      "info":i18n("ADV_SYSUSER_ALERT_MIMA_DIFFER")
    }
    return wrong_input_obj
  }
  else{return ("para correct")}
}

system_user_management.getPlatformId=function(){
  var platformId="";
  if(this.dfAdSelector.getValue()=="ALL"){
	platformId=this.dfAdSelector.getValue();
	var temp="";
	var count=0;
	var item=document.getElementsByClassName("advUserManage_checkboxPic");
	for(var i= 0,len = item.length;i<len;i++){
		if(item[i].style.visibility=="visible"){
			count+=1;
			var id=item[i].parentNode.parentNode.getAttribute("data-value");
			if(count>1){
				temp+=(","+id)
			}
			else{
				temp+=id
			}
		}
	};
	if(count!=item.length){
		platformId=temp
	}
  }
  else{
	var platformId="";
	var item=document.getElementsByClassName("advUserManage_checkboxPic");
	var count=0;
	for(var i= 0,len = item.length;i<len;i++){
		if(item[i].style.visibility=="visible"){
			count+=1;
			var id=item[i].parentNode.parentNode.getAttribute("data-value");
			if(count>1){
				platformId+=(","+id)
			}
			else{
				platformId+=id
			}
		}
	};
	//目前创建了三个用户：platform_user（aquapass_platform_id为"zibo"），platform_user_all（aquapass_platform_id为"ALL"）  platform_user_zibo（aquapass_platform_id为"hefei,zibo"）, 
  };
  return platformId
}

system_user_management.create_new_system_user=function(){
  var jq=jQuery;
  if(this.block_commit_if_format_wrong()=="para wrong"){return}
  var url_register_user = paasHost + "/aquapaas/rest/users/user?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
  var xhr_register_user = new XMLHttpRequest();
  xhr_register_user.open("POST", url_register_user, false);
  xhr_register_user.setRequestHeader("Content-Type", "application/json");
  xhr_register_user.setRequestHeader("Accept", "application/json");
  xhr_register_user.setRequestHeader("x-aqua-sign",getPaaS_x_aqua_sign("POST",url_register_user));
  var company_name=jQuery("#adv_input_region_companyName").val();
  var system_user_role="";
  for (var c in this.adv_user_role_array)
  {
    if(jQuery("#adv_input_region_role").text()==this.adv_user_role_array[c].value)
    {system_user_role=this.adv_user_role_array[c].key}
}
var register_data_array = {
  "user_name" : jQuery("#adv_input_region_userID").val()?jQuery("#adv_input_region_userID").val():"",
  "password" : jQuery("#adv_input_region_userPwd").val()?jQuery("#adv_input_region_userPwd").val():"",
  "nick_name": company_name,
  "user_type": system_user_role,
  "metadata": {
      AquaPaaSAdv_CompanyName: company_name?company_name:"",
      AquaPaaSAdv_LegalPerson: jQuery("#adv_input_region_company_legalMan").val()?jQuery("#adv_input_region_company_legalMan").val():"",
      AquaPaaSAdv_Contact: jQuery("#adv_input_region_contactMan").val()?jQuery("#adv_input_region_contactMan").val():"",
      AquaPaaSAdv_TelephoneAreaCode: jQuery("#adv_input_region_phone1").val()?jQuery("#adv_input_region_phone1").val():"",
      AquaPaaSAdv_TelephoneNumber: jQuery("#adv_input_region_phone2").val()?jQuery("#adv_input_region_phone2").val():"",
      AquaPaaSAdv_FaxAreaCode: jQuery("#adv_input_region_fax1").val()?jQuery("#adv_input_region_fax1").val():"",
      AquaPaaSAdv_FaxNumber: jQuery("#adv_input_region_fax2").val()?jQuery("#adv_input_region_fax2").val():"",
      AquaPaaSAdv_Email: jQuery("#adv_input_region_company_email").val()?jQuery("#adv_input_region_company_email").val():"",
      AquaPaaSAdv_Address: jQuery("#adv_input_region_address").val()?jQuery("#adv_input_region_address").val():"",
      AquaPaaSAdv_ContractStartDate: jQuery("#adv_input_region_company_contractStartTime-datepicker-input").val()?jQuery("#adv_input_region_company_contractStartTime-datepicker-input").val():"",
      AquaPaaSAdv_ContractEndDate: jQuery("#adv_input_region_company_contractEndTime-datepicker-input").val()?jQuery("#adv_input_region_company_contractEndTime-datepicker-input").val():"",
      AquaPaaSAdv_UserRole:system_user_role?system_user_role:"",
      AquaPaaSAdv_CertificateFileURL:(this.current_upload_file_url)?(this.current_upload_file_url):""
    }
  };
  var platformId=this.getPlatformId();
  register_data_array.metadata.aquapass_platform_id=platformId;
  if(system_user_role==1){
	var selectCategory=[];
	jq("#advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").find(".advUserManage_checkboxIconPic").each(function(index_){
		if(jq(this).css("display")=="block"){
			selectCategory.push(index_)
		}
	});
	/*
	var count_all_key=0;//一个或多个权限值的十进制的合计；
	var selectCategory_length=selectCategory.length;
	for(var i=0;i<selectCategory_length;i++){
	    var this_sysCategory=this.sysCategory;
		count_all_key+=parseInt(this_sysCategory[selectCategory[i]].value);
	}
	register_data_array.metadata.AquaPaaSAdv_UserRight=count_all_key;
	*/
  }
  xhr_register_user.send(JSON.stringify(register_data_array));
  if( (xhr_register_user.readyState == 4)&&(xhr_register_user.status == 200 || xhr_register_user.status == 0 || xhr_register_user.status == 304)){
    alert(i18n("ADV_SYSUSER_ALERT_ADD_USER_SUCCESS"))
  }
  this.close_popup_create_system_user();
  this.table_component.refreshList()
}

system_user_management.get_trust_token=function(user_id){
  var url_get_trust_token =  paasHost+"/aquapaas/rest/cdmi_users/"+user_id+"";
  var xhr_get_trust_token =new XMLHttpRequest();
  xhr_get_trust_token.open("GET",url_get_trust_token,false);
  xhr_get_trust_token.setRequestHeader("Accept", "application/json");
  xhr_get_trust_token.setRequestHeader("x-aqua-user-domain-uri","");
  xhr_get_trust_token.send();
}

system_user_management.edit_new_system_user=function(){
  var jq=jQuery;
  if(this.block_commit_if_format_wrong()=="para wrong"){return}
  if( (system_user_management.return_usersData_thisPage)&&(system_user_management.return_usersData_thisPage.users) )
  {
      var current_user_passID=system_user_management.return_usersData_thisPage.users[this.edit_row_in_all_data_index].user_id;
      //if(current_user_passID==my.paas.user_id)
      //{
		  var company_name=jQuery("#adv_input_region_companyName").val();
		  var system_user_role="";
		  for (var c in this.adv_user_role_array)
		  {
			if(jQuery("#adv_input_region_role").text()==this.adv_user_role_array[c].value)
			{system_user_role=this.adv_user_role_array[c].key}
		  }
		  var update_data_array = {
			"user_name" : jQuery("#adv_input_region_userID").val()?jQuery("#adv_input_region_userID").val():"",
			"nick_name": company_name,
			"user_type": system_user_role,
			"metadata": {
			  AquaPaaSAdv_CompanyName: company_name?company_name:"",
			  AquaPaaSAdv_LegalPerson: jQuery("#adv_input_region_company_legalMan").val()?jQuery("#adv_input_region_company_legalMan").val():"",
			  AquaPaaSAdv_Contact: jQuery("#adv_input_region_contactMan").val()?jQuery("#adv_input_region_contactMan").val():"",
			  AquaPaaSAdv_TelephoneAreaCode: jQuery("#adv_input_region_phone1").val()?jQuery("#adv_input_region_phone1").val():"",
			  AquaPaaSAdv_TelephoneNumber: jQuery("#adv_input_region_phone2").val()?jQuery("#adv_input_region_phone2").val():"",
			  AquaPaaSAdv_FaxAreaCode: jQuery("#adv_input_region_fax1").val()?jQuery("#adv_input_region_fax1").val():"",
			  AquaPaaSAdv_FaxNumber: jQuery("#adv_input_region_fax2").val()?jQuery("#adv_input_region_fax2").val():"",
			  AquaPaaSAdv_Email: jQuery("#adv_input_region_company_email").val()?jQuery("#adv_input_region_company_email").val():"",
			  AquaPaaSAdv_Address: jQuery("#adv_input_region_address").val()?jQuery("#adv_input_region_address").val():"",
			  AquaPaaSAdv_ContractStartDate: jQuery("#adv_input_region_company_contractStartTime-datepicker-input").val()?jQuery("#adv_input_region_company_contractStartTime-datepicker-input").val():"",
			  AquaPaaSAdv_ContractEndDate: jQuery("#adv_input_region_company_contractEndTime-datepicker-input").val()?jQuery("#adv_input_region_company_contractEndTime-datepicker-input").val():"",
			  AquaPaaSAdv_UserRole:system_user_role?system_user_role:"",
			  AquaPaaSAdv_CertificateFileURL:(this.current_upload_file_url)?(this.current_upload_file_url):""
			 }
		  };
		  
		   var platformId=this.getPlatformId();
           update_data_array.metadata.aquapass_platform_id=platformId;
		  
			if(system_user_role==1){
				var selectCategory=[];
				jq("#advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").find(".advUserManage_checkboxIconPic").each(function(index_){
					if(jq(this).css("display")=="block"){
						selectCategory.push(index_)
					}
				});
				/*
				var count_all_key=0;//一个或多个权限值的十进制的合计；
				var selectCategory_length=selectCategory.length;
				for(var i=0;i<selectCategory_length;i++){
					var this_sysCategory=this.sysCategory;
					count_all_key+=parseInt(this_sysCategory[selectCategory[i]].value);
				};
				update_data_array.metadata.AquaPaaSAdv_UserRight=count_all_key;
				*/
			};
		  var this_edit_data_array_from_server=this.edit_data_array_from_server;
		  //this.get_trust_token(jQuery("#adv_input_region_userID").val());//获取信任token, 不用密码。
			var url_update_user = paasHost + "/aquapaas/rest/users/other/"+current_user_passID;
		  url_update_user +="?user_id="+my.paas.user_id+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
		  var xhr_update_user = new XMLHttpRequest();
		  xhr_update_user.open("PUT", url_update_user, false);
		  xhr_update_user.setRequestHeader("Content-Type", "application/json");
		  xhr_update_user.setRequestHeader("Accept", "application/json");
		  xhr_update_user.setRequestHeader("x-aqua-sign",getPaaS_x_aqua_sign("PUT",url_update_user));
		  xhr_update_user.send(JSON.stringify(update_data_array));
		  if( (xhr_update_user.readyState == 4)&&(xhr_update_user.status == 200 || xhr_update_user.status == 0 || xhr_update_user.status == 304)){
			alert(i18n("ADV_SYSUSER_ALERT_UPDATE_USER_SUCCESS"))
		  }
		  this.close_popup_edit_system_user();
		  this.table_component.refreshList()
		//}
		/*
		else{
			alert(i18n("ADV_SYSUSER_ALERT_UPDATE_USERB"));
			this.close_popup_edit_system_user();
		}
		*/
	}
}


system_user_management.delete_system_user=function(){
  if( (system_user_management.return_usersData_thisPage)&&(system_user_management.return_usersData_thisPage.users) )
  {
      var current_user_passID=system_user_management.return_usersData_thisPage.users[this.current_row_index].user_id;
      //if(current_user_passID==my.paas.user_id)
      //{
          var url_delete_user = paasHost + "/aquapaas/rest/users/other/"+current_user_passID+"?access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+""+"&user_id="+my.paas.user_id+"";
          var xhr_delete_user = new XMLHttpRequest();
          xhr_delete_user.open("DELETE", url_delete_user, false);
          xhr_delete_user.setRequestHeader("Content-Type", "application/json");
          //xhr_delete_user.setRequestHeader("Authorization", "AQUA " + my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign)));
          xhr_delete_user.setRequestHeader("Accept", "application/json");
          xhr_delete_user.setRequestHeader("x-aqua-sign",getPaaS_x_aqua_sign("DELETE",url_delete_user));
          xhr_delete_user.send();
          if( (xhr_delete_user.readyState == 4)&&(xhr_delete_user.status == 200)){
            alert(i18n("ADV_SYSUSER_ALERT_DELETE_USER_SUCCESS"))
          }
      //}
  }
  this.close_popup_delete_system_user();
  this.show_all_system_user();
}

system_user_management.write_to_div=function(write_to_div_id,write_text,disappear_div){
   var that=this;
  jQuery("#"+write_to_div_id).text(write_text);
  if(write_text==this.adv_user_role_array[1].value){
	document.getElementById("advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").style.display="none";
	jQuery("#advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").closest(".advUserManage_sysManage_popupContainer").css("height",that.pageHeight[""+this.popupFrom+"_openSysUserCategory"]+"px");
	jQuery("#popup-dialog-dialog").css("top",0);
 }
  else{
	document.getElementById("advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").style.display="none";
	jQuery("#advUserManage_sysManage_categoryContainer_"+this.popupFrom+"").closest(".advUserManage_sysManage_popupContainer").css("height",that.pageHeight[""+this.popupFrom+"_notOpenSysUserCategory"]+"px");
    jQuery("#popup-dialog-dialog").css("top", this.popupNewEditTop);
  }
  if(disappear_div){jQuery("#"+disappear_div).css("display","none")}
}

system_user_management.draw_page_elements = function () {
  this.draw_page_elements_x_1()//画上部分的所有UI.
  //this.draw_table_outer_element()//画表格外层元素
};

system_user_management.draw_table_outer_element= function () {
  jQuery("#adv_sys_user_manage_main_container").append("<div id=\"adv_sys_table_container\" class=\"adv_table_container_style\"><div id=\"adv_sys_table\" class=\"adv_table_style\"></div></div>")
}


system_user_management.draw_page_elements_x_1 = function () {
  var tab_switch1_container=jQuery("#adv_sysUserManage_topContainer_tabSwitch");
  var tab_switch1=new adv_tabs_switch({
    container:tab_switch1_container,
    width:"default",
    tab_words:[i18n("ADV_SYSUSER_XITONGYONGHUGUANLI"),i18n("ADV_SYSUSER_SITEUSER")],
    callback:this.tab_switch_sysManage_role.bind(system_user_management)
  })
  /*
  jQuery("#adv_sysUserManage_topContainer_son").append("<div style=\"float:left;height:100%;width:5px;margin-left:4px;background-repeat:no-repeat;background-image:url('image/small_vertical_line.png')\"></div>");
  jQuery("#adv_sysUserManage_topContainer_son").append("<input id=\"adv_sysUserManage_search\" class=\"adv_search_bar\" style=\"float:left;margin-left: 11px;\"><div id=\"adv_sysUserManage_createUser_button\" class=\"adv_lightBlue_button\" style=\"cursor:pointer;margin-right:4px;padding-right: 7px;width:130px;line-height:37px;float:right;text-align:right;\">新建系统用户<div>");
  var that=this;
  jQuery("#adv_sysUserManage_createUser_button").bind('click', function () {
    that.open_popup_create_system_user()
  });*/
};


system_user_management.tab_switch_sysManage_role= function(){
  if(jQuery("#switch_tab0").attr("name")=="focused_div")
  {
    jQuery("#site_instruction").css("display","none");
    jQuery("#adv_sys_user_manage_table_Conainer").css("display","block");
    var tempRole=my.paas.user_type;
    //if((tempRole==1)||(tempRole=="xiTongGuanLiJueSe") ){//登录用户是系统管理员或运营管理。
    if(tempRole==1){//登录用户是系统管理员或运营管理。
    jQuery("#panel_search_input_container").css("display","block");
    jQuery("#adPos_addPosition").css("display","block");
   }
  }
  else
  {
    jQuery("#adv_sys_user_manage_table_Conainer").css("display","none");
    jQuery("#panel_search_input_container").css("display","none");
    jQuery("#adPos_addPosition").css("display","none");
    jQuery("#site_instruction").css("display","block");
    this.draw_contents_in_site_instruction();
  }
}

system_user_management.open_popup_create_system_user= function(){
  this.dialog.open();
};

system_user_management.close_popup_create_system_user= function(){
  this.dialog.close();
};
system_user_management.close_popup_edit_system_user= function(){
  this.dialog_edit.close();
};

system_user_management.close_popup_delete_system_user= function(){
  this.dialog_delete.close();
};

system_user_management.open_popup_edit_system_user_edit= function(obj){
  this.edit_row_in_all_data_index = obj;
  this.dialog_edit.open();
};

system_user_management.open_popup_zizhiFile= function(obj){
  this.edit_row_in_all_data_index=obj;
  this.dialog_zizhiFile.open();
}

system_user_management.open_popup_delete= function(obj){
  this.current_row_index=obj;
  this.dialog_delete.open();
}
system_user_management.open_popup_reset= function(obj){
  this.current_row_index=obj;
  this.dialog_reset.open();
}

system_user_management.dialog_reset_callback = function(obj){
  var that = this;
  jQuery('#adv_changePassword_submit').click(function(){
    jQuery('#adv_changePasswordDialog .regist-star').hide();

    var newpassword1 = jQuery('#adv_changePasswordDialog_newpassword input').val();

    if(!newpassword1){
      jQuery('#adv_changePasswordDialog_newpassword .regist-star').show();
      return;
    }

    if( (system_user_management.return_usersData_thisPage)&&(system_user_management.return_usersData_thisPage.users) )
    {
      var user_name=system_user_management.return_usersData_thisPage.users[that.current_row_index].user_name;
      var user_name_urlParm = encodeURIComponent(user_name);

      var AquaPassData = {
        "password": newpassword1
      };
      var url_update_user = paasHost + "/aquapaas/rest" + "/users/password/" + user_name_urlParm + "@default?user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
      jQuery.ajax({
        type: 'PUT',
        async: true,
        url: url_update_user,
        data: JSON.stringify(AquaPassData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'application/json',
          //'x-third-party': 'aqua',
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url_update_user)
        },
        dataType: "text",
      }).done(function () {
        //callback()
        that.dialog_reset.close();
        that.show_all_system_user();
      }).fail(function(){
      });
    }


  });

}

system_user_management.close_popup_edit_system_user= function(){
  this.dialog_edit.close();
};


system_user_management.choose_upload_file=function(){
  var upload = new inputFile();

  upload.init("#adv_browserFile", storage_qualification_folder.replace("/",""), {
    _isExistfun: function (file_name) {
      var console_message = file_name + "Exist";
    },
    _startfun: function (file_name, updateSize, fileSize, self) {
      var console_message = file_name + "start";
    },
    _progressfun: function (file_name, updateSize, fileSize, self) {
      var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
    },
    _errorfun: function (e) {
      var console_message = file_name + "error";
    },
    _endfun: function (file_name, updateSize, fileSize, file_url, self) {
      var console_message = file_name + " end. The url = " + file_url;
      if(file_name){jQuery("#adv_input_region_company_uploadFile").val(file_name)}
      var img = new Image();
      img.src = file_url;
      img.onload = function () {
      };
      system_user_management.current_upload_file_url = file_url;
    },
  });
  //开始绑定创建事件
  jQuery("#adv_upload_submit").click(function () {
  });
}

system_user_management.draw_contents_in_site_instruction = function(){
  var self = this;
  jQuery("#site_instruction")[0].innerHTML = "";
  jQuery("#site_instruction").css({
    "padding": "5px 0px 0px 5px"
  });
  var list = new StyledList({
    rows: 11,
    columns: 6,
    containerId: 'site_instruction',
    async: true,
    titles: [{
      label: i18n('ADPOS_CNECT_SITE_ID')
    }, {
      label: i18n('ADPOS_CNECT_SITE_NAME')
    }, {
      label: i18n('ADPOS_LIST_TITLE_OPR')
    }, {
      label: i18n('ADPOS_CNECT_SITE_ID')
    }, {
      label: i18n('ADPOS_CNECT_SITE_NAME')
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
      columnsWidth: [0.1666,0.1666,0.1666,0.1666,0.1666]//117,232,155,211,225
    }
  });

  list.create();
  this.site_list = list;
  this.getSiteListData();
  jQuery(window).on("resize", function () {
    list.resize();
  })
}
system_user_management.getSiteListData = function(){
  var self = this;
  var dmRoot = paasHost + paasDomain + '/dm';
  var dmUriPrefix = 'aquapaas/rest/dm/';
  var advUriPrefix = 'aquapaas_adv/rest/ads/';
  var url = dmRoot + '/site';
  jQuery.ajax({
    url: url,
    type: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).done(function(data) {
    self.formSiteListData(data);
  });
}
system_user_management.formSiteListData = function(data){
  var self = this;
  if(window.AdvSystemType == 'local'){
    data = data.filter(function(item){
      return item.id == window.AdvCentralSiteId;
    });
  }
  self.sitesData = data;
  var len = data.length;
  var listdata = [];
  for (var i = 0; i < len; i += 2) {
    var item1 = data[i];
    var item2 = data[i + 1];
    var url1 = "";
    var url2 = "";
    var adv1 = null, adv2 = null;
    var opr1 = "";
    var opr2 = "";
    var parameter = encodeURIComponent("jumpToLocalUserManage")+";" //JumpType
      + encodeURIComponent(my.userName)+";"//userName
      + encodeURIComponent(my.userPassword)//userPassword
    if(item1){
      item1.endpoints && item1.endpoints.forEach(function(endpoint) {
        if (endpoint.app_type == 'adv') {
          adv1 = endpoint;
        } else if (endpoint.app_type == 'dm') {
        }
      });
      url1 = self.findJumpSiteUrlPrefix(item1.id);
      if(url1){
        url1 = url1 + "?" + my.base64Encode(parameter);
        opr1 = '<a class="adSite_operation" href="' + url1 + '" target="_blank">' + i18n('ADV_SYSUSER_OPENSITEUSERMANAGE') + '</a>';
      }else{
        opr1 = '<span class="adSite_operation">' + i18n('ADV_SYSUSER_OPENSITEUSERMANAGE') + '</span>';
      }
    }
    if(item2){
      item2.endpoints && item2.endpoints.forEach(function(endpoint) {
        if (endpoint.app_type == 'adv') {
          adv2 = endpoint;
        } else if (endpoint.app_type == 'dm') {
        }
      });
      url2 = self.findJumpSiteUrlPrefix(item2.id);
      if(url2){
        url2 = url2 + "?" + my.base64Encode(parameter);
        opr2 = '<a class="adSite_operation" href="' + url2 + '" target="_blank">' + i18n('ADV_SYSUSER_OPENSITEUSERMANAGE') + '</a>';
      }else{
        opr2 = '<span class="adSite_operation">' + i18n('ADV_SYSUSER_OPENSITEUSERMANAGE') + '</span>';
      }
    }
    var listItem = [{
      label: item1.id
    }, {
      label: item1.name
    }, {
      label: opr1
    },{
      label: (item2 && item2.id) || ""
    }, {
      label: (item2 && item2.name) || ""
    }, {
      label: opr2 || ""
    }
    ];
    listdata.push(listItem);
  }
  self.site_list.updateInPage(listdata);
}


system_user_management.get_qulification_file= function(){
  var this_index=this.edit_row_in_all_data_index;
  var this_data_array=this.get_table_data_from_server;
  var this_data_array_user=[];
  if(this_data_array.users)
    this_data_array_user=this_data_array.users;
  var this_data_array_user_index=this_data_array_user[this_index];
  this.edit_data_array_from_server=this_data_array_user_index;
  var this_data_array_user_index_metadata=this_data_array_user_index.metadata;
  var img=new Image();
  img.src=this_data_array_user_index_metadata.AquaPaaSAdv_CertificateFileURL;
  if(this.first_view_pic=="")
  {
    this.img_width_=img.width;
    this.img_height=img.height;
    this.first_view_pic="img size changed"
  }
 // var image_left_position=(jQuery("#adv_zizhi_file_body").width()-width_)/2;

  var background_style="";
  if(this.img_width< this.img_height){background_style="100% auto"}
  else {background_style = "auto 100%"}
  jQuery("#adv_zizhi_file_body").css("background-size",background_style);
  jQuery("#adv_zizhi_file_body").css("background-image", "url('" + my_aqua.getDownloadFileURL(this_data_array_user_index_metadata.AquaPaaSAdv_CertificateFileURL)+ "')");
  jQuery("#adv_zizhi_file_body").css("background-position","center")
}

system_user_management.findJumpSiteUrlPrefix= function(siteId){
  var result = false;
  var i = 0;
  var length = (JumpSiteUrlPrefix && JumpSiteUrlPrefix.length) || 0;
  for(i=0; i<length; i++){
    if(JumpSiteUrlPrefix && JumpSiteUrlPrefix[i].siteId == siteId){
      result = JumpSiteUrlPrefix[i].url;
      break;
    }
  }
  return result;
}


//页面初始化入口。
system_user_management.init();