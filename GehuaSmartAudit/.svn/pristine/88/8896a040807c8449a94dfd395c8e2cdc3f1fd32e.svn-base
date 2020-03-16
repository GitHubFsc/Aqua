define(['PopupDialog', 'jquery', 'StyledListVersionTwo','AlarmCommonAPI'], function(PopupDialog, $$, NewStyledListVersionTwo,AlarmCommonAPI){
	var userAdmin = function(){};
	userAdmin.prototype={
		init: function(containerId){
			this.initPara(containerId);
			this.drawUI(containerId);
		},
		initPara:function(containerId){
		  this.containerId=containerId;
			this.idCommonPrefix="location_"+containerId+App.getAnotherId();
			this.userAlphabetSort="desc";//第一次点击时降序
			this.addEditType="add";
			this.singleThingDefObj={};
			this.enumRequestParahaveUsed={};//2019.1.2 14:14mail fangli:, 页面不需要每次用到 6.5和7.5 接口, 都去后台访问,  这些定义一旦需求定型, 很少变动, 无需反复访问.
			this.enumRequestParahaveUsed[rebengThingDefID]=[];
			this.storedPropertyData={};
			this.storedFormatData={};
			this.clickRowIndex=0;
			this.menuRightArray=[
				{"displayName":""+i18n('Menu_Location')+"","value":1},
				{"displayName":""+i18n('Menu_Running_Statistic')+"","value":2},
				{"displayName":""+i18n('Menu_Device_History')+"","value":4},
				{"displayName":""+i18n('Menu_Basis_Region')+"","value":8},
				{"displayName":""+i18n('Menu_Basis_Device')+"","value":16},
				{"displayName":""+i18n('Menu_Basis_Producer')+"","value":32},
				{"displayName":""+i18n('Menu_Basis_Model')+"","value":64},
				{"displayName":""+i18n('USER_ADMIN_AUTHORIZE_DTU_EQUIP')+"","value":128},
				{"displayName":""+i18n('Menu_Device_HeatPump')+"","value":256},
				{"displayName":""+i18n('Menu_Warning_DTU')+"","value":512},
				{"displayName":""+i18n('USER_ADMIN_AUTHORIZE_HEAT_PUMP_ALARM')+"","value":1024},
				{"displayName":""+i18n('USER_ADMIN_AUTHORIZE_ADD_WORK_ORDER')+"","value":2048,"repeat":true},
				{"displayName":""+i18n('USER_ADMIN_AUTHORIZE_WORK_ORDER_LIST')+"","value":2048,"repeat":true},
				{"displayName":""+i18n('USER_ADMIN_AUTHORIZE_REPAIR_COMMIT')+"","value":2048,"repeat":true},
				{"displayName":""+i18n('USER_ADMIN_AUTHORIZE_OPERATION_LOG')+"","value":4096},
				{"displayName":""+i18n('Menu_User_Admin')+"","value":8192}
			];
			this.PopupDialogViewInstallInfo =new PopupDialog({
				url:"content/warning_device/popup_heat_pump_alarm_install_info.html",
				width:681,
				height:484,
				context:this,
				callback:this.popupDialogViewInstallInfoCallback
			});
			this.PopupDialogUserInfo =new PopupDialog({
				url:"content/user_admin/popup_add_edit_user_info.html",
				width:683,
				height:330,
				context:this,
				callback:this.openPopupDialogUserInfoCallback
			});
			this.PopupDialogDeleteUser =new PopupDialog({
				url:"content/user_admin/popup_delete_user.html",
				width:584,
				height:331,
				context:this,
				callback:this.openPopupDialogDeleteUserCallback
			});
			this.PopupDialogAuthorizeUser =new PopupDialog({
				url:"content/user_admin/popup_authorize_user_info.html",
				width:684,
				height:454,
				context:this,
				callback:this.openPopupDialogAuthorizeUserCallback
			});
			this.alertSentenceA="";
			this.alertSentenceB="";
			this.rowIndex=0;
			this.serverRawDataUsers=[];
		},
		drawMenuBody:function(){
			var jq=$$;
			var idCommonPrefix=this.idCommonPrefix;
		},
		openPopupDialogAuthorizeUserCallback:function(){
		  var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var nick_name=serverRawDataUsers.nick_name;
			document.getElementById("popup_authorize_user_title").innerHTML=i18n("USER_ADMIN_AUTHORIZEA")+nick_name+i18n("USER_ADMIN_AUTHORIZEB");
			this.firstMenuIndex=0;
			this.secondMenuIndex=0;
			this.authUserData={};
			this.getAuthUserData();
			this.fillMenuRight();
			this.getEquipDataAndMenufactureData();
			this.fillDefaultMenu();
			this.relocateMenu();
			this.fillFirstMenuBody();
			this.bindFirstMenu();
			this.fillSecondMenuBody();
			this.bindSecondMenu();
			this.fillEquipRightContainer();
		  //this.formatMenuData();
			//this.formatMenuDataMenufacture();
			this.openPopupDialogAuthorizeUserCallbackBindEvent();
		},
		fillEquipRightContainer:function(){
			var jq=$$;
			jq("#popup_authorize_equip_right_container").empty();
			var currentEquipAndMenufactureData={};
			var equipAndMenufactureData=this.equipAndMenufactureData;
			if(equipAndMenufactureData&&equipAndMenufactureData[this.firstMenuIndex]){
				currentEquipAndMenufactureData=equipAndMenufactureData[this.firstMenuIndex];
			}
			var currentThingDefID=currentEquipAndMenufactureData.thingDefID;
			var name=currentEquipAndMenufactureData.name;
			var manufactureData=currentEquipAndMenufactureData.manufactureData;
			var displayArray=[];
			var companyValueListInAuthUserDataInCurrentThingDefId=[];
			if((typeof this.authUserData)=="string"){
			 var temp=this.authUserData;
			 this.authUserData=JSON.parse(temp)
			}
			if(this.authUserData&&this.authUserData.manufacture){
				var authUserDataManufacture=this.authUserData.manufacture;
        for(var i= 0,len = authUserDataManufacture.length;i<len;i++){
					var authUserDataManufactureThingDefID=(authUserDataManufacture[i].substring(0,authUserDataManufacture[i].indexOf("_")));
					if(authUserDataManufactureThingDefID==currentThingDefID){
					  var currentValue=(authUserDataManufacture[i].substring(currentThingDefID.length+1,authUserDataManufacture[i].length));
						if(currentValue=="all"){
							companyValueListInAuthUserDataInCurrentThingDefId.push(currentValue)
						}
						else{
							companyValueListInAuthUserDataInCurrentThingDefId.push(parseInt(currentValue));
						}
					}
				}
			}
			
			//有all存在，不重复列后面的厂商
			if(jq.inArray("all",companyValueListInAuthUserDataInCurrentThingDefId)!=-1){
				for(var i= 0,manufactureDataLen = manufactureData.length;i<manufactureDataLen;i++){
					var companyDisplayName=name+"&nbsp;"+manufactureData[i].displayName;
					var companyValue=manufactureData[i].value;
					jq("#popup_authorize_equip_right_container").append("<div class=\"checkbox_text_container\" currentThingDefID=\""+currentThingDefID+"\" style=\"margin-bottom:18px\"><div class=\"checkbox_text_checkbox\"><div companyValue=\""+companyValue+"\" class=\"checkbox_text_checkbox_son_light\"></div></div><div class=\"checkbox_text_text_style2\" style=\"padding-left:11px;margin-right:10px;width:auto;max-width:auto\">"+companyDisplayName+"</div></div>");
				}
			}
			else{
				for(var i= 0,companyValueListInAuthUserDataInCurrentThingDefIdLen = companyValueListInAuthUserDataInCurrentThingDefId.length;i<companyValueListInAuthUserDataInCurrentThingDefIdLen;i++){
				var companyValue=parseInt(companyValueListInAuthUserDataInCurrentThingDefId[i]);
				var companyDisplayName=name+"&nbsp;"+companyValue;
				for(var j= 0,manufactureDataLen = manufactureData.length;j<manufactureDataLen;j++){
					if(manufactureData[j].value==companyValue){
						companyDisplayName=name+"&nbsp;"+manufactureData[j].displayName;
					}
				}
				jq("#popup_authorize_equip_right_container").append("<div class=\"checkbox_text_container\" currentThingDefID=\""+currentThingDefID+"\" style=\"margin-bottom:18px\"><div class=\"checkbox_text_checkbox\"><div companyValue=\""+companyValue+"\" class=\"checkbox_text_checkbox_son_light\"></div></div><div class=\"checkbox_text_text_style2\" style=\"padding-left:11px;margin-right:10px;width:auto;max-width:auto\">"+companyDisplayName+"</div></div>");
			 };
			};
			this.bindCheckBoxEquipRight();
		},		
		getEquipDataAndMenufactureData:function(){//1、获取所有设备类型数据，2、根据1的设备类型，获取各自的厂商数据。
			var self=this;
			//config.js里配置值
			var singleParaArray=[{thingdefid:rebengThingDefID,namespace:rebengNamespace},{thingdefid:DTUThingDefID,namespace:DTUNamespace}]
	    this.equipAndMenufactureData=[];
			for(var i= 0,len = singleParaArray.length;i<len;i++){
				var obj={
					thingdefid:singleParaArray[i]["thingdefid"],
					namespace:singleParaArray[i]["namespace"],
				};
				var requestAlarmData = new AlarmCommonAPI(obj);
				requestAlarmData.alarmRequestSingleThingDef(function(data){
					if(data){
						var thingDefID=data.thingDefID;
						var currentObj={};
						currentObj.thingDefID=thingDefID;
						currentObj.name=data.name?data.name:"";
						currentObj.equipData=data;
						//获取每个设备对应的公司数据
						if(data&&data.properties){
							for(var j= 0,len = data.properties.length;j<len;j++){
								if(data.properties[j].name=="manufacture"){
									if(data.properties[j].dataType==5){
										var valuesEnumDefName=data.properties[j].valuesEnumDefName?data.properties[j].valuesEnumDefName:"";												
										var url=paasHost+"/aquapaas/rest/thingenumdef/item/list/";
										url+=data["namespace"]+"/";
										url+=valuesEnumDefName;
										var thingDefIDArray=[];
										thingDefIDArray.push(data["thingDefID"]);
										var body_={
											enum_device:thingDefIDArray
										};
										url=url+"?user_id=" + my.paas.user_id;
										url=url+"&access_token=" + my.paas.access_token;
										url=url+"&app_key=" + paasAppKey;
										url=url+"&timestamp=" + new Date().toISOString();
										jQuery.ajax({
											type  : 'POST',
											async :false,
											url   : url,
											headers: {
												'x-aqua-sign': getPaaS_x_aqua_sign('POST', url),
												'Content-Type': 'application/json',
												'Accept': 'application/json'
											},
											data: JSON.stringify(body_),
											error:function(error){
											}
									 }).done(function(dataCompany, status, xhr){
											companyData=[];
											for(var k= 0,lenCompany = dataCompany.length;k<lenCompany;k++){
												companyData.push(dataCompany[k])
											};
											currentObj.manufactureData=companyData;
											self.equipAndMenufactureData.push(currentObj)
									 })
									}
									break;
								}
							}
						}
					}
				});
			}
		},
		fillDefaultMenu:function(){
			var jq=$$;
			var equipAndMenufactureData=this.equipAndMenufactureData;
			if(equipAndMenufactureData&&equipAndMenufactureData[0]&&equipAndMenufactureData[0].equipData&&equipAndMenufactureData[0].equipData.name){
				jq("#popup_authorize_equip_menu_top_text").text(equipAndMenufactureData[0].equipData.name);
			}
		},	
		relocateMenu:function(){
			var jq=$$;
			var menuDiverseTop=document.getElementById("popup_authorize_equip_menu_container").offsetTop+32+51-jq("#popup_authorize_scroll_container").scrollTop()+"px";
			var menuDiverseLeft=document.getElementById("popup_authorize_equip_menu_container").offsetLeft+"px";
		  var menuDiverseLeftB=document.getElementById("popup_authorize_equip_menu_container").offsetLeft+214+"px";
			jq("#popup_authorize_equip_menu_body").css({"top":menuDiverseTop,"left":menuDiverseLeft,"z-index":"2000"});
			jq("#popup_authorize_manufacture_menu_body").css({"top":menuDiverseTop,"left":menuDiverseLeftB,"z-index":"2000"});
		},
		fillFirstMenuBody:function(){
			var jq=$$;
			var equipAndMenufactureData=this.equipAndMenufactureData;
			jq("#popup_authorize_equip_menu_body").empty();
			for(var i= 0,len = equipAndMenufactureData.length;i<len;i++){
			  var name=equipAndMenufactureData[i].equipData.name;
				jq("#popup_authorize_equip_menu_body").append("<div row_index="+i+" class=\"menu_row_container\" onmouseover=\"javascript:this.style.color='#29bff4'\" onmouseout=\"javascript:this.style.color='#888888'\">"+name+"</div>");
			}
		},
		bindFirstMenu:function(){
			var jq=$$;
			var self=this;
		  //表头
			jq("#popup_authorize_equip_menu_top").on("click",function(){
				if(jq("#popup_authorize_equip_menu_body").css("display")=="none"){
					jq("#popup_authorize_equip_menu_body").css("display","block");
				}
				else{
					jq("#popup_authorize_equip_menu_body").css("display","none");
				}
			});
			//body
			jq("#popup_authorize_equip_menu_body").on("click",".menu_row_container",function(){//打开或关闭设备类型菜单
				self.firstMenuIndex=jq(this).attr("row_index");
				if(self.firstMenuIndex!=jq(this).attr("row_index")){//还是点击原来选项时，任何内容不变
				}
				else{
					document.getElementById("popup_authorize_equip_menu_top_text").innerHTML=jq(this).text();
					jq("#popup_authorize_equip_menu_body").css("display","none");
					self.fillSecondMenuBody();
					self.fillEquipRightContainer()
				}
			});
		},
		fillSecondMenuBody:function(){
			var jq=$$;
			var manufactureData=[];
			var equipAndMenufactureData=this.equipAndMenufactureData;
			if(equipAndMenufactureData&&equipAndMenufactureData[this.firstMenuIndex]){
				manufactureData=equipAndMenufactureData[this.firstMenuIndex].manufactureData;
			}
			if(manufactureData[0]){
				jq("#popup_authorize_manufacture_menu_top_text").text(manufactureData[0].displayName);
			};
			jq("#popup_authorize_manufacture_menu_body").empty();
			for(var i= 0,len = manufactureData.length;i<len;i++){
			  var name=manufactureData[i].displayName;
				jq("#popup_authorize_manufacture_menu_body").append("<div row_index="+i+" class=\"menu_row_container\" onmouseover=\"javascript:this.style.color='#29bff4'\" onmouseout=\"javascript:this.style.color='#888888'\" style=\"width:411px\">"+name+"</div>");
			};
		},
		bindSecondMenu:function(menuObj){
			var jq=$$;
			var self=this;
			jq("#popup_authorize_manufacture_menu_top").on("click",function(){
				if(jq("#popup_authorize_manufacture_menu_body").css("display")=="none"){
					jq("#popup_authorize_manufacture_menu_body").css("display","block");
				}
				else{
					jq("#popup_authorize_manufacture_menu_body").css("display","none");
				}
			});
			jq("#popup_authorize_manufacture_menu_body").on("click",".menu_row_container",function(){//打开或关闭设备类型菜单
				self.secondMenuIndex=jq(this).attr("row_index");
				jq("#popup_authorize_manufacture_menu_body").css("display","none");
				document.getElementById("popup_authorize_manufacture_menu_top_text").innerHTML=jq(this).text();
				var equipAndMenufactureData=self.equipAndMenufactureData;
				var currentEquipAndMenufactureData=equipAndMenufactureData[self.firstMenuIndex];
				var thingDefID=currentEquipAndMenufactureData.thingDefID;
				var currentMenufactureData=currentEquipAndMenufactureData.manufactureData[self.secondMenuIndex];
				var authUserData=self.authUserData;
				var currentMenufactureDataValue=currentMenufactureData.value;
				if(authUserData.manufacture){//过去传过数据
				  var authUserDataManufacture=self.authUserData.manufacture;
					var manufactureValueArray=[];
          for(var i= 0,len = authUserDataManufacture.length;i<len;i++){
						//获取公司后缀
						manufactureValueArray.push((authUserDataManufacture[i].substring(thingDefID.length+1,authUserDataManufacture[i].length)));
					};
					if(jq.inArray("all",manufactureValueArray)!=-1){//厂商下拉菜单选择厂商后，如果之前下面已选择了所有公司，就不用界面再添加了。
						
					}
					else{
						if(jq.inArray(currentMenufactureDataValue,manufactureValueArray)!=-1){//下面容器已选中，就不用添加了。
							
						}
						else{
							self.authUserData.manufacture.push(thingDefID+"_"+currentMenufactureDataValue)
						}
					}
				}
				else{
					self.authUserData={manufacture:[]};
					self.authUserData.manufacture.push(thingDefID+"_"+currentMenufactureDataValue)
				}
					
			  if(authUserData.region){}//IOT PC上没有区域输入,但如果其他应用userdata中输入过区域，IOT不覆盖。
				else{//添加区域权限(在点击厂商下拉菜单后)，由于界面上没有区域权限，所以都添加成all.
					self.authUserData.region=[];
					for(var i= 0,equipAndMenufactureDataLen = equipAndMenufactureData.length;i<equipAndMenufactureDataLen;i++){
						var thingDefID=equipAndMenufactureData[i].thingDefID;
						self.authUserData.region.push(thingDefID+"_"+"all")
					}
				}
			  self.fillEquipRightContainer();
			})
		},
		bindCheckBoxAllRight:function(){
			var jq=$$;
			var self=this;
			jq("#popup_authorize_user_all_right_button").on("click",function(){
			  var allButton=this;
				if(jq(allButton).children().children().attr("class")=="checkbox_text_checkbox_son_dark"){//选中
					jq(allButton).children().children().attr("class","checkbox_text_checkbox_son_light");
					jq("#popup_authorize_menu_right_container").find(".checkbox_text_container").each(function(){
						jq(this).children().children().attr("class","checkbox_text_checkbox_son_light");
					})
				}
				else{
					jq(allButton).children().children().attr("class","checkbox_text_checkbox_son_dark");
					jq("#popup_authorize_menu_right_container").find(".checkbox_text_container").each(function(){
						jq(this).children().children().attr("class","checkbox_text_checkbox_son_dark");
					})
				}
				self.authAllEquipAndMenufacture();
			})
		},
		bindCheckBoxMenuRight:function(){
			var jq=$$;
			var self=this;
			//添加工单、工单列表、维修上报为同样权限值
			var repeatValue=2048;
			jq("#popup_authorize_menu_right_container").find(".checkbox_text_container").each(function(){
				var storedname=jq(this).children().children().attr("storedname");
				jq(this).on("click",function(){
				  var combineName=jq(this).attr("currentthingdefid")+"_"+jq(this).children().children().attr("companyvalue");
					if(jq(this).children().children().attr("class")=="checkbox_text_checkbox_son_dark"){//选中
						jq(this).children().children().attr("class","checkbox_text_checkbox_son_light");
            if(storedname==repeatValue){
							jq("#popup_authorize_menu_right_container").find(".checkbox_text_checkbox").each(function(){
								if(jq(this).children().attr("storedname")==repeatValue){
									jq(this).children().attr("class","checkbox_text_checkbox_son_light");
								}
							})
						}
					}
					else{
						jq(this).children().children().attr("class","checkbox_text_checkbox_son_dark");
						if(storedname==repeatValue){
							jq("#popup_authorize_menu_right_container").find(".checkbox_text_checkbox").each(function(){
								if(jq(this).children().attr("storedname")==repeatValue){
									jq(this).children().attr("class","checkbox_text_checkbox_son_dark");
								}
							})
						}
					}
				})
			});
		},
		
		bindCheckBoxEquipRight:function(){
			var jq=$$;
			var self=this;
			jq("#popup_authorize_equip_right_container").find(".checkbox_text_container").each(function(){
				jq(this).on("click",function(){
				  var combineName=jq(this).attr("currentthingdefid")+"_"+jq(this).children().children().attr("companyvalue");
					if(jq(this).children().children().attr("class")=="checkbox_text_checkbox_son_dark"){//选中
						jq(this).children().children().attr("class","checkbox_text_checkbox_son_light");
						if(self.authUserData.manufacture){
							if(jq.inArray(combineName,self.authUserData.manufacture)==-1){//原本userdata里已有的，就不再添加
								self.authUserData.manufacture.push(combineName)
							}
						}
						else{
							self.authUserData.manufacture=[];
							self.authUserData.manufacture.push(combineName);
						}
					}
					else{
						jq(this).children().children().attr("class","checkbox_text_checkbox_son_dark");
						if(self.authUserData.manufacture){
							if(jq.inArray(combineName,self.authUserData.manufacture)!=-1){
								var combineNameIndex=jq.inArray(combineName,self.authUserData.manufacture);
								 self.authUserData.manufacture.splice(combineNameIndex,1);//删除这个元素
							}
							
						}
					}
				})
			});
		},
		openPopupDialogAuthorizeUserCallbackBindEvent:function(){
			var jq=$$;
			var self=this;
			jq("#popup_authorize_scroll_container").scroll(function(){
				self.relocateMenu();
			});
			jq("#popup_authorize_user_operation_button").on("click",function(){
				self.submitAuth();
				self.PopupDialogAuthorizeUser.close();
			});
			jq("#popup_authorize_user_cancel_button").on("click",function(){
				self.PopupDialogAuthorizeUser.close();
			});
			this.bindCheckBoxMenuRight();
			this.bindCheckBoxAllRight();
		},
		submitAuth:function(){
			this.authMenu();
			this.authEquip();
		},
		authMenu:function(){
			var jq=$$;
			var self=this;
			var IotUserRight=0;
			var repeatCounted="false";//同样权限菜单项是否选择过，默认没选择。
			jq("#popup_authorize_menu_right_container").find(".checkbox_text_checkbox_son_light").each(function(){
				if((jq(this).attr("repeat")=="repeat")&&(repeatCounted=="true")){}
				else{
					IotUserRight+=parseInt(jq(this).attr("storedName"));
					if(jq(this).attr("repeat")=="repeat"){repeatCounted="true"}
				}
			})
			var dataObj= {
				"metadata": {
					Iot_UserRight:IotUserRight,
				}
			};
		  var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var user_id=serverRawDataUsers.user_id;
			var url_register_user = paasHost + "/aquapaas/rest/users/user/";
      url_register_user+=""+user_id+"?user_id="+my.paas.user_id+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
			jq.ajax({
				type  : "PUT",
				async :false,
				url   : url_register_user,
				data: JSON.stringify(dataObj),
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign("PUT", url_register_user),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				error:function(error){
				}
			}).done(function(){
			}).always(function(){
			  self.list_table.refreshList();
			});
		},
		getAuthUserData:function(){
			var jq=$$;
			var self=this;
      var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var userid=serverRawDataUsers.user_id;
			var urlAuthUserData = paasHost + "/aquapaas/rest/userdata";
			urlAuthUserData+=("/"+paasAppKey);
			urlAuthUserData+="/IoT";
			urlAuthUserData+="/thingUserRight";
			//mail:2019.1.21 13:53
			urlAuthUserData+="?user_id="+userid+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
			var contentType="text/plain";
			jq.ajax({
				type  : "GET",
				async :false,
				url   : urlAuthUserData,
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign("GET", urlAuthUserData),
					'Content-Type': contentType,
					'Accept': contentType
				},
				error:function(error){
				}
			}).done(function(data){
					self.authUserData=data
			});
		},
		authEquip:function(){
			var jq=$$;
			var self=this;
			console.log(this.authUserData);
			var method="POST";
			if((JSON.stringify(this.authUserData)!="{}")){
				var method="PUT";
			}
      var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var userid=serverRawDataUsers.user_id;
			var urlAuthUserData = paasHost + "/aquapaas/rest/userdata";
			urlAuthUserData+=("/"+paasAppKey);
			urlAuthUserData+="/IoT";
			urlAuthUserData+="/thingUserRight";
			//mail:2019.1.21 13:53
			urlAuthUserData+="?user_id="+userid+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
			var contentType="text/plain";
			jq.ajax({
				type  : method,
				async :false,
				url   : urlAuthUserData,
				data: JSON.stringify(this.authUserData),
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign(method, urlAuthUserData),
					'Content-Type': contentType,
					'Accept': contentType
				},
				error:function(error){
				}
			}).done(function(){
			});
		},
		authAllEquipAndMenufacture:function(){
			var equipAndMenufactureData=this.equipAndMenufactureData;
			if(equipAndMenufactureData.length>0&&equipAndMenufactureData[0].thingDefID){//有thingdefid才让全选。
					this.authUserData.manufacture=[];
					var hasOldRegion=false;
					if(this.authUserData.region){
						hasOldRegion=true
					}
					else{
						this.authUserData.region=[]
					};
					for(var i= 0,equipAndMenufactureDataLen = equipAndMenufactureData.length;i<equipAndMenufactureDataLen;i++){
						var thingDefID=equipAndMenufactureData[i].thingDefID;
						this.authUserData.manufacture.push(thingDefID+"_"+"all");
						if(hasOldRegion){}
						else{
							this.authUserData.region.push(thingDefID+"_"+"all")
						}
					}
			};
			this.fillEquipRightContainer();
		},
		fillMenuRight:function(){
			var jq=$$;
			var menuRightArray=this.menuRightArray;
			//读取过去设置的权限
      var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var category_array=[];
			if(serverRawDataUsers.metadata&&serverRawDataUsers.metadata.Iot_UserRight)
			{
			  var userRightToStr=serverRawDataUsers.metadata.Iot_UserRight.toString(2);
				var userRight_transfer=userRightToStr.split("").reverse();
				for(var i=0;i<userRight_transfer.length;i++){
					if(userRight_transfer[i]==1){
						var value_=1*Math.pow(2,i);
						var this_sysCategory_length=menuRightArray.length;
						for(var j=0;j<this_sysCategory_length;j++){
							if(menuRightArray[j].value==value_){
								if(menuRightArray[j].repeat){
								  for(var k=0;k<this_sysCategory_length;k++){//菜单项有些是权限一样的
										if(menuRightArray[k].repeat){
											if(jq.inArray(k,category_array)==-1){
												category_array.push(parseInt(k));
											}
										}
									}
								}
								else{
								 category_array.push(parseInt(j));
								}
								break;
							}
						}	
					}
				};
			}
			for(var i= 0,len = menuRightArray.length;i<len;i++){
			  var repeatHTML=(menuRightArray[i].repeat?"repeat":"notRepeat");
				var checkboxStyle=(jQuery.inArray(i,category_array)==-1)?"checkbox_text_checkbox_son_dark":"checkbox_text_checkbox_son_light";
			  var htmlText="<div class=\"checkbox_text_container\" style=\"margin-bottom:18px\"><div class=\"checkbox_text_checkbox\"><div repeat=\""+repeatHTML+"\" storedName=\""+menuRightArray[i].value+"\" class=\""+checkboxStyle+"\"></div></div><div class=\"checkbox_text_text\" style=\"padding-left:11px\">"+menuRightArray[i].displayName+"</div></div>";
				jq("#popup_authorize_menu_right_container").append(htmlText);
			}
		},
		offSet:function(curEle) {
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
		},
		initRequest:function(){
		  var jq=$$;
		  var self=this;
			var obj={
			thingdefid:rebengThingDefID,
			namespace:rebengNamespace
			};
			var requestAlarmData = new AlarmCommonAPI(obj);
			requestAlarmData.alarmRequestSingleThingDef(function(data){
				if(data){
					self.singleThingDefObj=data;
				}
			});
			var url=paasHost+"/aquapaas/rest/thingdef/property/";
			url+=rebengNamespace+"/";
			url+=rebengThingDefID;
			url=url+"?user_id=" + my.paas.user_id;
			url=url+"&access_token=" + my.paas.access_token;
			url=url+"&app_key=" + paasAppKey;
			url=url+"&timestamp=" + new Date().toISOString();
			jq.ajax({
				type  : 'GET',
				async :false,
				url   : url,
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign('GET', url),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				error:function(error){
				}
			}).done(function(dataProperty, status, xhr){
				self.storedPropertyData[rebengThingDefID]=dataProperty;
			});
		},
		drawUI:function(containerId){
			this.drawUITitle(containerId);
			this.drawUITable(containerId);
		},
		drawUITitle:function(containerId){
			var jq=$$;
			var self=this;
			var idCommonPrefix=this.idCommonPrefix;
			var title="<div class=\"popup_dialog_v2_header_left\" style=\"margin-left:19px;\"><div class=\"popup_dialog_v2_header_left_bar\"></div><div class=\"popup_dialog_v2_header_left_title\">"+i18n('USER_ADMIN_USER_INFO')+"</div></div>";
			var addUserButton="<div id=\""+idCommonPrefix+"_"+"add_user_button\" class=\"popup_dialog_v2_foot_button_light\" style=\"background-image:url('image/common/add_user.png');margin-right:13px;background-color:#44ccee;border-color:#66b9ce;width:100px;background-position:9px center;margin-top:9px\"><div class=\"popup_dialog_v2_foot_content\">"+i18n('USER_ADMIN_ADD_USER')+"</div></div>";
			var exportButton="<div id=\""+idCommonPrefix+"_"+"export_button\" class=\"popup_dialog_v2_foot_button_light\" style=\"background-image:url('image/common/export.png');margin-right:13px;background-color:#fe931f;border-color:#d29756;width:105px;background-position:9px center;margin-top:9px\"><div class=\"popup_dialog_v2_foot_content\">"+i18n('USER_ADMIN_EXPORT_INFO')+"</div></div>";
			var importButtonInput="<input id=\""+idCommonPrefix+"_"+"import_button\" type=\"file\" style=\"cursor:pointer;position:absolute;left:0;width:105px;height:32px;opacity:0;\"/>"
			var importButton="<div class=\"popup_dialog_v2_foot_button_light\" style=\"background-image:url('image/common/import.png');margin-right:13px;background-color:#fe931f;border-color:#d29756;width:105px;background-position:10px center;margin-top:9px\"><div class=\"popup_dialog_v2_foot_content\">"+i18n('USER_ADMIN_IMPORT_INFO')+"</div>"+importButtonInput+"</div>";
			var sortButton="<div id=\""+idCommonPrefix+"_"+"alphabet_sort\" class=\"round_radius_container\" style=\"border-radius:16px\"><div style=\"float:left;padding-left:19px\">"+i18n('USER_ADMIN_ALPHABET_SORT')+"</div><img src=\"image/common/down_arrow.png\" style=\"margin-top:12px;display:block;float:right;margin-right:14px\"/></div>";
			var head="<div class=\"page_body_title\" id=\""+idCommonPrefix+"_page_body_title\" style=\"font-size:14px\">"+title+""+addUserButton+""+exportButton+""+importButton+""+sortButton+"</div>";
			jq("#"+containerId+"").append("<div id=\""+idCommonPrefix+"_"+"page_container\" class=\"page_body_container\" style=\"color:#777777\">"+head+"</div>");
			this.bindEventsTitle()
		},
		bindEventsTitle:function(){
			var jq=$$;
			var self=this;
			var idCommonPrefix=this.idCommonPrefix;
			var titleObj=document.getElementById(""+idCommonPrefix+"_page_body_title");
			var alphabetSortObj=document.getElementById(""+idCommonPrefix+"_alphabet_sort");
			//创建menu body:
			if(document.getElementById(""+idCommonPrefix+"_"+"alphabet_sort_menu_body")==null){
				var menuBody = document.createElement("div");
				menuBody.className="popup_dialog_v2_menu_body";
				menuBody.id=""+idCommonPrefix+"_"+"alphabet_sort_menu_body";
				var left=alphabetSortObj.offsetLeft;
				var top=alphabetSortObj.offsetTop+alphabetSortObj.offsetHeight;
				menuBody.setAttribute("style","display:none;position:absolute;left:"+left+"px;top:"+top+"px;");
				titleObj.appendChild(menuBody);
				var menuSon = document.createElement("div");
				menuSon.className="menu_row_container";
				menuSon.innerHTML=i18n('USER_ADMIN_ALPHABET_SORT');
				menuSon.setAttribute("style","padding-left:19px;display:block;height:30px;line-height:30px;width:119px");
				menuBody.appendChild(menuSon);
			};
			var menuBody=document.getElementById(""+idCommonPrefix+"_"+"alphabet_sort_menu_body");
			jq("#"+idCommonPrefix+"_alphabet_sort").on("click",function(){
				if(menuBody.style.display=="none"){
					menuBody.style.display="block";
					alphabetSortObj.style.borderRadius="16px 16px 0 0";
				}
				else{
					menuBody.style.display="none";
					alphabetSortObj.style.borderRadius="16px";
				}
			})
			jq("#"+idCommonPrefix+"_alphabet_sort_menu_body").children().each(function(index){
				jq(this).on("click",function(){
					menuBody.style.display="none";
					var sortStr="name-";
					self.drawUITable(self.containerId,sortStr);
					alphabetSortObj.style.borderRadius="8px";
				})
			})
				
			jq("#"+idCommonPrefix+"_"+"add_user_button").on("click",function(){
				 self.addEditType="add";
				 self.PopupDialogUserInfo.open()
			})
			jq("#"+idCommonPrefix+"_"+"export_button").on("click",function(){
				 //self.exportFile()
			})
			document.getElementById(""+idCommonPrefix+"_"+"import_button").onchange=function(){
				self.importFile(this.files)
			};
		},
		importFile:function(files){
			var jq=$$;
			var self=this;
		  if(files.length)
			{
				var file = files[0];
				var reader = new FileReader();
				reader.readAsText(file,"utf-8");
				reader.onload = function()
				{
					addLoadingLayer();
					var strRow=this.result.split("\r\n");
					var strRowlen=strRow.length;
					for(var i = 0; i < strRowlen; i++){
						var strRowArray=[];
						strRowArray=strRow[i].split(",");
						var dataObj= {
							"user_name" : ((strRowArray[0])?(strRowArray[0]):""),
							"nick_name": ((strRowArray[1])?(strRowArray[1]):""),
							"user_type": "3",
							"metadata": {
								Iot_Telephone:((strRowArray[2])?(strRowArray[2]):""),
								Iot_Email:((strRowArray[3])?(strRowArray[3]):"")
							}
						};
						dataObj.password="111111"; 
						var url_register_user = paasHost + "/aquapaas/rest/users/user";
						url_register_user+="?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
						jq.ajax({
							type  : "POST",
							async :false,
							url   : url_register_user,
							data: JSON.stringify(dataObj),
							headers: {
								'x-aqua-sign': getPaaS_x_aqua_sign("POST", url_register_user),
								'Content-Type': 'application/json',
								'Accept': 'application/json'
							},
							error:function(error){
							}
							}).done(function(){
						});
					};
					removeLoadingLayer();
					self.drawUITable(this.containerId);
				};
			}
		},
		exportFile:function(){
		  var serverRawDataUsers=this.serverRawDataUsers;
			var fileName="export.csv";
			var arrayA=[];
			for(var i = 0; i < serverRawDataUsers.length; i++){
				var serverRawDataUsersUnit=serverRawDataUsers[i];
				var arrayB=[];
				arrayB.push(serverRawDataUsersUnit.user_name,serverRawDataUsersUnit.nick_name,serverRawDataUsersUnit.metadata.Iot_Telephone,serverRawDataUsersUnit.metadata.Iot_Email);
				arrayA.push(arrayB)
			};
			this.exportToCSV(arrayA,fileName);
		},
	  exportToCSV:function(list, fileName){
		  //here
			addLoadingLayer();
			var file = list.join('\r\n');
			var filePath = my.aqua.xgxPath + '总公司/users/exportfiles/';
			var exportFile = new FileUpload({
				parentUri: filePath,
				forceCreate: true,
				fileName: fileName,
				fileType: 'csv',
				dataNotInBlob: true,
			});
			exportFile.setFileData(file);
			exportFile.displayFile = function(){
				exportFile.upload();
			};
			console.log(my.aqua);
			console.log(my.aqua.restRoot);
			tifAqua.setUp({
				accessKeyId: my.aqua.accessKeyId,
				secretAccessKey: my.aqua.secretAccessKey,
				host: my.aqua.host,
				restRoot: my.aqua.restRoot
			});
			var fileUrl = tifAqua.restRoot + filePath + fileName;
			console.log(fileUrl);
			//here
			var aquaUtil = new Aqua({
				accessKeyId: my.aqua.accessKeyId,
				secretAccessKey: my.aqua.secretAccessKey
			});
			var token = aquaUtil.getToken(fileUrl, 'GET');
			fileUrl += '?' + token;
			window.open(fileUrl);
			removeLoadingLayer();
		},
		openPopupDialogUserInfoCallback:function(){
			var jq=$$;
		  var title=i18n("USER_ADMIN_ADD_USER_INFO");
			var operationButton=i18n("USER_ADMIN_ADD");
			var operationButtonImgSrc='uiWidget/images/button_icon_add.png';
			switch(this.addEditType)
			{
				case "add":
					title=i18n("USER_ADMIN_ADD_USER_INFO");
					operationButton=i18n("USER_ADMIN_ADD");
					operationButtonImgSrc='uiWidget/images/button_icon_add.png';
					break;
				case "edit":
					title=i18n("USER_ADMIN_EDIT_USER_INFO");
					operationButton=i18n("USER_ADMIN_UPDATE");
					operationButtonImgSrc='uiWidget/images/button_icon_update.png';
					break;
				default:
					break;
			};
			document.getElementById("popup_add_edit_user_title").innerHTML=title;
			jq("#popup_add_edit_user_operation_button").css("backgroundImage","url("+operationButtonImgSrc+")")
			document.getElementById("popup_add_edit_user_operation_button_text").innerHTML=operationButton;
			this.openPopupDialogUserInfoCallbackBindEvent();
		},
		openPopupDialogDeleteUserCallback:function(){
			var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var nick_name=serverRawDataUsers.nick_name;
			var jq=$$;
			var self=this;
			
			switch(this.addEditType)
			{
				case "delete":
					this.alertSentenceA=i18n("USER_ADMIN_DELETE_CONFIRM1");
					this.alertSentenceB="\""+nick_name+"\""+i18n("USER_ADMIN_DELETE_CONFIRM2");
					jq("#popup_delete_user_operation_button").on("click",function(){
						self.deleteCurrentUser();
					});
					break;
				case "resetPassword":
					this.alertSentenceA=i18n("USER_ADMIN_DELETE_CONFIRM_RESET_PASSWORD");
					this.alertSentenceB="";
					jq("#popup_delete_user_operation_button").on("click",function(){
						self.resetUserPassword();
					});
					break;
				case "edit":
					title=i18n("USER_ADMIN_EDIT_USER_INFO");
					operationButton=i18n("USER_ADMIN_UPDATE");
					operationButtonImgSrc='uiWidget/images/button_icon_update.png';
					break;
				default:
					jq("#popup_delete_user_operation_button").on("click",function(){
						self.PopupDialogDeleteUser.close()
					});
					break;
			};
			jq("#popup_delete_user_confirm_first").text(this.alertSentenceA);
			jq("#popup_delete_user_confirm_second").text(this.alertSentenceB);
			jq("#popup_delete_user_cancel_button").on("click",function(){
				self.PopupDialogDeleteUser.close()
			});
		},
		resetUserPassword:function(){
			var jq=$$;
			var self=this;
			var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var user_name=encodeURIComponent(serverRawDataUsers.user_name);
		  var AquaPassData={
				 "password" : "111111"
		  }
			var url_update_user = paasHost+ "/aquapaas/rest" + "/users/password/"+user_name+"@default?user_id="+my.paas.user_id+"&access_token=" + my.paas.access_token+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString();
			jq.ajax({
					type: 'PUT',
					async: true,
					url: url_update_user,
					data:JSON.stringify(AquaPassData),
					headers: {
							'Content-Type': 'application/json',
							'Authorization': 'application/json',
							'x-third-party': 'aqua',
							'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url_update_user)
					}
			}).done(function(data){
				self.PopupDialogDeleteUser.close()
			});
		},
		deleteCurrentUser:function(){
			var jq=$$;
			var self=this;
			var serverRawDataUsers=this.serverRawDataUsers[this.rowIndex];
			var user_id=serverRawDataUsers.user_id;
		  var urlDeleteUser = paasHost + "/aquapaas/rest/users/user/";
      urlDeleteUser+=""+user_id+"?user_id="+my.paas.user_id+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";//目前只能自己编辑自己
			jq.ajax({
				type  : "DELETE",
				async :false,
				url   : urlDeleteUser,
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', urlDeleteUser),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				error:function(error){
				}
			}).done(function(){
			});
			self.list_table.refreshList();		
			self.PopupDialogDeleteUser.close();
		},
		openPopupDialogUserInfoCallbackBindEvent:function(){
			var jq=$$;
			var self=this;
			if(this.addEditType=="edit"){
			  var serverRawDataUsers=self.serverRawDataUsers[self.rowIndex];
				jq("#popup_add_edit_user_username").val(serverRawDataUsers.user_name);
				jq("#popup_add_edit_user_nickname").val(serverRawDataUsers.nick_name);
				jq("#popup_add_edit_user_contact_method").val(serverRawDataUsers.metadata.Iot_Telephone);
				jq("#popup_add_edit_user_mail").val(serverRawDataUsers.metadata.Iot_Email)
			}
			jq("#popup_add_edit_user_cancel_button").on("click",function(){
				self.PopupDialogUserInfo.close()
			});
			jq("#popup_add_edit_user_operation_button").on("click",function(){
				self.registerOrEditUser()
			})
		},
		registerOrEditUser:function(){
		  var jq=jQuery;
			var self=this;
		  var method=((this.addEditType=="add")?"POST":"PUT");
			switch(true)
			{
				case jq("#popup_add_edit_user_username").val()=="":
				  self.PopupDialogUserInfo.close();
					self.alertSentenceA=i18n("USER_ADMIN_PLEASE_INPUT")+i18n("USER_ADMIN_USERNAME");
					self.alertSentenceB="";
					self.PopupDialogDeleteUser.open();
					return;
					break;
				case jq("#popup_add_edit_user_nickname").val()=="":
				  self.alertSentenceA=i18n("USER_ADMIN_PLEASE_INPUT")+i18n("USER_ADMIN_NICKNAME");
					self.alertSentenceB="";
				  self.PopupDialogUserInfo.close();
					self.PopupDialogDeleteUser.open();
					return;
					break;
				case jq("#popup_add_edit_user_contact_method").val()=="":
				  self.alertSentenceA=i18n("USER_ADMIN_PLEASE_INPUT")+i18n("USER_ADMIN_CONTACT_METHOD");
					self.alertSentenceB="";
				  self.PopupDialogUserInfo.close();
					self.PopupDialogDeleteUser.open();
					return;
					break;
				default:
					break;
			};
		  var dataObj= {
				"user_name" : jq("#popup_add_edit_user_username").val()?jQuery("#popup_add_edit_user_username").val():"",
				"nick_name": jq("#popup_add_edit_user_nickname").val()?jQuery("#popup_add_edit_user_nickname").val():"",
				"user_type": "3",
				"metadata": {
				  Iot_Telephone:jq("#popup_add_edit_user_contact_method").val()?jq("#popup_add_edit_user_contact_method").val():"",
					Iot_Email:jq("#popup_add_edit_user_mail").val()?jq("#popup_add_edit_user_mail").val():""
				}
			};
			var url_register_user="";
			if(this.addEditType=="add"){
				dataObj.password="111111"; //mail:2019.1.17 16:23 fangli 重置的默认密码
				url_register_user = paasHost + "/aquapaas/rest/users/user";
			  url_register_user+="?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
			}
			else{
				var serverRawDataUsers=self.serverRawDataUsers[self.rowIndex];
			  var user_id=serverRawDataUsers.user_id;
				url_register_user = paasHost + "/aquapaas/rest/users/user/";
        url_register_user+=""+user_id+"?user_id="+my.paas.user_id+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";//目前只能自己编辑自己
			};
			jq.ajax({
				type  : method,
				async :false,
				url   : url_register_user,
				data: JSON.stringify(dataObj),
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url_register_user),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				error:function(error){
				}
			}).done(function(){
			});
			self.list_table.refreshList();		
			self.PopupDialogUserInfo.close();
		},
		drawUITable:function(containerId,sortStr){
			var jq=$$;
			var self=this;
			var idCommonPrefix=this.idCommonPrefix;
			var contentContainer="<div id=\""+idCommonPrefix+"_page_body_content_container\" class=\"page_body_content_container\"><div id=\""+idCommonPrefix+"_table_container\" class=\"page_body_table_container\"></div></div>";
			jq("#"+idCommonPrefix+"_page_body_content_container").remove();
			jq("#"+idCommonPrefix+"_"+"page_container").append(contentContainer);
			var titles_array=[i18n('USER_ADMIN_USERNAME'),i18n('USER_ADMIN_NICKNAME'),i18n('USER_ADMIN_CONTACT_METHOD'),i18n('USER_ADMIN_ALPHABET_MAIL'),i18n('USER_ADMIN_ALPHABET_OPERATION')];
			var titles_label_array = (titles_array.map(function(item){
				return {label:item};
			}));
			var list_row=14;
			var list_table = new NewStyledListVersionTwo({
			rows: list_row,
			columns: 5,
			container: jQuery("#"+idCommonPrefix+"_table_container"),
			titles: titles_label_array,
			listType: 1,
			data: [],
			styles: { borderColor: 'transparent',
				borderWidth: 1,
				titleHeight: 46,
				titleBg: '#f8f8f8',
				titleColor: '#666666',
				cellBg: 'white',
				evenBg: '#f8f8f8',
				cellColor: 'rgb(114,114,114)',
				footColor: 'rgb(121,121,121)',
				iconColor: 'rgb(93,161,192)',
				inputBorder: '1px solid rgb(203,203,203)',
				inputBg: 'white',
				columnsWidth: [0.165,0.17,0.245,0.189,0.226],
			}
		});
		this.list_table = list_table;
		this.list_table.getPageData = function(pageNumber){
			var listDatas=[];
			var listSelf = this;
			self.currPage=pageNumber-1;
			var start = (pageNumber - 1) * list_row;
			var end = pageNumber * list_row - 1;
			var query = '&start=' + start;
			query += '&end=' + end;
			var url_show_all_user = paasHost + "/aquapaas/rest/users/cdmi_query";
			url_show_all_user+="?access_token=" + my.paas.access_token + ""+query+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+""+"&user_id=" + my.paas.user_id+"";
	    if(typeof sortStr!="undefined"){
				url_show_all_user+=("&sort="+encodeURIComponent(sortStr))
			}
			var this_condition={
				"user_scope_specification": [{
					"user_type":"== 3"
				}]
			};			
			jQuery.ajax({
				type  : 'PUT',
				async :false,
				data: JSON.stringify(this_condition),
				url   : url_show_all_user,
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url_show_all_user),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				error:function(error){
				}
			}).done(function(data, status, xhr){
			  if(data&&data.users){
					self.serverRawDataUsers=data.users;
				  var dataUser=data.users;
					var totalCount = data.count;
					listSelf.onTotalCount(totalCount || 0);
					var dataLen=dataUser.length;
					for(var i = 0; i < dataLen; i++){
					  var userName=dataUser[i].user_name?dataUser[i].user_name:"";
						var userNickName=dataUser[i].nick_name?dataUser[i].nick_name:"";
						var contactMethod="";
						var email="";
						if(dataUser[i].metadata){
						  var dataMetadata=dataUser[i].metadata;
							contactMethod=dataMetadata.Iot_Telephone?dataMetadata.Iot_Telephone:"";
							email=dataMetadata.Iot_Email?dataMetadata.Iot_Email:"";
						}
						var styleStr="style=\"margin-left:13px;margin-right:13px;color:#27b2d5\"";
						listDatas.push([{
							"label": userName
						}, {
							"label": userNickName
						}, {
							"label": contactMethod
						}, {
							"label": email
						}, {
							"label": "<span name=\"resetPassword\" class=\"page_body_table_operation_button\" "+styleStr+">"+i18n('USER_ADMIN_RESET_PASSWORD')+"</span><span name=\"authorize\" class=\"page_body_table_operation_button\" "+styleStr+">"+i18n('USER_ADMIN_AUTHORIZE')+"</span><span name=\"edit\" class=\"page_body_table_operation_button page_body_table_operation_edit\" "+styleStr+">"+i18n('USER_ADMIN_EDIT')+"</span><span name=\"delete\" class=\"page_body_table_operation_button page_body_table_operation_delete\" "+styleStr+">"+i18n('USER_ADMIN_DELETE')+"</span>"		
						}])				
          }
				}
			})
		return listDatas
		};
   this.list_table.create();
	 this.bindEventBody();
	},
	bindEventBody:function(){
	  var self=this;
		var jq=$$;
		jq("#"+this.idCommonPrefix+"_table_container").on("click",".page_body_table_operation_button",function(){
			self.rowIndex=jq("#"+self.idCommonPrefix+"_table_container tr").index(jq(this).closest("tr"));
			self.addEditType=jq(this).attr("name");
			self.list_table.currPage=self.currPage;
			switch(self.addEditType)
			{
				case "edit":
					self.PopupDialogUserInfo.open();
					break;
				case "delete":
					self.PopupDialogDeleteUser.open();
					break;
				case "resetPassword":
					self.PopupDialogDeleteUser.open();
					break;
				case "authorize":
					self.PopupDialogAuthorizeUser.open();
					break;
				default:
					break;
			};
		});
	},
	viewInstallInfo:function(index){
		 this.clickRowIndex=index;
		 this.PopupDialogViewInstallInfo.open()
	},
	viewFactoryInfo:function(index){
		this.clickRowIndex=index;
		this.PopupDialogViewFactoryInfo.open()
	},
	popupDialogViewInstallInfoCallback:function(){
		var obj={
			thingdefid:rebengThingDefID,
		  namespace:rebengNamespace
		};
		var requestAlarmData = new AlarmCommonAPI(obj);
		var jq=$$;
		var self=this;
		var dataThingHistory=this.storedFormatData[rebengThingDefID][this.clickRowIndex];
		var ext_id=dataThingHistory.currentExtID;
		var namespace=dataThingHistory.currentNamespace;
		var url=paasHost+"/aquapaas/rest/thing/";
		url+=encodeURIComponent(ext_id);
		url+="?namespace="+encodeURIComponent(namespace);
		url=url+"&user_id=" + my.paas.user_id;
		url=url+"&access_token=" + my.paas.access_token;
		url=url+"&app_key=" + paasAppKey;
		url=url+"&timestamp=" + new Date().toISOString();
		jQuery.ajax({
				type  : 'GET',
				async :true,
				url   : url,
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign('GET', url),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				error:function(error){
				}
			}).done(function(data, status, xhr){
				var installDateReBeng="";
				if(data.metadata){
				  var rebengThintMetadata=data.metadata;
					var installDateReBeng=rebengThintMetadata.installDate?rebengThintMetadata.installDate:"";
					document.getElementById("heat_pump_alarm_software_version").value=rebengThintMetadata.softwareVersion?rebengThintMetadata.softwareVersion:"";
					document.getElementById("heat_pump_alarm_protocol_version").value=rebengThintMetadata.protocolVersion?rebengThintMetadata.protocolVersion:"";
					document.getElementById("heat_pump_alarm_heat_pump_code_devID").value=rebengThintMetadata.devID?rebengThintMetadata.devID:"";
					document.getElementById("heat_pump_alarm_popup_region").value=dataThingHistory.region?dataThingHistory.region:"";
				}
			  if(data&&data.parent_ext_id){
					var parent_ext_id=data.parent_ext_id;
					var url=paasHost+"/aquapaas/rest/thing/";
					url+=encodeURIComponent(parent_ext_id);
					url+="?namespace="+encodeURIComponent(namespace);
					url=url+"&user_id=" + my.paas.user_id;
					url=url+"&access_token=" + my.paas.access_token;
					url=url+"&app_key=" + paasAppKey;
					url=url+"&timestamp=" + new Date().toISOString();
					jQuery.ajax({
						type  : 'GET',
						async :true,
						url   : url,
						headers: {
							'x-aqua-sign': getPaaS_x_aqua_sign('GET', url),
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						},
						error:function(error){
						}
					}).done(function(data, status, xhr){
						if(data){
							var returnDataGetThingDTU=data;
							if(returnDataGetThingDTU.metadata){
								var returnDataGetThingDTUMetadata=returnDataGetThingDTU.metadata;
								document.getElementById("heat_pump_alarm_popup_username").value=(returnDataGetThingDTUMetadata.userName?returnDataGetThingDTUMetadata.userName:"");
								document.getElementById("heat_pump_alarm_popup_phone").value=(returnDataGetThingDTUMetadata.userPhone?returnDataGetThingDTUMetadata.userPhone:"");
								document.getElementById("heat_pump_alarm_popup_location").value=(returnDataGetThingDTUMetadata.coordinate?returnDataGetThingDTUMetadata.coordinate:"");
								document.getElementById("heat_pump_alarm_popup_install_address").value=(returnDataGetThingDTUMetadata.address?returnDataGetThingDTUMetadata.address:"");
								if(installDateReBeng==""){
									if(returnDataGetThingDTUMetadata.installDate){//mail 2019.1.9:泵安装时间请优先使用 热泵安装时间 字段, 如果接口未提供该字段, 或者字段值为空, 则再用DTU的安装时间
										installDateReBeng=returnDataGetThingDTUMetadata.installDate;
									};
								}
								if(installDateReBeng!=""){
									document.getElementById("heat_pump_alarm_popup_install_time").value=requestAlarmData.convertUTCTimeToLocalTime(installDateReBeng,"typeB");
								}
							};
						}
					})	
			}
		})
		jq("#heat_pump_alarm_close").on("click",function(){
			self.PopupDialogViewInstallInfo.close()
		});
	},
	popupDialogViewFactoryInfoCallback:function(){
		var jq=$$;
		var self=this;
		var data=this.storedFormatData[rebengThingDefID][this.clickRowIndex];
		document.getElementById("heat_pump_alarm_heat_pump_factory_name").value=data.manufacture;
		document.getElementById("heat_pump_alarm_heat_pump_factory_contact").value=data.manufactureContact;
		document.getElementById("heat_pump_alarm_heat_pump_factory_phone").value=data.manufacturePhone;
		if(this.singleThingDefObj.name){
			document.getElementById("heat_pump_alarm_heat_pump_equip_type").value=this.singleThingDefObj.name;
		};
		jq("#heat_pump_alarm_heat_pump_factory_close").on("click",function(){
			self.PopupDialogViewFactoryInfo.close()
		});
	},
	openPopupDialogAuthorizeUser:function(){
		this.PopupDialogAuthorizeUser.open()
	}
 };
	return userAdmin;
});
